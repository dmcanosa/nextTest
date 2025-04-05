import { createDocument, docState } from 'app/lib/actions';
//import { NextURL } from 'next/dist/server/web/next-url';
import { NextRequest } from 'next/server';

//export const dynamic = 'force-static'

export async function POST(request: NextRequest) {
  const fd:FormData = new FormData();
  
  fd.append('template_name', request.headers.get('template_name'));
  fd.append('template_b64', request.headers.get('template_b64'));
  fd.append('signed_b64', request.headers.get('signed_b64'));
  fd.append('signature_id', request.headers.get('signature_id'));
  
  const state:docState = { errors: { 
    template_name: [],
    template_b64: [],
    signed_b64: [],
    signature_id: []
   }, message: '' };
  const status = await createDocument(state, fd);
  
  console.log('status: ',status);

  //const jsonSigs = JSON.stringify(signatures);
  //console.log('sigs: ',jsonSigs);

  return Response.json([]);
}