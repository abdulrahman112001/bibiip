import Header from "@/components/Header";
import HeroReel from "@/components/HeroReel";
import Hero from "@/components/Hero";
import OurStory from "@/components/OurStory";
import Services from "@/components/Services";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import Calculator from "@/components/Calculator";
import Walkthrough from "@/components/Walkthrough";
import Plans from "@/components/Plans";
import Testimonials from "@/components/Testimonials";
import Download from "@/components/Download";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <HeroReel />
        <Hero />
        <OurStory />
        <Services />
        <HowItWorks />
        <Features />
        <Calculator />
        <Walkthrough />
        <Plans />
        <Testimonials />
        <Download />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
