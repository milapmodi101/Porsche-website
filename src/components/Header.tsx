import React, { useState, useEffect } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CarVariant } from "../types";

interface HeaderProps {
  activeVariant: CarVariant;
  onReserveClick: () => void;
  onNavClick?: (href: string) => void;
}

export default function Header({ activeVariant, onReserveClick, onNavClick }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");

  // Nav items and their anchors
  const navItems = [
    { label: "OVERVIEW", href: "#overview" },
    { label: "PERFORMANCE", href: "#performance" },
    { label: "TECHNOLOGY", href: "#technology" },
    { label: "DESIGN", href: "#design" },
    { label: "GALLERY", href: "#gallery" },
    { label: "SPECIFICATIONS", href: "#subscribe" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);

    // Precise viewport intersection observer for nav underlines
    const observerOptions = {
      root: null,
      rootMargin: "-45% 0px -45% 0px", // focus on mid-screen triggers
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    navItems.forEach((item) => {
      const el = document.querySelector(item.href);
      if (el) {
        observer.observe(el);
      }
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    if (onNavClick) {
      onNavClick(href);
    } else {
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <>
      <motion.header
        animate={{
          y: 0,
          paddingTop: isScrolled ? "12px" : "20px",
          paddingBottom: isScrolled ? "12px" : "20px",
          backgroundColor: isScrolled ? "rgba(0, 0, 0, 0.92)" : "rgba(255, 255, 255, 0.04)",
          borderColor: isScrolled ? "rgba(255, 255, 255, 0.12)" : "rgba(255, 255, 255, 0.08)",
          backdropFilter: isScrolled ? "blur(24px)" : "blur(12px)",
        }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        className="fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-7xl z-50 rounded-full shadow-2xl border border-solid"
        id="app-header"
      >
        <div className="flex items-center justify-between w-full px-6 md:px-10">
          
          {/* Logo container */}
          <a
            href="#overview"
            onClick={(e) => handleNavClick(e, "#overview")}
            className="flex items-center group cursor-pointer"
          >
            <motion.img
              animate={{
                height: isScrolled ? 24 : 32,
                scale: isScrolled ? 0.92 : 1,
              }}
              transition={{ type: "spring", stiffness: 140, damping: 20 }}
              src="https://res.cloudinary.com/dqqxjay44/image/upload/v1782739743/ChatGPT_Image_Jun_29_2026_06_55_48_PM-Photoroom_n9hr55.png"
              alt="Porsche Logo"
              referrerPolicy="no-referrer"
              className="w-auto object-contain"
            />
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-10">
            {navItems.map((item) => {
              const isActive = activeSection === item.href.substring(1);
              return (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  initial={{ letterSpacing: "0.15em", opacity: 0.6 }}
                  animate={{
                    opacity: isActive ? 1 : 0.6,
                    color: isActive ? "#ffffff" : "#9ca3af",
                  }}
                  whileHover={{
                    letterSpacing: "0.22em",
                    opacity: 1,
                    color: "#ffffff",
                  }}
                  transition={{ type: "spring", stiffness: 150, damping: 25 }}
                  className="relative text-[10px] font-mono font-black uppercase transition-colors"
                >
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="activeNavLine"
                      className="absolute -bottom-1.5 left-0 w-full h-[2px] rounded-full shadow-lg"
                      style={{
                        backgroundColor: activeVariant.hex,
                        boxShadow: `0 0 10px ${activeVariant.hex}aa`,
                      }}
                      transition={{ type: "spring", stiffness: 220, damping: 24 }}
                    />
                  )}
                </motion.a>
              );
            })}
          </nav>

          {/* Right Action Button & Mobile Trigger */}
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={onReserveClick}
              whileHover="hover"
              whileTap={{ scale: 0.96 }}
              variants={{
                hover: {
                  scale: 1.03,
                  boxShadow: `0 0 20px ${activeVariant.hex}80`,
                },
              }}
              className="hidden md:flex items-center justify-center space-x-2 px-6 py-2.5 text-[10px] font-black tracking-[0.2em] uppercase text-black rounded-full overflow-hidden relative group transition-all duration-300 shadow-md"
              style={{ backgroundColor: activeVariant.hex }}
              id="header-reserve-btn"
            >
              {/* Slide-in fill layer */}
              <div className="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
              <span className="relative z-10">RESERVE YOURS</span>
              
              {/* Sliding arrow */}
              <motion.span
                variants={{
                  hover: { x: 3, y: -3 },
                }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="relative z-10 flex items-center justify-center"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
              </motion.span>
            </motion.button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-white hover:text-gray-300 transition-colors p-2 cursor-pointer"
              aria-label="Toggle mobile menu"
              id="mobile-menu-toggle"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black pt-28 px-8 flex flex-col justify-between pb-12 lg:hidden"
          >
            <nav className="flex flex-col space-y-6">
              {navItems.map((item, index) => {
                const isActive = activeSection === item.href.substring(1);
                return (
                  <motion.a
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={item.href}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className="flex items-center justify-between text-lg font-bold tracking-wider text-left border-b border-white/5 pb-3"
                  >
                    <span className={isActive ? "text-white" : "text-gray-400"}>
                      {item.label}
                    </span>
                    <span
                      className="text-xs"
                      style={{ color: isActive ? activeVariant.hex : "transparent" }}
                    >
                      ●
                    </span>
                  </motion.a>
                );
              })}
            </nav>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onReserveClick();
                }}
                className="w-full py-4 text-sm font-bold tracking-widest uppercase text-black text-center rounded-sm flex items-center justify-center space-x-2"
                style={{ backgroundColor: activeVariant.hex }}
              >
                <span>RESERVE YOURS</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <div className="flex justify-center space-x-6 text-xs text-gray-500 font-mono">
                <span>UTC: 2026-06-29</span>
                <span>•</span>
                <span>PORSCHE AG</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
