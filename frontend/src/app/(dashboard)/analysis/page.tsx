'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';
import { Document, Page, pdfjs } from 'react-pdf';
import { IconX } from '@tabler/icons-react';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import { FileUpload } from '@/components/cult/file-upload';

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

type PdfFile = {
  file: File;
  id: string;
};

export default function PdfUploadAndRenderPage() {
  const [files, setFiles] = useState<PdfFile[]>([]);
  const [selectedText, setSelectedText] = useState('');
  const [showPopover, setShowPopover] = useState(false);
  const [popoverAnchor, setPopoverAnchor] = useState<HTMLElement | null>(null);

  const handleFileUpload = (newFiles: File[]) => {
    const pdfFiles = newFiles.filter((file) => file.name.endsWith('.pdf'));
    if (pdfFiles.length < newFiles.length) {
      alert('Only PDF files are allowed. Non-PDF files were ignored.');
    }
    const filesWithId = pdfFiles.map((file) => ({
      file,
      id: URL.createObjectURL(file),
    }));
    setFiles((prevFiles) => [...prevFiles, ...filesWithId]);
  };

  const removeFile = (id: string) => {
    setFiles((prevFiles) => prevFiles.filter((fileObj) => fileObj.id !== id));
  };

  const handleAnalyze = (file: File) => {
    // Placeholder for analyze function
    console.log('Analyzing file:', file.name);
  };

  const handleTextSelection = useCallback(() => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim() !== '') {
      setSelectedText(selection.toString());
      setShowPopover(true);
      setPopoverAnchor(document.activeElement as HTMLElement);
    } else {
      setShowPopover(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mouseup', handleTextSelection);
    return () => {
      document.removeEventListener('mouseup', handleTextSelection);
    };
  }, [handleTextSelection]);

  return (
    <div className="flex w-full h-screen">
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
            <PdfPreview
              key={id}
              file={file}
              id={id}
              onRemove={() => removeFile(id)}
              onAnalyze={() => handleAnalyze(file)}
            />
          ))}
        </div>
      </div>

      {/* Right Half (Placeholder) */}
      <div className="w-1/2 p-4">
        {/* Your content for the right half goes here */}
      </div>

      {showPopover && (
        <Popover open={showPopover} onOpenChange={setShowPopover}>
          <PopoverTrigger asChild>
            <span style={{ position: 'absolute', left: 0, top: 0 }} />
          </PopoverTrigger>
          <PopoverContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                // Handle form submission
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

function PdfPreview({
  file,
  id,
  onRemove,
  onAnalyze,
}: {
  file: File;
  id: string;
  onRemove: () => void;
  onAnalyze: () => void;
}) {
  const [numPages, setNumPages] = useState<number>(0);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  return (
    <div className="relative border p-2 rounded">
      <div className="absolute top-2 right-2 flex space-x-2">
        <Button variant="outline" size="sm" onClick={onAnalyze}>
          Analyze
        </Button>
        <Button variant="destructive" size="sm" onClick={onRemove}>
          <IconX size={16} />
        </Button>
      </div>
      <Document
        file={URL.createObjectURL(file)}
        onLoadError={(error) => {
          console.error('Error while loading document:', error);
          toast.error('Failed to load PDF document.');
        }}
        onLoadSuccess={onDocumentLoadSuccess}
      >
        {Array.from({ length: numPages }, (_, pageIndex) => (
          <Page
            key={`page_${pageIndex + 1}`}
            pageNumber={pageIndex + 1}
            renderTextLayer
            renderAnnotationLayer={false}
          />
        ))}
      </Document>
    </div>
  );
}
