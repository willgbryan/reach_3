import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/db/server';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  console.log('Create chart API route called');
  const db = createClient(cookies());

  try {
    const { tableId, tableContent } = await req.json();
    console.log('Received tableId:', tableId);
    console.log('Received table content length:', tableContent.length);

    if (!tableId || !tableContent) {
      console.log('Missing required fields');
      return NextResponse.json({ error: 'Table ID and content are required' }, { status: 400 });
    }

    const { data: { session } } = await db.auth.getSession();
    const userId = session?.user.id;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: userData, error: userError } = await db
      .from('user_config')
      .select('chart_config')
      .eq('user_id', userId)
      .single();

    if (userError && userError.code !== 'PGRST116') {
      throw userError;
    }

    const chartConfig = userData?.chart_config || {};

    const pythonServerUrl = process.env.PYTHON_SERVER_URL || 'http://backend:8000';
    console.log('Sending request to Python server:', pythonServerUrl);

    const response = await fetch(`${pythonServerUrl}/create-chart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tableId, tableContent, chartConfig }),
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