'use client';

import { useActionState } from 'react';
import Link from 'next/link';
/*import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';*/
import { Button } from '@/app/ui/button';
import { createSignature, State } from '@/app/lib/actions';
import Canvas from '@/app/dashboard/signatures/canvas';

export default function Form(/*{ customers }: { customers: CustomerField[] }*/) {
  const initialState: State = { message: null, errors: {} };
  const [state, formAction] = useActionState(createSignature, initialState);
  
  console.log('body on canvas: ', document);

  /*document.body.addEventListener('touchstart', (e) => {
    if(e.target == document.getElementById('formCanvas')){
      e.preventDefault();
    }
  }, false);

  document.body.addEventListener('touchend', (e) => {
    if(e.target == document.getElementById('formCanvas')){
      e.preventDefault();
    }
  }, false);

  document.body.addEventListener('touchmove', (e) => {
    if(e.target == document.getElementById('formCanvas')){
      e.preventDefault();
    }
  }, false);*/

  const saveCanvas = (s:string):void => {
    console.log('saveCanvas!');
    const inputCanvas = document.getElementById('canvasString') as HTMLInputElement;
    inputCanvas.value = s;  
  }

  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Customer Name 
        <div className="mb-4">
          <label htmlFor="customer" className="mb-2 block text-sm font-medium">
            Choose customer
          </label>
          <div className="relative">
            <select
              id="customer"
              name="customerId"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
              aria-describedby="customer-error"
            >
              <option value="" disabled>
                Select a customer
              </option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="customer-error" aria-live="polite" aria-atomic="true">
            {state.errors?.customerId &&
              state.errors.customerId.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>*/}

        {/* Invoice Amount */}
        
        {/* Signature */}
        <div className="mb-4">
          <label htmlFor="signature" className="mb-2 block text-sm font-medium">
            Draw your signature
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <Canvas
                id= {'formCanvas'}
                saveCanvas = {saveCanvas}  
              />
              <input type='hidden' name='canvasString' id='canvasString'></input>
            </div>
          </div>
          <div id="canvas-error" aria-live="polite" aria-atomic="true">
            {state.errors?.data &&
              state.errors.data.map((error: string) => (
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
          href="/dashboard/signatures"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Create Signature</Button>
      </div>
    </form>
  );
}
