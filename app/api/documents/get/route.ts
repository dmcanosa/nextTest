//import { signIn } from 'auth';
import { fetchDocumentsById } from 'app/lib/data';

import { NextRequest } from 'next/server';

//export const dynamic = 'force-static'

export async function GET(request: NextRequest) {
  const { nextUrl: { searchParams } } = request;
  console.log('route: ',searchParams.get('id'));
  const userId = searchParams.get('id');
  
  const docs = await fetchDocumentsById(userId);
  //console.log('req: ',request.headers.get('email'));
  const res = JSON.stringify(docs);
  
  return Response.json(res);
}