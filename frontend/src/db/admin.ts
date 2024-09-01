import 'server-only'

import { createClient } from '@supabase/supabase-js'

import { Database } from '@/types/db'

export const adminConfig = {
  url: process.env.SUPABASE_URL ?? '',
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? '',
}

export const dbAdmin = createClient<Database>(adminConfig.url, adminConfig.serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
})
