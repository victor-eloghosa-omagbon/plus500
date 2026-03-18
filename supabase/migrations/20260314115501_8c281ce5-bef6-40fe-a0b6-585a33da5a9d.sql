
-- Site settings table (single row for global config)
CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_enabled boolean NOT NULL DEFAULT true,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read site settings (needed to check if site is disabled)
CREATE POLICY "Anyone can view site settings" ON public.site_settings
  FOR SELECT TO public USING (true);

-- Only admins can update
CREATE POLICY "Admins can update site settings" ON public.site_settings
  FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert initial row
INSERT INTO public.site_settings (site_enabled) VALUES (true);

-- Wallet addresses table
CREATE TABLE public.wallet_addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  crypto_name text NOT NULL,
  crypto_symbol text NOT NULL UNIQUE,
  wallet_address text NOT NULL DEFAULT '',
  network text NOT NULL DEFAULT '',
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.wallet_addresses ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can read wallet addresses (needed for deposit flow)
CREATE POLICY "Authenticated users can view wallet addresses" ON public.wallet_addresses
  FOR SELECT TO authenticated USING (true);

-- Only admins can manage
CREATE POLICY "Admins can update wallet addresses" ON public.wallet_addresses
  FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert wallet addresses" ON public.wallet_addresses
  FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete wallet addresses" ON public.wallet_addresses
  FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- Seed default wallet addresses
INSERT INTO public.wallet_addresses (crypto_name, crypto_symbol, wallet_address, network) VALUES
  ('Bitcoin', 'BTC', '', 'Bitcoin'),
  ('Ethereum', 'ETH', '', 'ERC-20'),
  ('XRP', 'XRP', '', 'XRP Ledger'),
  ('Tether', 'USDT', '', 'TRC-20'),
  ('Solana', 'SOL', '', 'Solana'),
  ('BNB', 'BNB', '', 'BEP-20'),
  ('TRON', 'TRX', '', 'TRC-20');
