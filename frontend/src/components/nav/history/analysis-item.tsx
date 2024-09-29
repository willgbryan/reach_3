import React from 'react'
import { motion } from 'framer-motion'
import { FileTextIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLocalStorage } from '@/hooks/use-local-storage'
import { cn } from '@/lib/utils'
import { Meteors } from '@/components/cult/meteors'

interface DocumentAnalysis {
  id: string
  path: string
  title: string
  messages: any[]
  createdAt: string
  filePaths: string[]
}

interface AnalysisItemProps {
  index: number
  analysis: DocumentAnalysis
  children: React.ReactNode
  onSelect: () => void
}

const titleVariants = {
  initial: { y: 0 },
  hover: { y: '-10%', transition: { duration: 0.3 } },
}

const buttonsVariants = {
  initial: { opacity: 0, y: '20%' },
  hover: { opacity: 1, y: '0%', transition: { duration: 0.3 } },
}

export function AnalysisItem({ index, analysis, children, onSelect }: AnalysisItemProps) {
  const [newAnalysisId] = useLocalStorage('newAnalysisId', null)
  
  if (!analysis?.id) return null

  const fileNames = analysis.filePaths.map(path => path.split('/').pop()).join(', ')
  const assistantMessage = analysis.messages.find((msg) => msg.role === 'assistant')
  const analysisContent = assistantMessage ? assistantMessage.content : ''
  const truncatedContent =
    analysisContent.slice(0, 150) + (analysisContent.length > 150 ? '...' : '')

  return (
    <motion.div
      className="h-full group relative cursor-pointer"
      onClick={onSelect}
      initial="initial"
      whileHover="hover"
      variants={{}}
    >
      <div
        className={cn(
          'rounded-lg bg-gray-100 dark:bg-zinc-800 h-full w-full overflow-hidden flex flex-col items-center justify-center relative z-10',
          'transition-all duration-300',
        )}
      >
        <div className="absolute inset-0 bg-gray-100 dark:bg-zinc-800 group-hover:opacity-0 transition-opacity duration-300" />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-blue-500 to-teal-500 transform scale-105 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-gray-900 dark:bg-zinc-800" />
        </div>
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none overflow-hidden">
          <Meteors number={20} />
        </div>
        <div className="relative z-40 p-8 h-full w-full flex flex-col items-center">
          <motion.div className="flex flex-col items-center" variants={titleVariants}>
            <FileTextIcon className="h-8 w-8 text-neutral-800 dark:text-neutral-200 group-hover:text-white transition-colors duration-300" />
            <p className="mt-2 text-neutral-800 dark:text-neutral-200 group-hover:text-white text-base md:text-lg font-medium font-sans text-center transition-colors duration-300">
              {fileNames}
            </p>
          </motion.div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 group-hover:text-white transition-colors duration-300 mb-4 text-center mt-4">
            {truncatedContent}
          </p>
          <motion.div
            className="flex space-x-2 pointer-events-auto mt-4"
            variants={buttonsVariants}
          >
            {React.Children.map(children, (child) =>
              React.cloneElement(child as React.ReactElement, {
                onClick: (e: any) => e.stopPropagation(),
              }),
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}