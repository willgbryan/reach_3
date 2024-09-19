'use client';

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

const PDFViewer = dynamic(() => import('@/components/pdf-handler'), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center h-full">
      <LoaderIcon className="animate-spin h-10 w-10 text-gray-500" />
    </div>
  ),
});

export default function PdfUploadAndRenderPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisData, setAnalysisData] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState('100vh');
  const [isTutorialActive, setIsTutorialActive] = useState(false);
  const [currentTutorialStep, setCurrentTutorialStep] = useState(0);
  const [dontShowTutorial, setDontShowTutorial] = useState(false);

  const tutorialSteps = [
    {
      title: "Document Analysis",
      description: "Upload a legal document to analyze. Following the initial analysis, you can highlight text anywhere on the page to ask follow-up questions. Results are not saved quite yet, we're working to ship that functioniality soon.",
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

  const uploadToSupabase = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

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

  const processFile = async (file: File) => {
    setIsProcessing(true);
    try {
      await uploadToSupabase(file);

      const formData = new FormData();
      formData.append('file', file);
  
      const response = await fetch('/api/analyze-document', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to process PDF: ${errorText}`);
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

      toast.success('File processing completed');
    } catch (error) {
      console.error('Error processing file:', error);
      toast.error('Failed to process file');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = useCallback((uploadedFiles: File[]) => {
    const pdfFiles = uploadedFiles.filter(file => file.type === 'application/pdf');
    if (pdfFiles.length === 0) {
      toast.error('Please upload a valid PDF file.');
      return;
    }
    if (pdfFiles.length < uploadedFiles.length) {
      toast.warning('Only PDF files are allowed. Non-PDF files were removed.');
    }
    setFile(pdfFiles[0]);
    processFile(pdfFiles[0]);
  }, []);

  const memoizedPDFViewer = useMemo(() => {
    return file ? <PDFViewer fileUrl={URL.createObjectURL(file)} /> : null;
  }, [file]);

  return (
    <>
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
      </AnimatePresence>
      <div className="flex w-full" style={{ height: containerHeight }} ref={containerRef}>
        <div className="w-1/2 overflow-hidden border-r relative flex flex-col">
          {!file ? (
            <Card className="border-none shadow-none dark:bg-transparent h-full">
              <CardContent className="flex items-center justify-center h-full">
                <div className="w-full max-w-md">
                  <FileUpload 
                    onChange={handleFileUpload} 
                  />
                </div>
              </CardContent>
            </Card>
          ) : (
            memoizedPDFViewer
          )}
        </div>
        <div className="w-1/2 p-4 overflow-y-auto">
          {isProcessing ? (
            <div className="flex flex-col items-center justify-center h-full">
              <LoaderIcon className="animate-spin h-10 w-10 text-gray-500 mb-4" />
              <span className="text-gray-700 dark:text-gray-300">Analyzing Document...</span>
            </div>
          ) : analysisData ? (
            <AnalysisDisplay analysis={analysisData} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Upload a PDF to get started.
            </div>
          )}
        </div>
      </div>
    </>
  );
}