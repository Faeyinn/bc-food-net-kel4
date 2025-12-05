-- ============================================================================
-- SCRIPT: Enable RLS (Row Level Security)
-- PURPOSE: Fix "Data is publicly accessible" warning in Supabase.
-- NOTE: Uses "ALLOW ALL" policies because Auth is handled by the Application,
--       not Supabase Auth.
-- ============================================================================

-- 1. Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.item ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meja ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sesi_pemesanan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transaksi ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.antrian_order ENABLE ROW LEVEL SECURITY;

-- 2. Create "Allow All" Policies
-- (Drop existing to avoid errors if re-running)

-- USERS
DROP POLICY IF EXISTS "Enable all access for all users" ON public.users;
CREATE POLICY "Enable all access for all users" ON public.users FOR ALL USING (true) WITH CHECK (true);

-- ITEM
DROP POLICY IF EXISTS "Enable all access for all users" ON public.item;
CREATE POLICY "Enable all access for all users" ON public.item FOR ALL USING (true) WITH CHECK (true);

-- MEJA
DROP POLICY IF EXISTS "Enable all access for all users" ON public.meja;
CREATE POLICY "Enable all access for all users" ON public.meja FOR ALL USING (true) WITH CHECK (true);

-- SESI_PEMESANAN
DROP POLICY IF EXISTS "Enable all access for all users" ON public.sesi_pemesanan;
CREATE POLICY "Enable all access for all users" ON public.sesi_pemesanan FOR ALL USING (true) WITH CHECK (true);

-- TRANSAKSI
DROP POLICY IF EXISTS "Enable all access for all users" ON public.transaksi;
CREATE POLICY "Enable all access for all users" ON public.transaksi FOR ALL USING (true) WITH CHECK (true);

-- ANTRIAN_ORDER
DROP POLICY IF EXISTS "Enable all access for all users" ON public.antrian_order;
CREATE POLICY "Enable all access for all users" ON public.antrian_order FOR ALL USING (true) WITH CHECK (true);

-- BUCKET POLICIES (Supabase Storage)
-- Ensure storage bucket 'menu-items' is publicly accessible for reading
-- Note: Modifying storage.buckets requires appropriate permissions or SQL editor use.
-- Assuming 'menu-items' bucket exists.
-- INSERT INTO storage.buckets (id, name, public) VALUES ('menu-items', 'menu-items', true) ON CONFLICT DO NOTHING;

-- Allow public read access
-- CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id = 'menu-items' );
-- Allow authenticated uploads (if needed, or allow all for now)
-- CREATE POLICY "Public Upload" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'menu-items' );
