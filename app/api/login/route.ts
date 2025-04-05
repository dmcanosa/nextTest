import { signIn } from 'auth';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/auth";
import { cookies } from 'next/headers';
//import { User } from 'app/lib/definitions';
import NextCrypto from 'next-crypto';

//export const dynamic = 'force-static'

export async function GET(request: NextRequest) {
  const crypto = new NextCrypto(process.env.SECRET_SIGNATURE_KEY);

  const email = request.headers.get('email');
  const password = request.headers.get('password');
  //const redirect = false;
  const fd:FormData = new FormData();
  fd.append('email', email);
  fd.append('password', password);
  //fd.append('redirect', redirect);
      
  try{
    const status = await signIn('credentials', 
      //fd
      {
        email: email,
        password: password,
        redirect: false
      }
      );
      console.log('status: ',status);

      const cookieStore = await cookies();
      const uid = cookieStore.get('user_id').value;
      const decrypted = await crypto.decrypt(uid);
      console.log('user_id: ',uid);
      console.log('user_id: ',decrypted);
      
      //cookieStore.set('user_id', encrypted);
      
      const authStatus = await auth();
      console.log('authstatus: ',authStatus);
      //console.log('res: ',response);
      //return response;
      return NextResponse.json({
        'success':true, 
        'status':status, 
        'user':{
          'encuid': uid,
        //  'email': authStatus?.user?.email || '',
        //  'name': authStatus?.user?.name || '',
        }
      });
  }catch(error){
    console.log('--'+error+'--');
    console.log('invalid CREDENTIALS');
    return NextResponse.json({
      'success':false, 
      'status':error, 
      'user':{}
    });
    //return Response.json({'status': error});
  }
  //const jsonSigs = JSON.stringify(signatures);
  //console.log('req: ',request.headers);
  //console.log('req: ',request.headers.get('email'));
  
  //return Response.json({'status':status});
}