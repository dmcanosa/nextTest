import { fetchSignaturesById } from 'app/lib/data';
import { NextRequest, NextResponse } from 'next/server';
import NextCrypto from 'next-crypto';

//export const dynamic = 'force-static'

export async function GET(req: NextRequest) {
  const crypto = new NextCrypto(process.env.SECRET_SIGNATURE_KEY);
  
  try{
    const cookieHash = req.headers.get('token');
    const userId = await crypto.decrypt(cookieHash);
  
    const signatures = await fetchSignaturesById(userId);
    return NextResponse.json({
      'success':true, 
      'signatures': signatures
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