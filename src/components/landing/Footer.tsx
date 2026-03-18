import { Facebook, Instagram, Linkedin, Youtube, Send, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

const legalLinks = [
  "Accessibility Statement",
  "Privacy Policy",
  "Firm Disclosure",
  "Risk Disclosure Statement",
  "Terms & Agreements",
  "Cookie Policy",
];

const Footer = () => (
  <footer className="bg-[#07183d] text-white/80 font-body">
    <div className="container px-6 md:px-10 py-[60px]">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_2.5fr_1fr] gap-10 md:gap-10">
        {/* Left Column - Legal Links */}
        <nav className="flex flex-col gap-2.5">
          {legalLinks.map((link) => (
            <Link
              key={link}
              to="/auth"
              className="text-sm text-white/70 hover:text-white hover:underline transition-colors"
            >
              {link}
            </Link>
          ))}
        </nav>

        {/* Middle Column - Risk Disclaimer */}
        <div className="text-[13px] leading-relaxed text-white/65 space-y-5">
          <p>
            <span className="font-semibold text-white/80">IMPORTANT:</span> Trading in futures and options carries substantial risk of loss and is not suitable for every investor. The valuation of futures and options contracts may fluctuate rapidly and unpredictably, and, as a result, clients may lose more than their original investments. In no event should the content of this website be construed as an express or implied promise or guarantee by or from Plus500US Financial Services LLC that you will profit or that losses can or will be limited in any manner whatsoever. Market volatility, trade volume, and system availability may delay account access and trade executions. Past results are no indication of future performance. Information provided in this correspondence is intended solely for informational purposes and is obtained from sources believed to be reliable. Information is in no way guaranteed.
          </p>
          <p>
            The trading of futures is available through Plus500US Financial Services LLC d/b/a Plus500, a Futures Commission Merchant registered with the US Commodity Futures Trading Commission and a member of the National Futures Association (NFA ID number 0001398). Plus500US Financial Services LLC is a wholly-owned subsidiary of Plus500US Inc. Trading privileges subject to review and approval. Not all applicants will qualify. Information collected on account applications will be used to verify an applicant's identity, as required under Federal law.
          </p>
          <p className="text-white/50 text-xs">Web-Platform</p>
        </div>

        {/* Right Column - Social & App Download */}
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-sm font-semibold text-white/90 mb-3">Follow Us On</p>
            <div className="flex items-center gap-3.5">
              <Link to="/auth" aria-label="Facebook" className="text-white/80 hover:text-white transition-colors">
                <Facebook size={22} />
              </Link>
              <Link to="/auth" aria-label="X (Twitter)" className="text-white/80 hover:text-white transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </Link>
              <Link to="/auth" aria-label="Instagram" className="text-white/80 hover:text-white transition-colors">
                <Instagram size={22} />
              </Link>
              <Link to="/auth" aria-label="LinkedIn" className="text-white/80 hover:text-white transition-colors">
                <Linkedin size={22} />
              </Link>
              <Link to="/auth" aria-label="YouTube" className="text-white/80 hover:text-white transition-colors">
                <Youtube size={22} />
              </Link>
              <Link to="/auth" aria-label="Telegram" className="text-white/80 hover:text-white transition-colors">
                <Send size={22} />
              </Link>
              <Link to="/auth" aria-label="TikTok" className="text-white/80 hover:text-white transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.52a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.16 15a6.34 6.34 0 0 0 6.33 6.33 6.34 6.34 0 0 0 6.33-6.33V8.66a8.2 8.2 0 0 0 4.77 1.52V6.73a4.83 4.83 0 0 1-1-.04z" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Google Play Badge */}
          <Link
            to="/auth"
            className="inline-block w-[160px] rounded-lg overflow-hidden border border-white/20 hover:border-white/40 transition-colors"
          >
            <img
              src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
              alt="Get it on Google Play"
              className="w-full"
              loading="lazy"
            />
          </Link>
        </div>
      </div>
    </div>

    {/* Bottom Bar */}
    <div className="border-t border-white/10">
      <div className="container px-6 md:px-10 py-5 flex flex-col sm:flex-row items-center justify-center gap-2 text-xs text-white/50">
        <div className="flex items-center gap-1.5">
          <Lock size={14} />
          <span>Secured by SSL.</span>
        </div>
        <span>Copyright © Plus500. All rights reserved.</span>
      </div>
    </div>
  </footer>
);

export default Footer;
