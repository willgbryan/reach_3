"use client"

import React, {
  createContext,
  MutableRefObject,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react"
import { AnimatePresence, MotionConfig, motion } from "framer-motion"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const TRANSITION = {
  type: "spring",
  bounce: 0.05,
  duration: 0.3,
}

function useClickOutside(
  ref: React.RefObject<HTMLElement>,
  handler: () => void
) {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [ref, handler])
}

interface PopoverContextType {
    isOpen: boolean
    openPopover: () => void
    closePopover: () => void
    uniqueId: string
    note: string
    setNote: (note: string) => void
    triggerRef: MutableRefObject<HTMLButtonElement | null>
    contentRef: MutableRefObject<HTMLDivElement | null>
    popoverPosition: { top: boolean; left: number }
    updatePosition: () => void
  }
  
  const PopoverContext = createContext<PopoverContextType | undefined>(undefined)
  
  function usePopover() {
    const context = useContext(PopoverContext)
    if (!context) {
      throw new Error("usePopover must be used within a PopoverProvider")
    }
    return context
  }
  
  function usePopoverLogic() {
    const uniqueId = useId()
    const [isOpen, setIsOpen] = useState(false)
    const [note, setNote] = useState("")
    const triggerRef = useRef<HTMLButtonElement | null>(null)
    const contentRef = useRef<HTMLDivElement | null>(null)
    const [popoverPosition, setPopoverPosition] = useState({ top: false, left: 0 })
  
    const openPopover = () => setIsOpen(true)
    const closePopover = () => {
      setIsOpen(false)
      setNote("")
    }
  
    const updatePosition = () => {
      if (triggerRef.current && contentRef.current) {
        const triggerRect = triggerRef.current.getBoundingClientRect()
        const contentRect = contentRef.current.getBoundingClientRect()
        const windowHeight = window.innerHeight
  
        const spaceAbove = triggerRect.top
        const spaceBelow = windowHeight - triggerRect.bottom
  
        setPopoverPosition({
          top: spaceBelow < contentRect.height && spaceAbove > spaceBelow,
          left: triggerRect.left,
        })
      }
    }
  
    useEffect(() => {
      window.addEventListener('resize', updatePosition)
      updatePosition()
      return () => window.removeEventListener('resize', updatePosition)
    }, [])
  
    return { 
      isOpen, 
      openPopover, 
      closePopover, 
      uniqueId, 
      note, 
      setNote, 
      triggerRef, 
      contentRef, 
      popoverPosition,
      updatePosition
    }
  }
  
  interface PopoverRootProps {
    children: React.ReactNode
    className?: string
  }
  
  export function PopoverRoot({ children, className }: PopoverRootProps) {
    const popoverLogic = usePopoverLogic()
  
    return (
      <PopoverContext.Provider value={popoverLogic}>
        <MotionConfig transition={TRANSITION}>
          <div
            className={cn(
              "relative flex items-center justify-center isolate",
              className
            )}
          >
            {children}
          </div>
        </MotionConfig>
      </PopoverContext.Provider>
    )
  }
  
  interface PopoverTriggerProps {
    children: React.ReactNode
    className?: string
    asChild?: boolean
  }
  
  export const PopoverTrigger = React.forwardRef<HTMLButtonElement, PopoverTriggerProps>(
    ({ children, className, asChild = false }, forwardedRef) => {
      const { openPopover, uniqueId, triggerRef, isOpen } = usePopover()
  
      const TriggerComponent = asChild ? React.Fragment : motion.button
  
      const handleRef = useCallback(
        (node: HTMLButtonElement | null) => {
          triggerRef.current = node
          if (typeof forwardedRef === 'function') {
            forwardedRef(node)
          } else if (forwardedRef) {
            forwardedRef.current = node
          }
        },
        [forwardedRef, triggerRef]
      )
  
      const triggerProps = asChild ? {} : {
        key: "button",
        onClick: openPopover,
        className: cn(
          "flex items-center justify-center px-3 py-2 bg-stone-900 dark:bg-stone-100 text-sm font-medium text-stone-100 hover:text-stone-900 dark:hover:text-stone-100 dark:text-stone-900 transition-colors rounded-full",
          isOpen ? "bg-stone-300 dark:bg-stone-600" : "hover:bg-stone-300 dark:hover:bg-stone-600",
          className
        ),
        ref: handleRef,
      }
  
      return (
        <TriggerComponent {...triggerProps}>
          <motion.span
            layoutId={`popover-${uniqueId}`}
            className="flex items-center w-full h-full rounded-full"
          >
            <motion.span layoutId={`popover-label-${uniqueId}`} className="flex items-center">
              {children}
            </motion.span>
          </motion.span>
        </TriggerComponent>
      )
    }
  )
  
  PopoverTrigger.displayName = 'PopoverTrigger'
  
  interface PopoverContentProps {
    children: React.ReactNode
    className?: string
  }
  
  export const PopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(
    ({ children, className }, forwardedRef) => {
      const { isOpen, closePopover, uniqueId, contentRef, popoverPosition, triggerRef } = usePopover()
  
      useClickOutside(contentRef, closePopover)
  
      const handleRef = useCallback(
        (node: HTMLDivElement | null) => {
          contentRef.current = node
  
          if (typeof forwardedRef === 'function') {
            forwardedRef(node)
          } else if (forwardedRef) {
            forwardedRef.current = node
          }
  
          if (node && triggerRef.current) {
            const triggerRect = triggerRef.current.getBoundingClientRect()
            node.style.minWidth = `${triggerRect.width}px`
          }
        },
        [forwardedRef, contentRef, triggerRef]
      )
  
      useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
          if (event.key === "Escape") {
            closePopover()
          }
        }
  
        document.addEventListener("keydown", handleKeyDown)
        return () => {
          document.removeEventListener("keydown", handleKeyDown)
        }
      }, [closePopover])
  
      return (
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={handleRef}
              layoutId={`popover-${uniqueId}`}
              className={cn(
                "absolute overflow-hidden border border-black bg-black text-stone-100 shadow-lg outline-none dark:border-stone-700 dark:bg-stone-800 z-50",
                className
              )}
              style={{
                borderRadius: 8,
                position: 'absolute',
                top: popoverPosition.top ? 'auto' : '100%',
                bottom: popoverPosition.top ? '100%' : 'auto',
                left: 0,
                transform: 'translateY(4px)',
                minWidth: '200px',
              }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="py-1">
                {React.Children.map(children, (child) => {
                  if (React.isValidElement(child)) {
                    // Type guard to ensure child is a valid React element
                    return React.cloneElement(child, {
                      className: cn(
                        "block w-full text-left px-4 py-2 text-sm text-stone-100 hover:bg-stone-900 hover:text-stone-100 dark:text-stone-200 dark:hover:bg-stone-700 dark:hover:text-white",
                        child.props.className
                      ),
                    } as React.HTMLAttributes<HTMLElement>)
                  }
                  return child
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )
    }
  )
  
  PopoverContent.displayName = 'PopoverContent'

interface PopoverFormProps {
  children: React.ReactNode
  onSubmit?: (note: string) => void
  className?: string
}

export function PopoverForm({
  children,
  onSubmit,
  className,
}: PopoverFormProps) {
  const { note, closePopover } = usePopover()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(note)
    closePopover()
  }

  return (
    <form
      className={cn("flex h-full flex-col", className)}
      onSubmit={handleSubmit}
    >
      {children}
    </form>
  )
}

interface PopoverLabelProps {
  children: React.ReactNode
  className?: string
}

export function PopoverLabel({ children, className }: PopoverLabelProps) {
  const { uniqueId, note } = usePopover()

  return (
    <motion.span
      layoutId={`popover-label-${uniqueId}`}
      aria-hidden="true"
      style={{
        opacity: note ? 0 : 1,
      }}
      className={cn(
        "absolute left-4 top-3 select-none text-sm text-zinc-500 dark:text-zinc-400",
        className
      )}
    >
      {children}
    </motion.span>
  )
}

interface PopoverTextareaProps {
  className?: string
}

export function PopoverTextarea({ className }: PopoverTextareaProps) {
  const { note, setNote } = usePopover()

  return (
    <textarea
      className={cn(
        "h-full w-full resize-none rounded-md bg-transparent px-4 py-3 text-sm outline-none",
        className
      )}
      autoFocus
      value={note}
      onChange={(e) => setNote(e.target.value)}
    />
  )
}

interface PopoverFooterProps {
  children: React.ReactNode
  className?: string
}

export function PopoverFooter({ children, className }: PopoverFooterProps) {
  return (
    <div
      key="close"
      className={cn("flex justify-between px-4 py-3", className)}
    >
      {children}
    </div>
  )
}

interface PopoverCloseButtonProps {
  className?: string
}

export function PopoverCloseButton({ className }: PopoverCloseButtonProps) {
  const { closePopover } = usePopover()

  return (
    <button
      type="button"
      className={cn("flex items-center", className)}
      onClick={closePopover}
      aria-label="Close popover"
    >
      <X size={16} className="text-zinc-900 dark:text-zinc-100" />
    </button>
  )
}

interface PopoverSubmitButtonProps {
  className?: string
}

export function PopoverSubmitButton({ className }: PopoverSubmitButtonProps) {
  return (
    <button
      className={cn(
        "relative ml-1 flex h-8 shrink-0 scale-100 select-none appearance-none items-center justify-center rounded-lg border border-zinc-950/10 bg-transparent px-2 text-sm text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 focus-visible:ring-2 active:scale-[0.98] dark:border-zinc-50/10 dark:text-zinc-50 dark:hover:bg-zinc-800",
        className
      )}
      type="submit"
      aria-label="Submit note"
    >
      Submit
    </button>
  )
}

export function PopoverHeader({
    children,
    className,
  }: {
    children: React.ReactNode
    className?: string
  }) {
    return (
      <div
        className={cn(
          "px-4 py-2 font-semibold text-zinc-900 dark:text-zinc-100",
          className
        )}
      >
        {children}
      </div>
    )
  }
  
  export function PopoverBody({
    children,
    className,
  }: {
    children: React.ReactNode
    className?: string
  }) {
    return <div className={cn("p-4", className)}>{children}</div>
  }
  
  export const PopoverButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50",
      className
    )}
    {...props}
  />
))

PopoverButton.displayName = 'PopoverButton'