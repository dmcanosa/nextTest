import { neon } from '@neondatabase/serverless';
import { cookies } from 'next/headers';
import { Document, Signature/*, User*/ } from 'app/lib/definitions';
//import { getUser } from '@/auth';
import NextCrypto from 'next-crypto';
//import { getSession } from './session';
import { createClient } from 'app/lib/supabase/server';

const ITEMS_PER_PAGE = 5;
const crypto = new NextCrypto(process.env.SECRET_SIGNATURE_KEY);

export async function fetchFilteredSignatures(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  console.log(query, offset);
  console.log('offset: ', offset);
  
  try {
    const supabase = await createClient()
    const user = await supabase.auth.getUser();
    const userId = user.data.user.id as string;

    const { data, error } = await supabase
      .from('signatures')
      .select()
      .eq('user_id', userId)
      .limit(ITEMS_PER_PAGE)
      .range(offset, (offset + ITEMS_PER_PAGE - 1))
      
    console.log(error);
    console.log('range: ',offset+' '+(offset + ITEMS_PER_PAGE - 1));
    //console.log('data on fetch sigs: ',data);
      

    //const cookieStore = await cookies();
    //console.log('cookie: ',cookieStore.get('user_id').value);
    //const decrypted = await crypto.decrypt(cookieStore.get('user_id').value);
    //console.log('decrypted cookie: ',decrypted);
    
    /*const sql = neon(`${process.env.DATABASE_URL}`);
    const Signatures = await sql`
      SELECT data, active, DATE(created) as created
      FROM signatures WHERE user_id = ${decrypted}
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;*/
    return data;
    //return Signatures;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch Signatures.');
  }
}

export async function fetchSignaturesById(id: string) {
  //const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  //console.log(query);
  try {
    //const cookieStore = await cookies();
    //const decrypted = await crypto.decrypt(cookieStore.get('user_id').value);
    
    const sql = neon(`${process.env.DATABASE_URL}`);
    const Signatures = await sql`
      SELECT data, active, DATE(created) as created
      FROM signatures WHERE user_id = ${id}
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
    const supabase = await createClient()
    const user = await supabase.auth.getUser();
    const userId = user.data.user.id as string;

    const { count, error } = await supabase
      .from('signatures')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      
    console.log(error);
    console.log('data on fetch sigs count: ',count);
    

    
    
    /*const cookieStore = await cookies()
    //const crypto = new NextCrypto(process.env.SECRET_SIGNATURE_KEY);
    const decrypted = await crypto.decrypt(cookieStore.get('user_id').value);
    const sql = neon(`${process.env.DATABASE_URL}`);
    const count = await sql`SELECT COUNT(*)
      FROM signatures WHERE user_id = ${decrypted}
    `;*/  
    const totalPages = Math.ceil(Number(count) / ITEMS_PER_PAGE);
    console.log('total: ',totalPages);
    
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

    /*const Signature = data.map((Signature) => ({
      ...Signature,
    }));*/

    //console.log(Signature); // Signature is an empty array []
    //return Signature[0];
    return data[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch Signature.');
  }
}

/*export async function fetchUsersAndTotalSignatures(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  console.log(query);
  try {
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
}*/

const DOCUMENTS_PER_PAGE = 5;
export async function fetchFilteredDocuments(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * DOCUMENTS_PER_PAGE;
  console.log(query);
  try {
    const cookieStore = await cookies();
    //const crypto = new NextCrypto(process.env.SECRET_SIGNATURE_KEY);
    const decrypted = await crypto.decrypt(cookieStore.get('user_id').value);
    const sql = neon(`${process.env.DATABASE_URL}`);
    
    const Documents = await sql`
      SELECT *
      FROM documents 
      WHERE user_id = ${decrypted}
      AND active = true
      LIMIT ${DOCUMENTS_PER_PAGE} OFFSET ${offset}
    `;

    return Documents;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch documents.');
  }
}

export async function fetchDocumentsById(
  user_id: string
) {
  try {
    //const cookieStore = await cookies();
    //const crypto = new NextCrypto(process.env.SECRET_SIGNATURE_KEY);
    //const decrypted = await crypto.decrypt(cookieStore.get('user_id').value);
    const sql = neon(`${process.env.DATABASE_URL}`);
    
    const Documents = await sql`
      SELECT *
      FROM documents 
      WHERE user_id = ${user_id}
      AND active = true
    `;

    return Documents;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch documents.');
  }
}

export async function fetchDocumentsPages(query: string) {
  try {
    console.log(query);
    const cookieStore = await cookies()
    //const crypto = new NextCrypto(process.env.SECRET_SIGNATURE_KEY);
    const decrypted = await crypto.decrypt(cookieStore.get('user_id').value);
    const sql = neon(`${process.env.DATABASE_URL}`);
    
    const count = await sql`SELECT COUNT(*)
      FROM documents 
      WHERE user_id = ${decrypted}
      AND active = true 
    `;  
    
    const totalPages = Math.ceil(Number(count[0].count) / DOCUMENTS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of Documents.');
  }
}

export async function fetchDocumentById(id: string) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const data = await sql`
      SELECT *
      FROM documents
      WHERE documents.id = ${id} 
      LIMIT 1;
    `;

    /*const Document = data.map((Document) => ({
      ...Document,
    }));*/

    const Document:Document = data[0] as Document;
    //console.log(Document); // Document is an empty array []
    return Document;
    //return data[0] as Document;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch Document.');
  }
}

export async function fetchSignatureByUserId(id: string):Promise<Signature> {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const data = await sql`
      SELECT *
      FROM signatures
      WHERE active = true
      AND signatures.user_id = ${id};
    `;

    /*const Signature = data.map((Signature) => ({
      ...Signature,
    }));*/

    //console.log(Signature); // Document is an empty array []
    return data[0] as Signature;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch Document.');
  }
}
