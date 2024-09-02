import React, { useContext, useState, useRef, useEffect, createContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconFileText, IconPresentation, IconX } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { Meteors } from './meteors';
import * as XLSX from 'xlsx';

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
    setCurrentIndex(index);
  };

  return (
    <CarouselContext.Provider
      value={{ onCardClose: handleCardClose, currentIndex }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10 py-10 max-w-7xl mx-auto">
        {items.map((item, index) => (
          <motion.div
            key={`card-${index}`}
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

type CardProps = {
  card: Card;
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
    setOpen(false);
    onCardClose(index);
  };

  const handleCreatePDF = () => {
    onCreateDoc(card.rawContent);
  };

  const handleCreatePowerPoint = () => {
    if (onCreatePowerPoint) {
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

  useEffect(() => {
    if (open) {
      const tables = containerRef.current?.querySelectorAll('table');
      tables?.forEach((table, index) => {
        const tableId = `table-${index}`;
        table.id = tableId;

        const iconContainer = document.createElement('div');
        iconContainer.className = 'absolute -top-10 right-0 flex space-x-2 mb-2';
        
        const downloadButton = document.createElement('button');
        downloadButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-file-download" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" /><path d="M12 17v-6" /><path d="M9.5 14.5l2.5 2.5l2.5 -2.5" /></svg>`;
        downloadButton.className = 'p-1 rounded transition-colors hover:bg-gray-200 dark:hover:bg-stone-900';
        downloadButton.setAttribute('data-table-id', tableId);
        iconContainer.appendChild(downloadButton);

        const chartButton = document.createElement('button');
        chartButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-chart-bar" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 12m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" /><path d="M9 8m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" /><path d="M15 4m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" /><path d="M4 20l14 0" /></svg>`;
        chartButton.className = 'p-1 rounded transition-colors hover:bg-gray-200 dark:hover:bg-stone-900';
        chartButton.setAttribute('data-table-id', tableId);
        iconContainer.appendChild(chartButton);

        const wrapper = document.createElement('div');
        wrapper.className = 'relative';
        table.parentNode?.insertBefore(wrapper, table);
        wrapper.appendChild(table);
        wrapper.appendChild(iconContainer);
      });

      const handleClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const button = target.closest('button');
        if (button) {
          e.preventDefault();
          e.stopPropagation();
          const tableId = button.getAttribute('data-table-id');
          if (tableId) {
            if (button.innerHTML.includes('icon-tabler-file-download')) {
              console.log('Download button clicked for table:', tableId);
              handleDownloadTable(tableId);
            } else if (button.innerHTML.includes('icon-tabler-chart-bar')) {
              console.log('Chart button clicked for table:', tableId);
              onCreateChart(tableId);
            }
          }
        }
      };

      containerRef.current?.addEventListener('click', handleClick);

      return () => {
        containerRef.current?.removeEventListener('click', handleClick);
      };
    }
  }, [open, onCreateChart]);

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
                  onClick={handleClose}
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
              <div className="py-10">{card.content}</div>
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