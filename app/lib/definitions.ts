import { z } from 'zod';
 
export const SignupFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long.' })
    .trim(),
  email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/[a-zA-Z]/, { message: 'Password must contain at least one letter.' })
    //.regex(/[0-9]/, { message: 'Contain at least one number.' })
    //.regex(/[^a-zA-Z0-9]/, {
    //  message: 'Contain at least one special character.',
    //})
    .trim(),
  password2: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/[a-zA-Z]/, { message: 'Password must contain at least one letter.' })
    //.regex(/[0-9]/, { message: 'Contain at least one number.' })
    //.regex(/[^a-zA-Z0-9]/, {
    //  message: 'Contain at least one special character.',
    //})
    .trim(),  
}).refine(
  (values) => {
    return values.password === values.password2;
  },
  {
    message: "Passwords must match!",
    path: ["password2"],
  }
);

export const LoginFormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
  password: z
    .string()
    .min(8, { message: 'Be at least 8 characters long' })
    .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
    //.regex(/[0-9]/, { message: 'Contain at least one number.' })
    //.regex(/[^a-zA-Z0-9]/, {
    //  message: 'Contain at least one special character.',
    //})
    .trim(),
})

export type SessionPayload = 
{
  userId: string,
  expiresAt: Date,
  /*httpOnly: boolean,
  secure: boolean,
  sameSite: 'lax',
  path: '/',*/
}
| undefined;

export type FormState =
  | {
      errors?: {
        name?: string[]
        email?: string[]
        password?: string[]
      }
      message?: string
    }
  | undefined

// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  image_url: string;
};

export type Signature = {
  id: string; // Will be created on the database
  active: boolean;
  data: string;
  created: string;
  user_id: string;
};

export type Document = {
  template_name: string;
  template_data: string;
  signature_id: string;
  signed: boolean;
  date_signed: string;
  signed_document: string;
  user_id: string;
};

export type Revenue = {
  month: string;
  revenue: number;
};

export type LatestSignature = {
  id: string; // Will be created on the database
  active: boolean;
  data: string;
  created: string;
  user_id: string;
};

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestSignatureRaw = Omit<LatestSignature, 'amount'> & {
  amount: number;
};

export type SignaturesTable = {
  id: string;
  data: string;
  active: boolean;
  created: string;
};

export type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_Signatures: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedCustomersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_Signatures: number;
  total_pending: string;
  total_paid: string;
};

export type CustomerField = {
  id: string;
  name: string;
};

export type SignatureForm = {
  id: string;
  data: string;
};
