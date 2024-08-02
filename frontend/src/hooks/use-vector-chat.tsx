'use client'
import { useState, useRef, useEffect } from 'react'
import { useChat } from 'ai/react'
import { toast } from 'sonner'

export function useVectorChat(id, docSetName, initialMessages, initialSources, edits = '', editSubmissionCounter = 0) {
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
      ...(edits && { edits }),
    },
    onResponse,
    onError,
  })

  useEffect(() => {
    if (editSubmissionCounter > 0) {
      reload()
      setAccumulatedData('')
    }
  }, [editSubmissionCounter, reload])

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