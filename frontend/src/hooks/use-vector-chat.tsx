'use client'
import { useState, useRef } from 'react'
import { useChat } from 'ai/react'
import { toast } from 'sonner'

export function useVectorChat(id, docSetName, initialMessages, initialSources) {
  const [sourcesForMessages, setSourcesForMessages] = useState(() => initialSources)
  const [accumulatedData, setAccumulatedData] = useState('')
  const wsRef = useRef(null)

  const { messages, append, reload, isLoading, input, setInput, setMessages, stop } = useChat({
    initialMessages,
    api: `/api/chat`,
    id,
    body: {
      id,
      setName: docSetName,
      sources: sourcesForMessages,
    },
    onResponse,
    onError,
  })

  function onResponse(response) {
    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    async function readStream() {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')
        for (const line of lines) {
          if (line.trim() !== '') {
            const data = JSON.parse(line)
            if (data.type === 'report') {
              setAccumulatedData(prev => prev + data.output)
            }
          }
        }
      }
    }

    readStream()

    // const sourcesHeader = response.headers.get('x-sources')
    // const sources = sourcesHeader ? JSON.parse(atob(sourcesHeader)) : []
    // const messageIndexHeader = response.headers.get('x-message-index')
    // if (sources.length && messageIndexHeader !== null) {
    //   setSourcesForMessages((prevSources) => ({
    //     ...prevSources,
    //     [messageIndexHeader]: sources,
    //   }))
    // }
  }

  function onError(e) {
    toast(e.message)
  }

  return {
    messages,
    append,
    reload,
    isLoading,
    input,
    stop,
    setInput,
    setMessages,
    sourcesForMessages,
    setSourcesForMessages,
    accumulatedData,
  }
}