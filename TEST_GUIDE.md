# Quick Test Guide

## ✅ Setup Complete
Your Supabase service role key is configured. The migration is ready to test!

## Test Now (5 minutes)

### Test 1: Creator Upload
1. Open: http://localhost:3000/creator/applications
2. Find an application with status "In Progress"
3. Click "Submit Proof of Work"
4. Upload a test image or video (under 100MB)
5. ✅ **Expected**: Upload progress bar → "Ready to submit" → Success

### Test 2: Provider Preview
1. Open: http://localhost:3000/provider/applications
2. Find an application with submitted deliverables
3. Click "REVIEW LINK" or "REVIEW X LINKS"
4. ✅ **Expected**: Media previews load correctly (no Firebase errors)

## Verification

Check browser console (F12):
- ❌ No Firebase errors
- ❌ No "invalid_grant" errors
- ✅ Clean console output

## If Issues Occur

1. **Upload fails**: Check console for error message
2. **Preview fails**: Verify service role key in `.env.local`
3. **401 Unauthorized**: Make sure you're logged in
4. **403 Forbidden**: Verify you own the application (creator) or offer (provider)

## Need Help?
Check the detailed walkthrough: [walkthrough.md](file:///Users/kianbaban/.gemini/antigravity/brain/aac71fae-3e72-4735-a051-87ecc406abbd/walkthrough.md)
