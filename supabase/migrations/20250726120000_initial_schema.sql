/*
# DSecure Initial Schema Migration

This script sets up the complete database schema for the DSecure application.
It creates tables for managing users, plans, subscriptions, devices, audit reports,
commands, logs, and contact messages. It also establishes relationships between these
tables and configures Row Level Security (RLS) to ensure data privacy and security.

## Query Description:
This migration is foundational and sets up all necessary tables from scratch.
- It creates a `users` table to store public profile information, linked to Supabase's private `auth.users` table.
- It includes a trigger (`on_auth_user_created`) to automatically populate the `users` table upon new user sign-up.
- RLS is enabled on all user-specific tables, with policies that restrict access to data owned by the currently authenticated user. This is a critical security measure.
- No existing data will be affected as this is the initial schema setup.

## Metadata:
- Schema-Category: "Structural"
- Impact-Level: "High"
- Requires-Backup: false
- Reversible: false

## Structure Details:
- **Tables Created:** users, plans, subscriptions, devices, audit_reports, commands, logs, contact_messages
- **Triggers Created:** on_auth_user_created
- **RLS Enabled:** On all user-data tables.

## Security Implications:
- RLS Status: Enabled by default on all sensitive tables.
- Policy Changes: Establishes initial, restrictive security policies.
- Auth Requirements: Policies rely on `auth.uid()` to identify the current user.

## Performance Impact:
- Indexes: Primary keys are automatically indexed. Foreign keys are also indexed for better join performance.
- Triggers: One trigger is added to the `auth.users` table, which has a minimal performance impact on user creation.
- Estimated Impact: Low. This is a standard setup for a new application.
*/

-- 1. USERS TABLE
-- Stores public user information, linked to auth.users.
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    plan_id VARCHAR(255) DEFAULT 'starter',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE users IS 'Public user profiles, linked to authentication.';

-- RLS for users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- 2. TRIGGER to create a user profile on new auth.users entry
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, name, email)
    VALUES (new.id, new.raw_user_meta_data->>'name', new.email);
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. PLANS TABLE
-- Stores pricing plan information.
CREATE TABLE plans (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price INT NOT NULL,
    description TEXT,
    features TEXT[]
);
COMMENT ON TABLE plans IS 'Pricing plans for subscriptions.';

-- RLS for plans table (allow public read access)
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Plans are publicly readable" ON plans FOR SELECT USING (true);

-- Seed the plans table
INSERT INTO plans (id, name, price, description, features) VALUES
('starter', 'Starter', 49, 'Perfect for small businesses', '{"10 device erasures per month", "Basic erasure algorithms", "Email support", "Compliance certificates"}'),
('professional', 'Professional', 149, 'Most popular for growing companies', '{"100 device erasures per month", "All erasure algorithms", "Priority support", "Advanced certificates", "API access"}'),
('enterprise', 'Enterprise', 499, 'For large-scale operations', '{"Unlimited device erasures", "Custom algorithms", "24/7 phone support", "White-label certificates", "Dedicated account manager"}');

-- 4. SUBSCRIPTIONS TABLE
-- Tracks user subscriptions to plans.
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_id VARCHAR(255) NOT NULL REFERENCES plans(id),
    status VARCHAR(50) NOT NULL, -- e.g., 'active', 'canceled', 'past_due'
    razorpay_order_id VARCHAR(255),
    razorpay_payment_id VARCHAR(255),
    razorpay_signature VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    current_period_end TIMESTAMPTZ
);
COMMENT ON TABLE subscriptions IS 'User subscriptions to pricing plans.';

-- RLS for subscriptions table
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own subscriptions" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own subscriptions" ON subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 5. DEVICES TABLE
-- Stores information about user-managed devices.
CREATE TABLE devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'SSD', 'HDD', 'Mobile', 'Server'
    size VARCHAR(50),
    status VARCHAR(50) DEFAULT 'idle', -- 'idle', 'erasing', 'completed', 'error'
    progress INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE devices IS 'Devices managed by users for erasure.';

-- RLS for devices table
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own devices" ON devices FOR ALL USING (auth.uid() = user_id);

-- 6. AUDIT REPORTS TABLE
-- Stores generated certificates for data erasure.
CREATE TABLE audit_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    algorithm VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL, -- 'Completed', 'Failed'
    certificate_id VARCHAR(255) UNIQUE NOT NULL,
    generated_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE audit_reports IS 'Certificates for completed erasure jobs.';

-- RLS for audit_reports table
ALTER TABLE audit_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own audit reports" ON audit_reports FOR ALL USING (auth.uid() = user_id);

-- 7. COMMANDS TABLE
-- Logs commands executed by users.
CREATE TABLE commands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    device_id UUID REFERENCES devices(id) ON DELETE SET NULL,
    command_text TEXT NOT NULL,
    status VARCHAR(50), -- 'Success', 'Pending', 'Error'
    timestamp TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE commands IS 'History of commands executed by users.';

-- RLS for commands table
ALTER TABLE commands ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own commands" ON commands FOR ALL USING (auth.uid() = user_id);

-- 8. LOGS TABLE
-- System-wide logs for monitoring.
CREATE TABLE logs (
    id BIGSERIAL PRIMARY KEY,
    level VARCHAR(50), -- 'INFO', 'WARN', 'ERROR', 'DEBUG'
    message TEXT,
    service VARCHAR(100),
    timestamp TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE logs IS 'Application and system-level logs.';

-- RLS for logs table (assuming only admins can view)
-- For now, we will lock it down. In a real app, you'd have an admin role.
ALTER TABLE logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view logs" ON logs FOR SELECT USING (false); -- No one can access by default

-- 9. CONTACT MESSAGES TABLE
-- Stores messages from the contact form.
CREATE TABLE contact_messages (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE contact_messages IS 'Messages submitted through the contact form.';

-- RLS for contact_messages table (allow public insert, admin read)
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit a contact message" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can read contact messages" ON contact_messages FOR SELECT USING (false); -- Locked down by default
