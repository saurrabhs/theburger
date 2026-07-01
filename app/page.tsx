import dynamic from "next/dynamic";
import Navbar     from "@/components/layout/Navbar";
import PageLoader from "@/components/ui/PageLoader";
import ScrollToTop from "@/components/ui/ScrollToTop";
import HeroRotationControls from "@/components/ui/HeroRotationControls";

// The entire cinematic experience — lazy loaded (heavy 3D)
const CinematicExperience = dynamic(
  () => import("@/components/experience/CinematicExperience"),
  { ssr: false, loading: () => null }
);

// Dev-only burger editor
const DevEditor = dynamic(
  () => import("@/components/burger/DevEditor"),
  { ssr: false }
);

export default function Home() {
  return (
    <>
      <PageLoader />

      {/* Floating navbar — always on top */}
      <Navbar />

      {/* Hero Rotation Controls */}
      <HeroRotationControls />

      {/* The entire website is one continuous cinematic scroll */}
      <main style={{ background: "var(--dark-900)" }}>
        <CinematicExperience />
      </main>

      <ScrollToTop />
      <DevEditor />
    </>
  );
}
