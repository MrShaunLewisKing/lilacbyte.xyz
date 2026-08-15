import { useEffect, useRef, useState, useCallback } from 'react';
import { sound } from '@/lib/audioEngine';
import { Sparkles, Zap, Radio, Orbit, Activity, RefreshCw } from 'lucide-react';

export type VisualMode = 'constellation' | 'quantum' | 'matrix' | 'cyberpulse' | 'warp';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  color: string;
  alpha: number;
  angle?: number;
  speed?: number;
  char?: string;
}

interface ParticleHeroProps {
  currentTheme: string;
  onExploreClick?: () => void;
}

export function ParticleHero({ currentTheme, onExploreClick }: ParticleHeroProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mode, setMode] = useState<VisualMode>('constellation');
  const [particleCount, setParticleCount] = useState<number>(85);
  const [fps, setFps] = useState<number>(60);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const mouseRef = useRef<{ x: number; y: number; isDown: boolean }>({ x: -1000, y: -1000, isDown: false });
  const particlesRef = useRef<Particle[]>([]);
  const animFrameIdRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const frameCountRef = useRef<number>(0);
  const fpsTimerRef = useRef<number>(performance.now());

  // Get theme colors
  const getThemePalette = useCallback(() => {
    switch (currentTheme) {
      case 'theme-cyberpunk':
        return ['#ec4899', '#8b5cf6', '#06b6d4', '#f43f5e', '#a855f7'];
      case 'theme-emerald':
        return ['#10b981', '#34d399', '#059669', '#6ee7b7', '#047857'];
      case 'theme-solar':
        return ['#f97316', '#fbbf24', '#ea580c', '#f59e0b', '#dc2626'];
      case 'theme-arctic':
        return ['#0284c7', '#38bdf8', '#6366f1', '#0ea5e9', '#2563eb'];
      default:
        return ['#6366f1', '#818cf8', '#a855f7', '#38bdf8', '#c084fc'];
    }
  }, [currentTheme]);

  // Initialize particles based on selected mode
  const initParticles = useCallback((width: number, height: number) => {
    const palette = getThemePalette();
    const particles: Particle[] = [];
    const matrixChars = '01アイウエオカキクケコサシスセソタチツテト0123456789ABCDEF$#@%&';

    for (let i = 0; i < particleCount; i++) {
      const color = palette[Math.floor(Math.random() * palette.length)];
      if (mode === 'matrix') {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: 0,
          vy: 2 + Math.random() * 4,
          radius: 12,
          baseRadius: 12,
          color,
          alpha: 0.3 + Math.random() * 0.7,
          char: matrixChars[Math.floor(Math.random() * matrixChars.length)]
        });
      } else if (mode === 'warp') {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.5 + Math.random() * 3;
        particles.push({
          x: width / 2 + (Math.random() - 0.5) * 50,
          y: height / 2 + (Math.random() - 0.5) * 50,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: 1 + Math.random() * 2.5,
          baseRadius: 1 + Math.random() * 2.5,
          color,
          alpha: 0.2 + Math.random() * 0.8,
          angle,
          speed
        });
      } else {
        // Constellation, quantum, cyberpulse
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          radius: 2 + Math.random() * 2.5,
          baseRadius: 2 + Math.random() * 2.5,
          color,
          alpha: 0.4 + Math.random() * 0.6,
          angle: Math.random() * Math.PI * 2
        });
      }
    }
    particlesRef.current = particles;
  }, [mode, particleCount, getThemePalette]);

  // Click explosion
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    sound.playLaser();

    const palette = getThemePalette();
    // Add temporary burst particles
    for (let i = 0; i < 20; i++) {
      const angle = (Math.PI * 2 * i) / 20;
      const speed = 4 + Math.random() * 5;
      particlesRef.current.push({
        x: clickX,
        y: clickY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 3 + Math.random() * 2,
        baseRadius: 3,
        color: palette[Math.floor(Math.random() * palette.length)],
        alpha: 1,
        speed
      });
    }
  };

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 650);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight || 650;
      initParticles(width, height);
    };

    window.addEventListener('resize', handleResize);
    initParticles(width, height);

    const render = () => {
      const now = performance.now();
      frameCountRef.current++;
      if (now - fpsTimerRef.current >= 1000) {
        setFps(Math.round((frameCountRef.current * 1000) / (now - fpsTimerRef.current)));
        frameCountRef.current = 0;
        fpsTimerRef.current = now;
      }
      lastTimeRef.current = now;

      ctx.clearRect(0, 0, width, height);

      const mouse = mouseRef.current;
      const particles = particlesRef.current;

      if (mode === 'constellation') {
        // Draw constellation lines
        const maxDist = 130;
        for (let i = 0; i < particles.length; i++) {
          const p1 = particles[i];
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < maxDist) {
              const alpha = (1 - dist / maxDist) * 0.25;
              ctx.strokeStyle = p1.color;
              ctx.globalAlpha = alpha;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }

          // Connect to mouse
          const mdx = p1.x - mouse.x;
          const mdy = p1.y - mouse.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mdist < 180) {
            const mAlpha = (1 - mdist / 180) * 0.6;
            ctx.strokeStyle = p1.color;
            ctx.globalAlpha = mAlpha;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();

            // Slight repulsion/attraction
            p1.x += (mdx / mdist) * 1.5;
            p1.y += (mdy / mdist) * 1.5;
          }

          // Update & draw particle
          p1.x += p1.vx;
          p1.y += p1.vy;
          if (p1.x < 0 || p1.x > width) p1.vx *= -1;
          if (p1.y < 0 || p1.y > height) p1.vy *= -1;

          ctx.globalAlpha = p1.alpha;
          ctx.fillStyle = p1.color;
          ctx.beginPath();
          ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (mode === 'quantum') {
        const time = now * 0.002;
        particles.forEach((p, idx) => {
          const wave = Math.sin(time + idx * 0.1) * 2;
          p.x += p.vx + wave;
          p.y += p.vy + Math.cos(time + idx * 0.1) * 2;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          // Glowing aura
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 12;
          ctx.shadowColor = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 1.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        });
      } else if (mode === 'matrix') {
        ctx.font = '12px monospace';
        particles.forEach((p) => {
          p.y += p.vy;
          if (p.y > height) {
            p.y = 0;
            p.x = Math.random() * width;
          }
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          if (p.char) {
            ctx.fillText(p.char, p.x, p.y);
          }
        });
      } else if (mode === 'cyberpulse') {
        const time = now * 0.003;
        particles.forEach((p, idx) => {
          const pulseRadius = p.baseRadius + Math.sin(time + idx) * 3;
          p.x += p.vx * 1.2;
          p.y += p.vy * 1.2;
          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;

          ctx.globalAlpha = p.alpha;
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(1, pulseRadius), 0, Math.PI * 2);
          ctx.stroke();

          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.baseRadius * 0.5, 0, Math.PI * 2);
          ctx.fill();
        });
      } else if (mode === 'warp') {
        particles.forEach((p) => {
          p.x += p.vx * 2;
          p.y += p.vy * 2;
          p.radius += 0.05;

          const dx = p.x - width / 2;
          const dy = p.y - height / 2;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (p.x < -50 || p.x > width + 50 || p.y < -50 || p.y > height + 50 || dist > Math.max(width, height)) {
            p.x = width / 2 + (Math.random() - 0.5) * 40;
            p.y = height / 2 + (Math.random() - 0.5) * 40;
            const angle = Math.random() * Math.PI * 2;
            const speed = 1 + Math.random() * 4;
            p.vx = Math.cos(angle) * speed;
            p.vy = Math.sin(angle) * speed;
            p.radius = p.baseRadius;
          }

          ctx.globalAlpha = Math.min(1, p.alpha * (dist / 100));
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.min(6, p.radius), 0, Math.PI * 2);
          ctx.fill();
        });
      }

      ctx.globalAlpha = 1;
      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [mode, initParticles]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseRef.current.x = x;
    mouseRef.current.y = y;
    setMousePos({ x: Math.round(x), y: Math.round(y) });
  };

  const handleMouseLeave = () => {
    mouseRef.current.x = -1000;
    mouseRef.current.y = -1000;
    setMousePos(null);
  };

  const modesList: { id: VisualMode; label: string; icon: typeof Sparkles }[] = [
    { id: 'constellation', label: 'Constellation', icon: Orbit },
    { id: 'quantum', label: 'Quantum Wave', icon: Activity },
    { id: 'matrix', label: 'Matrix Stream', icon: Zap },
    { id: 'cyberpulse', label: 'Cyber Pulse', icon: Radio },
    { id: 'warp', label: 'Warp Speed', icon: Sparkles }
  ];

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 glass-panel shadow-2xl">
      {/* Background Canvas */}
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="w-full h-[580px] sm:h-[640px] cursor-crosshair block"
      />

      {/* Floating Foreground Overlay */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 sm:p-10 bg-gradient-to-t from-background/90 via-transparent to-background/40">
        
        {/* Top Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pointer-events-auto">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/70 border border-white/10 backdrop-blur-md text-xs font-mono text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-foreground font-semibold">NEURAL FIELD ONLINE</span>
            <span className="text-white/30">|</span>
            <span>{fps} FPS</span>
            {mousePos && (
              <>
                <span className="text-white/30">|</span>
                <span>X:{mousePos.x} Y:{mousePos.y}</span>
              </>
            )}
          </div>

          {/* Mode Selector Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-background/80 border border-white/10 backdrop-blur-md">
            {modesList.map((m) => {
              const Icon = m.icon;
              const isActive = mode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => {
                    sound.playClick(650);
                    setMode(m.id);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-lg'
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">{m.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Center Hero Statement */}
        <div className="max-w-2xl my-auto text-left pointer-events-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-primary/10 border border-primary/20 text-primary text-xs font-mono font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 animate-spin" /> Autonomous Intelligence v3.4
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.1] mb-4 text-foreground">
            The Spatial Canvas for <span className="bg-gradient-to-r from-primary via-indigo-400 to-pink-500 bg-clip-text text-transparent">Next-Gen Intelligence.</span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6 font-normal">
            Harness high-density neural workflows, real-time procedural audio synthesis, visual generative pipelines, and self-orchestrating multi-agent networks.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => {
                sound.playChime(600);
                if (onExploreClick) onExploreClick();
              }}
              className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-xl hover:opacity-90 transition-all flex items-center gap-2 group cursor-pointer"
            >
              <span>Launch Workflow Studio</span>
              <Zap className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            </button>

            <button
              onClick={() => {
                sound.playClick(400);
                setParticleCount(prev => (prev >= 150 ? 50 : prev + 30));
              }}
              className="px-4 py-3 rounded-xl bg-secondary/80 border border-white/10 text-secondary-foreground font-medium text-sm hover:bg-secondary transition-all flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Particles: {particleCount}</span>
            </button>
          </div>
        </div>

        {/* Bottom Interactive Hint */}
        <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
          <span>💡 Click anywhere on canvas to trigger particle shockwave</span>
          <span className="hidden sm:inline">Move mouse to bend gravitational fields</span>
        </div>

      </div>
    </div>
  );
}
