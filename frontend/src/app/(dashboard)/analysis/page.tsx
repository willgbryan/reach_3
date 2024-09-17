'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
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

interface DocumentAnalysis {
  key_points: Array<{ key_point: string; important_language: string[] }>;
  ambiguous_clauses: Array<{ clause: string; ambiguous_language: string[] }>;
}

export default function PdfUploadAndRenderPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysis, setAnalysis] = useState<DocumentAnalysis | null>(null);
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

  const processFile = async (file: File) => {
    setIsProcessing(true);
    try {
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
  
      const result = await response.json();
      setAnalysis(result);
      toast.success('File processed successfully');
    } catch (error) {
      console.error('Error processing file:', error);
      toast.error('Failed to process file');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = useCallback(async (newFiles: File[]) => {
    if (newFiles.length === 0 || newFiles[0].type !== 'application/pdf') {
      toast.error('Please upload a valid PDF file.');
      return;
    }
    const uploadedFile = newFiles[0];
    try {
      setFile(uploadedFile);
      toast.success('File uploaded successfully');
      await processFile(uploadedFile);
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file');
    }
  }, []);

  return (
    <div className="flex w-full" style={{ height: containerHeight }} ref={containerRef}>
      <div className="w-1/2 overflow-hidden border-r relative flex flex-col">
        {!file ? (
          <Card className="border-none shadow-none dark:bg-transparent h-full">
            <CardContent className="flex items-center justify-center h-full">
              <div className="w-full max-w-md">
                <FileUpload onChange={handleFileUpload} />
              </div>
            </CardContent>
          </Card>
        ) : (
          <PDFViewer fileUrl={URL.createObjectURL(file)} />
        )}
      </div>
      <div className="w-1/2 p-4 overflow-y-auto">
        {isProcessing ? (
          <div className="flex flex-col items-center justify-center h-full">
            <LoaderIcon className="animate-spin h-10 w-10 text-gray-500 mb-4" />
            <span className="text-gray-700 dark:text-gray-300">Analyzing Document...</span>
          </div>
        ) : analysis ? (
          <AnalysisDisplay analysis={analysis} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            No analysis available. Upload a PDF to see results.
          </div>
        )}
      </div>
    </div>
  );
}