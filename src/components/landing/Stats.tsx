import { useScrollReveal } from "@/hooks/useScrollReveal";

const stats = [
  { value: "32M+", label: "Customers" },
  { value: "$800B+", label: "Trading Volume" },
  { value: "2800+", label: "Instruments" },
  { value: "60+", label: "Countries" },
];

const Stats = () => {
  const ref = useScrollReveal();

  return (
    <section className="py-16 lg:py-20 bg-background" ref={ref}>
      <div className="container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold gradient-brand-text mb-2">
                {value}
              </div>
              <div className="text-sm text-muted-foreground font-medium">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
