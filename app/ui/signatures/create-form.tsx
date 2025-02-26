'use client';

import { useActionState, useEffect } from 'react';
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
  
  useEffect(() => {
    console.log('body on canvas: ', document);
    
    /*document.body.addEventListener('touchstart', (e) => {
      if(e.target == document.getElementById('canvas')){
        e.preventDefault();
      }
    }, false);
  
    document.body.addEventListener('touchend', (e) => {
      if(e.target == document.getElementById('canvas')){
        e.preventDefault();
      }
    }, false);
  
    document.body.addEventListener('touchmove', (e) => {
      if(e.target == document.getElementById('canvas')){
        e.preventDefault();
      }
    }, false);*/
  }, []);

  const saveCanvas = (s:string):void => {
    console.log('saveCanvas!');
    const inputCanvas = document.getElementById('canvasString') as HTMLInputElement;
    inputCanvas.value = s;  
  }

  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Signature */}
        <div className="mb-4">
          <label htmlFor="signature" className="mb-2 block text-sm font-medium">
            Draw your signature
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <Canvas
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
