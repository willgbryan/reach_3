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
  }, [d3Code, mermaidCode, retryCount]);

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
                .attr('width', 600) // Set explicit width
                .attr('height', 400) // Set explicit height
                .attr('preserveAspectRatio', 'xMidYMid meet')
                .attr('viewBox', '0 0 600 400');
            }
            // Execute the provided D3 code
            ${cleanedCode}
            console.log('D3 code executed successfully');

            // Update the SVG dimensions based on content
            const chartBBox = svg.node().getBBox();
            svg.attr('viewBox', \`\${chartBBox.x} \${chartBBox.y} \${chartBBox.width} \${chartBBox.height}\`);
            svg.attr('width', chartBBox.width);
            svg.attr('height', chartBBox.height);
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

  const renderDiagram = async () => {
    if (chartRef.current && mermaidCode) {
      try {
        console.log('Rendering Mermaid code:', mermaidCode);

        const id = `mermaid-diagram-${Date.now()}`;

        const { svg } = await mermaid.render(id, mermaidCode);
        chartRef.current.innerHTML = svg;

        // Adjust SVG dimensions
        const svgElement = chartRef.current.querySelector('svg');
        if (svgElement) {
          const bbox = svgElement.getBBox();
          svgElement.setAttribute('width', bbox.width.toString());
          svgElement.setAttribute('height', bbox.height.toString());
          svgElement.setAttribute('viewBox', `0 0 ${bbox.width} ${bbox.height}`);
        }

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
    const svg = chartRef.current?.querySelector('svg');
    if (svg) {
      const svgClone = svg.cloneNode(true) as SVGSVGElement;

      let width, height;

      if (svgClone.hasAttribute('width') && svgClone.hasAttribute('height')) {
        width = parseFloat(svgClone.getAttribute('width')!);
        height = parseFloat(svgClone.getAttribute('height')!);
      } else if (svgClone.hasAttribute('viewBox')) {
        const viewBox = svgClone.getAttribute('viewBox')!.split(' ');
        width = parseFloat(viewBox[2]);
        height = parseFloat(viewBox[3]);
        svgClone.setAttribute('width', width.toString());
        svgClone.setAttribute('height', height.toString());
      } else {
        toast.error('SVG does not have width/height or viewBox attributes.');
        return;
      }

      const svgData = new XMLSerializer().serializeToString(svgClone);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);

      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(svgUrl);

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const scaleFactor = 2; // Increase for higher resolution

        canvas.width = width * scaleFactor;
        canvas.height = height * scaleFactor;

        if (ctx) {
          ctx.scale(scaleFactor, scaleFactor);
          ctx.drawImage(img, 0, 0);

          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = 'chart.png';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
            } else {
              toast.error('Failed to generate PNG. Please try again.');
            }
          }, 'image/png');
        } else {
          toast.error('Failed to process SVG for PNG conversion.');
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(svgUrl);
        toast.error('Failed to load SVG for PNG conversion.');
      };

      img.crossOrigin = 'anonymous';
      img.src = svgUrl;
    } else {
      console.error('SVG element not found');
      toast.error('Failed to download chart. Please try again.');
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
        <div ref={chartRef} className="chart-content w-full h-full" style={{ overflow: 'auto' }} />
      )}
    </div>
  );
};

export default ChartCard;