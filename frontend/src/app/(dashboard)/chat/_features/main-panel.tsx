'use client'

import React, { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Message } from 'ai'
import { nanoid } from 'nanoid'
import DOMPurify from 'dompurify'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import Cookies from 'js-cookie'
import { AnimatePresence } from 'framer-motion'
import { marked } from 'marked';
import { renderToString } from 'react-dom/server';

import { ModeToggle } from '@/components/theme-toggle'
import { ChatScrollAnchor } from '@/components/chat/chat-scroll-anchor'
import { Heading } from '@/components/cult/gradient-heading'
import { useGetDocumentSets } from '@/hooks/use-get-document-sets'
import { useDocSetName } from '@/hooks/use-vector-blob'
import { generatePowerPoint } from '@/components/structured-ppt-gen'
import SimpleInputForm from './simple-input'
import UserProvider from '@/components/user-provider'
import { getWebSocket, closeWebSocket } from '@/utils/websocket'
import { toast } from 'sonner'
import { getOldSources } from '@/app/_data/sources'
import { GridLayout, Card } from '@/components/cult/dive-grid'
import { TutorialOverlay } from '@/components/tutorial/tutorial-overlay'
import { TutorialStep } from '@/components/tutorial/tutorial-step'
import InfoButton from '@/components/tutorial/info-button'
import createEditableDocument from '@/components/word-doc-functions'
import TableDownloader from '@/components/table-downloader'
import { IconLoader2, IconPresentation } from '@tabler/icons-react'
import { LoaderIcon } from 'lucide-react'
import { UpgradeAlert } from '@/components/upgrade-alert'
import { FreeSearchCounter } from '@/components/free-search-counter'

interface MainVectorPanelProps {
  id?: string | undefined
  user?: any
  initialMessages?: Message[]
  initialSources?: any
}

type Source = {
  source_url: string;
  content: string;
};

