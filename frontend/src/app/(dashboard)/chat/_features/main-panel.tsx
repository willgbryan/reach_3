'use client'

import React, { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Message } from 'ai'
import { nanoid } from 'nanoid'
import DOMPurify from 'dompurify';
import 'react-quill/dist/quill.snow.css';

import jsPDF from 'jspdf';
import 'jspdf-autotable';

import { ModeToggle } from '@/components/theme-toggle'
import { ChatScrollAnchor } from '@/components/chat/chat-scroll-anchor'
import { Heading } from '@/components/cult/gradient-heading'
import { useGetDocumentSets } from '@/hooks/use-get-document-sets'
import { useDocSetName, useFileData, useStage } from '@/hooks/use-vector-blob'
import { generatePowerPoint } from '@/components/structured-ppt-gen'

import SimpleInputForm from './simple-input';

import { Button } from "@/components/ui/button"
import { UserProvider } from '@/components/user-provider';
import { getWebSocket, closeWebSocket } from '@/utils/websocket'
import { toast } from 'sonner'
import { getOldSources } from '@/app/_data/sources'
import { GridLayout, Card } from '@/components/cult/dive-grid'
import { PlaceholdersAndVanishInput } from '@/components/cult/placeholder-vanish-input'

interface MainVectorPanelProps {
  id?: string | undefined
  user?: any
  initialMessages?: Message[]
  initialSources?: any
}

type CardType = {
  src: string;
  title: string;
  category: string;
  content: React.ReactNode;
};

type Source = {
  source_url: string;
  content: string;
};

