/*
  # Add consultation_type column to appointments

  This migration adds a consultation_type column to the appointments table
  to replace the existing 'reason' column with standardized consultation types.
*/

-- Add consultation_type column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'appointments' AND column_name = 'consultation_type'
  ) THEN
    ALTER TABLE appointments ADD COLUMN consultation_type text DEFAULT 'General Consultation';
  END IF;
END $$;

-- Create clinic_settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS clinic_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key text UNIQUE NOT NULL,
  setting_value jsonb NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on clinic_settings
ALTER TABLE clinic_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DO $$
BEGIN
  DROP POLICY IF EXISTS "Admins can view settings" ON clinic_settings;
  DROP POLICY IF EXISTS "Admins can update settings" ON clinic_settings;
  DROP POLICY IF EXISTS "Admins can insert settings" ON clinic_settings;
END $$;

-- Policies for clinic_settings table
CREATE POLICY "Admins can view settings"
  ON clinic_settings
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can update settings"
  ON clinic_settings
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can insert settings"
  ON clinic_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Insert default clinic settings
INSERT INTO clinic_settings (setting_key, setting_value)
VALUES 
  ('consultation_types', '["General Consultation", "Follow-up", "Specialist Consultation", "Emergency"]'::jsonb),
  ('operating_hours', '{"start": "09:00", "end": "17:00", "slot_duration": 30}'::jsonb),
  ('working_days', '[1, 2, 3, 4, 5]'::jsonb)
ON CONFLICT (setting_key) DO NOTHING;