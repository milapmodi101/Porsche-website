import React, { useState, useEffect } from "react";
import { ArrowRight, CheckCircle2, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CarVariant, Subscriber } from "../types";
import { audioSynth } from "../utils/audioSynth";

interface SubscribeFormProps {
  activeVariant: CarVariant;
}

interface GlassInputProps {
  label: string;
  type: string;
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  error?: string;
  activeColor: string;
}

function GlassInput({ label, type, value, onChange, placeholder, error, activeColor }: GlassInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const isFilled = value.length > 0;

  return (
    <div className="relative flex flex-col pt-5 w-full group">
      {/* Floating Label */}
      <motion.label
        animate={{
          y: isFocused || isFilled ? -24 : 0,
          scale: isFocused || isFilled ? 0.82 : 1,
          color: isFocused ? activeColor : error ? "#ef4444" : "#555555",
        }}
        transition={{ type: "spring", stiffness: 180, damping: 20 }}
        className="absolute left-4 top-8 pointer-events-none text-xs font-mono tracking-widest uppercase transform origin-left"
      >
        {label}
      </motion.label>

      {/* Input wrapper container with premium glass style */}
      <div 
        className={`w-full rounded-sm bg-white/[0.012] border transition-all duration-400 flex items-center relative overflow-hidden px-4 py-3.5 ${
          error 
            ? "border-red-500/50" 
            : isFocused 
              ? "border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.02)]" 
              : "border-white/5 group-hover:border-white/10"
        }`}
      >
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={isFocused ? placeholder : ""}
          className="w-full bg-transparent text-sm text-white focus:outline-none placeholder-white/20 font-sans"
        />

        {/* Dynamic center-expanding underline */}
        <motion.div
          initial={{ width: "0%", left: "50%" }}
          animate={{
            width: isFocused ? "100%" : "0%",
            left: isFocused ? "0%" : "50%",
          }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="absolute bottom-0 h-[2px] pointer-events-none"
          style={{ backgroundColor: error ? "#ef4444" : activeColor }}
        />
      </div>

      {/* Error caption fade in */}
      <AnimatePresence>
        {error && (
          <motion.span
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute bottom-[-18px] left-4 text-[9px] text-red-500 font-mono tracking-wide"
          >
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function SubscribeForm({ activeVariant }: SubscribeFormProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [preferences, setPreferences] = useState("allocation");
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<Subscriber | null>(null);

  // Load existing submission from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("porsche_gt3rs_subscriber");
    if (saved) {
      try {
        setSubmittedData(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!firstName.trim()) newErrors.firstName = "First name is required";
    if (!lastName.trim()) newErrors.lastName = "Last name is required";
    
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9+\s-]{8,15}$/.test(phone.trim())) {
      newErrors.phone = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    audioSynth.playClick();

    // Simulate luxury API submission delay
    setTimeout(() => {
      const newSubscriber: Subscriber = {
        id: "SUB-" + Math.random().toString(36).substring(2, 11).toUpperCase(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        preferences,
        timestamp: new Date().toLocaleDateString(),
      };

      localStorage.setItem("porsche_gt3rs_subscriber", JSON.stringify(newSubscriber));
      setSubmittedData(newSubscriber);
      setIsSubmitting(false);

      // Reset form fields
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
    }, 1800);
  };

  const handleReset = () => {
    audioSynth.playClick();
    localStorage.removeItem("porsche_gt3rs_subscriber");
    setSubmittedData(null);
  };

  return (
    <section
      id="subscribe"
      className="relative bg-[#050505] text-white py-20 md:py-32 border-b border-white/10 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Descriptive text */}
          <div className="lg:col-span-5 space-y-4 md:space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold tracking-[0.25em] uppercase" style={{ color: activeVariant.hex }}>
                STAY AHEAD
              </span>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-none uppercase font-display text-white">
                THE LEGEND<br />
                CONTINUES.
              </h2>
            </div>
            <p className="text-sm md:text-base text-gray-400 leading-relaxed max-w-md">
              Be the first to know about exclusive VIP racetrack events, private allocations, future product reveals, and bespoke Porsche ownership experiences.
            </p>
          </div>

          {/* Right Column: Subscriber Form exactly styled as in Reference Image */}
          <div className="lg:col-span-7 bg-black/40 border border-white/10 p-8 rounded-sm relative">
            <AnimatePresence mode="wait">
              {!submittedData ? (
                <motion.form
                  key="subscribe-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-8"
                  noValidate
                >
                  {/* First Name & Last Name Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <GlassInput
                      label="FIRST NAME"
                      type="text"
                      value={firstName}
                      onChange={setFirstName}
                      placeholder="John"
                      error={errors.firstName}
                      activeColor={activeVariant.hex}
                    />
                    <GlassInput
                      label="LAST NAME"
                      type="text"
                      value={lastName}
                      onChange={setLastName}
                      placeholder="Doe"
                      error={errors.lastName}
                      activeColor={activeVariant.hex}
                    />
                  </div>

                  {/* Email & Phone Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <GlassInput
                      label="EMAIL ADDRESS"
                      type="email"
                      value={email}
                      onChange={setEmail}
                      placeholder="johndoe@example.com"
                      error={errors.email}
                      activeColor={activeVariant.hex}
                    />
                    <GlassInput
                      label="PHONE NUMBER"
                      type="tel"
                      value={phone}
                      onChange={setPhone}
                      placeholder="+1 555-0199"
                      error={errors.phone}
                      activeColor={activeVariant.hex}
                    />
                  </div>

                  {/* Preferences Glass Dropdown */}
                  <div className="relative pt-5">
                    <label className="absolute left-4 top-1 pointer-events-none text-[9px] font-mono tracking-widest uppercase text-gray-500">
                      PREFERENCES
                    </label>
                    <div className="w-full rounded-sm bg-white/[0.012] border border-white/5 hover:border-white/10 focus-within:border-white/20 transition-all duration-300 relative">
                      <select
                        value={preferences}
                        onChange={(e) => setPreferences(e.target.value)}
                        className="w-full bg-transparent border-0 px-4 py-4 text-xs text-white rounded-sm focus:outline-none appearance-none cursor-pointer font-sans"
                        id="form-preferences"
                      >
                        <option value="allocation" className="bg-[#0c0c0c] text-white">Enquire about 911 GT3 RS Allocation Slot</option>
                        <option value="config" className="bg-[#0c0c0c] text-white">Request Assistance with Custom Configuration</option>
                        <option value="events" className="bg-[#0c0c0c] text-white">Invite me to Private Track-Day Driving Events</option>
                        <option value="newsletter" className="bg-[#0c0c0c] text-white">Subscribe to Porsche Motorsport Newsletters</option>
                      </select>
                      <div className="absolute top-1/2 right-4 -translate-y-1/2 pointer-events-none text-gray-500 text-[10px]">
                        ▼
                      </div>
                    </div>
                  </div>

                  {/* Submit Button with Hover scale and sliding arrow */}
                  <div className="pt-2">
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover="hover"
                      whileTap={{ scale: 0.97 }}
                      variants={{
                        hover: {
                          scale: 1.02,
                          boxShadow: `0 0 25px ${activeVariant.hex}50`,
                        }
                      }}
                      className="w-full py-4 text-xs font-bold tracking-widest uppercase text-black text-center rounded-sm flex items-center justify-center space-x-2 transition-all duration-300 cursor-pointer disabled:opacity-50 relative overflow-hidden group shadow-md"
                      style={{ backgroundColor: activeVariant.hex }}
                      id="subscribe-submit-btn"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-black" />
                          <span>SYNCHRONIZING RECONNAISSANCE...</span>
                        </>
                      ) : (
                        <>
                          <span>SUBSCRIBE</span>
                          <motion.span
                            variants={{ hover: { x: 4 } }}
                            transition={{ type: "spring", stiffness: 300, damping: 15 }}
                            className="flex items-center justify-center"
                          >
                            <ArrowRight className="w-4 h-4 text-black" />
                          </motion.span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.form>
              ) : (
                /* Success Card inviting users with high-fidelity ticket voucher */
                <motion.div
                  key="success-card"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-6 text-center py-6 animate-none"
                >
                  <div className="flex justify-center">
                    <CheckCircle2 className="w-16 h-16" style={{ color: activeVariant.hex }} />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-xl md:text-2xl font-black uppercase text-white tracking-tight">
                      WELCOME TO THE INNER CIRCLE
                    </h3>
                    <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
                      Your interest record has been successfully cataloged. Below is your official digital invitation to the Porsche Motorsport network.
                    </p>
                  </div>

                  {/* Procedural Digital Ticket Voucher */}
                  <div className="max-w-sm mx-auto bg-[#111111] border border-white/10 rounded-sm overflow-hidden text-left relative shadow-2xl">
                    <div className="h-2 w-full" style={{ backgroundColor: activeVariant.hex }} />
                    <div className="p-6 space-y-4">
                      <div className="flex justify-between items-baseline">
                        <span className="text-lg font-black font-display tracking-tight text-white">911 GT3 RS</span>
                        <span className="text-[9px] font-mono font-bold text-gray-500 uppercase">ACCESS TICKET</span>
                      </div>

                      <div className="space-y-2 font-mono text-[10px] text-gray-400 border-t border-b border-white/5 py-4">
                        <div className="flex justify-between">
                          <span>REGISTRATION ID:</span>
                          <span className="text-white font-bold">{submittedData.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>HOLDER NAME:</span>
                          <span className="text-white font-bold">{submittedData.firstName} {submittedData.lastName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>CONTACT EMAIL:</span>
                          <span className="text-white font-bold max-w-[180px] truncate">{submittedData.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>PREFERENCE CATEGORY:</span>
                          <span className="text-white font-bold uppercase">{submittedData.preferences}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>AUTHORIZED DATE:</span>
                          <span className="text-white font-bold">{submittedData.timestamp}</span>
                        </div>
                      </div>

                      {/* Procedural SVG barcode */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="space-y-0.5">
                          <span className="block text-[8px] font-mono text-gray-500">AUTHORIZING AGENCY</span>
                          <span className="block text-[9px] font-mono font-bold text-white">DR. ING. H.C. F. PORSCHE AG</span>
                        </div>
                        {/* Mock QR SVG Box */}
                        <svg className="w-12 h-12 bg-white p-1 rounded-sm" viewBox="0 0 100 100">
                          <rect x="5" y="5" width="25" height="25" fill="black" />
                          <rect x="10" y="10" width="15" height="15" fill="white" />
                          <rect x="70" y="5" width="25" height="25" fill="black" />
                          <rect x="75" y="10" width="15" height="15" fill="white" />
                          <rect x="5" y="70" width="25" height="25" fill="black" />
                          <rect x="10" y="75" width="15" height="15" fill="white" />
                          <rect x="40" y="40" width="20" height="20" fill="black" />
                          <rect x="50" y="70" width="15" height="25" fill="black" />
                          <rect x="70" y="50" width="25" height="15" fill="black" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={handleReset}
                      className="inline-flex items-center space-x-2 text-xs font-mono text-gray-500 hover:text-white transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>REGISTER ANOTHER ENTRY</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
