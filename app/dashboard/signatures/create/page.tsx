import Form from '@/app/ui/signatures/create-form';
import Breadcrumbs from '@/app/ui/signatures/breadcrumbs';
import { fetchCustomers } from '@/app/lib/data';
 
export default async function Page() {
  //const customers = await fetchCustomers();
 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Signatures', href: '/dashboard/signatures' },
          {
            label: 'Create Signature',
            href: '/dashboard/signatures/create',
            active: true,
          },
        ]}
      />
      <Form/>
    </main>
  );
}