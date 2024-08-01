'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Message } from 'ai'
import showdown from 'showdown';

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
  const { setSize } = useDynamicBlobSize()
  const { docSetName } = useDocSetName()
  const { setFileData } = useFileData()
  const { setStage } = useStage()
  const [reportType, setReportType] = useState('research_report')

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
    accumulatedData,
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
      <ChatSection 
        messages={messages} 
        sources={sources} 
        isLoading={isLoading} 
        accumulatedData={accumulatedData}
        reportType={reportType}
      />
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
        setReportType={setReportType}
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

const ChatSection = ({ messages, sources, isLoading, accumulatedData, reportType }) => {
  const [reportContent, setReportContent] = useState('')
  const converter = new showdown.Converter()

  useEffect(() => {
    if (reportType === 'table') {
      const htmlTable = convertCSVToHTMLTable(accumulatedData)
      setReportContent(htmlTable)
    } else {
      const converter = new showdown.Converter()
      const markdownOutput = converter.makeHtml(accumulatedData)
      setReportContent(markdownOutput)
    }
  }, [accumulatedData, reportType])

  return (
    <div className="flex flex-col items-center pt-6">
      {messages.length > 0 ? (
        <div className="pb-[100px] md:pb-40">
          <ChatList messages={messages} sources={sources} />
          <div id="reportContainer" dangerouslySetInnerHTML={{ __html: reportContent }} />
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
  setReportType,
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
      <select onChange={(e) => setReportType(e.target.value)}>
        <option value="research_report">Research Report</option>
        <option value="table">Table</option>
      </select>
    </div>
  )
}

export default MainVectorPanel

// helper functions
const convertCSVToHTMLTable = (csv: string): string => {
  const rows = csv.trim().split('\n')
  let html = '<table class="table table-bordered table-responsive">'

  html += '<thead class="thead-dark"><tr>'
  parseCSVLine(rows[0]).forEach(header => {
    html += `<th>${header}</th>`
  })
  html += '</tr></thead>'

  html += '<tbody>'
  rows.slice(1).forEach(row => {
    html += '<tr>'
    parseCSVLine(row).forEach(cell => {
      html += `<td>${cell}</td>`
    })
    html += '</tr>'
  })
  html += '</tbody>'
  html += '</table>'

  return html
}

const parseCSVLine = (line: string): string[] => {
  let result: string[] = []
  let startValueIdx = 0
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    if (line[i] === '"' && line[i - 1] !== '\\') {
      inQuotes = !inQuotes
      continue
    }
    
    if (line[i] === ',' && !inQuotes) {
      result.push(decodeCSVValue(line.substring(startValueIdx, i)))
      startValueIdx = i + 1
    }
  }
  result.push(decodeCSVValue(line.substring(startValueIdx)))

  return result
}

const decodeCSVValue = (value: string): string => {
  let trimmedValue = value.trim()
  if (trimmedValue.startsWith('"') && trimmedValue.endsWith('"')) {
    trimmedValue = trimmedValue.substring(1, trimmedValue.length - 1)
  }
  return trimmedValue.replace(/\\"/g, '"')
}