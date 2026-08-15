import { useState, useEffect } from 'react';
import { sound } from '@/lib/audioEngine';
import {
  Activity,
  Cpu,
  HardDrive,
  Globe,
  Radio,
  Clock,
  CheckCircle2,
  TrendingUp,
  Server
} from 'lucide-react';

export function TelemetryHub() {
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);
  const [timeframe, setTimeframe] = useState<'1m' | '15m' | '1h' | '24h'>('15m');
  const [chartData, setChartData] = useState<number[]>([42, 58, 65, 78, 72, 85, 92, 88, 96, 91, 98, 104]);
  const [metrics, setMetrics] = useState({
    tps: 18420,
    gpuLoad: 78.4,
    memoryUsed: 14.8,
    cacheHit: 99.2,
    activeNodes: 128
  });

  // Simulated live data stream
  useEffect(() => {
    if (!isLiveStreaming) return;
    const interval = setInterval(() => {
      setChartData((prev) => {
        const nextVal = Math.max(30, Math.min(120, prev[prev.length - 1] + (Math.random() - 0.48) * 14));
        return [...prev.slice(1), Math.round(nextVal)];
      });

      setMetrics((prev) => ({
        tps: Math.round(prev.tps + (Math.random() - 0.5) * 400),
        gpuLoad: parseFloat((prev.gpuLoad + (Math.random() - 0.5) * 2).toFixed(1)),
        memoryUsed: parseFloat((14.8 + Math.random() * 0.4).toFixed(1)),
        cacheHit: parseFloat((99.2 + (Math.random() - 0.5) * 0.4).toFixed(1)),
        activeNodes: 128
      }));
    }, 1200);

    return () => clearInterval(interval);
  }, [isLiveStreaming]);

  // Compute SVG spline path
  const svgWidth = 700;
  const svgHeight = 200;
  const maxVal = Math.max(...chartData, 120);
  const minVal = Math.min(...chartData, 20);

  const points = chartData.map((val, idx) => {
    const x = (idx / (chartData.length - 1)) * svgWidth;
    const y = svgHeight - ((val - minVal) / (maxVal - minVal || 1)) * (svgHeight - 40) - 20;
    return { x, y };
  });

  const pathD = points.reduce((acc, p, i, arr) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = arr[i - 1];
    const cx = (prev.x + p.x) / 2;
    return `${acc} C ${cx} ${prev.y}, ${cx} ${p.y}, ${p.x} ${p.y}`;
  }, '');

  const areaD = `${pathD} L ${svgWidth} ${svgHeight} L 0 ${svgHeight} Z`;

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 sm:p-6 rounded-2xl glass-panel border border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Live Telemetry Stream
            </span>
            <span className="text-xs text-muted-foreground font-mono">128 Distributed Compute Nodes</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Neural Cluster Telemetry &amp; Metrics
          </h2>
          <p className="text-sm text-muted-foreground">
            Monitor real-time throughput TPS, GPU compute clusters, and latency benchmarks across the global neural grid.
          </p>
        </div>

        {/* Live Stream Toggle & Timeframe */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-background/80 border border-white/10 text-xs">
            {(['1m', '15m', '1h', '24h'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => {
                  sound.playClick(600);
                  setTimeframe(tf);
                }}
                className={`px-2.5 py-1 rounded-lg font-mono transition-all ${
                  timeframe === tf
                    ? 'bg-primary text-primary-foreground font-semibold shadow'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              sound.playClick(700);
              setIsLiveStreaming(!isLiveStreaming);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all cursor-pointer ${
              isLiveStreaming
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-muted text-muted-foreground border-white/10'
            }`}
          >
            <Radio className={`w-3.5 h-3.5 ${isLiveStreaming ? 'animate-pulse' : ''}`} />
            <span>{isLiveStreaming ? 'Streaming Live' : 'Paused'}</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl glass-panel border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-medium">Throughput</span>
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-bold font-mono text-foreground">
            {metrics.tps.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">TPS</span>
          </div>
          <div className="text-[11px] text-emerald-400 font-mono mt-1 flex items-center gap-1">
            <span>+14.2%</span> vs last epoch
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-medium">GPU Tensor Load</span>
            <Cpu className="w-4 h-4 text-pink-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-foreground">
            {metrics.gpuLoad}%
          </div>
          <div className="text-[11px] text-muted-foreground font-mono mt-1">
            Sub-12ms pipeline latency
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-medium">VRAM Allocation</span>
            <HardDrive className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-foreground">
            {metrics.memoryUsed} <span className="text-xs font-normal text-muted-foreground">/ 32 GB</span>
          </div>
          <div className="text-[11px] text-emerald-400 font-mono mt-1">
            Optimal allocation
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-medium">Cache Hit Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-foreground">
            {metrics.cacheHit}%
          </div>
          <div className="text-[11px] text-emerald-400 font-mono mt-1">
            Vector index warm
          </div>
        </div>

      </div>

      {/* Real-time SVG Spline Throughput Chart */}
      <div className="p-6 rounded-2xl glass-panel border border-white/10 flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            <h3 className="font-bold text-sm text-foreground">Global Neural Throughput</h3>
          </div>
          <span className="text-xs font-mono text-muted-foreground">
            Tokens Processed / Second
          </span>
        </div>

        {/* SVG Chart */}
        <div className="w-full h-56 relative overflow-hidden flex items-center justify-center">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="50%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>

            {/* Background Grid Lines */}
            {[40, 80, 120, 160].map((y) => (
              <line
                key={y}
                x1="0"
                y1={y}
                x2={svgWidth}
                y2={y}
                stroke="rgba(255, 255, 255, 0.05)"
                strokeDasharray="4, 4"
              />
            ))}

            {/* Gradient Area */}
            <path d={areaD} fill="url(#areaGradient)" />

            {/* Glowing Spline Line */}
            <path
              d={pathD}
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Points on curve */}
            {points.map((p, i) => (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r="4"
                className="fill-white stroke-primary stroke-2 transition-all duration-300"
              />
            ))}
          </svg>
        </div>
      </div>

      {/* Global Node Latencies List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="p-5 rounded-2xl glass-panel border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-indigo-400" />
            <div>
              <div className="text-xs font-bold text-foreground">US-East (Virginia)</div>
              <div className="text-[10px] text-muted-foreground font-mono">48 Clusters</div>
            </div>
          </div>
          <div className="text-right font-mono">
            <div className="text-xs font-bold text-emerald-400">14 ms</div>
            <div className="text-[10px] text-muted-foreground">99.99% Up</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Server className="w-5 h-5 text-pink-400" />
            <div>
              <div className="text-xs font-bold text-foreground">EU-Central (Frankfurt)</div>
              <div className="text-[10px] text-muted-foreground font-mono">36 Clusters</div>
            </div>
          </div>
          <div className="text-right font-mono">
            <div className="text-xs font-bold text-emerald-400">22 ms</div>
            <div className="text-[10px] text-muted-foreground">100% Up</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-cyan-400" />
            <div>
              <div className="text-xs font-bold text-foreground">AP-Northeast (Tokyo)</div>
              <div className="text-[10px] text-muted-foreground font-mono">44 Clusters</div>
            </div>
          </div>
          <div className="text-right font-mono">
            <div className="text-xs font-bold text-emerald-400">38 ms</div>
            <div className="text-[10px] text-muted-foreground">99.98% Up</div>
          </div>
        </div>

      </div>

    </div>
  );
}
