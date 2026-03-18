import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroPhone from "@/assets/hero-phone-upload.webp";
import laurelWreath from "@/assets/laurel-wreath.svg";

const Hero = () => (
  <section className="relative min-h-[700px] lg:min-h-[750px] hero-bg overflow-hidden">
    {/* Floating 3D plus signs */}
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
      <span className="hero-plus text-[90px] -left-2 top-[12%]" style={{ transform: "rotate(-12deg) perspective(200px) rotateY(25deg)" }}>+</span>
      <span className="hero-plus text-[60px] left-[8%] top-[50%]" style={{ transform: "rotate(10deg) perspective(200px) rotateX(20deg)" }}>+</span>
      <span className="hero-plus text-[45px] left-[4%] bottom-[15%]" style={{ transform: "rotate(-22deg) perspective(200px) rotateY(-30deg)" }}>+</span>
      <span className="hero-plus text-[35px] right-[13%] top-[8%]" style={{ transform: "rotate(18deg) perspective(200px) rotateY(35deg) rotateX(15deg)" }}>+</span>
      <span className="hero-plus text-[70px] right-[22%] bottom-[10%]" style={{ transform: "rotate(-8deg) perspective(200px) rotateX(-25deg)" }}>+</span>
      <span className="hero-plus text-[50px] left-[28%] top-[6%]" style={{ transform: "rotate(25deg) perspective(200px) rotateY(-20deg) rotateX(10deg)" }}>+</span>
      <span className="hero-plus text-[40px] right-[4%] top-[42%]" style={{ transform: "rotate(-15deg) perspective(200px) rotateY(40deg)" }}>+</span>
    </div>

    <div className="container relative z-10 pt-[68px] lg:pt-[130px] pb-16">
      <div className="grid lg:grid-cols-2 lg:gap-4 items-center">
        {/* Phone mockup - shown first on mobile */}
        <div className="flex justify-center lg:hidden mb-[-2rem]">
          <img
            src={heroPhone}
            alt="Plus500 trading app showing live charts and market instruments"
            className="w-full max-w-xs drop-shadow-2xl"
          />
        </div>
        {/* Left */}
        <div className="relative z-10 flex flex-col items-center lg:items-start text-center lg:text-left gap-5">
          <h1 className="text-[1.65rem] sm:text-5xl lg:text-[3.5rem] font-extrabold leading-[1.1] text-primary-foreground tracking-tight">
            Volatility fuels markets
            <br />
            <span className="text-brand-accent font-light lg:font-extrabold">Ride the Oil & Gold</span>
            <br className="lg:hidden" />
            <span className="text-brand-accent font-light lg:font-extrabold"> wave</span>
          </h1>
          <p className="hidden lg:block text-lg lg:text-xl text-primary-foreground/70 max-w-md">
            Trade Futures & Prediction Markets in one app.
          </p>

          {/* Buttons */}
          <div className="flex flex-col lg:flex-row flex-wrap justify-center lg:justify-start gap-4 pt-2 w-full">
            <Button
              asChild
              size="lg"
              className="bg-brand-accent text-primary-foreground hover:bg-brand-accent/90 font-bold text-base w-full max-w-none lg:w-auto lg:px-10 py-7 rounded-lg"
            >
              <Link to="/auth">Start Trading Now</Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-primary-foreground text-brand-accent hover:bg-primary-foreground/90 font-bold text-base w-full max-w-none lg:w-auto lg:px-10 py-7 rounded-lg"
            >
              <Link to="/auth">Try free demo</Link>
            </Button>
          </div>

          {/* Feature badges */}
          <div className="hidden lg:flex flex-wrap items-center gap-4 pt-4 text-primary-foreground font-semibold text-sm">
            <span>Free Live Charts</span>
            <span className="w-px h-4 bg-primary-foreground/30" />
            <span>No Platform Fees</span>
            <span className="w-px h-4 bg-primary-foreground/30" />
            <span>Advanced Technology</span>
          </div>

          {/* Trust badges */}
          <div className="flex flex-col min-[420px]:flex-row items-center justify-center lg:justify-start gap-10 pt-6">
            {/* Award badge with laurel wreath */}
            <div className="flex items-center gap-0">
              <img src={laurelWreath} alt="" className="h-16 w-auto" />
              <div className="text-primary-foreground text-center -mx-1">
                <div className="text-2xl font-normal leading-tight">2025</div>
                <div className="text-xs font-bold leading-tight">Best Futures Broker</div>
                <div className="text-[11px] opacity-60 mt-0.5">FX Empire</div>
              </div>
              <img src={laurelWreath} alt="" className="h-16 w-auto" style={{ transform: 'scaleX(-1)' }} />
            </div>

            {/* Trustpilot */}
            <div className="flex flex-col items-start gap-0.5">
              <div className="flex items-center gap-1.5 text-primary-foreground">
                <Star size={22} className="text-trust-green fill-trust-green" />
                <span className="text-base font-semibold tracking-wide">Trustpilot</span>
              </div>
              <div className="flex items-center gap-2 text-primary-foreground">
                <span className="text-4xl font-extrabold">4.2</span>
                <div className="flex flex-col gap-0.5">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4].map((i) => (
                      <Star key={i} size={14} className="text-trust-green fill-trust-green" />
                    ))}
                    <Star size={14} className="text-trust-green fill-trust-green opacity-40" />
                  </div>
                  <div className="text-xs opacity-60">Reviews +18K</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right - Phone mockup (desktop only) */}
        <div className="hidden lg:flex justify-end">
          <img
            src={heroPhone}
            alt="Plus500 trading app showing live charts and market instruments"
            className="w-full max-w-md drop-shadow-2xl"
          />
        </div>
      </div>
    </div>
  </section>
);

export default Hero;
