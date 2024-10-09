import React, { useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft, ChevronRight, LoaderIcon } from 'lucide-react';

pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`;

interface FileViewerProps {
  files: File[];
}

interface FileState {
  numPages?: number;
  currentPage: number;
  scale: number;
  content?: string;
}

const FileViewer: React.FC<FileViewerProps> = ({ files }) => {
  const [activeTab, setActiveTab] = useState<string>(files[0]?.name || '');
  const [documents, setDocuments] = useState<Record<string, FileState>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initialDocuments: Record<string, FileState> = {};
    files.forEach(file => {
      initialDocuments[file.name] = {
        numPages: file.type === 'application/pdf' ? 0 : 1,
        currentPage: 1,
        scale: 1,
      };
    });
    setDocuments(initialDocuments);
    setActiveTab(files[0]?.name || '');
    setLoading(true);
  }, [files]);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        const newScale = Math.min(clientWidth / 600, clientHeight / 800);
        setDocuments(prev => ({
          ...prev,
          [activeTab]: {
            ...prev[activeTab],
            scale: newScale,
          },
        }));
      }
    };
    window.addEventListener('resize', updateDimensions);
    updateDimensions();
    return () => window.removeEventListener('resize', updateDimensions);
  }, [activeTab]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setDocuments(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        numPages,
      },
    }));
    setLoading(false);
  }

  function changePage(offset: number) {
    setDocuments(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        currentPage: Math.max(1, Math.min(prev[activeTab].currentPage + offset, prev[activeTab].numPages || 1)),
      },
    }));
  }

  const previousPage = () => changePage(-1);
  const nextPage = () => changePage(1);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPage = parseInt(e.target.value, 10);
    if (!isNaN(newPage)) {
      setDocuments(prev => ({
        ...prev,
        [activeTab]: {
          ...prev[activeTab],
          currentPage: Math.max(1, Math.min(newPage, prev[activeTab].numPages || 1)),
        },
      }));
    }
  };

  const renderFileContent = (file: File) => {
    if (file.type === 'application/pdf') {
      return (
        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={(error) => {
            console.error('Error while loading document:', error);
            toast.error(`Failed to load PDF document: ${file.name}`);
          }}
        >
          <Page
            pageNumber={documents[file.name]?.currentPage || 1}
            renderTextLayer={true}
            renderAnnotationLayer={true}
            scale={documents[file.name]?.scale || 1}
          />
        </Document>
      );
    } else if (file.type.startsWith('image/')) {
      return (
        <img
          src={URL.createObjectURL(file)}
          alt={file.name}
          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
        />
      );
    } else {
      // For text files or other types
      if (!documents[file.name]?.content) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setDocuments(prev => ({
            ...prev,
            [file.name]: {
              ...prev[file.name],
              content: e.target?.result as string,
            },
          }));
        };
        reader.readAsText(file);
      }
      return (
        <pre className="whitespace-pre-wrap">
          {documents[file.name]?.content || 'Loading content...'}
        </pre>
      );
    }
  };

  return (
    <div className="file-viewer relative w-full h-full flex flex-col" ref={containerRef}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col mt-4">
        <TabsList className="w-full overflow-x-auto bg-transparent">
          {files.map(file => (
            <TabsTrigger key={file.name} value={file.name} className="">
              {file.name}
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="flex-grow relative overflow-hidden">
          {loading && (
            <div className="absolute inset-0 flex justify-center items-center bg-white dark:bg-transparent bg-opacity-75 dark:bg-opacity-75 z-10">
              <LoaderIcon className="animate-spin h-10 w-10 text-gray-500" />
            </div>
          )}
          {files.map(file => (
            <TabsContent key={file.name} value={file.name} className="absolute inset-0 overflow-auto">
              {renderFileContent(file)}
            </TabsContent>
          ))}
        </div>
        {files.find(file => file.name === activeTab)?.type === 'application/pdf' && (
          <div className="flex justify-between items-center p-4 bg-white dark:bg-transparent border-t">
            <Button
              onClick={previousPage}
              disabled={documents[activeTab]?.currentPage <= 1}
              variant="outline"
              size="sm"
              className="rounded-full"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center">
              <span className="text-sm mr-2">Page</span>
              <Input
                value={documents[activeTab]?.currentPage || 1}
                onChange={handleInputChange}
                className="w-16 text-center"
                size={4}
              />
              <span className="text-sm ml-2">of {documents[activeTab]?.numPages || '--'}</span>
            </div>
            <Button
              onClick={nextPage}
              disabled={documents[activeTab]?.currentPage >= (documents[activeTab]?.numPages || 0)}
              variant="outline"
              size="sm"
              className="rounded-full"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </Tabs>
    </div>
  );
};

export default FileViewer;