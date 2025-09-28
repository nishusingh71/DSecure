/*
  # [Migration] Fix Devices Schema and Add Seeding Function
  [This script corrects the `devices` table by adding missing columns and introduces a function to seed the database with sample data for a specific user.]

  ## Query Description: [This operation alters the `devices` table and adds a new SQL function. It is non-destructive to existing data in other tables but modifies the structure of the `devices` table. The `seed_data` function is safe to run and will only insert new data.]
  
  ## Metadata:
  - Schema-Category: ["Structural", "Data"]
  - Impact-Level: ["Medium"]
  - Requires-Backup: false
  - Reversible: true
  
  ## Structure Details:
  - `devices` table: Adds `ip_address` (TEXT) and `last_seen` (TIMESTAMPTZ) columns.
  - `seed_data` function: A new function to populate tables with sample data.
  
  ## Security Implications:
  - RLS Status: [Enabled]
  - Policy Changes: [No]
  - Auth Requirements: [None for schema change. The seed function requires a valid user ID.]
  
  ## Performance Impact:
  - Indexes: [None]
  - Triggers: [None]
  - Estimated Impact: [Low. Adds two columns to a table and creates a function.]
*/

-- Step 1: Add missing columns to the devices table
ALTER TABLE public.devices ADD COLUMN IF NOT EXISTS ip_address TEXT;
ALTER TABLE public.devices ADD COLUMN IF NOT EXISTS last_seen TIMESTAMPTZ DEFAULT now();

-- Step 2: Create a function to seed data for a given user
CREATE OR REPLACE FUNCTION seed_data(seed_user_id uuid)
RETURNS void AS $$
BEGIN
  -- Clear existing mock data for this user to avoid duplicates
  DELETE FROM devices WHERE user_id = seed_user_id;
  DELETE FROM audit_reports WHERE user_id = seed_user_id;
  DELETE FROM commands WHERE user_id = seed_user_id;
  DELETE FROM logs WHERE user_id = seed_user_id;
  DELETE FROM sessions WHERE user_id = seed_user_id;

  -- Seed devices
  INSERT INTO devices (id, user_id, name, type, size, status, ip_address, last_seen) VALUES
    (gen_random_uuid(), seed_user_id, 'Primary Server', 'server', '16TB RAID', 'Online', '192.168.1.10', now() - interval '5 minutes'),
    (gen_random_uuid(), seed_user_id, 'Marketing Workstation', 'hdd', '2TB', 'Offline', '10.0.5.23', now() - interval '2 hours'),
    (gen_random_uuid(), seed_user_id, 'CEO iPhone 15', 'mobile', '512GB', 'Online', '172.16.10.5', now() - interval '1 minute'),
    (gen_random_uuid(), seed_user_id, 'Dev Laptop (SSD)', 'ssd', '1TB', 'Wiping', '192.168.1.15', now() - interval '30 seconds');

  -- Seed audit reports
  INSERT INTO audit_reports (user_id, device_id, algorithm, status, certificate_id)
  SELECT seed_user_id, id, 'DoD 5220.22-M', 'Completed', 'CERT-' || substr(md5(random()::text), 0, 10)
  FROM devices WHERE user_id = seed_user_id AND status != 'Wiping' LIMIT 2;

  -- Seed commands
  INSERT INTO commands (user_id, device_id, command, status)
  SELECT seed_user_id, id, 'verify_wipe --level=full', 'Success'
  FROM devices WHERE user_id = seed_user_id LIMIT 1;
  INSERT INTO commands (user_id, device_id, command, status)
  SELECT seed_user_id, id, 'start_wipe --algorithm=nist-800', 'Pending'
  FROM devices WHERE user_id = seed_user_id AND status = 'Wiping' LIMIT 1;

  -- Seed logs
  INSERT INTO logs (user_id, level, service, message) VALUES
    (seed_user_id, 'INFO', 'auth', 'User authentication successful from 8.8.8.8'),
    (seed_user_id, 'WARN', 'api', 'API rate limit nearing for user'),
    (seed_user_id, 'INFO', 'erasure', 'Wipe process started for device ' || (SELECT id FROM devices WHERE user_id = seed_user_id AND status = 'Wiping' LIMIT 1)),
    (seed_user_id, 'ERROR', 'payment', 'Payment failed for subscription renewal. Reason: Insufficient funds.');

  -- Seed sessions
  INSERT INTO sessions (user_id, ip_address, user_agent, status) VALUES
    (seed_user_id, '101.102.103.104', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ...', 'Active'),
    (seed_user_id, '201.202.203.204', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) ...', 'Expired');
END;
$$ LANGUAGE plpgsql;
