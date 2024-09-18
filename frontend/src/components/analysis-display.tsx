import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

interface AnalysisDisplayProps {
    analysis: string;
  }

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
      }
    `;
    doc.head.appendChild(style);
  
    return doc.body.innerHTML;
  };

  
    const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ analysis }) => {
        return (
          <div className="space-y-6">
            <Card className="mb-4 bg-transparent border-transparent">
              <CardContent className="pt-6">
                <div 
                  dangerouslySetInnerHTML={{ __html: formatContentToHTML(analysis) }} 
                  className="prose dark:prose-invert max-w-none"
                />
              </CardContent>
            </Card>
          </div>
        );
      };
      
    export default AnalysisDisplay;