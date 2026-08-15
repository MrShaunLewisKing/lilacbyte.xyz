import { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward } from 'lucide-react';

declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string | HTMLElement,
        config: {
          videoId?: string;
          playerVars?: Record<string, unknown>;
          events?: {
            onReady?: (event: { target: YTPlayerInstance }) => void;
            onStateChange?: (event: { data: number; target: YTPlayerInstance }) => void;
            onError?: () => void;
          };
        }
      ) => YTPlayerInstance;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface YTPlayerInstance {
  playVideo: () => void;
  pauseVideo: () => void;
  nextVideo: () => void;
  previousVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  mute: () => void;
  unMute: () => void;
  isMuted: () => boolean;
  setVolume: (volume: number) => void;
  getVolume: () => number;
  getVideoData: () => { title?: string; author?: string; video_id?: string };
}

const DEFAULT_VIDEO_ID = '-MtKC5wXqdQ';
// YouTube playlist/radio mix ID for continuous playlist playback
const PLAYLIST_ID = 'RD-MtKC5wXqdQ';
const TIMESTAMP_STORAGE_KEY = 'lilac_music_exact_timestamp';
const TITLE_STORAGE_KEY = 'lilac_music_current_title';

export function TopMusicPill() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [songTitle, setSongTitle] = useState(() => {
    try {
      return localStorage.getItem(TITLE_STORAGE_KEY) || 'Blank Space';
    } catch {
      return 'Blank Space';
    }
  });

  const playerRef = useRef<YTPlayerInstance | null>(null);
  const isPlayingRef = useRef(false);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
    }

    const initPlayer = () => {
      if (!window.YT || !window.YT.Player) return;
      if (playerRef.current) return;

      let initialStartSeconds = 0;
      try {
        const savedTimeStr = localStorage.getItem(TIMESTAMP_STORAGE_KEY);
        if (savedTimeStr) {
          const parsed = parseFloat(savedTimeStr);
          if (!isNaN(parsed) && parsed > 0) {
            initialStartSeconds = parsed;
          }
        }
      } catch {}

      try {
        playerRef.current = new window.YT.Player('yt-top-pill-player', {
          videoId: DEFAULT_VIDEO_ID,
          playerVars: {
            autoplay: 1,
            start: Math.floor(initialStartSeconds),
            listType: 'playlist',
            list: PLAYLIST_ID, // Loads full playlist / continuous radio queue
            loop: 1,
            playsinline: 1,
            controls: 0,
            disablekb: 1,
            fs: 0,
            rel: 0,
            modestbranding: 1
          },
          events: {
            onReady: (event) => {
              try {
                if (initialStartSeconds > 0) {
                  event.target.seekTo(initialStartSeconds, true);
                }
                event.target.playVideo();
                setIsPlaying(true);
                updateCurrentTitle(event.target);
              } catch {}
            },
            onStateChange: (event) => {
              // 1 = PLAYING
              if (event.data === 1) {
                setIsPlaying(true);
                updateCurrentTitle(event.target);
              }
              // 0 = ENDED (Automatically advances to NEXT song in playlist!)
              else if (event.data === 0) {
                try {
                  event.target.nextVideo();
                  setIsPlaying(true);
                } catch {
                  // Fallback loop if single item
                  event.target.seekTo(0, true);
                  event.target.playVideo();
                }
              }
              // 2 = PAUSED
              else if (event.data === 2) {
                setIsPlaying(false);
              }
            }
          }
        });
      } catch {}
    };

    const updateCurrentTitle = (target: YTPlayerInstance) => {
      try {
        if (typeof target.getVideoData === 'function') {
          const data = target.getVideoData();
          if (data && data.title) {
            // Clean up title for concise pill display
            const cleanTitle = data.title
              .replace(/\s*\(Official.*?\)/gi, '')
              .replace(/\s*\[Official.*?\]/gi, '')
              .replace(/\s*\(Audio.*?\)/gi, '')
              .trim();
            setSongTitle(cleanTitle);
            try {
              localStorage.setItem(TITLE_STORAGE_KEY, cleanTitle);
            } catch {}
          }
        }
      } catch {}
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    // Save exact timestamp every 400ms while active
    progressIntervalRef.current = setInterval(() => {
      if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
        try {
          const current = playerRef.current.getCurrentTime();
          if (current && current > 0) {
            localStorage.setItem(TIMESTAMP_STORAGE_KEY, current.toString());
          }
        } catch {}
      }
    }, 400);

    const saveStateBeforeUnload = () => {
      if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
        try {
          const current = playerRef.current.getCurrentTime();
          if (current && current > 0) {
            localStorage.setItem(TIMESTAMP_STORAGE_KEY, current.toString());
          }
        } catch {}
      }
    };

    window.addEventListener('beforeunload', saveStateBeforeUnload);
    window.addEventListener('pagehide', saveStateBeforeUnload);

    // Auto-unlock playback on first user touch if blocked by autoplay policy
    const unlockAutoplay = () => {
      if (playerRef.current && !isPlayingRef.current) {
        try {
          const savedTimeStr = localStorage.getItem(TIMESTAMP_STORAGE_KEY);
          if (savedTimeStr) {
            const time = parseFloat(savedTimeStr);
            if (!isNaN(time) && time > 0) {
              playerRef.current.seekTo(time, true);
            }
          }
          playerRef.current.playVideo();
          setIsPlaying(true);
        } catch {}
      }
    };

    window.addEventListener('click', unlockAutoplay, { once: true, passive: true });
    window.addEventListener('touchstart', unlockAutoplay, { once: true, passive: true });
    window.addEventListener('keydown', unlockAutoplay, { once: true, passive: true });

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      window.removeEventListener('beforeunload', saveStateBeforeUnload);
      window.removeEventListener('pagehide', saveStateBeforeUnload);
      window.removeEventListener('click', unlockAutoplay);
      window.removeEventListener('touchstart', unlockAutoplay);
      window.removeEventListener('keydown', unlockAutoplay);
    };
  }, []);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!playerRef.current) return;
    try {
      if (isPlaying) {
        playerRef.current.pauseVideo();
        setIsPlaying(false);
      } else {
        playerRef.current.playVideo();
        setIsPlaying(true);
      }
    } catch {}
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!playerRef.current) return;
    try {
      playerRef.current.nextVideo();
      setIsPlaying(true);
    } catch {}
  };

  return (
    <div className="relative">
      {/* Hidden YouTube Iframe */}
      <div className="hidden">
        <div id="yt-top-pill-player" />
      </div>

      {/* Pill: Play/Pause button + Dynamic Playlist Song Name + Next Track button */}
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 dark:bg-black/40 border border-pink-300/50 dark:border-pink-500/20 text-xs text-pink-600 dark:text-pink-300 font-medium backdrop-blur-md shadow-sm hover:border-pink-400 transition-all select-none">
        <button
          onClick={togglePlay}
          className="p-1 rounded-full bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-pink-300 flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-transform"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <Pause className="w-3 h-3 fill-current" />
          ) : (
            <Play className="w-3 h-3 fill-current ml-0.5" />
          )}
        </button>

        <span className="text-xs font-semibold tracking-tight max-w-[140px] truncate" title={songTitle}>
          {songTitle}
        </span>

        {/* Skip to next song in playlist */}
        <button
          onClick={handleNext}
          className="p-1 text-pink-400 hover:text-pink-600 dark:hover:text-pink-200 transition-colors cursor-pointer"
          title="Next song in playlist"
        >
          <SkipForward className="w-3 h-3 fill-current" fillOpacity={0.25} />
        </button>
      </div>
    </div>
  );
}
