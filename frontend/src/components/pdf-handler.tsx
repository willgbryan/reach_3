import React, { useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`;

interface PDFViewerProps {
  fileUrl: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ fileUrl }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [width, setWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setWidth(containerRef.current.clientWidth - 40);
      }
    };

    window.addEventListener('resize', updateWidth);
    updateWidth();

    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  function changePage(offset: number) {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  }

  const previousPage = () => changePage(-1);
  const nextPage = () => changePage(1);

  return (
    <div className="pdf-viewer relative" ref={containerRef}>
      {/* Wrap the Document in a div with lower z-index */}
      <div className="z-10">
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
            width={width}
          />
        </Document>
      </div>

      <div className="absolute inset-0 z-20 pointer-events-none">
        <div className="h-full w-full flex items-center justify-between px-4">
          <Button
            onClick={previousPage}
            disabled={pageNumber <= 1}
            variant="outline"
            size="icon"
            className="rounded-full bg-zinc-500/50 hover:bg-zinc-500/75 pointer-events-auto text-black"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            onClick={nextPage}
            disabled={pageNumber >= (numPages || 0)}
            variant="outline"
            size="icon"
            className="rounded-full bg-zinc-500/50 hover:bg-zinc-500/75 pointer-events-auto text-black"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/75 px-2 py-1 rounded-full text-sm z-30">
        Page {pageNumber || (numPages ? 1 : '--')} of {numPages || '--'}
      </div>
    </div>
  );
};

export default PDFViewer;
