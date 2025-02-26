import { neon } from '@neondatabase/serverless';
import { cookies } from 'next/headers';
import { User } from 'app/lib/definitions';
import { getUser } from '@/auth';
import NextCrypto from 'next-crypto';
import { getSession } from './session';

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredSignatures(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  console.log(query);
  try {
    const cookieStore = await cookies();

    const crypto = new NextCrypto(process.env.SECRET_SIGNATURE_KEY);
    const decrypted = await crypto.decrypt(cookieStore.get('user_email').value);

    //const userEmail:string = cookieStore.get('user_email').value;
    const userEmail:string = decrypted;
    const user:User = await getUser(userEmail);  
    
    const sessionUser = await getSession();
    console.log('session user: ', sessionUser);  

    const sql = neon(`${process.env.DATABASE_URL}`);
    const Signatures = await sql`
      SELECT data, active, DATE(created) as created
      FROM signatures WHERE user_id = ${user.id}
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return Signatures;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch Signatures.');
  }
}

export async function fetchSignaturesPages(query: string) {
  try {
    console.log(query);
    const cookieStore = await cookies()
    const crypto = new NextCrypto(process.env.SECRET_SIGNATURE_KEY);
    const decrypted = await crypto.decrypt(cookieStore.get('user_email').value);

    //const userEmail:string = cookieStore.get('user_email').value;
    const userEmail:string = decrypted;
    
    //const userEmail:string = cookieStore.get('user_email').value;
    const user:User = await getUser(userEmail);  
    
    const sql = neon(`${process.env.DATABASE_URL}`);
    const count = await sql`SELECT COUNT(*)
      FROM signatures WHERE user_id = ${user.id}
    `;  
    
    const totalPages = Math.ceil(Number(count[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of Signatures.');
  }
}

export async function fetchSignatureById(id: string) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const data = await sql`
      SELECT *
      FROM Signatures
      WHERE Signatures.id = ${id};
    `;

    const Signature = data.map((Signature) => ({
      ...Signature,
    }));

    console.log(Signature); // Signature is an empty array []
    //return Signature[0];
    return data[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch Signature.');
  }
}

export async function fetchUsersAndTotalSignatures(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  console.log(query);
  try {
    //const cookieStore = await cookies();

    //const crypto = new NextCrypto(process.env.SECRET_SIGNATURE_KEY);
    //const decrypted = await crypto.decrypt(cookieStore.get('user_email').value);

    //const userEmail:string = cookieStore.get('user_email').value;
    //const userEmail:string = decrypted;
    //const user:User = await getUser(userEmail);  
    const sql = neon(`${process.env.DATABASE_URL}`);
    const Users = await sql`
      SELECT COUNT(*) as totalSignatures, user_id, u.name, u.email 
      FROM users AS u INNER JOIN signatures AS s ON user_id = u.id 
      GROUP BY s.user_id, u.name, u.email
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return Users;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch Signatures.');
  }
}
