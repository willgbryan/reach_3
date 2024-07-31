'use client'

import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes'
import { ThemeProviderProps } from 'next-themes/dist/types'
import { Toaster } from 'sonner'

import { TooltipProvider } from '@/components/ui/tooltip'

const ToasterProvider = ({ ...props }) => {
  const { theme } = useTheme() as {
    theme: 'light' | 'dark' | 'system'
  }
  return <Toaster richColors theme={theme} {...props} />
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <ToasterProvider />
      <TooltipProvider>{children}</TooltipProvider>
    </NextThemesProvider>
  )
}
