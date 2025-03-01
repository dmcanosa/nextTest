//import Image from 'next/image';
import { DeleteDocument } from '@/app/ui/documents/buttons';
import { fetchFilteredDocuments } from '@/app/lib/data';

export default async function DocumentsTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const documents = await fetchFilteredDocuments(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {documents?.map((document) => (
              <div
                key={document.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <p className="text-xl font-medium">
                    {document.template_name}
                  </p>
                </div>
                <div className="flex items-center justify-between border-b pb-4">
                  <p className="text-xl font-medium">
                    {document.signature_id}
                  </p>
                </div>
  
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">
                      {document.date_signed.toDateString()}
                    </p>
                    <p className="text-xl font-medium">
                      {document.signed ? 'FIRMADO' : 'SIN FIRMA'}
                    </p>
                  </div>
                  {/*
                  <div className="flex justify-end gap-2">
                    <DownloadDocument id={document.id} />
                  </div>
                  */}
                  <div className="flex justify-end gap-2">
                    <DeleteDocument id={document.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  Template
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Signature
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Date
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Signed
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Delete
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {documents?.map((document) => (
                <tr
                  key={document.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap px-3 py-3">
                    <p>{document.template_name}</p>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <span>
                      {document.signature_id}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <span>
                      {document.date_signed.toDateString()}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <span>
                      {document.signed ? 'FIRMADO' : 'SIN FIRMAR'}
                    </span>
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      {/*<UpdateSignature id={document.id} /> */}
                      {!document.signed &&  
                        <DeleteDocument id={document.id} />
                      }
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
