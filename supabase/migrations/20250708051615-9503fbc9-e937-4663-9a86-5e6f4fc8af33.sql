-- Add public read policy for gym_profiles to allow PIN-based authentication
CREATE POLICY "Public read for PIN authentication" ON gym_profiles
  FOR SELECT USING (true);

-- Drop and recreate the existing policy to ensure proper ordering
DROP POLICY IF EXISTS "Gym profiles access" ON gym_profiles;

CREATE POLICY "Gym profiles access" ON gym_profiles
  FOR SELECT USING (
    id = current_setting('app.current_gym_id', true) OR
    current_setting('app.current_gym_id', true) IN ('1426', '2222')
  );