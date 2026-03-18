import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Button } from "@/components/ui/button";
import educationTrader from "@/assets/education-trader.jpg";

const GraduationCapIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 204.1 135.4" className="w-28 h-28 mx-auto">
    <defs>
      <linearGradient id="capGrad1" gradientUnits="userSpaceOnUse" x1="103.372" y1="13.245" x2="104.642" y2="79.255" gradientTransform="matrix(1 0 0 -1 0 138)">
        <stop offset="0" stopColor="#fff"/><stop offset="1" stopColor="#11afff"/>
      </linearGradient>
      <linearGradient id="capGrad2" gradientUnits="userSpaceOnUse" x1="104.292" y1="44.935" x2="104.292" y2="127.095" gradientTransform="matrix(1 0 0 -1 0 138)">
        <stop offset="0" stopColor="#fff"/><stop offset="1" stopColor="#11afff"/>
      </linearGradient>
    </defs>
    <path fill="#11afff" d="M17 44.6H7v43.7h10V44.6zM17 94.6H7v24.1h10V94.6z"/>
    <path fill="#11afff" d="M24.1 101.7H0v10h24.1v-10z"/>
    <path fill="url(#capGrad1)" d="M161 77.2c0 40.1-37.4 51.2-56.7 51.2-19.3 0-56.7-11.1-56.7-51.2S73 22.3 104.3 22.3c31.3 0 56.7 14.8 56.7 54.9z"/>
    <path fill="#0c2780" d="M104.3 133.9c-25 0-62.2-14-62.2-52.7 0-9.3 1.5-17.7 4.6-24.9l10.1 4.3c-2.5 5.8-3.7 12.8-3.7 20.7 0 14.3 6.2 25.3 18.5 32.8 10.8 6.6 24 8.9 32.7 8.9 8.8 0 22-2.4 32.8-8.9 12.2-7.5 18.5-18.5 18.5-32.8 0-8.2-1.3-15.3-4-21.3l10.1-4.5c3.3 7.4 4.9 16 4.9 25.7-.1 38.6-37.3 52.7-62.3 52.7z"/>
    <path fill="#11afff" d="M104.1 135.4c-25.6 0-63.7-14.4-63.7-54.2 0-9.5 1.6-18.1 4.7-25.5l2.8 1.2c-3 7-4.5 15.2-4.5 24.4 0 37.6 36.3 51.2 60.7 51.2 24.4 0 60.7-13.6 60.7-51.2 0-9.5-1.6-17.9-4.8-25.1l2.7-1.2c3.4 7.6 5.1 16.4 5.1 26.3 0 39.6-38.1 54.1-63.7 54.1z"/>
    <path fill="#0c2780" d="M56.8 52.3 46.7 48c8.5-20.1 29-31.2 57.6-31.2 28.7 0 48.6 10.8 57.3 30.4l-10.1 4.5C142.8 32 121 27.8 104.3 27.8c-16.7 0-38.9 4.2-47.5 24.5z"/>
    <path fill="#0c2780" d="M105 11.5h.2l86.9 31.1c.6.2.6 1 .1 1.3l-87.6 49.4c-.1.1-.2.1-.3.1-.1 0-.2 0-.3-.1L17.3 45.4c-.5-.3-.5-1.1.1-1.3l87.4-32.6h.2zm-62.9 59L99.2 102c1.6.9 3.4 1.3 5.2 1.3 1.8 0 3.7-.5 5.3-1.4l56-31.6m-.1.1 31.5-17.8c3.6-2 5.8-6.1 5.4-10.2-.3-4.2-3.1-7.8-7.1-9.2L108.6 2.1c-1.2-.4-2.4-.6-3.6-.6-1.3 0-2.5.2-3.7.7L13.9 34.8c-3.9 1.4-6.7 5.1-7 9.2-.3 4.2 1.8 8.1 5.5 10.2L42 70.6"/>
    <path fill="#11afff" d="M42.5 74c-.3 0-.5-.1-.8-.2l-30-18.3c-4.1-2.3-6.6-6.8-6.2-11.6.4-4.7 3.5-8.9 7.9-10.5L100.8.8c2.7-1 5.7-1 8.4-.1L196 31.8c4.5 1.6 7.6 5.7 8 10.5.4 4.8-2 9.3-6.2 11.7l-31.5 17.8c-.7.4-1.6.2-2-.6-.4-.7-.1-1.6.6-2l31.5-17.8c3.1-1.8 5-5.2 4.7-8.8-.3-3.6-2.7-6.7-6.1-7.9L108.1 3.5c-2-.7-4.3-.7-6.3 0L14.4 36.2c-3.4 1.2-5.7 4.4-6 8-.3 3.6 1.6 7 4.7 8.7l30.1 18.4c.7.4.9 1.3.5 2.1-.2.3-.7.6-1.2.6z"/>
    <path fill="url(#capGrad2)" d="M192.7 40.7 108.3 9.1c-2.6-1-5.4-1-7.9 0L15.9 40.7c-1.5.6-1.7 2.7-.3 3.5l80.8 47.4c4.9 2.8 10.9 2.8 15.9 0L193 44.2c1.4-.8 1.2-2.9-.3-3.5z"/>
  </svg>
);

