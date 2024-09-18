import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
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

  const formData = await req.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: 'File is required' }, { status: 400 });
  }

  const fileExt = file.name.split('.').pop();
  const filePath = `${userId}/${file.name}`;

  const { data, error } = await db.storage
    .from('user_uploads')
    .createSignedUrl(filePath, 300); // valid for 5 minutes

  if (error || !data) {
    console.error('Error generating signed URL:', error);
    return NextResponse.json({ error: 'Error generating signed URL' }, { status: 500 });
  }

  const signedUrl = data.signedUrl;

  const chatId = nanoid()

  const ws_uri = 'ws://backend:8000/ws'
  // const ws_uri = 'wss://heighliner.tech/ws'

  let accumulatedOutput = ''

  const stream = new ReadableStream({
    start(controller) {
      const socket = new WebSocket(ws_uri);

      socket.onopen = () => {
        console.log('WebSocket connection opened');
        const requestData = {
          task: "The following is a legal document that I would like analyzed. I need to understand the key important pieces with the relevant cited language as well as any language that can be loosely interpreted. Correct legal Bluebook citations are key.",
          report_type: "document_analysis",
          sources: ["FILES"],
          file_url: signedUrl,
          file_path: filePath,
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
              output: data.output,
              accumulatedOutput: accumulatedOutput
            }) + '\n\n'))
          } else {
            controller.enqueue(new TextEncoder().encode(JSON.stringify(data) + '\n\n'))
          }
        }
      }

      socket.onerror = (error) => {
        console.error("WebSocket error:", error)
        controller.error(error)
      }

      socket.onclose = async () => {
        console.log("WebSocket connection closed")
        if (accumulatedOutput) {
          await saveChatHistory({
            chatId,
            completion: accumulatedOutput,
            messages: [{ content: "The following is a legal document that I would like analyzed. I need to understand the key important pieces with the relevant cited language as well as any language that can be loosely interpreted. Correct legal Bluebook citations are key.", role: "user" }],
            userId,
            db,
          })
        }
        controller.close()
      }

      // Store the socket in the controller for later use
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

interface ChatHistoryParams {
  chatId: string
  completion: string
  messages: any[]
  userId: string
  db: ReturnType<typeof createClient>
}

async function saveChatHistory({
  chatId,
  completion,
  messages,
  userId,
  db,
}: ChatHistoryParams): Promise<void> {
  const newMessage = {
    content: completion,
    role: 'assistant',
    messageIndex: messages.length.toString(),
  }

  const chatPayload = {
    title: "Document Analysis",
    userId,
    id: chatId,
    createdAt: new Date().toISOString(),
    path: `/chat/${chatId}`,
    messages: [...messages, newMessage],
  }

  const { error } = await db
    .from('chats')
    .upsert({
      id: chatId,
      user_id: userId,
      payload: chatPayload,
    })

  if (error) {
    console.error('Error saving chat history:', error)
    throw error
  }
}