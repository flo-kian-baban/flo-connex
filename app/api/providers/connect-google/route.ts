import { createServerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { code } = await request.json();

        if (!code) {
            return NextResponse.json({ error: 'No authorization code provided' }, { status: 400 });
        }

        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name) {
                        return cookieStore.get(name)?.value;
                    },
                },
            }
        );
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const clientId = process.env.GOOGLE_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
        // Redirect URI must match the one used in the initial auth request
        const redirectUri = `${new URL(request.url).origin}/api/auth/google/callback`;

        if (!clientId || !clientSecret) {
            return NextResponse.json({ error: 'Google configuration missing' }, { status: 500 });
        }

        // 1. Exchange code for tokens
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                client_id: clientId,
                client_secret: clientSecret,
                code,
                grant_type: 'authorization_code',
                redirect_uri: redirectUri,
            }),
        });

        const tokens = await tokenResponse.json();

        if (!tokenResponse.ok) {
            console.error("Token exchange error:", tokens);
            return NextResponse.json({ error: 'Failed to exchange tokens', details: tokens }, { status: 400 });
        }

        // 2. Fetch Business Account ID
        const accountsResponse = await fetch('https://mybusinessaccountmanagement.googleapis.com/v1/accounts', {
            headers: { Authorization: `Bearer ${tokens.access_token}` }
        });

        let accountId = null;
        if (accountsResponse.ok) {
            const accountsData = await accountsResponse.json();
            if (accountsData.accounts && accountsData.accounts.length > 0) {
                accountId = accountsData.accounts[0].name.split('/').pop();
            }
        }

        // 3. Update Provider Record
        const { error: updateError } = await supabase
            .from('providers')
            .update({
                google_refresh_token: tokens.refresh_token,
                google_access_token: tokens.access_token,
                google_business_account_id: accountId,
            })
            .eq('claimed_by_user_id', session.user.id);

        if (updateError) {
            console.error("Database update error:", updateError);
            return NextResponse.json({ error: 'Failed to update provider record' }, { status: 500 });
        }

        return NextResponse.json({ success: true, accountId });

    } catch (error) {
        console.error('Connect Google error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
