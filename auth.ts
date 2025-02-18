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
          
          if (passwordsMatch) return user;
        }
        
        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
})

async function getUser(email: string): Promise<User | undefined> {
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
      const newUserRes = await sql`INSERT INTO users (name, email, password) 
        values (${name}, ${email}, ${hashedPassword})`;
      if (!newUserRes) {
        console.log('An error occurred while creating your account.');
      }
      const user = <User>{};
      user.id = newUserRes[0].id;
      user.name = newUserRes[0].name;
      user.email = newUserRes[0].email;
      user.password = newUserRes[0].password;
      const data = user;
      return data;
    } catch (error) {
      console.error('Failed to fetch user:', error);
      throw new Error('Failed to fetch user.');
    }
  }
}

/*export async function login(formData:FormData){
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })
  console.log('validatedFields: ',validatedFields);
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }
 
  const { email, password } = validatedFields.data
  const hashedPassword = await bcrypt.hash(password, 10)
  //console.log('getuser: ',await getUser(email));
  const user = await getUser(email);
  if(user){
    //await createSession(user.id);
    return user;  
  }
}*/

/* PG
import NextAuth from "next-auth"
import PostgresAdapter from "@auth/pg-adapter"
import { Pool } from "pg"
 
const pool = new Pool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})
 
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PostgresAdapter(pool),
  providers: [],
})
*/

/* NEON VERCEL
import NextAuth from "next-auth"
import PostgresAdapter from "@auth/pg-adapter"
import { Pool } from "@neondatabase/serverless"
 
// *DO NOT* create a `Pool` here, outside the request handler.
// Neon's Postgres cannot keep a pool alive between requests.
 
export const { handlers, auth, signIn, signOut } = NextAuth(() => {
  // Create a `Pool` inside the request handler.
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  return {
    adapter: PostgresAdapter(pool),
    providers: [],
  }
})
*/

;