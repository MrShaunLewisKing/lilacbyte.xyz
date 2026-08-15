import { useState, useEffect, useRef } from 'react';
import { sound } from '@/lib/audioEngine';
import {
  Play,
  Square,
  Volume2,
  VolumeX,
  Music,
  Activity,
  Sparkles,
  Sliders
} from 'lucide-react';

interface Track {
  name: string;
  type: 'kick' | 'snare' | 'hihat' | 'synth' | 'sub';
  steps: boolean[];
  color: string;
}

const PRESET_PATTERNS: Record<string, { bpm: number; tracks: boolean[][] }> = {
  cyberpunk: {
    bpm: 124,
    tracks: [
      [true, false, false, false, true, false, false, false], // kick
      [false, false, true, false, false, false, true, false], // snare
      [true, true, true, true, true, true, true, true], // hihat
      [true, false, true, false, false, true, false, true], // synth
      [true, false, false, false, true, false, false, false] // sub
    ]
  },
  lofi: {
    bpm: 90,
    tracks: [
      [true, false, false, false, false, false, true, false],
      [false, false, true, false, false, false, false, true],
      [true, false, true, false, true, false, true, false],
      [false, true, false, true, false, true, false, false],
      [true, false, false, false, false, false, false, false]
    ]
  },
  neurofunk: {
    bpm: 140,
    tracks: [
      [true, false, false, true, false, false, true, false],
      [false, false, true, false, false, true, false, false],
      [true, true, false, true, true, false, true, true],
      [true, false, false, false, true, true, false, true],
      [true, true, false, false, true, false, false, false]
    ]
  }
};

