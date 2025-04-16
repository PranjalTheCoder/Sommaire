import BgGradient from "@/components/common/bg-gradient";
import "./globals.css";
import HeroSection from "@/components/home/hero-section";
import DemoSection from "@/components/home/demo-section";
import HowItWorksSection from "@/components/home/how-it-works";
import PricingSection from "@/components/home/pricing-section";
import CTASection from "@/components/home/cta-section";

export default function Home() {
  return (
    <div className="relative w-full">
      <BgGradient />
      <main className="flex flex-col">
        <HeroSection />
        <DemoSection />
        <HowItWorksSection />
        <PricingSection />
        <CTASection />
      </main>
    </div>
  );
}
