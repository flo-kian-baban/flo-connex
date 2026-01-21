# Bug Fix: "Application not found" Error

## Issue
Upload was failing with "Application not found" error when trying to upload deliverables.

## Root Cause
The API routes were using the client-side `supabase` instance to query the database. This instance has Row Level Security (RLS) enabled, which was blocking the queries even though we were using the service role key for storage operations.

## Solution
Changed all database queries in the API routes to use `supabaseAdmin` instead of `supabase`:

### Files Fixed
1. **`app/api/deliverables/upload/route.ts`**
   - Line 33: Changed application lookup to use `supabaseAdmin`
   - Line 98: Changed metadata insert to use `supabaseAdmin`

2. **`app/api/deliverables/signed-url/route.ts`**
   - Line 30: Changed application lookup to use `supabaseAdmin`
   - Line 45: Changed offer lookup to use `supabaseAdmin`
   - Line 52: Changed provider lookup to use `supabaseAdmin`

## Why This Works
- `supabase` = Client instance with RLS enabled (respects row-level security)
- `supabaseAdmin` = Admin instance with service role key (bypasses RLS)

API routes run server-side and need to bypass RLS to perform administrative operations while still validating user permissions in code.

## Test Again
The upload should now work correctly. Try uploading again:
1. Go to `/creator/applications`
2. Click "Submit Proof of Work"
3. Upload an image or video
4. ✅ Should complete successfully
