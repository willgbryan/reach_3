import { ChatCompletionCreateParamsBase } from 'openai/resources/chat/completions'

type Config = {
  similarityThreshold: number
  gptModel: ChatCompletionCreateParamsBase['model']
  kMeans: number
  temperature: ChatCompletionCreateParamsBase['temperature']
}

export const RAG_CONFIG: Config = {
  kMeans: 5, // number of documents retrieved from similarity search
  similarityThreshold: 0.8, // control the level of similarity required for considering two vectors or sentences as related or similar.
  gptModel: 'gpt-3.5-turbo', // "gpt-4-1106-preview" | "gpt-4-vision-preview" | "gpt-4" | "gpt-4-0314" | "gpt-4-0613" | "gpt-4-32k" | "gpt-4-32k-0314" | "gpt-4-32k-0613" | "gpt-3.5-turbo"
  temperature: 0.7, // controls the randomness and creativity of the generated text. A higher temperature value, typically between 0 and 2, results in more random and creative outputs, while a lower value makes the outputs more deterministic and straightforward
}
