import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
//import { authConfig } from './auth.config';
import { z } from 'zod';
import { neon } from '@neondatabase/serverless';
//import { sql } from '@vercel/postgres';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
import { SignupFormSchema } from '@/app/lib/definitions';
import { cookies } from 'next/headers';
import NextCrypto from 'next-crypto';

//import { createSession } from './app/lib/session';
/*
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    GoogleProvider({
      //clientId: process.env.GOOGLE_CLIENT_ID,
      //clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        console.log(credentials);
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);
          console.log(parsedCredentials);
        
        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUserByEmail(email);
          console.log('user auth.js:',user);
          if (!user) return null;
          //if (!user) return 'null';
          const passwordsMatch = await bcrypt.compare(password, user.password);
          console.log('passwords match?: ',passwordsMatch);
          
          if (passwordsMatch){
            const cookieStore = await cookies();
            const crypto = new NextCrypto(process.env.SECRET_SIGNATURE_KEY);
            const encrypted = await crypto.encrypt(user.id);
            console.log('user_id: ',user.id);
            cookieStore.set('user_id', encrypted);
            
            return user;
          }
        }
        
        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
  debug: true,
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (user){
        console.log('callback signin user?: ', user);
        console.log('callback signin account?: ', account);
        console.log('callback signin profile?: ', profile);
        console.log('callback signin email?: ', email);
        console.log('callback signin credentials?: ', credentials);
        
        return true;
      }else{
        console.log('callback signin user FALSE');
        return false;
      } 

    },
  },
})
*/
/*
export async function getUserByEmail(email: string): Promise<User | undefined> {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const res = await sql`SELECT * FROM users WHERE email=${email} LIMIT 1`;
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

export async function getUserById(id: string): Promise<User | undefined> {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const res = await sql`SELECT * FROM users WHERE id=${id} LIMIT 1`;
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
*/
/*
export async function signUp(formData:FormData){
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    password2: formData.get('password2'),
  })
 
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }
 
  const { name, email, password } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await getUserByEmail(email);
  console.log('user on signup: ',user);
  if(!user){
    try {
      const sql = neon(`${process.env.DATABASE_URL}`);
      console.log('dburl: ',process.env.DATABASE_URL);
      const newUserRes = await sql`INSERT INTO users (name, email, password, created) 
        values (${name}, ${email}, ${hashedPassword}, NOW())`;
      console.log('data SIGNUP: ',newUserRes);
      //console.log('errors: ',newUserRes[0]);    
      const dbuser = await getUserByEmail(email);
      console.log('dbuser: ',dbuser);
      //if (/*newUserRes.length > 0 &&*//* newUserRes['errors']){
      //  console.log('errors!');    
      //}
      if(!dbuser){
        console.log('An error occurred while creating your account.');
        return null;
      }else{
        return dbuser;
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
      throw new Error('Failed to fetch user.');
    }
  }else{
    console.log('Mail is already registered');
    return null;
    //throw new Error('Mail is already registered');
  }
}*/
;