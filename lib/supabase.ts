import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions for our database tables
export type Application = {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  phone: string;
  resume_url: string | null;
  job_id: string;
  job_title: string;
  company: string;
  job_link: string | null;
  nabcep_certified: boolean;
  nccer_certified: boolean;
  osha_certified: boolean;
  other_certifications: string | null;
  status: 'pending' | 'reviewing' | 'contacted' | 'hired' | 'rejected';
  notes: string | null;
  source: string;
};

export type WorkerProfile = {
  id: string;
  created_at: string;
  updated_at: string;
  email: string;
  full_name: string;
  phone: string;
  resume_url: string | null;
  nabcep_certified: boolean;
  nccer_certified: boolean;
  osha_certified: boolean;
  other_certifications: string | null;
  applications_count: number;
  last_applied_at: string | null;
};

export type CrewRequest = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  company: string | null;
  location: string;
  project_date: string;
  crew_size: number;
  project_type: string;
  description: string | null;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes: string | null;
};
