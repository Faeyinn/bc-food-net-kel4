# Supabase Setup Instructions (Users Table)

We have updated the authentication system to use a unified `users` table.

Follow these steps to update your Supabase database:

1.  **Configure Environment Variables:**

    - Ensure your `.env` file has the correct `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

2.  **Create Users Table:**

    - Go to the **SQL Editor** in your Supabase Dashboard.
    - Open the file `SUPABASE_USERS.sql` in your project (`d:\Jaeyi\Nextjs\bc-food-center\SUPABASE_USERS.sql`).
    - Copy the content and run it in the SQL Editor.
    - This will create the `users` table.

3.  **Seed Initial Data (Admin & Seller):**

    - After creating the table, you can seed the initial Admin and Seller accounts.
    - Open your browser and navigate to: `http://localhost:3000/api/seed`
    - You should see a JSON response: `{"message": "Seeding successful", ...}`
    - **Note:** The default password for these seeded accounts is `123456`.

4.  **Verify:**

    - Check the `users` table in Supabase. You should see the Admin, Seller, and Buyer accounts.
    - Try logging in with:
      - **Admin:** `admin@bcfood.com` / `123456`
      - **Seller 1:** `bungojayacafe@bcfood.com` / `123456`
      - **Seller 2:** `amperakaramuntiang@bcfood.com` / `123456`
      - **Seller 3:** `khanzacafe@bcfood.com` / `123456`
      - **Buyer:** `buyer@bcfood.com` / `123456`

5.  **New Registrations:**
    - Any new user registering via the website will be created as a "PEMBELI" (Buyer) in the `users` table.
