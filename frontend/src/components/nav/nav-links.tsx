'use client'
import { BookCopy, DollarSign, Home, Newspaper, Settings } from 'lucide-react'
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
            title: 'Newsletter', 
            icon: Newspaper, 
            variant: 'ghost', 
            href: `/newsletter`, 
            disabled: false, 
            // label: 'Coming soon'
          },
          {
            title: 'Configure', 
            icon: Settings, 
            variant: 'ghost', 
            href: `/profile`, 
            disabled: true, 
            label: 'Coming soon'
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