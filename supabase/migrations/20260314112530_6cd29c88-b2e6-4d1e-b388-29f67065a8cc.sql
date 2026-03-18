-- Create storage bucket for KYC documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('kyc-documents', 'kyc-documents', false);

-- Allow authenticated users to upload their own KYC documents
CREATE POLICY "Users can upload own kyc docs"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'kyc-documents' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow authenticated users to view their own KYC documents
CREATE POLICY "Users can view own kyc docs"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'kyc-documents' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Add kyc columns to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS kyc_status text NOT NULL DEFAULT 'not_submitted',
ADD COLUMN IF NOT EXISTS kyc_document_url text;