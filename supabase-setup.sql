-- THB Operations Hub Database Setup
-- Run these commands in your Supabase SQL Editor

-- Create projects table
CREATE TABLE IF NOT EXISTS public.projects (
    id BIGINT PRIMARY KEY,
    client_name TEXT NOT NULL,
    client_email TEXT,
    client_phone TEXT,
    project_title TEXT NOT NULL,
    project_description TEXT,
    estimated_value DECIMAL(10,2) NOT NULL,
    deposit_amount DECIMAL(10,2),
    deposit_received BOOLEAN DEFAULT FALSE,
    final_payment_amount DECIMAL(10,2),
    final_payment_received BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'discovery',
    proposal_sent_date DATE,
    start_date DATE,
    completion_date DATE,
    notes TEXT,
    created_at DATE DEFAULT CURRENT_DATE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create prospects table
CREATE TABLE IF NOT EXISTS public.prospects (
    id BIGINT PRIMARY KEY,
    client_name TEXT NOT NULL,
    client_email TEXT,
    client_phone TEXT,
    project_title TEXT NOT NULL,
    project_description TEXT,
    estimated_value DECIMAL(10,2),
    status TEXT DEFAULT 'prospect',
    source TEXT DEFAULT 'pricing-tool',
    notes TEXT,
    pricing_breakdown JSONB,
    feasibility_analysis JSONB,
    created_at DATE DEFAULT CURRENT_DATE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create strategy_goals table
CREATE TABLE IF NOT EXISTS public.strategy_goals (
    id INTEGER PRIMARY KEY DEFAULT 1,
    revenue_target DECIMAL(10,2) DEFAULT 100000,
    selected_scenario TEXT DEFAULT 'balanced',
    capacity JSONB DEFAULT '{"weeklyHours": 40, "maxConcurrentProjects": 4}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prospects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.strategy_goals ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust as needed for your security requirements)
CREATE POLICY "Allow public access to projects" ON public.projects FOR ALL USING (true);
CREATE POLICY "Allow public access to prospects" ON public.prospects FOR ALL USING (true);
CREATE POLICY "Allow public access to strategy_goals" ON public.strategy_goals FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON public.projects(created_at);
CREATE INDEX IF NOT EXISTS idx_prospects_status ON public.prospects(status);
CREATE INDEX IF NOT EXISTS idx_prospects_created_at ON public.prospects(created_at);

-- Insert default strategy goals if none exist
INSERT INTO public.strategy_goals (id, revenue_target, selected_scenario, capacity)
VALUES (1, 100000, 'balanced', '{"weeklyHours": 40, "maxConcurrentProjects": 4}')
ON CONFLICT (id) DO NOTHING;
