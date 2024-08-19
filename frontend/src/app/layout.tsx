import type { Metadata } from 'next'
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
import { headers } from 'next/headers'
import { Logo } from '@/components/layout/sidebar-panel'

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `${siteConfig.name}`,
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

  // Server-side mobile detection
  const userAgent = headers().get('user-agent') || ''
  const isMobile = /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(userAgent)

  return (
    <html lang="en">
      <head />
      <body
        className={cn(
          'bg-background dark:bg-offBlack-950 font-sans antialiased',
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
                {isMobile ? (
                  <MobileMessage />
                ) : (
                  <main>{children}</main>
                )}
              </DynamicBlobProvider>
            </TooltipProvider>
          </SupabaseProvider>
          <TailwindIndicator />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}

function MobileMessage() {
  return (
    <div className="flex flex-col h-screen items-center justify-center p-4 text-center">
      <Logo />
      <p className="text-lg font-semibold mt-4">
        Mobile support coming soon. Visit Heighliner on a computer for the best experience.
      </p>
    </div>
  )
}