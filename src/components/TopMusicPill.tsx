import { useState, useEffect, useRef } from 'react';
import { Play, Pause } from 'lucide-react';

declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string | HTMLElement,
        config: {
          videoId: string;
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
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  mute: () => void;
  unMute: () => void;
  isMuted: () => boolean;
  setVolume: (volume: number) => void;
  getVolume: () => number;
}

const YOUTUBE_VIDEO_ID = '-MtKC5wXqdQ';
const SONG_NAME = 'Blank Space';
const TIMESTAMP_STORAGE_KEY = 'lilac_music_exact_timestamp';
const PLAYING_STORAGE_KEY = 'lilac_music_is_playing';

export function TopMusicPill() {
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef<YTPlayerInstance | null>(null);
  const isPlayingRef = useRef(false);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
    try {
      localStorage.setItem(PLAYING_STORAGE_KEY, isPlaying ? '1' : '0');
    } catch {}
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
      if (playerRef.current) return; // Prevent duplicate initialization

      // Read saved timestamp from storage
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
          videoId: YOUTUBE_VIDEO_ID,
          playerVars: {
            autoplay: 1,
            start: Math.floor(initialStartSeconds),
            loop: 1,
            playlist: YOUTUBE_VIDEO_ID, // Required by YouTube API for native continuous loop
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
                // Seek directly to exact sub-second timestamp if available
                if (initialStartSeconds > 0) {
                  event.target.seekTo(initialStartSeconds, true);
                }
                event.target.playVideo();
                setIsPlaying(true);
              } catch {}
            },
            onStateChange: (event) => {
              // 1 = PLAYING
              if (event.data === 1) {
                setIsPlaying(true);
              }
              // 0 = ENDED (Seamless loop repeat)
              else if (event.data === 0) {
                try {
                  event.target.seekTo(0, true);
                  event.target.playVideo();
                  setIsPlaying(true);
                } catch {}
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

    // Save on beforeunload / page hide
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

  return (
    <div className="relative">
      {/* Hidden YouTube Iframe (isolated from re-renders) */}
      <div className="hidden">
        <div id="yt-top-pill-player" />
      </div>

      {/* Pill: ONLY Play/Pause button + song name */}
      <button
        onClick={togglePlay}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 dark:bg-black/40 border border-pink-300/50 dark:border-pink-500/20 text-xs text-pink-600 dark:text-pink-300 font-medium backdrop-blur-md shadow-sm hover:border-pink-400 transition-all cursor-pointer select-none group"
        title={isPlaying ? 'Pause' : 'Play'}
      >
        <span className="p-1 rounded-full bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-pink-300 flex items-center justify-center">
          {isPlaying ? (
            <Pause className="w-3 h-3 fill-current" />
          ) : (
            <Play className="w-3 h-3 fill-current ml-0.5" />
          )}
        </span>

        <span className="text-xs font-semibold tracking-tight">{SONG_NAME}</span>
      </button>
    </div>
  );
}
