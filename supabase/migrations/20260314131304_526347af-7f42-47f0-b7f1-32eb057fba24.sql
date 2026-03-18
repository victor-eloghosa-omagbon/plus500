ALTER TABLE public.profiles ADD COLUMN phone_number text DEFAULT NULL;
ALTER TABLE public.profiles ADD COLUMN two_fa_enabled boolean NOT NULL DEFAULT false;