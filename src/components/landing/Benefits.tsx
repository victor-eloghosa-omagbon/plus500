import { Check } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import benefitsImg from "@/assets/benefits-trading.png";

const features = [
  "Easy-to-Use Platform",
  "Demo Account with Real-Time Quotes",
  "Low Trading Commissions",
  "Fast Account Registration",
  "Advanced Risk Management",
  "Multi-Device Trading",
];

const Benefits = () => {
  const ref = useScrollReveal();

  return (
    <section className="py-20 lg:py-28 bg-surface" ref={ref}>
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="flex justify-center">
            <img
              src={benefitsImg}
              alt="Trading interface showing portfolio balance and asset allocation"
              className="w-full max-w-md rounded-xl shadow-xl"
            />
          </div>
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
              Why Choose FutureTrade?
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Our platform combines powerful features with an intuitive experience for traders of all levels.
            </p>
            <ul className="space-y-4">
              {features.map((f) => (
                <li key={f} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full gradient-brand flex items-center justify-center flex-shrink-0">
                    <Check size={14} className="text-primary-foreground" />
                  </div>
                  <span className="text-foreground font-medium">{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
