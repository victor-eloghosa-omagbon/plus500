import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

// CoinGecko ID mapping for crypto assets
const COINGECKO_IDS: Record<string, string> = {
  "BTC/USD": "bitcoin",
  "ETH/USD": "ethereum",
  "SOL/USD": "solana",
  "XRP/USD": "ripple",
  "BNB/USD": "binancecoin",
  "DOGE/USD": "dogecoin",
  "ADA/USD": "cardano",
  "AVAX/USD": "avalanche-2",
  "DOT/USD": "polkadot",
  "MATIC/USD": "matic-network",
  "LINK/USD": "chainlink",
  "LTC/USD": "litecoin",
};

// Static fallback prices for non-crypto assets
const STATIC_PRICES: Record<string, { price: number; change: number }> = {
  "EUR/USD": { price: 1.0872, change: 0.12 },
  "GBP/USD": { price: 1.2645, change: -0.08 },
  "USD/JPY": { price: 154.32, change: 0.24 },
  "AUD/USD": { price: 0.6534, change: -0.15 },
  "USD/CAD": { price: 1.3645, change: 0.09 },
  "USD/CHF": { price: 0.8823, change: -0.11 },
  "NZD/USD": { price: 0.6102, change: 0.07 },
  "EUR/GBP": { price: 0.8598, change: -0.05 },
  "AAPL": { price: 189.45, change: 0.67 },
  "TSLA": { price: 245.80, change: -2.34 },
  "NVDA": { price: 875.30, change: 4.56 },
  "AMZN": { price: 178.92, change: 1.23 },
  "MSFT": { price: 415.20, change: 0.45 },
  "GOOGL": { price: 155.80, change: 0.92 },
  "META": { price: 485.60, change: 1.78 },
  "XAU/USD": { price: 2348.90, change: 0.45 },
  "XAG/USD": { price: 28.32, change: -0.18 },
  "CL": { price: 78.45, change: -0.62 },
  "NG": { price: 2.134, change: 1.89 },
  "US500": { price: 5234.50, change: 0.34 },
  "US30": { price: 39456.80, change: 0.21 },
  "NAS100": { price: 18342.60, change: 0.89 },
  "UK100": { price: 8234.50, change: -0.12 },
  "ZW": { price: 564.25, change: 1.12 },
  "ZC": { price: 442.50, change: -0.34 },
  "HG": { price: 4.28, change: 0.91 },
};

export interface PriceData {
  price: number;
  change: number;
}

interface PriceContextType {
  prices: Record<string, PriceData>;
  getPrice: (symbol: string) => number;
  getChange: (symbol: string) => number;
  loading: boolean;
}

const PriceContext = createContext<PriceContextType | undefined>(undefined);

// Apply small random micro-fluctuation to a price (±0.01-0.05%)
function applyMicroFluctuation(price: number): number {
  const fluctuation = (Math.random() - 0.5) * 0.001; // ±0.05%
  return Math.round(price * (1 + fluctuation) * 10000) / 10000;
}

export const PriceProvider = ({ children }: { children: ReactNode }) => {
  const [prices, setPrices] = useState<Record<string, PriceData>>(() => {
    const initial: Record<string, PriceData> = {};
    // Initialize with static prices
    for (const [symbol, data] of Object.entries(STATIC_PRICES)) {
      initial[symbol] = { ...data };
    }
    // Default crypto prices as fallback
    initial["BTC/USD"] = { price: 67842.50, change: 3.24 };
    initial["ETH/USD"] = { price: 3521.80, change: 1.87 };
    initial["SOL/USD"] = { price: 148.25, change: 5.12 };
    initial["XRP/USD"] = { price: 0.5234, change: -1.23 };
    return initial;
  });
  const [loading, setLoading] = useState(true);

  // On mount, fetch all market_instruments from DB and ensure we have prices for every symbol
  useEffect(() => {
    const ensureAllInstrumentPrices = async () => {
      try {
        const { data } = await supabase
          .from("market_instruments")
          .select("symbol")
          .eq("is_active", true);

        if (data) {
          setPrices((prev) => {
            const updated = { ...prev };
            for (const row of data) {
              if (!updated[row.symbol]) {
                // Assign a reasonable default price based on symbol patterns
                let defaultPrice = 100;
                if (row.symbol.includes("/USD") && !row.symbol.startsWith("X")) defaultPrice = 1.0 + Math.random();
                else if (row.symbol.startsWith("XAU")) defaultPrice = 2300 + Math.random() * 50;
                else if (row.symbol.startsWith("XAG")) defaultPrice = 28 + Math.random() * 2;
                updated[row.symbol] = { price: defaultPrice, change: Math.round((Math.random() - 0.5) * 400) / 100 };
              }
            }
            return updated;
          });
        }
      } catch (err) {
        console.warn("Failed to sync market_instruments prices:", err);
      }
    };
    ensureAllInstrumentPrices();
  }, []);

  const fetchCryptoPrices = useCallback(async () => {
    try {
      const ids = Object.values(COINGECKO_IDS).join(",");
      const res = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`
      );

      if (!res.ok) {
        console.warn("CoinGecko API returned", res.status);
        return;
      }

      const data = await res.json();

      setPrices((prev) => {
        const updated = { ...prev };
        for (const [symbol, geckoId] of Object.entries(COINGECKO_IDS)) {
          const coinData = data[geckoId];
          if (coinData) {
            updated[symbol] = {
              price: coinData.usd,
              change: coinData.usd_24h_change ? parseFloat(coinData.usd_24h_change.toFixed(2)) : prev[symbol]?.change ?? 0,
            };
          }
        }
        return updated;
      });
    } catch (err) {
      console.warn("Failed to fetch CoinGecko prices:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Apply micro-fluctuations to non-crypto assets every 60s so UI looks alive
  const applyFluctuations = useCallback(() => {
    setPrices((prev) => {
      const updated = { ...prev };
      for (const symbol of Object.keys(updated)) {
        if (!COINGECKO_IDS[symbol]) {
          const oldPrice = updated[symbol].price;
          const newPrice = applyMicroFluctuation(oldPrice);
          const pctChange = ((newPrice - oldPrice) / oldPrice) * 100;
          updated[symbol] = {
            price: newPrice,
            change: Math.round((updated[symbol].change + pctChange) * 100) / 100,
          };
        }
      }
      return updated;
    });
  }, []);

  useEffect(() => {
    fetchCryptoPrices();
    const cryptoInterval = setInterval(fetchCryptoPrices, 60000);
    const fluctuationInterval = setInterval(applyFluctuations, 60000);
    return () => {
      clearInterval(cryptoInterval);
      clearInterval(fluctuationInterval);
    };
  }, [fetchCryptoPrices, applyFluctuations]);

  const getPrice = useCallback(
    (symbol: string) => prices[symbol]?.price ?? 0,
    [prices]
  );

  const getChange = useCallback(
    (symbol: string) => prices[symbol]?.change ?? 0,
    [prices]
  );

  return (
    <PriceContext.Provider value={{ prices, getPrice, getChange, loading }}>
      {children}
    </PriceContext.Provider>
  );
};

export const usePrices = () => {
  const ctx = useContext(PriceContext);
  if (!ctx) throw new Error("usePrices must be used within PriceProvider");
  return ctx;
};
