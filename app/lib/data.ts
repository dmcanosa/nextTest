import { neon } from '@neondatabase/serverless';

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredSignatures(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  console.log(query);
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const Signatures = await sql`
      SELECT *
      FROM signatures
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
    const sql = neon(`${process.env.DATABASE_URL}`);
    const count = await sql`SELECT COUNT(*)
      FROM signatures 
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
