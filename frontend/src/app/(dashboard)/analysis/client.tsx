'use client'

import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { FileUpload } from '@/components/cult/file-upload';
import dynamic from 'next/dynamic';
import { LoaderIcon } from 'lucide-react';
import AnalysisDisplay from '@/components/analysis-display';
import { TutorialOverlay } from '@/components/tutorial/tutorial-overlay';
import { TutorialStep } from '@/components/tutorial/tutorial-step';
import Cookies from 'js-cookie';
import { AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/theme-toggle';
import UserProvider from '@/components/user-provider';
import { UpgradeAlert } from '@/components/upgrade-alert';
import { Textarea } from '@/components/ui/textarea';
import { getDocumentAnalyses } from '@/app/_data/document-analysis';
import { getCurrentUserId } from '@/app/_data/user';
import { AnalysisItems } from '@/components/nav/history/analysis-items';
import { Message } from 'ai';
import createEditableDocument from '@/components/word-doc-functions';
import { generatePowerPoint } from '@/components/structured-ppt-gen';
import { IconPresentation } from '@tabler/icons-react';

interface DocumentAnalysis {
  id: string;
  path: string;
  title: string;
  messages: Message[];
  createdAt: string;
  filePaths: string[];
  analysisId: string;
}

interface ReportConfig {
  font: string;
  pageOrientation: "portrait" | "landscape";
  marginSize: number;
  documentTitle: string;
  subject: string;
  tableOfContents: boolean;
  pageNumbering: boolean;
  headerText: string;
  footerText: string;
}

interface AnalysisSection {
  id: string;
  title: string;
  content: string;
}

function sanitizeFileName(fileName: string): string {
  return fileName.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_.-]/g, '');
}

const PDFViewer = dynamic(() => import('@/components/pdf-handler'), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center h-full">
      <LoaderIcon className="animate-spin h-10 w-10 text-gray-500" />
    </div>
  ),
});

const DEFAULT_TASK = "The following are legal documents that I would like analyzed. I need to understand the key important pieces with the relevant cited language as well as any language that can be loosely interpreted.";

