import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { CheckIcon, LoaderIcon } from 'lucide-react';

interface AnalysisDisplayProps {
    analysis: string;
  }
  
  const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ analysis }) => {
    const [selectedText, setSelectedText] = useState('');
    const [prompt, setPrompt] = useState('');
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
    const contentRef = useRef<HTMLDivElement>(null);
    const popoverRef = useRef<HTMLDivElement>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [response, setResponse] = useState('');
    const socketRef = useRef<WebSocket | null>(null);

  
    const handleSelection = useCallback(() => {
    const selection = window.getSelection();
    if (selection && !selection.isCollapsed) {
      const newSelectedText = selection.toString().trim();
      if (newSelectedText) {
        setSelectedText(newSelectedText);
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

        let top = rect.bottom + scrollTop;
        let left = rect.left + scrollLeft;

        if (popoverRef.current) {
          const popoverRect = popoverRef.current.getBoundingClientRect();
          if (left + popoverRect.width > window.innerWidth) {
            left = window.innerWidth - popoverRect.width - 10;
          }
          if (top + popoverRect.height > window.innerHeight) {
            top = rect.top + scrollTop - popoverRect.height;
          }
        }

        setPopoverPosition({ top, left });
        setIsPopoverOpen(true);
      }
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mouseup', handleSelection);
    return () => document.removeEventListener('mouseup', handleSelection);
  }, [handleSelection]);

  const formatContentToHTML = (content: string): string => {
    const rawHtml = marked.parse(content, { async: false }) as string;
    const sanitizedHtml = DOMPurify.sanitize(rawHtml);
    const parser = new DOMParser();
    const doc = parser.parseFromString(sanitizedHtml, 'text/html');
  
    doc.querySelectorAll('h1').forEach(el => el.classList.add('text-3xl', 'font-bold', 'mt-6', 'mb-4'));
    doc.querySelectorAll('h2').forEach(el => el.classList.add('text-2xl', 'font-semibold', 'mt-5', 'mb-3'));
    doc.querySelectorAll('h3').forEach(el => el.classList.add('text-xl', 'font-medium', 'mt-4', 'mb-2'));
    doc.querySelectorAll('p').forEach(el => el.classList.add('mb-4'));
    doc.querySelectorAll('ol').forEach(el => el.classList.add('list-decimal', 'list-inside', 'my-2'));
    doc.querySelectorAll('li').forEach(el => el.classList.add('mb-1'));
  
    doc.querySelectorAll('table').forEach((table, index) => {
      const tableId = `table-${index}`;
      table.id = tableId;
      table.classList.add('border-collapse', 'my-4', 'w-full', 'rounded-lg', 'overflow-hidden');
    });
    doc.querySelectorAll('th, td').forEach(el => {
      el.classList.add('px-4', 'py-2', 'border', 'border-gray-300', 'dark:border-stone-100');
    });
    doc.querySelectorAll('th').forEach(el => {
      el.classList.add('font-semibold', 'bg-gray-100', 'dark:bg-zinc-800');
    });
    doc.querySelectorAll('a').forEach(el => {
      el.classList.add('text-blue-600', 'hover:text-blue-800', 'underline');
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener noreferrer');
    });
  
    const style = doc.createElement('style');
    style.textContent = `
      table {
        border: 2px solid #e2e8f0;
        border-radius: 0.5rem;
        border-spacing: 0;
        width: 100%;
        margin-top: 1rem;
        margin-bottom: 1rem;
        overflow: hidden;
      }
      th, td {
        border: 1px solid #e2e8f0;
        padding: 0.5rem 1rem;
      }
      th {
        background-color: #f7fafc;
        font-weight: 600;
      }
      tr:nth-child(even) {
        background-color: #f8fafc;
      }
      a {
        color: #2563eb;
        text-decoration: underline;
      }
      a:hover {
        color: #1d4ed8;
      }
      @media (prefers-color-scheme: dark) {
        table {
          border-color: #3f3f46;
        }
        th, td {
          border-color: #3f3f46;
        }
        th {
          background-color: #27272a;
        }
        tr:nth-child(even) {
          background-color: #18181b;
        }
        tr:nth-child(odd) {
          background-color: #27272a;
        }
        a {
          color: #60a5fa;
        }
        a:hover {
          color: #93c5fd;
        }
      }
    `;
    doc.head.appendChild(style);
  
    return doc.body.innerHTML;
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
  };

  const handleSubmit = async () => {
    setIsAnalyzing(true);
    setIsComplete(false);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              content: `User provided context: ${selectedText}\n\nUser question: ${prompt}`,
              role: 'user',
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch');
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let accumulatedResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const events = chunk.split('\n\n').filter(Boolean);
        for (const event of events) {
          try {
            const data = JSON.parse(event);
            if (data.type === 'report') {
              accumulatedResponse += data.output;
              setResponse(accumulatedResponse);
            } else if (data.type === 'complete') {
              if (socketRef.current) {
                socketRef.current.close();
                socketRef.current = null;
              }
              setIsComplete(true);
              setTimeout(() => {
                setIsPopoverOpen(false);
              }, 2000);
              break;
            }
          } catch (error) {
            console.error('Error parsing JSON:', error);
          }
        }
      }
    } catch (error) {
      console.error('Error submitting prompt:', error);
      setResponse('An error occurred while processing your request.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePopoverOpenChange = (open: boolean) => {
    setIsPopoverOpen(open);
    if (!open) {
      setSelectedText('');
      setPrompt('');
      setIsComplete(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="mb-4 bg-transparent border-transparent">
        <CardContent className="pt-6">
          <div
            ref={contentRef}
            dangerouslySetInnerHTML={{ __html: formatContentToHTML(analysis) }}
            className="prose dark:prose-invert max-w-none"
          />
        </CardContent>
      </Card>
      <Popover open={isPopoverOpen} onOpenChange={handlePopoverOpenChange}>
        <PopoverTrigger asChild>
          <div style={{ position: 'absolute', top: popoverPosition.top, left: popoverPosition.left }}>
            <Button className="hidden">Open Popover</Button>
          </div>
        </PopoverTrigger>
        <PopoverContent ref={popoverRef} className="w-80">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Selected Text</h4>
              <Textarea
                placeholder="No text selected"
                value={selectedText}
                readOnly
                className="h-24 max-h-48 overflow-y-auto"
              />
            </div>
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Prompt</h4>
              <Input
                id="prompt"
                placeholder="Enter your prompt"
                value={prompt}
                onChange={handlePromptChange}
              />
            </div>
            <Button 
              onClick={handleSubmit} 
              disabled={isAnalyzing || isComplete}
              className={isComplete ? "bg-green-500 hover:bg-green-600" : ""}
            >
              {isAnalyzing ? (
                <span className="flex items-center">
                  Analyzing...
                  <LoaderIcon className="ml-2 h-4 w-4 animate-spin" />
                </span>
              ) : isComplete ? (
                <span className="flex items-center">
                  Analysis Complete
                  <CheckIcon className="ml-2 h-4 w-4" />
                </span>
              ) : (
                'Submit'
              )}
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      {response && (
        <Card className="mt-4 bg-transparent">
          <CardContent>
            <div 
              dangerouslySetInnerHTML={{ __html: formatContentToHTML(response) }}
              className="prose dark:prose-invert max-w-none"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AnalysisDisplay;