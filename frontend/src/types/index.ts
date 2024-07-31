import { type Message } from 'ai'

export interface Chat extends Record<string, any> {
  id: string
  title: string
  createdAt: Date
  userId: string
  path: string
  messages: Message[]
  sharePath?: string // Refactor to use RLS
}

export interface ChatWithSources extends Record<string, any> {
  payload: Chat
  sources: any
}

export type ServerActionResult<Result> = Promise<
  | Result
  | {
      error: string
    }
>
