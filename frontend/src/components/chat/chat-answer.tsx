import React from 'react'
import { AnimatePresence, motion, Variants } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'

import { ResizablePanel } from '@/components/animations/resizable-div'
import { CodeBlock } from '@/components/codeblock'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { MemoizedReactMarkdown } from '@/components/ui/markdown'

// Animation properties
const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 2.5 } },
  exit: { opacity: 0, transition: { duration: 0.02 } },
}

type AnswerCardProps = {
  answer: string
  question: string
  isCurrentAnswer: boolean
  sources: any
}

export interface ChatMessageProps {
  message: any
}

export function AnswerCard({ answer, question, isCurrentAnswer, sources }: AnswerCardProps) {
  return (
    <div className="max-w-full py-10">
      <ResizablePanel content={answer}>
        <div className="pb-8">
          <AnswerMessage isCurrentAnswer={isCurrentAnswer} content={answer} submittedQ={question}>
            <AnimatePresence>
              {/* <div className="w-full">
                <Sources sources={sources ?? []} />
              </div> */}
            </AnimatePresence>
          </AnswerMessage>
        </div>
      </ResizablePanel>
    </div>
  )
}

type AnswerMessageProps = {
  submittedQ: string
  isCurrentAnswer: boolean
  children: any
  content: string
}

export function AnswerMessage({ submittedQ, content, children }: AnswerMessageProps) {
  return (
    <>
      <Card className="max-w-sm p-2 sm:p-4 lg:min-w-[768px] bg-brand border-none">
        <CardHeader className="relative pb-2 pr-6  lg:pb-0">
          <CardTitle className="pt-2 font-bold text-vanta-800/90 dark:text-white/90 md:max-w-lg mx-auto">
            <AnimatedQuestion submittedQ={submittedQ} />
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col justify-end p-2 pl-6 md:px-4 md:pl-6 text-md">
          <MemoizedReactMarkdown
            className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
            remarkPlugins={[remarkGfm, remarkMath]}
            components={{
              p({ children }) {
                return <p className="mb-2 last:mb-0">{children}</p>
              },
              code({ node, inline, className, children, ...props }) {
                if (children.length) {
                  if (children[0] == '▍') {
                    return <span className="mt-1 animate-pulse cursor-default">▍</span>
                  }

                  children[0] = (children[0] as string).replace('`▍`', '▍')
                }

                const match = /language-(\w+)/.exec(className || '')

                if (inline) {
                  return (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  )
                }

                return (
                  <CodeBlock
                    key={Math.random()}
                    language={(match && match[1]) || ''}
                    value={String(children).replace(/\n$/, '')}
                    {...props}
                  />
                )
              },
              sup({ children }) {
                const childrenArray = React.Children.toArray(children)
                if (childrenArray.length === 1 && React.isValidElement(childrenArray[0]) && childrenArray[0].type === 'a') {
                  return <sup><a className="text-blue-500 hover:text-blue-700">{children}</a></sup>
                }
                return <sup>{children}</sup>
              },
              a({ node, children, ...props }) {
                const className = node.properties?.className
                const isFootnoteRef = Array.isArray(className) 
                  ? className.includes('footnote-ref')
                  : typeof className === 'string' && className.includes('footnote-ref');

                if (isFootnoteRef) {
                  return (
                    <sup id={`ref-${props.href?.slice(1)}`}>
                      <a href={props.href} className="text-blue-500 hover:text-blue-700">{children}</a>
                    </sup>
                  )
                }
                return <a {...props} className="text-blue-500 hover:text-blue-700">{children}</a>
              },
            }}
          >
            {content}
          </MemoizedReactMarkdown>
        </CardContent>

        <CardFooter className="p-0">
          {/* <div className="">{children}</div> */}
        </CardFooter>
      </Card>
    </>
  )
}

type AnimatedQuestionProps = {
  submittedQ: string
}

function AnimatedQuestion({ submittedQ }: AnimatedQuestionProps) {
  return (
    <AnimatePresence>
      {submittedQ && (
        <motion.span
          key={submittedQ}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={fadeIn}
          className="mx-auto text-2xl font-bold tracking-tighter"
        >
          {submittedQ}
        </motion.span>
      )}
    </AnimatePresence>
  )
}