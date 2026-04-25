import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function createWaitlistTable() {
  const { error } = await supabase.rpc('create_waitlist_table', {})
  if (error) {
    // Fallback: Use direct SQL if RPC doesn't exist
    const sql = `
      CREATE TABLE IF NOT EXISTS waitlist (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        created_at TIMESTAMPTZ DEFAULT now(),
        full_name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone_number TEXT,
        role TEXT NOT NULL
      );
    `
    console.error("RPC failed, please run this SQL in Supabase Dashboard:", sql)
  } else {
    console.log("Waitlist table created successfully via RPC.")
  }
}

createWaitlistTable()
