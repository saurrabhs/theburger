import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import BurgerExperienceWrapper from "@/components/sections/BurgerExperienceWrapper";
import IngredientStory from "@/components/sections/IngredientStory";
import Nutrition from "@/components/sections/Nutrition";
import AssemblyTimeline from "@/components/sections/AssemblyTimeline";
import Viewer360 from "@/components/sections/Viewer360";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/ui/ScrollToTop";
import PageLoader from "@/components/ui/PageLoader";
import dynamic from "next/dynamic";

const DevEditor = dynamic(() => import("@/components/burger/DevEditor"), { ssr: false });

export default function Home() {
  return (
    <>
      <PageLoader />
      <main className="relative bg-dark-900">
        <Navbar />
        <Hero />
        <BurgerExperienceWrapper />
        
        {/* Content sections - only appear after burger explosion */}
        <div className="relative z-10 bg-dark-900">
          <IngredientStory />
          <Nutrition />
          <AssemblyTimeline />
          <Viewer360 />
          <CTA />
          <Footer />
        </div>
        
        <ScrollToTop />
      </main>

      {/* Dev-only burger editor — press D to open, removed in production */}
      <DevEditor />
    </>
  );
}
