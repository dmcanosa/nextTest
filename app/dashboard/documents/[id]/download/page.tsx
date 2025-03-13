//'use client';

//import { CreateSignedDocument } from '@/app/ui/documents/buttons';
import { lusitana } from '@/app/ui/fonts';
//import { fetchDocumentById, fetchDocumentsPages } from '@/app/lib/data';
//import { Document } from '@/app/lib/definitions';
//import { useEffect } from 'react';
//import { useParams } from 'next/navigation';

export default async function Page(/* {
    params,
  }: {
    params: { id: string }
  } */){

  /*const saveDataToFile = (data, fileName, mimeType) => {
    const blob = new Blob([data], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    downloadURL(url, fileName);
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 1000);
  };
  
  const downloadURL = (data, fileName) => {
    const a = document.createElement('a');
    a.href = data;
    a.download = fileName;
    document.body.appendChild(a);
    //a.style = 'display: none';
    a.click();
    a.remove();
  };  
  
  /*const serverFunction = async (docId) => {
    'use server';

    
    saveDataToFile(
      signedDoc,
      'report.docx',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
  };*/

  //const params = useParams<{ id: string; }>();

  //const docId = params.id;
  //console.log('doc download:', docId);
  /*const doc:Document = await fetchDocumentById(docId);
  const signedDocB64 = doc.signed_document;
  const signedDoc = Uint8Array.from(Buffer.from(signedDocB64, 'base64'))
  console.log('doc :',doc);
  */

  /*useEffect(()=>{
    //serverFunction(docId);
    
    saveDataToFile(
      signedDoc,
      'report.docx',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );

    //console.log('doc download: ',document);
    
    
  }, []);*/

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Your document will be downloaded soon...</h1>
      </div>
    </div>
  );
}