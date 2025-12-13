import Image from 'next/image';
import { DeleteSignature } from '@/app/ui/signatures/buttons';
//import SignatureStatus from '@/app/ui/signatures/status';
//import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { fetchFilteredSignatures } from '@/app/lib/data';
import { AES, Utf8 } from 'crypto-es';
import { Base64 } from 'js-base64';

//import NextCrypto from 'next-crypto';

//const crypto = new NextCrypto(process.env.SECRET_SIGNATURE_KEY);
const secretSigKey = process.env.SECRET_SIGNATURE_KEY as string;
  
export default async function SignaturesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const signatures = await fetchFilteredSignatures(query, currentPage);
  
  const decryptedSignatures = [];
  await Promise.all(signatures.map( async (sig) => {
    const decrypted = AES.decrypt(sig.data, secretSigKey).toString(Utf8);
    //console.log('decrypted sig: ', decrypted);

    //const trimmed = decrypted?.replace(/^data:image\/svg\+xml;base64,/, '');
    //const decoded = Base64.decode(trimmed as string);
    //console.log('decoded sig: ', decoded);
    sig.data = decrypted;
    //sig.data = decoded;
        
    //const decrypted = await crypto.decrypt(sig.data);
    //sig.data = decrypted;
    sig.key = sig.id;
    const date = new Date(sig.created);
    //console.log('date: ', date.toDateString());
    sig.created = date.toDateString();
    decryptedSignatures.push(sig);
  }));
  
  //console.log('decrypted signatures: ', decryptedSignatures);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0" key={Math.random()}>
          <table className="hidden min-w-full text-gray-900 md:table" key={3}>
            <thead className="rounded-lg text-left text-sm font-normal" key={Math.random()}>
              <tr key={Math.random()}>
                <th scope="col" className="relative py-3 pl-6 pr-3" key={Math.random()}>
                  Signature
                </th>
                <th scope="col" className="px-3 py-5 font-medium" key={Math.random()}>
                  Status
                </th>
                <th scope="col" className="px-3 py-5 font-medium" key={Math.random()}>
                  Date
                </th>
                <th scope="col" className="px-3 py-5 font-medium" key={Math.random()}>
                  Set inactive
                </th>
              </tr>
            </thead>
            <tbody className="bg-white" key={Math.random()}>
              {decryptedSignatures?.map((signature, index) => (
                <tr
                  key={index}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap px-3 py-3">
                    { signature.data &&
                      <Image 
                        src={signature.data.split('==')[0]}
                        width={128}
                        height={96}
                        style={{ width: 'auto !important', height: '15vh' }}
                        alt={`signature`}
                      />
                    } 
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <span>
                      {signature.active ? 'ACTIVA' : 'INACTIVA'}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <span>
                      {signature.created}
                    </span>
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      {/*<UpdateSignature id={signature.id} /> */}
                      {signature.active &&  
                        <DeleteSignature id={signature.id} />
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
