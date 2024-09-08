import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  console.log('Diagram generation API route called');
  try {
    const { content } = await req.json();
    console.log('Received content:', content);
    
    if (!content) {
      console.log('Missing required parameters');
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const pythonServerUrl = process.env.PYTHON_SERVER_URL || 'http://backend:8000';
    console.log('Sending request to Python server:', pythonServerUrl);

    const response = await fetch(`${pythonServerUrl}/generate-diagram`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response from Python server:', response.status, errorText);
      throw new Error(`Python server responded with ${response.status}: ${errorText}`);
    }

    const imageBuffer = await response.arrayBuffer();
    
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Disposition': `attachment; filename="generated_diagram.png"`,
        'Content-Type': 'image/png',
      },
    });
  } catch (error) {
    console.error('Error in generate-diagram:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
}