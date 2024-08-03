'use client'
import { BookCopy, DollarSign, Home } from 'lucide-react'
import { Nav } from './nav'

export function NavLinks({ isCollapsed }) {
  return (
    <div className="">
      <Nav
        isCollapsed={isCollapsed}
        links={[
          { title: 'Home', icon: Home, variant: 'ghost', href: '/chat' },
          { 
            title: 'Library', 
            icon: BookCopy, 
            variant: 'ghost', 
            href: '/library', 
            disabled: true, 
            label: 'Coming soon'
          },
          { title: 'Pricing', icon: DollarSign, variant: 'ghost', href: '/pricing' },
        ]}
      />
    </div>
  )
}