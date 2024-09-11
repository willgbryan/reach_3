import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { IconX, IconDownload, IconRefresh } from "@tabler/icons-react";
import { toast } from 'sonner';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: false,
  securityLevel: 'strict',
  theme: 'default',
  logLevel: 5,
  deterministicIds: true,
  flowchart: { 
    htmlLabels: false,
    useMaxWidth: true 
  }
});

interface ChartCardProps {
  d3Code?: string;
  mermaidCode?: string;
  onClose: () => void;
  onRetry?: () => void;
}

const ChartCard: React.FC<ChartCardProps> = ({ d3Code, mermaidCode, onClose, onRetry }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  useEffect(() => {
    if (d3Code) {
      renderChart();
    } else if (mermaidCode) {
      renderDiagram();
    }
  }, [d3Code, mermaidCode]);

  const renderChart = () => {
    if (chartRef.current && d3Code) {
      chartRef.current.innerHTML = '';
      const cleanedCode = d3Code
          .replace(/```javascript\n/, '')
          .replace(/```[\s]*$/, '')
          .trim();
      console.log("Cleaned D3 Code: ", cleanedCode);

      if ((cleanedCode.match(/{/g) || []).length !== (cleanedCode.match(/}/g) || []).length) {
          setError("Error rendering chart: Unmatched braces in the generated code.");
          return;
      }

      try {
          console.log("Executing D3 code...");

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

        const executeD3Code = new Function('d3', 'container', wrappedCode);
        executeD3Code(d3, chartRef.current);

        setError(null);
        setRetryCount(0);
      } catch (error) {
        console.error('Error executing D3 code:', error);
        setError(`Error rendering chart: ${(error as Error).message}`);
        if (retryCount < MAX_RETRIES) {
          setRetryCount(prevCount => prevCount + 1);
          onRetry?.();
        } else {
          toast.error('Failed to render chart after multiple attempts. Please try again later.');
        }
      }
    } else {
      setError("Chart container not found");
    }
  };

  const cleanMermaidCode = (code: string): string => {
    let cleaned = code.replace(/^```mermaid\n/, '').replace(/```$/, '').trim();
    
    return cleaned;
  };

  const renderDiagram = async () => {
    if (chartRef.current && mermaidCode) {
      try {
        console.log('Rendering Mermaid code:', mermaidCode);

        const id = `mermaid-diagram-${Date.now()}`;

        const { svg } = await mermaid.render(id, mermaidCode);
        chartRef.current.innerHTML = svg;
        setError(null);
        setRetryCount(0);
      } catch (error) {
        console.error('Error rendering Mermaid diagram:', error);
        setError(`Error rendering diagram: ${(error as Error).message}`);
        if (retryCount < MAX_RETRIES) {
          setRetryCount(prevCount => prevCount + 1);
          onRetry?.();
        } else {
          toast.error('Failed to render diagram after multiple attempts. Please try again later.');
        }
      }
    }
  };

  const handleDownload = () => {
    if (d3Code) {
      downloadChart();
    } else if (mermaidCode) {
      downloadDiagram();
    }
  };

  const downloadChart = () => {
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

  const downloadDiagram = () => {
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
        downloadLink.download = 'diagram.png';
        downloadLink.href = pngFile;
        downloadLink.click();
      };

      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    } else {
      console.error('SVG element not found');
      toast.error('Failed to download diagram. Please try again.');
    }
  };

  return (
    <div className="chart-container relative bg-transparent rounded-lg p-4 mt-4 w-full h-full">
      <div className="absolute top-2 right-2 flex space-x-2 z-10">
        {error && retryCount < MAX_RETRIES && (
          <button
            onClick={onRetry}
            className="p-1 rounded transition-colors hover:bg-gray-200 dark:hover:bg-stone-700"
            title="Retry"
          >
            <IconRefresh className="h-5 w-5" />
          </button>
        )}
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
      {error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div ref={chartRef} className="chart-content w-full h-full" />
      )}
    </div>
  );
};

export default ChartCard;