const Education = () => {
  const ref = useScrollReveal();

  return (
    <section id="learn" className="relative py-20 lg:py-28 overflow-hidden" ref={ref}>
      {/* Background: dark blue top half, light bottom half */}
      <div className="absolute inset-0">
        <div className="h-1/2" style={{ background: "#0c2780" }} />
        <div className="h-1/2 bg-background" />
      </div>

      {/* Decorative geometric outlines on light area */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-6 bottom-[10%] w-32 h-32 border-2 border-[#0c2780]/20 -rotate-12" />
        <div className="absolute left-[5%] bottom-[25%] w-20 h-20 border-2 border-[#0c2780]/20 rotate-6" />
        <div className="absolute -right-4 bottom-[15%] w-36 h-36 border-2 border-[#0c2780]/20 rotate-12" />
        <div className="absolute right-[8%] bottom-[8%] w-24 h-24 border-2 border-[#0c2780]/20 -rotate-6" />
      </div>

      <div className="container relative z-10">
        {/* Card */}
        <div
          className="rounded-2xl border border-brand-accent/30 overflow-hidden grid lg:grid-cols-2"
          style={{ background: "#0c2780" }}
        >
          {/* Image - shown first on mobile, second on desktop */}
          <div className="relative min-h-[200px] lg:min-h-[350px] lg:order-2">
            <img
              src={educationTrader}
              alt="Trader studying futures markets on laptop"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b lg:bg-gradient-to-r from-[#0c2780] via-[#0c2780]/50 to-transparent" />
          </div>

          {/* Left content */}
          <div className="p-10 lg:p-14 flex flex-col items-center text-center justify-center lg:order-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 159 24" className="w-32 mb-4">
              <defs>
                <clipPath id="clippath">
                  <rect fill="none" x=".5" width="157.5" height="23.8"/>
                </clipPath>
              </defs>
              <g>
                <g clipPath="url(#clippath)">
                  <g>
                    <path fill="#fff" d="M11.8,10.1h0c0-2.4.9-4.8,2.6-6.5.8-.9,1.8-1.5,3-2,1.1-.5,2.3-.7,3.5-.7,1.3,0,2.5.2,3.7.6,1.2.5,2.2,1.2,3.1,2.1l-2,2.3c-.6-.7-1.4-1.2-2.2-1.6-.8-.4-1.7-.6-2.7-.6-.8,0-1.6.2-2.3.5-.7.3-1.4.8-1.9,1.3-.5.6-1,1.3-1.2,2-.3.8-.4,1.5-.4,2.3,0,.8,0,1.6.3,2.4.3.8.7,1.5,1.2,2.1.5.6,1.2,1.1,1.9,1.4.7.3,1.5.5,2.3.5,1,0,1.9-.2,2.8-.6.9-.4,1.6-1,2.3-1.7l2,2c-1.8,2.1-4.4,3.2-7.1,3.1-1.2,0-2.3-.2-3.4-.7-2.2-.9-4-2.7-4.8-4.9-.4-1.1-.7-2.3-.6-3.5"/>
                    <path fill="#fff" d="M30.5,1.2h3.2l5.3,8.4,5.3-8.4h3.2v17.7h-3V6.2l-5.5,8.3h-.2l-5.5-8.3v12.6h-3V1.2Z"/>
                    <path fill="#fff" d="M51,1.2h13v2.8h-9.9v4.6h8.8v2.8h-8.8v4.7h10v2.8h-13.1V1.2Z"/>
                    <path fill="#fff" d="M70.5,10.1h0c0-1.2.2-2.4.7-3.5.5-1.1,1.1-2.1,2-3,.9-.9,1.9-1.5,3-2,1.1-.4,2.2-.7,3.4-.7,2.5-.1,4.9.7,6.7,2.4l-2,2.4c-1.3-1.3-3.1-1.9-4.9-1.9-.8,0-1.5.2-2.2.6-.7.3-1.3.8-1.9,1.4-.5.6-.9,1.3-1.2,2-.3.7-.4,1.5-.3,2.3,0,3.7,2.4,6.4,6,6.4,1.5,0,3-.4,4.2-1.3v-3.3h-4.5v-2.8h7.4v7.4c-2,1.8-4.6,2.8-7.3,2.8-3.7.2-7.1-2.1-8.5-5.5-.4-1.1-.6-2.3-.6-3.6"/>
                    <path fill="#fff" d="M90,5.6h3v3c.6-2,2.6-3.4,4.7-3.3v3.3h-.2c-2.6,0-4.5,1.7-4.5,5.3v5.1h-3V5.6Z"/>
                    <path fill="#fff" d="M110,12.3h0c0-.6,0-1.2-.3-1.7-.2-.5-.5-1-.9-1.4-.4-.4-.8-.7-1.3-.9-.5-.2-1.1-.3-1.6-.3-.5,0-1.1.1-1.6.3-1,.4-1.8,1.3-2.2,2.3-.2.5-.3,1.1-.2,1.6,0,.6,0,1.1.3,1.6.4,1,1.2,1.9,2.2,2.3.5.2,1,.3,1.6.4.5,0,1.1-.1,1.6-.3.5-.2.9-.5,1.3-.9.8-.8,1.2-1.9,1.1-3h0ZM99,12.3h0c0-1.9.7-3.7,2.1-5.1,2.7-2.8,7.1-2.8,9.9-.1,0,0,0,0,.1.1,1.3,1.3,2.1,3.1,2.1,5,0,2.8-1.7,5.4-4.4,6.5-.9.3-1.8.5-2.7.5-.9,0-1.8-.1-2.7-.5-.9-.3-1.7-.8-2.4-1.5-1.3-1.3-2-3.1-2-4.9"/>
                    <path fill="#fff" d="M115.4,14.1V5.6h3v7.6c0,2.1,1.1,3.3,2.8,3.3.8,0,1.7-.4,2.2-1,.3-.3.5-.7.6-1.1.1-.4.2-.8.1-1.2v-7.5h3.1v13.3h-3v-2.1c-.4.7-1,1.3-1.8,1.7-.7.4-1.5.6-2.4.6-3,0-4.7-2-4.7-5.1"/>
                    <path fill="#fff" fillRule="evenodd" d="M133.4,5.6h-3v18.2h3v-6.9c1,1.5,2.7,2.4,4.5,2.4,3.2,0,6.1-2.5,6.1-6.9s-3-6.9-6.1-6.9c-1.8,0-3.5,1-4.5,2.5v-2.3ZM141,12.2c0,2.6-1.7,4.3-3.8,4.3-.5,0-1.1-.1-1.5-.4-.5-.2-.9-.6-1.3-1-.4-.4-.6-.9-.8-1.4-.2-.5-.3-1.1-.2-1.6,0-.5,0-1.1.2-1.6.2-.5.4-1,.8-1.4.4-.4.8-.8,1.3-1,.5-.2,1-.3,1.5-.4,1.1,0,2.1.6,2.8,1.4.4.4.6.9.8,1.4.2.5.3,1,.2,1.6Z"/>
                  </g>
                </g>
              </g>
            </svg>
            <GraduationCapIcon />
            <h2 className="text-2xl lg:text-3xl font-normal text-primary-foreground mt-6 mb-4">
              Futures Academy
            </h2>
            <p className="text-primary-foreground/70 text-sm lg:text-base leading-relaxed max-w-md mb-8">
              Dive into our articles and videos to get an in-depth look at all you need to know about Futures trading.
            </p>
            <Button
              size="lg"
              className="bg-primary-foreground text-brand-accent hover:bg-primary-foreground/90 font-normal px-12 py-6 text-base rounded-lg w-full sm:w-auto"
            >
              Learn to Trade
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;
