import Form from '@/app/ui/signatures/edit-form';
import Breadcrumbs from '@/app/ui/signatures/breadcrumbs';
import { fetchSignatureById, fetchCustomers } from '@/app/lib/data';
import { notFound } from 'next/navigation';
 
export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const [Signature, customers] = await Promise.all([
    fetchSignatureById(id),
    fetchCustomers(),
  ]);

  if (!Signature) {
    notFound();
  }
  
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Signatures', href: '/dashboard/Signatures' },
          {
            label: 'Edit Signature',
            href: `/dashboard/Signatures/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form Signature={Signature} customers={customers} />
    </main>
  );
}