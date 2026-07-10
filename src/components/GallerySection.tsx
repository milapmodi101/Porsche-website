import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "motion/react";
import { CarVariant } from "../types";
import { GALLERY_IMAGES } from "../data";
import { audioSynth } from "../utils/audioSynth";

interface GallerySectionProps {
  activeVariant: CarVariant;
}

export default function GallerySection({ activeVariant }: GallerySectionProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Scroller refs and drag scroll state for the thumbnail container
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  const [isMainHovered, setIsMainHovered] = useState(false);
  const mainStageRef = useRef<HTMLDivElement>(null);

  // Parallax coordinates for main image
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 90, damping: 18 });
  const springY = useSpring(mouseY, { stiffness: 90, damping: 18 });

  const imgX = useTransform(springX, (x) => x * -15);
  const imgY = useTransform(springY, (y) => y * -15);

  const handleMainMouseMove = (e: React.MouseEvent) => {
    if (!mainStageRef.current) return;
    const rect = mainStageRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMainMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsMainHovered(false);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    setIsDown(true);
    setStartX(e.pageX - scroller.offsetLeft);
    setScrollLeftState(scroller.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDown(false);
  };

  const handleMouseUp = () => {
    setIsDown(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDown) return;
    e.preventDefault();
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const x = e.pageX - scroller.offsetLeft;
    const walk = (x - startX) * 1.5; // swipe speed multiplier
    scroller.scrollLeft = scrollLeftState - walk;
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "Escape") {
        setLightboxIndex(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex]);

  const handleNext = () => {
    setLightboxIndex((prev) => {
      if (prev === null) return null;
      const nextIndex = (prev + 1) % GALLERY_IMAGES.length;
      setDirection(1);
      setActiveImageIndex(nextIndex);
      return nextIndex;
    });
    audioSynth.playClick();
  };

  const handlePrev = () => {
    setLightboxIndex((prev) => {
      if (prev === null) return null;
      const nextIndex = (prev - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length;
      setDirection(-1);
      setActiveImageIndex(nextIndex);
      return nextIndex;
    });
    audioSynth.playClick();
  };

  return (
    <section
      id="gallery"
      className="relative bg-black text-white py-20 md:py-32 border-b border-white/10 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Title and Context */}
          <div className="lg:col-span-5 space-y-6 md:space-y-8">
            <div className="space-y-3">
              <span className="text-xs font-mono font-bold tracking-[0.25em] uppercase" style={{ color: activeVariant.hex }}>
                EXPERIENCE GT3 RS
              </span>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight uppercase font-display text-white">
                BUILT TO PUSH LIMITS.<br />
                DESIGNED TO THRILL.
              </h2>
            </div>
            
            <p className="text-sm md:text-base text-gray-400 leading-relaxed max-w-md">
              From the tightest bends on Alpine passes to absolute flat-out straights on the racetrack, the 911 GT3 RS delivers a raw, unfiltered sensory explosion that stands unmatched in performance automotive history.
            </p>
          </div>

          {/* Right Column: Hero Track Action Shot and Thumbnail Scroller */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            
            {/* Main Stage with floating effect & data-cursor VIEW trigger */}
            <motion.div
              ref={mainStageRef}
              onMouseMove={handleMainMouseMove}
              onMouseEnter={() => setIsMainHovered(true)}
              onMouseLeave={handleMainMouseLeave}
              data-cursor="view"
              animate={{
                y: [0, -6, 0]
              }}
              transition={{
                y: {
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
              className="relative w-full aspect-[16/9] rounded-sm overflow-hidden border border-white/10 bg-[#0d0d0d] select-none group cursor-pointer shadow-2xl"
              style={{
                boxShadow: isMainHovered ? `0 15px 35px -10px ${activeVariant.hex}18` : "0 4px 20px rgba(0,0,0,0)",
                transition: "box-shadow 0.4s ease"
              }}
            >
              {/* Highlight Glow Overlay */}
              <div className="absolute inset-0 bg-black/10 pointer-events-none z-10" />

              {/* Glowing animated frame border surrounding the main image active stage */}
              <motion.div 
                animate={{
                  borderColor: isMainHovered ? activeVariant.hex : "rgba(255, 255, 255, 0.1)",
                  boxShadow: isMainHovered ? `0 0 15px ${activeVariant.hex}30 inset` : "none"
                }}
                transition={{ duration: 0.4 }}
                className="absolute inset-2 border rounded-[2px] z-25 pointer-events-none"
              />

              {/* Zoom Trigger Button */}
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  audioSynth.playClick();
                  setLightboxIndex(activeImageIndex);
                }}
                whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 1)", color: "rgba(0, 0, 0, 1)" }}
                whileTap={{ scale: 0.95 }}
                className="absolute top-6 right-6 z-30 p-2.5 bg-black/80 border border-white/10 rounded-full text-white transition-all duration-300 shadow-lg cursor-pointer"
                aria-label="Zoom Image"
                title="Zoom image"
              >
                <ZoomIn className="w-4 h-4" />
              </motion.button>

              {/* Draggable viewport wrapper */}
              <div className="w-full h-full relative cursor-grab active:cursor-grabbing overflow-hidden">
                <AnimatePresence initial={false} custom={direction}>
                  <motion.div
                    key={activeImageIndex}
                    custom={direction}
                    variants={{
                      enter: (dir: number) => ({
                        x: dir > 0 ? "100%" : "-100%",
                        opacity: 0,
                        scale: 0.96
                      }),
                      center: {
                        x: 0,
                        opacity: 1,
                        scale: 1
                      },
                      exit: (dir: number) => ({
                        x: dir > 0 ? "-100%" : "100%",
                        opacity: 0,
                        scale: 0.96
                      })
                    }}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: "spring", stiffness: 280, damping: 28 },
                      opacity: { duration: 0.2 }
                    }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.5}
                    onDragEnd={(e, info) => {
                      const threshold = 65; // Swipe sensitivity
                      if (info.offset.x < -threshold) {
                        setDirection(1);
                        setActiveImageIndex((prev) => (prev + 1) % GALLERY_IMAGES.length);
                      } else if (info.offset.x > threshold) {
                        setDirection(-1);
                        setActiveImageIndex((prev) => (prev - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length);
                      }
                      audioSynth.playClick();
                    }}
                    className="absolute inset-0 w-full h-full select-none"
                  >
                    {/* Parallax inner image */}
                    <motion.img
                      style={{
                        x: imgX,
                        y: imgY,
                        scale: isMainHovered ? 1.06 : 1.01
                      }}
                      transition={{ duration: 0.5 }}
                      src={GALLERY_IMAGES[activeImageIndex].url}
                      alt={GALLERY_IMAGES[activeImageIndex].title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover filter contrast-[1.06] brightness-[0.92] pointer-events-none select-none"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Dynamic local lighting sweep overlay */}
              <motion.div 
                style={{
                  background: useTransform(
                    [springX, springY],
                    ([x, y]) => `radial-gradient(circle 300px at ${50 + x * 90}% ${50 + y * 90}%, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 80%)`
                  ),
                }}
                className="absolute inset-0 z-15 pointer-events-none mix-blend-overlay"
              />

              {/* Prev / Next HUD Overlays with Glass buttons, hover glow, and scale */}
              <div className="absolute inset-y-0 left-0 right-0 flex justify-between items-center px-6 z-20 pointer-events-none">
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDirection(-1);
                    setActiveImageIndex((prev) => (prev - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length);
                    audioSynth.playClick();
                  }}
                  whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.15)", borderColor: "rgba(255, 255, 255, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2.5 rounded-full bg-black/75 border border-white/10 text-white transition-all duration-300 pointer-events-auto cursor-pointer shadow-lg backdrop-blur-sm"
                  aria-label="Previous Slide"
                >
                  <ChevronLeft className="w-4 h-4" />
                </motion.button>
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDirection(1);
                    setActiveImageIndex((prev) => (prev + 1) % GALLERY_IMAGES.length);
                    audioSynth.playClick();
                  }}
                  whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.15)", borderColor: "rgba(255, 255, 255, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2.5 rounded-full bg-black/75 border border-white/10 text-white transition-all duration-300 pointer-events-auto cursor-pointer shadow-lg backdrop-blur-sm"
                  aria-label="Next Slide"
                >
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              </div>

              <div className="absolute bottom-4 left-4 z-20 bg-black/80 border border-white/10 px-3.5 py-1.5 rounded-sm font-mono text-[9px] md:text-[10px] tracking-widest text-gray-300 uppercase pointer-events-none select-none">
                {GALLERY_IMAGES[activeImageIndex].title}
              </div>
            </motion.div>

            {/* Active image caption details */}
            <div className="min-h-[40px] px-1">
              <p className="text-xs md:text-sm text-gray-400 italic">
                {GALLERY_IMAGES[activeImageIndex].desc}
              </p>
            </div>

            {/* Smooth attractive scroller bottom with high-fidelity brightness on hover */}
            <div className="relative mt-2">
              <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black to-transparent pointer-events-none z-10" />
              <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black to-transparent pointer-events-none z-10" />
              
              <div 
                ref={scrollerRef}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                className="flex space-x-3 overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10 hover:scrollbar-thumb-white/35 scroll-smooth snap-x select-none cursor-grab active:cursor-grabbing" 
                id="gallery-thumbnail-scroller"
              >
                {GALLERY_IMAGES.map((img, i) => {
                  const isActive = i === activeImageIndex;
                  return (
                    <motion.button
                      key={img.id}
                      onClick={() => {
                        setDirection(i > activeImageIndex ? 1 : -1);
                        setActiveImageIndex(i);
                        audioSynth.playClick();
                      }}
                      whileHover={{ scale: 1.05, brightness: 1.15 }}
                      className={`flex-shrink-0 w-20 md:w-28 aspect-[16/10] rounded-sm overflow-hidden border-2 transition-all duration-300 snap-start relative ${
                        isActive ? "opacity-100 scale-[1.03] brightness-100" : "opacity-40 hover:opacity-90 hover:brightness-110"
                      }`}
                      style={{ borderColor: isActive ? activeVariant.hex : "rgba(255,255,255,0.08)" }}
                    >
                      <img
                        src={img.url}
                        alt={img.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover pointer-events-none select-none"
                      />
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Fullscreen Interactive Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/98 flex flex-col justify-between p-6 backdrop-blur-md select-none"
          >
            {/* Header controls */}
            <div className="flex items-center justify-between w-full z-10">
              <div className="flex items-baseline space-x-2">
                <span className="text-xl font-bold font-display text-white">GALLERY</span>
                <span className="text-xs font-mono text-gray-500">
                  {lightboxIndex + 1} / {GALLERY_IMAGES.length}
                </span>
              </div>
              <motion.button
                onClick={() => {
                  audioSynth.playClick();
                  setLightboxIndex(null);
                }}
                whileHover={{ scale: 1.1, backgroundColor: "rgba(239, 68, 68, 0.2)", color: "rgba(239, 68, 68, 1)" }}
                whileTap={{ scale: 0.95 }}
                className="p-3 text-white bg-white/10 rounded-full transition-colors cursor-pointer"
                aria-label="Close Lightbox"
                id="lightbox-close"
              >
                <X className="w-6 h-6" />
              </motion.button>
            </div>

            {/* Main Carousel viewport */}
            <div className="flex-grow flex items-center justify-between relative max-w-6xl mx-auto w-full py-8">
              
              {/* Prev Arrow */}
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.15)", borderColor: "rgba(255, 255, 255, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                className="absolute left-0 md:-left-16 z-30 p-3 bg-white/5 border border-white/10 text-gray-400 rounded-full transition-all cursor-pointer"
                aria-label="Previous Image"
                id="lightbox-prev"
              >
                <ChevronLeft className="w-6 h-6" />
              </motion.button>

              {/* Central Image stage */}
              <div className="w-full h-full flex flex-col items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={lightboxIndex}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="relative max-w-full max-h-[70vh] aspect-[16/10] overflow-hidden rounded-sm border border-white/10 shadow-2xl bg-black"
                  >
                    <img
                      src={GALLERY_IMAGES[lightboxIndex].url}
                      alt={GALLERY_IMAGES[lightboxIndex].title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain mx-auto"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Captions Block */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={lightboxIndex + "-caption"}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                    className="text-center mt-6 max-w-lg px-4"
                  >
                    <h4 className="text-base font-bold uppercase tracking-wide text-white font-sans">
                      {GALLERY_IMAGES[lightboxIndex].title}
                    </h4>
                    <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                      {GALLERY_IMAGES[lightboxIndex].desc}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Next Arrow */}
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.15)", borderColor: "rgba(255, 255, 255, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                className="absolute right-0 md:-right-16 z-30 p-3 bg-white/5 border border-white/10 text-gray-400 rounded-full transition-all cursor-pointer"
                aria-label="Next Image"
                id="lightbox-next"
              >
                <ChevronRight className="w-6 h-6" />
              </motion.button>
            </div>

            {/* Bottom thumbnail scroller */}
            <div className="flex justify-center space-x-3 w-full border-t border-white/10 pt-4 z-10">
              {GALLERY_IMAGES.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => {
                    setLightboxIndex(i);
                    setActiveImageIndex(i);
                    audioSynth.playClick();
                  }}
                  className={`w-16 md:w-24 aspect-video rounded-sm overflow-hidden border-2 transition-all duration-300 relative ${
                    i === lightboxIndex
                      ? "opacity-100 scale-105"
                      : "opacity-40 hover:opacity-85 scale-100"
                  }`}
                  style={{ borderColor: i === lightboxIndex ? activeVariant.hex : "transparent" }}
                >
                  <img
                    src={img.url}
                    alt={img.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover pointer-events-none select-none"
                  />
                </button>
              ))}
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
