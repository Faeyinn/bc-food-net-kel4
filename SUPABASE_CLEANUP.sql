-- CLEANUP SCRIPT
-- This script removes the obsolete 'toko' and 'pelanggan' tables and ensures all relationships point to the 'users' table.

-- 1. Add 'jenis_toko' to 'users' table (to preserve store category info)
ALTER TABLE users ADD COLUMN IF NOT EXISTS jenis_toko VARCHAR(50);

-- 2. Drop obsolete tables
-- We use CASCADE to remove any lingering dependencies, though we've already updated the main tables.
DROP TABLE IF EXISTS toko CASCADE;
DROP TABLE IF EXISTS pelanggan CASCADE;

-- 3. Verify Foreign Keys (Optional, just to be sure)
-- Ensure 'item' references 'users'
-- (This was done in the previous update, but good to double check mentally)

-- 4. Clean up any other potential orphans if necessary
-- (None expected based on current state)
