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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { LoaderIcon, FileText, Presentation, Pencil } from 'lucide-react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { MultiJurisdictionSelector } from './jurisdictions-combobox';
import { debounce } from 'lodash';
import './component.css'

interface AnalysisSection {
  id: string;
  title: string;
  content: string;
}

interface AnalysisDisplayProps {
  analysis: string;
  analysisId: string | null;
  isStreaming?: boolean;
  sections: AnalysisSection[];
  onUpdateSections: React.Dispatch<React.SetStateAction<AnalysisSection[]>>;
  isInitialAnalysis: boolean;
  onCreateDoc: (content: string) => void;
  onCreatePowerPoint?: (content: string) => void;
  isContractReview?: boolean;
}

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ 
  analysis, 
  analysisId, 
  isStreaming = false, 
  sections, 
  onUpdateSections,
  isInitialAnalysis,
  onCreateDoc,
  onCreatePowerPoint,
  isContractReview = false
}) => {
  const [selectedText, setSelectedText] = useState('');
  const [prompt, setPrompt] = useState('');
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
  const contentRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [openAccordion, setOpenAccordion] = useState<string | undefined>('initial-analysis');
  const [jurisdictions, setJurisdictions] = useState<string[]>([]);
  const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});
  const [editContent, setEditContent] = useState<{ [key: string]: string }>({});
  const [selectedReviewText, setSelectedReviewText] = useState('');
  const [reviewPopoverPosition, setReviewPopoverPosition] = useState({ top: 0, left: 0 });
  const [isReviewPopoverOpen, setIsReviewPopoverOpen] = useState(false);
  const reviewPopoverRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentSuggestion, setCurrentSuggestion] = useState<{
    sectionId: string;
    oldText: string;
    newText: string;
  } | null>(null);  

  const debouncedUpdate = useCallback(
    debounce((sectionId: string, content: string) => {
      onUpdateSections((prevSections: AnalysisSection[]) => 
        prevSections.map(section => 
          section.id === sectionId
            ? { ...section, content }
            : section
        )
      );
    }, 100),
    []
  );

  const handleJurisdictionSelect = (selectedJurisdictions: string[]) => {
    setJurisdictions(selectedJurisdictions);
  };

  const handleTextareaSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>, sectionId: string) => {
    if (!isContractReview || !editMode[sectionId]) return;
  
    const textarea = e.target as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end).trim();
    
    if (!selectedText) return;
  
    const textareaRect = textarea.getBoundingClientRect();
    
    const textBeforeSelection = textarea.value.substring(0, start);
    const lines = textBeforeSelection.split('\n');
    const lineHeight = parseInt(window.getComputedStyle(textarea).lineHeight) || 20;
    
    const currentLineNumber = lines.length;
    const relativeTop = currentLineNumber * lineHeight;
  
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    const top = textareaRect.top + scrollTop + relativeTop;
    const left = textareaRect.left + 300;
  
    setSelectedReviewText(selectedText);
    setPrompt('');
    setReviewPopoverPosition({ top, left });
    setIsReviewPopoverOpen(true);
  
    console.log('Textarea select event:', {
      selectedText,
      position: { top, left },
      textareaRect,
      relativeTop,
      currentLineNumber
    });
  };

  const handleSelection = useCallback(() => {
    if (isContractReview) return;
  
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;
    
    const newSelectedText = selection.toString().trim();
    if (!newSelectedText) return;
  
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
  
    setSelectedText(newSelectedText);
    setPopoverPosition({ top, left });
    setIsPopoverOpen(true);
  }, [isContractReview]);

  const toggleEditMode = (sectionId: string) => {
    setEditMode(prev => {
      const newMode = { ...prev, [sectionId]: !prev[sectionId] };
      if (newMode[sectionId]) {
        const section = sections.find(s => s.id === sectionId);
        if (section) {
          setEditContent(prev => ({ ...prev, [sectionId]: section.content }));
        }
      }
      return newMode;
    });
  };

  const handleEditChange = (sectionId: string, newContent: string) => {
    setEditContent(prev => ({ ...prev, [sectionId]: newContent }));
  };

  const saveEdit = (sectionId: string) => {
    const newContent = editContent[sectionId];
    if (newContent !== undefined) {
      onUpdateSections(prevSections => 
        prevSections.map(section => 
          section.id === sectionId
            ? { ...section, content: newContent }
            : section
        )
      );
      setEditMode(prev => ({ ...prev, [sectionId]: false }));
    }
  };

  useEffect(() => {
    if (isInitialAnalysis && sections.length === 0) {
      onUpdateSections([{ id: 'initial-analysis', title: 'Initial Analysis', content: '' }]);
    }
  }, [isInitialAnalysis, sections, onUpdateSections]);

  useEffect(() => {
    document.addEventListener('mouseup', handleSelection);
    return () => document.removeEventListener('mouseup', handleSelection);
  }, [handleSelection]);

  const formatContentToHTML = (content: string): string => {
    if (!content || typeof content !== 'string') {
      return '';
    }
  
    try {
      const cleanContent = content
        .replace(/```/g, '')
        .trim();
  
      const highlightExtension = {
        name: 'highlight',
        level: 'inline',
        start(src) { return src.match(/==/)?.index; },
        tokenizer(src, tokens) {
          const rule = /^==([\s\S]+?)==/;
          const match = rule.exec(src);
          if (match) {
            return {
              type: 'highlight',
              raw: match[0],
              text: match[1],
              tokens: this.lexer.inlineTokens(match[1]),
            };
          }
        },
        renderer(token) {
          return `<mark>${this.parser.parseInline(token.tokens)}</mark>`;
        },
      };
  
      marked.use({ 
        extensions: [highlightExtension],
        breaks: true,
        gfm: true,
      });
  
      let rawHtml;
      try {
        rawHtml = marked.parse(cleanContent, { async: false }) as string;
      } catch (error) {
        console.error('Markdown parsing error:', error);
        return `<p>${cleanContent}</p>`;
      }
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
      
      const iconContainer = doc.createElement('div');
      iconContainer.className = 'absolute -top-10 right-0 flex space-x-2 mb-2';
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
        color: #2563eb; /* blue-600 */
        text-decoration: underline;
      }
      a:hover {
        color: #1d4ed8; /* blue-800 */
      }
      .table-wrapper {
        position: relative;
        margin-top: 2.5rem; /* Increased margin-top to accommodate buttons and spacing */
      }

      .table-icon-container {
        position: absolute;
        top: -2.5rem; /* Adjusted top position */
        right: 0;
        display: flex;
        gap: 0.5rem;
        z-index: 10;
        margin-bottom: 0.5rem; /* Added margin-bottom for spacing */
      }

      .table-icon {
        padding: 0.25rem;
        border-radius: 0.25rem;
        transition: background-color 0.2s;
      }

      .table-icon:hover {
        background-color: #e2e8f0;
      }

      @media (prefers-color-scheme: dark) {
        .table-icon:hover {
          background-color: #18181b;
        }
        table {
          border-color: #3f3f46; /* zinc-700 */
        }
        th, td {
          border-color: #3f3f46; /* zinc-700 */
        }
        th {
          background-color: #27272a; /* zinc-800 for header */
        }
        tr:nth-child(even) {
          background-color: #18181b; /* zinc-900 for even rows */
        }
        tr:nth-child(odd) {
          background-color: #27272a; /* zinc-800 for odd rows */
        }
        a {
          color: #60a5fa; /* blue-400 */
        }
        a:hover {
          color: #93c5fd; /* blue-300 */
        }
        mark {
          background-color: #ff0;
          color: inherit;
        }

        @media (prefers-color-scheme: dark) {
          mark {
            background-color: #555;
            color: inherit;
          }
        }
      }
    `;
    doc.head.appendChild(style);
  
    const purifyConfig = {
      ADD_ATTR: ['target', 'rel']
    };
  
    const finalHtml = DOMPurify.sanitize(doc.body.innerHTML, purifyConfig);
    return finalHtml;
  } catch (error) {
    console.error('HTML formatting error:', error);
    return `<p>${content}</p>`;
  }
};

  const handlePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
  };

  const handleReviewSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/contract-follow-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selectedText: selectedReviewText,
          prompt,
          jurisdictions,
          analysisId,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch');
      }
  
      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = '';
  
      const currentSectionId = openAccordion;
      if (!currentSectionId) return;
      const originalContent = editContent[currentSectionId] || '';
      const startIndex = originalContent.indexOf(selectedReviewText);
      if (startIndex === -1) {
        console.error('Selected text not found in current content');
        setIsSubmitting(false);
        return;
      }
      const endIndex = startIndex + selectedReviewText.length;
  
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const events = chunk.split('\n\n').filter(Boolean);
  
        for (const event of events) {
          try {
            const data = JSON.parse(event);
  
            if (data.type === 'report') {
              accumulatedContent += data.output || '';
  
              const cleanedResponse = accumulatedContent
                .replace(/```markdown\n/g, '')
                .replace(/```\n/g, '')
                .replace(/\*\*/g, '');
  
              const newContent =
                originalContent.slice(0, startIndex) +
                cleanedResponse +
                originalContent.slice(endIndex);
  
              setEditContent(prev => ({
                ...prev,
                [currentSectionId]: newContent
              }));
            } else if (data.type === 'complete') {
              setIsSubmitting(false);
              setIsReviewPopoverOpen(false);
              return;
            }
          } catch (error) {
            console.error('Error parsing JSON:', error);
          }
        }
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReviewPopoverOpenChange = (open: boolean) => {
    setIsReviewPopoverOpen(open);
    if (!open) {
      setSelectedReviewText('');
      setPrompt('');
    }
  };

  const handleSubmit = async () => {
    setIsPopoverOpen(false);
    const newSectionId = `section-${Date.now()}`;
    onUpdateSections([...sections, { id: newSectionId, title: prompt, content: '' }]);
    setOpenAccordion(newSectionId);
  
    try {
      const response = await fetch('/api/analyze-document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              content: `User provided context: ${selectedText}\n\nUser question: ${prompt}${
                jurisdictions.length > 0 ? `\n\nLegal Jurisdictions: ${jurisdictions.join(', ')}` : ''
              }`,
              role: 'user',
            },
          ],
          analysisId,
          edits: [],
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch');
      }
  
      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = '';
  
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const events = chunk.split('\n\n').filter(Boolean);
        for (const event of events) {
          try {
            const data = JSON.parse(event);
  
            if (data.type === 'report') {
              accumulatedContent += data.output || '';
              debouncedUpdate(newSectionId, accumulatedContent);
              
              onUpdateSections((prevSections: AnalysisSection[]) => 
                prevSections.map(section => 
                  section.id === newSectionId
                    ? { ...section, content: accumulatedContent }
                    : section
                )
              );
            } else if (data.type === 'complete') {
              return;
            }
          } catch (error) {
            console.error('Error parsing JSON:', error);
          }
        }
      }
    } catch (error) {
      console.error('Error submitting prompt:', error);
      onUpdateSections((prevSections: AnalysisSection[]) => 
        prevSections.map(section => 
          section.id === newSectionId
            ? { ...section, content: 'An error occurred while processing your request.' }
            : section
        )
      );
    }
  };

  const handlePopoverOpenChange = (open: boolean) => {
    setIsPopoverOpen(open);
    if (!open) {
      setSelectedText('');
      setPrompt('');
    }
  };

  const handleCreateDoc = (sectionContent: string) => {
    const formattedContent = formatContentToHTML(sectionContent);
    onCreateDoc(formattedContent);
  };  

  const handleCreatePowerPoint = (sectionContent: string) => {
    if (onCreatePowerPoint) {
      onCreatePowerPoint(sectionContent);
    }
  };

  return (
    <div className="space-y-6">
      {!isContractReview && (
        <Popover open={isPopoverOpen} onOpenChange={handlePopoverOpenChange}>
          <PopoverTrigger asChild>
            <div 
              style={{ 
                position: 'fixed',
                top: popoverPosition.top, 
                left: popoverPosition.left,
                zIndex: 50
              }}
            >
              <div className="w-1 h-1" />
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
                <h4 className="font-medium leading-none">Query</h4>
                <Input
                  id="prompt"
                  placeholder="Enter your query"
                  value={prompt}
                  onChange={handlePromptChange}
                />
              </div>
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Jurisdictions</h4>
                <MultiJurisdictionSelector 
                  onSelect={handleJurisdictionSelect} 
                  initialSelections={jurisdictions}
                />
              </div>
              <Button onClick={handleSubmit}>
                Submit
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      )}
  
      {isContractReview && (
        <Popover open={isReviewPopoverOpen} onOpenChange={handleReviewPopoverOpenChange}>
          <PopoverTrigger asChild>
            <div 
              style={{ 
                position: 'fixed',
                top: reviewPopoverPosition.top, 
                left: reviewPopoverPosition.left,
                zIndex: 50
              }}
            >
              <div className="w-1 h-1" />
            </div>
          </PopoverTrigger>
          <PopoverContent ref={reviewPopoverRef} className="w-96">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Selected Contract Text</h4>
                <Textarea
                  placeholder="No text selected"
                  value={selectedReviewText}
                  readOnly
                  className="h-24 max-h-48 overflow-y-auto"
                />
              </div>
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Request Changes</h4>
                <Input
                  id="prompt"
                  placeholder="What changes would you like to make?"
                  value={prompt}
                  onChange={handlePromptChange}
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Jurisdictions</h4>
                <MultiJurisdictionSelector 
                  onSelect={handleJurisdictionSelect} 
                  initialSelections={jurisdictions}
                  disabled={isSubmitting}
                />
              </div>
              <Button 
                onClick={handleReviewSubmit} 
                disabled={isSubmitting}
                className="relative"
              >
                {isSubmitting && (
                  <LoaderIcon className="animate-spin h-4 w-4 mr-2" />
                )}
                {isSubmitting ? 'Processing...' : 'Suggest Changes'}
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      )}  
      <Accordion 
        type="single" 
        collapsible 
        className="w-full"
        value={openAccordion}
        onValueChange={setOpenAccordion}
      >
        {sections.map((section) => (
          <AccordionItem key={section.id} value={section.id}>
            <AccordionTrigger>{section.title}</AccordionTrigger>
            <AccordionContent className="overflow-hidden">
              <Card className="pt-10 bg-transparent relative">
                {section.content && (
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <Button
                      onClick={() => handleCreateDoc(section.content)}
                      className="rounded-full flex items-center px-3 py-1 text-xs"
                      variant="outline"
                    >
                      <FileText className="h-3 w-3 mr-1" />
                      Create Word Document
                    </Button>
                    {isContractReview ? (
                      <Button
                        onClick={() => editMode[section.id] ? saveEdit(section.id) : toggleEditMode(section.id)}
                        className="rounded-full flex items-center px-3 py-1 text-xs"
                        variant="outline"
                      >
                        <Pencil className="h-3 w-3 mr-1" />
                        {editMode[section.id] ? 'Save' : 'Edit'}
                      </Button>
                    ) : (
                      onCreatePowerPoint && (
                        <Button
                          onClick={() => handleCreatePowerPoint(section.content)}
                          className="rounded-full flex items-center px-3 py-1 text-xs"
                          variant="outline"
                        >
                          <Presentation className="h-3 w-3 mr-1" />
                          Create PowerPoint
                        </Button>
                      )
                    )}
                  </div>
                )}
                <CardContent>
                {section.content ? (
                    editMode[section.id] ? (
                      <div className="space-y-4">
                        <Textarea
                          value={editContent[section.id] || ''}
                          onChange={(e) => handleEditChange(section.id, e.target.value)}
                          onSelect={(e) => handleTextareaSelect(e, section.id)}
                          className="min-h-[200px] w-full border-0 focus:border-0 focus:outline-none outline-none focus-visible:ring-0 focus-visible:ring-ring"
                        />
                        <div className="flex justify-end space-x-2">
                          <Button
                            onClick={() => toggleEditMode(section.id)}
                            variant="outline"
                            size="sm"
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={() => saveEdit(section.id)}
                            size="sm"
                          >
                            Save
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div
                        dangerouslySetInnerHTML={{ __html: formatContentToHTML(section.content) }}
                        className="prose dark:prose-invert max-w-none"
                      />
                    )
                  ) : (
                    <div className="flex items-center space-x-2">
                      <LoaderIcon className="animate-spin h-5 w-5" />
                      <span>Analyzing...</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default AnalysisDisplay;