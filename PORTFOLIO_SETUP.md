# Portfolio Feature - Supabase Setup Guide

## Step 1: Run SQL Schema

1. **Go to Supabase Dashboard** → Your Green Rangers project
2. Click **"SQL Editor"** in left sidebar
3. Click **"New query"**
4. **Copy and paste** the entire contents of `supabase/portfolio_schema.sql`
5. Click **"Run"** (bottom right)
6. Wait for ✅ "Success. No rows returned"

This creates 3 tables:
- `portfolios` - Worker portfolio settings
- `portfolio_projects` - Individual projects
- `project_photos` - Photos for each project

---

## Step 2: Create Storage Bucket

1. **Go to Storage** in Supabase left sidebar
2. Click **"Create a new bucket"**
3. **Bucket name:** `portfolio-photos`
4. **Public bucket:** ✅ Check this box (photos need to be publicly viewable)
5. Click **"Create bucket"**

---

## Step 3: Verify Setup

### Check Tables Created:
1. Go to **"Table Editor"** in left sidebar
2. You should see these new tables:
   - portfolios
   - portfolio_projects
   - project_photos

### Check Storage Bucket:
1. Go to **"Storage"** in left sidebar
2. You should see **"portfolio-photos"** bucket

---

## Step 4: Test in Development

Once setup is complete, the portfolio features will be available:

### Worker Features:
- `/dashboard` - View and manage portfolio
- Add projects with up to 6 photos
- Toggle portfolio public/private
- Add Instagram handle

### Public Features:
- `/portfolio/[email]` - View worker portfolios
- Filter projects by skill
- See Instagram feed (if connected)

### Employer Features:
- Portfolio badges on applications
- "View Portfolio" buttons
- Quick skill filtering

---

## Next Steps

After Supabase setup is complete:

1. ✅ Test portfolio creation on localhost
2. ✅ Upload sample project with photos
3. ✅ View public portfolio page
4. ✅ Deploy to Netlify (environment variables already set)

---

## Troubleshooting

**Error: "relation 'portfolios' does not exist"**
- SQL schema didn't run successfully
- Go back to SQL Editor and run schema again

**Error uploading photos:**
- Storage bucket not created
- Check bucket name is exactly `portfolio-photos`
- Verify bucket is marked as **Public**

**Storage policies not working:**
- SQL schema includes storage policies
- May need to manually create policies in Storage settings if auto-creation failed

---

**Ready to run the setup?** Let me know when the SQL and storage bucket are created, then we'll test the dashboard!
