-- ===========================================
-- TABLE: activity_logs
-- ===========================================
CREATE TABLE public.activity_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  action varchar NOT NULL, -- e.g., 'DELETE_USER', 'ADD_MENU', 'DELETE_MENU'
  details text, -- e.g., 'Menghapus user Budi', 'Menambahkan menu Nasi Goreng di Toko A'
  created_at timestamp DEFAULT now()
);
