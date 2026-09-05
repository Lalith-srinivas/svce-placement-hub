-- ==============================================================================
-- SVCE Placement Hub: Student Profile Module Schema & Migration
-- Run this in your Supabase SQL Editor to set up the student profile tables,
-- relationships, Row Level Security (RLS) policies, and storage bucket.
-- ==============================================================================

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    register_number TEXT NOT NULL UNIQUE,
    college_email TEXT NOT NULL,
    personal_email TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    branch TEXT NOT NULL,
    year TEXT NOT NULL,
    section TEXT NOT NULL,
    cgpa NUMERIC(4,2) NOT NULL CHECK (cgpa >= 0.0 AND cgpa <= 10.0),
    active_backlogs INTEGER NOT NULL DEFAULT 0 CHECK (active_backlogs >= 0),
    github_url TEXT,
    linkedin_url TEXT,
    portfolio_url TEXT,
    leetcode_url TEXT,
    hackerrank_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Student Skills Table (Categorized & 1-10 Proficiency)
CREATE TABLE IF NOT EXISTS public.student_skills (
    id BIGSERIAL PRIMARY KEY,
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    skill_name TEXT NOT NULL,
    proficiency INTEGER NOT NULL CHECK (proficiency >= 1 AND proficiency <= 10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT uq_student_skill UNIQUE (profile_id, skill_name)
);

-- 3. Projects Table (Unlimited Projects)
CREATE TABLE IF NOT EXISTS public.projects (
    id BIGSERIAL PRIMARY KEY,
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    tech_stack JSONB NOT NULL DEFAULT '[]'::jsonb,
    github_url TEXT,
    demo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Certifications Table
CREATE TABLE IF NOT EXISTS public.certifications (
    id BIGSERIAL PRIMARY KEY,
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    organization TEXT NOT NULL,
    year TEXT NOT NULL,
    credential_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Placement Preferences Table
CREATE TABLE IF NOT EXISTS public.preferences (
    id BIGSERIAL PRIMARY KEY,
    profile_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    preferred_role TEXT NOT NULL,
    dream_companies JSONB NOT NULL DEFAULT '[]'::jsonb,
    preferred_locations JSONB NOT NULL DEFAULT '[]'::jsonb,
    expected_package TEXT NOT NULL,
    willing_to_relocate BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Resume Table
CREATE TABLE IF NOT EXISTS public.resume (
    id BIGSERIAL PRIMARY KEY,
    profile_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Indexes for Query Performance & Lookups
CREATE INDEX IF NOT EXISTS idx_profiles_reg_no ON public.profiles(register_number);
CREATE INDEX IF NOT EXISTS idx_profiles_branch ON public.profiles(branch);
CREATE INDEX IF NOT EXISTS idx_student_skills_profile ON public.student_skills(profile_id);
CREATE INDEX IF NOT EXISTS idx_projects_profile ON public.projects(profile_id);
CREATE INDEX IF NOT EXISTS idx_certifications_profile ON public.certifications(profile_id);
CREATE INDEX IF NOT EXISTS idx_preferences_profile ON public.preferences(profile_id);
CREATE INDEX IF NOT EXISTS idx_resume_profile ON public.resume(profile_id);

-- 8. Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public can view profiles for Student Matrix"
ON public.profiles FOR SELECT TO public USING (true);

CREATE POLICY "Users can manage their own profile"
ON public.profiles FOR ALL TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Skills Policies
CREATE POLICY "Public can view student skills"
ON public.student_skills FOR SELECT TO public USING (true);

CREATE POLICY "Users can manage their own skills"
ON public.student_skills FOR ALL TO authenticated
USING (auth.uid() = profile_id)
WITH CHECK (auth.uid() = profile_id);

-- Projects Policies
CREATE POLICY "Public can view student projects"
ON public.projects FOR SELECT TO public USING (true);

CREATE POLICY "Users can manage their own projects"
ON public.projects FOR ALL TO authenticated
USING (auth.uid() = profile_id)
WITH CHECK (auth.uid() = profile_id);

-- Certifications Policies
CREATE POLICY "Public can view student certifications"
ON public.certifications FOR SELECT TO public USING (true);

CREATE POLICY "Users can manage their own certifications"
ON public.certifications FOR ALL TO authenticated
USING (auth.uid() = profile_id)
WITH CHECK (auth.uid() = profile_id);

-- Preferences Policies
CREATE POLICY "Public can view student preferences"
ON public.preferences FOR SELECT TO public USING (true);

CREATE POLICY "Users can manage their own preferences"
ON public.preferences FOR ALL TO authenticated
USING (auth.uid() = profile_id)
WITH CHECK (auth.uid() = profile_id);

-- Resume Policies
CREATE POLICY "Public can view resume records"
ON public.resume FOR SELECT TO public USING (true);

CREATE POLICY "Users can manage their own resume record"
ON public.resume FOR ALL TO authenticated
USING (auth.uid() = profile_id)
WITH CHECK (auth.uid() = profile_id);

-- 9. Storage Bucket Setup
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'resumes',
    'resumes',
    true,
    10485760, -- 10MB limit
    ARRAY['application/pdf']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 10485760,
    allowed_mime_types = ARRAY['application/pdf'];

-- Storage RLS Policies
CREATE POLICY "Allow public read of resumes"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'resumes');

CREATE POLICY "Allow authenticated users to upload their resume"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
    bucket_id = 'resumes' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Allow authenticated users to update their resume"
ON storage.objects FOR UPDATE TO authenticated
USING (
    bucket_id = 'resumes' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Allow authenticated users to delete their resume"
ON storage.objects FOR DELETE TO authenticated
USING (
    bucket_id = 'resumes' AND
    (storage.foldername(name))[1] = auth.uid()::text
);
