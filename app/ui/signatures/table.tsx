import Image from 'next/image';
import { UpdateSignature, DeleteSignature } from '@/app/ui/signatures/buttons';
import SignatureStatus from '@/app/ui/signatures/status';
import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { fetchFilteredSignatures } from '@/app/lib/data';

export default async function SignaturesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const signatures = await fetchFilteredSignatures(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {signatures?.map((signature) => (
              <div
                key={signature.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <Image
                        src={signature.image_url}
                        className="mr-2 rounded-full"
                        width={28}
                        height={28}
                        alt={`${signature.name}'s profile picture`}
                      />
                      <p>{signature.name}</p>
                    </div>
                    <p className="text-sm text-gray-500">{signature.email}</p>
                  </div>
                  <SignatureStatus status={signature.status} />
                  {signature.data &&
                    <Image 
                      src={signature.data}
                      width={128}
                      height={96}
                      alt={`${signature.name}'s profile picture`}
                    />
                  }  
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">
                      {formatCurrency(signature.amount)}
                    </p>
                    <p>{formatDateToLocal(signature.date)}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateSignature id={signature.id} />
                    <DeleteSignature id={signature.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  Signature
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Status
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {signatures?.map((signature) => (
                <tr
                  key={signature.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap px-3 py-3">
                    <span>{signature.active}</span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    { signature.data &&
                      <Image 
                        src={signature.data}
                        width={128}
                        height={96}
                        style={{ width: 'auto !important', height: '15vh' }}
                        alt={`${signature.name}'s profile picture`}
                      />
                    } 
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      {/*<UpdateSignature id={signature.id} /> */}
                      <DeleteSignature id={signature.id} />
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
