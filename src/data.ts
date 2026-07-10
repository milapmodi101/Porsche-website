/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CarVariant, BentoCard, EngineSpecHighlight, CockpitHotspot } from "./types";

export const CAR_VARIANTS: CarVariant[] = [
  {
    id: "variant-04",
    num: "04",
    name: "Stealth Black & Carbon Fiber",
    colorName: "Stealth Black",
    hex: "#e5e7eb",
    accentClass: "text-white",
    bgAccentClass: "bg-white",
    borderAccentClass: "border-white",
    focusRingAccentClass: "focus:ring-white",
    glowColor: "rgba(255, 255, 255, 0.4)",
    image: "https://res.cloudinary.com/dqqxjay44/image/upload/v1782733281/make_hyper_realistic_car_shot_202606291145-Photoroom_vvbbqn.png",
    tagline: "SHADOW OF THE SPEEDWAY.",
    description: "Draped in lightweight exposed carbon fiber weave. A quiet tactical predator built to shatter racetrack stopwatch records.",
    specs: {
      horsepower: { value: "518", label: "HORSEPOWER" },
      torque: { value: "346", unit: "lb-ft", label: "TORQUE" },
      acceleration: { value: "3.2", unit: "s", label: "0-60 MPH" },
      topSpeed: { value: "184", unit: "mph", label: "TOP TRACK SPEED" },
    },
  },
];

export const BENTO_CARDS: BentoCard[] = [
  {
    id: "bento-01",
    category: "AERODYNAMICS",
    title: "DRS ACTIVE REAR WING",
    description: "Drag Reduction System (DRS) optimizes the massive rear wing on straights, while the front splitter balances aerodynamic load downforce.",
    imageUrl: "https://newsroom.porsche.com/.imaging/mte/porsche-templating-theme/image_480x270/dam/pnr/2022/Products/911-GT3-RS-Premiere/Rennstrecke/_BKOS0298_edit_V02_highres.jpeg/jcr:content/_BKOS0298_edit_V02_highres.jpeg",
  },
  {
    id: "bento-02",
    category: "LIGHTWEIGHT DESIGN",
    title: "CARBON REINFORCED PLASTIC",
    description: "Extensive use of Carbon Fiber Reinforced Plastic (CFRP) on fenders, doors, roof, and front lid brings the dry curb weight to a nimble minimum.",
    imageUrl: "https://a.storyblok.com/f/322327/2108x2659/37bd1cbc1f/cz23v20ox0040-kv-911-gt3-rs-at-finish-line.jpg/m/530x636/smart/filters:format(webp)?dpl=dpl_4p3zBNtzQdLtLnXspj4RWdS4mXxn",
  },
  {
    id: "bento-03",
    category: "TRACK SUSPENSION",
    title: "ADJUSTABLE TRACK SUSPENSION",
    description: "Double wishbone front suspension with teardrop aerodynamic profiles. Rebound and compression dampers are fully adjustable via the steering wheel.",
    imageUrl: "https://newsroom.porsche.com/.imaging/mte/porsche-templating-theme/teaser_720x406x2/dam/pnr/2022/Products/911-GT3-RS-Premiere/Exterieur/_AKOS5082_edit_V02_highres.jpeg/jcr:content/_AKOS5082_edit_V02_highres.jpeg",
  },
];

export const ENGINE_HIGHLIGHTS: EngineSpecHighlight[] = [
  {
    id: "engine-01",
    value: "4.0L FLAT-SIX",
    label: "NATURALLY ASPIRATED",
    description: "A mechanical masterpiece. Direct-injection boxer engine delivering pure power and sound, without turbochargers.",
  },
  {
    id: "engine-02",
    value: "9000 RPM",
    label: "REDLINE",
    description: "High-revving adrenaline. Experience immediate throttle response that screams all the way to its 9,000 RPM redline.",
  },
  {
    id: "engine-03",
    value: "7-SPEED PDK",
    label: "DUAL CLUTCH",
    description: "Lightning-fast gears. Porsche Doppelkupplung (PDK) swaps gears in milliseconds without interrupting power transmission.",
  },
  {
    id: "engine-04",
    value: "REAR-WHEEL DRIVE",
    label: "PURE CONTROL",
    description: "Engineered for pure steering sensation. Active rear differential lock offers incredible traction on corner exits.",
  },
];

export const COCKPIT_HOTSPOTS: CockpitHotspot[] = [
  {
    id: "hotspot-01",
    x: 50,
    y: 64,
    title: "PDK Paddles",
    description: "Exquisite carbon fiber paddles on the steering wheel provide crisp, tactile mechanical feedback for manual shifts.",
  },
  {
    id: "hotspot-02",
    x: 43,
    y: 69,
    title: "PASM Dial",
    description: "Four rotary dials on the steering wheel allow individual adjustments of front and rear rebound/compression damping on the fly.",
  },
  {
    id: "hotspot-03",
    x: 46,
    y: 53,
    title: "DRS Button",
    description: "Integrates the Drag Reduction System (DRS). One press flattens the rear wing elements for extreme straightline speed boosts.",
  },
  {
    id: "hotspot-04",
    x: 57,
    y: 69,
    title: "ESC/TC Dial",
    description: "Allows the driver to fine-tune the 9-stage traction control intervention levels and completely disable Stability Control.",
  },
  {
    id: "hotspot-05",
    x: 50,
    y: 35,
    title: "Sport Chrono",
    description: "High-precision analog clock and digital lap trigger, measuring lap times to the hundredth of a second.",
  },
];

export const GALLERY_IMAGES = [
  {
    id: "gal-01",
    url: "https://hips.hearstapps.com/hmg-prod/images/1-dsc-8422-68499f35bcae0.jpg?crop=1xw:1xh;center,top",
    title: "Front Track Stance",
    desc: "Aggressive aero nostrils and LED headlamps highlighting the track stance.",
  },
  {
    id: "gal-02",
    url: "https://res.cloudinary.com/dqqxjay44/image/upload/v1782723086/make_hyper_realistic_car_shot_202606291145_c5gzuz.jpg",
    title: "Precision Bodywork",
    desc: "Lightweight aerodynamic curves slicing through drag vectors.",
  },
  {
    id: "gal-03",
    url: "https://hips.hearstapps.com/hmg-prod/images/2023-porsche-911-gt3-rs-108-1660522722.jpg?crop=1.00xw:0.918xh;0,0.00510xh",
    title: "Alcantara Cockpit",
    desc: "Tactile Alcantara wrapped racing controls focusing entirely on the driver.",
  },
  {
    id: "gal-04",
    url: "https://cdn.sanity.io/images/c8ihu5xk/production/3027b84e97ca29e552569744a81ffbad8e30ea57-6584x4389.jpg?auto=format&w=2880&q=80&fit=min",
    title: "High Performance Wheels",
    desc: "Center-locking forged magnesium lightweight racing wheels with carbon ceramic rotors.",
  },
  {
    id: "gal-05",
    url: "https://wallpapers.com/images/hd/porsche-g-t3-r-s-desert-sunset-pd54gpf60bcwfm1m.jpg",
    title: "Sunset Profile",
    desc: "A stunning rear visual showing the raw physical presence of the active rear spoiler.",
  },
  {
    id: "gal-06",
    url: "https://www.stuttcars.com/wp-content/uploads/2022/10/Porsche-911-GT3-RS-992-13-scaled.jpeg",
    title: "Racetrack Apex",
    desc: "Uncompromising corner speed under extreme track-day workloads.",
  },
];
