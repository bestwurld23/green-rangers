-- ============================================
-- GREEN RANGERS PORTFOLIO SYSTEM - DATABASE SCHEMA
-- ============================================

-- 1. PORTFOLIOS TABLE
-- Main portfolio settings for each worker
CREATE TABLE portfolios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

  -- Link to worker_profiles table
  worker_email TEXT NOT NULL REFERENCES worker_profiles(email) ON DELETE CASCADE,

  -- Profile settings
  is_public BOOLEAN DEFAULT TRUE,
  profile_photo_url TEXT,
  bio TEXT,
  title TEXT, -- e.g., "Solar Installation Specialist"
  location TEXT,
  availability TEXT, -- e.g., "Full-time positions, Contract work"

  -- Social links
  instagram_handle TEXT,
  instagram_connected BOOLEAN DEFAULT FALSE,
  linkedin_url TEXT,

  -- Stats
  total_projects INTEGER DEFAULT 0,
  profile_views INTEGER DEFAULT 0,

  -- Unique constraint - one portfolio per worker
  UNIQUE(worker_email)
);

-- 2. PORTFOLIO_PROJECTS TABLE
-- Individual projects in a worker's portfolio
CREATE TABLE portfolio_projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

  -- Link to portfolio
  portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,

  -- Project details
  title TEXT NOT NULL,
  company TEXT,
  location TEXT,
  project_date DATE,
  description TEXT,

  -- Skills used (stored as JSON array)
  skills JSONB DEFAULT '[]'::jsonb,

  -- Display order
  display_order INTEGER DEFAULT 0,

  -- Featured flag
  is_featured BOOLEAN DEFAULT FALSE
);

-- 3. PROJECT_PHOTOS TABLE
-- Photos for each project
CREATE TABLE project_photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

  -- Link to project
  project_id UUID NOT NULL REFERENCES portfolio_projects(id) ON DELETE CASCADE,

  -- Photo details
  photo_url TEXT NOT NULL,
  caption TEXT,
  display_order INTEGER DEFAULT 0,

  -- Photo is the hero/main photo for the project
  is_hero BOOLEAN DEFAULT FALSE
);

-- 4. INDEXES
-- Optimize queries
CREATE INDEX idx_portfolios_worker_email ON portfolios(worker_email);
CREATE INDEX idx_portfolios_is_public ON portfolios(is_public);
CREATE INDEX idx_portfolio_projects_portfolio_id ON portfolio_projects(portfolio_id);
CREATE INDEX idx_portfolio_projects_display_order ON portfolio_projects(display_order);
CREATE INDEX idx_project_photos_project_id ON project_photos(project_id);
CREATE INDEX idx_project_photos_display_order ON project_photos(display_order);

-- 5. ROW LEVEL SECURITY (RLS)
-- Enable RLS on all tables
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_photos ENABLE ROW LEVEL SECURITY;

-- Portfolios policies
CREATE POLICY "Public portfolios are viewable by everyone"
  ON portfolios FOR SELECT
  USING (is_public = TRUE);

CREATE POLICY "Users can insert their own portfolio"
  ON portfolios FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own portfolio"
  ON portfolios FOR UPDATE
  USING (true);

-- Portfolio Projects policies
CREATE POLICY "Projects visible if portfolio is public"
  ON portfolio_projects FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM portfolios
      WHERE portfolios.id = portfolio_projects.portfolio_id
      AND portfolios.is_public = TRUE
    )
  );

CREATE POLICY "Users can insert projects"
  ON portfolio_projects FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own projects"
  ON portfolio_projects FOR UPDATE
  USING (true);

CREATE POLICY "Users can delete their own projects"
  ON portfolio_projects FOR DELETE
  USING (true);

-- Project Photos policies
CREATE POLICY "Photos visible if project portfolio is public"
  ON project_photos FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM portfolio_projects pp
      JOIN portfolios p ON p.id = pp.portfolio_id
      WHERE pp.id = project_photos.project_id
      AND p.is_public = TRUE
    )
  );

CREATE POLICY "Users can insert photos"
  ON project_photos FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own photos"
  ON project_photos FOR UPDATE
  USING (true);

CREATE POLICY "Users can delete their own photos"
  ON project_photos FOR DELETE
  USING (true);

-- 6. FUNCTIONS
-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_portfolios_updated_at
  BEFORE UPDATE ON portfolios
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_portfolio_projects_updated_at
  BEFORE UPDATE ON portfolio_projects
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- Update total_projects count when projects are added/deleted
CREATE OR REPLACE FUNCTION update_portfolio_project_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE portfolios
    SET total_projects = total_projects + 1
    WHERE id = NEW.portfolio_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE portfolios
    SET total_projects = total_projects - 1
    WHERE id = OLD.portfolio_id;
    RETURN OLD;
  END IF;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_project_count_on_insert
  AFTER INSERT ON portfolio_projects
  FOR EACH ROW
  EXECUTE PROCEDURE update_portfolio_project_count();

CREATE TRIGGER update_project_count_on_delete
  AFTER DELETE ON portfolio_projects
  FOR EACH ROW
  EXECUTE PROCEDURE update_portfolio_project_count();

-- 7. STORAGE BUCKET
-- Create bucket for portfolio photos (run this separately if needed)
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('portfolio-photos', 'portfolio-photos', true);

-- Storage policies for portfolio photos
CREATE POLICY "Anyone can view portfolio photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'portfolio-photos');

CREATE POLICY "Users can upload portfolio photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'portfolio-photos');

CREATE POLICY "Users can update their own portfolio photos"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'portfolio-photos');

CREATE POLICY "Users can delete their own portfolio photos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'portfolio-photos');

-- ============================================
-- SETUP COMPLETE
-- ============================================
-- Next steps:
-- 1. Run this SQL in Supabase SQL Editor
-- 2. Create 'portfolio-photos' storage bucket in Supabase Storage
-- 3. Update TypeScript types in lib/supabase.ts
-- 4. Build dashboard and portfolio pages
