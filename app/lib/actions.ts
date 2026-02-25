'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { fetchDocumentById/*, saveDataToFile*/ } from './data';
import { createClient } from 'app/lib/supabase/server';
import { parseSupabaseError, logError } from './error-handler';
import { getCurrentUserId } from './supabase/auth-service';
import { AES, CBC, Pkcs7, PBKDF2, WordArray, Utf8 } from 'crypto-es';
import { Base64 } from 'js-base64';

const FormSchema = z.object({
  id: z.string(),
  data: z.string(),
});

const docFormSchema = z.object({
  id: z.string(),
  template_name: z.string(),
  signature_id: z.string(),
  //user_id: z.string(),
  template_b64: z.string(),
  signed_b64: z.string(),
});

const CreateSignature = FormSchema.omit({ id: true });
const CreateDocument = docFormSchema.omit({ id: true });

//const crypto = new NextCrypto(process.env.SECRET_SIGNATURE_KEY);
const secretSigKey = process.env.SECRET_SIGNATURE_KEY as string;
const saltKey = process.env.SECRET_SIGNATURE_KEY_SALT as string;
const iv = process.env.SECRET_SIGNATURE_KEY_IV as string;

const salt = Utf8.parse(saltKey);
const key256 = PBKDF2(secretSigKey, salt, { keySize: 256/32 });
const iv_wa = Utf8.parse(iv);

export type State = {
  errors?: {
    data?: string[];
  };
  message?: string | null;
};

export type docState = {
  errors?: {
    template_b64?: string[];
    signed_b64?: string[];
    signature_id?: string[];
    template_name?: string[];
  };
  message?: string | null;
};

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    const supabase = await createClient()
    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    }
    console.log('login data: ',data)
      
    //const { error } = await supabase.auth.signInWithPassword(data)
    const res = await supabase.auth.signInWithPassword(data)
    console.log(res);
    if (res.error) {
      console.log('signup error: ',res.error);
      redirect('/error')
    }
    revalidatePath('/dashboard', 'layout')
    redirect('/dashboard')
  } catch (error) {
    logError(error, 'authenticate');
    const appError = parseSupabaseError(error);
    return appError.message;
  }
}

export async function register(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    //console.log('formdata: ',formData);
    const supabase = await createClient();
      
    const dataAuth = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      name: formData.get('name') as string,
      
    }
    console.log('signup data: ',dataAuth)
    //const { error } = await supabase.auth.signUp(dataAuth)
    const res = await supabase.auth.signUp(dataAuth);
    console.log(res);
    if (res.error) {
      console.log('signup error: ',res.error);
      redirect('/error');
    }
    // Only store non-sensitive user data - passwords are handled by Supabase Auth
    const res2 = await supabase
      .from('users')
      .insert({ id:res.data.user.id, name: dataAuth.name, email: dataAuth.email })
    
    console.log(res2.error);
    revalidatePath('/dashboard', 'layout');
    redirect('/dashboard');
  } catch (error) {
    logError(error, 'register');
    const appError = parseSupabaseError(error);
    return appError.message;
  }
}

