import type { Asset } from "./AssetCard";

// Default prices used as fallback before CoinGecko data loads
export const ASSETS: Asset[] = [
  { id: "btc", name: "Bitcoin", symbol: "BTC/USD", price: 67842.50, change: 3.24, icon: "₿", category: "Crypto" },
  { id: "eth", name: "Ethereum", symbol: "ETH/USD", price: 3521.80, change: 1.87, icon: "⟠", category: "Crypto" },
  { id: "oil", name: "Crude Oil", symbol: "CL", price: 78.45, change: -0.62, icon: "🛢️", category: "Energy" },
  { id: "gold", name: "Gold", symbol: "XAU/USD", price: 2348.90, change: 0.45, icon: "🥇", category: "Metals" },
  { id: "silver", name: "Silver", symbol: "XAG/USD", price: 28.32, change: -0.18, icon: "🥈", category: "Metals" },
  { id: "wheat", name: "Wheat", symbol: "ZW", price: 564.25, change: 1.12, icon: "🌾", category: "Agriculture" },
  { id: "corn", name: "Corn", symbol: "ZC", price: 442.50, change: -0.34, icon: "🌽", category: "Agriculture" },
  { id: "copper", name: "Copper", symbol: "HG", price: 4.28, change: 0.91, icon: "🔶", category: "Metals" },
];
