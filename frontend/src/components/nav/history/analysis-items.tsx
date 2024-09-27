'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { useCollapsedState } from '@/hooks/use-vector-blob'
import { cn } from '@/lib/utils'
import { AnalysisItem } from './analysis-item'
import { AnalysisActions } from './analysis-actions'
import { removeAnalysis, shareAnalysis, DocumentAnalysis } from '@/app/_data/document-analysis'

interface AnalysisItemsProps {
  analyses: DocumentAnalysis[]
}

export function AnalysisItems({ analyses }: AnalysisItemsProps) {
  if (!analyses.length) return null
  const { isGlobalCollapsed } = useCollapsedState()
  return (
    <ScrollArea className={cn(isGlobalCollapsed ? 'h-[280px]' : 'md:h-96 lg:h-[480px]')}>
      <div className="h-full">
        <AnimatePresence>
          {analyses.map(
            (analysis, index) => (
              <motion.div
                key={analysis.id}
                exit={{
                  opacity: 0,
                  height: 0,
                }}
              >
                <AnalysisItem index={index} analysis={analysis}>
                  <AnalysisActions
                    analysis={analysis}
                    removeAnalysis={removeAnalysis}
                    shareAnalysis={() => shareAnalysis(analysis)}
                  />
                </AnalysisItem>
              </motion.div>
            ),
          )}
        </AnimatePresence>
      </div>
      <ScrollBar className="bg-background w-[1px]" />
    </ScrollArea>
  )
}