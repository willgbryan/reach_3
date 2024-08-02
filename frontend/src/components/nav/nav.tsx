import Link from 'next/link'
import { LucideIcon } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

interface NavProps {
  isCollapsed: boolean
  links: {
    title: string
    label?: string
    href: string
    icon: LucideIcon
    variant: 'default' | 'ghost'
    disabled?: boolean
  }[]
}

export function Nav({ links, isCollapsed }: NavProps) {
  return (
    <div
      data-collapsed={isCollapsed}
      className="group flex flex-col gap-2 py-2 data-[collapsed=true]:py-2"
    >
      <nav className="grid gap-3 md:px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2 mt-2">
        {links.map((link, index) =>
          isCollapsed ? (
            <Tooltip key={index} delayDuration={0}>
              <TooltipTrigger
                asChild
                className={cn(
                  // 'relative w-full before:pointer-events-none before:absolute before:-inset-1 before:rounded-[9991px] before:border before:border-neutral-100/20 before:opacity-0 before:ring-2 before:ring-neutral-100/40 before:transition dark:before:border-brand-400/40 dark:before:ring-2 dark:before:ring-brand-900/40',
                  // 'button-shadow-glow after:pointer-events-none after:absolute after:inset-px after:rounded-[9987px] after:shadow-white/5 after:transition',
                  // 'focus-within:before:opacity-100 focus-within:after:shadow-brand-100/20 dark:after:shadow-white/5 dark:focus-within:after:shadow-brand-500/30',
                  link.disabled && 'opacity-50 cursor-not-allowed'
                )}
              >
                <Link
                  href={link.disabled ? '#' : link.href}
                  className={cn(
                    'w-full text-lg font-semibold',
                    'focus:outline-none focus:ring-2 focus:ring-inset focus:ring-stone-100 dark:focus:ring-brand-900 ',
                    'disabled:cursor-not-allowed disabled:opacity-50 sm:leading-6 ',
                    // 'dark:border dark:border-black/40 ',
                    // 'button-shadow rounded-[9988px] !outline-none',
                    'relative p-3 shadow-black/5 focus:bg-white ',
                    ' text-stone-800 dark:text-primary-foreground dark:shadow-black/10 ',
                    // 'dark:focus:bg-neutral-900',
                    link.disabled && 'pointer-events-none'
                  )}
                  onClick={(e) => link.disabled && e.preventDefault()}
                >
                  <link.icon className={cn("h-5 w-5 dark:stroke-neutral-500 dark:hover:stroke-neutral-300", link.disabled && "dark:stroke-neutral-600")} />
                  <span className="sr-only ">{link.title}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="flex items-center gap-4">
                {link.title}
                {link.label && <span className="ml-auto text-muted-foreground">{link.label}</span>}
              </TooltipContent>
            </Tooltip>
          ) : (
            <Link
              key={index}
              href={link.disabled ? '#' : link.href}
              className={cn(
                buttonVariants({ variant: link.variant, size: 'sm' }),
                link.variant === 'default' && '',
                'hover:text-purple-500 dark:hover:border-neutral-100/10',
                'justify-start text-lg tracking-tight text-muted-foreground',
                link.disabled && 'opacity-50 cursor-not-allowed pointer-events-none'
              )}
              onClick={(e) => link.disabled && e.preventDefault()}
            >
              <link.icon className={cn("mr-2 h-5 w-5", link.disabled && "text-neutral-600")} />
              {link.title}
              {link.label && (
                <span className={cn('ml-auto ', link.variant === 'default' && 'text-background ')}>
                  {link.label}
                </span>
              )}
            </Link>
          )
        )}
      </nav>
    </div>
  )
}