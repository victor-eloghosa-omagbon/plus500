import { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Plus500Logo from "@/components/Plus500Logo";

const navLinks = [
  { label: "Markets", hasDropdown: true },
  { label: "Prediction Markets", hasDropdown: false },
  { label: "Company", hasDropdown: true },
  { label: "Learn", hasDropdown: true },
  { label: "Support", hasDropdown: false },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 h-[72px] flex items-center bg-[#0c2780]"
    >
      <div className="container flex items-center justify-between">
        <a href="/" className="flex items-center">
          <Plus500Logo className="text-primary-foreground h-7 w-auto" />
        </a>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map(({ label, hasDropdown }) => (
            <Link
              key={label}
              to="/auth"
              className="flex items-center gap-1 text-sm font-medium text-primary-foreground/90 hover:text-primary-foreground transition-colors"
            >
              {label}
              {hasDropdown && <ChevronDown size={14} />}
            </Link>
          ))}
        </div>

        {/* Desktop buttons */}
        <div className="hidden lg:flex items-center gap-4">
          <span className="flex items-center gap-1 text-sm text-primary-foreground/90">
            EN <ChevronDown size={14} />
          </span>
          <Button
            asChild
            size="sm"
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold px-6 rounded-full"
          >
            <Link to="/auth">Start Trading</Link>
          </Button>
        </div>

        {/* Mobile buttons */}
        <div className="lg:hidden flex items-center gap-2">
          <Button
            asChild
            size="sm"
            className="bg-brand-accent text-primary-foreground hover:bg-brand-accent/90 font-bold text-sm px-5 py-2 rounded-lg"
          >
            <Link to="/auth">Trade</Link>
          </Button>
          <button
            className="p-2 text-primary-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden absolute top-[72px] left-0 right-0 bg-primary shadow-lg p-6 flex flex-col gap-4 animate-fade-in">
          {navLinks.map(({ label }) => (
            <Link
              key={label}
              to="/auth"
              className="text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground"
              onClick={() => setMobileOpen(false)}
            >
              {label}
            </Link>
          ))}
          <div className="flex flex-col gap-2 pt-4 border-t border-primary-foreground/20">
            <Button className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 rounded-full">
              Start Trading
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
