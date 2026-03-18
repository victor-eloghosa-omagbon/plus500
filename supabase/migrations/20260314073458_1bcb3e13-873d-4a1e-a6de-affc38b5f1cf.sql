
-- Add entry_price to orders so P/L can be calculated deterministically
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS entry_price numeric DEFAULT NULL;

-- Add balance to profiles (starting at 10000)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS balance numeric NOT NULL DEFAULT 10000;

-- Backfill existing orders with approximate entry prices from live data
UPDATE public.orders SET entry_price = CASE
  WHEN symbol = 'BTC/USD' THEN 67842.50
  WHEN symbol = 'ETH/USD' THEN 3521.80
  WHEN symbol = 'XAU/USD' THEN 2348.90
  WHEN symbol = 'XAG/USD' THEN 28.32
  WHEN symbol = 'CL' THEN 78.45
  WHEN symbol = 'NVDA' THEN 875.30
  WHEN symbol = 'AAPL' THEN 189.45
  WHEN symbol = 'TSLA' THEN 245.80
  ELSE 100
END WHERE entry_price IS NULL;
