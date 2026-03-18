
CREATE TABLE public.market_instruments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol text NOT NULL UNIQUE,
  name text NOT NULL,
  category text NOT NULL DEFAULT 'Crypto',
  spread text NOT NULL DEFAULT '0',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.market_instruments ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can view active instruments
CREATE POLICY "Authenticated users can view active instruments"
  ON public.market_instruments FOR SELECT
  TO authenticated
  USING (true);

-- Admins can manage instruments
CREATE POLICY "Admins can insert instruments"
  ON public.market_instruments FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update instruments"
  ON public.market_instruments FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete instruments"
  ON public.market_instruments FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'));

-- Seed with existing instruments
INSERT INTO public.market_instruments (symbol, name, category, spread) VALUES
  ('EUR/USD', 'Euro / US Dollar', 'Forex', '0.6'),
  ('GBP/USD', 'British Pound / US Dollar', 'Forex', '0.9'),
  ('USD/JPY', 'US Dollar / Japanese Yen', 'Forex', '0.7'),
  ('AUD/USD', 'Australian Dollar / US Dollar', 'Forex', '0.8'),
  ('BTC/USD', 'Bitcoin', 'Crypto', '35'),
  ('ETH/USD', 'Ethereum', 'Crypto', '2.5'),
  ('SOL/USD', 'Solana', 'Crypto', '0.8'),
  ('XRP/USD', 'Ripple', 'Crypto', '0.003'),
  ('AAPL', 'Apple Inc.', 'Stocks', '0.12'),
  ('TSLA', 'Tesla Inc.', 'Stocks', '0.25'),
  ('NVDA', 'NVIDIA Corp.', 'Stocks', '0.45'),
  ('AMZN', 'Amazon.com Inc.', 'Stocks', '0.15'),
  ('XAU/USD', 'Gold', 'Commodities', '0.35'),
  ('XAG/USD', 'Silver', 'Commodities', '0.03'),
  ('CL', 'Crude Oil', 'Commodities', '0.04'),
  ('NG', 'Natural Gas', 'Commodities', '0.005'),
  ('US500', 'S&P 500', 'Indices', '0.4'),
  ('US30', 'Dow Jones 30', 'Indices', '1.5'),
  ('NAS100', 'Nasdaq 100', 'Indices', '0.8'),
  ('UK100', 'FTSE 100', 'Indices', '0.6');
