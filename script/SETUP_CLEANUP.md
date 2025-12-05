# Supabase Cleanup Instructions

To finalize the database integration and remove the disconnected tables (`toko` and `pelanggan`), follow these steps:

1.  **Run Cleanup Script:**

    - Go to the **SQL Editor** in your Supabase Dashboard.
    - Open the file `SUPABASE_CLEANUP.sql` in your project.
    - Copy the content and run it.
    - This will:
      - Add a `jenis_toko` column to the `users` table.
      - Delete the obsolete `toko` and `pelanggan` tables.

2.  **Re-Run Seeding:**

    - Visit `http://localhost:3000/api/seed` in your browser.
    - This will update the sellers in the `users` table with their `jenis_toko` (e.g., "Cafe", "Ampera").

3.  **Result:**
    - Your database will now be clean, with all data centralized in the `users` table and linked correctly to `item`, `transaksi`, etc.
