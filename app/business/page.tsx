import Navbar from "@/components/business/Navbar";
import Hero from "@/components/business/Hero";
import LogoBand from "@/components/business/LogoBand";
import FeaturesOrbit from "@/components/business/FeaturesOrbit";
import Showcase from "@/components/business/Showcase";
import HowItWorks from "@/components/business/HowItWorks";
import BentoTestimonials from "@/components/business/BentoTestimonials";
import FAQ from "@/components/business/FAQ";
import FinalCTA from "@/components/business/FinalCTA";
import Footer from "@/components/business/Footer";

export default function BusinessPage() {
    return (
        <main className="min-h-screen bg-black">
            <Navbar />
            <Hero />
            <LogoBand />
            <FeaturesOrbit />
            <Showcase />
            <HowItWorks />
            <BentoTestimonials />
            <FAQ />
            <FinalCTA />
            <Footer />
        </main>
    );
}
