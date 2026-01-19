import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const returnUrl = searchParams.get('returnUrl') || '/provider/settings';

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const redirectUri = `${new URL(request.url).origin}/api/auth/google/callback`;

    if (!clientId) {
        return NextResponse.json(
            { error: 'Google Client ID is not configured' },
            { status: 500 }
        );
    }

    // Scopes for Business Profile and Basic Profile
    const scopes = [
        'https://www.googleapis.com/auth/business.manage',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile'
    ].join(' ');

    const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: scopes,
        access_type: 'offline', // Critical for receiving refresh token
        prompt: 'consent',      // Force consent to ensure refresh token is returned
        state: returnUrl        // Pass returnUrl as state to redirect back after
    });

    const url = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

    return NextResponse.redirect(url);
}
