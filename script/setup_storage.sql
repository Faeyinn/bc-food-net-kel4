-- ============================================================================
-- SCRIPT: Setup Storage (Bucket & Policies)
-- PURPOSE: Create 'menu-items' bucket and allow public access.
-- ============================================================================

-- 1. Create the bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('menu-items', 'menu-items', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Enable RLS on objects (standard Supabase practice)
-- ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Create Policy to Allow ALL access to this bucket
-- (Since we use custom auth, we just open this bucket)

DROP POLICY IF EXISTS "Public Access Menu Items" ON storage.objects;

CREATE POLICY "Public Access Menu Items"
ON storage.objects FOR ALL
USING ( bucket_id = 'menu-items' )
WITH CHECK ( bucket_id = 'menu-items' );

-- 4. Double check RLS on storage.buckets? (Usually not needed for public buckets)
-- But ensuring we can read buckets info
DROP POLICY IF EXISTS "Public Bucket Access" ON storage.buckets;
CREATE POLICY "Public Bucket Access"
ON storage.buckets FOR SELECT
USING ( true );
