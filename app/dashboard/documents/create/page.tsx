import Form from '@/app/ui/documents/create-form';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import { fetchSignatureByUserId } from '@/app/lib/data';
//import { cookies } from 'next/headers';
import { Signature/*, User*/ } from 'app/lib/definitions';
//import { getUser } from '@/auth';
import NextCrypto from 'next-crypto';
import { createClient } from 'app/lib/supabase/server';

export default async function Page() {
  const supabase = await createClient()
  const user = await supabase.auth.getUser();
  const userId = user.data.user.id as string;


  //const cookieStore = await cookies()
  const crypto = new NextCrypto(process.env.SECRET_SIGNATURE_KEY);
  //const decrypted = await crypto.decrypt(cookieStore.get('user_id').value);
  const signature:Signature = await fetchSignatureByUserId(userId); 
  //const signature:Signature = await fetchSignatureByUserId(decrypted); 
  console.log('siggg ',signature.id); 
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
        sig_id={signature.id}
      />
    </main>
  );
}