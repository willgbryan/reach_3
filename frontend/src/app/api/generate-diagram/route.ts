import { NextRequest, NextResponse } from 'next/server';

function cleanMermaidCode(code: string, diagramType: string): string {
  let cleanedCode = code.replace(/```mermaid\n?/g, '').replace(/```\n?/g, '').trim();

  if (diagramType.toLowerCase() === 'c4context') {
    cleanedCode = cleanedCode.replace(/^c4context\s*\n?/i, '');
    
    if (!cleanedCode.startsWith('C4Context')) {
      cleanedCode = `C4Context\n${cleanedCode}`;
    }
  } else {
    const diagramTypeRegex = new RegExp(`^${diagramType}\\s*\\n`, 'i');
    cleanedCode = cleanedCode.replace(diagramTypeRegex, '');

    if (!cleanedCode.startsWith(diagramType)) {
      cleanedCode = `${diagramType}\n${cleanedCode}`;
    }
  }

  console.log('Cleaned Mermaid code:', cleanedCode);
  return cleanedCode;
}

export async function POST(req: NextRequest) {
  console.log('Diagram generation API route called');
  
  try {
    const { content, diagramType, previousError } = await req.json();
    console.log('Received content:', content);
    console.log('Received diagram type:', diagramType);
    console.log('Previous error:', previousError);
    
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
      body: JSON.stringify({ content, diagramType, previousError }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response from Python server:', response.status, errorText);
      throw new Error(`Python server responded with ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    let mermaidCode = data.mermaid_code;

    let finalCode = cleanMermaidCode(mermaidCode, diagramType);

    return NextResponse.json({ mermaid_code: finalCode });
  } catch (error) {
    console.error('Error in generate-diagram:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
}