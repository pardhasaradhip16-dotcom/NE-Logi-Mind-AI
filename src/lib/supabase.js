import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dummy.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'dummy_key';

// Only create a real client if the URL is somewhat valid (starts with http)
// Otherwise create a dummy client that will fail gracefully or just be ignored
const isValidUrl = supabaseUrl.startsWith('http');
export const supabase = isValidUrl 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : createClient('https://dummy.supabase.co', 'dummy_key');
