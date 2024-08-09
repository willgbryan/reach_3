'use client'

import React, { Suspense, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Message } from 'ai'
import { nanoid } from 'nanoid'
import showdown from 'showdown';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ShootingStars } from "@/components/cult/shooting-stars";
import { StarsBackground } from "@/components/cult/stars-background";

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { marked } from 'marked';

import { ModeToggle } from '@/components/theme-toggle'

import { SelectScrollable } from '@/components/chat/chat-document-sets'
import { ChatList } from '@/components/chat/chat-list'
import { ChatScrollAnchor } from '@/components/chat/chat-scroll-anchor'
import { SIZE_PRESETS, useDynamicBlobSize } from '@/components/cult/dynamic-blob'
import { Heading } from '@/components/cult/gradient-heading'
import { useGetDocumentSets } from '@/hooks/use-get-document-sets'
import { useDocSetName, useFileData, useStage } from '@/hooks/use-vector-blob'

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
  const { docSetName } = useDocSetName()
  const { setFileData } = useFileData()
  const { setStage } = useStage()
  const [showBottomSection, setShowBottomSection] = useState(true);
  const [messages, setMessages] = useState<Message[]>(initialMessages || []);
  const [isLoading, setIsLoading] = useState(false);
  const [reportContent, setReportContent] = useState('');
  const [showEditMode, setShowEditMode] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const [deletedText, setDeletedText] = useState('');
  const [edits, setEdits] = useState<string | undefined>(undefined);
  const [initialValue, setInitialValue] = useState('');
  const [editText, setEditText] = useState('');
  const [currentChatId, setCurrentChatId] = useState<string | undefined>(id);

  const router = useRouter()
  const sources = initialSources?.sources ?? [];
  const apiUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://themagi.systems';
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const socketRef = useRef<WebSocket | null>(null);


    useEffect(() => {
      const isProduction = process.env.NODE_ENV === 'production';
      const ws_protocol = isProduction ? 'wss://' : 'ws://';
      const ws_host = isProduction ? 'themagi.systems' : 'localhost:8000';
      //PROD
      const ws_uri = `wss://themagi.systems/ws`;

      //DEV
      // const ws_uri = `ws://localhost:8000/ws`
    
      const newSocket = new WebSocket(ws_uri);
      setSocket(newSocket);
      socketRef.current = newSocket;
    
      newSocket.onopen = () => {
        console.log('WebSocket connection opened');
        setSocket(newSocket);
      };
    
      newSocket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    
      newSocket.onclose = () => {
        console.log("WebSocket connection closed");
        setSocket(null);
      };
    
      const urlParams = new URLSearchParams(window.location.search);
      const urlChatId = urlParams.get('id');
      if (urlChatId) {
        setCurrentChatId(urlChatId);
      }

      return () => {
        if (newSocket) {
          newSocket.close();
        }
      };
    }, []);

    const handleApiCall = async (payload) => {
      setIsLoading(true);
      let accumulatedOutput = '';
      const actualChatId = currentChatId || nanoid();
    
      if (!currentChatId) {
        setCurrentChatId(actualChatId);
      }
    
      try {
        if (!socketRef.current) {
          throw new Error('WebSocket is not initialized');
        }
    
        // Wait for the WebSocket to be open
        if (socketRef.current.readyState !== WebSocket.OPEN) {
          await new Promise<void>((resolve, reject) => {
            const timeout = setTimeout(() => {
              reject(new Error('WebSocket connection timed out'));
            }, 20000);
    
            socketRef.current!.onopen = () => {
              clearTimeout(timeout);
              resolve();
            };
    
            socketRef.current!.onerror = () => {
              clearTimeout(timeout);
              reject(new Error('WebSocket connection failed'));
            };
          });
        }
    
        const requestData = {
          task: payload.messages[payload.messages.length - 1].content,
          report_type: "research_report",
          sources: ["WEB"],
          ...(payload.edits && { edits: payload.edits }),
          chatId: actualChatId,
        };
    
        console.log('Sending data to WebSocket:', requestData);
        socketRef.current.send(JSON.stringify(requestData));
    
        // promise that resolves when the WebSocket communication is complete
        const wsComplete = new Promise<string>((resolve, reject) => {
          if (!socketRef.current) {
            reject(new Error('WebSocket is not initialized'));
            return;
          }
    
          const messageHandler = (event: MessageEvent) => {
            const data = JSON.parse(event.data);
            console.log(`Received WebSocket data: ${JSON.stringify(data)}`);
            if (data.type === 'report') {
              accumulatedOutput += data.output;
              setReportContent(prev => prev + data.output);
            }
            if (data.type === 'complete') {
              socketRef.current!.removeEventListener('message', messageHandler);
              resolve(accumulatedOutput);
            }
          };
    
          socketRef.current.addEventListener('message', messageHandler);
    
          socketRef.current.onerror = (error) => {
            socketRef.current!.removeEventListener('message', messageHandler);
            reject(error);
          };
        });
    
        await wsComplete;
    
        // theres a bug where sending a new query to a chat from the history list will save the chat twice
        const saveChatResponse = await fetch(`/api/save-chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chatId: actualChatId,
            completion: accumulatedOutput,
            messages: [...payload.messages, { content: accumulatedOutput, role: 'assistant' }],
          }),
        });
    
        if (!saveChatResponse.ok) {
          throw new Error('Failed to save chat history');
        }
    
      } catch (error) {
        console.error('Error:', error);
        // might want to set an error state here to display to the user
      } finally {
        setIsLoading(false);
      }
    };

    const handleInputClick = async (value: string) => {
      if (value.length >= 1) {
        setInitialValue(value);
        const newMessage: Message = {
          id: nanoid(),
          content: value,
          role: 'user',
          createdAt: new Date()
        };
        setMessages(prevMessages => [...prevMessages, newMessage]);
        
        await handleApiCall({
          messages: [...messages, newMessage],
          id: currentChatId,
          edits: edits,
        });
      }
    };

  const handleEditChange = (newContent) => {
    const oldContent = editText;
    setEditText(newContent);
  
    const deletedParts = oldContent.split(' ').filter(word => !newContent.includes(word));
    const newDeletedText = deletedParts.join(' ');
    setDeletedText(prevDeletedText => {
      const combinedDeletedText = prevDeletedText + ' ' + newDeletedText;
      return combinedDeletedText.trim();
    });
  };

  const handleSubmitEdits = async () => {
    const editsString = `user-retained:${editText} user-deleted:${deletedText}`;
    console.log(`edits string ${editsString}`)
    setEdits(editsString);
    setShowEditMode(false);
    setShowBottomSection(false);
  
    await handleApiCall({
      messages: messages,
      id: currentChatId,
      edits: editsString,
      task: initialValue,
    });
  };

  const handleDigDeeper = () => {
    setEditText(reportContent);
    setShowEditMode(true);
    setShowBottomSection(false);
  };

  const handleNewQuery = () => {
    setShowBottomSection(true);
    setShowEditMode(false);
    router.push('/chat');
  };

  const handleReset = () => {
    setStage('reset')
    setFileData(null)
    setMessages([])
    router.push('/chat')
  };

  return (
    <div className="h-full w-full">
      <TopSection docSetName={docSetName} documentSets={documentSets} />
      <div className="w-full px-4">
        <ChatSection 
          messages={messages}
          sources={sources}
          isLoading={isLoading}
          reportContent={reportContent}
          showEditMode={showEditMode}
          setShowEditMode={setShowEditMode}
          showBottomSection={showBottomSection}
          setShowBottomSection={setShowBottomSection}
          handleDigDeeper={handleDigDeeper}
          handleNewQuery={handleNewQuery}
          handleEditChange={handleEditChange}
          handleSubmitEdits={handleSubmitEdits}
          editText={editText}
        />
      </div>
      {showBottomSection && (
        <BottomSection
          handleInputClick={handleInputClick}
          handleReset={handleReset}
          isLoading={isLoading}
        />
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

const ChatSection = ({ 
  messages, 
  sources, 
  isLoading, 
  reportContent,
  showEditMode,
  setShowEditMode,
  showBottomSection,
  setShowBottomSection,
  handleDigDeeper,
  handleNewQuery,
  handleEditChange,
  handleSubmitEdits,
  editText,
}) => {
  const updatedMessages = [...messages, { content: reportContent, type: 'report' }];

  const createPDF = async () => {
    const doc = new jsPDF();
    
    try {
      let yOffset = 10;
      const lineHeight = 7;
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 10;
      const maxLineWidth = pageWidth - 2 * margin;
  
      for (const message of updatedMessages) {
        doc.setFontSize(12);
        doc.setFont('bold');
        doc.text(message.role || 'System', margin, yOffset);
        yOffset += lineHeight;
  
        doc.setFontSize(10);
        doc.setFont('normal');
        const contentLines = doc.splitTextToSize(message.content, maxLineWidth);
        
        for (const line of contentLines) {
          if (yOffset > doc.internal.pageSize.getHeight() - margin) {
            doc.addPage();
            yOffset = margin;
          }
          doc.text(line, margin, yOffset);
          yOffset += lineHeight;
        }
  
        yOffset += lineHeight;
      }
  
      doc.save("conversation_report.pdf");
    } catch (error) {
      console.error("Error creating PDF:", error);
    }
  };

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
                  value={editText} 
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
          {reportContent && (
            <div className="flex justify-center space-x-4 mt-4">
              {/* <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline">New Query</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to start a new query?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action may interfere with the current training state.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleNewQuery}>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog> */}
              <Button onClick={handleDigDeeper} variant="outline">Dig Deeper</Button>
              <Button onClick={createPDF} variant="outline">Create PDF</Button>
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

const BottomSection = ({
  handleReset,
  handleInputClick,
  isLoading,
}: {
  handleReset: () => void;
  handleInputClick: (value: string) => Promise<void>;
  isLoading: boolean;
}) => {
  const handleSubmit = (value: string) => {
    handleInputClick(value);
  };

  return (
    <SimpleInputForm onSubmit={handleSubmit} isLoading={isLoading} />
  );
};

export default MainVectorPanel