import Form from '@/app/ui/signatures/create-form';
import Breadcrumbs from '@/app/ui/breadcrumbs';
 
export default async function Page() {
  
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