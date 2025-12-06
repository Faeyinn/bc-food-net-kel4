-- Add is_open column to users table
ALTER TABLE public.users 
ADD COLUMN is_open boolean DEFAULT true;
