import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Markets from "@/components/landing/Markets";
import TradingBenefits from "@/components/landing/TradingBenefits";
import Education from "@/components/landing/Education";
import CustomerStats from "@/components/landing/CustomerStats";
import WhyUs from "@/components/landing/WhyUs";
import Footer from "@/components/landing/Footer";

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <Hero />
    <Markets />
    <TradingBenefits />
    <Education />
    <CustomerStats />
    <WhyUs />
    <Footer />
  </div>
);

export default Index;
