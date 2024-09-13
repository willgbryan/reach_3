// also used for the waitlist
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/db/server'

export async function POST(req: NextRequest) {
  const db = createClient(cookies())
  const { data: { session } } = await db.auth.getSession()
  const userId = session?.user?.id

  try {
    const { name, email, company } = await req.json()
    
    const { data, error } = await db
      .from('enterprise_contact_and_waitlist')
      .insert({ 
        name, 
        email, 
        company,
        user_id: userId || null
      })
      .single()

    if (error) throw error

    return new NextResponse(JSON.stringify({ message: 'Contact information submitted successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error submitting contact information:', error)
    return new NextResponse(JSON.stringify({ message: 'Error submitting contact information' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}