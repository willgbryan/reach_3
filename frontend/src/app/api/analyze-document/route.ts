import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  console.log('PDF processing API route called');
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    if (!file) {
      console.log('Missing required file');
      return NextResponse.json({ error: 'File is required' }, { status: 400 });
    }
    
    const pythonServerUrl = process.env.PYTHON_SERVER_URL || 'http://backend:8000';
    console.log('Sending request to Python server:', pythonServerUrl);
    
    const fileBuffer = await file.arrayBuffer();
    const response = await fetch(`${pythonServerUrl}/process-pdf`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${file.name}"`,
      },
      body: fileBuffer,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response from Python server:', response.status, errorText);
      throw new Error(`Python server responded with ${response.status}: ${errorText}`);
    }
    
    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in process-pdf:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}