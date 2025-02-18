import { lusitana } from '@/app/ui/fonts';
//import { fetchCardData } from '@/app/lib/data';
//import { getSession } from '@/app/lib/session';

export default async function Page() {
  //const session = await getSession();
  //console.log(session);
  //const revenue = await fetchRevenue();
  //const latestSignatures = await fetchLatestSignatures();
  /*const { 
    numberOfCustomers,
    numberOfSignatures,
    totalPaidSignatures,
    totalPendingSignatures } = await fetchCardData();*/

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      
      {/*<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper />
        </Suspense>
        
        {/*<Card title="Collected" value={totalPaidSignatures} type="collected" /> }
        {<Card title="Pending" value={totalPendingSignatures} type="pending" /> }
        {<Card title="Total Signatures" value={numberOfSignatures} type="Signatures" /> }
        {<Card
          title="Total Customers"
          value={numberOfCustomers}
          type="customers"
        /> 
        }
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
         <Suspense fallback={ <RevenueChartSkeleton />}>
          <RevenueChart />
        </Suspense>
        <Suspense fallback={ <LatestSignaturesSkeleton />}>
          <LatestSignatures />
        </Suspense> 
          
      </div>*/}
    </main>
  );
}