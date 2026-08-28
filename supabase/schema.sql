-- ==============================================================================
-- SVCE Placement Hub: Supabase PostgreSQL Schema & Migration
-- Run this in your Supabase SQL Editor to set up the backend tables.
-- ==============================================================================

-- 1. Create Companies Table
CREATE TABLE IF NOT EXISTS public.companies (
    company_id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    short_name TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Enterprise',
    company_type TEXT NOT NULL DEFAULT 'Dream', -- 'Super Dream' | 'Dream' | 'Standard' | 'Regular'
    short_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    full_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    skill_levels JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- 3. Create Public Read Access Policy (No authentication required to view placement research)
CREATE POLICY "Allow public read access on companies"
ON public.companies
FOR SELECT
TO public
USING (true);

-- 4. Create Policy for Authenticated Admin Modifications (if auth is added later)
CREATE POLICY "Allow authenticated users full access"
ON public.companies
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 5. Create Performance Indexes
CREATE INDEX IF NOT EXISTS idx_companies_type ON public.companies(company_type);
CREATE INDEX IF NOT EXISTS idx_companies_name ON public.companies(name);

-- 6. Optional Seed Data: Accenture (Real Verified Recruiter Profile)
INSERT INTO public.companies (
    company_id,
    name,
    short_name,
    category,
    company_type,
    short_json,
    full_json,
    skill_levels
) VALUES (
    1,
    'Accenture plc',
    'Accenture',
    'Enterprise Tech Consulting',
    'Dream',
    '{
      "name": "Accenture plc",
      "short_name": "Accenture",
      "logo_url": "https://www.accenture.com/_acnmedia/Accenture/Dev/RedesigNAcc_Logo_Black.svg",
      "category": "Enterprise Tech Consulting",
      "company_type": "Dream",
      "incorporation_year": 1989,
      "employee_size": "740,000+ employees",
      "headquarters_address": "Dublin, Ireland",
      "operating_countries": "United States; United Kingdom; India; Germany; France; Japan; Australia; Canada; Brazil; Singapore",
      "office_locations": "New York, USA; London, UK; Bangalore, India; Chennai, India; Paris, France; Tokyo, Japan; Sydney, Australia",
      "yoy_growth_rate": "3%",
      "website_url": "https://www.accenture.com"
    }'::jsonb,
    '{
      "name": "Accenture plc",
      "short_name": "Accenture",
      "category": "Global Technology Consulting",
      "incorporation_year": 1989,
      "nature_of_company": "Public (NYSE: ACN)",
      "overview_text": "Accenture is a global professional services company providing strategy, consulting, digital, technology, and operations services across 120+ countries.",
      "headquarters_address": "Dublin, Ireland",
      "ceo_name": "Julie Sweet",
      "tech_stack": "Java; Python; React; Angular; AWS; Azure; GCP; SAP S/4HANA; Salesforce; Kubernetes",
      "annual_revenue": "$64.1B (FY2024)",
      "annual_profit": "$7.2B Net Income",
      "employee_size": "740,000+ employees",
      "website_url": "https://www.accenture.com",
      "glassdoor_rating": "4.1/5",
      "yoy_growth_rate": "3%"
    }'::jsonb,
    '[
      {"skill_set_id": 1, "skill_set_name": "Data Structures & Algorithms", "required_level": 8, "required_proficiency": "Expert"},
      {"skill_set_id": 2, "skill_set_name": "Object-Oriented Programming (Java/Python)", "required_level": 8, "required_proficiency": "Advanced"},
      {"skill_set_id": 3, "skill_set_name": "SQL & Relational Databases", "required_level": 7, "required_proficiency": "Advanced"},
      {"skill_set_id": 4, "skill_set_name": "Cloud Fundamentals (AWS / Azure)", "required_level": 7, "required_proficiency": "Advanced"},
      {"skill_set_id": 7, "skill_set_name": "Aptitude, Verbal & Logical Reasoning", "required_level": 8, "required_proficiency": "Advanced"},
      {"skill_set_id": 8, "skill_set_name": "Business Communication", "required_level": 8, "required_proficiency": "Advanced"}
    ]'::jsonb
) ON CONFLICT (company_id) DO NOTHING;
