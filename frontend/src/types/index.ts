import { type Message } from 'ai'
import * as d3 from 'd3';

export interface Chat extends Record<string, any> {
  id: string
  title: string
  createdAt: Date
  userId: string
  path: string
  messages: Message[]
  sharePath?: string
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

declare global {
  interface Window {
    d3: typeof d3;
  }
}

export {}