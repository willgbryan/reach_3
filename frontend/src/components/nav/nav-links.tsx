'use client'
import { BookCopy, DollarSign, Home, Newspaper, Settings, Globe, LibraryBig } from 'lucide-react'
import { Nav } from './nav'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://themagi.systems';

export function NavLinks({ isCollapsed }) {
  return (
    <div className="">
      <Nav
        isCollapsed={isCollapsed}
        links={[
          // { title: 'Home', icon: Home, variant: 'ghost', href: `/chat` },
          { 
            title: 'Research', 
            icon: Globe, 
            variant: 'ghost', 
            href: `/chat`, 
            disabled: false, 
            // label: 'Coming soon'
          },
          {
            title: 'Document Analysis', 
            icon: LibraryBig, 
            variant: 'ghost', 
            href: `/analysis`, 
            disabled: false, 
            label: 'Pro'
          },
          // { 
          //   title: 'Newsletter', 
          //   icon: Newspaper, 
          //   variant: 'ghost', 
          //   href: `/newsletter`, 
          //   disabled: true, 
          //   label: 'Coming soon'
          // },
          {
            title: 'Configure', 
            icon: Settings, 
            variant: 'ghost', 
            href: `/profile`, 
            disabled: false, 
            label: 'Pro'
          },
          // { 
          //   title: 'Library', 
          //   icon: BookCopy, 
          //   variant: 'ghost', 
          //   href: `/library`, 
          //   disabled: true, 
          //   label: 'Coming soon'
          // },
          // { 
          //   title: 'Pricing', 
          //   icon: DollarSign, 
          //   variant: 'ghost', 
          //   href: `/pricing`,
          //   disabled: true, 
          //   label: ''
          // },
        ]}
      />
    </div>
  )
}