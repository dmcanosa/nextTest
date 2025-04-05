import { createSignature, State } from 'app/lib/actions';
//import { NextURL } from 'next/dist/server/web/next-url';
import { NextRequest, NextResponse } from 'next/server';
import NextCrypto from 'next-crypto';

//export const dynamic = 'force-static'

export async function POST(req: NextRequest) {
  const crypto = new NextCrypto(process.env.SECRET_SIGNATURE_KEY);
  
  const sig = req.headers.get('signature');
  const fd:FormData = new FormData();
  fd.append('canvasString', sig);
  const state:State = { errors: { data: [] }, message: '' };
  
  try{
    const cookieHash = req.headers.get('token');
    const userId = await crypto.decrypt(cookieHash);
    const status = await createSignature(state, fd, false, userId);
    
    console.log('status: ',status);

    return NextResponse.json({
      'success':true, 
      'status':status, 
    });
  }catch(error){
    console.log('--'+error+'--');
    return NextResponse.json({
      'success':false, 
      'status':error, 
      'user':{}
    });
  }      
}