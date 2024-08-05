'use client'

import React, { Suspense, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Message } from 'ai'
import { nanoid } from 'nanoid'
import showdown from 'showdown';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ShootingStars } from "@/components/cult/shooting-stars";
import { StarsBackground } from "@/components/cult/stars-background";

import { ModeToggle } from '@/components/theme-toggle'

import { SelectScrollable } from '@/components/chat/chat-document-sets'
import { ChatList } from '@/components/chat/chat-list'
import { ChatScrollAnchor } from '@/components/chat/chat-scroll-anchor'
import { SIZE_PRESETS, useDynamicBlobSize } from '@/components/cult/dynamic-blob'
import { Heading } from '@/components/cult/gradient-heading'
import { useGetDocumentSets } from '@/hooks/use-get-document-sets'
import { useDocSetName, useFileData, useStage } from '@/hooks/use-vector-blob'
import { useVectorChat } from '@/hooks/use-vector-chat'

import SimpleInputForm from './simple-input';


import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { UserProvider } from '@/components/user-provider';

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
  const [showBottomSection, setShowBottomSection] = useState(true);
  const [showEditMode, setShowEditMode] = useState(false);
  const [edits, setEdits] = useState<string | undefined>(undefined)
  const [initialValue, setInitialValue] = useState('');

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
  } = useVectorChat(id, docSetName, initialMessages, initialSources, edits)

  const router = useRouter()

  const handleInputClick = async (value: string) => {
    if (value.length >= 1) {
      setInitialValue(value);
      const newMessage: Message = {
        id: nanoid(),
        content: value,
        role: 'user',
        createdAt: new Date()
      };
      await append(newMessage);
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, newMessage],
          id: id,
          edits: edits,
        }),
      });
  
      // log the response?...
      
      setInput('');
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

  const handleDigDeeper = () => {
    setShowEditMode(true);
    setShowBottomSection(false);
  };

  return (
    <div className="h-full w-full">
      <TopSection docSetName={docSetName} documentSets={documentSets} />
      <div className="w-full px-4">
        <ChatSection 
          messages={messages} 
          sources={sources} 
          isLoading={isLoading} 
          accumulatedData={accumulatedData}
          reportType={reportType}
          showEditMode={showEditMode}
          setShowEditMode={setShowEditMode}
          showBottomSection={showBottomSection}
          setShowBottomSection={setShowBottomSection}
          handleDigDeeper={handleDigDeeper}
          setEdits={setEdits}
          initialValue={initialValue}
        />
      </div>
      {showBottomSection && (
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
      )}
    </div>
  )
}

const ChatSection = ({ 
  messages, 
  sources, 
  isLoading, 
  accumulatedData, 
  reportType, 
  showEditMode,
  setShowEditMode,
  showBottomSection,
  setShowBottomSection,
  handleDigDeeper,
  setEdits,
  initialValue
}) => {
  const [reportContent, setReportContent] = useState('');
  const [currentText, setCurrentText] = useState('');
  const [deletedText, setDeletedText] = useState('');
  const [streamedData, setStreamedData] = useState('');
  const converter = new showdown.Converter();

  useEffect(() => {
    if (reportType === 'table') {
      const htmlTable = convertCSVToHTMLTable(accumulatedData);
      setReportContent(htmlTable);
    } else {
      setReportContent(accumulatedData);
    }
    setCurrentText(accumulatedData);

    if (accumulatedData) {
      setShowBottomSection(false);
    }
  }, [accumulatedData, reportType, setShowBottomSection]);

  const handleEditChange = (newContent) => {
    const oldContent = currentText;
    setCurrentText(newContent);

    // calculate the deleted text
    const deletedParts = oldContent.split(' ').filter(word => !newContent.includes(word));
    const newDeletedText = deletedParts.join(' ');
    setDeletedText(prevDeletedText => {
      const combinedDeletedText = prevDeletedText + ' ' + newDeletedText;
      return combinedDeletedText.trim();
    });
  };

  const handleNewQuery = () => {
    setCurrentText('');
    setShowBottomSection(true);
    setShowEditMode(false);
  };

  const onResponse = (url) => {
    const eventSource = new EventSource(url);
    
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'report') {
          setStreamedData(prev => prev + data.output);
        } else if (data.type === 'logs') {
          console.log('Received log:', data.output);
        }
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        console.log('Problematic data:', event.data);
      }
    };
  
    eventSource.onerror = (error) => {
      console.error('EventSource failed:', error);
      eventSource.close();
    };
  
    // You might want to add a way to close the connection when it's no longer needed
    return () => {
      eventSource.close();
    };
  };

  const handleSubmitEdits = async () => {
    const editsString = `user-retained:${currentText} user-deleted:${deletedText}`
    console.log(`edits string ${editsString}`)
    setEdits(editsString)
    setCurrentText('')
    setShowEditMode(false)
    setShowBottomSection(false)

    setStreamedData('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messages,
          edits: editsString,
          task: initialValue,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      onResponse(response);

    } catch (error) {
      console.error('Error:', error);
    }
  }

  useEffect(() => {
    if (streamedData) {
      setReportContent(streamedData);
      setCurrentText(streamedData);
      setShowBottomSection(false);
    }
  }, [streamedData]);

  const updatedMessages = [...messages, { content: reportContent, type: 'report' }];

  return (
    <div className="flex flex-col items-center">
      {updatedMessages.length > 0 ? (
        <div className="pb-[100px] md:pb-40">
          {showEditMode ? (
            <div className="flex flex-row space-x-4">
              <div className="w-1/2">
                <ChatList messages={updatedMessages} sources={sources} />
              </div>
              <div className="w-1/2 flex flex-col pt-12">
                <ReactQuill 
                  value={currentText} 
                  className='max-w-full p-2 shadow-sm sm:p-4 no-border'
                  onChange={handleEditChange}
                />
                <Button variant="ghost" onClick={handleSubmitEdits} className="mt-12">Submit Edits</Button>
              </div>
            </div>
          ) : (
            <ChatList messages={updatedMessages} sources={sources} />
          )}
          <ChatScrollAnchor trackVisibility={isLoading} />
          {!showBottomSection && accumulatedData && (
            <div className="flex justify-center space-x-4 mt-4">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline">New Query</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to start a new query?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action will clear the existing report. This cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleNewQuery}>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button onClick={handleDigDeeper} variant="outline">Dig Deeper</Button>
            </div>
          )}
        </div>
      ) : (
        <div className="pt-64 md:pt-16">
          <Heading>Where knowledge begins</Heading>
        </div>
      )}
    </div>
  )
}

const TopSection = ({ docSetName, documentSets }) => {
  return (
    <div className="flex justify-between items-center pt-8 px-8">
      <div>
        {/* <SelectScrollable prevDocSets={documentSets} /> */}
      </div>
      <div className="flex items-center space-x-4">
        {/* <Heading>{docSetName}</Heading> */}
        <ModeToggle />
        <UserProvider />
      </div>
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
  const handleSubmit = (value: string) => {
    handleInputClick(value);
  };

  return (
    <SimpleInputForm onSubmit={handleSubmit} isLoading={isLoading} />
  );
};

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