import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import { toast } from 'sonner';

pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`;

interface PDFViewerProps {
  fileUrl: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ fileUrl }) => {
  const [numPages, setNumPages] = useState<number | null>(null);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  return (
    <div className="pdf-viewer">
      <Document
        file={fileUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={(error) => {
          console.error('Error while loading document:', error);
          toast.error('Failed to load PDF document.');
        }}
      >
        {Array.from(new Array(numPages), (el, index) => (
          <Page 
            key={`page_${index + 1}`}
            pageNumber={index + 1} 
            renderTextLayer={true}
            renderAnnotationLayer={true}
          />
        ))}
      </Document>
      {numPages && (
        <p className="page-info">Document has {numPages} page{numPages > 1 ? 's' : ''}</p>
      )}
    </div>
  );
};

export default PDFViewer;