import { Bitcoin, TrendingUp, Zap, Layers, DollarSign, Wheat, BarChart3 } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRef } from "react";

const markets = [
  { icon: Bitcoin, label: "Crypto" },
  { icon: TrendingUp, label: "Equity Index" },
  { icon: Zap, label: "Energy" },
  { icon: Layers, label: "Metals" },
  { icon: DollarSign, label: "Forex" },
  { icon: Wheat, label: "Agriculture" },
  { icon: BarChart3, label: "Interest Rates" },
];

const Markets = () => {
  const ref = useScrollReveal();
  const isMobile = useIsMobile();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  return (
    <section id="markets" className="relative py-20 lg:py-28 bg-background overflow-hidden">
      {/* Decorative geometric outlines */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top-left geometric shapes */}
        <div className="absolute -left-8 top-[20%] w-32 h-32 border-2 border-primary/10 rotate-12" />
        <div className="absolute left-[5%] top-[55%] w-20 h-20 border-2 border-primary/10 -rotate-6" />
        {/* Bottom-left 3D plus */}
        <div className="absolute left-[3%] bottom-[10%] text-primary/15 text-7xl font-light" style={{ transform: "perspective(200px) rotateY(20deg)" }}>+</div>
        {/* Top-right geometric shapes */}
        <div className="absolute -right-6 top-[15%] w-40 h-40 border-2 border-primary/10 -rotate-12" />
        <div className="absolute right-[8%] top-[10%] w-24 h-24 border-2 border-primary/10 rotate-6" />
        {/* Bottom-right geometric shapes */}
        <div className="absolute -right-4 bottom-[25%] w-36 h-36 border-2 border-primary/10 rotate-12" />
        <div className="absolute right-[12%] bottom-[15%] w-20 h-20 border-2 border-primary/10 -rotate-12" />
      </div>

      <div className="container relative z-10" ref={ref}>
        <div className="text-center mb-12">
          <h2 className="text-[1.45rem] lg:text-5xl font-bold text-[#136de8] mb-6">
            Futures markets finally made
            <br />
            accessible!
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base lg:text-lg leading-relaxed">
            Discover a new way to trade with attractive day margins, and get
            access to a wide range of instruments.
            <br />
            Futures on S&P 500, NASDAQ 100, Bitcoin, EUR/USD, Oil, Gold, and
            many more!
          </p>
        </div>

        {/* Futures On label */}
        <div className="text-center mb-6">
          <span className="text-foreground font-bold text-base">Futures On</span>
        </div>

        {/* Market category pills */}
        {isMobile ? (
          <div
            ref={scrollContainerRef}
            className="flex gap-3 overflow-x-auto pb-4 px-4 -mx-4 snap-x snap-mandatory scrollbar-hide mb-16"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {markets.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex flex-col items-center justify-center gap-2 min-w-[100px] px-5 py-5 rounded-xl bg-card shadow-md text-[#0c2780] font-medium text-sm snap-start shrink-0"
              >
                <Icon size={24} />
                <span>{label}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {markets.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-5 py-3 rounded-lg border border-[#0c2780] bg-transparent text-[#0c2780] font-medium text-sm hover:bg-[#0c2780]/5 transition-colors cursor-pointer"
              >
                <Icon size={18} />
                <span>{label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Payment method logos */}
        <div className="flex flex-nowrap justify-center items-center gap-4 lg:gap-14">
          <span className="text-xl lg:text-4xl font-extrabold tracking-wider text-primary" style={{ fontFamily: "sans-serif", letterSpacing: "0.05em" }}>VISA</span>
          <div className="flex items-center">
            <div className="w-6 h-6 lg:w-10 lg:h-10 rounded-full bg-[#EB001B]" />
            <div className="w-6 h-6 lg:w-10 lg:h-10 rounded-full bg-[#F79E1B] -ml-2 lg:-ml-3" style={{ opacity: 0.85 }} />
          </div>
          <svg className="h-6 lg:h-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 51 47" fill="none">
            <path d="M33.1936 41.3975H1.3946C0.91706 41.3975 0.524414 41.0102 0.524414 40.5326V37.1368C0.524414 36.6592 0.91706 36.2666 1.3946 36.2666H3.05008V33.2422C3.05008 32.7646 3.44804 32.372 3.92027 32.372H5.68187V13.9282H1.99418C1.75955 13.9241 1.53576 13.8287 1.37031 13.6622C1.20487 13.4958 1.1108 13.2715 1.10808 13.0368V10.4475C1.10808 10.0973 1.32032 9.78421 1.64929 9.64094L22.0297 0.896606L42.389 9.64094C42.545 9.71156 42.6779 9.82464 42.7727 9.96726C42.8675 10.1099 42.9202 10.2763 42.9249 10.4475V13.058C42.9249 13.5356 42.5322 13.9282 42.0388 13.9282H38.4519V25.4264C38.1017 25.6545 37.7091 25.9251 37.2899 26.1904V13.9282H34.7642V27.7027C34.3928 27.9149 34.0001 28.1165 33.6022 28.3288V13.9282H29.1292V32.3614H30.8749V33.5287H4.2121V36.2348H30.9173C30.9598 36.5266 31.0235 36.9405 31.1455 37.3968H1.68643V40.209H32.3447C32.5941 40.6069 32.8859 41.0049 33.1936 41.3922V41.3975ZM27.9566 32.3667V13.9282H25.4256V32.3614H27.9566V32.3667ZM24.2689 32.3667V13.9282H19.8914V32.3614H24.2636L24.2689 32.3667ZM18.7135 32.3667V13.9282H16.1878V32.3614H18.7135V32.3667ZM15.0258 32.3667V13.9282H10.5528V32.3614H15.0258V32.3667ZM9.36956 32.3667V13.9282H6.84389V32.3614H9.36956V32.3667ZM2.28602 12.7662H41.7735V10.6332L22.0297 2.15944L2.28602 10.6332V12.7662ZM22.0244 10.8189C20.3265 10.8189 18.9629 9.45523 18.9629 7.752C18.9629 6.05407 20.3318 4.69042 22.0297 4.69042C23.7277 4.69042 25.0966 6.05407 25.0966 7.752C25.0938 8.56452 24.7698 9.34297 24.1953 9.91752C23.6207 10.4921 22.8423 10.8161 22.0297 10.8189H22.0244ZM22.0244 5.88958C20.9738 5.88958 20.1249 6.73854 20.1249 7.77322C20.1249 8.8132 20.9738 9.66217 22.0297 9.66217C23.0856 9.66217 23.9399 8.8132 23.9399 7.77322C23.9329 7.27122 23.7286 6.79215 23.3711 6.43964C23.0137 6.08713 22.5318 5.88953 22.0297 5.88958H22.0244Z" fill="#081F2C"/>
            <path d="M40.3195 46.3694L40.155 46.3269C35.0772 44.8784 32.6735 42.0609 31.5381 39.9862C30.2911 37.7046 30.2911 35.7626 30.2911 35.6989V29.7933C30.2911 29.4219 30.5193 29.0717 30.8748 28.9231C34.9551 27.3101 38.993 24.3653 39.7359 23.8081C39.8979 23.6859 40.0953 23.6198 40.2983 23.6198C40.5013 23.6198 40.6987 23.6859 40.8607 23.8081C41.6248 24.3918 45.6415 27.3101 49.7218 28.9231C50.0773 29.0717 50.3055 29.4007 50.3055 29.7933V35.6565C50.3055 35.7414 50.3055 37.6728 49.0639 39.9491C47.9443 42.0396 45.5194 44.8359 40.4416 46.2845L40.3195 46.3694ZM31.4532 29.9631V35.6512C31.4532 35.6724 31.4744 37.4128 32.594 39.4662C34.0637 42.1564 36.6531 44.0665 40.2983 45.1437C43.9435 44.0665 46.5329 42.1351 48.008 39.4662C48.6709 38.2971 49.0592 36.9925 49.1435 35.6512V29.9631C45.2488 28.3872 41.5399 25.7713 40.2983 24.8693C39.0567 25.7713 35.3478 28.366 31.4532 29.9631V29.9631Z" fill="#40C1AC"/>
            <path d="M39.4281 37.6144C39.2795 37.6144 39.1151 37.5561 39.0142 37.4553L36.8812 35.3169C36.8267 35.2627 36.7834 35.1982 36.7539 35.1272C36.7243 35.0562 36.7091 34.98 36.7091 34.9031C36.7091 34.8261 36.7243 34.75 36.7539 34.679C36.7834 34.6079 36.8267 34.5434 36.8812 34.4892C36.9355 34.4347 36.9999 34.3914 37.071 34.3618C37.142 34.3323 37.2182 34.3171 37.2951 34.3171C37.372 34.3171 37.4482 34.3323 37.5192 34.3618C37.5902 34.3914 37.6547 34.4347 37.709 34.4892L39.4493 36.2084L42.9301 32.8125C42.9843 32.7579 43.0488 32.7147 43.1198 32.6851C43.1909 32.6556 43.267 32.6404 43.344 32.6404C43.4209 32.6404 43.4971 32.6556 43.5681 32.6851C43.6391 32.7147 43.7036 32.7579 43.7578 32.8125C43.8124 32.8667 43.8557 32.9312 43.8852 33.0022C43.9147 33.0733 43.9299 33.1494 43.9299 33.2264C43.9299 33.3033 43.9147 33.3795 43.8852 33.4505C43.8557 33.5215 43.8124 33.586 43.7578 33.6402L39.8632 37.4287C39.7359 37.5561 39.5926 37.6198 39.4281 37.6198V37.6144Z" fill="#40C1AC"/>
          </svg>
          <div className="flex items-center gap-1">
            <svg className="h-5 lg:h-10" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            <span className="text-sm lg:text-xl font-semibold text-foreground">Pay</span>
          </div>
          <div className="flex items-center gap-0.5">
            <svg className="h-5 lg:h-7" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            <span className="text-sm lg:text-xl font-semibold text-foreground">Pay</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Markets;
