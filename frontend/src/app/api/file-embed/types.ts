import { Document as BaseDocument } from '@pinecone-database/doc-splitter'

interface DocumentMetadata {
  setName: string | undefined
  fileName: string
  text: string
  id: string // hash of the document content.
  chunk: string // Represents a chunk of the document content.
  hash: string // Hash of the document content.
}
export type DocumentEmbedding = number[]

export type DocumentData = {
  content: string
  embedding: DocumentEmbedding
  metadata: DocumentMetadata
  document_set_id: string
  name: string
}

// CustomDocument extends the basic document structure with application-specific properties.
export interface CustomDocument extends BaseDocument {
  text: string // Full text of the document.
  setName: string // Name of the document set.
  fileName: string // Original file name of the document.
}

// Type definition for the response of the embedAndStoreFileData function.
export type EmbedAndStoreRes = {
  success: boolean
  message: string
  documents?: CustomDocument[]
  error?: any
}
