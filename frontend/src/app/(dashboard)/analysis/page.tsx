'use client';

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { FileUpload } from '@/components/cult/file-upload';
import dynamic from 'next/dynamic';

interface PDFViewerProps {
  fileUrl: string;
}

const PDFViewer = dynamic<PDFViewerProps>(() => import('@/components/pdf-handler'), {
  ssr: false,
  loading: () => <p>Loading PDF viewer...</p>
});

export default function PdfUploadAndRenderPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);

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
      setAnalysis(result.analysis);
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
      <div className="w-1/2 p-4 overflow-hidden border-r relative">
        {!file ? (
          <Card className="border-none shadow-none dark:bg-transparent h-full">
            <CardContent className="flex items-center justify-center h-full">
              <div className="w-full max-w-md">
                <FileUpload onChange={handleFileUpload} />
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="h-full relative">
            <PDFViewer fileUrl={URL.createObjectURL(file)} />
            <div className="absolute top-4 right-4 z-30">
              <Button onClick={handleProcessFile} disabled={isProcessing}>
                {isProcessing ? 'Processing...' : 'Process PDF'}
              </Button>
            </div>
          </div>
        )}
      </div>
      <div className="w-1/2 p-4 overflow-y-auto">
        {analysis && (
          <Card className="h-full overflow-y-auto">
            <CardContent>
              <h2 className="text-xl font-bold mb-4">Analysis</h2>
              <pre className="whitespace-pre-wrap">{analysis}</pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}