import { useState, useRef } from 'react';
import { sound } from '@/lib/audioEngine';
import {
  Sparkles,
  Copy,
  Check,
  Code2,
  SlidersHorizontal,
  Box,
  Radio,
  Activity,
  Gauge
} from 'lucide-react';

type ComponentType = 'glass-card' | 'hud-gauge' | 'spectrum-box' | 'radial-dial';

export function ComponentForge() {
  const [activeComponent, setActiveComponent] = useState<ComponentType>('glass-card');
  const [blur, setBlur] = useState(16);
  const [borderRadius, setBorderRadius] = useState(16);
  const [glowIntensity, setGlowIntensity] = useState(60);
  const [accentColor, setAccentColor] = useState('#6366f1');
  const [tiltAngle, setTiltAngle] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);
  const [dialValue, setDialValue] = useState(74);
  const [shimmer, setShimmer] = useState(true);

  const previewCardRef = useRef<HTMLDivElement | null>(null);

  // 3D Parallax Tilt Handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!previewCardRef.current) return;
    const rect = previewCardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateX = -(y / (rect.height / 2)) * 12;
    const rotateY = (x / (rect.width / 2)) * 12;
    setTiltAngle({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTiltAngle({ x: 0, y: 0 });
  };

  // Generate dynamic React code
  const getGeneratedCode = () => {
    switch (activeComponent) {
      case 'glass-card':
        return `// Spatial Glassmorphic 3D Parallax Card
export function SpatialCard() {
  return (
    <div 
      className="relative p-8 rounded-[${borderRadius}px] transition-all duration-200"
      style={{
        background: 'radial-gradient(120% 120% at 50% 0%, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)',
        backdropFilter: 'blur(${blur}px)',
        border: '1px solid rgba(255,255,255,0.12)',
        boxShadow: '0 20px 50px -10px ${accentColor}${Math.round(glowIntensity * 0.5).toString(16).padStart(2, '0')}'
      }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-3 h-3 rounded-full bg-[${accentColor}] animate-pulse" />
        <span className="text-xs font-mono tracking-widest text-slate-400">NEURAL CORE</span>
      </div>
      <h3 className="text-xl font-bold text-white mb-2">Autonomous Quantum Engine</h3>
      <p className="text-sm text-slate-400 leading-relaxed">
        High-throughput vector indexing with spatial compute field isolation.
      </p>
    </div>
  );
}`;
      case 'hud-gauge':
        return `// Cyber HUD Telemetry Gauge
export function HudGauge() {
  return (
    <div className="p-6 rounded-[${borderRadius}px] border border-[${accentColor}]/30 bg-black/60 backdrop-blur-[${blur}px]">
      <div className="flex justify-between items-center text-xs font-mono text-[${accentColor}] mb-4">
        <span>[SYS.METRIC_01]</span>
        <span>${dialValue}% LOAD</span>
      </div>
      <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/10">
        <div 
          className="h-full rounded-full transition-all duration-300"
          style={{ 
            width: '${dialValue}%', 
            background: 'linear-gradient(90deg, ${accentColor}, #ec4899)',
            boxShadow: '0 0 12px ${accentColor}'
          }} 
        />
      </div>
    </div>
  );
}`;
      case 'spectrum-box':
        return `// Audio-Reactive Equalizer Sandbox
export function SpectrumBox() {
  return (
    <div className="p-6 rounded-[${borderRadius}px] bg-card/60 backdrop-blur-[${blur}px] border border-white/10">
      <div className="flex items-end gap-1.5 h-20 justify-center">
        {[40, 75, 90, 60, 30, 85, 95, 50, 70, 45].map((h, i) => (
          <div
            key={i}
            className="w-2.5 rounded-full transition-all duration-150"
            style={{
              height: \`\${h}%\`,
              background: '${accentColor}',
              boxShadow: '0 0 10px ${accentColor}'
            }}
          />
        ))}
      </div>
    </div>
  );
}`;
      case 'radial-dial':
        return `// Interactive Neomorphic Synth Dial
export function SynthDial({ value = ${dialValue} }) {
  return (
    <div className="w-36 h-36 rounded-full flex items-center justify-center p-2 border border-[${accentColor}]/40 bg-card/80 backdrop-blur-[${blur}px] shadow-2xl">
      <div className="text-center font-mono">
        <div className="text-2xl font-bold text-[${accentColor}]">\${value}°</div>
        <div className="text-[10px] text-muted-foreground uppercase">Phase Mod</div>
      </div>
    </div>
  );
}`;
    }
  };

  const handleCopyCode = () => {
    sound.playChime(600);
    navigator.clipboard.writeText(getGeneratedCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const components: { id: ComponentType; label: string; icon: typeof Box }[] = [
    { id: 'glass-card', label: '3D Spatial Card', icon: Box },
    { id: 'hud-gauge', label: 'Cyber HUD Gauge', icon: Gauge },
    { id: 'spectrum-box', label: 'Spectrum Equalizer', icon: Activity },
    { id: 'radial-dial', label: 'Neomorphic Dial', icon: Radio }
  ];

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 sm:p-6 rounded-2xl glass-panel border border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-pink-500/10 text-pink-500 border border-pink-500/20">
              Real-time Generative Sandbox
            </span>
            <span className="text-xs text-muted-foreground font-mono">Live CSS &amp; React AST</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Component Forge &amp; UI Lab
          </h2>
          <p className="text-sm text-muted-foreground">
            Design, customize, and test high-fidelity UI primitives with real-time 3D parallax and live code synthesis.
          </p>
        </div>

        {/* Component Selector */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-background/80 border border-white/10">
          {components.map((c) => {
            const Icon = c.icon;
            const isActive = activeComponent === c.id;
            return (
              <button
                key={c.id}
                onClick={() => {
                  sound.playClick(600);
                  setActiveComponent(c.id);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{c.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Controls + Interactive Live Preview + Code Exporter */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Parameter Controls (4 cols) */}
        <div className="lg:col-span-4 p-6 rounded-2xl glass-panel border border-white/10 flex flex-col gap-5">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <SlidersHorizontal className="w-4 h-4 text-primary" />
            <h3 className="font-bold text-sm text-foreground">Styling Parameters</h3>
          </div>

          {/* Backdrop Blur */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Backdrop Blur</span>
              <span className="font-mono text-foreground font-semibold">{blur}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="40"
              value={blur}
              onChange={(e) => setBlur(parseInt(e.target.value))}
              className="accent-primary w-full"
            />
          </div>

          {/* Border Radius */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Border Radius</span>
              <span className="font-mono text-foreground font-semibold">{borderRadius}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="36"
              value={borderRadius}
              onChange={(e) => setBorderRadius(parseInt(e.target.value))}
              className="accent-primary w-full"
            />
          </div>

          {/* Glow Intensity */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Luminescence Glow</span>
              <span className="font-mono text-foreground font-semibold">{glowIntensity}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={glowIntensity}
              onChange={(e) => setGlowIntensity(parseInt(e.target.value))}
              className="accent-primary w-full"
            />
          </div>

          {/* Dial / Metric value */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Component State / Value</span>
              <span className="font-mono text-foreground font-semibold">{dialValue}</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={dialValue}
              onChange={(e) => {
                setDialValue(parseInt(e.target.value));
                sound.playClick(300 + parseInt(e.target.value) * 4);
              }}
              className="accent-pink-500 w-full"
            />
          </div>

          {/* Accent Color Palette */}
          <div className="flex flex-col gap-2">
            <label className="text-xs text-muted-foreground">Accent Wavelength</label>
            <div className="flex items-center gap-2">
              {['#6366f1', '#ec4899', '#10b981', '#f97316', '#06b6d4', '#8b5cf6'].map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    sound.playClick(700);
                    setAccentColor(color);
                  }}
                  style={{ backgroundColor: color }}
                  className={`w-7 h-7 rounded-full transition-transform cursor-pointer ${
                    accentColor === color ? 'scale-125 ring-2 ring-white' : 'hover:scale-110'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Hologram Shimmer Toggle */}
          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <span className="text-xs text-muted-foreground">Hologram Shimmer</span>
            <button
              onClick={() => {
                sound.playClick(500);
                setShimmer(!shimmer);
              }}
              className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                shimmer ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${
                  shimmer ? 'right-0.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

        </div>

        {/* Center: Live 3D Interactive Component Canvas (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* 3D Preview Stage */}
          <div
            ref={previewCardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="min-h-[300px] flex items-center justify-center p-8 rounded-2xl glass-panel border border-white/10 relative overflow-hidden [perspective:1000px]"
          >
            {/* Background grid */}
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

            {/* 3D Transform Container */}
            <div
              style={{
                transform: `rotateX(${tiltAngle.x}deg) rotateY(${tiltAngle.y}deg)`,
                transition: 'transform 0.1s ease-out'
              }}
              className="relative z-10 w-full max-w-md select-none"
            >
              {activeComponent === 'glass-card' && (
                <div
                  style={{
                    backdropFilter: `blur(${blur}px)`,
                    borderRadius: `${borderRadius}px`,
                    boxShadow: `0 20px 50px -10px ${accentColor}${Math.round(glowIntensity * 0.8).toString(16).padStart(2, '0')}`,
                    borderColor: shimmer ? accentColor : 'rgba(255, 255, 255, 0.15)'
                  }}
                  className="p-7 border bg-card/80 transition-all relative overflow-hidden group"
                >
                  {/* Hologram Glint Overlay */}
                  {shimmer && (
                    <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/10 to-transparent rotate-45 group-hover:translate-x-full duration-1000 transition-transform pointer-events-none" />
                  )}

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div
                        style={{ backgroundColor: accentColor }}
                        className="w-3 h-3 rounded-full animate-ping"
                      />
                      <span className="text-xs font-mono tracking-widest text-muted-foreground uppercase">
                        SPATIAL NODE
                      </span>
                    </div>
                    <Sparkles style={{ color: accentColor }} className="w-4 h-4" />
                  </div>

                  <h3 className="text-xl font-bold text-foreground mb-2">
                    Neural Mesh Architecture
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-5">
                    Real-time procedural UI component forged dynamically with custom shader parameters and interactive 3D gyroscope physics.
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs font-mono">
                    <span className="text-muted-foreground">Status: ACTIVE</span>
                    <span style={{ color: accentColor }} className="font-bold">
                      {dialValue}% SYNCHRONIZED
                    </span>
                  </div>
                </div>
              )}

              {activeComponent === 'hud-gauge' && (
                <div
                  style={{
                    backdropFilter: `blur(${blur}px)`,
                    borderRadius: `${borderRadius}px`,
                    borderColor: `${accentColor}50`,
                    boxShadow: `0 0 30px ${accentColor}${Math.round(glowIntensity * 0.4).toString(16).padStart(2, '0')}`
                  }}
                  className="p-6 border bg-black/80 font-mono flex flex-col gap-4"
                >
                  <div className="flex justify-between items-center text-xs">
                    <span style={{ color: accentColor }}>[SYSTEM_TELEMETRY.GPU]</span>
                    <span className="text-white font-bold">{dialValue}% LOAD</span>
                  </div>

                  <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/10">
                    <div
                      style={{
                        width: `${dialValue}%`,
                        backgroundColor: accentColor,
                        boxShadow: `0 0 12px ${accentColor}`
                      }}
                      className="h-full rounded-full transition-all duration-300"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-[10px] text-muted-foreground pt-2">
                    <div className="p-2 rounded bg-white/5 border border-white/5 text-center">
                      <div>CORE TEMP</div>
                      <div className="text-white font-bold mt-0.5">48.2°C</div>
                    </div>
                    <div className="p-2 rounded bg-white/5 border border-white/5 text-center">
                      <div>BANDWIDTH</div>
                      <div className="text-white font-bold mt-0.5">8.4 GB/s</div>
                    </div>
                    <div className="p-2 rounded bg-white/5 border border-white/5 text-center">
                      <div>EFFICIENCY</div>
                      <div className="text-white font-bold mt-0.5">99.8%</div>
                    </div>
                  </div>
                </div>
              )}

              {activeComponent === 'spectrum-box' && (
                <div
                  style={{
                    backdropFilter: `blur(${blur}px)`,
                    borderRadius: `${borderRadius}px`,
                    boxShadow: `0 10px 40px ${accentColor}25`
                  }}
                  className="p-8 border border-white/15 bg-card/80 flex flex-col gap-4 items-center"
                >
                  <div className="text-xs font-mono text-muted-foreground tracking-widest">
                    AUDIO FREQUENCY SPECTRUM
                  </div>
                  <div className="flex items-end gap-2 h-24 w-full justify-center">
                    {[35, 65, 88, 55, 25, 95, 100, 70, 80, 45, 60, 30].map((h, i) => (
                      <div
                        key={i}
                        className="w-3 rounded-full transition-all duration-200"
                        style={{
                          height: `${Math.min(100, (h * dialValue) / 70)}%`,
                          backgroundColor: accentColor,
                          boxShadow: `0 0 8px ${accentColor}`
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {activeComponent === 'radial-dial' && (
                <div className="flex items-center justify-center p-6">
                  <div
                    style={{
                      backdropFilter: `blur(${blur}px)`,
                      borderColor: `${accentColor}60`,
                      boxShadow: `0 0 35px ${accentColor}${Math.round(glowIntensity * 0.4).toString(16).padStart(2, '0')}`
                    }}
                    className="w-44 h-44 rounded-full border-2 bg-card/90 flex flex-col items-center justify-center relative shadow-2xl"
                  >
                    <div
                      style={{
                        transform: `rotate(${(dialValue / 100) * 360}deg)`,
                        transformOrigin: 'bottom center'
                      }}
                      className="absolute top-4 w-1 h-14 bg-gradient-to-t from-transparent to-white rounded-full transition-transform"
                    />
                    <div className="text-3xl font-black font-mono text-foreground">
                      {dialValue}°
                    </div>
                    <div
                      style={{ color: accentColor }}
                      className="text-[10px] font-mono uppercase tracking-widest mt-1"
                    >
                      QUANTUM PHASE
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Hint */}
            <div className="absolute bottom-3 left-4 text-[10px] text-muted-foreground font-mono">
              Hover &amp; move cursor to test 3D parallax physics
            </div>
          </div>

          {/* Generated Code Sandbox Output */}
          <div className="p-5 rounded-2xl glass-panel border border-white/10 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-primary" />
                <h3 className="font-bold text-sm text-foreground">Live Generated Component Source</h3>
              </div>

              <button
                onClick={handleCopyCode}
                className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold flex items-center gap-1.5 hover:opacity-90 transition-all cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy React Component'}</span>
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-black/70 border border-white/5 text-[11px] font-mono text-emerald-400 overflow-x-auto leading-relaxed max-h-48 custom-scrollbar">
              {getGeneratedCode()}
            </pre>
          </div>

        </div>

      </div>
    </div>
  );
}
