import { useState } from 'react';
import { sound } from '@/lib/audioEngine';
import {
  Sparkles,
  Zap,
  Box,
  Music,
  Terminal,
  Activity,
  Volume2,
  VolumeX,
  Palette,
  Search,
  Menu,
  X,
  Layers
} from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  currentTheme: string;
  onSelectTheme: (theme: string) => void;
  onOpenCommandPalette: () => void;
}

export function Navigation({
  activeTab,
  onSelectTab,
  currentTheme,
  onSelectTheme,
  onOpenCommandPalette
}: NavigationProps) {
  const [isMuted, setIsMuted] = useState(sound.getMuted());
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const tabs = [
    { id: 'hero', label: 'Spatial Field', icon: Sparkles },
    { id: 'workflow', label: 'Workflow Studio', icon: Zap },
    { id: 'forge', label: 'Component Forge', icon: Box },
    { id: 'audio', label: 'Audio Lab', icon: Music },
    { id: 'terminal', label: 'AI Terminal', icon: Terminal },
    { id: 'telemetry', label: 'Telemetry', icon: Activity }
  ];

  const themes = [
    { id: 'theme-obsidian', name: 'Obsidian Eclipse', color: '#6366f1' },
    { id: 'theme-cyberpunk', name: 'Cyberpunk Neon', color: '#ec4899' },
    { id: 'theme-emerald', name: 'Emerald Matrix', color: '#10b981' },
    { id: 'theme-solar', name: 'Solar Aurora', color: '#f97316' },
    { id: 'theme-arctic', name: 'Arctic Quartz', color: '#0284c7' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div
          onClick={() => {
            sound.playChime(600);
            onSelectTab('hero');
          }}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary via-indigo-500 to-pink-500 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <Layers className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold text-sm tracking-wider text-foreground">
              <span>AETHER</span>
              <span className="text-primary font-mono">//</span>
              <span className="text-xs font-mono text-muted-foreground uppercase">OS</span>
            </div>
          </div>
        </div>

        {/* Desktop Tab Navigation */}
        <nav className="hidden lg:flex items-center gap-1 p-1 rounded-xl bg-background/50 border border-white/10">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  sound.playClick(600);
                  onSelectTab(tab.id);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Actions (Command Palette, Audio, Theme, Mobile Burger) */}
        <div className="flex items-center gap-2">
          
          {/* Cmd+K Search Trigger */}
          <button
            onClick={() => {
              sound.playClick(700);
              onOpenCommandPalette();
            }}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-secondary/80 hover:bg-secondary text-muted-foreground hover:text-foreground border border-white/10 text-xs font-mono transition-all cursor-pointer"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Quick Search</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/10 text-[10px]">
              Ctrl+K
            </kbd>
          </button>

          {/* Sound FX Toggle */}
          <button
            onClick={() => {
              const muted = sound.toggleMute();
              setIsMuted(muted);
            }}
            className="p-2 rounded-xl bg-secondary/80 hover:bg-secondary text-secondary-foreground border border-white/10 transition-all cursor-pointer"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-pink-500" />
            ) : (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            )}
          </button>

          {/* Theme Picker Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                sound.playClick(600);
                setIsThemeMenuOpen(!isThemeMenuOpen);
              }}
              className="p-2 rounded-xl bg-secondary/80 hover:bg-secondary text-secondary-foreground border border-white/10 transition-all cursor-pointer flex items-center gap-1.5"
              title="Change Theme"
            >
              <Palette className="w-4 h-4 text-primary" />
            </button>

            {isThemeMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl glass-panel border border-white/15 shadow-2xl p-1.5 flex flex-col gap-1 z-50 animate-in fade-in zoom-in-95">
                <div className="text-[10px] font-mono text-muted-foreground px-2.5 py-1 uppercase tracking-wider">
                  Color Themes
                </div>
                {themes.map((th) => (
                  <button
                    key={th.id}
                    onClick={() => {
                      sound.playChime(650);
                      onSelectTheme(th.id);
                      setIsThemeMenuOpen(false);
                    }}
                    className={`flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium text-left transition-all cursor-pointer ${
                      currentTheme === th.id
                        ? 'bg-primary/20 text-foreground font-bold'
                        : 'hover:bg-white/5 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <span>{th.name}</span>
                    <div
                      style={{ backgroundColor: th.color }}
                      className="w-3 h-3 rounded-full border border-white/30"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Menu Burger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-secondary/80 text-secondary-foreground border border-white/10"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

        </div>

      </div>

      {/* Mobile Menu Dropdown Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 p-4 bg-background/95 backdrop-blur-2xl flex flex-col gap-2 animate-in slide-in-from-top duration-150">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  sound.playClick(600);
                  onSelectTab(tab.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-left transition-all ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
