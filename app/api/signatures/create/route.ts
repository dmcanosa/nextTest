import { createSignature, State } from 'app/lib/actions';
//import { NextURL } from 'next/dist/server/web/next-url';
import { NextRequest, NextResponse } from 'next/server';

//export const dynamic = 'force-static'

export async function POST(request: NextRequest) {
  const sig = request.headers.get('signature');
  const fd:FormData = new FormData();
  fd.append('canvasString', sig);
  const state:State = { errors: { data: [] }, message: '' };
  const status = await createSignature(state, fd);
  
  console.log('status: ',status);

  //const jsonSigs = JSON.stringify(signatures);
  //console.log('sigs: ',jsonSigs);

  return NextResponse.json({
          'success':true, 
          'status':status, 
          
        });
}