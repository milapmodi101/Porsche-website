import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUp } from "lucide-react";
import { audioSynth } from "./utils/audioSynth";
import Header from "./components/Header";
import Hero from "./components/Hero";
import PerformanceBento from "./components/PerformanceBento";
import EngineSection from "./components/EngineSection";
import CockpitSection from "./components/CockpitSection";
import GallerySection from "./components/GallerySection";
import SubscribeForm from "./components/SubscribeForm";
import Footer from "./components/Footer";
import { CAR_VARIANTS } from "./data";
import { CarVariant } from "./types";
import Lenis from "lenis";
import LoadingScreen from "./components/LoadingScreen";
import CustomCursor from "./components/CustomCursor";
import AmbientBackground from "./components/AmbientBackground";
import RevealSection from "./components/RevealSection";

export default function App() {
  const [activeVariant, setActiveVariant] = useState<CarVariant>(CAR_VARIANTS[0]);
  const [isLoading, setIsLoading] = useState(true);
  const lenisRef = useRef<Lenis | null>(null);

  // Initialize Lenis smooth scroll once loading is complete
  useEffect(() => {
    if (isLoading) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [isLoading]);

  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY >= window.innerHeight - 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handler to scroll to specific sections cleanly using Lenis
  const scrollToSection = (id: string) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(`#${id}`, {
        duration: 1.4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <div className="bg-black text-white font-sans min-h-screen selection:bg-white selection:text-black antialiased overflow-x-hidden relative">
      {/* Global Elements: Custom Cursor & Ambient Background */}
      <CustomCursor />
      <AmbientBackground />

      {/* Original Porsche-inspired Tachometer Loading Screen */}
      <LoadingScreen onComplete={() => setIsLoading(false)} />

      {/* Main website content reveals when loading is finished */}
      {!isLoading && (
        <motion.div
          initial={{ filter: "blur(20px)", opacity: 0 }}
          animate={{ filter: "blur(0px)", opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10"
        >
          {/* 1. Header Navigation */}
          <Header
            activeVariant={activeVariant}
            onReserveClick={() => scrollToSection("subscribe")}
            onNavClick={(href) => {
              const id = href.replace("#", "");
              scrollToSection(id);
            }}
          />

          {/* 2. Main Hero Section */}
          <Hero
            activeVariant={activeVariant}
            onVariantChange={(v) => setActiveVariant(v)}
            onExploreClick={() => scrollToSection("performance")}
          />

          {/* 3. Performance Bento Grid Section */}
          <RevealSection>
            <PerformanceBento
              activeVariant={activeVariant}
              onExplorePerformanceClick={() => scrollToSection("technology")}
            />
          </RevealSection>

          {/* 4. Engineering Engine Details Section */}
          <RevealSection>
            <EngineSection activeVariant={activeVariant} />
          </RevealSection>

          {/* 5. Driver Focused Cockpit Section */}
          <RevealSection>
            <CockpitSection
              activeVariant={activeVariant}
              onExploreInteriorClick={() => scrollToSection("gallery")}
            />
          </RevealSection>

          {/* 6. Built to Push Limits Gallery Section */}
          <RevealSection>
            <GallerySection activeVariant={activeVariant} />
          </RevealSection>

          {/* 7. STAY AHEAD Subscribe Form Section */}
          <RevealSection>
            <SubscribeForm activeVariant={activeVariant} />
          </RevealSection>

          {/* 8. Multi-column Footer Brand Map */}
          <Footer activeVariant={activeVariant} />

          {/* Scroll to Top button in bottom right corner */}
          <AnimatePresence>
            {showScrollTop && (
              <motion.button
                onClick={() => {
                  audioSynth.playClick();
                  if (lenisRef.current) {
                    lenisRef.current.scrollTo(0, {
                      duration: 1.4,
                      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                    });
                  } else {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
                initial={{ opacity: 0, scale: 0.8, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 15 }}
                whileHover={{ 
                  scale: 1.06, 
                  borderColor: activeVariant.hex + "70",
                  boxShadow: `0 0 20px ${activeVariant.hex}30`
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className="fixed bottom-8 right-8 z-[90] w-[60px] h-[60px] rounded-full border border-white/5 backdrop-blur-md bg-black/20 flex items-center justify-center cursor-pointer select-none text-white transition-colors duration-350"
                data-cursor="scroll-top"
                aria-label="Scroll to top"
              >
                <ArrowUp className="w-6 h-6 stroke-[1.5]" />
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}

