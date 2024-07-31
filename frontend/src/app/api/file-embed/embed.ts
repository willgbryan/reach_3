import { cookies } from 'next/headers'
import {
  Document as BaseDocument,
  RecursiveCharacterTextSplitter,
} from '@pinecone-database/doc-splitter'
import md5 from 'md5'
import OpenAI from 'openai'

import { BATCH_UPSERT_LIMIT, EMBEDDING_TABLE_NAME } from '@/config/constants'
import { createClient } from '@/db/server'

import { CustomDocument, DocumentData, EmbedAndStoreRes } from './types'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Processes and stores file data in the database
export async function embedAndStoreFileData({
  fileData,
  docSetId,
  fileName = '',
  docSetName,
}: {
  fileData: string
  docSetId: string
  fileName: string
  docSetName: string
}): Promise<EmbedAndStoreRes> {
  try {
    const documents = await splitFileIntoDocuments({
      fileData,
      fileName,
      docSetName,
    })
    const enrichedVectors = await Promise.all(
      documents.map((doc) => embedDocument({ doc, docSetId, docSetName })),
    )
    await chunkedBatchInsert({ enrichedVectors })

    return { success: true, message: 'File processed successfully', documents }
  } catch (error) {
    console.error('Error in processing file data:', error)
    return { success: false, message: 'Error processing file data', error }
  }
}

// Splits file data into CustomDocument objects
async function splitFileIntoDocuments({
  fileData,
  docSetName,
  fileName,
}: {
  fileData: string
  docSetName: string
  fileName: string
}): Promise<CustomDocument[]> {
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  })
  return (await textSplitter.splitDocuments([new BaseDocument({ pageContent: fileData })])).map(
    (doc) => ({ ...doc, text: fileData, setName: docSetName, fileName }),
  )
}

// Creates embeddings for a document
async function embedDocument({
  docSetName,
  docSetId,
  doc,
}: {
  doc: CustomDocument
  docSetId: string
  docSetName: string
}): Promise<DocumentData> {
  const embedding = await getEmbeddings(doc.pageContent)
  const hash = md5(doc.pageContent)

  return {
    content: doc.pageContent,
    embedding,
    metadata: { ...doc, id: hash, chunk: doc.pageContent, hash },
    document_set_id: docSetId,
    name: docSetName,
  }
}

// Generates embeddings using the OpenAI API
async function getEmbeddings(input: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: input.replace(/\n/g, ' '),
    })
    return response.data[0].embedding
  } catch (e) {
    console.error('Error calling OpenAI embedding API: ', e)
    throw new Error(`Error calling OpenAI embedding API: ${e}`)
  }
}

// Batch inserts vectors into the database
const chunkedBatchInsert = async ({ enrichedVectors }: { enrichedVectors: any[] }) => {
  // Pass the array as part of an object to sliceIntoBatches
  const batches = sliceIntoBatches({ arr: enrichedVectors })
  const supabase = createClient(cookies())

  try {
    await Promise.allSettled(
      batches.map(async (batch) => {
        const { error } = await supabase.from(EMBEDDING_TABLE_NAME).insert(batch)
        if (error) throw error
      }),
    )
  } catch (error) {
    console.error('Error in batch inserting records:', error)
    throw new Error(`Error batch inserting records: ${error}`)
  }
}

// Utility function to split an array into batches
const sliceIntoBatches = <T>({ arr }: { arr: T[] }): T[][] => {
  return Array.from({ length: Math.ceil(arr.length / BATCH_UPSERT_LIMIT) }, (_, i) =>
    arr.slice(i * BATCH_UPSERT_LIMIT, (i + 1) * BATCH_UPSERT_LIMIT),
  )
}
