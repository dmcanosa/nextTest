import { fetchDocumentsById } from 'app/lib/data';
import { auth } from "@/auth";
import { NextRequest, NextResponse } from 'next/server';
import NextCrypto from 'next-crypto';

//export const dynamic = 'force-static'


export async function GET(req: NextRequest, res: NextResponse) {
  const crypto = new NextCrypto(process.env.SECRET_SIGNATURE_KEY);
  const cookieHash = req.headers.get('token');
  const userId = await crypto.decrypt(cookieHash);
  
  const docs = await fetchDocumentsById(userId);
  //res = JSON.stringify(docs);
  
  return NextResponse.json({
    'success':true, 
    'docs': docs
  });
}
  
/*export const GET = auth(function GET(req) {
  if (req.auth){
    
    return NextResponse.json(req.auth)
  } 
  return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
})*/