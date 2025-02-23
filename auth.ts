import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import { neon } from '@neondatabase/serverless';
//import { sql } from '@vercel/postgres';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
import { SignupFormSchema, LoginFormSchema, FormState } from '@/app/lib/definitions';
//import { createSession } from './app/lib/session';

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        console.log(credentials);
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);
          console.log(parsedCredentials);
        
        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          console.log('user auth.js:',user);
          if (!user) return null;
          const passwordsMatch = await bcrypt.compare(password, user.password);
          console.log(passwordsMatch);
          
          if (passwordsMatch){
            //Window.localStorage.setItem('user_email', user.email); 
            return user;
          }
        }
        
        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
})

export async function getUser(email: string): Promise<User | undefined> {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const res = await sql`SELECT * FROM users WHERE email=${email}`;
    console.log('res getuser: ',res);
    const user = <User>{};
    if(res[0]){
      user.id = res[0].id;
      user.name = res[0].name;
      user.email = res[0].email;
      user.password = res[0].password;
      return user;
    }else{
      return null;
    }
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export async function signUp(formData:FormData){
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  })
 
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }
 
  const { name, email, password } = validatedFields.data
  const hashedPassword = await bcrypt.hash(password, 10)
  //console.log('getuser: ',await getUser(email));
  const user = await getUser(email);
  if(!user){
    try {
      const sql = neon(`${process.env.DATABASE_URL}`);
      console.log('dburl: ',process.env.DATABASE_URL);
      const newUserRes = await sql`INSERT INTO users (name, email, password) 
        values (${name}, ${email}, ${hashedPassword})`;
      console.log('data SIGNUP: ',newUserRes);
      //console.log('errors: ',newUserRes[0]);    
      
      const dbuser = await getUser(email);
      console.log('dbuser: ',dbuser);
      //if (/*newUserRes.length > 0 &&*/ newUserRes['errors']){
      //  console.log('errors!');    
      //}
      if(!dbuser){
        
        
        console.log('An error occurred while creating your account.');
        return null;
      }else{
        /*var resUser = <User>{};
        resUser.id = newUserRes[0].id;
        resUser.name = newUserRes[0].name;
        resUser.email = newUserRes[0].email;
        resUser.password = newUserRes[0].password;
        const data = user;
        return data;*/
        return dbuser;
      }

    } catch (error) {
      console.error('Failed to fetch user:', error);
      throw new Error('Failed to fetch user.');
    }
  }
}
;