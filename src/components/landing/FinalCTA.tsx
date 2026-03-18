import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const FinalCTA = () => {
  const ref = useScrollReveal();

  return (
    <section className="py-20 lg:py-28" ref={ref}>
      <div className="container">
        <div className="rounded-2xl gradient-brand p-12 lg:p-20 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-primary-foreground mb-4">
            Start Trading Futures Today
          </h2>
          <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8">
            Join millions of traders worldwide. Open your account in minutes and start trading with a free demo.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="secondary" className="px-8 font-semibold">
              Open Account
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-8 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
            >
              Try Free Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
