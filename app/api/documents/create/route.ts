import { createDocument, docState } from 'app/lib/actions';
//import { NextURL } from 'next/dist/server/web/next-url';
import { NextRequest } from 'next/server';
//import { supabase } from '@/config/supabase';
import { createClient } from 'app/lib/supabase/server';

//import { AES, Utf8 } from 'crypto-es';

//export const dynamic = 'force-static'

export async function POST(req: NextRequest) {
  //const crypto = new NextCrypto(process.env.SECRET_SIGNATURE_KEY);
  //const secretSigKey = process.env.SECRET_SIGNATURE_KEY as string;

  //const cookieHash = req.headers.get('token');
  //const userId = await crypto.decrypt(cookieHash);
  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  console.log('user on create sig: ', user);
  const uid = user.data.user?.id;
  console.log('user id: ',uid);

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
  const status = await createDocument(state, fd, false, uid);
  
  console.log('status: ',status);

  //const jsonSigs = JSON.stringify(signatures);
  //console.log('sigs: ',jsonSigs);

  return Response.json([]);
}