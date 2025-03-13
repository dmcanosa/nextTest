'use client';

import { PencilIcon, PlusIcon, TrashIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
//import { deleteDocument/*, downloadDocument*/ } from '@/app/lib/actions';
//import { fetchDocumentById } from '@/app/lib/data';

export function CreateSignedDocument() {
  return (
    <Link
      href="/dashboard/documents/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Signed Document</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateDocument({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/documents/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function saveDataToFile (data, fileName, mimeType){
  const blob = new Blob([data], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  downloadURL(url, fileName);
  setTimeout(() => {
    window.URL.revokeObjectURL(url);
  }, 1000);
}

export function downloadURL(data, fileName){
  const a = document.createElement('a');
  a.href = data;
  a.download = fileName;
  document.body.appendChild(a);
  //a.style = 'display: none';
  a.click();
  a.remove();
}

export function innerDownloadDocument(doc:string){
  //console.log('down doc: ',doc);

  const signedDoc = Uint8Array.from(Buffer.from(doc, 'base64'));

  saveDataToFile(
    signedDoc,
    'report.docx',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  );
}

export function DownloadDocument({ doc }: { doc: string }) {
  const downloadDocumentWithId = innerDownloadDocument.bind(null, doc);

  return (
    <form action={downloadDocumentWithId}>
      <button className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Download</span>
        <ArrowDownTrayIcon className="w-5" />
      </button>
    </form>
  );
}

export function DeleteDocument({ id }: { id: string }) {
  console.log(id);
  //const deleteDocumentWithId = deleteDocument.bind(null, id);
  
  return (
    <form /*action={deleteDocumentWithId}*/>
      <button className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}


