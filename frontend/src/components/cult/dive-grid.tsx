import React, { useContext, useState, useRef, useEffect, createContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconChartBar, IconDownload, IconFileText, IconPresentation, IconX } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { Meteors } from './meteors';
import * as XLSX from 'xlsx';
import DOMPurify from 'dompurify';
import { toast } from 'sonner';

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

const ChartCard: React.FC<{ d3Code: string; onClose: () => void }> = ({ d3Code, onClose }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.innerHTML = '';
      
      const script = document.createElement('script');
      script.textContent = d3Code;
      
      chartRef.current.appendChild(script);
    }
  }, [d3Code]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Generated Chart</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <IconX className="h-6 w-6" />
          </button>
        </div>
        <div ref={chartRef} className="w-full h-[500px]"></div>
      </div>
    </div>
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
  const [chartData, setChartData] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { onCardClose } = useContext(CarouselContext);

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

  const renderContent = () => {
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
        }
      });

      const sanitizedHtml = DOMPurify.sanitize(doc.body.innerHTML, {
        ADD_TAGS: ['button'],
        ADD_ATTR: ['data-table-id'],
      });

      return sanitizedHtml;
    }
    return '';
  };

  const sendCreateChartRequest = async (tableId: string, tableContent: string) => {
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
      setChartData(result.d3_code);
    } catch (error) {
      console.error('Error creating chart:', error);
      toast.error("We're having some trouble processing your request. Please try again in a moment.")
    }
  };

  const handleCreateChart = (tableId: string) => {
    console.log('Creating chart for table:', tableId);
    const table = card.tables.find(t => t.id === tableId);
    if (table) {
      sendCreateChartRequest(tableId, table.content);
    } else {
      console.error(`Table with id ${tableId} not found`);
    }
  };

  const handleCloseChart = () => {
    setChartData(null);
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
              <div className="sticky top-4 right-0 ml-auto flex flex-col md:flex-row justify-end space-y-2 md:space-y-0 md:space-x-2">
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
                <button
                  className="flex items-center justify-center w-10 h-10 bg-black rounded-full hover:text-stone-900 text-stone-100 dark:bg-white dark:text-stone-900 hover:bg-stone-300 dark:hover:bg-stone-600 dark:text-neutral-900 dark:hover:text-stone-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClose();
                  }}
                >
                  <IconX className="h-6 w-6" />
                </button>
              </div>
              <p className="text-base font-medium text-black dark:text-white">
                {card.category}
              </p>
              <p className="text-2xl md:text-5xl font-semibold text-neutral-700 mt-4 dark:text-white">
                {card.title}
              </p>
              <div 
                className="py-10 text-stone-900 dark:text-stone-100 text-base md:text-lg font-sans prose prose-stone dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: renderContent() }}
              />
              {chartData && <ChartCard d3Code={chartData} onClose={handleCloseChart} />}

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