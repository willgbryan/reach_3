'use client'

import { useState } from 'react'
import { useChat } from 'ai/react'
import { toast } from 'sonner'

export function useVectorChat(id, docSetName, initialMessages, initialSources) {
  const [sourcesForMessages, setSourcesForMessages] = useState(() => initialSources)
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
    const sourcesHeader = response.headers.get('x-sources')
    const sources = sourcesHeader ? JSON.parse(atob(sourcesHeader)) : []
    const messageIndexHeader = response.headers.get('x-message-index')
    if (sources.length && messageIndexHeader !== null) {
      setSourcesForMessages((prevSources) => ({
        ...prevSources,
        [messageIndexHeader]: sources,
      }))
    }
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
  }
}
