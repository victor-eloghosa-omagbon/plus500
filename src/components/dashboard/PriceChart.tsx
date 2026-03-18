import { useEffect, useRef } from "react";
import { createChart, type IChartApi, ColorType, CandlestickSeries } from "lightweight-charts";

interface PriceChartProps {
  symbol: string;
  basePrice: number;
  change: number;
}

function generateCandlestickData(basePrice: number, change: number) {
  const data = [];
  const now = new Date();
  let price = basePrice * (1 - Math.abs(change) / 100 * 3);

  for (let i = 90; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];

    const volatility = basePrice * 0.015;
    const trend = (change / 100) * (basePrice / 90);
    const open = price + (Math.random() - 0.45) * volatility;
    const close = open + trend + (Math.random() - 0.48) * volatility;
    const high = Math.max(open, close) + Math.random() * volatility * 0.5;
    const low = Math.min(open, close) - Math.random() * volatility * 0.5;

    data.push({ time: dateStr, open, high, low, close });
    price = close;
  }
  return data;
}

const PriceChart = ({ symbol, basePrice, change }: PriceChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#64748b",
        fontFamily: "Inter, system-ui, sans-serif",
      },
      grid: {
        vertLines: { color: "rgba(100, 116, 139, 0.08)" },
        horzLines: { color: "rgba(100, 116, 139, 0.08)" },
      },
      width: containerRef.current.clientWidth,
      height: 360,
      rightPriceScale: { borderColor: "rgba(100, 116, 139, 0.15)" },
      timeScale: { borderColor: "rgba(100, 116, 139, 0.15)" },
      crosshair: {
        vertLine: { color: "rgba(10, 31, 102, 0.3)" },
        horzLine: { color: "rgba(10, 31, 102, 0.3)" },
      },
    });

    const series = chart.addSeries(CandlestickSeries, {
      upColor: "#22c55e",
      downColor: "#ef4444",
      borderDownColor: "#ef4444",
      borderUpColor: "#22c55e",
      wickDownColor: "#ef4444",
      wickUpColor: "#22c55e",
    });

    series.setData(generateCandlestickData(basePrice, change) as any);
    chart.timeScale().fitContent();
    chartRef.current = chart;

    const handleResize = () => {
      if (containerRef.current) chart.applyOptions({ width: containerRef.current.clientWidth });
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [symbol, basePrice, change]);

  return <div ref={containerRef} className="w-full" />;
};

export default PriceChart;
