import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://imfpqrcogeddwhvsraan.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_JETk_Onl9zS_epIRsNjB6A_eCpDgM7V';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
