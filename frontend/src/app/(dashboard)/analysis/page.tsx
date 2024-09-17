'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';
import { IconX } from '@tabler/icons-react';
import { FileUpload } from '@/components/cult/file-upload';
import dynamic from 'next/dynamic';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

type PdfFile = {
  file: File;
  id: string;
};

const PDFViewer = dynamic(() => import('@/components/pdf-handler'), {
  ssr: false,
  loading: () => <p>Loading PDF viewer...</p>
});

export default function PdfUploadAndRenderPage() {
  const [files, setFiles] = useState<PdfFile[]>([]);
  const [selectedText, setSelectedText] = useState('');
  const [showPopover, setShowPopover] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleFileUpload = (newFiles: File[]) => {
    const pdfFiles = newFiles.filter((file) => file.type === 'application/pdf');
    if (pdfFiles.length < newFiles.length) {
      toast.error('Only PDF files are allowed. Non-PDF files were ignored.');
    }
    const filesWithId = pdfFiles.map((file) => ({
      file,
      id: URL.createObjectURL(file),
    }));
    setFiles((prevFiles) => [...prevFiles, ...filesWithId]);
  };

  const removeFile = (id: string) => {
    setFiles((prevFiles) => prevFiles.filter((fileObj) => fileObj.id !== id));
    URL.revokeObjectURL(id);
  };

  const handleAnalyze = (file: File) => {
    console.log('Analyzing file:', file.name);
    toast.info(`Analyzing ${file.name}`);
  };

  const handleTextSelection = useCallback((event: MouseEvent) => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim() !== '') {
      setSelectedText(selection.toString());
      setShowPopover(true);
      
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const containerRect = containerRef.current?.getBoundingClientRect();

      if (containerRect) {
        setPopoverPosition({
          top: rect.bottom - containerRect.top,
          left: rect.left - containerRect.left,
        });
      }
    } else {
      setShowPopover(false);
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('mouseup', handleTextSelection);
      return () => {
        container.removeEventListener('mouseup', handleTextSelection);
      };
    }
  }, [handleTextSelection]);

  return (
    <div ref={containerRef} className="flex w-full h-screen relative">
      <div className="w-1/2 p-4 overflow-y-auto">
        <Card className="border-none shadow-none dark:bg-transparent">
          <CardContent className="px-0">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Upload PDFs</Label>
                <div className="w-full border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg">
                  <FileUpload onChange={handleFileUpload} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-4 space-y-4">
          {files.map(({ file, id }) => (
            <div key={id} className="relative border p-2 rounded">
              <div className="absolute top-2 right-2 flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleAnalyze(file)}>
                  Analyze
                </Button>
                <Button variant="destructive" size="sm" onClick={() => removeFile(id)}>
                  <IconX size={16} />
                </Button>
              </div>
              <PDFViewer fileUrl={id} />
            </div>
          ))}
        </div>
      </div>

      {showPopover && (
        <Popover open={showPopover} onOpenChange={setShowPopover}>
          <PopoverTrigger asChild>
            <span style={{
              position: 'absolute',
              top: `${popoverPosition.top}px`,
              left: `${popoverPosition.left}px`,
            }} />
          </PopoverTrigger>
          <PopoverContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                console.log('Submitting:', selectedText);
                toast.success('Form submitted successfully');
                setShowPopover(false);
              }}
              className="grid gap-4"
            >
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Submit Text</h4>
                <p className="text-sm text-muted-foreground">
                  The highlighted text is shown below. You can add a prompt.
                </p>
              </div>
              <div className="grid gap-2">
                <div className="space-y-2">
                  <Label>Highlighted Text</Label>
                  <textarea
                    className="w-full h-24 p-2 border rounded"
                    value={selectedText}
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prompt">Prompt</Label>
                  <Input id="prompt" name="prompt" required />
                </div>
              </div>
              <Button type="submit">Submit</Button>
            </form>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}