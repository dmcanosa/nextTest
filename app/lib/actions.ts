'use server';

import { z } from 'zod';
//import { sql } from '@vercel/postgres';
import { neon } from '@neondatabase/serverless';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { /*signUp, /*signIn,*/ getUserById} from '@/auth';
import { AuthError/*, User*/ } from 'next-auth';
import { cookies } from 'next/headers';
import { User } from 'app/lib/definitions';
import NextCrypto from 'next-crypto';
import { fetchDocumentById/*, saveDataToFile*/ } from './data';
//import { fetchSignatureByUserId } from '@/app/lib/data';
//import { Signature/*, User*/ } from 'app/lib/definitions';
//import { getUser } from '@/auth';
import { createClient } from 'app/lib/supabase/server';

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
const crypto = new NextCrypto(process.env.SECRET_SIGNATURE_KEY);
    
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
      
    const { error } = await supabase.auth.signInWithPassword(data)
    if (error) {
      console.log('signup error: ',error);
      redirect('/error')
    }
    revalidatePath('/dashboard', 'layout')
    redirect('/dashboard')
    
    //console.log('authenticate!!!', formData);
    //en flow de register pasa por aca pero no hace bien el signin
    
    //next auth flow
    //const user = await signIn('credentials', formData);
    //next auth flow



    /*console.log('222authenticate!!!', user);
    if(user){
      console.log('---->logged in', user);
      //redirect('/dashboard');  
    }*/
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

export async function register(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    //console.log('formdata: ',formData);
    const supabase = await createClient();
    
    //nextauth flow
    //const data:User | { errors: { email?: string[]; name?: string[]; password?: string[]; password2?: string[]; }} = await signUp(formData);
    //nextauth flow
    
    //console.log('data signup register: ',data);
    //store user ID
    
    /*if(data && data['errors']){
      return Object.values(data['errors'])[0][0];
    }else if(!data){
      return ['Mail is already registered'];
    }else{*/  
      /*const cookieStore = await cookies();
      const encrypted = await crypto.encrypt((data as User).id);
      console.log('user_id: ',data['id']);
      cookieStore.set('user_id', encrypted);
      console.log('errors else:');*/
      
      const dataAuth = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
      }
      console.log('signup data: ',dataAuth)
      const { error } = await supabase.auth.signUp(dataAuth)
      if (error) {
        console.log('signup error: ',error);
        redirect('/error');
      }
      revalidatePath('/dashboard', 'layout');
      redirect('/dashboard');

      //next auth flow
      //await authenticate('credentials', formData);
    //}  
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
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
  
  const cookieStore = await cookies();
  const decrypted = await crypto.decrypt(cookieStore.get('user_id').value);
  const signature = await crypto.encrypt(validatedFields.data.data);
  if(userId == '')
    userId = decrypted;  
  try {
    const user:User = await getUserById(userId);  
    if(user){
      const sql = neon(`${process.env.DATABASE_URL}`);
      await sql`
        UPDATE signatures 
          SET active = false 
          WHERE user_id = ${userId}
          AND active = true
      `;
      await sql`
        INSERT INTO signatures (data, created, active, user_id)
        VALUES (${signature}, NOW(), true, ${userId})
      `;
    }
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

/*const UpdateSignature = FormSchema.omit({ id: true, date: true });
 
export async function updateSignature(id: string, formData: FormData) {
  const { amount, status } = UpdateSignature.parse({
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
 
  const amountInCents = amount * 100;
  
  //console.log("UPDATE signatures SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status} WHERE id = ${id}");

  try {
    await sql`
        UPDATE signatures
        SET amount = ${amountInCents}, status = ${status}
        WHERE id = ${id}
      `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Signature.'+error };
  }
 
  revalidatePath('/dashboard/signatures');
  redirect('/dashboard/signatures');
}*/

export async function deleteSignature(id: string) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    //await sql`DELETE FROM signatures WHERE id = ${id}`;
    await sql`UPDATE signatures SET active = false WHERE id = ${id}`;
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

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create document.',
    };
  }

  const cookieStore = await cookies()
  const decrypted = await crypto.decrypt(cookieStore.get('user_id').value);
  const template_name = validatedFields.data.template_name;
  const signature_id = validatedFields.data.signature_id;
  const template_b64 = validatedFields.data.template_b64;
  const signed_b64 = validatedFields.data.signed_b64;
  
  if(userId == '')
    userId = decrypted;  
  try {
    const user:User = await getUserById(userId);  
    if(user){
      const sql = neon(`${process.env.DATABASE_URL}`);
      await sql`
        INSERT INTO documents (template_name, template_data, signed_document, signed, signature_id, user_id, date_signed)
        VALUES (${template_name}, ${template_b64}, ${signed_b64}, true, ${signature_id}, ${userId}, NOW())
      `;
    }
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
  //const signature:Signature = await fetchSignatureByUserId(doc.user_id); 
  //const decryptedSig:string = await crypto.decrypt(signature.data);


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
    const sql = neon(`${process.env.DATABASE_URL}`);
    //await sql`DELETE FROM signatures WHERE id = ${id}`;
    await sql`UPDATE documents SET active = false WHERE id = ${id}`; //LIMIT 1`;
    revalidatePath('/dashboard/documents');
    return { message: 'Deleted Document.' };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete document.'+error };
  }
}