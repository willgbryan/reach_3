import React, { useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronLeft, ChevronRight, LoaderIcon } from 'lucide-react';

pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`;

interface PDFViewerProps {
  fileUrl: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ fileUrl }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [inputPageNumber, setInputPageNumber] = useState<string>('1');
  const [loading, setLoading] = useState<boolean>(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setScale(Math.min(clientWidth / 600, clientHeight / 800));
      }
    };
    window.addEventListener('resize', updateDimensions);
    updateDimensions();
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
    setInputPageNumber('1');
    setLoading(false);
  }

  function changePage(offset: number) {
    setPageNumber((prevPageNumber) => {
      const newPageNumber = prevPageNumber + offset;
      setInputPageNumber(newPageNumber.toString());
      return newPageNumber;
    });
  }

  const previousPage = () => changePage(-1);
  const nextPage = () => changePage(1);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputPageNumber(e.target.value);
  };

  const handleInputBlur = () => {
    const newPageNumber = parseInt(inputPageNumber, 10);
    if (!isNaN(newPageNumber) && newPageNumber >= 1 && newPageNumber <= (numPages || 1)) {
      setPageNumber(newPageNumber);
    } else {
      setInputPageNumber(pageNumber.toString());
      toast.error('Invalid page number');
    }
  };

  const handleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleInputBlur();
    }
  };

  return (
    <div className="pdf-viewer relative w-full h-full flex flex-col" ref={containerRef}>
      {loading && (
        <div className="flex justify-center items-center h-full">
          <LoaderIcon className="animate-spin h-10 w-10 text-gray-500" />
        </div>
      )}
      <div className={`flex-grow overflow-auto ${loading ? 'hidden' : 'block'}`}>
        <Document
          file={fileUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={(error) => {
            console.error('Error while loading document:', error);
            toast.error('Failed to load PDF document.');
          }}
        >
          <Page
            pageNumber={pageNumber}
            renderTextLayer={true}
            renderAnnotationLayer={true}
            scale={scale}
          />
        </Document>
      </div>
      {!loading && (
        <div className="flex justify-between items-center p-4 bg-white dark:bg-transparent border-t">
          <Button
            onClick={previousPage}
            disabled={pageNumber <= 1}
            variant="outline"
            size="sm"
            className="rounded-full"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center">
            <span className="text-sm mr-2">Page</span>
            <Input
              value={inputPageNumber}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onKeyPress={handleInputKeyPress}
              className="w-16 text-center"
              size={4}
            />
            <span className="text-sm ml-2">of {numPages || '--'}</span>
          </div>
          <Button
            onClick={nextPage}
            disabled={pageNumber >= (numPages || 0)}
            variant="outline"
            size="sm"
            className="rounded-full"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default PDFViewer;