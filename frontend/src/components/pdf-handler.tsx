import React, { useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft, ChevronRight, LoaderIcon } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
  const [isMobile, setIsMobile] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | undefined>('documents');

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);


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
    if (!containerRef.current) return;
    
    const updateDimensions = () => {
      const container = containerRef.current;
      if (!container) return;
      
      const { clientWidth, clientHeight } = container;
      // Adjust scale calculation for better mobile viewing
      const newScale = Math.min(
        (clientWidth - 32) / 500, // Reduced padding for mobile
        (clientHeight - 140) / 700 // Increased space for navigation
      );
      
      setDocuments(prev => ({
        ...prev,
        [activeTab]: {
          ...prev[activeTab],
          scale: Math.max(0.6, newScale),
        },
      }));
    };

    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(containerRef.current);
    
    updateDimensions();
    
    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
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


  const renderContent = () => {
    if (isMobile) {
      return (
        <Accordion 
          type="single" 
          collapsible 
          className="w-full"
          value={openAccordion}
          onValueChange={setOpenAccordion}
        >
          <AccordionItem value="documents">
            <AccordionTrigger className="px-4 pt-20">Documents</AccordionTrigger>
            <AccordionContent className="overflow-hidden">
            <div className="file-viewer w-full flex flex-col" ref={containerRef}>
                <Tabs 
                  value={activeTab} 
                  onValueChange={setActiveTab} 
                  className="w-full flex flex-col"
                >
                  <TabsList className="w-full overflow-x-auto bg-transparent justify-start mb-2">
                    {files.map(file => (
                      <TabsTrigger 
                        key={file.name} 
                        value={file.name}
                        className="px-4 py-2 whitespace-nowrap"
                      >
                        {file.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {renderMainContent()}
                </Tabs>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      );
    }

    return (
      <div className="file-viewer w-full h-full flex flex-col" ref={containerRef}>
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="w-full h-full flex flex-col pt-4 px-2 md:px-4 mt-6"
        >
          <TabsList className="w-full overflow-x-auto bg-transparent justify-start mb-2">
            {files.map(file => (
              <TabsTrigger 
                key={file.name} 
                value={file.name}
                className="px-4 py-2 whitespace-nowrap"
              >
                {file.name}
              </TabsTrigger>
            ))}
          </TabsList>
          {renderMainContent()}
        </Tabs>
      </div>
    );
  };

  const renderMainContent = () => {
    return (
      <>
        <div className={`relative overflow-auto ${isMobile ? 'h-[70vh]' : 'flex-grow'}`}>
          {loading && (
            <div className="absolute inset-0 flex justify-center items-center bg-background/50 z-10">
              <LoaderIcon className="animate-spin h-10 w-10" />
            </div>
          )}
          
          {files.map(file => (
            <TabsContent
              key={file.name}
              value={file.name}
              className="absolute inset-0 flex justify-center items-center overflow-auto px-2 md:px-4"
            >
              <div className="w-full h-full flex justify-center items-center">
                {renderFileContent(file)}
              </div>
            </TabsContent>
          ))}
        </div>

        {files.find(file => file.name === activeTab)?.type === 'application/pdf' && (
          <div className="flex justify-between items-center p-4 bg-white dark:bg-transparent border-t">
            <Button
              onClick={() => changePage(-1)}
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
              onClick={() => changePage(1)}
              disabled={documents[activeTab]?.currentPage >= (documents[activeTab]?.numPages || 0)}
              variant="outline"
              size="sm"
              className="rounded-full"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </>
    );
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
          className="flex justify-center"
        >
          <Page
            pageNumber={documents[file.name]?.currentPage || 1}
            renderTextLayer={true}
            renderAnnotationLayer={true}
            scale={documents[file.name]?.scale || 1}
            className="max-w-full"
          />
        </Document>
      );
    } else if (file.type.startsWith('image/')) {
      return (
        <img
          src={URL.createObjectURL(file)}
          alt={file.name}
          className="max-w-full max-h-full object-contain"
        />
      );
    } else {
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
        <pre className="whitespace-pre-wrap p-4">
          {documents[file.name]?.content || 'Loading content...'}
        </pre>
      );
    }
  };

  return renderContent();
};

export default FileViewer;