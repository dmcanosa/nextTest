'use server';

import { z } from 'zod';
//import { sql } from '@vercel/postgres';
import { neon } from '@neondatabase/serverless';
import { revalidatePath } from 'next/cache';
import { signUp, signIn, getUser } from '@/auth';
import { AuthError/*, User*/ } from 'next-auth';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { User } from 'app/lib/definitions';
//import { createSession } from './session';
 
const FormSchema = z.object({
  id: z.string(),
  //customerId: z.string({ invalid_type_error: 'Please select a customer.' }),
  /*amount: z.coerce
            .number()
            .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], { invalid_type_error: 'Please select an Signature status.' }),
  */
  data: z.string(),
  date: z.string(),
});
 
const CreateSignature = FormSchema.omit({ id: true, date: true });

export type State = {
  errors?: {
    //customerId?: string[];
    //amount?: string[];
    data?: string[];
    //status?: string[];
  };
  message?: string | null;
};

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
          
  try {
    console.log('authenticate!!!', formData);
    const cookieStore = await cookies();
    cookieStore.set('user_email', formData.get('email').valueOf().toString());
    console.log('cookie: ', cookieStore.get('user_email'));  
    //en flow de register pasa por aca pero no hace bien el signin
    const user = await signIn('credentials', formData);
    console.log('222authenticate!!!', user);
    //const user = await login(formData);
    console.log('user:',user);
    if(user){
      
      //createSession(user.id);
      console.log('---->logged in');
      //redirect('/dashboard');  
    }
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
    const data = await signUp(formData);
    console.log('data signup: ',data);
    //console.log('data: ',data);
    //if(data) redirect('/dashboard');
    if(data){ //&& (data && data[0] && !data[0].errors)){
      if(data[0] && data[0].errors){
        console.log('data signup else: ',data);
      }else{
        await authenticate('credentials', formData);
      }  
    }else{
      console.log('data signup else: ',data);
    
    }  
    //await signIn('credentials', formData);
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

export async function createSignature(prevState: State, formData: FormData) {
  const validatedFields = CreateSignature.safeParse({
    //amount: formData.get('amount'),
    data: formData.get('canvasString'),
    //status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Signature.',
    };
  }

  //const { signature } = validatedFields.data;
  const date = new Date().toISOString().split('T')[0];
  //console.log('on actions: '+signature);

  const cookieStore = await cookies()
  //console.log(cookieStore.get('user_email').value);
  const userEmail:string = cookieStore.get('user_email').value;
  
  try {
    const user:User = await getUser(userEmail);  
    if(user){
      const sql = neon(`${process.env.DATABASE_URL}`);
      await sql`
        INSERT INTO signatures (data, created, active, user_id)
        VALUES ( ${validatedFields.data.data}, ${date}, true, ${user.id})
      `;
    }
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Signature.'+error,
    };
  }

  /*try {
    await sql`
      INSERT INTO signatures (user_id, signature_data)
      VALUES (${customerId}, ${signature})
    `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Signature.'+error,
    };
  }*/

  revalidatePath('/dashboard/signatures');
  redirect('/dashboard/signatures');
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
  //throw new Error('Failed to Delete Signature');

  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    await sql`DELETE FROM signatures WHERE id = ${id}`;
    revalidatePath('/dashboard/signatures');
    return { message: 'Deleted signature.' };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete signature.'+error };
  }
}