export default function PdfUploadAndRenderPage() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [filesToProcess, setFilesToProcess] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisData, setAnalysisData] = useState<string>('');
  const [customTask, setCustomTask] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState('100vh');
  const [isTutorialActive, setIsTutorialActive] = useState(false);
  const [currentTutorialStep, setCurrentTutorialStep] = useState(0);
  const [dontShowTutorial, setDontShowTutorial] = useState(false);
  const [freeSearches, setFreeSearches] = useState<number | null>(null);
  const [isPro, setIsPro] = useState<boolean>(false);
  const [showUpgradeAlert, setShowUpgradeAlert] = useState(false);
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const [streamingAnalysis, setStreamingAnalysis] = useState<string>('');
  const [isAnalysisComplete, setIsAnalysisComplete] = useState(false);
  const [previousAnalyses, setPreviousAnalyses] = useState<DocumentAnalysis[]>([]);
  const [isNewUpload, setIsNewUpload] = useState(false);
  const [sections, setSections] = useState<AnalysisSection[]>([]);
  const [isInitialAnalysis, setIsInitialAnalysis] = useState(false);

  const tutorialSteps = [
    {
      title: "Document Analysis",
      description: "Upload a legal document or image to analyze. Following the initial analysis, you can highlight text anywhere on the page to ask follow-up questions. This is still experimental but analysis shouldn't take more than 5 minutes. If it lasts longer than that, feel free to refresh the page.",
      highlightId: ""
    },
    {
      title: "Disclaimer",
      description: "Heighliner is in beta, and as such does not have common SOC2 and GDPR compliance certifications. DO NOT upload documents containing personally identifiable information (PII), about yourself or others, any information containing trade secrets or sensitive information, or documents pertaining to ongoing litigations that you may or may not be involved in. By pressing 'Finish' you acknowledge the content of this disclaimer.",
      highlightId: ""
    }
  ];

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

  useEffect(() => {
    const hasSeenTutorial = Cookies.get('hasSeenDocumentAnalysisTutorial');
    if (hasSeenTutorial !== 'true') {
      setIsTutorialActive(true);
    }
  
    const updateHeight = () => {
      if (containerRef.current) {
        const viewportHeight = window.innerHeight;
        setContainerHeight(`${viewportHeight}px`);
      }
    };
  
    window.addEventListener('resize', updateHeight);
    updateHeight();
  
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
  
    const fetchPreviousAnalyses = async () => {
      const userId = await getCurrentUserId();
      if (userId) {
        const analyses = await getDocumentAnalyses(userId);
        setPreviousAnalyses(analyses);
      }
    };
  
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
  
    fetchUserStatus();
    fetchPreviousAnalyses();
    fetchReportConfig();
  
    return () => {
      window.removeEventListener('resize', updateHeight);
    };
  }, []);

  const handleNextTutorialStep = () => {
    setCurrentTutorialStep((prev) => Math.min(prev + 1, tutorialSteps.length - 1));
  };

  const handlePreviousTutorialStep = () => {
    setCurrentTutorialStep((prev) => Math.max(prev - 1, 0));
  };

  const handleCloseTutorial = () => {
    setIsTutorialActive(false);
    if (dontShowTutorial) {
      Cookies.set('hasSeenDocumentAnalysisTutorial', 'true', { expires: 365 });
    }
  };

  const updateFreeSearches = async () => {
    try {
      const response = await fetch('/api/free-searches', { method: 'POST' });
      if (!response.ok) {
        throw new Error('Failed to update free searches');
      }
      const data = await response.json();
      setFreeSearches(data.freeSearches);
    } catch (error) {
      console.error('Error updating free searches:', error);
    }
  };

  const uploadToSupabase = async (files: File[]) => {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append('files', file);
    });

    const response = await fetch('/api/upload-pdf', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to upload to Supabase: ${errorText}`);
    }

    return await response.json();
  };

  const handleFileChange = useCallback((uploadedFiles: File[]) => {
    const allowedTypes = [
      'application/pdf',
      'image/png',
      'image/jpeg',
      'image/gif',
      'image/bmp',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
  
    const validFiles = uploadedFiles.filter(file => allowedTypes.includes(file.type));
    const invalidFiles = uploadedFiles.filter(file => !allowedTypes.includes(file.type));
  
    if (validFiles.length === 0) {
      toast.error('Please upload valid files (PDF, images, or text documents).');
      return;
    }
  
    if (invalidFiles.length > 0) {
      const invalidFileTypes = [...new Set(invalidFiles.map(file => file.type))].join(', ');
      toast.warning(`The following file types are not allowed and were removed: ${invalidFileTypes}`);
    }
  
    const sanitizedFiles = validFiles.map(file => {
      const sanitizedName = sanitizeFileName(file.name);
      return new File([file], sanitizedName, { type: file.type });
    });
  
    setSelectedFiles(prevFiles => [...prevFiles, ...sanitizedFiles]);
    setIsNewUpload(true);
  
    const acceptedFileTypes = [...new Set(validFiles.map(file => file.type))];
    toast.success(`Successfully added ${validFiles.length} file(s) of type(s): ${acceptedFileTypes.join(', ')}`);
  }, []);

  const processFiles = async (files: File[], currentAnalysisId: string) => {
    setIsProcessing(true);
    setStreamingAnalysis('');
    setIsAnalysisComplete(false);
    setIsInitialAnalysis(true);
    setSections([{ id: 'initial-analysis', title: 'Initial Analysis', content: '' }]);
    try {
      await uploadToSupabase(files);
  
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append('files', file, sanitizeFileName(file.name));
      });
  
      const taskToUse = customTask.trim() || DEFAULT_TASK;
      formData.append('task', `${taskToUse} Bluebook citations are key. NEVER cite the supabase URL.`);
      formData.append('analysisId', currentAnalysisId);
  
      const response = await fetch('/api/analyze-document', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to process PDFs: ${errorText}`);
      }
  
      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
  
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const events = chunk.split('\n\n').filter(Boolean);
        for (const event of events) {
          try {
            const data = JSON.parse(event);
            if (data.type === 'report') {
              setStreamingAnalysis(prevAnalysis => prevAnalysis + (data.output || ''));
              setSections((prevSections: AnalysisSection[]) => {
                const lastSection = prevSections[prevSections.length - 1];
                return [
                  ...prevSections.slice(0, -1),
                  { ...lastSection, content: lastSection.content + data.output }
                ];
              });
            } else if (data.type === 'complete') {
              setIsAnalysisComplete(true);
            }
          } catch (error) {
            console.error('Error parsing JSON:', error);
          }
        }
      }
  
      if (!isPro) {
        await updateFreeSearches();
      }
  
      toast.success('File processing completed');
    } catch (error) {
      console.error('Error processing files:', error);
      toast.error('Failed to process files');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUploadAndProcess = useCallback(() => {
    if (selectedFiles.length === 0) {
      toast.error('Please select PDF files before uploading.');
      return;
    }
    if (!isPro && freeSearches === 0) {
      setShowUpgradeAlert(true);
      return;
    }
    setFilesToProcess(selectedFiles);
    const newAnalysisId = `analysis-${Date.now()}`;
    setAnalysisId(newAnalysisId);
    setSections([]);
    processFiles(selectedFiles, newAnalysisId);
  }, [selectedFiles, isPro, freeSearches, customTask]);

  const handleLoadPreviousAnalysis = (analysis: DocumentAnalysis) => {
    setAnalysisId(analysis.analysisId);
    setStreamingAnalysis('');
    setIsAnalysisComplete(true);
    setFilesToProcess(analysis.filePaths.map(path => new File([], path.split('/').pop() || '')));
    setIsNewUpload(false);
  
    const sections: AnalysisSection[] = [];
    let sectionIndex = 0;
    let i = 0;
  
    while (i < analysis.messages.length) {
      const userMessage = analysis.messages[i];
      let assistantMessageContent = '';
  
      if (userMessage.role === 'user') {
        i++;
        if (i < analysis.messages.length && analysis.messages[i].role === 'assistant') {
          const assistantMessage = analysis.messages[i];
          assistantMessageContent = assistantMessage.content;
          i++;
        }
        const extractUserQuestion = (content: string): string => {
          const userQuestionMatch = content.match(/User question: (.+)/);
          return userQuestionMatch ? userQuestionMatch[1] : content;
        };
        
        const sectionTitle = 
          userMessage.content === "The following are legal documents that I would like analyzed. I need to understand the key important pieces with the relevant cited language as well as any language that can be loosely interpreted. Bluebook citations are key. NEVER cite the supabase URL." ||
          userMessage.content.includes("Bluebook citations are key. NEVER cite the supabase URL.")
            ? 'Initial Analysis'
            : extractUserQuestion(userMessage.content);
        
        sections.push({
          id: `section-${sectionIndex}`,
          title: sectionTitle,
          content: assistantMessageContent
        });
        sectionIndex++;
      } else {
        i++;
      }
    }
    setSections(sections);
  };
  

  const handleClearAndUpload = () => {
    setFilesToProcess([]);
    setSelectedFiles([]);
    setAnalysisData('');
    setStreamingAnalysis('');
    setCustomTask('');
    setAnalysisId(null);
    setIsAnalysisComplete(false);
    setIsNewUpload(false);
  };

  const memoizedPDFViewer = useMemo(() => {
    return filesToProcess.length > 0 ? (
      <div>
        {selectedFiles.length > 0 && (
        <div className="h-full w-full">
          <PDFViewer files={selectedFiles} />
        </div>
      )}
      </div>
    ) : null;
  }, [filesToProcess]);

  const handleCreateDoc = (content: string) => {
    createEditableDocument(content, reportConfig);
  };

  const handleCreatePowerPoint = async (content: string) => {
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

  return (
    <>
      <div className="absolute top-4 left-4 z-50 hidden md:block">
        <FreeSearchCounter isPro={isPro} freeSearches={freeSearches} />
      </div>
      <div className="absolute top-4 right-4 z-50 flex items-center space-x-2">
        <ModeToggle />
        <UserProvider id="profile" />
      </div>

      <AnimatePresence>
        {isTutorialActive && (
          <TutorialOverlay isFirstOrLastStep={currentTutorialStep === 0 || currentTutorialStep === tutorialSteps.length - 1}>
            <TutorialStep
              {...tutorialSteps[currentTutorialStep]}
              onNext={currentTutorialStep === tutorialSteps.length - 1 ? handleCloseTutorial : handleNextTutorialStep}
              onPrevious={currentTutorialStep === 0 ? handleCloseTutorial : handlePreviousTutorialStep}
              onClose={handleCloseTutorial}
              isFirstStep={currentTutorialStep === 0}
              isLastStep={currentTutorialStep === tutorialSteps.length - 1}
              dontShowAgain={dontShowTutorial}
              setDontShowAgain={(value) => {
                setDontShowTutorial(value);
                if (value) {
                  Cookies.set('hasSeenDocumentAnalysisTutorial', 'true', { expires: 365 });
                } else {
                  Cookies.remove('hasSeenDocumentAnalysisTutorial');
                }
              }}
            />
          </TutorialOverlay>
        )}
        {showUpgradeAlert && (
          <UpgradeAlert onClose={() => setShowUpgradeAlert(false)} />
        )}
      </AnimatePresence>

      <div className="flex flex-col lg:flex-row w-full relative" style={{ height: containerHeight }} ref={containerRef}>
        <div className="w-full lg:w-1/2 overflow-hidden border-b lg:border-b-0 lg:border-r relative flex flex-col">
          {!isNewUpload && previousAnalyses.length > 0 && (
            <div className="mt-12 md:mt-6 h-full overflow-y-auto">
              <AnalysisItems 
                analyses={previousAnalyses} 
                onAnalysisSelect={handleLoadPreviousAnalysis}
              />
            </div>
          )}
          {filesToProcess.length === 0 ? (
            <Card className="border-none shadow-none dark:bg-transparent h-full">
              <CardContent className="flex flex-col items-center justify-center h-full">
                <div className="w-full max-w-md mb-4">
                  <FileUpload
                    onChange={handleFileChange}
                  />
                </div>
                <div className="w-full max-w-md mb-4 flex items-end">
                  <Textarea
                    placeholder="Enter custom task (optional)"
                    value={customTask}
                    onChange={(e) => setCustomTask(e.target.value)}
                    className="flex-grow mr-2"
                  />
                  <Button
                    onClick={handleUploadAndProcess}
                    disabled={selectedFiles.length === 0 || isProcessing}
                    className="whitespace-nowrap h-full"
                  >
                    Analyze
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {memoizedPDFViewer}
            </>
          )}
        </div>

        <div className="w-full lg:w-1/2 flex flex-col">
          <div className="flex-grow p-4 overflow-y-auto">
            {isProcessing || streamingAnalysis || sections.length > 0 ? (
              <AnalysisDisplay 
                analysis={streamingAnalysis} 
                analysisId={analysisId}
                isStreaming={isProcessing && !isAnalysisComplete}
                sections={sections}
                onUpdateSections={setSections}
                isInitialAnalysis={isInitialAnalysis}
                onCreateDoc={handleCreateDoc}
                onCreatePowerPoint={handleCreatePowerPoint}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                {selectedFiles.length > 0 
                  ? "Click 'Analyze' to get started."
                  : "Upload PDF's and click 'Analyze' to get started."}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function FreeSearchCounter({ isPro, freeSearches }: { isPro: boolean, freeSearches: number | null }) {
  if (isPro) {
    return (
      <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
        Pro
      </div>
    );
  }

  return (
    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
      Free analyses remaining: {freeSearches !== null ? freeSearches : 'Loading...'}
    </div>
  );
}