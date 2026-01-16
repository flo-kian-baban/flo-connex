import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CategoryDiscovery from "@/components/CategoryDiscovery";
import FeaturesOrbit from "@/components/FeaturesOrbit";
import LogoBand from "@/components/LogoBand";
import HowItWorks from "@/components/HowItWorks";
import Showcase from "@/components/Showcase";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <CategoryDiscovery />
      <HowItWorks />
      <FeaturesOrbit />
      <LogoBand />
      <Showcase />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}
