# Migration Summary: Firebase → Supabase Storage

## Files Changed

### Created (7 files)
1. `migrations/add_deliverable_media_table.sql` - Database schema
2. `lib/supabase-admin.ts` - Server-side Supabase client
3. `app/api/deliverables/upload/route.ts` - Upload API
4. `app/api/deliverables/signed-url/route.ts` - Signed URL API

### Modified (4 files)
5. `components/ui/FileUpload.tsx` - Upload component
6. `components/ui/MediaPreview.tsx` - Preview component
7. `.env.local` - Environment variables
8. `package.json` - Dependencies

### Deleted (3 files)
9. `lib/firebase.ts`
10. `lib/firebase-admin.ts`
11. `app/api/deliverables/sign/route.ts`

---

## Database Changes

### New Table: `deliverable_media`
```sql
- id (uuid, primary key)
- application_id (uuid, foreign key)
- deliverable_label (text)
- storage_bucket (text, default 'connex-deliverables')
- storage_path (text, unique)
- mime_type (text)
- file_size (bigint)
- media_type (enum: 'image' | 'video')
- uploaded_by_user_id (uuid, foreign key)
- created_at, updated_at (timestamps)
```

### RLS Policies
- Creators can INSERT for their own applications
- Creators can SELECT their own deliverables
- Providers can SELECT deliverables for their offers

### Storage Bucket: `connex-deliverables`
- Private bucket (no public access)
- 100MB file size limit
- Allowed types: image/*, video/*

---

## How to Test

### 1. Setup (REQUIRED)
Add your Supabase service role key to `.env.local`:
```bash
SUPABASE_SERVICE_ROLE_KEY=your_actual_key_here
```
Get it from: [Supabase Dashboard → Settings → API](https://supabase.com/dashboard/project/imfpqrcogeddwhvsraan/settings/api)

Then restart dev server:
```bash
npm run dev
```

### 2. Creator Upload Test
1. Login as creator
2. Go to `/creator/applications`
3. Find `in_progress` application
4. Click "Submit Proof of Work"
5. Upload image/video (under 100MB)
6. Click "Submit All Deliverables"
7. ✅ Verify upload completes and status → `completed`

### 3. Provider Preview Test
1. Login as provider
2. Go to `/provider/applications`
3. Click "REVIEW LINK" on completed application
4. ✅ Verify media previews load correctly
5. ✅ Verify video plays with controls
6. ✅ Verify no Firebase errors in console

---

## Verification Commands

```bash
# Confirm no Firebase imports
grep -r "from.*firebase" --include="*.ts" --include="*.tsx" .
# Expected: No results

# Confirm Firebase packages removed
npm list firebase firebase-admin
# Expected: Not found

# Confirm no Firebase env vars
grep -i firebase .env.local
# Expected: No results
```

---

## What Changed (Technical)

**Before (Firebase):**
- Client uploads directly to Firebase Storage
- Server generates signed URLs using Firebase Admin SDK
- Requires service account key or ADC credentials
- Preview fails with `invalid_grant` errors

**After (Supabase):**
- Client uploads via API route to Supabase Storage
- Server generates signed URLs using Supabase service role
- Single service role key (no Google Cloud dependencies)
- Preview works reliably with proper authorization

**Key Benefits:**
✅ No more Firebase/Google Cloud credential issues
✅ Consistent Supabase stack (auth + DB + storage)
✅ Better RLS security policies
✅ Simpler deployment (one platform)