const MainVectorPanel = ({ id, initialMessages, initialSources }: MainVectorPanelProps) => {
  const { data: documentSets } = useGetDocumentSets()
  const { docSetName } = useDocSetName()
  const [showBottomSection, setShowBottomSection] = useState(true);
  const [messages, setMessages] = useState<Message[]>(initialMessages || []);
  const [isLoading, setIsLoading] = useState(false);
  const [reportContent, setReportContent] = useState('');
  const [initialValue, setInitialValue] = useState('');
  const [currentChatId, setCurrentChatId] = useState<string | undefined>(id);
  const [webSources, setWebSources] = useState<any[]>([]);
  const [accumulatedReports, setAccumulatedReports] = useState<{[key: number]: string}>({});
  const [iterationCount, setIterationCount] = useState(0);
  const [isCollectionComplete, setIsCollectionComplete] = useState(false);
  const [originalUserMessage, setOriginalUserMessage] = useState<Message | null>(null);
  const [currentIteration, setCurrentIteration] = useState(0);
  const [currentStep, setCurrentStep] = useState('initial');
  const [placeholders, setPlaceholders] = useState([
    "Brief Roberts v. State of Louisiana 396 So.2d 566 (La. Ct. App. 1981)",
    "Which cases decided the enforceability of clickwrap licenses under contract law?",
    "Where are federal prosecutors going after PPP loan fraud?",
    "Summarize the repeal of the Chevron doctrine, what are some immediate ramifications.",
    "Recent notable NLRB findings and board decisions.",
    ""
  ]);

  const [allIterations, setAllIterations] = useState<Array<{ content: string; sources: any[]; type?: string }>>([]);
  const [condensedFindings, setCondensedFindings] = useState<string | null>(null);
  const [allSources, setAllSources] = useState<Source[]>([]);
  const [isTutorialActive, setIsTutorialActive] = useState(false)
  const [currentTutorialStep, setCurrentTutorialStep] = useState(0)
  const [dontShowAgain, setDontShowAgain] = useState(true)
  const [freeSearches, setFreeSearches] = useState(null);
  const [showUpgradeAlert, setShowUpgradeAlert] = useState(false);
  const [isPro, setIsPro] = useState(false);

  const router = useRouter()
  const socketRef = useRef<WebSocket | null>(null);

  const updatedMessages = [...messages, { content: reportContent, role: 'assistant', type: 'report' }];

  const inputDisabled = updatedMessages.length > 1;

  const handleTriggerTutorial = () => {
    setIsTutorialActive(true);
    setCurrentTutorialStep(0);
  };

  const tutorialSteps = [
  {
    title: "Welcome to Heighliner",
    description: "Heighliner is purpose-built for professional work with a strong focus on legal research.",
    highlightId: ""
  },
  {
    title: "Heighliner prioritizes high source coverage",
    description: "Covering a broad landscape of possible sources takes time. Give Heighliner a task and allow up to five minutes for a comprehensive response.",
    highlightId: ""
  },
  {
    title: "Legal Document Analysis",
    description: "The 'Document Analysis' tab allows you to easily analyze legal documents of any size. Following the initial analysis, highlight text anywhere on the page to ask follow up questions.",
    highlightId: ""
  },
  {
    title: "Heighliner constantly improves",
    description: "Heighliner learns what information is most valuable to you and your role over time. Start by updating your profile in the top right and Heighliner will instantly begin optimizing its research.",
    highlightId: ""
  },
];
  useEffect(() => {
      const hasSeenTutorial = Cookies.get('hasSeenTutorial')
      if (!hasSeenTutorial) {
        setIsTutorialActive(true)
      }
    }, [])

    const handleNextTutorialStep = () => {
      setCurrentTutorialStep((prev) => Math.min(prev + 1, tutorialSteps.length - 1))
    }

    const handlePreviousTutorialStep = () => {
      setCurrentTutorialStep((prev) => Math.max(prev - 1, 0))
    }

    const handleCloseTutorial = () => {
      setIsTutorialActive(false)
      if (dontShowAgain) {
        Cookies.set('hasSeenTutorial', 'true', { expires: 365 })
      }
    }

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
      setPlaceholders([`Navigating Dive ${currentIteration + 1}`]);
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

  useEffect(() => {
    const fetchUserStatus = async () => {
      try {
        const response = await fetch('/api/user-status');
        if (response.ok) {
          const data = await response.json();
          setIsPro(data.isPro);
          if (!data.isPro) {
            setFreeSearches(data.freeSearches);
          }
        }
      } catch (error) {
        console.error('Error fetching user status:', error);
      }
    };

    fetchUserStatus();
  }, []);

  const handleInputClick = async (value: string) => {
    if (value.length >= 1 && !inputDisabled) {
      if (!isPro) {
        const currentFreeSearches = await fetchFreeSearches();
        
        if (currentFreeSearches === 0) {
          setShowUpgradeAlert(true);
          return;
        }
      }

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
        edits: '',
        originalMessage: newMessage,
      });

      if (!isPro) {
        const updatedFreeSearches = await updateFreeSearches();
        setFreeSearches(updatedFreeSearches);
      }
    }
  };

  const fetchFreeSearches = async () => {
    try {
      const response = await fetch('/api/free-searches');
      if (!response.ok) {
        throw new Error('Failed to fetch free searches');
      }
      const data = await response.json();
      return data.freeSearches;
    } catch (error) {
      console.error('Error fetching free searches:', error);
      return null;
    }
  };

  const updateFreeSearches = async () => {
    try {
      const response = await fetch('/api/free-searches', { method: 'POST' });
      if (!response.ok) {
        throw new Error('Failed to update free searches');
      }
      const data = await response.json();
      return data.freeSearches;
    } catch (error) {
      console.error('Error updating free searches:', error);
      return null;
    }
  };

  const handleStartOver = useCallback(() => {
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      if (currentPath.endsWith('/chat')) {
        window.location.reload();
      } else {
        router.push('/chat');
      }
    }
  }, [router]);

  return (
    <div className="h-full w-full">
      <TopSection 
        onTriggerTutorial={handleTriggerTutorial} 
        docSetName={docSetName} 
        documentSets={documentSets}
      />
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
        <div className="w-full px-4 z-40">
          <SimpleInputForm
            id="input-section"
            onSubmit={handleInputClick}
            onStartOver={handleStartOver}
            inputDisabled={inputDisabled}
            placeholders={placeholders}
            currentStep={currentStep}
            hasContent={updatedMessages.length > 1}
          />
        </div>
      )}
      <AnimatePresence>
        {showUpgradeAlert && (
          <UpgradeAlert onClose={() => setShowUpgradeAlert(false)} />
        )}
        {isTutorialActive && (
          <TutorialOverlay isFirstOrLastStep={currentTutorialStep === 0 || currentTutorialStep === tutorialSteps.length - 1}>
            <TutorialStep
              {...tutorialSteps[currentTutorialStep]}
              onNext={handleNextTutorialStep}
              onPrevious={handlePreviousTutorialStep}
              onClose={handleCloseTutorial}
              isFirstStep={currentTutorialStep === 0}
              isLastStep={currentTutorialStep === tutorialSteps.length - 1}
              dontShowAgain={dontShowAgain}
              setDontShowAgain={setDontShowAgain}
            />
          </TutorialOverlay>
        )}
      </AnimatePresence>
    </div>
  )
}

