import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { IconX, IconDownload } from "@tabler/icons-react";

interface ChartCardProps {
  d3Code: string;
  onClose: () => void;
}

const ChartCard: React.FC<ChartCardProps> = ({ d3Code, onClose }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');

  useEffect(() => {
    const renderChart = () => {
      if (chartRef.current) {
        chartRef.current.innerHTML = '';
        const cleanedCode = d3Code
          .replace(/```javascript\n/, '')
          .replace(/```[\s]*$/, '')
          .trim();
        console.log("Cleaned D3 Code: ", cleanedCode);
        setDebugInfo((prev) => prev + `Cleaned D3 Code:\n${cleanedCode}\n\n`);

        if ((cleanedCode.match(/{/g) || []).length !== (cleanedCode.match(/}/g) || []).length) {
          setError("Error rendering chart: Unmatched braces in the generated code.");
          setDebugInfo((prev) => prev + "Error: Unmatched braces in the code.\n");
          return;
        }

        try {
          console.log("Executing D3 code...");
          setDebugInfo((prev) => prev + "Executing D3 code...\n");

          const wrappedCode = `
            (function() {
              try {
                let svg = d3.select(container).select('svg');
                if (!svg.empty()) {
                  svg.selectAll("*").remove(); // Clear any existing chart
                } else {
                  svg = d3.select(container)
                    .append('svg')
                    .attr('width', '100%')
                    .attr('height', '100%')
                    .attr('preserveAspectRatio', 'xMidYMid meet')
                    .attr('viewBox', '0 0 600 400');
                }
                // Execute the provided D3 code
                ${cleanedCode}
                console.log('D3 code executed successfully');

                // Ensure the chart fills the container
                const chartBBox = svg.node().getBBox();
                svg.attr('viewBox', \`\${chartBBox.x} \${chartBBox.y} \${chartBBox.width} \${chartBBox.height}\`);
              } catch (error) {
                console.error('Error in D3 code:', error);
                throw error;
              }
            })();
          `;

          console.log('Wrapped D3 Code (IIFE):', wrappedCode);
          setDebugInfo((prev) => prev + `Wrapped D3 Code (IIFE):\n${wrappedCode}\n\n`);

          const executeD3Code = new Function('d3', 'container', wrappedCode);
          executeD3Code(d3, chartRef.current);

          console.log("D3 code executed successfully");
          setDebugInfo((prev) => prev + "D3 code executed successfully\n");
        } catch (error) {
          console.error('Error executing D3 code:', error);
          setError(`Error rendering chart: ${(error as Error).message}`);
          setDebugInfo((prev) => prev + `Error executing D3 code: ${(error as Error).message}\n`);
        }
      } else {
        setError("Chart container not found");
        setDebugInfo((prev) => prev + "Error: Chart container not found\n");
      }
    };

    renderChart();

    const handleResize = () => {
      renderChart();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [d3Code]);

  const handleDownload = () => {
    const svg = chartRef.current?.querySelector('svg');
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = 'chart.png';
        downloadLink.href = pngFile;
        downloadLink.click();
      };

      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    } else {
      console.error('SVG element not found');
    }
  };

  return (
    <div className="chart-container relative bg-transparent rounded-lg p-4 mt-4 w-full h-full">
      <div className="absolute top-2 right-2 flex space-x-2 z-10">
        <button
          onClick={handleDownload}
          className="p-1 rounded transition-colors hover:bg-gray-200 dark:hover:bg-stone-700"
          title="Download as PNG"
        >
          <IconDownload className="h-5 w-5" />
        </button>
        <button
          onClick={onClose}
          className="p-1 rounded transition-colors hover:bg-gray-200 dark:hover:bg-stone-700"
          title="Close Chart"
        >
          <IconX className="h-5 w-5" />
        </button>
      </div>
      <div ref={chartRef} className="chart-content w-full h-full">
      </div>
      {error && <div className="error-message mt-2 text-red-500">{"This one's on us, please try pressing the chart button again."}</div>}
    </div>
  );
};

export default ChartCard;