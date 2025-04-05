import { createDocument, docState } from 'app/lib/actions';
//import { NextURL } from 'next/dist/server/web/next-url';
import { NextRequest } from 'next/server';
import NextCrypto from 'next-crypto';

//export const dynamic = 'force-static'

export async function POST(req: NextRequest) {
  const crypto = new NextCrypto(process.env.SECRET_SIGNATURE_KEY);
  
  const cookieHash = req.headers.get('token');
  const userId = await crypto.decrypt(cookieHash);
  
  const fd:FormData = new FormData();
  fd.append('template_name', req.headers.get('template_name'));
  fd.append('template_b64', req.headers.get('template_b64'));
  fd.append('signed_b64', req.headers.get('signed_b64'));
  fd.append('signature_id', req.headers.get('signature_id'));
  
  const state:docState = { errors: { 
    template_name: [],
    template_b64: [],
    signed_b64: [],
    signature_id: []
   }, message: '' };
  const status = await createDocument(state, fd, false, userId);
  
  console.log('status: ',status);

  //const jsonSigs = JSON.stringify(signatures);
  //console.log('sigs: ',jsonSigs);

  return Response.json([]);
}