const TopSection = ({ docSetName, documentSets, onTriggerTutorial }) => {
  return (
    <div className="flex justify-between items-center pt-4 px-4">
      <div className="flex items-center space-x-4">
        <FreeSearchCounter />
        {/* <SelectScrollable prevDocSets={documentSets} /> */}
      </div>
      <div id="profile" className="flex items-center space-x-2">
        <InfoButton onTriggerTutorial={onTriggerTutorial} />
        <ModeToggle />
        <UserProvider id="profile" />
      </div>
    </div>
  );
};

const ChatSection = ({ 
  messages, 
  isLoading, 
  reportContent,
  allIterations,
  currentIteration,
  chatId,
  allSources
}) => {
  const [localSources, setLocalSources] = useState<Source[]>([]);
  const updatedMessages = [...messages, { content: reportContent, role: 'assistant', type: 'report' }];
  const [reportConfig, setReportConfig] = useState<ReportConfig>({
    font: "",
    pageOrientation: "portrait",
    marginSize: 15,
    documentTitle: "",
    subject: "",
    tableOfContents: false,
    pageNumbering: false,
    headerText: "",
    footerText: "",
  });

  type ReportConfig = {
    font: string;
    pageOrientation: "portrait" | "landscape";
    marginSize: number;
    documentTitle: string;
    subject: string;
    tableOfContents: boolean;
    pageNumbering: boolean;
    headerText: string;
    footerText: string;
  };

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

  useEffect(() => {
    const fetchReportConfig = async () => {
      try {
        const response = await fetch('/api/fetch-report-config');
        if (response.ok) {
          const data = await response.json();
          const pageOrientation = data.report_config.pageOrientation === "landscape" ? "landscape" : "portrait";
          setReportConfig({
            ...data.report_config,
            pageOrientation,
          });
        }
      } catch (error) {
        console.error('Error fetching report configuration:', error);
      }
    };

    fetchReportConfig();
  }, []);


  const sourcesToUse = allSources.length > 0 ? allSources : localSources;
  
  const handleCreateStructuredPowerPoint = async (content: string) => {
    const toastId = toast.custom((t) => (
      <div className="flex items-center justify-center w-full">
        <div className="flex items-center space-x-2">
          <LoaderIcon className="animate-spin h-5 w-5" />
          <div className="text-center">
            <div className="font-semibold">Creating PowerPoint</div>
            <div className="text-sm text-gray-500">One moment please...</div>
          </div>
        </div>
      </div>
    ), {
      duration: Infinity,
      className: 'w-full max-w-md',
    });
  
    try {
      console.log('Generating PowerPoint with content:', content);
      
      const response = await fetch('/api/fetch-powerpoint');
      if (!response.ok) {
        throw new Error('Failed to fetch PowerPoint template');
      }
      
      const { filePath, signedUrl } = await response.json();
      if (!signedUrl) {
        throw new Error('No signed URL provided for the PowerPoint template');
      }
      
      console.log('Signed URL before calling generatePowerPoint:', signedUrl);
      const favoriteTheme = response.headers.get('X-Favorite-Theme') || 'default_template.pptx';
      
      await generatePowerPoint(content, filePath, favoriteTheme, signedUrl);
  
      toast.dismiss(toastId);
  
      toast.custom((t) => (
        <div className="flex items-center justify-center w-full">
          <div className="flex items-center space-x-2">
            <IconPresentation className="h-5 w-5 text-green-500" />
            <div className="text-center">
              <div className="font-semibold">PowerPoint Created Successfully</div>
              <div className="text-sm text-gray-500">Your presentation is available in your downloads.</div>
            </div>
          </div>
        </div>
      ), {
        duration: 3000,
        className: 'w-full max-w-md',
      });
  
    } catch (error) {
      console.error("Error creating PowerPoint:", error);
      
      toast.dismiss(toastId);
  
      toast.error("Failed to create PowerPoint", {
        description: "We encountered an error while generating your presentation. Please try again.",
      });
    }
  };

  const formatContentToHTML = (content: string): string => {
    const rawHtml = marked.parse(content, { async: false }) as string;
    const sanitizedHtml = DOMPurify.sanitize(rawHtml);
    const parser = new DOMParser();
    const doc = parser.parseFromString(sanitizedHtml, 'text/html');
  
    doc.querySelectorAll('h1').forEach(el => el.classList.add('text-3xl', 'font-bold', 'mt-6', 'mb-4'));
    doc.querySelectorAll('h2').forEach(el => el.classList.add('text-2xl', 'font-semibold', 'mt-5', 'mb-3'));
    doc.querySelectorAll('h3').forEach(el => el.classList.add('text-xl', 'font-medium', 'mt-4', 'mb-2'));
    doc.querySelectorAll('p').forEach(el => el.classList.add('mb-4'));
    doc.querySelectorAll('ol').forEach(el => el.classList.add('list-decimal', 'list-inside', 'my-2'));
    doc.querySelectorAll('li').forEach(el => el.classList.add('mb-1'));
  
    doc.querySelectorAll('table').forEach((table, index) => {
      const tableId = `table-${index}`;
      table.id = tableId;
      table.classList.add('border-collapse', 'my-4', 'w-full', 'rounded-lg', 'overflow-hidden');
      
      const iconContainer = doc.createElement('div');
      iconContainer.className = 'absolute -top-10 right-0 flex space-x-2 mb-2';
    });
    doc.querySelectorAll('th, td').forEach(el => {
      el.classList.add('px-4', 'py-2', 'border', 'border-gray-300', 'dark:border-stone-100');
    });
    doc.querySelectorAll('th').forEach(el => {
      el.classList.add('font-semibold', 'bg-gray-100', 'dark:bg-zinc-800');
    });
    doc.querySelectorAll('a').forEach(el => {
      el.classList.add('text-blue-600', 'hover:text-blue-800', 'underline');
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener noreferrer');
    });
  
    const style = doc.createElement('style');
    style.textContent = `
      table {
        border: 2px solid #e2e8f0;
        border-radius: 0.5rem;
        border-spacing: 0;
        width: 100%;
        margin-top: 1rem;
        margin-bottom: 1rem;
        overflow: hidden;
      }
      th, td {
        border: 1px solid #e2e8f0;
        padding: 0.5rem 1rem;
      }
      th {
        background-color: #f7fafc;
        font-weight: 600;
      }
      tr:nth-child(even) {
        background-color: #f8fafc;
      }
      a {
        color: #2563eb; /* blue-600 */
        text-decoration: underline;
      }
      a:hover {
        color: #1d4ed8; /* blue-800 */
      }
      .table-wrapper {
        position: relative;
        margin-top: 2.5rem; /* Increased margin-top to accommodate buttons and spacing */
      }

      .table-icon-container {
        position: absolute;
        top: -2.5rem; /* Adjusted top position */
        right: 0;
        display: flex;
        gap: 0.5rem;
        z-index: 10;
        margin-bottom: 0.5rem; /* Added margin-bottom for spacing */
      }

      .table-icon {
        padding: 0.25rem;
        border-radius: 0.25rem;
        transition: background-color 0.2s;
      }

      .table-icon:hover {
        background-color: #e2e8f0;
      }

      @media (prefers-color-scheme: dark) {
        .table-icon:hover {
          background-color: #18181b;
        }
        table {
          border-color: #3f3f46; /* zinc-700 */
        }
        th, td {
          border-color: #3f3f46; /* zinc-700 */
        }
        th {
          background-color: #27272a; /* zinc-800 for header */
        }
        tr:nth-child(even) {
          background-color: #18181b; /* zinc-900 for even rows */
        }
        tr:nth-child(odd) {
          background-color: #27272a; /* zinc-800 for odd rows */
        }
        a {
          color: #60a5fa; /* blue-400 */
        }
        a:hover {
          color: #93c5fd; /* blue-300 */
        }
      }
    `;
    doc.head.appendChild(style);
  
    return doc.body.innerHTML;
  };

  type TableInfo = {
    id: string;
    content: string;
  };

  const createCard = (item: any, index: number): JSX.Element | null => {
    let title: string | undefined;
    let category: string | undefined;
    let content: React.ReactNode;
    let rawContent: string;
    let type: 'iteration' | 'condensed' | 'sources';
    let tables: TableInfo[] = [];
  
    if (item.type === 'sources') {
      title = 'Sources';
      category = 'Navigation Destinations';
      type = 'sources';
      const uniqueSources = sourcesToUse.reduce((acc, source) => {
        const duplicate = acc.find(item => item.source_url === source.source_url);
        if (!duplicate) {
          acc.push(source);
        }
        return acc;
      }, []);
      content = (
        <ol className="list-decimal pl-5 space-y-2">
          {uniqueSources.map((source, idx) => (
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
      rawContent = JSON.stringify(uniqueSources, null, 2);
    } else if (item.type === 'condensed' || item.type === 'iteration') {
      title = item.type === 'condensed' ? 'Findings' : `Dive ${index + 1}`;
      category = item.type === 'condensed' ? 'Navigation Summary' : 'Outbound Navigation';
      type = item.type;
      
      rawContent = item.content;
      const formattedContent = formatContentToHTML(item.content);
      
      const parser = new DOMParser();
      const doc = parser.parseFromString(formattedContent, 'text/html');
      const tableTags = doc.querySelectorAll('table');
      
      tableTags.forEach((table, tableIndex) => {
        const tableId = `table-${index}-${tableIndex}`;
        table.id = tableId;
        tables.push({
          id: tableId,
          content: table.outerHTML,
        });
        const placeholder = doc.createElement('div');
        placeholder.id = `table-placeholder-${tableId}`;
        placeholder.dataset.tableId = tableId;
        table.parentNode?.replaceChild(placeholder, table);
      });
  
      content = doc.body.innerHTML;
    } else if (item.role === 'user') {
      return null;
    } else {
      // other cases or unknown types
      return null;
    }
  
    if (title && category && type) {
      return (
        <Card
          key={`item-${type}-${index}`}
          card={{
            category,
            title,
            content,
            rawContent,
            type,
            tables,
          }}
          index={index}
          onCreateDoc={(content: string) => createEditableDocument(content, reportConfig)}
          onCreatePowerPoint={handleCreateStructuredPowerPoint}
          onCreateChart={(tableId: string) => {
            console.log(`Create chart for table ${tableId}`);
            // Implement chart creation logic here
          }}
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
            <h2 className="text-4xl pl-12 font-normal">{updatedMessages[0].content}</h2>
            <GridLayout items={allCards} />
          </div>
          <ChatScrollAnchor trackVisibility={isLoading} />
        </div>
      ) : (
        <div className="md:pt-16">
          <Heading size="xxl" weight="base">Heighliner</Heading>
        </div>
      )}
    </div>
  )
}

export default MainVectorPanel;