'use client'
import { BookCopy, DollarSign, Home, Newspaper } from 'lucide-react'
import { Nav } from './nav'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://themagi.systems';

export function NavLinks({ isCollapsed }) {
  return (
    <div className="">
      <Nav
        isCollapsed={isCollapsed}
        links={[
          { title: 'Home', icon: Home, variant: 'ghost', href: `${baseUrl}/chat` },
          { 
            title: 'Newsletter', 
            icon: Newspaper, 
            variant: 'ghost', 
            href: `${baseUrl}/newsletter`, 
            disabled: true, 
            label: 'Coming soon'
          },
          { 
            title: 'Library', 
            icon: BookCopy, 
            variant: 'ghost', 
            href: `${baseUrl}/library`, 
            disabled: true, 
            label: 'Coming soon'
          },
          { 
            title: 'Pricing', 
            icon: DollarSign, 
            variant: 'ghost', 
            href: `${baseUrl}/pricing`,
            disabled: true, 
            label: 'Free for now :D'
          },
        ]}
      />
    </div>
  )
}