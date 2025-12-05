# Supabase Schema Update Instructions

The menu seeding failed because the database tables were still configured for the old schema (referencing `toko` table instead of the new `users` table).

**Please follow these steps to fix the database schema:**

1.  **Run Update Script:**

    - Go to the **SQL Editor** in your Supabase Dashboard.
    - Open the file `SUPABASE_UPDATE_SCHEMA.sql` in your project.
    - Copy the content and run it.
    - This will update the `item`, `transaksi`, and `sesi_pemesanan` tables to reference the `users` table correctly.

2.  **Re-Run Seeding:**

    - After running the SQL, visit `http://localhost:3000/api/seed` in your browser again.
    - This time, the menu items should be inserted successfully.

3.  **Verify:**
    - The JSON response should now show the items in the `items` array.
    - Check the `item` table in Supabase to confirm the data is there.
