import dynamic from "next/dynamic";
import Navbar            from "@/components/layout/Navbar";
import Hero              from "@/components/sections/Hero";
import BurgerExperienceWrapper from "@/components/sections/BurgerExperienceWrapper";
import IngredientStory   from "@/components/sections/IngredientStory";
import Nutrition         from "@/components/sections/Nutrition";
import Viewer360         from "@/components/sections/Viewer360";
import CTA               from "@/components/sections/CTA";
import Footer            from "@/components/layout/Footer";
import ScrollToTop       from "@/components/ui/ScrollToTop";
import PageLoader        from "@/components/ui/PageLoader";

const DevEditor = dynamic(() => import("@/components/burger/DevEditor"), { ssr: false });

export default function Home() {
  return (
    <>
      <PageLoader />

      <main className="relative" style={{ background: "var(--dark-900)" }}>
        <Navbar />

        {/* 1. Hero — editorial layout, burger spins fixed behind text */}
        <Hero />

        {/* 2. Burger explosion — single 3D scene from hero spin → explode → done */}
        <BurgerExperienceWrapper />

        {/* Content sections */}
        <div id="story" className="relative z-10" style={{ background: "var(--dark-900)" }}>
          {/* 3. Ingredient Story */}
          <IngredientStory />

          {/* 4. Nutrition + Craftsmanship */}
          <Nutrition />

          {/* 360° viewer */}
          <Viewer360 />

          {/* 5. Final CTA */}
          <CTA />

          {/* 6. Footer */}
          <Footer />
        </div>
      </main>

      <ScrollToTop />

      {/* Dev editor — press D, production-safe */}
      <DevEditor />
    </>
  );
}
