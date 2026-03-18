import { BarChart3, Layers, Settings, Eye, Shield } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import platformImg from "@/assets/platform-mockup.png";

const features = [
  { icon: BarChart3, text: "Live charts with multiple timeframes" },
  { icon: Layers, text: "Market depth and order book" },
  { icon: Settings, text: "Advanced order management" },
  { icon: Eye, text: "Custom watchlists" },
  { icon: Shield, text: "Built-in risk controls" },
];

const PlatformShowcase = () => {
  const ref = useScrollReveal();

  return (
    <section id="platform" className="py-20 lg:py-28 bg-surface" ref={ref}>
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
              Powerful Trading Platform
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Execute trades with precision using our professional-grade platform, designed for speed and reliability.
            </p>
            <ul className="space-y-4">
              {features.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3">
                  <Icon size={18} className="text-primary flex-shrink-0" />
                  <span className="text-foreground">{text}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex justify-center">
            <img
              src={platformImg}
              alt="Professional trading platform with charts and market depth"
              className="w-full max-w-lg rounded-xl shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlatformShowcase;
