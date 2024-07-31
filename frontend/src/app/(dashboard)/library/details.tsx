import * as React from 'react'
import { useRouter } from 'next/navigation'
import { File, LinkIcon, Loader, Tag, Trash, Trash2 } from 'lucide-react'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import { toast } from 'sonner'

import { removeDocument } from '@/app/_data/document_sections'
import { CodeBlock } from '@/components/codeblock'
import { Heading } from '@/components/cult/gradient-heading'
import { Button } from '@/components/ui/button'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { MemoizedReactMarkdown } from '@/components/ui/markdown'
import { ScrollArea } from '@/components/ui/scroll-area'

interface HistoryActionsProps {
  title: string
  content: string
  description: string
  open: boolean
  setOpen: (arg: boolean) => void
  id: string
}

export function ItemDetail({
  id,
  open,
  title,
  description,
  setOpen,
  content,
}: HistoryActionsProps) {
  const router = useRouter()
  const [isRemovePending, startRemoveTransition] = React.useTransition()
  return (
    <div key={id}>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="flex flex-col fixed bottom-0 left-0 right-0 max-h-[96%] md:max-h-[99%] rounded-t-xl">
          <div className="max-w-3xl w-full mx-auto flex flex-col h-[calc(100vh-50px)] md:h-[calc(100vh-100px)]  p-1 ">
            <DrawerHeader>
              <div className="flex-1 text-start">
                <DrawerTitle className="text-2xl md:text-7xl font-bold tracking-tighter flex items-center gap-1  ">
                  <Tag className="h-6 w-6 md:h-9 md:w-9 fill-brand-400/70 dark:fill-brand-400/90 dark:stroke-black md:mt-9 rotate-90" />
                  {title}
                </DrawerTitle>
                <div className="text-[0.70rem] uppercase text-muted-foreground ml-8">
                  Document Category
                </div>
              </div>
              <Button
                className=" max-w-[200px] text-sm h-8 pl-3 pr-3 rounded-md gap-1 font-semibold bg-red-400 border-red-1 text-red-11 hover:bg-red-500 focus-visible:ring-2 focus-visible:ring-red-7 focus-visible:outline-none focus-visible:bg-red-6 disabled:hover:bg-red-4 inline-flex items-center border justify-center select-none disabled:cursor-not-allowed disabled:opacity-70 transition ease-in-out duration-200 cursor-pointer"
                variant="ghost"
                disabled={isRemovePending}
                onClick={(event) => {
                  event.preventDefault()
                  // @ts-ignore
                  startRemoveTransition(async () => {
                    const result = await removeDocument({ id, path: '/library' })

                    if (result && 'error' in result) {
                      toast.error(result.error)
                      return
                    }

                    setOpen(false)
                    router.refresh()
                    router.push('/library')
                    toast.success('document deleted')
                  })
                }}
              >
                {isRemovePending && <Loader className="mr-2 animate-spin" />}
                <span className="text-[#53060A]">Delete document</span>
                <Trash2 className=" text-[#53060A] group-hover:stroke-red-500 h-4 w-4" />
              </Button>
            </DrawerHeader>
            {/* VECTOR CHUNK */}
            <div className="px-2 ">
              <div className="flex gap-2 items-center">
                <LinkIcon className="h-6 w-6  stroke-stone-400 dark:stroke-stone-400" />
                <Heading size="xs">Source</Heading>
              </div>
              <ScrollArea className="h-36 md:h-56 py-2  rounded-md   ">
                <MemoizedReactMarkdown
                  className="prose break-words dark:prose-invert md:h-full prose-p:leading-relaxed prose-pre:p-0  w-[calc(100vw-30px)] p-2 text-sm my-2"
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
                  }}
                >
                  {description}
                </MemoizedReactMarkdown>
              </ScrollArea>
            </div>
            {/* FULL FILE REFERENCE */}
            <div className="px-2 ">
              <div className="flex gap-2 items-center">
                <File className="h-6 w-6  stroke-stone-400 dark:stroke-stone-400" />
                <Heading size="xs">Full file</Heading>
              </div>
              <ScrollArea className=" h-[calc(100vh-500px)]  md:h-96 py-2  rounded-md   ">
                <MemoizedReactMarkdown
                  className="prose break-words dark:prose-invert md:h-full prose-p:leading-relaxed prose-pre:p-0  w-[calc(100vw-30px)] md:w-full p p-2 text-sm my-2"
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
                  }}
                >
                  {content}
                </MemoizedReactMarkdown>
              </ScrollArea>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
