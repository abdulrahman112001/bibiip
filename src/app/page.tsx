import Header from "@/components/Header";
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
import CursorGlow from "@/components/CursorGlow";
import DeliveryJourney from "@/components/DeliveryJourney";
import SoundToggle from "@/components/SoundToggle";
import { getAllContent } from "@/lib/getContent";

export default async function Home() {
  const content = await getAllContent();

  return (
    <>
      <CursorGlow />
      <DeliveryJourney data={content} />
      <SoundToggle />
      <Header brand={content.brand} navData={content.nav} />
      <main className="flex-1">
        <Hero data={content.hero} />
        <OurStory data={content.ourStory} />
        <Services data={content.services} />
        <HowItWorks data={content.howItWorks} />
        <Features data={content.features} />
        <Calculator data={content.calculator} />
        <Walkthrough data={content.walkthrough} />
        <Plans data={content.plans} />
        <Testimonials data={content.testimonials} />
        <Download data={content.download} />
        <FAQ data={content.faq} />
      </main>
      <Footer brand={content.brand} data={content.footer} />
    </>
  );
}
