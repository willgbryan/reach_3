import type { Metadata } from 'next'
import { Bricolage_Grotesque as FontSans } from 'next/font/google'

import './globals.css'

import { cookies } from 'next/headers'

import { Analytics } from '@/components/analytics'
import { DynamicBlobProvider } from '@/components/cult/dynamic-blob'
import { ThemeProvider } from '@/components/providers'
import { TailwindIndicator } from '@/components/tailwind-indicator'
import { TooltipProvider } from '@/components/ui/tooltip'
import { siteConfig } from '@/config/site'
import { createClient } from '@/db/server'
import { cn } from '@/lib/utils'

import SupabaseProvider from './supabase-provider'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: ` ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ['Next.js', 'React', 'Tailwind CSS', 'Server Components'],
  creator: 'you',
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const supabase = createClient(cookies())
  const {
    data: { session },
  } = await supabase.auth.getSession()

  return (
    <>
      <html lang="en">
        <head />
        <body
          className={cn(
            ' bg-background dark:bg-offBlack-950 font-sans antialiased ',
            fontSans.variable,
          )}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <SupabaseProvider session={session}>
              <TooltipProvider delayDuration={0}>
                <DynamicBlobProvider initialSize={'default'}>
                  <main>{children}</main>
                </DynamicBlobProvider>
              </TooltipProvider>
            </SupabaseProvider>

            <TailwindIndicator />
          </ThemeProvider>

          <Analytics />
        </body>
      </html>
    </>
  )
}
