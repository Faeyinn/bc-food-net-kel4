# Supabase Setup Instructions (API Key Method)

Since you preferred using Supabase API Keys and encountered connection issues with Prisma, we have switched the integration to use the Supabase Client (`@supabase/supabase-js`).

Follow these steps to complete the setup:

1.  **Get your API Credentials:**

    - Go to your Supabase Project Dashboard.
    - Navigate to **Project Settings** -> **API**.
    - Find the **Project URL** and **anon public** key.

2.  **Configure Environment Variables:**

    - Open your `.env` file (`d:\Jaeyi\Nextjs\bc-food-center\.env`).
    - Add (or update) the following variables:

    ```env
    NEXT_PUBLIC_SUPABASE_URL="https://your-project-ref.supabase.co"
    NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
    ```

3.  **Create Tables (IMPORTANT):**

    - Since we are not using Prisma Migrations anymore, you need to create the tables manually in Supabase.
    - Go to the **SQL Editor** in your Supabase Dashboard.
    - Open the file `SUPABASE_SCHEMA.sql` in your project (`d:\Jaeyi\Nextjs\bc-food-center\SUPABASE_SCHEMA.sql`).
    - Copy the entire content of `SUPABASE_SCHEMA.sql`.
    - Paste it into the Supabase SQL Editor and click **Run**.

4.  **Verify:**
    - After running the SQL, check the **Table Editor** in Supabase to confirm that tables like `toko`, `pelanggan`, etc., have been created.
    - You can now register and login using the application!

## Why this approach?

This method uses the Supabase Data API over HTTP (HTTPS), which avoids the port 5432 connection issues you faced. It is the standard way to interact with Supabase in frontend/full-stack web applications.
