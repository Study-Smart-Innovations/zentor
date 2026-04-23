import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error("CRITICAL: Supabase environment variables are missing!");
} else {
  console.log("Supabase initialized with URL");
}

// Client for general use (RLS applies)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client for auth actions (bypasses RLS)
// IMPORTANT: This should ONLY be used on the server
export const getSupabaseAdmin = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export const supabaseAdmin = getSupabaseAdmin()
