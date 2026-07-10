/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class AudioSynthManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  
  // Audio sources/nodes
  private engineOsc1: OscillatorNode | null = null;
  private engineOsc2: OscillatorNode | null = null;
  private engineGain: GainNode | null = null;
  private engineFilter: BiquadFilterNode | null = null;

  private windGain: GainNode | null = null;
  private windFilter: BiquadFilterNode | null = null;

  private turboOsc: OscillatorNode | null = null;
  private turboGain: GainNode | null = null;

  private isEnabled: boolean = false;

  constructor() {}

  public init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    this.ctx = new AudioContextClass();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    // Engine idle sound removed per request
    this.setupWind();
    this.setupTurbo();
  }

  private setupEngine() {
    if (!this.ctx || !this.masterGain) return;

    // Create a rumbly engine idle using 2 low frequency oscillators and a filter
    this.engineOsc1 = this.ctx.createOscillator();
    this.engineOsc1.type = "sawtooth";
    this.engineOsc1.frequency.setValueAtTime(42, this.ctx.currentTime); // Low fundamental

    this.engineOsc2 = this.ctx.createOscillator();
    this.engineOsc2.type = "triangle";
    this.engineOsc2.frequency.setValueAtTime(84, this.ctx.currentTime); // First harmonic

    this.engineFilter = this.ctx.createBiquadFilter();
    this.engineFilter.type = "lowpass";
    this.engineFilter.frequency.setValueAtTime(140, this.ctx.currentTime);
    this.engineFilter.Q.setValueAtTime(1.2, this.ctx.currentTime);

    this.engineGain = this.ctx.createGain();
    this.engineGain.gain.setValueAtTime(0.35, this.ctx.currentTime);

    // Dynamic pitch LFO to simulate the "breathing" engine idle rumble
    const lfo = this.ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.setValueAtTime(1.8, this.ctx.currentTime); // 1.8 Hz idle fluctuation

    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(1.5, this.ctx.currentTime); // Pitch depth in Hz

    lfo.connect(lfoGain);
    lfoGain.connect(this.engineOsc1.frequency);
    lfoGain.connect(this.engineOsc2.frequency);

    this.engineOsc1.connect(this.engineFilter);
    this.engineOsc2.connect(this.engineFilter);
    this.engineFilter.connect(this.engineGain);
    this.engineGain.connect(this.masterGain);

    this.engineOsc1.start();
    this.engineOsc2.start();
    lfo.start();
  }

  private setupWind() {
    if (!this.ctx || !this.masterGain) return;

    // Synthesize wind using a white/pink noise buffer
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    this.windFilter = this.ctx.createBiquadFilter();
    this.windFilter.type = "bandpass";
    this.windFilter.frequency.setValueAtTime(350, this.ctx.currentTime);
    this.windFilter.Q.setValueAtTime(1.0, this.ctx.currentTime);

    this.windGain = this.ctx.createGain();
    this.windGain.gain.setValueAtTime(0.12, this.ctx.currentTime);

    // LFO to simulate wind speed / gusts
    const windLfo = this.ctx.createOscillator();
    windLfo.type = "sine";
    windLfo.frequency.setValueAtTime(0.25, this.ctx.currentTime); // Slow, 0.25Hz

    const windLfoGain = this.ctx.createGain();
    windLfoGain.gain.setValueAtTime(120, this.ctx.currentTime); // Gust frequency delta

    windLfo.connect(windLfoGain);
    windLfoGain.connect(this.windFilter.frequency);

    whiteNoise.connect(this.windFilter);
    this.windFilter.connect(this.windGain);
    this.windGain.connect(this.masterGain);

    whiteNoise.start();
    windLfo.start();
  }

  private setupTurbo() {
    if (!this.ctx || !this.masterGain) return;

    // High frequency whistle that mimics a high rev turbo spool
    this.turboOsc = this.ctx.createOscillator();
    this.turboOsc.type = "sine";
    this.turboOsc.frequency.setValueAtTime(1450, this.ctx.currentTime);

    this.turboGain = this.ctx.createGain();
    this.turboGain.gain.setValueAtTime(0.005, this.ctx.currentTime); // Very quiet

    // Subtle turbo pitch fluctuation
    const turboLfo = this.ctx.createOscillator();
    turboLfo.type = "sine";
    turboLfo.frequency.setValueAtTime(3.5, this.ctx.currentTime);

    const turboLfoGain = this.ctx.createGain();
    turboLfoGain.gain.setValueAtTime(12, this.ctx.currentTime);

    turboLfo.connect(turboLfoGain);
    turboLfoGain.connect(this.turboOsc.frequency);

    this.turboOsc.connect(this.turboGain);
    this.turboGain.connect(this.masterGain);

    this.turboOsc.start();
    turboLfo.start();
  }

  public setEnabled(enable: boolean) {
    this.isEnabled = enable;
    if (enable) {
      this.init();
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume();
      }
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.linearRampToValueAtTime(1.0, this.ctx.currentTime + 0.5);
      }
    } else {
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.linearRampToValueAtTime(0.0, this.ctx.currentTime + 0.5);
      }
    }
  }

  public getIsEnabled() {
    return this.isEnabled;
  }

  public playClick() {
    if (!this.isEnabled || !this.ctx || !this.masterGain) return;

    const clickOsc = this.ctx.createOscillator();
    const clickGain = this.ctx.createGain();

    clickOsc.type = "sine";
    clickOsc.frequency.setValueAtTime(1800, this.ctx.currentTime);
    clickOsc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.04);

    clickGain.gain.setValueAtTime(0.05, this.ctx.currentTime);
    clickGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

    clickOsc.connect(clickGain);
    clickGain.connect(this.masterGain);

    clickOsc.start();
    clickOsc.stop(this.ctx.currentTime + 0.05);
  }

  public setTurboSpool(amount: number) {
    if (!this.isEnabled || !this.ctx || !this.turboGain || !this.turboOsc) return;
    // Amount ranges 0 to 1
    const targetGain = 0.005 + amount * 0.035;
    const targetFreq = 1450 + amount * 450;
    this.turboGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.1);
    this.turboOsc.frequency.setTargetAtTime(targetFreq, this.ctx.currentTime, 0.15);
  }
}

export const audioSynth = new AudioSynthManager();
