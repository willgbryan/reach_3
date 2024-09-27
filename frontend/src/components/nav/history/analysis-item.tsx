'use client'
import { AnimatePresence, motion } from 'framer-motion'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { useCollapsedState } from '@/hooks/use-vector-blob'
import { cn } from '@/lib/utils'
import { AnalysisActions } from './analysis-actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileTextIcon } from 'lucide-react'
import { useLocalStorage } from '@/hooks/use-local-storage'

interface DocumentAnalysis {
    id: string;
    path: string;
    title: string;
    messages: any[];
    createdAt: string;
    filePaths: string[];
}

interface AnalysisItemProps {
    index: number
    analysis: DocumentAnalysis
    children: React.ReactNode
    onSelect: () => void
  }
  
  export function AnalysisItem({ index, analysis, children, onSelect }: AnalysisItemProps) {
    const [newAnalysisId, setNewAnalysisId] = useLocalStorage('newAnalysisId', null)
    const shouldAnimate = index === 0 && newAnalysisId === analysis.id
  
    if (!analysis?.id) return null
  
    const previewContent = analysis.messages[analysis.messages.length - 1].content
    const truncatedContent = previewContent.slice(0, 150) + (previewContent.length > 150 ? '...' : '')
  
    return (
      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileTextIcon className="h-5 w-5" />
            <span className="truncate">{analysis.title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">{truncatedContent}</p>
          <div className="flex justify-between items-center">
            <Button variant="outline" size="sm" onClick={onSelect}>
              Load Analysis
            </Button>
            <div className="flex space-x-2">
              {children}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  function AnalysisTypeIcon({ isActive, isGlobalCollapsed = false }) {
    return (
      <FileTextIcon
        className={cn(
          'h-5 w-5 text-muted-foreground',
          isGlobalCollapsed ? 'ml-2' : '',
          isActive && 'text-foreground',
        )}
      />
    )
  }