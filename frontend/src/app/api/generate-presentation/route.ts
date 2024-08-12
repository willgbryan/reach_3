// app/api/generate-powerpoint/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createReadStream } from 'fs';
import { stat } from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  console.log('PowerPoint generation API route called');
  try {
    const { prompt } = await req.json();
    console.log('Received prompt:', prompt);

    if (!prompt) {
      console.log('No prompt provided');
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const pythonServerUrl = process.env.PYTHON_SERVER_URL || 'http://backend:8000';
    console.log('Sending request to Python server:', pythonServerUrl);
    const response = await fetch(`${pythonServerUrl}/generate-powerpoint`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response from Python server:', response.status, errorText);
        throw new Error(`Python server responded with ${response.status}: ${errorText}`);
      }

    const data = await response.json();
    console.log('Received data from Python server:', data);
    
    // Get the file path from the Python server response
    const filePath = path.join(process.cwd(), data.file_path);
    console.log('File path:', filePath);

    // Check if file exists
    try {
      await stat(filePath);
      console.log('File exists');
    } catch (error) {
      console.error('File not found:', error);
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Create a readable stream
    const fileStream = createReadStream(filePath);

    console.log('Returning file stream');
    // Return the file as a stream
    return new NextResponse(fileStream as any, {
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