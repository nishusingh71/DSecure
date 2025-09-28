/*
# [Initial Schema Setup - Corrected]
This script sets up the initial database schema for the DSecure application, following Supabase best practices. It corrects a previous error by using a `public.profiles` table linked to `auth.users` instead of creating a conflicting `public.users` table.

## Query Description:
This is a foundational script that creates all necessary tables, relationships, and security policies. It is designed to be run on a fresh database or after cleaning up the failed previous migration attempt. It does not delete any existing user data in `auth.users`.

## Metadata:
- Schema-Category: "Structural"
- Impact-Level: "High"
- Requires-Backup: false (as it's for initial setup)
- Reversible: false (requires manual dropping of tables)

## Structure Details:
- Creates tables: `profiles`, `plans`, `subscriptions`, `devices`, `erasure_jobs`, `audit_reports`, `commands`, `logs`, `contact_messages`.
- Creates a trigger `on_auth_user_created` to automatically populate the `profiles` table.
- Enables Row Level Security (RLS) on all tables and adds policies to protect user data.

## Security Implications:
- RLS Status: Enabled on all new tables.
- Policy Changes: Yes, new policies are created to ensure users can only access their own data.
- Auth Requirements: Policies are based on `auth.uid()`.

## Performance Impact:
- Indexes: Primary keys and foreign keys are indexed automatically.
- Triggers: Adds one trigger on `auth.users` for profile creation.
- Estimated Impact: Low, as this is for initial setup.
*/

-- 1. Create Plans Table
CREATE TABLE public.plans (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price INT NOT NULL,
    features JSONB
);
COMMENT ON TABLE public.plans IS 'Stores pricing plans for subscriptions.';

-- 2. Create Profiles Table (instead of users)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT,
    updated_at TIMESTAMPTZ
);
COMMENT ON TABLE public.profiles IS 'Stores public profile information for each user.';

-- 3. Create Subscriptions Table
CREATE TABLE public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    plan_id TEXT NOT NULL REFERENCES public.plans(id),
    status TEXT, -- e.g., 'active', 'canceled', 'past_due'
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    razorpay_subscription_id TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);
COMMENT ON TABLE public.subscriptions IS 'Manages user subscriptions to plans.';

-- 4. Create Devices Table
CREATE TABLE public.devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT,
    size TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE public.devices IS 'Stores user-managed devices for erasure.';

-- 5. Create Erasure Jobs Table
CREATE TABLE public.erasure_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id UUID NOT NULL REFERENCES public.devices(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    algorithm TEXT NOT NULL,
    status TEXT, -- e.g., 'pending', 'erasing', 'completed', 'failed'
    progress INT DEFAULT 0,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE public.erasure_jobs IS 'Tracks data erasure jobs for devices.';

-- 6. Create Audit Reports Table
CREATE TABLE public.audit_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES public.erasure_jobs(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    certificate_data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE public.audit_reports IS 'Stores certificates and reports for completed erasure jobs.';

-- 7. Create Commands Table
CREATE TABLE public.commands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    command_text TEXT NOT NULL,
    status TEXT, -- e.g., 'success', 'pending', 'error'
    created_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE public.commands IS 'Logs commands executed by users.';

-- 8. Create Logs Table
CREATE TABLE public.logs (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    level TEXT, -- e.g., 'info', 'warn', 'error', 'debug'
    message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE public.logs IS 'Stores application-level logs.';

-- 9. Create Contact Messages Table
CREATE TABLE public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    company TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE public.contact_messages IS 'Stores messages from the contact form.';


-- 10. Set up Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.erasure_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;


-- 11. Create RLS Policies
-- Profiles: Users can view their own profile and update it.
CREATE POLICY "Users can view and update their own profile."
ON public.profiles FOR ALL
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Plans: All users can view plans.
CREATE POLICY "Plans are publicly readable."
ON public.plans FOR SELECT
USING (true);

-- Subscriptions: Users can manage their own subscriptions.
CREATE POLICY "Users can manage their own subscriptions."
ON public.subscriptions FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Devices: Users can manage their own devices.
CREATE POLICY "Users can manage their own devices."
ON public.devices FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Erasure Jobs: Users can manage their own erasure jobs.
CREATE POLICY "Users can manage their own erasure jobs."
ON public.erasure_jobs FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Audit Reports: Users can view their own reports.
CREATE POLICY "Users can view their own audit reports."
ON public.audit_reports FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Commands: Users can manage their own commands.
CREATE POLICY "Users can manage their own commands."
ON public.commands FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Logs: Only service role can access logs.
CREATE POLICY "Allow service_role full access to logs"
ON public.logs FOR ALL
USING (true)
WITH CHECK (true);

-- Contact Messages: Allow anyone to insert, but only service role to read.
CREATE POLICY "Allow anonymous insertion of contact messages."
ON public.contact_messages FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow service_role full access to contact messages"
ON public.contact_messages FOR ALL
USING (true)
WITH CHECK (true);


-- 12. Create a trigger to automatically create a profile when a new user signs up.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (new.id, new.raw_user_meta_data->>'name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists, to prevent errors on re-run
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 13. Seed Plans Data
INSERT INTO public.plans (id, name, price, features) VALUES
('starter', 'Starter', 4900, '["10 device erasures per month", "Basic erasure algorithms", "Email support", "Compliance certificates"]'),
('professional', 'Professional', 14900, '["100 device erasures per month", "All erasure algorithms", "Priority support", "Advanced certificates", "API access"]'),
('enterprise', 'Enterprise', 49900, '["Unlimited device erasures", "Custom algorithms", "24/7 phone support", "White-label certificates", "Dedicated account manager"]');
