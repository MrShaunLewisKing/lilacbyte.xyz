import { useState } from 'react';
import { useDiscordProfile } from '@/hooks/useDiscordProfile';
import { TopMusicPill } from '@/components/TopMusicPill';
import {
  Heart,
  Music,
  Copy,
  Check,
  ExternalLink,
  Moon,
  Sun,
  MessageCircle,
  FolderHeart,
  Globe,
  Quote,
  MapPin,
  Calendar,
  User,
  HeartHandshake,
  ThumbsUp,
  ThumbsDown,
  Smile,
  Sparkle,
  Gamepad2
} from 'lucide-react';

interface LilacCardProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

type TabType = 'about' | 'links';

export function LilacCard({ isDark, onToggleTheme }: LilacCardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('about');
  const [copiedDiscord, setCopiedDiscord] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Live Discord profile (updates every 3 minutes in background)
  const { profile } = useDiscordProfile();

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleCopyDiscord = () => {
    navigator.clipboard.writeText(profile.tag || 'lilacbyte');
    setCopiedDiscord(true);
    showToast(`Copied Discord: @${profile.tag || 'lilacbyte'} 🌸`);
    setTimeout(() => setCopiedDiscord(false), 2000);
  };

  // Discord Status Badge styling (Authentic Discord icons & colors)
  const getStatusDot = () => {
    switch (profile.status) {
      case 'online':
        return (
          <div
            className="w-5 h-5 rounded-full bg-[#23a55a] border-[3px] border-white dark:border-[#1a0f16] shadow-sm flex items-center justify-center relative"
            title="Discord: Online"
          />
        );
      case 'idle':
        return (
          <div
            className="w-5 h-5 rounded-full bg-[#f0b232] border-[3px] border-white dark:border-[#1a0f16] shadow-sm flex items-center justify-center relative overflow-hidden"
            title="Discord: Idle"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-white dark:bg-[#1a0f16] -top-1 -left-1 absolute" />
          </div>
        );
      case 'dnd':
        return (
          <div
            className="w-5 h-5 rounded-full bg-[#f23f43] border-[3px] border-white dark:border-[#1a0f16] shadow-sm flex items-center justify-center relative"
            title="Discord: Do Not Disturb"
          >
            <div className="w-2.5 h-[2.5px] bg-white rounded-full" />
          </div>
        );
      default:
        return (
          <div
            className="w-5 h-5 rounded-full bg-[#80848e] border-[3px] border-white dark:border-[#1a0f16] shadow-sm flex items-center justify-center relative"
            title="Discord: Offline"
          >
            <div className="w-2 h-2 rounded-full bg-white dark:bg-[#1a0f16]" />
          </div>
        );
    }
  };

  const quickStats = [
    { label: 'Age', value: '22', icon: Calendar },
    { label: 'From', value: 'United Kingdom', icon: MapPin },
    { label: 'Gender', value: 'Female (Femboy)', icon: User },
    { label: 'Pronouns', value: 'she/her', icon: HeartHandshake },
    { label: 'Nicknames', value: 'Lilac, Lily, Lili', icon: Smile }
  ];

  const likesList = [
    'Pastel Aesthetics',
    'Iced Matcha Latte',
    'Cute Plushies',
    'Rainy Days',
    'Cozy Vibes',
    'Sweet Strawberries'
  ];

  const dislikesList = [
    'Loud / Sudden Noises',
    'Cold Bitter Coffee',
    'Toxicity & Drama',
    'Slow Internet',
    'Spiders & Bugs',
    'Scorching Heat'
  ];

  const hobbiesList = [
    'Cozy Gaming',
    'Digital Art & UI',
    'Lo-Fi & Music',
    'Cafe Exploring',
    'Plant Caring',
    'Web Crafting'
  ];

  const gamesList = [
    'Valorant',
    'Genshin Impact',
    'Honkai: Star Rail',
    'Minecraft',
    'League of Legends',
    'Overwatch 2',
    'Roblox',
    'Osu!',
    'Animal Crossing'
  ];

  return (
    <div className="w-full max-w-[430px] mx-auto z-10 flex flex-col items-center gap-3 px-3 py-4">
      
      {/* Top Floating Header with Song Pill & Theme Switcher */}
      <div className="w-full flex justify-between items-center px-2">
        <TopMusicPill />

        <button
          onClick={onToggleTheme}
          className="p-2 rounded-full bg-white/80 dark:bg-black/40 border border-pink-300/40 dark:border-pink-500/20 text-pink-600 dark:text-pink-300 backdrop-blur-md shadow-sm hover:scale-105 transition-all cursor-pointer"
          title="Toggle light/dark"
        >
          {isDark ? (
            <Sun className="w-3.5 h-3.5 fill-current" fillOpacity={0.25} />
          ) : (
            <Moon className="w-3.5 h-3.5 fill-current" fillOpacity={0.25} />
          )}
        </button>
      </div>

      {/* Main Carrd Container */}
      <div className="w-full rounded-[2rem] pink-glass overflow-hidden flex flex-col items-center text-center relative transition-all duration-300 animate-in fade-in zoom-in-95">
        
        {/* Discord Live Banner Header */}
        <div className="w-full h-32 relative bg-gradient-to-r from-pink-300 via-rose-300 to-pink-400 overflow-hidden">
          {profile.bannerURL ? (
            <img
              src={profile.bannerURL}
              alt="Discord Banner"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-pink-300 via-rose-200 to-pink-400 opacity-90" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Card Body */}
        <div className="w-full px-5 sm:px-7 pb-6 pt-0 flex flex-col items-center">
          
          {/* Discord Live Avatar + Status Dot */}
          <div className="relative -mt-14 mb-2.5 w-24 h-24">
            <div className="w-full h-full rounded-full p-1 bg-white dark:bg-[#1a0f16] shadow-xl border-2 border-pink-300/60 dark:border-pink-500/40 overflow-hidden">
              <img
                src={profile.avatarURL}
                alt={profile.global_name || 'Lilac'}
                className="w-full h-full rounded-full object-cover select-none"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            {/* Discord Status Dot */}
            <div className="absolute bottom-0 right-0 z-20" title={`Discord: ${profile.status}`}>
              {getStatusDot()}
            </div>
          </div>

          {/* Name & Identity */}
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {profile.global_name || 'Lilac'}
          </h1>

          <p className="text-xs text-muted-foreground mt-0.5 font-medium font-mono">
            @{profile.tag || profile.username || 'lilacbyte'} • she/her
          </p>

          {/* Status Box: Only triggers if Discord Custom Status or Activity is detected */}
          {profile.customStatus ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100/70 dark:bg-pink-950/40 border border-pink-200 dark:border-pink-800/40 text-[11px] text-pink-600 dark:text-pink-300 my-2 font-normal max-w-full truncate">
              <Quote className="w-3 h-3 text-pink-500 fill-current flex-shrink-0" fillOpacity={0.25} />
              <span className="truncate">{profile.customStatus}</span>
            </div>
          ) : profile.activity ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100/70 dark:bg-pink-950/40 border border-pink-200 dark:border-pink-800/40 text-[11px] text-pink-600 dark:text-pink-300 my-2 font-normal max-w-full truncate">
              <Heart className="w-3 h-3 fill-current text-pink-500 flex-shrink-0" fillOpacity={0.25} />
              <span className="truncate">{profile.activity}</span>
            </div>
          ) : null}

          {/* Navigation Tabs (About & Links) */}
          <div className="w-full grid grid-cols-2 gap-1.5 p-1 bg-pink-100/50 dark:bg-pink-950/30 rounded-xl my-3 border border-pink-200/50 dark:border-pink-900/30">
            <button
              onClick={() => setActiveTab('about')}
              className={`py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                activeTab === 'about'
                  ? 'bg-white dark:bg-pink-900/60 text-pink-600 dark:text-pink-200 shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              About
            </button>
            <button
              onClick={() => setActiveTab('links')}
              className={`py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                activeTab === 'links'
                  ? 'bg-white dark:bg-pink-900/60 text-pink-600 dark:text-pink-200 shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Links
            </button>
          </div>

          {/* Section Content Area */}
          <div className="w-full text-left mt-1 flex flex-col gap-3 min-h-[220px]">
            
            {/* TAB 1: ABOUT */}
            {activeTab === 'about' && (
              <div className="flex flex-col gap-3 animate-in fade-in duration-200 text-xs leading-relaxed text-foreground">
                
                {/* 1. Ordered Quick Info Grid (Half-Filled Duotone Icons) */}
                <div className="p-3.5 rounded-2xl bg-white/65 dark:bg-white/5 border border-pink-200/50 dark:border-pink-900/30 flex flex-col gap-2">
                  {quickStats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                      <div
                        key={stat.label}
                        className="flex items-center justify-between py-1 border-b border-pink-100/60 dark:border-pink-900/20 last:border-b-0 text-xs"
                      >
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Icon className="w-3.5 h-3.5 text-pink-500 fill-current" fillOpacity={0.25} />
                          <span className="font-medium">{stat.label}</span>
                        </div>
                        <span className="font-semibold text-foreground">{stat.value}</span>
                      </div>
                    );
                  })}
                </div>

                {/* 2. Likes Section with Pills (Half-Filled Icon) */}
                <div className="p-3.5 rounded-2xl bg-white/65 dark:bg-white/5 border border-pink-200/50 dark:border-pink-900/30 flex flex-col gap-2">
                  <div className="flex items-center gap-1.5 font-bold text-pink-600 dark:text-pink-300 text-xs">
                    <ThumbsUp className="w-3.5 h-3.5 fill-current text-pink-600 dark:text-pink-300" fillOpacity={0.25} />
                    <span>Likes</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {likesList.map((item) => (
                      <span
                        key={item}
                        className="px-2.5 py-1 rounded-full bg-pink-100/70 dark:bg-pink-950/50 border border-pink-200/50 dark:border-pink-800/30 text-[11px] font-medium text-pink-700 dark:text-pink-200"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 3. Dislikes Section with Pills (Half-Filled Icon) */}
                <div className="p-3.5 rounded-2xl bg-white/65 dark:bg-white/5 border border-pink-200/50 dark:border-pink-900/30 flex flex-col gap-2">
                  <div className="flex items-center gap-1.5 font-bold text-rose-500 dark:text-rose-400 text-xs">
                    <ThumbsDown className="w-3.5 h-3.5 fill-current text-rose-500 dark:text-rose-400" fillOpacity={0.25} />
                    <span>Dislikes</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {dislikesList.map((item) => (
                      <span
                        key={item}
                        className="px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/30 border border-rose-200/40 dark:border-rose-900/30 text-[11px] font-medium text-rose-600 dark:text-rose-300"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 4. Hobbies Section with Pills (Half-Filled Icon) */}
                <div className="p-3.5 rounded-2xl bg-white/65 dark:bg-white/5 border border-pink-200/50 dark:border-pink-900/30 flex flex-col gap-2">
                  <div className="flex items-center gap-1.5 font-bold text-purple-600 dark:text-purple-300 text-xs">
                    <Sparkle className="w-3.5 h-3.5 fill-current text-purple-600 dark:text-purple-300" fillOpacity={0.25} />
                    <span>Hobbies</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {hobbiesList.map((item) => (
                      <span
                        key={item}
                        className="px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950/40 border border-purple-200/40 dark:border-purple-900/30 text-[11px] font-medium text-purple-700 dark:text-purple-300"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 5. Games I Play Section with Pills (Half-Filled Icon) */}
                <div className="p-3.5 rounded-2xl bg-white/65 dark:bg-white/5 border border-pink-200/50 dark:border-pink-900/30 flex flex-col gap-2">
                  <div className="flex items-center gap-1.5 font-bold text-pink-600 dark:text-pink-300 text-xs">
                    <Gamepad2 className="w-3.5 h-3.5 fill-current text-pink-600 dark:text-pink-300" fillOpacity={0.25} />
                    <span>Games I Play</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {gamesList.map((item) => (
                      <span
                        key={item}
                        className="px-2.5 py-1 rounded-full bg-pink-100/70 dark:bg-pink-950/50 border border-pink-200/50 dark:border-pink-800/30 text-[11px] font-medium text-pink-700 dark:text-pink-200"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: LINKS */}
            {activeTab === 'links' && (
              <div className="flex flex-col gap-2 animate-in fade-in duration-200">
                
                {/* Discord Tap-to-Copy */}
                <button
                  onClick={handleCopyDiscord}
                  className="w-full p-3 rounded-xl bg-white/65 dark:bg-white/5 hover:bg-pink-100/50 dark:hover:bg-pink-900/30 border border-pink-200/50 dark:border-pink-900/30 flex items-center justify-between transition-all group cursor-pointer text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-pink-200/50 dark:bg-pink-900/40 text-pink-600 dark:text-pink-300">
                      <MessageCircle className="w-4 h-4 fill-current" fillOpacity={0.25} />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-foreground">Discord Profile</div>
                      <div className="text-[10px] text-muted-foreground font-mono">@{profile.tag || 'lilacbyte'}</div>
                    </div>
                  </div>
                  {copiedDiscord ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-muted-foreground group-hover:text-pink-500 fill-current transition-colors" fillOpacity={0.25} />
                  )}
                </button>

                {/* YouTube Music Link */}
                <a
                  href="https://music.youtube.com/watch?v=ic8j13piAhQ"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full p-3 rounded-xl bg-white/65 dark:bg-white/5 hover:bg-pink-100/50 dark:hover:bg-pink-900/30 border border-pink-200/50 dark:border-pink-900/30 flex items-center justify-between transition-all group cursor-pointer text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-pink-200/50 dark:bg-pink-900/40 text-pink-600 dark:text-pink-300">
                      <Music className="w-4 h-4 fill-current" fillOpacity={0.25} />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">YouTube Music Track</div>
                      <div className="text-[10px] text-muted-foreground">Cruel Summer</div>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-pink-500 transition-colors" />
                </a>

                {/* Instagram / Art Feed - Disabled & Blurred */}
                <div
                  className="w-full p-3 rounded-xl bg-white/40 dark:bg-white/5 border border-pink-200/30 dark:border-pink-900/20 flex items-center justify-between opacity-50 filter blur-[1.5px] pointer-events-none select-none text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-pink-200/40 dark:bg-pink-900/30 text-pink-600 dark:text-pink-300">
                      <Globe className="w-4 h-4 fill-current" fillOpacity={0.25} />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">Instagram &amp; Art Feed</div>
                      <div className="text-[10px] text-muted-foreground">@lilac.blossom</div>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                </div>

                {/* GitHub & Projects - Disabled & Blurred */}
                <div
                  className="w-full p-3 rounded-xl bg-white/40 dark:bg-white/5 border border-pink-200/30 dark:border-pink-900/20 flex items-center justify-between opacity-50 filter blur-[1.5px] pointer-events-none select-none text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-pink-200/40 dark:bg-pink-900/30 text-pink-600 dark:text-pink-300">
                      <FolderHeart className="w-4 h-4 fill-current" fillOpacity={0.25} />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">GitHub &amp; Projects</div>
                      <div className="text-[10px] text-muted-foreground">@lilac-code</div>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                </div>

              </div>
            )}

          </div>

          {/* Minimal Footer: created with love by lilac. */}
          <div className="w-full pt-4 mt-3 border-t border-pink-200/30 dark:border-pink-900/30 flex justify-center items-center text-[11px] text-muted-foreground">
            <span>created with love by lilac.</span>
          </div>

        </div>

      </div>

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 z-50 animate-in slide-in-from-bottom-2 fade-in duration-200">
          <div className="px-4 py-2 rounded-full bg-white dark:bg-black/90 text-pink-600 dark:text-pink-300 border border-pink-200 dark:border-pink-800 text-xs font-medium shadow-xl backdrop-blur-md">
            {toast}
          </div>
        </div>
      )}

    </div>
  );
}
