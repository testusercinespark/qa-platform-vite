import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log("PROD URL:", url)
console.log("PROD KEY EXISTS:", !!key)

export const supabase = createClient(url, key)