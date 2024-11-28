import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/db/server'

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const db = createClient(cookies())
  const {
    data: { session },
  } = await db.auth.getSession()
  const userId = session?.user.id

  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const jsonData = await req.json();
  const { selectedText, prompt, jurisdictions, analysisId } = jsonData;

  // PROD
  // const ws_uri = `wss://heighliner.tech/ws`;

  // //DEV
  const ws_uri = `ws://backend:8000/ws`

  let accumulatedOutput = ''

  const stream = new ReadableStream({
    start(controller) {
      const socket = new WebSocket(ws_uri);

      socket.onopen = () => {
        console.log('WebSocket connection opened');
        const requestData = {
          task: `Please suggest improvements for the following contract text based on this request: "${prompt}"\n\nText to revise: ${selectedText}${
            jurisdictions?.length > 0 ? `\n\nLegal Jurisdictions: ${jurisdictions.join(', ')}` : ''
          }\n\nPlease provide the revised text only, without any explanations.`,
          report_type: "follow_up",
          sources: [""],
          analysisId
        }
        console.log('Sending data to WebSocket:', requestData);
        socket.send(JSON.stringify(requestData))
      }

      socket.onmessage = async (event) => {
        const data = JSON.parse(event.data)
        console.log(`Received WebSocket data: ${JSON.stringify(data)}`);
        if (data.type === 'report' || data.type === 'logs') {
          if (data.type === 'report') {
            accumulatedOutput += data.output
            controller.enqueue(new TextEncoder().encode(JSON.stringify({
              type: data.type,
              output: data.output
            }) + '\n\n'))
          } else {
            controller.enqueue(new TextEncoder().encode(JSON.stringify(data) + '\n\n'))
          }
        } else if (data.type === 'complete') {
          socket.close()
        }
      }

      socket.onerror = (error) => {
        console.error("WebSocket error:", error)
        controller.error(error)
      }

      socket.onclose = async () => {
        console.log("WebSocket connection closed")
        controller.close()
      }

      (controller as any).socket = socket;
    },
    cancel(controller) {
      const socket = (controller as any).socket as WebSocket | undefined;
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    },
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}