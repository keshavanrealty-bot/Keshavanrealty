import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://cjtadjfusmcszfomhvga.supabase.co';
const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqdGFkamZ1c21jc3pmb21odmdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI5MDg2NTcsImV4cCI6MjEwODQ4NDY1N30.bIVu6tArJwJcEfFET_Ttp2_ZpEFokpC9VlmhtfN2nH4';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