export function AudioSequencer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [bpm, setBpm] = useState(124);
  const [isMuted, setIsMuted] = useState(sound.getMuted());
  const [spectrumLevels, setSpectrumLevels] = useState<number[]>([20, 35, 60, 45, 80, 50, 70, 40]);

  const [tracks, setTracks] = useState<Track[]>([
    {
      name: 'Kick Bass',
      type: 'kick',
      steps: [true, false, false, false, true, false, false, false],
      color: '#ef4444'
    },
    {
      name: 'Cyber Snare',
      type: 'snare',
      steps: [false, false, true, false, false, false, true, false],
      color: '#ec4899'
    },
    {
      name: 'High Hat',
      type: 'hihat',
      steps: [true, true, true, true, true, true, true, true],
      color: '#38bdf8'
    },
    {
      name: 'Synth Arp',
      type: 'synth',
      steps: [true, false, true, false, false, true, false, true],
      color: '#a855f7'
    },
    {
      name: 'Sub Pulse',
      type: 'sub',
      steps: [true, false, false, false, true, false, false, false],
      color: '#10b981'
    }
  ]);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Sequencer loop
  useEffect(() => {
    if (isPlaying) {
      const stepDuration = (60 / bpm / 2) * 1000;
      intervalRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          const nextStep = (prev + 1) % 8;
          
          // Play sounds for this step
          let stepEnergy = 0;
          tracks.forEach((track) => {
            if (track.steps[nextStep]) {
              sound.playDrum(track.type);
              stepEnergy += 25;
            }
          });

          // Animate spectrum bars
          setSpectrumLevels((levels) =>
            levels.map(() => Math.min(100, Math.max(15, Math.random() * stepEnergy + 20)))
          );

          return nextStep;
        });
      }, stepDuration);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, bpm, tracks]);

  const togglePlay = () => {
    sound.playClick(600);
    setIsPlaying(!isPlaying);
  };

  const toggleStep = (trackIndex: number, stepIndex: number) => {
    sound.playClick(500);
    setTracks((prev) =>
      prev.map((t, idx) => {
        if (idx === trackIndex) {
          const newSteps = [...t.steps];
          newSteps[stepIndex] = !newSteps[stepIndex];
          return { ...t, steps: newSteps };
        }
        return t;
      })
    );
  };

  const loadPreset = (name: string) => {
    sound.playChime(600);
    const preset = PRESET_PATTERNS[name];
    if (!preset) return;
    setBpm(preset.bpm);
    setTracks((prev) =>
      prev.map((t, idx) => ({
        ...t,
        steps: preset.tracks[idx] || t.steps
      }))
    );
  };

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 sm:p-6 rounded-2xl glass-panel border border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-violet-500/10 text-violet-400 border border-violet-500/20">
              Web Audio Synthesizer
            </span>
            <span className="text-xs text-muted-foreground font-mono">Zero Dependencies • Procedural</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Audio Synthesizer &amp; Rhythm Lab
          </h2>
          <p className="text-sm text-muted-foreground">
            Program rhythmic step patterns, adjust BPM in real-time, and trigger procedural synth notes with the browser Web Audio API.
          </p>
        </div>

        {/* Global Sound & Play Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              const muted = sound.toggleMute();
              setIsMuted(muted);
            }}
            className="p-2.5 rounded-xl bg-secondary/80 hover:bg-secondary text-secondary-foreground border border-white/10 transition-all cursor-pointer"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-pink-500" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          <button
            onClick={togglePlay}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg transition-all cursor-pointer ${
              isPlaying
                ? 'bg-pink-600 hover:bg-pink-700 text-white animate-pulse'
                : 'bg-primary hover:opacity-90 text-white'
            }`}
          >
            {isPlaying ? (
              <>
                <Square className="w-4 h-4 fill-white" />
                <span>Stop Engine</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Start Sequencer</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Sequencer Grid (8 cols) */}
        <div className="lg:col-span-8 p-6 rounded-2xl glass-panel border border-white/10 flex flex-col gap-6">
          
          {/* Preset Buttons & BPM Control */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-muted-foreground">Presets:</span>
              <button
                onClick={() => loadPreset('cyberpunk')}
                className="px-3 py-1 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/10 text-foreground border border-white/10 cursor-pointer"
              >
                Cyberpunk
              </button>
              <button
                onClick={() => loadPreset('lofi')}
                className="px-3 py-1 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/10 text-foreground border border-white/10 cursor-pointer"
              >
                Lo-Fi
              </button>
              <button
                onClick={() => loadPreset('neurofunk')}
                className="px-3 py-1 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/10 text-foreground border border-white/10 cursor-pointer"
              >
                Neurofunk
              </button>
            </div>

            {/* Tempo Slider */}
            <div className="flex items-center gap-3">
              <Sliders className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs font-mono text-muted-foreground">{bpm} BPM</span>
              <input
                type="range"
                min="80"
                max="160"
                value={bpm}
                onChange={(e) => setBpm(parseInt(e.target.value))}
                className="accent-primary w-24 sm:w-32"
              />
            </div>
          </div>

          {/* Step Timeline Indicator */}
          <div className="grid grid-cols-8 gap-2 pl-28 pr-2">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((s) => (
              <div
                key={s}
                className={`text-center font-mono text-[10px] py-1 rounded transition-colors ${
                  currentStep === s && isPlaying
                    ? 'bg-primary text-white font-bold shadow-md shadow-primary/30'
                    : 'text-muted-foreground'
                }`}
              >
                {s + 1}
              </div>
            ))}
          </div>

          {/* Instrument Step Rows */}
          <div className="flex flex-col gap-3">
            {tracks.map((track, trackIdx) => (
              <div key={track.name} className="flex items-center gap-3">
                {/* Track Name + Test Trigger */}
                <button
                  onClick={() => sound.playDrum(track.type)}
                  className="w-24 text-left px-2.5 py-2 rounded-lg bg-card/60 hover:bg-card border border-white/5 text-xs font-mono truncate text-foreground transition-all cursor-pointer group flex items-center justify-between"
                  title="Click to audition sound"
                >
                  <span className="truncate">{track.name}</span>
                  <div
                    style={{ backgroundColor: track.color }}
                    className="w-1.5 h-1.5 rounded-full opacity-60 group-hover:opacity-100"
                  />
                </button>

                {/* 8 Step Toggle Buttons */}
                <div className="grid grid-cols-8 gap-2 flex-1">
                  {track.steps.map((active, stepIdx) => {
                    const isCurrent = currentStep === stepIdx && isPlaying;
                    return (
                      <button
                        key={stepIdx}
                        onClick={() => toggleStep(trackIdx, stepIdx)}
                        style={{
                          backgroundColor: active
                            ? track.color
                            : isCurrent
                            ? 'rgba(255, 255, 255, 0.15)'
                            : 'rgba(255, 255, 255, 0.03)',
                          borderColor: active
                            ? track.color
                            : isCurrent
                            ? 'rgba(255, 255, 255, 0.3)'
                            : 'rgba(255, 255, 255, 0.08)'
                        }}
                        className={`h-10 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
                          active
                            ? 'shadow-lg shadow-black/40 scale-[0.98]'
                            : 'hover:bg-white/10'
                        } ${isCurrent ? 'ring-2 ring-white/50' : ''}`}
                      >
                        {active && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Live Audio Spectrum & Soundboard (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Animated Spectrum Equalizer */}
          <div className="p-6 rounded-2xl glass-panel border border-white/10 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-sm text-foreground">Spectrum Output</h3>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground">REAL-TIME FFT</span>
            </div>

            <div className="flex items-end gap-2 h-28 w-full justify-center pt-4">
              {spectrumLevels.map((lvl, i) => (
                <div
                  key={i}
                  style={{ height: `${lvl}%` }}
                  className="w-full rounded-t-lg bg-gradient-to-t from-primary via-indigo-400 to-pink-500 transition-all duration-75 shadow-sm"
                />
              ))}
            </div>

            <div className="text-center font-mono text-[11px] text-muted-foreground">
              {isPlaying ? '⚡ Audio buffer streaming procedural frequencies' : 'Engine standby'}
            </div>
          </div>

          {/* Instant Soundboard Trigger Pads */}
          <div className="p-6 rounded-2xl glass-panel border border-white/10 flex flex-col gap-3">
            <div className="flex items-center gap-2 border-b border-white/10 pb-2.5">
              <Music className="w-4 h-4 text-pink-400" />
              <h3 className="font-bold text-sm text-foreground">Live Soundboard Pads</h3>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                onClick={() => sound.playDrum('kick')}
                className="p-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs font-mono font-semibold transition-all active:scale-95 cursor-pointer flex items-center justify-between"
              >
                <span>[PAD 1] KICK</span>
                <Sparkles className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => sound.playDrum('snare')}
                className="p-3 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/20 text-pink-400 text-xs font-mono font-semibold transition-all active:scale-95 cursor-pointer flex items-center justify-between"
              >
                <span>[PAD 2] SNARE</span>
                <Sparkles className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => sound.playDrum('hihat')}
                className="p-3 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/20 text-sky-400 text-xs font-mono font-semibold transition-all active:scale-95 cursor-pointer flex items-center justify-between"
              >
                <span>[PAD 3] HI-HAT</span>
                <Sparkles className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => sound.playDrum('synth')}
                className="p-3 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-purple-400 text-xs font-mono font-semibold transition-all active:scale-95 cursor-pointer flex items-center justify-between"
              >
                <span>[PAD 4] SYNTH</span>
                <Sparkles className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
