import DocPagination from '@/app/ui/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/documents/table';
import { CreateSignedDocument } from '@/app/ui/documents/buttons';
import { lusitana } from '@/app/ui/fonts';
//import { DocumentsTableSkeleton } from '@/app/ui/skeletons';
//import { Suspense } from 'react';
import { fetchDocumentsPages } from '@/app/lib/data';

export default async function Page(
  props: {
    searchParams?: Promise<{
        query?: string;
        page?: string;
      }>;
  }
  ){
  
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchDocumentsPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Documents</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search Documents..." />
        <CreateSignedDocument />
      </div>
      {//<Suspense key={query + currentPage} fallback={<DocumentsTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      //</Suspense> 
      }
      <div className="mt-5 flex w-full justify-center">
        { <DocPagination totalPages={totalPages} /> }
      </div>
    </div>
  );
}