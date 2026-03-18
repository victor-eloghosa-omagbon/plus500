import { FileText, Monitor, HandCoins, Award, Target } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Button } from "@/components/ui/button";
import { Gift } from "lucide-react";

const PracticeMakesPerfectIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 101.21 101.71" className="w-full h-full">
    <defs>
      <linearGradient id="practiceGrad" x1="83" y1="85.32" x2="21.16" y2="22.07" gradientTransform="matrix(1, 0, 0, -1, 0, 103.43)" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#11afff"/><stop offset="1" stopColor="#0c2780"/>
      </linearGradient>
    </defs>
    <path d="M42.36,101,1.23,67.9a3.12,3.12,0,0,1-.47-4.51L54,2A4,4,0,0,1,59.5,1.6L99.79,34a3.63,3.63,0,0,1,.55,5.24L47.05,100.59a3.42,3.42,0,0,1-4.7.36Z" fill="url(#practiceGrad)"/>
    <path d="M39.14,95.87,2.75,66.64a3.1,3.1,0,0,1-.43-4.49L54.22,2.33a4,4,0,0,1,5.42-.47L95.22,30.42a3.61,3.61,0,0,1,.49,5.22L43.82,95.46a3.41,3.41,0,0,1-4.67.4Z" fill="#0c2780" stroke="#11afff" strokeMiterlimit="10" strokeWidth="2"/>
    <path d="M46.2,83,14.69,57.65a1.54,1.54,0,0,1-.2-2.24L56,7.51a1.71,1.71,0,0,1,2.33-.2l31.51,25.3a1.53,1.53,0,0,1,.2,2.23L48.53,82.74A1.7,1.7,0,0,1,46.2,83Z" fill="#fff"/>
    <path d="M31.83,81.57,18.22,70.64a1.21,1.21,0,0,1-.17-1.75l.08-.1A1.35,1.35,0,0,1,20,68.63L33.57,79.57a1.21,1.21,0,0,1,.16,1.75l-.08.09A1.32,1.32,0,0,1,31.83,81.57Z" fill="#fff"/>
    <path d="M71,23,40.35,58.35" fill="none" stroke="#0c2780" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="2"/>
    <path d="M47.07,55.56,42,51.49a1,1,0,0,1-.13-1.38L62.35,26.5a1.06,1.06,0,0,1,1.44-.13l5.07,4.08A1,1,0,0,1,69,31.83L48.51,55.44A1.06,1.06,0,0,1,47.07,55.56Z" fill="#0c2780"/>
    <path d="M55.88,21.47,25.23,56.8" fill="none" stroke="#0c2780" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="2"/>
    <path d="M32,54l-5.08-4.07a1,1,0,0,1-.13-1.38L47.24,25a1,1,0,0,1,1.43-.12l5.08,4.07a1,1,0,0,1,.13,1.38L33.39,53.89A1,1,0,0,1,32,54Z" fill="#0c2780"/>
    <path d="M75.28,37.05,44.63,72.37" fill="none" stroke="#0c2780" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="2"/>
    <path d="M51.35,69.59l-5.07-4.07a1,1,0,0,1-.13-1.38L66.63,40.52a1.07,1.07,0,0,1,1.44-.12l5.07,4.07a1,1,0,0,1,.13,1.39L52.79,69.47A1.06,1.06,0,0,1,51.35,69.59Z" fill="#0c2780"/>
    <path d="M83.66,54.78l-.06-.06a.71.71,0,0,1-.23-1L90,46.28a.8.8,0,0,1,1.07.06l.06,0a.72.72,0,0,1,.23,1l-6.63,7.45A.79.79,0,0,1,83.66,54.78Z" fill="#fff"/>
    <path d="M68.32,71.94l-.06-.06a.71.71,0,0,1-.23-1L81,56.26a.79.79,0,0,1,1.06.06l.07,0a.73.73,0,0,1,.23,1L69.38,72A.79.79,0,0,1,68.32,71.94Z" fill="#fff"/>
  </svg>
);

const SwiftRegistrationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 102.66 81.13" className="w-full h-full">
    <defs>
      <clipPath id="swiftClip"><rect width="102.66" height="81.13" fill="none"/></clipPath>
      <linearGradient id="swiftGrad" x1="96.81" y1="81.65" x2="4.19" y2="15.58" gradientTransform="matrix(1, 0, 0, -1, 0, 84)" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#fff"/><stop offset="1" stopColor="#11afff"/>
      </linearGradient>
    </defs>
    <g clipPath="url(#swiftClip)">
      <path d="M51.75,56.7V80" fill="none" stroke="#11afff" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="2.25"/>
      <path d="M54,59.69,65.14,79" fill="none" stroke="#11afff" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="2.25"/>
      <path d="M49.52,59.69,38.36,79" fill="none" stroke="#11afff" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="2.25"/>
      <path d="M65,62.48H37v5.87H65Z" fill="#0c2780"/>
      <path d="M94.71,2.87H8.79A4.19,4.19,0,0,0,4.61,7.06V61.92a4.19,4.19,0,0,0,4.18,4.19H94.71a4.2,4.2,0,0,0,4.19-4.19V7.06A4.2,4.2,0,0,0,94.71,2.87Z" fill="url(#swiftGrad)"/>
      <path d="M99.54.84H4A2.27,2.27,0,0,0,1.69,3.12V5.67A2.27,2.27,0,0,0,4,8H99.54a2.27,2.27,0,0,0,2.27-2.28V3.12A2.27,2.27,0,0,0,99.54.84Z" fill="#0c2780" stroke="#11afff" strokeMiterlimit="10" strokeWidth="1.69"/>
      <path d="M4.81,71.28a4,4,0,0,1-2.74-6.84L38.79,29.36a1.94,1.94,0,0,1,1.35-.54,1.91,1.91,0,0,1,1.35.55,2,2,0,0,1,.1,2.69L7.78,70A4,4,0,0,1,4.81,71.28Z" fill="#0c2780"/>
      <path d="M40.14,29.67a1.07,1.07,0,0,1,.76.31A1.09,1.09,0,0,1,41,31.5L7.15,69.39a3.15,3.15,0,0,1-2.34,1,3.13,3.13,0,0,1-2.16-5.39L39.37,30a1.09,1.09,0,0,1,.76-.31m0-1.68a2.79,2.79,0,0,0-1.93.77L1.49,63.83A4.73,4.73,0,0,0,0,67.3a4.82,4.82,0,0,0,8.41,3.22l33.81-37.9A2.78,2.78,0,0,0,40.14,28Z" fill="#11afff"/>
    </g>
  </svg>
);

const LowCommissionsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 102.21 101" className="w-full h-full">
    <defs>
      <linearGradient id="commA" x1="91.76" y1="92.4" x2="41.12" y2="42.5" gradientTransform="matrix(1, 0, 0, -1, 0, 102)" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#fff"/><stop offset="1" stopColor="#11afff"/></linearGradient>
      <linearGradient id="commB" x1="47.02" y1="46.67" x2="85.42" y2="87.85" gradientTransform="matrix(1, 0, 0, -1, 0, 102)" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#fff"/><stop offset="1" stopColor="#11afff"/></linearGradient>
      <linearGradient id="commC" x1="10.23" y1="34.73" x2="25.76" y2="0.67" gradientTransform="matrix(1, 0, 0, -1, 0, 102)" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#fff"/><stop offset="1" stopColor="#11afff"/></linearGradient>
    </defs>
    <path d="M66,70A35,35,0,1,0,31,35,35,35,0,0,0,66,70Z" fill="url(#commA)"/>
    <path d="M66,63.22A28.23,28.23,0,1,0,37.76,35,28.23,28.23,0,0,0,66,63.22Z" fill="url(#commB)"/>
    <path d="M59.17,49.78A22.63,22.63,0,0,1,55.08,48a12.1,12.1,0,0,1-2.55-1.8l3-4.34a10.93,10.93,0,0,0,1.89,1.47,17.29,17.29,0,0,0,3.13,1.51l2.51-8.65c-.76-.65-1.51-1.34-2.23-2.08a10.8,10.8,0,0,1-1.8-2.42,8.06,8.06,0,0,1-.92-2.92,8.76,8.76,0,0,1,.36-3.57A8.26,8.26,0,0,1,62.1,20.1a9.72,9.72,0,0,1,6-1.1l1.12-3.88,4.43,1.28-1.07,3.71a17.77,17.77,0,0,1,3.11,1.46A20.21,20.21,0,0,1,78,23.21l-2.9,4.29a14.13,14.13,0,0,0-1.63-1.16,16.18,16.18,0,0,0-2.36-1.2L68.83,33c.76.66,1.52,1.36,2.26,2.11A11.38,11.38,0,0,1,73,37.59a8.61,8.61,0,0,1,1,2.9,8.16,8.16,0,0,1-.3,3.5,9.2,9.2,0,0,1-3.75,5.54,9.67,9.67,0,0,1-6.23,1.26l-1.14,4L58.1,53.48l1.07-3.71Zm5-23.35a2.79,2.79,0,0,0,.37,2.39,11.41,11.41,0,0,0,2,2.28l2-6.82a3.74,3.74,0,0,0-3,.17,3.51,3.51,0,0,0-1.34,2ZM67.94,43a2.84,2.84,0,0,0-.42-2.52,12.36,12.36,0,0,0-2.15-2.34L63.2,45.64a4.44,4.44,0,0,0,3.12-.38A3.76,3.76,0,0,0,67.94,43Z" fill="#0c2780"/>
    <path d="M37.23,95.45c2.14-.62,1.63-8.86-1.15-18.41s-6.76-16.77-8.9-16.15-1.63,8.86,1.15,18.41S35.09,96.07,37.23,95.45Z" fill="#2e86fe"/>
    <path d="M62.28,67.24s1.66.08,9.84-.36c10.66-.58,21.08-9.77,25.45-9.65h.06c1.79,0,4,2.15,2.7,3.41-7.89,7.83-21.24,19.3-29.22,21.26-7.8,1.92-15,6.14-33.15,5.94a7.59,7.59,0,0,0-2.4.65A1.61,1.61,0,0,1,33.7,88c-1.83-2.46-6.24-9.42-5.3-18.3l1.9.11c3.57-1,5.55-1.41,6.62-4.71V65c1.14-3.53,5-6.14,9.69-6.14H74.78c.64,0,1.11.49,1,1-.66,2.23-2.89,7.37-9.5,7.37" fill="#fff"/>
    <path d="M26.26,70.62l4-.85c3.57-1,5.55-1.41,6.62-4.71V65c1.14-3.53,5-6.14,9.69-6.14H74.78c.64,0,1.11.49,1,1C75.08,62.1,73.24,67,66.63,67H63.24" fill="none" stroke="#0c2780" strokeLinecap="round" strokeLinejoin="bevel" strokeWidth="3"/>
    <path d="M68.77,66.85a47.58,47.58,0,0,0,7-1c10.7-2.62,17.42-8.77,21.8-8.64h.06c1.79,0,4,2.15,2.7,3.41C92.43,68.47,81.12,77.44,71,81.89c-7.29,3.2-13.36,4.59-33,6a57.33,57.33,0,0,0-6.49,1.91" fill="none" stroke="#0c2780" strokeLinecap="round" strokeLinejoin="bevel" strokeWidth="3"/>
    <path d="M37.09,95.69l-13.65,4.43a17.91,17.91,0,0,1-11-34.07l14.37-4.66c-1.59,1.65-1,9.33,1.6,18.12,2.7,9.3,6.56,16.41,8.73,16.19Z" fill="url(#commC)"/>
  </svg>
);

const WealthOfExperienceIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 99.5 104.26" className="w-full h-full">
    <defs>
      <linearGradient id="wealthGrad" x1="80.41" y1="95.22" x2="19.63" y2="23.15" gradientTransform="matrix(1, 0, 0, -1, 0, 106.52)" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#fff"/><stop offset="1" stopColor="#11afff"/>
      </linearGradient>
    </defs>
    <path d="M97.48,85l-14,2.85-3.08,14.22L53.77,75.41,70.84,58.34Z" fill="none" stroke="#11afff" strokeMiterlimit="10" strokeWidth="2"/>
    <path d="M2,85.18,16,88l3.08,14.23,30-30L32,55.19Z" fill="none" stroke="#11afff" strokeMiterlimit="10" strokeWidth="2"/>
    <path d="M96.15,39.6l-4.31,8,4.31,8.06L89.3,61.83l1.25,9L82,74.3l-2,8.9-9.24.35-4.92,7.7-8.81-2.78-7.31,5.58-7.31-5.58-8.8,2.78-4.94-7.7-9.23-.35-2-8.9L9,70.85l1.25-9L3.36,55.71l4.3-8.06-4.3-8,6.84-6.12L9,24.45,17.51,21l2-8.9,9.23-.35,4.94-7.71,8.8,2.78,7.31-5.57,7.31,5.57,8.81-2.78,4.92,7.71,9.24.35L82,21l8.55,3.44-1.25,9Z" fill="#0c2780" stroke="#11afff" strokeMiterlimit="10" strokeWidth="2"/>
    <path d="M88,41l-3.55,6.63L88,54.29l-5.64,5,1,7.43-7,2.83-1.61,7.34-7.61.28L63,83.56l-7.25-2.29-6,4.59-6-4.59-7.25,2.29-4.06-6.35-7.61-.28L23.2,69.59l-7-2.83,1-7.43-5.64-5,3.55-6.64L11.54,41l5.64-5-1-7.43,7.05-2.84,1.61-7.33,7.61-.29,4.06-6.34L43.73,14l6-4.6,6,4.6L63,11.75l4.06,6.34,7.61.29,1.61,7.33,7,2.84-1,7.43Z" fill="url(#wealthGrad)"/>
    <path d="M49.75,29.09l4.61,14.18H69.27L57.2,52l4.61,14.18L49.75,57.45,37.69,66.21,42.3,52,30.24,43.27h14.9Z" fill="#0c2780"/>
  </svg>
);

const GoSmallIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100.28 100.28" className="w-full h-full">
    <defs>
      <linearGradient id="goSmallA" x1="78.94" y1="87.42" x2="23.88" y2="4.47" gradientTransform="matrix(1, 0, 0, -1, 0, 101.28)" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#fff"/><stop offset="1" stopColor="#11afff"/></linearGradient>
      <linearGradient id="goSmallB" x1="60.35" y1="34.46" x2="39.24" y2="5.65" gradientTransform="matrix(1, 0, 0, -1, 0, 101.28)" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#fff"/><stop offset="1" stopColor="#11afff"/></linearGradient>
    </defs>
    <path d="M50.14,98.78A48.64,48.64,0,1,0,1.5,50.14,48.63,48.63,0,0,0,50.14,98.78Z" fill="#0c2780" stroke="#11afff" strokeMiterlimit="10" strokeWidth="3"/>
    <path d="M50.14,98.78A41.54,41.54,0,1,0,8.61,57.25,41.53,41.53,0,0,0,50.14,98.78Z" fill="url(#goSmallA)"/>
    <path d="M50.14,97.68A29.47,29.47,0,1,0,20.67,68.21,29.46,29.46,0,0,0,50.14,97.68Z" fill="#0c2780" stroke="#11afff" strokeMiterlimit="10" strokeWidth="3"/>
    <path d="M50.14,97.68A16.93,16.93,0,1,0,33.21,80.75,16.93,16.93,0,0,0,50.14,97.68Z" fill="url(#goSmallB)"/>
  </svg>
);

const EasyToUseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 99 99" className="w-full h-full">
    <defs>
      <clipPath id="easyToUseClip"><rect width="99" height="99" fill="none"/></clipPath>
      <linearGradient id="easyToUseGrad" x1="78.17" y1="93.69" x2="23.36" y2="11.12" gradientTransform="matrix(1, 0, 0, -1, 0, 100)" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#fff"/><stop offset="1" stopColor="#11afff"/>
      </linearGradient>
    </defs>
    <g clipPath="url(#easyToUseClip)">
      <path d="M49.5,98.14A48.64,48.64,0,1,0,.86,49.5,48.64,48.64,0,0,0,49.5,98.14Z" fill="#0c2780" stroke="#11afff" strokeMiterlimit="10" strokeWidth="2"/>
      <path d="M49.5,90.85A41.35,41.35,0,1,0,8.15,49.5,41.36,41.36,0,0,0,49.5,90.85Z" fill="url(#easyToUseGrad)"/>
      <path d="M40.87,65.9,26.77,53.67A3.94,3.94,0,0,1,26.54,48l.29-.32a4.11,4.11,0,0,1,5.73-.47l18,15.6-2.22,2.46a5.36,5.36,0,0,1-7.45.61Z" fill="#0c2780"/>
      <path d="M48.54,65,72.4,38.83a4.15,4.15,0,0,0-.24-6,4.34,4.34,0,0,0-6,.47L38.41,63.81l2.14,1.86A5.76,5.76,0,0,0,48.54,65Z" fill="#0c2780"/>
    </g>
  </svg>
);

