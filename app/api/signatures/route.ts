//import { fetchFilteredSignatures } from 'app/lib/data';
//import { NextApiRequest } from 'next';
//import { SearchParams } from 'next/dist/server/request/search-params';
import { NextURL } from 'next/dist/server/web/next-url';
import { NextRequest } from 'next/server';

export const dynamic = 'force-static'

export async function GET(request: NextRequest) {
  //const { nextUrl: { searchParams } } = request;
  //const urlSearchParams = new URLSearchParams(search);
  //const body = await request;
  //const urlSearchParams = new URLSearchParams(request.nextUrl.searchParams);
  //const params2 = Object.fromEntries(urlSearchParams.entries());
  //const { : { href, search }} = request;
  //console.log('route: ',body);
  console.log('route: ',(request.nextUrl as NextURL));
  console.log('route: ',(request.nextUrl as NextURL).searchParams.get('id'));
  
  //console.log('params: ',request.nextUrl.searchParams);
  //console.log('req: ',searchParams.get('user_id'));
  //console.log('req: ',urlSearchParams.get('user_id'));
  //console.log('entries: ', params2);


  return Response.json(['test', 'json', 'response']);
}