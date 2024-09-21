'use client'

import React, { useState, useEffect } from 'react'

export function FreeSearchCounter() {
  const [status, setStatus] = useState('Loading...')

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/user-status')
      if (!response.ok) {
        throw new Error('Failed to fetch user status')
      }
      const data = await response.json()
      
      if (data.isPro) {
        setStatus('Pro')
      } else {
        setStatus(`Free analyses remaining: ${data.freeSearches}`)
      }
    } catch (error) {
      console.error('Error fetching user status:', error)
      setStatus('Error')
    }
  }

  useEffect(() => {
    fetchStatus()
  }, [])

  return (
    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
      {status}
    </div>
  )
}