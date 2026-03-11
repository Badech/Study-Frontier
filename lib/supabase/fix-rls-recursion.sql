-- ============================================================================
-- FIX: RLS Infinite Recursion Issue
-- Sprint 04: Fix policies that reference the same table they're protecting
-- ============================================================================

-- Drop the problematic policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can manage profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can view all students" ON students;
DROP POLICY IF EXISTS "Admins can manage students" ON students;

-- Create a helper function to check user role without recursion
-- This function uses SECURITY DEFINER to bypass RLS
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT role FROM public.profiles WHERE id = user_id LIMIT 1;
$$;

-- Now recreate the policies using the helper function

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
ON profiles
FOR SELECT
TO authenticated
USING (
  public.get_user_role(auth.uid()) IN ('admin', 'counselor')
);

-- Admins can manage all profiles
CREATE POLICY "Admins can manage profiles"
ON profiles
FOR ALL
TO authenticated
USING (
  public.get_user_role(auth.uid()) = 'admin'
);

-- Admins can view all students
CREATE POLICY "Admins can view all students"
ON students
FOR SELECT
TO authenticated
USING (
  public.get_user_role(auth.uid()) IN ('admin', 'counselor')
);

-- Admins can manage all students
CREATE POLICY "Admins can manage students"
ON students
FOR ALL
TO authenticated
USING (
  public.get_user_role(auth.uid()) = 'admin'
);

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.get_user_role(UUID) TO authenticated;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON FUNCTION public.get_user_role(UUID) IS 
'Helper function to get user role without triggering RLS recursion. Uses SECURITY DEFINER to bypass RLS policies.';
