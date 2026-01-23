import { createBrowserClient } from '@supabase/auth-helpers-nextjs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://imfpqrcogeddwhvsraan.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_JETk_Onl9zS_epIRsNjB6A_eCpDgM7V';

export const supabase = createBrowserClient(supabaseUrl, supabaseKey, {
    auth: {
        detectSessionInUrl: true,
        flowType: 'pkce',
    },
});
