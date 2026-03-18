import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useState, useEffect, useRef, useCallback } from "react";

const statSets = [
  [
    { value: "33+", unit: "Million", label: "Registered Customers" },
    { value: "300+", unit: "Million", label: "Positions Opened" },
  ],
  [
    { value: "$800+", unit: "Billion", label: "Traded Value" },
    { value: "2800*", unit: "", label: "Instruments" },
  ],
  [
    { value: "60+", unit: "", label: "Countries" },
    { value: "33+", unit: "Million", label: "Registered Customers" },
  ],
];

const StatItem = ({ value, unit, label }: { value: string; unit: string; label: string }) => (
  <div className="text-center">
    <p className="text-4xl lg:text-5xl font-bold text-[#0c2780]">
      {value}{" "}
      {unit && <span className="font-normal text-3xl lg:text-4xl">{unit}</span>}
    </p>
    <p className="text-[#0c2780] text-base lg:text-lg mt-2">{label}</p>
  </div>
);

const CustomerStats = () => {
  const ref = useScrollReveal();
  const [displaySet, setDisplaySet] = useState(0);
  const [animClass, setAnimClass] = useState("");
  const pendingNext = useRef<number | null>(null);

  const getNextIndex = useCallback((current: number) => {
    let next: number;
    do {
      next = Math.floor(Math.random() * statSets.length);
    } while (next === current);
    return next;
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const next = getNextIndex(displaySet);
      pendingNext.current = next;
      setAnimClass("stat-slide-out");
    }, 3000);
    return () => clearInterval(interval);
  }, [displaySet, getNextIndex]);

  const handleAnimEnd = () => {
    if (animClass === "stat-slide-out" && pendingNext.current !== null) {
      setDisplaySet(pendingNext.current);
      pendingNext.current = null;
      setAnimClass("stat-slide-in");
    } else if (animClass === "stat-slide-in") {
      setAnimClass("");
    }
  };

  const stats = statSets[displaySet];

  return (
    <section className="relative py-20 lg:py-28 bg-primary-foreground overflow-hidden" ref={ref}>
      <style>{`
        @keyframes statSlideOut {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(-16px); }
        }
        @keyframes statSlideIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .stat-slide-out { animation: statSlideOut 0.35s ease-in forwards; }
        .stat-slide-in { animation: statSlideIn 0.35s ease-out forwards; }
      `}</style>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-4 top-[10%] w-28 h-28 border-2 border-[#0c2780]/15 -rotate-12" />
        <div className="absolute left-[8%] top-[5%] w-20 h-20 border-2 border-[#0c2780]/15 rotate-6" />
        <svg className="absolute -left-2 bottom-[25%] w-16 h-16 opacity-30" viewBox="0 0 40 40" fill="none">
          <rect x="15" y="5" width="10" height="30" rx="2" stroke="#0c2780" strokeWidth="2" />
          <rect x="5" y="15" width="30" height="10" rx="2" stroke="#0c2780" strokeWidth="2" />
        </svg>
      </div>

      <div className="container relative z-10">
        <h2 className="text-2xl lg:text-3xl font-semibold text-[#0c2780] text-center max-w-2xl mx-auto mb-12">
          Over 33 million customers worldwide have already chosen Plus500.
        </h2>

        <div className="relative max-w-4xl mx-auto">
          <div className="absolute -bottom-4 left-4 lg:-top-4 lg:bottom-auto lg:left-auto lg:right-0 z-20">
            <span className="bg-[#0c2780] text-primary-foreground text-sm font-medium px-6 py-2 rounded-full">
              Worldwide
            </span>
          </div>

          <div
            className="rounded-2xl border border-[#0c2780]/10 bg-primary-foreground p-12 lg:p-20 overflow-hidden"
            style={{
              boxShadow: "0 8px 32px -4px rgba(12, 39, 128, 0.12), 0 2px 8px -2px rgba(12, 39, 128, 0.08)",
              transform: "perspective(800px) rotateX(1deg)",
            }}
          >
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 gap-8 ${animClass}`}
              onAnimationEnd={handleAnimEnd}
            >
              {stats.map((stat, i) => (
                <StatItem key={`${displaySet}-${i}`} {...stat} />
              ))}
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-10 max-w-3xl mx-auto leading-relaxed">
          * Instrument availability is subject to jurisdiction. Futures trading by U.S. market participants occurs through Plus500US Financial Services LLC, a registered futures commission merchant.
        </p>
      </div>
    </section>
  );
};

export default CustomerStats;
