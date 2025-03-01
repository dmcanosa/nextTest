import Form from '@/app/ui/documents/create-form';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import { fetchSignatureByUserId } from '@/app/lib/data';
import { cookies } from 'next/headers';
import { Signature, User } from 'app/lib/definitions';
import { getUser } from '@/auth';
import NextCrypto from 'next-crypto';
 
export default async function Page() {
  const cookieStore = await cookies()
  const crypto = new NextCrypto(process.env.SECRET_SIGNATURE_KEY);
  const decrypted = await crypto.decrypt(cookieStore.get('user_email').value);
  const userEmail:string = decrypted;
  const user:User = await getUser(userEmail);  
  const signature:Signature = await fetchSignatureByUserId(user.id);  
  const decryptedSig:string = await crypto.decrypt(signature.data);
    
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Documents', href: '/dashboard/documents' },
          {
            label: 'Create Document',
            href: '/dashboard/documents/create',
            active: true,
          },
        ]}
      />
      <Form 
        sig={decryptedSig}
      />
    </main>
  );
}