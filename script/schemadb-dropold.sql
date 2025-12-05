-- ===========================================
-- DROP TABLES (berurutan agar tidak error FK)
-- ===========================================

DROP TABLE IF EXISTS antrian_order CASCADE;
DROP TABLE IF EXISTS transaksi CASCADE;
DROP TABLE IF EXISTS sesi_pemesanan CASCADE;
DROP TABLE IF EXISTS meja CASCADE;
DROP TABLE IF EXISTS item CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ===========================================
-- CREATE NEW TABLES (versi final & bersih)
-- ===========================================

-- TABEL USERS
CREATE TABLE public.users (
  id_user uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email varchar NOT NULL UNIQUE,
  password varchar NOT NULL,
  role varchar NOT NULL CHECK (role IN ('ADMIN','PENJUAL','PEMBELI')),
  nama varchar NOT NULL,
  no_hp varchar,
  created_at timestamp DEFAULT now(),
  jenis_toko varchar
);

-- TABEL ITEM
CREATE TABLE public.item (
  id_item varchar PRIMARY KEY,
  nama_item varchar NOT NULL,
  harga_item numeric(12,2) NOT NULL,
  id_toko uuid REFERENCES public.users(id_user),
  image varchar
);

-- TABEL MEJA
CREATE TABLE public.meja (
  no_meja varchar PRIMARY KEY,
  status_meja varchar CHECK (status_meja IN ('KOSONG','TERISI'))
);

-- TABEL SESI PEMESANAN
CREATE TABLE public.sesi_pemesanan (
  id_sesi varchar PRIMARY KEY,
  no_meja varchar REFERENCES public.meja(no_meja),
  id_pelanggan uuid REFERENCES public.users(id_user),
  tanggal_pemesanan timestamp DEFAULT now(),
  status_sesi varchar CHECK (status_sesi IN ('AKTIF','SELESAI'))
);

-- TABEL TRANSAKSI
CREATE TABLE public.transaksi (
  id_transaksi varchar PRIMARY KEY,
  id_sesi varchar REFERENCES public.sesi_pemesanan(id_sesi),
  id_toko uuid REFERENCES public.users(id_user),
  jenis_transaksi varchar CHECK (jenis_transaksi IN ('TUNAI','NON-TUNAI')),
  total_harga numeric(12,2),
  status_pesanan varchar CHECK (
    status_pesanan IN ('MENUNGGU','DITERIMA','DIPROSES','SIAP','SELESAI')
  ),
  tanggal_transaksi timestamp DEFAULT now()
);

-- TABEL ANTRIAN ORDER
CREATE TABLE public.antrian_order (
  order_line varchar PRIMARY KEY,
  id_transaksi varchar REFERENCES public.transaksi(id_transaksi),
  id_item varchar REFERENCES public.item(id_item),
  jumlah_item int NOT NULL,
  subtotal numeric(12,2) NOT NULL,
  catatan text
);