const MainVectorPanel = ({ id, initialMessages, initialSources }: MainVectorPanelProps) => {
  const { data: documentSets } = useGetDocumentSets()
  const { docSetName } = useDocSetName()
  const { setFileData } = useFileData()
  const { setStage } = useStage()
  const [showBottomSection, setShowBottomSection] = useState(true);
  const [messages, setMessages] = useState<Message[]>(initialMessages || []);
  const [isLoading, setIsLoading] = useState(false);
  const [reportContent, setReportContent] = useState('');
  const [edits, setEdits] = useState<string | undefined>(undefined);
  const [initialValue, setInitialValue] = useState('');
  const [currentChatId, setCurrentChatId] = useState<string | undefined>(id);
  const [webSources, setWebSources] = useState<any[]>([]);
  const [accumulatedReports, setAccumulatedReports] = useState<{[key: number]: string}>({});
  const [iterationCount, setIterationCount] = useState(0);
  const [isCollectionComplete, setIsCollectionComplete] = useState(false);
  const [originalUserMessage, setOriginalUserMessage] = useState<Message | null>(null);
  const [currentIteration, setCurrentIteration] = useState(0);
  const [currentStep, setCurrentStep] = useState('initial');
  const [placeholders, setPlaceholders] = useState(['Ask anything...']);

  const [allIterations, setAllIterations] = useState<Array<{ content: string; sources: any[]; type?: string }>>([]);
  const [condensedFindings, setCondensedFindings] = useState<string | null>(null);
  const [allSources, setAllSources] = useState<Source[]>([]);

  const router = useRouter()
  const sources = initialSources?.sources ?? [];
  const apiUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://themagi.systems';
  const socketRef = useRef<WebSocket | null>(null);

  const updatedMessages = [...messages, { content: reportContent, role: 'assistant', type: 'report' }];

  const inputDisabled = updatedMessages.length > 1;

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlChatId = urlParams.get('id');
    if (urlChatId) {
      setCurrentChatId(urlChatId);
    } else {
      // Check URL for chat ID
      const pathSegments = window.location.pathname.split('/');
      const chatIdFromPath = pathSegments[pathSegments.length - 1];
      if (chatIdFromPath && chatIdFromPath !== 'chat') {
        setCurrentChatId(chatIdFromPath);
      }
    }
  }, []);

  useEffect(() => {
    socketRef.current = getWebSocket();

    socketRef.current.onopen = () => {
      console.log('WebSocket connection opened');
    };

    socketRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socketRef.current.onclose = () => {
      console.log("WebSocket connection closed");
      socketRef.current = null;
    };

    const urlParams = new URLSearchParams(window.location.search);
    const urlChatId = urlParams.get('id');
    if (urlChatId) {
      setCurrentChatId(urlChatId);
    }

    return () => {
      closeWebSocket();
    };
  }, []);

  const handleSaveSourcesAndContent = async (sourcesData: any[]) => {
    if (!currentChatId) {
        console.error('No current chat ID');
        return;
    }

    try {
        const response = await fetch('/api/save-sources-content', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chatId: currentChatId,
                sources: sourcesData.map(d => d.Source),
                content: sourcesData.map(d => d.Content),
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to save sources and content');
        }

        const result = await response.json();
        console.log(result.message);
        toast.success("Sources and content saved successfully");
    } catch (error) {
        console.error('Error saving sources and content:', error);
        toast.error("Error saving sources and content");
    }
  };

  const handleApiCall = async (payload, iterationCount = 0) => {
    setIsLoading(true);
    let accumulatedOutput = '';
    let accumulatedSources: any[] = [];
    const actualChatId = currentChatId || nanoid();

    if (!currentChatId) {
      setCurrentChatId(actualChatId);
    }

    try {
      if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
        socketRef.current = getWebSocket();
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
        task: payload.originalMessage ? payload.originalMessage.content : payload.messages[payload.messages.length - 1].content,
        report_type: "research_report",
        sources: ["WEB"],
        ...(payload.edits && { edits: payload.edits }),
        chatId: actualChatId,
      };
  
      console.log('Sending data to WebSocket:', requestData);
      socketRef.current.send(JSON.stringify(requestData));
  

      // promise that resolves when the WebSocket communication is complete
      const wsComplete = new Promise<string>((resolve, reject) => {
        const messageHandler = (event: MessageEvent) => {
          const data = JSON.parse(event.data);
          console.log(`Received WebSocket data: ${JSON.stringify(data)}`);
          
          if (data.type === 'report') {
            accumulatedOutput += data.output;
            setReportContent(prev => prev + data.output);
          }
          
          if (data.type === 'sources') {
            const parsedData = data.output;
            console.log(`SOURCES DATA ${JSON.stringify(parsedData)}`);
            accumulatedSources = [...accumulatedSources, ...parsedData];
            setWebSources(accumulatedSources);
          }

          if (data.type === 'logs') {
            console.log(data);
          }
          
          if (data.type === 'complete') {
            socketRef.current!.removeEventListener('message', messageHandler);
            resolve(accumulatedOutput);
          }
        };

        socketRef.current!.addEventListener('message', messageHandler);

        socketRef.current!.onerror = (error) => {
          socketRef.current!.removeEventListener('message', messageHandler);
          reject(error);
        };
      });

      await wsComplete;

      setIterationCount(iterationCount + 1);
      setCurrentIteration(iterationCount + 1);
      setAccumulatedReports(prev => ({...prev, [iterationCount + 1]: accumulatedOutput}));

      setAllIterations(prev => [
        ...prev,
        {
          content: accumulatedOutput,
          sources: accumulatedSources,
          type: 'iteration'
        }
      ]);
      
      return {
        output: accumulatedOutput,
        sources: accumulatedSources,
        chatId: actualChatId,
      };
    } catch (error) {
      console.error('Error:', error);
      toast.error("Error saving response", {
        description: "The previous response will not be saved. Try again shortly.",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleMultipleIterations = async (payload, maxIterations = 6) => {
    let currentIteration = 0;
    let currentPayload = { ...payload };
    let iterations: Array<{ content: string; sources: any[]; type?: string }> = [];
    let finalChatId: string | undefined;
  
    while (currentIteration < maxIterations) {
      setCurrentStep(`dive-${currentIteration + 1}`);
      setPlaceholders([`Navigating dive number ${currentIteration + 1}`]);
      const result = await handleApiCall(currentPayload, currentIteration);
      console.log(`ITERATION ${currentIteration}`);
      
      iterations.push({
        content: result.output,
        sources: result.sources,
        type: 'iteration'
      });
  
      currentIteration++;
      finalChatId = result.chatId;
  
      if (currentIteration > 2) {
        // Evaluate stopping condition
        const oldSources = await getOldSources(result.chatId);
        const oldSourceUrls = new Set(oldSources.map(source => source.source_url));
        const newSourceUrls = new Set(result.sources.map(source => source.Source));
  
        const uniqueNewSources = [...newSourceUrls].filter(url => !oldSourceUrls.has(url));
        
        const ratio = uniqueNewSources.length / oldSourceUrls.size;
  
        if (ratio <= 0.1) {
          console.log('Stopping condition met. Ending iterations.');
          setIsCollectionComplete(true);
          break;
        } else {
          console.log('Continuing to next iteration.');
        }
      }
  
      await handleSaveSourcesAndContent(result.sources);
  
      currentPayload = {
        ...currentPayload,
        messages: [...currentPayload.messages, { content: result.output, role: 'assistant' }],
        id: result.chatId,
      };
    }
  
    try {
      if (finalChatId) {
        const fetchedSources = await getOldSources(finalChatId);
        setAllSources(fetchedSources);
        iterations.push({
          content: JSON.stringify(fetchedSources),
          sources: [],
          type: 'sources'
        });
      }
  
      setCurrentStep('condensing');
      setPlaceholders(['Condensing dive content']);
      const response = await fetch('/api/condense-reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          task: payload.originalMessage ? payload.originalMessage.content : payload.messages[payload.messages.length - 1].content,
          accumulatedOutput: iterations.filter(iter => iter.type === 'iteration').map(iter => iter.content).join('\n\n')
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to condense findings');
      }
  
      const { condensed_report } = await response.json();
      console.log('Condensed Report:', condensed_report);

      setCondensedFindings(condensed_report);

      iterations.push({
        content: condensed_report,
        sources: [],
        type: 'condensed'
      });
  
      setAllIterations(iterations);
      setCurrentIteration(iterations.length);
  
      const saveChatResponse = await fetch(`/api/save-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatId: finalChatId,
          iterations: iterations,
          messages: [
            ...payload.messages,
            ...iterations.map(iter => ({ content: iter.content, role: 'assistant', type: iter.type }))
          ],
        }),
      });
  
      if (!saveChatResponse.ok) {
        throw new Error('Failed to save chat history');
      }
  
    } catch (error) {
      console.error('Error in condensing findings or saving chat:', error);
      toast.error("Error processing research", {
        description: "Failed to generate condensed report or save chat. Please try again.",
      });
    }
    setCurrentStep('initial');
    setPlaceholders(['Research complete.']);
  };

  const handleInputClick = async (value: string) => {
    if (value.length >= 1 && !inputDisabled) {
      setInitialValue(value);
      const newMessage: Message = {
        id: nanoid(),
        content: value,
        role: 'user',
        createdAt: new Date()
      };
      setOriginalUserMessage(newMessage);
      setMessages(prevMessages => [...prevMessages, newMessage]);
      await handleMultipleIterations({
        messages: [...messages, newMessage],
        id: currentChatId,
        edits: edits,
        originalMessage: newMessage,
      });
    }
  };

  const handleReset = () => {
    setStage('reset')
    setFileData(null)
    setMessages([])
    setReportContent('')
    router.push('/chat')
  };

  return (
    <div className="h-full w-full">
      <TopSection docSetName={docSetName} documentSets={documentSets} />
      <div className="w-full px-4">
        <ChatSection 
          messages={updatedMessages}
          isLoading={isLoading}
          reportContent={reportContent}
          allIterations={allIterations}
          currentIteration={currentIteration}
          chatId={currentChatId}
          allSources={allSources}
        />
      </div>
      {showBottomSection && (
        <SimpleInputForm
          onSubmit={handleInputClick}
          inputDisabled={inputDisabled}
          placeholders={placeholders}
          currentStep={currentStep}
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
  isLoading, 
  reportContent,
  allIterations,
  currentIteration,
  chatId,
  allSources,
}) => {
  const [localSources, setLocalSources] = useState<Source[]>([]);
  const updatedMessages = [...messages, { content: reportContent, role: 'assistant', type: 'report' }];

  useEffect(() => {
    const fetchSources = async () => {
        try {
          console.log(`Fetching sources for chat ID: ${chatId}`);
          const fetchedSources = await getOldSources(chatId);
          console.log('Fetched sources:', fetchedSources);
          setLocalSources(fetchedSources);
        } catch (error) {
          console.error('Error fetching sources:', error);
          toast.error("Error fetching sources");
      }
    };

    fetchSources();
  }, [chatId, allSources]);

  const sourcesToUse = allSources.length > 0 ? allSources : localSources;

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

  const handleCreateStructuredPowerPoint = async () => {
    try {
      const prompt = updatedMessages.map(msg => msg.content).join('\n\n');
      console.log('Generating PowerPoint with prompt:', prompt);
      await generatePowerPoint(prompt);
    } catch (error) {
      console.error("Error creating PowerPoint:", error);
      // toast the error
    }
  };

  const formatContentToHTML = (content: string): string => {
    const lines = content.split('\n');
    let html = '';
    let inList = false;

    lines.forEach((line, index) => {
      if (line.startsWith('# ')) {
        html += `<h1 class="text-3xl font-bold mt-6 mb-4">${line.slice(2)}</h1>`;
      } else if (line.startsWith('## ')) {
        html += `<h2 class="text-2xl font-semibold mt-5 mb-3">${line.slice(3)}</h2>`;
      } else if (line.startsWith('### ')) {
        html += `<h3 class="text-xl font-medium mt-4 mb-2">${line.slice(4)}</h3>`;
      } else if (line.match(/^\d+\.\s/)) {
        const matchResult = line.match(/^(\d+\.\s)(.*)$/);
        if (matchResult) {
          if (!inList) {
            html += '<ol class="list-decimal list-inside my-2">';
            inList = true;
          }
          html += `<li class="mb-1"><strong>${matchResult[1]}</strong>${matchResult[2]}</li>`;
        } else {
          if (inList) {
            html += '</ol>';
            inList = false;
          }
          html += `<p class="mb-4">${line}</p>`;
        }
      } else if (line.trim() === '' && inList) {
        html += '</ol>';
        inList = false;
      } else {
        if (inList) {
          html += '</ol>';
          inList = false;
        }
        html += `<p class="mb-4">${line}</p>`;
      }
    });

    if (inList) {
      html += '</ol>';
    }

    return html;
  };

  const createCard = (item: any, index: number): JSX.Element | null => {
    let title: string | undefined;
    let category: string | undefined;
    let content: React.ReactNode;
  
    if (item.type === 'sources') {
      title = 'Sources';
      category = 'Navigation Destinations';
      content = (
        <ol className="list-decimal pl-5 space-y-2">
          {sourcesToUse.map((source, idx) => (
            <li key={idx} className="text-stone-900 dark:text-stone-100">
              <a
                href={source.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {source.source_url}
              </a>
              {source.content}
            </li>
          ))}
        </ol>
      );
    } else if (item.type === 'condensed' || item.type === 'iteration') {
      title = item.type === 'condensed' ? 'Findings' : `Dive ${index + 1}`;
      category = item.type === 'condensed' ? 'Navigation Summary' : 'Outbound Navigation';
      
      const formattedContent = formatContentToHTML(item.content);
      // critical for xss mitigation using dangerouslySetInnerHTML (we should still find an alternative)
      const sanitizedContent = DOMPurify.sanitize(formattedContent);
      content = (
        <div 
          className="text-stone-900 dark:text-stone-100 text-base md:text-lg font-sans prose prose-stone dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />
      );
    } else if (item.role === 'user') {
      return null;
    }
  
    if (title && category) {
      return (
        <Card
          key={`item-${index}`}
          card={{
            category,
            title,
            content: (
              <div className="bg-transparent p-8 rounded-lg mb-4 overflow-auto max-h-[60vh]">
                {content}
              </div>
            ),
          }}
          index={index}
        />
      );
    }
  
    return null;
  };

  const allCards = [
    ...updatedMessages.slice(1).map((message, index) => createCard(message, index)),
    ...allIterations.slice(0, currentIteration).map((iteration, index) => 
      createCard(iteration, index)
    )
  ].filter(Boolean);

  return (
    <div className="flex flex-col items-center w-full">
      {updatedMessages.length > 2 ? (
        <div className="pb-[100px] md:pb-40 w-full">
          <div className="mt-8">
            <h2 className="text-4xl pl-12 font-bold">{updatedMessages[0].content}</h2>
            <GridLayout items={allCards} />
          </div>
          <ChatScrollAnchor trackVisibility={isLoading} />
          {reportContent && (
            <div className="flex justify-center space-x-4 mt-4">
              {/* <Button onClick={createPDF} variant="outline">Create PDF</Button>
              <Button onClick={handleCreateStructuredPowerPoint} variant="outline">Create PowerPoint</Button> */}
            </div>
          )}
        </div>
      ) : (
        <div className="pt-64 md:pt-16">
          <Heading>Heighliner</Heading>
        </div>
      )}
    </div>
  )
}

const BottomSection = ({
  handleReset,
  handleInputSubmit,
  handleInputChange,
  placeholders,
  currentStep,
}: {
  handleReset: () => void;
  handleInputSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
  inputDisabled: boolean;
  placeholders: string[];
  currentStep: string;
}) => {
  return (
    <div className="absolute bottom-2 md:bottom-8 left-0 right-0 px-4">
      <div className="relative max-w-3xl mx-auto">
        <PlaceholdersAndVanishInput
          placeholders={placeholders}
          onChange={handleInputChange}
          onSubmit={handleInputSubmit}
          currentStep={currentStep}
        />
      </div>
    </div>
  );
};

export default MainVectorPanel;