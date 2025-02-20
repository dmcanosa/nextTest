//import { sql } from '@vercel/postgres';
import { neon } from '@neondatabase/serverless';

/*import {
  //CustomerField,
  //CustomersTableType,
  SignatureForm,
  SignaturesTable,
  //LatestSignatureRaw,
  Revenue,
} from './definitions';*/
//import { formatCurrency } from './utils';

export async function fetchRevenue() {
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    console.log('Fetching revenue data...');
    await new Promise((resolve) => setTimeout(resolve, 3000));
    const sql = neon(`${process.env.DATABASE_URL}`);
    
    const data = await sql`SELECT * FROM revenue`;

    console.log('Data fetch completed after 3 seconds.');

    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestSignatures() {
  try {
    /*const data = await sql<LatestSignatureRaw>`
      SELECT Signatures.amount, customers.name, customers.image_url, customers.email, Signatures.id
      FROM Signatures
      JOIN customers ON Signatures.customer_id = customers.id
      ORDER BY Signatures.date DESC
      LIMIT 5`;

    const latestSignatures = data.rows.map((Signature) => ({
      ...Signature,
      amount: formatCurrency(Signature.amount),
    }));
    return latestSignatures;*/
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest Signatures.');
  }
}

export async function fetchCardData() {
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    /*const SignatureCountPromise = sql`SELECT COUNT(*) FROM Signatures`;
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    const SignatureStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM Signatures`;

    const data = await Promise.all([
      SignatureCountPromise,
      customerCountPromise,
      SignatureStatusPromise,
    ]);

    const numberOfSignatures = Number(data[0].rows[0].count ?? '0');
    const numberOfCustomers = Number(data[1].rows[0].count ?? '0');
    const totalPaidSignatures = formatCurrency(data[2].rows[0].paid ?? '0');
    const totalPendingSignatures = formatCurrency(data[2].rows[0].pending ?? '0');

    return {
      numberOfCustomers,
      numberOfSignatures,
      totalPaidSignatures,
      totalPendingSignatures,
    };*/
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

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
      WHERE
        active = true 
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
      FROM signatures where active = true
    `;  
    /*const count = await sql`SELECT COUNT(*)
    FROM Signatures
    JOIN customers ON Signatures.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      Signatures.amount::text ILIKE ${`%${query}%`} OR
      Signatures.date::text ILIKE ${`%${query}%`} OR
      Signatures.status ILIKE ${`%${query}%`}
  `;*/

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
      /*amount: Signature.amount / 100,*/
    }));

    console.log(Signature); // Signature is an empty array []
    //return Signature[0];
    return data[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch Signature.');
  }
}

export async function fetchCustomers() {
  try {
    /*const data = await sql<CustomerField>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `;

    const customers = data.rows;
    return customers;*/
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchFilteredCustomers(query: string) {
  try {
    console.log(query);
    /*const data = await sql<CustomersTableType>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(Signatures.id) AS total_Signatures,
		  SUM(CASE WHEN Signatures.status = 'pending' THEN Signatures.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN Signatures.status = 'paid' THEN Signatures.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN Signatures ON customers.id = Signatures.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `;

    const customers = data.rows.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;*/
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}
