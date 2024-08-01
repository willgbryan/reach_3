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
  const { messages, id: chatId } = json
  const lastMessage = messages[messages.length - 1]
  const task = lastMessage?.content || ''

  const ws_uri = `ws://${process.env.NEXT_PUBLIC_BACKEND_URL}/ws`
  const socket = new WebSocket(ws_uri)

  return new Response(
    new ReadableStream({
      start(controller) {
        socket.onopen = () => {
          const requestData = {
            task: task,
            report_type: "research_report",
            sources: ["WEB"]
          }
          socket.send(`${JSON.stringify(requestData)}`)
        }

        socket.onmessage = async (event) => {
          const data = JSON.parse(event.data)
          if (data.type === 'report' || data.type === 'logs') {
            controller.enqueue(new TextEncoder().encode(JSON.stringify(data)))
            console.log(`data ${data}`)

            // Save chat history after each message
            // if (data.type === 'report') {
            //   await saveChatHistory({
            //     chatId,
            //     completion: data.output,
            //     documents: [], // You may need to adjust this if your backend provides documents
            //     messages,
            //     userId,
            //     db,
            //   })
            // }
          }
        }

        socket.onerror = (error) => {
          console.error("WebSocket error:", error)
          controller.error(error)
        }

        socket.onclose = () => {
          console.log("WebSocket connection closed")
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
  documents: Document[]
  messages: any[]
  sources: Record<string, any>
  userId: string
  db: ReturnType<typeof createClient>
}

interface Document {
  pageContent: string
  metadata: {
    hash: string
    [key: string]: any
  }
}

async function saveChatHistory({
  chatId,
  completion,
  documents,
  messages,
  userId,
  db,
}: ChatHistoryParams): Promise<void> {
  // Create the new message object for the assistant's response
  const newMessage = {
    content: completion,
    role: 'assistant',
    messageIndex: messages.length.toString(), // Index for the new message
  }

  // Update the chat payload with the new message
  const chatPayload = {
    title: messages[0].content.substring(0, 100), // Use the first message as the title
    userId,
    id: chatId,
    createdAt: new Date().toISOString(),
    path: `/chat/${chatId}`,
    messages: [...messages, newMessage], // Append the new message to the existing ones
  }

  // Save the updated chat payload to the database
  await db
    .from('chats')
    .upsert({
      id: chatId,
      user_id: userId,
      payload: chatPayload,
    })
    .throwOnError()

  // Handle each document for sources and source-map association
  for (const doc of documents) {
    const sourceId = await findOrCreateSource(db, doc)

    // Create source-chat mapping
    const mapPayload = {
      mapping_id: nanoid(),
      chat_id: chatId,
      source_id: sourceId,
      messageindex: messages.length.toString(), // Use the new message index
    }

    // Insert the mapping into the source_chat_map table
    await db.from('source_chat_map').insert(mapPayload).throwOnError()
  }
}

// This function finds an existing source or creates a new one if it doesn't exist.
async function findOrCreateSource(db, doc): Promise<string> {
  // Check if source already exists based on the document hash
  const { data: existingSource, error: fetchError } = await db
    .from('sources')
    .select('id')
    .eq('document_hash', doc.metadata.hash)
    .single()

  if (fetchError) {
    console.error('Error fetching source:', fetchError)
  }

  if (existingSource) {
    // Return the existing source ID
    return existingSource.id
  } else {
    // Create a new source since it doesn't exist
    const newSourceId = nanoid()
    const { error: insertError } = await db
      .from('sources')
      .insert({
        id: newSourceId,
        content: doc.pageContent,
        metadata: doc.metadata,
        document_hash: doc.metadata.hash, // Assuming that doc.metadata.hash is the unique hash of the document content
      })
      .throwOnError()

    if (insertError) {
      console.error('Error creating new source:', insertError)
      throw insertError
    }

    return newSourceId
  }
}
