-- Script to update schema to use the unified 'users' table

-- 1. Update 'item' table
-- Drop old foreign key
ALTER TABLE item DROP CONSTRAINT IF EXISTS item_id_toko_fkey;
-- Clear table to avoid type conversion errors (assuming it's test data)
DELETE FROM item;
-- Change column type to UUID to match users.id_user
ALTER TABLE item ALTER COLUMN id_toko TYPE UUID USING id_toko::uuid;
-- Add new foreign key referencing users
ALTER TABLE item ADD CONSTRAINT item_id_toko_fkey FOREIGN KEY (id_toko) REFERENCES users(id_user) ON DELETE CASCADE;

-- 2. Update 'transaksi' table
ALTER TABLE transaksi DROP CONSTRAINT IF EXISTS transaksi_id_toko_fkey;
DELETE FROM transaksi;
ALTER TABLE transaksi ALTER COLUMN id_toko TYPE UUID USING id_toko::uuid;
ALTER TABLE transaksi ADD CONSTRAINT transaksi_id_toko_fkey FOREIGN KEY (id_toko) REFERENCES users(id_user) ON DELETE RESTRICT;

-- 3. Update 'sesi_pemesanan' table
ALTER TABLE sesi_pemesanan DROP CONSTRAINT IF EXISTS sesi_pemesanan_id_pelanggan_fkey;
DELETE FROM sesi_pemesanan;
ALTER TABLE sesi_pemesanan ALTER COLUMN id_pelanggan TYPE UUID USING id_pelanggan::uuid;
ALTER TABLE sesi_pemesanan ADD CONSTRAINT sesi_pemesanan_id_pelanggan_fkey FOREIGN KEY (id_pelanggan) REFERENCES users(id_user) ON DELETE RESTRICT;
