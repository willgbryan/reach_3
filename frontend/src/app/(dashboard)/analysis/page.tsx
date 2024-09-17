'use client';

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
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

  const handleFileUpload = useCallback(async (newFiles: File[]) => {
    if (newFiles.length === 0 || newFiles[0].type !== 'application/pdf') {
      toast.error('Please upload a valid PDF file.');
      return;
    }
    const uploadedFile = newFiles[0];
    try {
      setFile(uploadedFile);
      toast.success('File uploaded successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file');
    }
  }, []);

  const handleProcessFile = useCallback(async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/process-pdf', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Failed to process PDF');
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
  }, [file]);

  return (
    <div className="flex w-full h-screen">
      <div className="w-1/2 overflow-hidden border-r relative">
        {!file ? (
          <Card className="border-none shadow-none dark:bg-transparent h-full">
            <CardContent className="flex items-center justify-center h-full">
              <div className="w-full max-w-md">
                <FileUpload onChange={handleFileUpload} />
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="h-full relative flex flex-col">
            <div className="flex-grow relative">
              <PDFViewer fileUrl={URL.createObjectURL(file)} />
            </div>
            <div className="p-4">
              <Button onClick={handleProcessFile} disabled={isProcessing} className="w-full">
                {isProcessing ? 'Processing...' : 'Process PDF'}
              </Button>
            </div>
          </div>
        )}
      </div>
      <div className="w-1/2 p-4 overflow-y-auto">
        {analysis ? (
          <AnalysisDisplay analysis={analysis} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            No analysis available. Process a PDF to see results.
          </div>
        )}
      </div>
    </div>
  );
}