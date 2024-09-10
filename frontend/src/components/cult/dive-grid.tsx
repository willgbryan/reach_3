import React, { useContext, useState, useRef, useEffect, createContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconChartDots3, IconDownload, IconFileText, IconLoader2, IconPresentation, IconX } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { Meteors } from './meteors';
import * as XLSX from 'xlsx';
import DOMPurify from 'dompurify';
import { toast } from 'sonner';
import ChartCard from '../chart-card';
import ReactDOM from 'react-dom';
import { TutorialOverlay } from '@/components/tutorial/tutorial-overlay';
import { TutorialStep } from '@/components/tutorial/tutorial-step';
import Cookies from 'js-cookie';
import { PopoverBody, PopoverButton, PopoverContent, PopoverHeader, PopoverRoot, PopoverTrigger } from './popover-button';
import { LoaderIcon } from 'lucide-react';

type Card = {
  title: string;
  category: string;
  content: React.ReactNode;
  rawContent: string;
  type: 'iteration' | 'condensed' | 'sources';
};

export const CarouselContext = createContext<{
  onCardClose: (index: number) => void;
  currentIndex: number;
}>({
  onCardClose: () => {},
  currentIndex: 0,
});

export const GridLayout = ({ items }: { items: JSX.Element[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleCardClose = (index: number) => {
    console.log(`Card at index ${index} closed in GridLayout`);
    setCurrentIndex(index);
  };

  useEffect(() => {
    console.log('GridLayout rendered with', items.length, 'items');
  }, [items]);

  return (
    <CarouselContext.Provider
      value={{ onCardClose: handleCardClose, currentIndex }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10 py-10 max-w-7xl mx-auto">
        {items.map((item, index) => (
          <motion.div
            key={`card-wrapper-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * index }}
          >
            {item}
          </motion.div>
        ))}
      </div>
    </CarouselContext.Provider>
  );
};

type TableInfo = {
  id: string;
  content: string;
};

type CardProps = {
  card: {
    title: string;
    category: string;
    content: React.ReactNode;
    rawContent: string;
    type: 'iteration' | 'condensed' | 'sources';
    tables: TableInfo[];
  };
  index: number;
  onCreateDoc: (content: string) => void;
  onCreatePowerPoint?: (content: string) => void;
  onCreateChart: (tableId: string) => void;
};

export const Card: React.FC<CardProps> = ({
  card,
  index,
  onCreateDoc,
  onCreatePowerPoint,
  onCreateChart,
}) => {
  const [open, setOpen] = useState(false);
  const [chartData, setChartData] = useState<{ [key: string]: string | null }>({});
  const [chartError, setChartError] = useState<{ [key: string]: string | null }>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const { onCardClose } = useContext(CarouselContext);
  const [mermaidCode, setMermaidCode] = useState<string | null>(null);
  const [diagramData, setDiagramData] = useState<string | null>(null);
  const [diagramError, setDiagramError] = useState<string | null>(null);

  // keeping a tutorial overlay in here until the feature is stable (19/20 attempts are successes)
  const [isChartTutorialActive, setIsChartTutorialActive] = useState(false);
  const [dontShowChartTutorial, setDontShowChartTutorial] = useState(false);


  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    if (open) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", onKeyDown);
    } else {
      document.body.style.overflow = "auto";
    }

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useOutsideClick(containerRef, () => handleClose());

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    console.log('Closing card', index);
    setOpen(false);
    onCardClose(index);
  };

  const handleCreatePDF = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Creating PDF for card', index);
    onCreateDoc(card.rawContent);
  };

  const handleCreatePowerPoint = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onCreatePowerPoint) {
      console.log('Creating PowerPoint for card', index);
      onCreatePowerPoint(card.rawContent);
    }
  };

  const handleDownloadTable = (tableId: string) => {
    console.log('Download initiated for table:', tableId);
    const table = document.getElementById(tableId) as HTMLTableElement;
    if (!table) {
      console.error(`Table with id ${tableId} not found`);
      return;
    }
    const ws = XLSX.utils.table_to_sheet(table);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Table Data');
    XLSX.writeFile(wb, `table_${tableId}.xlsx`);
  };

  const sendCreateChartRequest = async (tableId: string, tableContent: string) => {
    const toastId = toast.custom((t) => (
      <div className="flex items-center justify-center w-full">
        <div className="flex items-center space-x-2">
          <LoaderIcon className="animate-spin h-5 w-5" />
          <div className="text-center">
            <div className="font-semibold">Creating your chart</div>
            <div className="text-sm text-gray-500">One moment please...</div>
          </div>
        </div>
      </div>
    ), {
      duration: Infinity,
      className: 'w-full max-w-md',
    });
  
    try {
      const response = await fetch('/api/create-chart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tableId, tableContent }),
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
  
      const result = await response.json();
      console.log('Chart created successfully:', result);
      setChartData(prevState => ({ ...prevState, [tableId]: result.d3_code }));
      setChartError(prevState => ({ ...prevState, [tableId]: null }));
  
      toast.dismiss(toastId);

    } catch (error) {
      console.error('Error creating chart:', error);
      setChartError(prevState => ({ ...prevState, [tableId]: 'Failed to create chart. Please try again.' }));
  
      toast.dismiss(toastId);
  
      toast.error("Failed to create chart", {
        description: "We're having some trouble processing your request. Please try again in a moment.",
      });
    }
  };
  
  useEffect(() => {
    const hasSeenChartTutorial = Cookies.get('hasSeenChartTutorial');
    if (hasSeenChartTutorial === 'true') {
      setDontShowChartTutorial(true);
    }
  }, []);

  const handleCreateChart = (tableId: string) => {
    console.log('Creating chart for table:', tableId);
    const table = card.tables.find(t => t.id === tableId);
    if (table) {
      if (!dontShowChartTutorial) {
        setIsChartTutorialActive(true);
      }
      sendCreateChartRequest(tableId, table.content);
    } else {
      console.error(`Table with id ${tableId} not found`);
      setChartError(prevState => ({ ...prevState, [tableId]: 'Table not found. Please try again.' }));
      toast.error("Failed to create chart", {
        description: "The specified table was not found. Please try again.",
      });
    }
  };

  const handleCloseChartTutorial = () => {
    setIsChartTutorialActive(false);
    if (dontShowChartTutorial) {
      Cookies.set('hasSeenChartTutorial', 'true', { expires: 365 });
    }
  };

  const handleCloseChart = (tableId: string) => {
    setChartData(prevState => ({ ...prevState, [tableId]: null }));
    setChartError(prevState => ({ ...prevState, [tableId]: null }));
  };

  const handleCloseDiagram = () => {
    setDiagramData(null);
    setDiagramError(null);
  };

  const handleCreateDiagram = async (diagramType: string, diagramLabel: string) => {
    const toastId = toast.custom((t) => (
      <div className="flex items-center justify-center w-full">
        <div className="flex items-center space-x-2">
          <LoaderIcon className="animate-spin h-5 w-5" />
          <div className="text-center">
            <div className="font-semibold">Creating your {diagramLabel}</div>
            <div className="text-sm text-gray-500">One moment please...</div>
          </div>
        </div>
      </div>
    ), {
      duration: Infinity,
      className: 'w-full max-w-md',
    });

    try {
      const response = await fetch('/api/generate-diagram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: card.rawContent, diagramType }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setDiagramData(data.mermaid_code);
      setDiagramError(null);
      toast.dismiss(toastId);
    } catch (error) {
      // console.error('Error creating diagram:', error);
      // setDiagramError('Failed to create diagram. Please try again.');
      toast.error('This one is on us, please try again.')
      toast.dismiss(toastId);
    }
  };

  const DiagramTypePopover = () => {
    const [popoverPosition, setPopoverPosition] = useState({ top: false, left: 0 });
    const triggerRef = useRef<HTMLButtonElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
  
    const diagramTypes = [
      { label: "Flowchart", value: "flowchart" },
      { label: "Quadrant Chart", value: "quadrantChart" },
      { label: "Architecture Diagram", value: "c4Context" },
      { label: "Timeline", value: "timeline" },
      { label: "Mindmap", value: "mindmap" },
    ];
  
    useEffect(() => {
      const updatePosition = () => {
        if (triggerRef.current && contentRef.current) {
          const triggerRect = triggerRef.current.getBoundingClientRect();
          const contentRect = contentRef.current.getBoundingClientRect();
          const windowHeight = window.innerHeight;
  
          const spaceAbove = triggerRect.top;
          const spaceBelow = windowHeight - triggerRect.bottom;
  
          setPopoverPosition({
            top: spaceBelow < contentRect.height && spaceAbove > spaceBelow,
            left: triggerRect.left,
          });
        }
      };
  
      window.addEventListener('resize', updatePosition);
      updatePosition();
  
      return () => window.removeEventListener('resize', updatePosition);
    }, []);
  
    return (
    <PopoverRoot>
      <PopoverTrigger ref={triggerRef}>
        <IconChartDots3 className="h-5 w-5 mr-2" />
        Create Diagram
      </PopoverTrigger>
      <PopoverContent ref={contentRef}>
        {diagramTypes.map((type) => (
          <PopoverButton key={type.value} onClick={() => handleCreateDiagram(type.value, type.label)}>
            {type.label}
          </PopoverButton>
        ))}
      </PopoverContent>
    </PopoverRoot>
  );
};

  const renderContent = () => {
    if (React.isValidElement(card.content) || Array.isArray(card.content)) {
      return card.content;
    }

    if (typeof card.content === 'string') {
      const parser = new DOMParser();
      const doc = parser.parseFromString(card.content, 'text/html');
      const placeholders = doc.querySelectorAll('[id^="table-placeholder-"]');

      placeholders.forEach((placeholder) => {
        const tableId = placeholder.getAttribute('data-table-id');
        const table = card.tables.find(t => t.id === tableId);
        if (table) {
          const tableWrapper = document.createElement('div');
          tableWrapper.className = 'relative mt-8';
          tableWrapper.innerHTML = `
            <div class="absolute -top-8 right-0 flex space-x-2">
              <button
                class="p-1 rounded transition-colors hover:bg-gray-200 dark:hover:bg-stone-900 download-table-btn"
                data-table-id="${tableId}"
                title="Download as Excel"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2"></path>
                  <path d="M7 11l5 5l5 -5"></path>
                  <path d="M12 4l0 12"></path>
                </svg>
              </button>
              <button
                class="p-1 rounded transition-colors hover:bg-gray-200 dark:hover:bg-stone-900 create-chart-btn"
                data-table-id="${tableId}"
                title="Create Chart"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M3 3v18h18"></path>
                  <path d="M20 18v3"></path>
                  <path d="M16 16v5"></path>
                  <path d="M12 13v8"></path>
                  <path d="M8 16v5"></path>
                  <path d="M3 11c6 0 5 -5 9 -5s3 5 9 5"></path>
                </svg>
              </button>
            </div>
            ${table.content}
          `;
          placeholder.parentNode?.replaceChild(tableWrapper, placeholder);

          const chartContainer = document.createElement('div');
          chartContainer.id = `chart-container-${tableId}`;
          chartContainer.className = 'mt-4';
          tableWrapper.appendChild(chartContainer);
        }
      });

      const sanitizedHtml = DOMPurify.sanitize(doc.body.innerHTML, {
        ADD_TAGS: ['button'],
        ADD_ATTR: ['data-table-id'],
      });

      return <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
    }

    return null;
  };

  useEffect(() => {
    if (open) {
      const container = containerRef.current;
      if (container) {
        const downloadButtons = container.querySelectorAll('.download-table-btn');
        const chartButtons = container.querySelectorAll('.create-chart-btn');

        downloadButtons.forEach(button => {
          button.addEventListener('click', (e) => {
            e.preventDefault();
            const tableId = (e.currentTarget as HTMLButtonElement).getAttribute('data-table-id');
            if (tableId) handleDownloadTable(tableId);
          });
        });

        chartButtons.forEach(button => {
          button.addEventListener('click', (e) => {
            e.preventDefault();
            const tableId = (e.currentTarget as HTMLButtonElement).getAttribute('data-table-id');
            if (tableId) handleCreateChart(tableId);
          });
        });

        return () => {
          downloadButtons.forEach(button => {
            button.removeEventListener('click', () => {});
          });
          chartButtons.forEach(button => {
            button.removeEventListener('click', () => {});
          });
        };
      }
    }
  }, [open, handleDownloadTable, handleCreateChart]);

  useEffect(() => {
    if (open) {
      Object.entries(chartData).forEach(([tableId, d3Code]) => {
        if (d3Code) {
          const chartContainer = document.getElementById(`chart-container-${tableId}`);
          if (chartContainer) {
            ReactDOM.render(
              <ChartCard 
                d3Code={d3Code} 
                onClose={() => handleCloseChart(tableId)}
              />,
              chartContainer
            );
          }
        }
      });

      if (diagramData) {
        const diagramContainer = document.getElementById('diagram-container');
        if (diagramContainer) {
          ReactDOM.render(
            <ChartCard 
              mermaidCode={diagramData} 
              onClose={handleCloseDiagram}
            />,
            diagramContainer
          );
        }
      }
    }
  }, [open, chartData, diagramData]);

  return (
    <>
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 h-screen z-[100] overflow-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="backdrop-blur-lg h-full w-full fixed inset-0"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              ref={containerRef}
              className="max-w-5xl mx-auto backdrop-blur-lg h-fit z-[110] my-10 p-4 md:p-10 rounded-lg font-sans relative"
            >
              <AnimatePresence>
                {isChartTutorialActive && (
                  <TutorialOverlay isFirstOrLastStep={true}>
                    <TutorialStep
                      title="Chart Creation Disclaimer"
                      description="This is our newest (and least stable) feature. While we can't guarantee the charts will be perfect each time, feel free to generate as many as needed. It's on the house."
                      highlightId=""
                      onNext={handleCloseChartTutorial}
                      onPrevious={handleCloseChartTutorial}
                      onClose={handleCloseChartTutorial}
                      isFirstStep={true}
                      isLastStep={true}
                      dontShowAgain={dontShowChartTutorial}
                      setDontShowAgain={(value) => {
                        setDontShowChartTutorial(value);
                        if (value) {
                          Cookies.set('hasSeenChartTutorial', 'true', { expires: 365 });
                        } else {
                          Cookies.remove('hasSeenChartTutorial');
                        }
                      }}
                    />
                  </TutorialOverlay>
                )}
              </AnimatePresence>
              <div className="sticky top-0 right-0 left-0 z-20 bg-transparent py-4 px-4 md:px-0 flex flex-col md:flex-row justify-end space-y-2 md:space-y-0 md:space-x-2">
                <button
                  className="flex items-center justify-center px-3 py-2 hover:text-stone-900 bg-stone-900 dark:bg-stone-100 rounded-full text-sm font-medium text-stone-100 dark:hover:text-stone-100 dark:text-stone-900 hover:bg-stone-300 dark:hover:bg-stone-600 transition-colors"
                  onClick={handleCreatePDF}
                  title="Download as Word Document"
                >
                  <IconFileText className="h-5 w-5 mr-2" />
                  Download as Word Document
                </button>
                {card.type !== 'sources' && onCreatePowerPoint && (
                  <button
                    className="flex items-center justify-center px-3 py-2 hover:text-stone-900 bg-stone-900 dark:bg-stone-100 rounded-full text-sm font-medium text-stone-100 dark:hover:text-stone-100 dark:text-stone-900 hover:bg-stone-300 dark:hover:bg-stone-600 transition-colors"
                    onClick={handleCreatePowerPoint}
                    title="Download as PowerPoint"
                  >
                    <IconPresentation className="h-5 w-5 mr-2" />
                    Download as PowerPoint
                  </button>
                )}
                {card.type !== 'sources' && onCreatePowerPoint && (
                  <DiagramTypePopover />
                )}
                <button
                  className="flex items-center justify-center w-10 h-10 bg-black rounded-full hover:text-stone-900 text-stone-100 dark:bg-white dark:text-stone-900 hover:bg-stone-300 dark:hover:bg-stone-600 dark:text-neutral-900 dark:hover:text-stone-100 relative z-[120]"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClose();
                  }}
                >
                  <IconX className="h-6 w-6" />
                </button>
              </div>
              <div className="mt-4">
                <p className="text-base font-medium text-black dark:text-white">
                  {card.category}
                </p>
                <p className="text-2xl md:text-5xl font-semibold text-neutral-700 mt-4 dark:text-white">
                  {card.title}
                </p>
                {diagramData && (
                  <div id="diagram-container" className="mt-4">
                    <ChartCard 
                      mermaidCode={diagramData} 
                      onClose={handleCloseDiagram}
                    />
                  </div>
                )}
                <div className="py-10 text-stone-900 dark:text-stone-100 text-base md:text-lg font-sans prose prose-stone dark:prose-invert max-w-none">
                  {renderContent()}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <motion.button
        onClick={handleOpen}
        className={cn(
          "rounded-lg bg-gray-100 dark:bg-zinc-800 h-full w-full overflow-hidden flex flex-col items-start justify-start relative z-10",
          "lg:border-r lg:border-b dark:border-zinc-800",
          index % 4 === 0 && "lg:border-l",
          "group/feature transition-all duration-300"
        )}
      >
        <div className="absolute inset-0 bg-gray-100 dark:bg-zinc-800 group-hover/feature:opacity-0 transition-opacity duration-300" />
        
        <div className="absolute inset-0 opacity-0 group-hover/feature:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-blue-500 to-teal-500 transform scale-[0.80] rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-gray-900 dark:bg-zinc-800" />
        </div>

        <div className="relative z-40 p-8 h-full w-full flex flex-col justify-start group-hover/feature:justify-end transition-all duration-300">
          <div className="h-5 w-5 rounded-full border flex items-center justify-center mb-4 border-gray-500 opacity-0 group-hover/feature:opacity-100 transition-opacity duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-2 w-2 text-gray-300"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 4.5l15 15m0 0V8.25m0 11.25H8.25"
              />
            </svg>
          </div>
          
          <p className="text-neutral-600 dark:text-neutral-400 group-hover/feature:text-neutral-300 text-sm md:text-base font-medium font-sans text-left mb-2 transition-colors duration-300">
            {card.category}
          </p>
          
          <p className="text-neutral-800 dark:text-neutral-100 group-hover/feature:text-white text-xl md:text-3xl font-normal max-w-xs text-left [text-wrap:balance] font-sans group-hover/feature:translate-x-2 transition duration-300">
            {card.title}
          </p>
        </div>

        <div className="absolute inset-0 opacity-0 group-hover/feature:opacity-100 transition-opacity duration-300 pointer-events-none overflow-hidden">
          <Meteors number={20} />
        </div>
      </motion.button>
    </>
  );
};