import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.PUBLIC_SUPABASE_WRITE_KEY;

export const writeSupabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : undefined;
