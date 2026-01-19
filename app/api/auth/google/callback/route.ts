import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const returnUrl = searchParams.get('state') || '/provider/settings';
    const error = searchParams.get('error');

    if (error) {
        return NextResponse.redirect(new URL(`${returnUrl}?error=${error}`, request.url));
    }

    if (!code) {
        return NextResponse.redirect(new URL(`${returnUrl}?error=no_code`, request.url));
    }

    // Redirect to the settings page with the code
    // The frontend will take this code and POST it to /api/providers/connect-google
    // This avoids server-side cookie parsing issues for Auth
    const redirectUrl = new URL(returnUrl, request.url);
    redirectUrl.searchParams.set('google_auth_code', code);

    return NextResponse.redirect(redirectUrl);
}
