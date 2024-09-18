'use client';

import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { FileUpload } from '@/components/cult/file-upload';
import dynamic from 'next/dynamic';
import { LoaderIcon } from 'lucide-react';
import AnalysisDisplay from '@/components/analysis-display';

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

  useEffect(() => {
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
  );
}