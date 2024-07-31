export type Document = {
  pageContent: string
  metadata: Record<string, any> // Adjust according to the actual structure of metadata
}

export type Message = {
  content: string
  role: 'user' | 'assistant'
}
