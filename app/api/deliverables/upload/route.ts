import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const applicationId = formData.get('applicationId') as string;
        const deliverableLabel = formData.get('deliverableLabel') as string;

        if (!file || !applicationId || !deliverableLabel) {
            return NextResponse.json(
                { error: 'Missing required fields: file, applicationId, or deliverableLabel' },
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

        // Verify user owns this application
        const { data: application, error: appError } = await supabaseAdmin
            .from('applications')
            .select('creator_id')
            .eq('id', applicationId)
            .single();

        if (appError || !application) {
            console.error('Application lookup error:', appError);
            return NextResponse.json({ error: 'Application not found' }, { status: 404 });
        }

        if (application.creator_id !== user.id) {
            return NextResponse.json(
                { error: 'You can only upload deliverables for your own applications' },
                { status: 403 }
            );
        }

        // Validate file type
        const mimeType = file.type;
        const isImage = mimeType.startsWith('image/');
        const isVideo = mimeType.startsWith('video/');

        if (!isImage && !isVideo) {
            return NextResponse.json(
                { error: 'Only image and video files are allowed' },
                { status: 400 }
            );
        }

        const mediaType = isVideo ? 'video' : 'image';

        // Validate file size (100MB limit)
        const maxSize = 100 * 1024 * 1024; // 100MB
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: 'File size exceeds 100MB limit' },
                { status: 400 }
            );
        }

        // Create storage path
        const timestamp = Date.now();
        const sanitizedLabel = deliverableLabel.replace(/\s+/g, '_');
        const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const storagePath = `deliverables/${applicationId}/${sanitizedLabel}_${timestamp}_${sanitizedFilename}`;

        // Upload to Supabase Storage
        const fileBuffer = await file.arrayBuffer();
        const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
            .from('connex-deliverables')
            .upload(storagePath, fileBuffer, {
                contentType: mimeType,
                upsert: false
            });

        if (uploadError) {
            console.error('Upload error:', uploadError);
            return NextResponse.json(
                { error: 'Failed to upload file', details: uploadError.message },
                { status: 500 }
            );
        }

        // Save metadata to database
        const { data: metadata, error: metadataError } = await supabaseAdmin
            .from('deliverable_media')
            .insert({
                application_id: applicationId,
                deliverable_label: deliverableLabel,
                storage_bucket: 'connex-deliverables',
                storage_path: storagePath,
                mime_type: mimeType,
                file_size: file.size,
                media_type: mediaType,
                uploaded_by_user_id: user.id
            })
            .select()
            .single();

        if (metadataError) {
            // If metadata insert fails, try to delete the uploaded file
            await supabaseAdmin.storage
                .from('connex-deliverables')
                .remove([storagePath]);

            console.error('Metadata error:', metadataError);
            return NextResponse.json(
                { error: 'Failed to save file metadata', details: metadataError.message },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            storage_path: storagePath,
            media_type: mediaType,
            file_size: file.size,
            metadata
        });

    } catch (error: any) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}
