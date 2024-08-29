import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  console.log('PowerPoint generation API route called');
  try {
    const { prompt, filePath, favoriteTheme, signedUrl } = await req.json();
    console.log('Received prompt:', prompt, 'filePath:', filePath, 'favoriteTheme:', favoriteTheme, 'signedUrl:', signedUrl);

    if (!prompt || !filePath || !signedUrl) {
      console.log('Missing required parameters');
      return NextResponse.json({ error: 'Prompt, file path, and signed URL are required' }, { status: 400 });
    }

    const pythonServerUrl = process.env.PYTHON_SERVER_URL || 'http://backend:8000';
    console.log('Sending request to Python server:', pythonServerUrl);

    const response = await fetch(`${pythonServerUrl}/generate-powerpoint`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, filePath, favoriteTheme, signedUrl }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response from Python server:', response.status, errorText);
      throw new Error(`Python server responded with ${response.status}: ${errorText}`);
    }

    const fileContent = await response.arrayBuffer();
    return new NextResponse(fileContent, {
      headers: {
        'Content-Disposition': `attachment; filename="generated_presentation.pptx"`,
        'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      },
    });
  } catch (error) {
    console.error('Error in generate-powerpoint:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
}