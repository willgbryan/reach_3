import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { createClient } from '@/db/server'

export const dynamic = 'force-dynamic';

interface FileData {
  name: string;
  type: string;
  size: number;
}

interface SignedUrlData {
  signedUrl: string;
}

function isFileData(value: unknown): value is FileData {
  return (
    typeof value === 'object' &&
    value !== null &&
    'name' in value &&
    'type' in value &&
    'size' in value &&
    typeof (value as any).name === 'string' &&
    typeof (value as any).type === 'string' &&
    typeof (value as any).size === 'number'
  );
}

const DEFAULT_TASK = "The following are legal documents that I would like analyzed. I need to understand the key important pieces with the relevant cited language as well as any language that can be loosely interpreted. Bluebook citations are key.";

export async function POST(req: NextRequest) {
  const db = createClient(cookies())
  const {
    data: { session },
  } = await db.auth.getSession()
  const userId = session?.user.id

  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const contentType = req.headers.get('content-type') || '';

  let task = '';
  let analysisId = '';
  let sources: string[] = [];
  let filePaths: string[] = [];
  let signedUrls: string[] = [];
  let messages: any[] = [];

  if (contentType.includes('multipart/form-data')) {
    const formData = await req.formData();
    const files: FileData[] = [];

    for (const [key, value] of formData.entries()) {
      if (key === 'task' && typeof value === 'string') {
        task = value;
      } else if (key === 'analysisId' && typeof value === 'string') {
        analysisId = value;
      } else if (isFileData(value)) {
        files.push({
          name: value.name,
          type: value.type,
          size: value.size
        });
      }
    }

    if (files.length === 0) {
      return NextResponse.json({ error: 'Files are required' }, { status: 400 });
    }

    sources = ["FILES"];

    for (const { name } of files) {
      const filePath = `${userId}/${name}`;
      filePaths.push(filePath);

      const { data, error } = await db.storage
        .from('user_uploads')
        .createSignedUrl(filePath, 300); // valid for 5 minutes

      if (error || !data) {
        console.error('Error generating signed URL:', error);
        return NextResponse.json({ error: 'Error generating signed URL' }, { status: 500 });
      }

      signedUrls.push((data as SignedUrlData).signedUrl);
    }
  } else if (contentType.includes('application/json')) {
    const jsonData = await req.json();
    task = jsonData.messages[0].content;
    analysisId = jsonData.analysisId;
    sources = ["WEB"];
    messages = jsonData.messages;
  } else {
    return NextResponse.json({ error: 'Unsupported content type' }, { status: 400 });
  }

  if (!task) {
    task = DEFAULT_TASK;
  }

  if (!analysisId) {
    analysisId = `analysis-${nanoid()}`;
  }

  const chatId = nanoid()

  // PROD
  const ws_uri = `wss://heighliner.tech/ws`;

  // //DEV
  // const ws_uri = `ws://backend:8000/ws`

  let accumulatedOutput = ''

  const stream = new ReadableStream({
    start(controller) {
      const socket = new WebSocket(ws_uri);

      socket.onopen = () => {
        console.log('WebSocket connection opened');
        const requestData = {
          task: task,
          report_type: "research_report",
          sources: sources,
          file_urls: signedUrls,
          file_paths: filePaths,
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
        if (accumulatedOutput) {
          await saveChatHistory({
            chatId,
            completion: accumulatedOutput,
            messages: messages.length > 0 ? messages : [{ content: task, role: "user" }],
            userId,
            db,
            filePaths,
            analysisId,
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
  filePaths: string[]
  analysisId: string
}

async function saveChatHistory({
  chatId,
  completion,
  messages,
  userId,
  db,
  filePaths,
  analysisId,
}: ChatHistoryParams): Promise<void> {
  const newMessage = {
    content: completion,
    role: 'assistant',
    messageIndex: messages.length.toString(),
  }

  const chatPayload = {
    id: chatId,
    title: "DocumentAnalysis",
    userId,
    path: `/analysis/${chatId}`,
    messages: [...messages, newMessage],
    filePaths: filePaths,
    createdAt: new Date().toISOString(),
    analysisId,
  }

  const { error } = await db
    .from('chats')
    .upsert({
      id: chatId,
      user_id: userId,
      payload: chatPayload,
      is_newsletter: false
    })

  if (error) {
    console.error('Error saving chat history:', error)
    throw error
  }
}