# Green Rangers Deployment Guide

## Netlify Environment Variables Setup

The application requires Supabase credentials to be configured in Netlify for the application system to work in production.

### Required Environment Variables

Add these in your Netlify dashboard under **Site settings → Environment variables**:

```
NEXT_PUBLIC_SUPABASE_URL=https://zctlvfjstagggwieaxjq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjdGx2ZmpzdGFnZ2d3aWVheGpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0ODIxOTAsImV4cCI6MjA3ODA1ODE5MH0.0V3wBKCLYzXgFHPUqkJt_AVBPU12ljEX9l0JouEnhcc
```

### Step-by-Step Setup

1. **Go to Netlify Dashboard**
   - Navigate to your Green Rangers site
   - Click on "Site settings"

2. **Add Environment Variables**
   - Click "Environment variables" in the left sidebar
   - Click "Add a variable" button
   - Add each variable:
     - Key: `NEXT_PUBLIC_SUPABASE_URL`
     - Value: `https://zctlvfjstagggwieaxjq.supabase.co`
     - Scopes: Select "All deploy contexts" (or just "Production")

   - Click "Add a variable" again
     - Key: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjdGx2ZmpzdGFnZ2d3aWVheGpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0ODIxOTAsImV4cCI6MjA3ODA1ODE5MH0.0V3wBKCLYzXgFHPUqkJt_AVBPU12ljEX9l0JouEnhcc`
     - Scopes: Select "All deploy contexts" (or just "Production")

3. **Redeploy**
   - After adding variables, go to "Deploys" tab
   - Click "Trigger deploy" → "Clear cache and deploy site"
   - Wait for deployment to complete

### Verify Setup

After deployment completes:

1. Visit your site at the Netlify URL
2. Click "Job Board" button
3. Click on a job marker on the map
4. Click "Apply with Green Rangers"
5. Fill out the form and submit
6. Check your Supabase dashboard to verify the application was saved

### Supabase Dashboard

To view applications:
- **URL**: https://supabase.com/dashboard/project/zctlvfjstagggwieaxjq
- **Table Editor**: Click "Table Editor" in left sidebar
- **Tables to check**:
  - `applications` - All job applications
  - `worker_profiles` - Saved worker profiles
  - `crew_requests` - Crew service requests

### Troubleshooting

**Application not submitting:**
- Check Netlify environment variables are set correctly
- Check browser console for errors
- Verify Supabase project is active

**Resume upload failing:**
- Check storage bucket "resumes" exists
- Verify storage policies are enabled
- Check file size (max 50MB recommended)

**Worker profile not updating:**
- Check email is entered correctly
- Verify worker_profiles table exists
- Check RLS policies allow INSERT and SELECT

## Local Development

For local development, create a `.env.local` file in the root directory:

```
NEXT_PUBLIC_SUPABASE_URL=https://zctlvfjstagggwieaxjq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjdGx2ZmpzdGFnZ2d3aWVheGpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0ODIxOTAsImV4cCI6MjA3ODA1ODE5MH0.0V3wBKCLYzXgFHPUqkJt_AVBPU12ljEX9l0JouEnhcc
```

**Note:** This file is already in `.gitignore` and will NOT be committed to GitHub.

## Application System Features

### For Job Seekers
- Click "Apply with Green Rangers" on any job
- Upload resume (PDF, DOC, DOCX)
- Track certifications (NABCEP, NCCER, OSHA)
- Automatic profile creation for faster future applications

### For Admins (Future)
- View all applications in Supabase dashboard
- Filter by status, certification, job
- Export applicant data
- Forward qualified candidates to employers

### Revenue Model
- **Day Labor**: $120/day per worker
- **Placement Fees**: 15-25% of first-year salary
- **Employer Subscriptions**: $299/month for priority access
- **Training Sponsorships**: $50k-100k per cohort from EPCs

## Next Steps

1. ✅ Add Netlify environment variables
2. ✅ Redeploy site
3. ✅ Test application submission
4. ⬜ Build admin dashboard to manage applications
5. ⬜ Add email notifications (applicant, employer, admin)
6. ⬜ Connect crew-service form to database
7. ⬜ Connect join-team form to database
8. ⬜ Implement application status tracking workflow
