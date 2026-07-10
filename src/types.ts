/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SpecItem {
  value: string;
  unit?: string;
  label: string;
}

export interface CarVariant {
  id: string;
  num: string; // "01", "02", "03", "04"
  name: string;
  colorName: string;
  hex: string;
  accentClass: string; // Tailwind class for text color e.g., 'text-[#ccff00]'
  bgAccentClass: string; // Tailwind class for bg e.g., 'bg-[#ccff00]'
  borderAccentClass: string; // Tailwind class for border e.g., 'border-[#ccff00]'
  focusRingAccentClass: string; // Focus ring accent e.g., 'focus:ring-[#ccff00]'
  glowColor: string; // hex shadow glow
  image: string;
  tagline: string;
  description: string;
  specs: {
    horsepower: SpecItem;
    torque: SpecItem;
    acceleration: SpecItem;
    topSpeed: SpecItem;
  };
}

export interface BentoCard {
  id: string;
  category: string;
  title: string;
  description: string;
  imageUrl: string;
}

export interface EngineSpecHighlight {
  id: string;
  value: string;
  label: string;
  description: string;
}

export interface CockpitHotspot {
  id: string;
  x: number; // percentage from left
  y: number; // percentage from top
  title: string;
  description: string;
}

export interface Subscriber {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  preferences: string;
  timestamp: string;
}
