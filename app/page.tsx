import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import CategoryDiscovery from "@/components/landing/CategoryDiscovery";
import FeaturesOrbit from "@/components/landing/FeaturesOrbit";
import LogoBand from "@/components/landing/LogoBand";
import HowItWorks from "@/components/landing/HowItWorks";
import Showcase from "@/components/landing/Showcase";
import Testimonials from "@/components/landing/Testimonials";
import FAQ from "@/components/landing/FAQ";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";


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
