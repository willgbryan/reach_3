import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  console.log('Create chart API route called');
  try {
    const { tableId, tableContent } = await req.json();
    console.log('Received tableId:', tableId);
    console.log('Received table content length:', tableContent.length);

    if (!tableId || !tableContent) {
      console.log('Missing required fields');
      return NextResponse.json({ error: 'Table ID and content are required' }, { status: 400 });
    }

    const pythonServerUrl = process.env.PYTHON_SERVER_URL || 'http://backend:8000';
    console.log('Sending request to Python server:', pythonServerUrl);

    const response = await fetch(`${pythonServerUrl}/create-chart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tableId, tableContent }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response from Python server:', response.status, errorText);
      throw new Error(`Python server responded with ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log('Received chart data');
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in create-chart:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
}