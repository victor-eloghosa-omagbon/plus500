import { cn } from "@/lib/utils";

export interface Asset {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change: number;
  icon: string;
  category: string;
}

interface AssetCardProps {
  asset: Asset;
  selected: boolean;
  onSelect: (asset: Asset) => void;
}

const AssetCard = ({ asset, selected, onSelect }: AssetCardProps) => {
  const isPositive = asset.change >= 0;

  return (
    <button
      onClick={() => onSelect(asset)}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left",
        selected
          ? "bg-brand-accent/10 border border-brand-accent/30 shadow-md shadow-brand-accent/5"
          : "bg-background hover:bg-muted border border-border"
      )}
    >
      <span className="text-2xl">{asset.icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">{asset.name}</p>
        <p className="text-xs text-muted-foreground">{asset.symbol}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold text-foreground">
          ${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
        <p className={cn("text-xs font-medium", isPositive ? "text-profit-green" : "text-loss-red")}>
          {isPositive ? "+" : ""}{asset.change.toFixed(2)}%
        </p>
      </div>
    </button>
  );
};

export default AssetCard;
