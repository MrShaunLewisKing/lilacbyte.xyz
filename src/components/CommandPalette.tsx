import { useState, useEffect } from 'react';
import { sound } from '@/lib/audioEngine';
import {
  Search,
  Zap,
  Box,
  Music,
  Terminal,
  Activity,
  Palette,
  Volume2,
  VolumeX,
  Sparkles,
  Command,
  X
} from 'lucide-react';

interface CommandItem {
  id: string;
  title: string;
  category: 'Navigation' | 'Theme' | 'Audio' | 'Action';
  icon: typeof Zap;
  action: () => void;
  shortcut?: string;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: string) => void;
  onSelectTheme: (theme: string) => void;
}

export function CommandPalette({
  isOpen,
  onClose,
  onSelectTab,
  onSelectTheme
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');

  // Close on Escape or open on Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        sound.playClick(700);
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const commands: CommandItem[] = [
    {
      id: 'nav-canvas',
      title: 'Go to Spatial Canvas Hero',
      category: 'Navigation',
      icon: Sparkles,
      action: () => onSelectTab('hero'),
      shortcut: '1'
    },
    {
      id: 'nav-workflow',
      title: 'Go to Neural Workflow Studio',
      category: 'Navigation',
      icon: Zap,
      action: () => onSelectTab('workflow'),
      shortcut: '2'
    },
    {
      id: 'nav-forge',
      title: 'Go to Component Forge Lab',
      category: 'Navigation',
      icon: Box,
      action: () => onSelectTab('forge'),
      shortcut: '3'
    },
    {
      id: 'nav-audio',
      title: 'Go to Procedural Audio Synthesizer',
      category: 'Navigation',
      icon: Music,
      action: () => onSelectTab('audio'),
      shortcut: '4'
    },
    {
      id: 'nav-agent',
      title: 'Go to Multi-Agent AI Terminal',
      category: 'Navigation',
      icon: Terminal,
      action: () => onSelectTab('terminal'),
      shortcut: '5'
    },
    {
      id: 'nav-telemetry',
      title: 'Go to Neural Telemetry & Metrics',
      category: 'Navigation',
      icon: Activity,
      action: () => onSelectTab('telemetry'),
      shortcut: '6'
    },
    // Themes
    {
      id: 'th-obsidian',
      title: 'Switch to Obsidian Eclipse Theme',
      category: 'Theme',
      icon: Palette,
      action: () => onSelectTheme('theme-obsidian')
    },
    {
      id: 'th-cyberpunk',
      title: 'Switch to Cyberpunk Neon Theme',
      category: 'Theme',
      icon: Palette,
      action: () => onSelectTheme('theme-cyberpunk')
    },
    {
      id: 'th-emerald',
      title: 'Switch to Emerald Matrix Theme',
      category: 'Theme',
      icon: Palette,
      action: () => onSelectTheme('theme-emerald')
    },
    {
      id: 'th-solar',
      title: 'Switch to Solar Aurora Theme',
      category: 'Theme',
      icon: Palette,
      action: () => onSelectTheme('theme-solar')
    },
    {
      id: 'th-arctic',
      title: 'Switch to Arctic Quartz (Light Pro) Theme',
      category: 'Theme',
      icon: Palette,
      action: () => onSelectTheme('theme-arctic')
    },
    // Audio Actions
    {
      id: 'aud-toggle',
      title: 'Toggle Audio Synthesizer Mute',
      category: 'Audio',
      icon: sound.getMuted() ? Volume2 : VolumeX,
      action: () => sound.toggleMute()
    },
    {
      id: 'aud-chime',
      title: 'Play Quantum Harmonic Chime',
      category: 'Action',
      icon: Sparkles,
      action: () => sound.playChime(650)
    }
  ];

  const filtered = commands.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase()) ||
    c.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-start justify-center pt-24 px-4 animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl rounded-2xl glass-panel border border-white/20 shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
      >
        {/* Search Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10">
          <Search className="w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            autoFocus
            placeholder="Type a command or search action (e.g. 'Workflow', 'Cyberpunk', 'Theme')..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none text-foreground placeholder:text-muted-foreground text-sm focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Command List */}
        <div className="max-h-80 overflow-y-auto p-2 flex flex-col gap-1 custom-scrollbar">
          {filtered.length > 0 ? (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    sound.playClick(600);
                    item.action();
                    onClose();
                  }}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-white/10 text-left transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-muted-foreground group-hover:text-primary group-hover:border-primary/40 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-foreground">
                        {item.title}
                      </div>
                      <div className="text-[10px] text-muted-foreground font-mono">
                        {item.category}
                      </div>
                    </div>
                  </div>

                  {item.shortcut && (
                    <kbd className="px-2 py-0.5 rounded bg-white/10 border border-white/10 text-[10px] font-mono text-muted-foreground">
                      {item.shortcut}
                    </kbd>
                  )}
                </button>
              );
            })
          ) : (
            <div className="p-8 text-center text-xs text-muted-foreground font-mono">
              No matching commands found for "{query}".
            </div>
          )}
        </div>

        {/* Bottom Hint */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-black/40 border-t border-white/5 text-[11px] text-muted-foreground font-mono">
          <span className="flex items-center gap-1">
            <Command className="w-3 h-3" /> Press ESC to close
          </span>
          <span>AETHER Command Palette v2.4</span>
        </div>
      </div>
    </div>
  );
}
