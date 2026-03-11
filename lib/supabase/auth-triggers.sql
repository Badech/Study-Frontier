-- ============================================================================
-- AUTH TRIGGERS
-- Sprint 03: Automatic profile creation on user signup
-- ============================================================================

-- Function to handle new user signup
-- Automatically creates a profile record when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, locale)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    COALESCE(NEW.raw_user_meta_data->>'locale', 'en')
  );
  
  -- If the role is 'student', also create a student record
  IF COALESCE(NEW.raw_user_meta_data->>'role', 'student') = 'student' THEN
    INSERT INTO public.students (
      id,
      nationality,
      prior_visa_refusal,
      is_active,
      current_stage
    ) VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'nationality', 'MA'),
      FALSE,
      TRUE,
      'assessment'
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger to call handle_new_user on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON FUNCTION public.handle_new_user() IS 
'Automatically creates profile and student records when a new user signs up. Reads metadata from Supabase auth signup.';
