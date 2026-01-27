/*
 * Supabase Security Advisory Fix Script
 * 
 * INSTRUCTIONS:
 * 1. Open your Supabase Dashboard.
 * 2. Go to the SQL Editor.
 * 3. Copy and paste the contents of this file into a new query.
 * 4. Run the query.
 */

-- ==============================================================================
-- 1. FIX: Insecure 'search_path' in SECURITY DEFINER functions
--
-- Security Definer functions run with the privileges of the user who created them.
-- If search_path is not set, a malicious user could potentially override objects
-- that the function relies on (e.g. creating a table named 'auth' in 'public').
-- This block iterates over all SECURITY DEFINER functions and sets search_path to 'public'.
-- ==============================================================================

DO $$
DECLARE
    func_record RECORD;
BEGIN
    FOR func_record IN 
        SELECT n.nspname as schema_name, p.proname as function_name, pg_get_function_identity_arguments(p.oid) as args
        FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE p.prosecdef -- Function is SECURITY DEFINER
          AND n.nspname NOT IN ('pg_catalog', 'information_schema') -- Skip system schemas
          -- Check if search_path is already set manually. 
          -- proconfig is an array of configuration strings (e.g. "search_path=public")
          AND (p.proconfig IS NULL OR NOT 'search_path=public' = ANY(p.proconfig))
    LOOP
        EXECUTE format('ALTER FUNCTION %I.%I(%s) SET search_path = public, pg_temp;', 
            func_record.schema_name, func_record.function_name, func_record.args);
        
        RAISE NOTICE 'Fixed search_path for function: %.%(%)', 
            func_record.schema_name, func_record.function_name, func_record.args;
    END LOOP;
END $$;

-- ==============================================================================
-- 2. CHECK: RLS Policies using 'user_metadata'
--
-- Using values from raw_user_meta_data in RLS policies can be insecure if users
-- can update their own metadata. It is recommended to use a separate 'profiles'
-- or 'users' table that is only writable by trusted processes/admins.
--
-- TO CHECK MANUALLY: 
-- Run the following query to see if any policies reference 'raw_user_meta_data':
-- ==============================================================================

/*
SELECT schemaname, tablename, policyname, cmd, qual, with_check 
FROM pg_policies 
WHERE qual::text LIKE '%raw_user_meta_data%' 
   OR with_check::text LIKE '%raw_user_meta_data%';
*/

-- ==============================================================================
-- 3. CHECK: Missing Indexes on Foreign Keys
--
-- Missing indexes on foreign keys can lead to performance issues and potential
-- locking problems during cascading updates/deletes.
-- Use the Supabase Dashboard "Database" -> "Index Advisor" or similar tools
-- to identify missing indexes.
-- ==============================================================================
