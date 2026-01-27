import Navbar from "@/components/creators/Navbar";
import Hero from "@/components/creators/Hero";
import LogoBand from "@/components/creators/LogoBand";
import FeaturesOrbit from "@/components/creators/FeaturesOrbit";
import TopEarners from "@/components/creators/TopEarners";
import HowItWorks from "@/components/creators/HowItWorks";
import EarningsCalculator from "@/components/creators/EarningsCalculator";
import BentoTestimonials from "@/components/creators/BentoTestimonials";
import FAQ from "@/components/creators/FAQ";
import FinalCTA from "@/components/creators/FinalCTA";
import Footer from "@/components/creators/Footer";

export default function CreatorLandingPage() {
    return (
        <div className="min-h-screen bg-white selection:bg-primary/20 selection:text-primary">
            <Navbar />
            <Hero />
            <LogoBand />
            <EarningsCalculator />
            <FeaturesOrbit />
            <TopEarners />
            <HowItWorks />
            <BentoTestimonials />
            <FAQ />
            <FinalCTA />
            <Footer />
        </div>
    );
}
