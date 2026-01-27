import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const { storage_path, application_id } = await req.json();

        if (!storage_path || !application_id) {
            return NextResponse.json(
                { error: 'Missing required parameters: storage_path or application_id' },
                { status: 400 }
            );
        }

        // Get authenticated user from session
        const authHeader = req.headers.get('authorization');
        if (!authHeader) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);

        if (authError || !user) {
            return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
        }

        const supabaseAdmin = getSupabaseAdmin();

        // Check if user is the creator of the application
        const { data: application, error: appError } = await supabaseAdmin
            .from('applications')
            .select('creator_id, offer_id, provider_id')
            .eq('id', application_id)
            .single();

        if (appError || !application) {
            console.error('Application lookup error:', appError);
            return NextResponse.json({ error: 'Application not found' }, { status: 404 });
        }

        const isCreator = application.creator_id === user.id;

        // Check if user is the provider of the offer OR the direct provider of the application
        let isProvider = false;
        if (!isCreator) {
            // 1. Try to check via provider_id directly on the application (Direct Requests & New Apps)
            if (application.provider_id) {
                const { data: provider, error: providerError } = await supabaseAdmin
                    .from('providers')
                    .select('id')
                    .eq('id', application.provider_id)
                    .eq('claimed_by_user_id', user.id)
                    .single();

                isProvider = !providerError && !!provider;
            }

            // 2. Fallback: Check via Offer lookup (for legacy apps or redundancy)
            if (!isProvider && application.offer_id) {
                const { data: offer, error: offerError } = await supabaseAdmin
                    .from('offers')
                    .select('provider_id')
                    .eq('id', application.offer_id)
                    .single();

                if (!offerError && offer) {
                    const { data: provider, error: providerError } = await supabaseAdmin
                        .from('providers')
                        .select('id')
                        .eq('id', offer.provider_id)
                        .eq('claimed_by_user_id', user.id)
                        .single();

                    isProvider = !providerError && !!provider;
                }
            }
        }

        // User must be either the creator or the provider
        if (!isCreator && !isProvider) {
            return NextResponse.json(
                { error: 'You do not have permission to access this deliverable' },
                { status: 403 }
            );
        }

        // Verify the file exists in storage
        const { data: fileData, error: fileError } = await supabaseAdmin.storage
            .from('connex-deliverables')
            .list(storage_path.substring(0, storage_path.lastIndexOf('/')), {
                search: storage_path.substring(storage_path.lastIndexOf('/') + 1)
            });

        if (fileError || !fileData || fileData.length === 0) {
            return NextResponse.json(
                { error: 'File not found in storage' },
                { status: 404 }
            );
        }

        // Generate signed URL (1 hour expiry)
        const expiresIn = 3600; // 1 hour in seconds
        const { data: signedUrlData, error: signedUrlError } = await supabaseAdmin.storage
            .from('connex-deliverables')
            .createSignedUrl(storage_path, expiresIn);

        if (signedUrlError || !signedUrlData) {
            console.error('Signed URL error:', signedUrlError);
            return NextResponse.json(
                { error: 'Failed to generate signed URL', details: signedUrlError?.message },
                { status: 500 }
            );
        }

        const expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();

        return NextResponse.json({
            signedUrl: signedUrlData.signedUrl,
            expiresAt
        });

    } catch (error: any) {
        console.error('Signed URL generation error:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}
