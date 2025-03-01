import Form from '@/app/ui/documents/create-form';
import Breadcrumbs from '@/app/ui/breadcrumbs';
 
export default async function Page() {
  
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
      <Form/>
    </main>
  );
}