const benefits = [
  {
    icon: null,
    customIcon: EasyToUseIcon,
    title: "Easy to use",
    description: "Our app is designed for beginners and retail clients, helping to make your entry into Futures trading simpler than ever.",
  },
  {
    icon: null,
    customIcon: PracticeMakesPerfectIcon,
    title: "Practice Makes Perfect",
    description: "Use our demo live quotes to build your strategy before trading real money.",
  },
  {
    icon: null,
    customIcon: SwiftRegistrationIcon,
    title: "Swift Registration Flow",
    description: "Open an account safely and easily.",
  },
  {
    icon: null,
    customIcon: LowCommissionsIcon,
    title: "Low Commissions",
    description: "Enjoy 0 platform fees and 0 market data fees. You won't break your wallet with our low trading commissions!",
  },
  {
    icon: null,
    customIcon: WealthOfExperienceIcon,
    title: "Wealth of Experience",
    description: "With 20 years of experience in the U.S. market, we know all the ins and outs of Futures trading.",
  },
  {
    icon: null,
    customIcon: GoSmallIcon,
    title: "Go Small or Even Smaller",
    description: "Open an account with as little as $100 and scale up when you're ready.",
  },
];

const TradingBenefits = () => {
  const ref = useScrollReveal();

  return (
    <section className="relative py-20 lg:py-28 overflow-hidden" style={{ background: "#0c2780" }} ref={ref}>
      {/* Decorative geometric outlines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -right-8 top-[5%] w-40 h-40 border-2 border-brand-accent/20 rotate-12" />
        <div className="absolute right-[10%] top-[15%] w-24 h-24 border-2 border-brand-accent/20 -rotate-6" />
        <div className="absolute -left-6 top-[30%] w-32 h-32 border-2 border-brand-accent/20 -rotate-12" />
        <div className="absolute left-[5%] bottom-[20%] w-20 h-20 border-2 border-brand-accent/20 rotate-6" />
        <div className="absolute -right-4 bottom-[15%] w-36 h-36 border-2 border-brand-accent/20 rotate-12" />
        <div className="absolute right-[15%] bottom-[10%] w-20 h-20 border-2 border-brand-accent/20 -rotate-12" />
      </div>

      <div className="container relative z-10">
        <h2 className="text-3xl lg:text-5xl font-bold text-brand-accent text-center mb-16">
          Benefits of Trading with FutureTrade
        </h2>

        {/* Benefits grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-14 mb-16">
          {benefits.map(({ icon: Icon, customIcon: CustomIcon, title, description }) => (
            <div key={title} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 flex items-center justify-center mb-4">
                {CustomIcon ? (
                  <CustomIcon />
                ) : Icon ? (
                  <div className="w-16 h-16 rounded-full border-2 border-brand-accent/40 flex items-center justify-center">
                    <Icon size={30} className="text-brand-accent" />
                  </div>
                ) : null}
              </div>
              <h3 className="text-lg lg:text-xl font-bold text-primary-foreground mb-2">{title}</h3>
              <p className="text-primary-foreground/70 text-sm leading-relaxed max-w-xs">{description}</p>
            </div>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-sm sm:max-w-none mx-auto">
          <Button className="bg-brand-accent hover:bg-brand-accent/90 text-primary-foreground font-semibold px-8 py-3 h-auto text-base rounded-md w-full sm:w-auto">
            Start Trading Now
          </Button>
          <Button className="bg-primary-foreground hover:bg-primary-foreground/90 text-brand-accent font-semibold px-8 py-3 h-auto text-base rounded-md w-full sm:w-auto">
            Try free demo
          </Button>
        </div>
        <div className="flex justify-center mt-4 max-w-sm sm:max-w-none mx-auto">
          <Button variant="outline" className="border-primary-foreground/50 text-primary-foreground hover:bg-primary-foreground/10 font-semibold px-8 py-3 h-auto text-base rounded-md bg-transparent gap-2 w-full sm:w-auto">
            <Gift size={18} />
            Discover our bonuses
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TradingBenefits;
