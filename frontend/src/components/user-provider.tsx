'use client'

import React, { useEffect, useState, forwardRef } from 'react'
import { useRouter } from 'next/navigation'
import { HeaderAccountDropdown } from './header-account-dropdown'

const UserProvider = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>((props, ref) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch('/api/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        } else {
          router.push('/auth/sign-in')
        }
      } catch (error) {
        console.error('Error fetching user:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [router])

  if (loading) {
    return <div ref={ref} {...props}>Loading...</div>
  }

  return user ? <HeaderAccountDropdown user={user} /> : null
})

export default UserProvider