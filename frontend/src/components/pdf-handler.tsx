import React, { useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, LoaderIcon } from 'lucide-react';

pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`;

interface PDFViewerProps {
  fileUrl: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ fileUrl }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        containerRef.current.style.height = `${window.innerHeight}px`;
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
    setLoading(false);
  }

  function changePage(offset: number) {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  }

  const previousPage = () => changePage(-1);
  const nextPage = () => changePage(1);

  return (
    <div className="pdf-viewer relative w-full h-full overflow-auto" ref={containerRef}>
      {loading && (
        <div className="flex justify-center items-center h-full">
          <LoaderIcon className="animate-spin h-10 w-10 text-gray-500" />
        </div>
      )}

      <div className={`z-10 ${loading ? 'hidden' : 'block'}`}>
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
            width={containerRef.current ? containerRef.current.clientWidth : undefined}
          />
        </Document>
      </div>

      {!loading && (
        <>
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
        </>
      )}
    </div>
  );
};

export default PDFViewer;
