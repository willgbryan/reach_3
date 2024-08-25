import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/db/server'

export async function POST(req: NextRequest) {
  const db = createClient(cookies())
  const { data: { session } } = await db.auth.getSession()
  const userId = session?.user.id

  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const { report_config } = await req.json()

    // First, try to fetch the existing user_config
    let { data: existingConfig, error: fetchError } = await db
      .from('user_config')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError
    }

    let result
    if (existingConfig) {
      result = await db
        .from('user_config')
        .update({ report_config })
        .eq('user_id', userId)
    } else {
      const { data: userData, error: userError } = await db
        .from('users')
        .select('full_name, avatar_url')
        .eq('id', userId)
        .single()

      if (userError) {
        throw userError
      }

      result = await db
        .from('user_config')
        .insert({
          user_id: userId,
          name: userData.full_name || '',
          email_address: '',
          job_title: '',
          industry: '',
          report_config
        })
    }

    if (result.error) {
      throw result.error
    }

    return new NextResponse(JSON.stringify({ message: 'Report configuration updated successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error updating report configuration:', error)
    return new NextResponse(JSON.stringify({ message: 'Error updating report configuration' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}