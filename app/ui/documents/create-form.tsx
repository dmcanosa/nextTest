'use client';

import { useActionState, useEffect } from 'react';
import Link from 'next/link';
/*import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';*/
import { Button } from '@/app/ui/button';
import { createDocument, docState } from '@/app/lib/actions';

export default function Form(/*{ customers }: { customers: CustomerField[] }*/) {
  const initialState: docState = { message: null, errors: {} };
  const [state, formAction] = useActionState(createDocument, initialState);
  
  const onFileUpload = (event) => {
    console.log('event: ',event.target.files[0]);
    document.getElementById('template_name_label').innerHTML = event.target.files[0].name;
  }

  useEffect(() => {
    document.getElementById('template_file').addEventListener('change', onFileUpload, false);
      
  }, []);


  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Signature */}
        <div className="mb-4">
          <label htmlFor="signature" className="mb-2 block text-sm font-medium">
            Upload the template document
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <p className='template_name_label' id='template_name_label'>

              </p>
              <input type='hidden' name='template_name' id='template_name'></input> 
              <input type='file' name='template_file' id='template_file'></input>
              <input type='hidden' name='signature_id' id='signature_id'></input> 
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

        {/* Invoice Status */}
        
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
