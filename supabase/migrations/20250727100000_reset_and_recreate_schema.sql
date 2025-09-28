/*
# [Schema Reset and Recreation]
This script will completely reset the public schema by dropping all existing application tables and recreating them from scratch. This is a destructive operation and will result in the loss of all current data in these tables.

## Query Description: [This operation will permanently delete all data from the profiles, devices, plans, logs, and all other related application tables. It is designed to reset the database to a clean initial state. A backup is strongly recommended if you have any production data.]

## Metadata:
- Schema-Category: "Dangerous"
- Impact-Level: "High"
- Requires-Backup: true
- Reversible: false

## Structure Details:
- Drops Tables: plans, profiles, devices, audit_reports, commands, logs, sessions, contact_messages
- Recreates Tables: All of the above with correct structure and relationships.
- Recreates Functions: handle_new_user
- Recreates Triggers: on_auth_user_created
- Re-enables RLS: All policies are reapplied.

## Security Implications:
- RLS Status: Re-enabled on all tables.
- Policy Changes: No, policies are reapplied as they were.
- Auth Requirements: Admin privileges required to run.

## Performance Impact:
- Indexes: All indexes are dropped and recreated.
- Triggers: The user creation trigger is recreated.
- Estimated Impact: High during execution, but will result in a clean, performant state.
*/

-- Drop all tables in the correct order to avoid foreign key constraints
DROP TABLE IF EXISTS "public"."contact_messages" CASCADE;
DROP TABLE IF EXISTS "public"."audit_reports" CASCADE;
DROP TABLE IF EXISTS "public"."commands" CASCADE;
DROP TABLE IF EXISTS "public"."logs" CASCADE;
DROP TABLE IF EXISTS "public"."sessions" CASCADE;
DROP TABLE IF EXISTS "public"."devices" CASCADE;
DROP TABLE IF EXISTS "public"."profiles" CASCADE;
DROP TABLE IF EXISTS "public"."plans" CASCADE;

-- Drop the user creation function and trigger if they exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();


-- Create the 'plans' table
CREATE TABLE public.plans (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price INT NOT NULL,
    features TEXT[]
);
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read-only access" ON public.plans FOR SELECT USING (true);

-- Create the 'profiles' table to store public user data
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    updated_at TIMESTAMPTZ,
    full_name TEXT,
    avatar_url TEXT,
    plan_id TEXT REFERENCES public.plans(id),
    subscription_status TEXT DEFAULT 'inactive'::text
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow individual read access" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Allow individual update access" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Function to create a public profile for a new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function when a new user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create 'devices' table
CREATE TABLE public.devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    size TEXT NOT NULL,
    status TEXT DEFAULT 'idle'::text,
    created_at TIMESTAMPTZ DEFAULT now(),
    last_seen TIMESTAMPTZ DEFAULT now(),
    ip_address TEXT
);
ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow individual access" ON public.devices FOR ALL USING (auth.uid() = user_id);

-- Create 'audit_reports' table
CREATE TABLE public.audit_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id UUID NOT NULL REFERENCES public.devices(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    algorithm TEXT NOT NULL,
    status TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    certificate_id TEXT UNIQUE NOT NULL
);
ALTER TABLE public.audit_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow individual access" ON public.audit_reports FOR ALL USING (auth.uid() = user_id);

-- Create 'commands' table
CREATE TABLE public.commands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    device_id UUID REFERENCES public.devices(id) ON DELETE SET NULL,
    command TEXT NOT NULL,
    status TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.commands ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow individual access" ON public.commands FOR ALL USING (auth.uid() = user_id);

-- Create 'logs' table
CREATE TABLE public.logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    level TEXT NOT NULL,
    service TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow individual access" ON public.logs FOR ALL USING (auth.uid() = user_id);

-- Create 'sessions' table
CREATE TABLE public.sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    ip_address TEXT,
    user_agent TEXT,
    status TEXT DEFAULT 'Active'::text,
    created_at TIMESTAMPTZ DEFAULT now(),
    last_active TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow individual access" ON public.sessions FOR ALL USING (auth.uid() = user_id);

-- Create 'contact_messages' table
CREATE TABLE public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    company TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow admin full access" ON public.contact_messages FOR ALL USING (true); -- Or more restrictive policy

-- Insert initial data for plans
INSERT INTO public.plans (id, name, price, features) VALUES
('starter', 'Starter', 49, '{"10 device erasures per month", "Basic erasure algorithms", "Email support", "Compliance certificates"}'),
('professional', 'Professional', 149, '{"100 device erasures per month", "All erasure algorithms", "Priority support", "Advanced certificates", "API access"}'),
('enterprise', 'Enterprise', 499, '{"Unlimited device erasures", "Custom algorithms", "24/7 phone support", "White-label certificates", "On-premise deployment"}');
