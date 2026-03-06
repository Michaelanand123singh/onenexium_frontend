import Navbar from "./index/_components/Navbar.tsx";
import HeroSection from "./index/_components/HeroSection.tsx";
import HowItWorks from "./index/_components/HowItWorks.tsx";
import Testimonials from "./index/_components/Testimonials.tsx";
import FAQ from "./index/_components/FAQ.tsx";
import CTASection from "./index/_components/CTASection.tsx";
import Footer from "./index/_components/Footer.tsx";

export default function Index() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <HowItWorks />
      <Testimonials />
      <FAQ />
      <CTASection />
      <Footer />
    </div>
  );
}
