import React, { useRef, useEffect } from 'react';
import { IconX } from "@tabler/icons-react";

interface ChartCardProps {
    d3Code: string;
    onClose: () => void;
  }
  
  const ChartCard: React.FC<ChartCardProps> = ({ d3Code, onClose }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartRef.current && window.d3) {
      chartRef.current.innerHTML = '';
      
      const cleanedCode = d3Code
        .replace(/```javascript\n/, '')
        .replace(/```\n$/, '')
        .trim();

      const executeD3Code = new Function('d3', 'container', cleanedCode);

      const container = document.createElement('div');
      chartRef.current.appendChild(container);

      try {
        executeD3Code(window.d3, container);
      } catch (error) {
        console.error('Error executing D3 code:', error);
        chartRef.current.innerHTML = `<p>Error rendering chart: ${error.message}</p>`;
      }
    } else if (!window.d3) {
      console.error('D3 library not found');
      if (chartRef.current) {
        chartRef.current.innerHTML = '<p>Error: D3 library not loaded</p>';
      }
    }
  }, [d3Code]);

  return (
    <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg w-full h-full overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Generated Chart</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <IconX className="h-6 w-6" />
        </button>
      </div>
      <div ref={chartRef} className="w-full h-[500px]"></div>
    </div>
  );
};

export default ChartCard;