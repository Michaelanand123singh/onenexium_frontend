import Navbar from "./index/_components/Navbar.tsx";
import HeroSection from "./index/_components/HeroSection.tsx";
import FeatureSection from "./index/_components/FeatureSection.tsx";
import ProductDemo from "./index/_components/ProductDemo.tsx";
import PlatformCapabilities from "./index/_components/PlatformCapabilities.tsx";
import Testimonials from "./index/_components/Testimonials.tsx";
import PricingPreview from "./index/_components/PricingPreview.tsx";
import CTASection from "./index/_components/CTASection.tsx";
import Footer from "./index/_components/Footer.tsx";

export default function Index() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <FeatureSection />
      <ProductDemo />
      <PlatformCapabilities />
      <Testimonials />
      <PricingPreview />
      <CTASection />
      <Footer />
    </div>
  );
}
