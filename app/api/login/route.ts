import { signIn } from 'auth';
import { NextRequest } from 'next/server';

//export const dynamic = 'force-static'

export async function GET(request: NextRequest) {
  const email = request.headers.get('email');
  const password = request.headers.get('password');
  const fd:FormData = new FormData();
  fd.append('email', email);
  fd.append('password', password);
  
  try{
    const status = await signIn('credentials', 
      {
        email: email,
        password: password,
        redirect: false
      });
    console.log('status: ',status);
  }catch(error){
    console.log('--'+error+'--');
  }
  //const jsonSigs = JSON.stringify(signatures);
  //console.log('req: ',request.headers);
  console.log('req: ',request.headers.get('email'));
  
  return Response.json([]);
}