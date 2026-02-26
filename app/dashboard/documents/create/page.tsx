import Form from '@/app/ui/documents/create-form';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import { fetchSignatureByUserId } from '@/app/lib/data';
import { Signature } from 'app/lib/definitions';
import { createClient } from 'app/lib/supabase/server';
import { getCurrentUserId } from 'app/lib/supabase/auth-service';
import { AES, Utf8 } from 'crypto-es';

const secretSigKey = process.env.SECRET_SIGNATURE_KEY as string;

export default async function Page() {
  try {
    const userId = await getCurrentUserId();
    const signature: Signature = await fetchSignatureByUserId(userId);
    
    if (!signature) {
      throw new Error('No signature found for this user');
    }
    
    const decrypted = AES.decrypt(signature.data, secretSigKey).toString(Utf8);

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
          sig={decrypted}
          sig_id={signature.id}
        />
      </main>
    );
  } catch (error) {
    console.error('Error loading document creation:', error);
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
        <div className="rounded-lg bg-red-50 p-6">
          <h2 className="text-lg font-semibold text-red-900">Error Loading Document</h2>
          <p className="mt-2 text-red-700">Unable to load your signature. Please create one first.</p>
        </div>
      </main>
    );
  }
}