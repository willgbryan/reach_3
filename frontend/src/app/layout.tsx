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
import Script from 'next/script'
import Head from 'next/head'

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ['Heighliner', 'Legal', 'Research', 'Artifacts'],
  authors: [{ name: 'Will' }],
  creator: 'Will',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://heighliner.tech',
    title: 'Heighliner',
    description: 'Knowledge work, modernized',
    siteName: 'Heighliner',
    images: [{
      url: 'https://s.yimg.com/ny/api/res/1.2/6YLkalF05.eeHi15u_0_.w--/YXBwaWQ9aGlnaGxhbmRlcjt3PTY0MDtoPTMyMA--/https://o.aolcdn.com/hss/storage/midas/29cdfcf2bb2af26b103c432d02cbe5e2/205180329/TN-JPL1978-300dpi-ed2.jpg',
      width: 640,
      height: 320,
      alt: 'Heighliner preview image',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Heighliner',
    description: 'Knowledge work, modernized',
    images: ['https://s.yimg.com/ny/api/res/1.2/6YLkalF05.eeHi15u_0_.w--/YXBwaWQ9aGlnaGxhbmRlcjt3PTY0MDtoPTMyMA--/https://o.aolcdn.com/hss/storage/midas/29cdfcf2bb2af26b103c432d02cbe5e2/205180329/TN-JPL1978-300dpi-ed2.jpg'],
  },
  icons: {
    icon: '/icon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  metadataBase: new URL('https://heighliner.tech'),
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
    <html lang="en">
      <head>
        <Script src="https://d3js.org/d3.v7.min.js" strategy="beforeInteractive" />
      </head>
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
               
                  <main>{children}</main>
                
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