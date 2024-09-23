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

  const tutorialSteps = [
    {
      title: "Document Analysis",
      description: "Upload a legal document to analyze. Following the initial analysis, you can highlight text anywhere on the page to ask follow-up questions. Results are not saved quite yet, we're working to ship that functionality soon. This is still experimental but analysis shouldn't take more than 5 minutes. If it lasts longer than that, feel free to refresh the page.",
      highlightId: ""
    },
    {
      title: "Disclaimer",
      description: "Heighliner is in beta, and as such does not have common SOC2 and GDPR compliance certifications. DO NOT upload documents containing personally identifiable information (PII), about yourself or others, any information containing trade secrets or sensitive information, or documents pertaining to ongoing litigations that you may or may not be involved in. By pressing 'Finish' you acknowledge the content of this disclaimer.",
      highlightId: ""
    }
  ];

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

    fetchUserStatus();

    return () => window.removeEventListener('resize', updateHeight);
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
    const pdfFiles = uploadedFiles.filter(file => file.type === 'application/pdf');
    if (pdfFiles.length === 0) {
      toast.error('Please upload valid PDF files.');
      return;
    }
    if (pdfFiles.length < uploadedFiles.length) {
      toast.warning('Only PDF files are allowed. Non-PDF files were removed.');
    }
    setSelectedFiles(prevFiles => [...prevFiles, ...pdfFiles]);
  }, []);

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
    processFiles(selectedFiles);
  }, [selectedFiles, isPro, freeSearches, customTask]);

  const processFiles = async (files: File[]) => {
    setIsProcessing(true);
    try {
      await uploadToSupabase(files);

      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append('files', file);
      });

      const taskToUse = customTask.trim() || DEFAULT_TASK;
      formData.append('task', `${taskToUse} Bluebook citations are key. NEVER cite the supabase URL.`);

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
              setAnalysisData(prevData => data.accumulatedOutput || data.output);
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

  const handleClearAndUpload = () => {
    setFilesToProcess([]);
    setSelectedFiles([]);
    setAnalysisData('');
    setCustomTask('');
  };

  const memoizedPDFViewer = useMemo(() => {
    return filesToProcess.length > 0 ? (
      <div className="h-full w-full">
        {selectedFiles.length > 0 && (
        <div className="h-full w-full">
          <PDFViewer files={selectedFiles} />
        </div>
      )}
      </div>
    ) : null;
  }, [filesToProcess]);

  return (
    <>
      <div className="absolute top-4 left-4 z-50">
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
      <div className="flex w-full relative" style={{ height: containerHeight }} ref={containerRef}>
        <div className="w-1/2 overflow-hidden border-r relative flex flex-col">
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
        <div className="w-1/2 flex flex-col">
          <div className="flex-grow p-4 overflow-y-auto">
            {isProcessing ? (
              <div className="flex flex-col items-center justify-center h-full">
                <LoaderIcon className="animate-spin h-10 w-10 text-gray-500 mb-4" />
                <span className="text-gray-700 dark:text-gray-300">Analyzing Documents...</span>
              </div>
            ) : analysisData ? (
              <AnalysisDisplay analysis={analysisData} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                {selectedFiles.length > 0 
                  ? "Click 'Analyze' to get started."
                  : "Upload PDF's and click 'Analyze' to get started."}
              </div>
            )}
          </div>
          {filesToProcess.length > 0 && !isProcessing && (
            <div className="p-4 border-t">
              <Button
                onClick={handleClearAndUpload}
                className="w-full"
              >
                Clear and Upload New Files
              </Button>
            </div>
          )}
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