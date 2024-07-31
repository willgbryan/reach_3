'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Message } from 'ai'

import { SelectScrollable } from '@/components/chat/chat-document-sets'
import { ChatList } from '@/components/chat/chat-list'
import { ChatScrollAnchor } from '@/components/chat/chat-scroll-anchor'
import { SIZE_PRESETS, useDynamicBlobSize } from '@/components/cult/dynamic-blob'
import { Heading } from '@/components/cult/gradient-heading'
import { useGetDocumentSets } from '@/hooks/use-get-document-sets'
import { useDocSetName, useFileData, useStage } from '@/hooks/use-vector-blob'
import { useVectorChat } from '@/hooks/use-vector-chat'

import { BlobActions } from './blob-actions'
import { BlobStates } from './blob-states'
import { ChatState } from './chat-states/chat'

interface MainVectorPanelProps {
  id?: string | undefined
  user?: any
  initialMessages?: Message[]
  initialSources?: any
}

const MainVectorPanel = ({ id, initialMessages, initialSources }: MainVectorPanelProps) => {
  const { data: documentSets } = useGetDocumentSets()
  const { setSize } = useDynamicBlobSize() // manage the size of the dynamic blob
  const { docSetName } = useDocSetName() // docSet will filter the vector similarity search
  const { setFileData } = useFileData() // file upload data
  const { setStage } = useStage() // upload or chat
  // Hook for streaming ai responses with sources
  const {
    messages,
    sourcesForMessages,
    isLoading,
    append,
    setInput,
    setMessages,
    input,
    stop,
    reload,
  } = useVectorChat(id, docSetName, initialMessages, initialSources)

  const router = useRouter()

  const handleInputClick = async (value) => {
    if (value.length >= 1) {
      await append({
        content: value,
        role: 'user',
      })
      setInput('')
    }
  }

  function handleReset() {
    setStage('reset')
    setSize(SIZE_PRESETS.LONG)
    setFileData(null)
    setMessages([])
    router.push('/chat')
  }

  const sources = sourcesForMessages ?? initialSources?.sources

  return (
    <div className="h-full w-full">
      <TopSection docSetName={docSetName} documentSets={documentSets} />
      <ChatSection messages={messages} sources={sources} isLoading={isLoading} />
      <BottomSection
        handleInputClick={handleInputClick}
        handleReset={handleReset}
        isLoading={isLoading}
        messages={messages}
        setInput={setInput}
        reload={reload}
        input={input}
        stop={stop}
        id={id}
      />
    </div>
  )
}

const TopSection = ({ docSetName, documentSets }) => {
  return (
    <div className="flex justify-center items-center pt-8">
      <SelectScrollable prevDocSets={documentSets} />
      <div className="absolute right-8 top-8">
        <Heading>{docSetName}</Heading>
      </div>
    </div>
  )
}

const ChatSection = ({ messages, sources, isLoading }) => {
  return (
    <div className="flex flex-col items-center pt-6">
      {messages.length > 0 ? (
        <div className="pb-[100px] md:pb-40">
          <ChatList messages={messages} sources={sources} />
          <ChatScrollAnchor trackVisibility={isLoading} />
        </div>
      ) : (
        <div className="pt-64 md:pt-16">
          <Heading>Where knowledge begins</Heading>
        </div>
      )}
    </div>
  )
}

const BottomSection = ({
  id,
  handleReset,
  handleInputClick,
  messages,
  isLoading,
  setInput,
  input,
  stop,
  reload,
}) => {
  return (
    <div className="absolute bottom-2 md:bottom-8 left-0 right-0" key={id}>
      <BlobActions messages={messages} handleReset={handleReset} />
      <BlobStates messages={messages} isLoading={isLoading} reload={reload} stop={stop}>
        <ChatState
          loading={isLoading}
          disabled={isLoading}
          value={input}
          handleClick={handleInputClick}
          handleChange={setInput}
        />
      </BlobStates>
    </div>
  )
}

export default MainVectorPanel
