import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'
import { nanoid } from 'nanoid'
import { createClient } from '@/db/server'

export async function POST(req: NextRequest) {
  const db = createClient(cookies())
  const {
    data: { session },
  } = await db.auth.getSession()
  const userId = session?.user.id

  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  const json = await req.json()
  const { messages, id: chatId, edits } = json
  const lastMessage = messages[messages.length - 1]
  const task = lastMessage?.content || ''

  // Generate a new chatId if one wasn't provided
  const actualChatId = chatId || nanoid()

  const isProduction = process.env.NODE_ENV === 'production';
  
  // PROD
  // const ws_uri = `wss://heighliner.tech/ws`;

  // //DEV
  const ws_uri = `ws://backend:8000/ws`


  const socket = new WebSocket(ws_uri)

  let accumulatedOutput = ''

  return new Response(
    new ReadableStream({
      start(controller) {
        socket.onopen = () => {
          console.log('WebSocket connection opened');
          const requestData = {
            task: task,
            report_type: "research_report",
            sources: ["WEB"],
            ...(edits && { edits }),
          }
          console.log('Sending data to WebSocket:', requestData);
          socket.send(`${JSON.stringify(requestData)}`)
        }
        
        socket.onmessage = async (event) => {
          const data = JSON.parse(event.data)
          console.log(`Received WebSocket data: ${JSON.stringify(data)}`);
          if (data.type === 'report' || data.type === 'logs') {
            controller.enqueue(new TextEncoder().encode(JSON.stringify(data)))

            if (data.type === 'report') {
              accumulatedOutput += data.output
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
              chatId: actualChatId,
              completion: accumulatedOutput,
              messages,
              userId,
              db,
            })
          }
          controller.close()
        }
      },
      cancel() {
        socket.close()
      },
    }),
    {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    }
  )
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
    title: messages[0].content.substring(0, 100),
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