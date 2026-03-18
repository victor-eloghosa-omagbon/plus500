import { Shield, Lock, HeadphonesIcon, Building2 } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const items = [
  { icon: Building2, title: "Regulated Broker", desc: "Licensed and regulated by top-tier financial authorities worldwide." },
  { icon: Shield, title: "Secure Client Funds", desc: "Client funds held in segregated accounts at leading financial institutions." },
  { icon: Lock, title: "Advanced Encryption", desc: "Bank-level SSL encryption and two-factor authentication for all accounts." },
  { icon: HeadphonesIcon, title: "Professional Support", desc: "Dedicated customer support team available 24/5 via live chat and email." },
];

const Security = () => {
  const ref = useScrollReveal();

  return (
    <section className="py-20 lg:py-28 bg-surface" ref={ref}>
      <div className="container">
        <div className="text-center mb-14">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Security & Regulation
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Trade with confidence knowing your account is protected by industry-leading security.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="text-center p-6">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                <Icon size={24} className="text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-foreground mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Security;
