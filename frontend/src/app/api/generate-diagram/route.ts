import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  console.log('Diagram generation API route called');
  try {
    const { content, diagramType } = await req.json();
    console.log('Received content:', content);
    console.log('Received diagram type:', diagramType);

    if (!content || !diagramType) {
      console.log('Missing required parameters');
      return NextResponse.json({ error: 'Content and diagramType are required' }, { status: 400 });
    }

    const pythonServerUrl = process.env.PYTHON_SERVER_URL || 'http://backend:8000';
    console.log('Sending request to Python server:', pythonServerUrl);

    const response = await fetch(`${pythonServerUrl}/generate-diagram`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content, diagramType }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response from Python server:', response.status, errorText);
      throw new Error(`Python server responded with ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in generate-diagram:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
}