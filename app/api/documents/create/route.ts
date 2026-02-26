import { createDocument, docState } from 'app/lib/actions';
import { NextRequest } from 'next/server';
import { createClient } from 'app/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const user = await supabase.auth.getUser();
    
    if (!user.data.user?.id) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Extract and validate FormData values
    const getHeaderValue = (key: string): string => {
      const value = req.headers.get(key);
      if (!value) {
        throw new Error(`Missing required header: ${key}`);
      }
      return value;
    };

    const fd = new FormData();
    fd.append('template_name', getHeaderValue('template_name'));
    fd.append('template_b64', getHeaderValue('template_b64'));
    fd.append('signed_b64', getHeaderValue('signed_b64'));
    fd.append('signature_id', getHeaderValue('signature_id'));
    
    const state: docState = { 
      errors: { 
        template_name: [],
        template_b64: [],
        signed_b64: [],
        signature_id: []
      }, 
      message: '' 
    };
    
    const status = await createDocument(state, fd);
    return Response.json(status);
  } catch (error) {
    console.error('Document creation error:', error);
    return Response.json(
      { error: error instanceof Error ? error.message : 'Failed to create document' },
      { status: 400 }
    );
  }
}