export async function createSignature(prevState: State, formData: FormData, needsRedirect: boolean = true, userId:string = '') {
  const validatedFields = CreateSignature.safeParse({
    data: formData.get('canvasString'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Signature.',
    };
  }
  
  try {
    const userId = await getCurrentUserId();
  

  /*const salt = WordArray.random(128/8);
  const key256 = PBKDF2(secretSigKey, salt, { keySize: 256/32 });
  const iv = WordArray.random(128/8);*/
  
  //console.log('SALT: ', salt.toString());
  const encryptedSig = AES.encrypt(
    validatedFields.data.data, 
    key256, 
    { iv: iv_wa, 
      mode: CBC, 
      padding: Pkcs7 
    }
  ).toString();

  //const encryptedSig = validatedFields.data.data;

  //const encryptedSig = AES.encrypt(validatedFields.data.data, secretSigKey).toString();
      
  //const signature = await crypto.encrypt(validatedFields.data.data);
  
  // userId already set from getCurrentUserId or parameter  
  try {
    //const user:User = await getUserById(userId);  
    //if(user){
      
    const { error } = await supabase
      .from('signatures')
      .update({ active: false })
      .eq('user_id', userId)
    
    console.log(error);
    
    (async function () {
      const { error } = await supabase
        .from('signatures')
        .insert({ data: encryptedSig, active: true, user_id: userId })
      
      console.log(error);  
    })();
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Signature.'+error,
    };
  }

  if(needsRedirect){
    revalidatePath('/dashboard/signatures');
    redirect('/dashboard/signatures');
  }
}

export async function deleteSignature(id: string) {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase
      .from('signatures')
      .update({ active: false })
      .eq('id', id)
    
    console.log(error);
    
    revalidatePath('/dashboard/signatures');
    return { message: 'Deleted signature.' };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete signature.'+error };
  }
}

export async function createDocument(prevState: docState, formData: FormData, needsRedirect: boolean = true, userId:string = '') {
  const validatedFields = CreateDocument.safeParse({
    signature_id: formData.get('signature_id'),
    template_name: formData.get('template_name'),
    template_b64: formData.get('template_b64'),
    signed_b64: formData.get('signed_b64'),
  });

  console.log(userId);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create document.',
    };
  }

  const template_name = validatedFields.data.template_name;
  const signature_id = validatedFields.data.signature_id;
  const template_b64 = validatedFields.data.template_b64;
  const signed_b64 = validatedFields.data.signed_b64;
  
  /*if(userId == '')
    userId = decrypted;*/  
  try {
    const supabase = await createClient()
    const user = await supabase.auth.getUser();
    const userId = user.data.user.id as string;

    /*const { error } = await supabase
      .from('signatures')
      .insert({ data: signature, active: true, user_id: userId })*/
        
    const { error } = await supabase
      .from('documents')
      .insert({ 
        template_name: template_name,  
        template_data: template_b64,  
        signed_document: signed_b64,  
        signed: true,  
        signature_id: signature_id,  
        user_id: userId,
        active: true,  
        //date_signed: NOW(),  
        
      });
         
    console.log(error);  
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create document.'+error,
    };
  }

  if(needsRedirect){
    revalidatePath('/dashboard/documents');
    redirect('/dashboard/documents');
  }
}

export async function downloadDocument(id: string) {
  'use server';

  console.log('downloadDOC: ',id);
  //throw new Error('Failed to Delete Signature');
  
  const doc = await fetchDocumentById(id);
  console.log('doc: ',doc);
  const report = Buffer.from(doc.signed_document, 'base64');
  try {
    saveDataToFile(
      report,
      'report.docx',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );

    revalidatePath('/dashboard/documents');
    return { message: 'Deleted Document.' };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete document.'+error };
  }
}


export async function saveDataToFile(data, fileName, mimeType){
  'use client';

  console.log('saveeee');
  const blob = new Blob([data], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  downloadURL(url, fileName);
  setTimeout(() => {
    window.URL.revokeObjectURL(url);
  }, 1000);
}

const downloadURL = (data, fileName) => {
  const a = document.createElement('a');
  a.href = data;
  a.download = fileName;
  document.body.appendChild(a);
  //a.style = 'display: none';
  a.click();
  a.remove();
};

export async function deleteDocument(id: string) {
  //'use server';

  //throw new Error('Failed to Delete Signature');
  //console.log('del doc actions:',id);

  try {
    const supabase = await createClient();
    
    const { error } = await supabase
      .from('documents')
      .update({ active: false })
      .eq('id', id)
    
    console.log(error);
    
    revalidatePath('/dashboard/documents');
    return { message: 'Deleted Document.' };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete document.'+error };
  }
}