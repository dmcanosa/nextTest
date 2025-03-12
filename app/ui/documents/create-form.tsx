'use client';

import createReport from 'docx-templates';
//import { createReport } from 'https://unpkg.com/docx-templates/lib/browser.js';
//import qrcode from 'yaqrcode';
import { useActionState, useEffect } from 'react';
import Link from 'next/link';
/*import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';*/
import { Button } from '@/app/ui/button';
import { createDocument, docState } from '@/app/lib/actions';

export default function Form({ sig, sig_id }) {
  const initialState: docState = { message: null, errors: {} };
  const [state, formAction] = useActionState(createDocument, initialState);
  console.log('sig::: ',sig_id);

  const onFileUpload = async (event) => {
    console.log('event: ',event.target.files[0]);
    (document.getElementById('template_name') as HTMLInputElement).value = event.target.files[0].name;
    //document.getElementById('template_name_label').innerHTML = event.target.files[0].name;
    
    const template:Uint8Array<ArrayBufferLike> = await readFileIntoArrayBuffer(event.target.files[0]) as Uint8Array<ArrayBufferLike>;
    const sigData = sig.slice('data:image/png;base64,'.length);
    const sigId = sig_id;
    console.log('sig: ',sigId);
    (document.getElementById('template_b64') as HTMLInputElement).value = Buffer.from(template).toString('base64');
    (document.getElementById('signature_id') as HTMLInputElement).value = sigId;
    
    const report = await createReport({
      template,
      data: { name: 'Guille', surname: 'Suarez' },
      additionalJsContext: {
        firma: () => {
          const svg_data = Buffer.from(sigData, 'base64');
          return { width: 4, height: 4, data: svg_data, extension: '.svg' };                    
        }
      }
    });

    (document.getElementById('signed_b64') as HTMLInputElement).value = Buffer.from(report).toString('base64');
    
    /*saveDataToFile(
      report,
      'report.docx',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );*/
  }

  useEffect(() => {
    document.getElementById('template_file').addEventListener('change', onFileUpload, false);
      
  }, []);

  const readFileIntoArrayBuffer = fd =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsArrayBuffer(fd);
    })
  ;
  
  const saveDataToFile = (data, fileName, mimeType) => {
    const blob = new Blob([data], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    downloadURL(url, fileName/*, mimeType*/);
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 1000);
  };
  
  const downloadURL = (data, fileName) => {
    const a = document.createElement('a');
    a.href = data;
    a.download = fileName;
    document.body.appendChild(a);
    //a.style = 'display: none';
    a.click();
    a.remove();
  };

  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Document */}
        <div className="mb-4">
          <label htmlFor="signature" className="mb-2 block text-sm font-medium">
            Upload the template document
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input type='hidden'  name='template_name' id='template_name'></input>
              <input type='hidden'  name='template_b64'  id='template_b64'></input>
              <input type='hidden'  name='signed_b64'    id='signed_b64'></input>
              <input type='hidden'  name='signature_id'  id='signature_id'></input> 
              <input type='file'    name='template_file' id='template_file'></input>
            </div>
          </div>
          <div id="template-error" aria-live="polite" aria-atomic="true">
            {state.errors?.template_name &&
              state.errors.template_name.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/documents"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Create Document</Button>
      </div>
    </form>
  );
}
