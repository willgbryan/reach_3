'use client'
import { AnimatePresence, motion } from 'framer-motion'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { useCollapsedState } from '@/hooks/use-vector-blob'
import { cn } from '@/lib/utils'
import { AnalysisItem } from './analysis-item'
import { AnalysisActions } from './analysis-actions'
import { removeAnalysis, shareAnalysis, DocumentAnalysis } from '@/app/_data/document-analysis'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileTextIcon } from 'lucide-react'

interface AnalysisItemsProps {
  analyses: DocumentAnalysis[]
  onAnalysisSelect: (analysis: DocumentAnalysis) => void
}

export function AnalysisItems({ analyses, onAnalysisSelect }: AnalysisItemsProps) {
    if (!analyses.length) return null;
    const { isGlobalCollapsed } = useCollapsedState();
  
    return (
      <ScrollArea className={cn(isGlobalCollapsed ? 'h-[280px]' : 'md:h-96 lg:h-[480px]')}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          <AnimatePresence>
            {analyses.map((analysis, index) => (
              <motion.div
                key={analysis.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <AnalysisItem
                  index={index}
                  analysis={analysis}
                  onSelect={() => onAnalysisSelect(analysis)}
                >
                  <AnalysisActions
                    analysis={analysis}
                    removeAnalysis={removeAnalysis}
                    shareAnalysis={() => shareAnalysis(analysis)}
                  />
                </AnalysisItem>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <ScrollBar className="bg-background w-[1px]" />
      </ScrollArea>
    );
  }