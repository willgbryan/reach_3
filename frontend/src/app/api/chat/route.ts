import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'
import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase'
import { OpenAIEmbeddings } from '@langchain/openai'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { nanoid } from 'nanoid'
import OpenAI from 'openai'

import { createClient } from '@/db/server'

import { RAG_CONFIG } from './config'
import { createRagPrompt } from './prompt'
import { combineDocuments, encodeSources } from './utils'

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
  const { setName } = json
  const messages = json.messages ?? []
  const latestUserMessageContent = messages[messages.length - 1]?.content ?? ''

  const documents = await getSimilarDocuments(db, setName, latestUserMessageContent)

  const prompt = createRagPrompt({
    context: combineDocuments(documents),
    question: latestUserMessageContent,
  })

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
  })

  const response = await openai.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    temperature: RAG_CONFIG.temperature,
    model: RAG_CONFIG.gptModel,
    stream: true,
  })

  const stream = createChatStream({
    chatId: json.id,
    documents,
    response,
    messages,
    sources: json.sources ?? {},
    userId,
    db,
  })

  const headers = {
    'x-message-index': messages.length.toString(),
    'x-sources': encodeSources(documents),
  }

  return new StreamingTextResponse(stream, { headers })
}

// Helper functions
async function getSimilarDocuments(db, setName, message) {
  const vectorStore = new SupabaseVectorStore(new OpenAIEmbeddings(), {
    client: db,
    tableName: 'document_sections',
    queryName: 'match_documents',
    filter: setName ? (rpc) => rpc.filter('metadata->>setName', 'eq', setName) : undefined,
  })
  return vectorStore.similaritySearch(message, RAG_CONFIG.kMeans)
}

function createChatStream({ chatId, documents, response, messages, sources, userId, db }) {
  return OpenAIStream(response, {
    async onCompletion(completion) {
      await saveChatHistory({
        chatId,
        completion,
        documents,
        messages,
        sources,
        userId,
        db,
      })
    },
  })
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
