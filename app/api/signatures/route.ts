import { fetchSignaturesById } from 'app/lib/data';
//import { NextURL } from 'next/dist/server/web/next-url';
import { NextRequest } from 'next/server';

//export const dynamic = 'force-static'

export async function GET(request: NextRequest) {
  const { nextUrl: { searchParams } } = request;
  console.log('route: ',searchParams.get('id'));
  const userId = searchParams.get('id');
  
  const signatures = await fetchSignaturesById(userId);
  const jsonSigs = JSON.stringify(signatures);
  //console.log('sigs: ',jsonSigs);

  return Response.json(jsonSigs);
}