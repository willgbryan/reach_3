// utils/messageUtils.ts

import { Message as VercelChatMessage } from 'ai'
import { Document } from 'langchain/document'

/**
 * Combines the content of documents with an optional separator.
 */
export function combineDocuments(docs: Document[], separator = '\n\n'): string {
  return docs.map((doc) => doc.pageContent).join(separator)
}

/**
 * Formats the chat history for use in conversational chains.
 */
export function formatVercelMessages(chatHistory: VercelChatMessage[]): string {
  return chatHistory
    .map((message) => {
      switch (message.role) {
        case 'user':
          return `Human: ${message.content}`
        case 'assistant':
          return `Assistant: ${message.content}`
        default:
          return `${message.role}: ${message.content}`
      }
    })
    .join('\n')
}

// Returns the last message sent by the user.
export function getLastUserMessage(messages) {
  return messages.reverse().find((m) => m.role === 'user')?.content
}

// Encodes the sources as a base64 string.
export function encodeSources(documents) {
  return Buffer.from(JSON.stringify(documents.map(serializeDocument))).toString('base64')
}

// Serializes a document for encoding.
export function serializeDocument(doc) {
  return {
    pageContent: doc?.pageContent?.slice(0, 50) + '...',
    metadata: doc.metadata,
  }
}
