import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  console.log('Condense findings API route called');
  try {
    const { task, accumulatedOutput } = await req.json();
    console.log('Received task:', task);
    console.log('Received accumulated output length:', accumulatedOutput.length);

    if (!task || !accumulatedOutput) {
      console.log('Missing required fields');
      return NextResponse.json({ error: 'Task and accumulated output are required' }, { status: 400 });
    }

    const pythonServerUrl = process.env.PYTHON_SERVER_URL || 'http://backend:8000';
    console.log('Sending request to Python server:', pythonServerUrl);

    const response = await fetch(`${pythonServerUrl}/condense-findings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ task, accumulatedOutput }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response from Python server:', response.status, errorText);
      throw new Error(`Python server responded with ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log('Received condensed findings');

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in condense-findings:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
}