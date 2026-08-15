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
    __lilacPlayAudio?: () => void;
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
  getPlaylistIndex: () => number;
  getVideoData: () => { title?: string; author?: string; video_id?: string };
}

// Default track: Cruel Summer by Taylor Swift
const DEFAULT_VIDEO_ID = 'ic8j13piAhQ';
const DEFAULT_SONG_NAME = 'Cruel Summer';
const PLAYLIST_ID = 'RDic8j13piAhQ';

// Storage keys for exact state persistence across reloads
const STORAGE_KEYS = {
  VIDEO_ID: 'lilac_music_current_video_id',
  PLAYLIST_INDEX: 'lilac_music_playlist_index',
  TIMESTAMP: 'lilac_music_exact_timestamp',
  TITLE: 'lilac_music_current_title',
  IS_PLAYING: 'lilac_music_is_playing'
};

export function TopMusicPill() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [songTitle, setSongTitle] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.TITLE) || DEFAULT_SONG_NAME;
    } catch {
      return DEFAULT_SONG_NAME;
    }
  });

  const playerRef = useRef<YTPlayerInstance | null>(null);
  const isPlayingRef = useRef(false);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
    try {
      localStorage.setItem(STORAGE_KEYS.IS_PLAYING, isPlaying ? '1' : '0');
    } catch {}
  }, [isPlaying]);

  // Expose global play audio function for modal click trigger
  useEffect(() => {
    window.__lilacPlayAudio = () => {
      if (playerRef.current) {
        try {
          playerRef.current.unMute();
          playerRef.current.setVolume(100);
          playerRef.current.playVideo();
          setIsPlaying(true);
        } catch {}
      }
    };
  }, []);

  useEffect(() => {
    // Load YouTube API script
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
    }

    const initPlayer = () => {
      if (!window.YT || !window.YT.Player) return;
      if (playerRef.current) return;

      // Retrieve saved state
      let savedVideoId = DEFAULT_VIDEO_ID;
      let savedTimestamp = 0;
      let savedIndex = 0;

      try {
        const vid = localStorage.getItem(STORAGE_KEYS.VIDEO_ID);
        if (vid && vid.trim()) savedVideoId = vid.trim();

        const timeStr = localStorage.getItem(STORAGE_KEYS.TIMESTAMP);
        if (timeStr) {
          const parsed = parseFloat(timeStr);
          if (!isNaN(parsed) && parsed > 0) savedTimestamp = parsed;
        }

        const idxStr = localStorage.getItem(STORAGE_KEYS.PLAYLIST_INDEX);
        if (idxStr) {
          const parsedIdx = parseInt(idxStr, 10);
          if (!isNaN(parsedIdx) && parsedIdx >= 0) savedIndex = parsedIdx;
        }
      } catch {}

      try {
        playerRef.current = new window.YT.Player('yt-top-pill-player', {
          videoId: savedVideoId,
          playerVars: {
            autoplay: 1,
            start: Math.floor(savedTimestamp),
            listType: 'playlist',
            list: PLAYLIST_ID,
            index: savedIndex,
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
                if (savedTimestamp > 0) {
                  event.target.seekTo(savedTimestamp, true);
                }
                event.target.unMute();
                event.target.setVolume(100);
                event.target.playVideo();
                setIsPlaying(true);
                syncTrackInfo(event.target);
              } catch {}
            },
            onStateChange: (event) => {
              // 1 = PLAYING
              if (event.data === 1) {
                setIsPlaying(true);
                syncTrackInfo(event.target);
              }
              // 0 = ENDED (Auto advance to next song in playlist)
              else if (event.data === 0) {
                try {
                  event.target.nextVideo();
                  setIsPlaying(true);
                } catch {
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

    const syncTrackInfo = (target: YTPlayerInstance) => {
      try {
        if (typeof target.getVideoData === 'function') {
          const data = target.getVideoData();
          if (data) {
            if (data.video_id) {
              try {
                localStorage.setItem(STORAGE_KEYS.VIDEO_ID, data.video_id);
              } catch {}
            }

            if (data.title) {
              const clean = data.title
                .replace(/^Taylor Swift\s*[-–:]\s*/gi, '')
                .replace(/\s*\(Official.*?\)/gi, '')
                .replace(/\s*\[Official.*?\]/gi, '')
                .replace(/\s*\(Audio.*?\)/gi, '')
                .replace(/\s*\(Lyric Video\)/gi, '')
                .trim();

              const finalTitle = clean || DEFAULT_SONG_NAME;
              setSongTitle(finalTitle);
              try {
                localStorage.setItem(STORAGE_KEYS.TITLE, finalTitle);
              } catch {}
            }
          }
        }

        if (typeof target.getPlaylistIndex === 'function') {
          const idx = target.getPlaylistIndex();
          if (idx !== undefined && idx >= 0) {
            try {
              localStorage.setItem(STORAGE_KEYS.PLAYLIST_INDEX, idx.toString());
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

    // Continuously persist exact timestamp and playlist index every 300ms
    progressIntervalRef.current = setInterval(() => {
      if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
        try {
          const currentTime = playerRef.current.getCurrentTime();
          if (currentTime && currentTime > 0) {
            localStorage.setItem(STORAGE_KEYS.TIMESTAMP, currentTime.toString());
          }
          if (typeof playerRef.current.getPlaylistIndex === 'function') {
            const idx = playerRef.current.getPlaylistIndex();
            if (idx !== undefined && idx >= 0) {
              localStorage.setItem(STORAGE_KEYS.PLAYLIST_INDEX, idx.toString());
            }
          }
        } catch {}
      }
    }, 300);

    const persistState = () => {
      if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
        try {
          const currentTime = playerRef.current.getCurrentTime();
          if (currentTime && currentTime > 0) {
            localStorage.setItem(STORAGE_KEYS.TIMESTAMP, currentTime.toString());
          }
        } catch {}
      }
    };

    window.addEventListener('beforeunload', persistState);
    window.addEventListener('pagehide', persistState);

    // Immediate audio unlock on user interaction / modal dismiss
    const unlockAudioDirectly = () => {
      if (playerRef.current) {
        try {
          playerRef.current.unMute();
          playerRef.current.setVolume(100);
          playerRef.current.playVideo();
          setIsPlaying(true);
        } catch {}
      }
    };

    window.addEventListener('lilac_unlock_audio', unlockAudioDirectly);
    window.addEventListener('click', unlockAudioDirectly, { once: true, passive: true });
    window.addEventListener('touchstart', unlockAudioDirectly, { once: true, passive: true });
    window.addEventListener('keydown', unlockAudioDirectly, { once: true, passive: true });

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      window.removeEventListener('beforeunload', persistState);
      window.removeEventListener('pagehide', persistState);
      window.removeEventListener('lilac_unlock_audio', unlockAudioDirectly);
      window.removeEventListener('click', unlockAudioDirectly);
      window.removeEventListener('touchstart', unlockAudioDirectly);
      window.removeEventListener('keydown', unlockAudioDirectly);
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
        playerRef.current.unMute();
        playerRef.current.setVolume(100);
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

      {/* Pill: Play/Pause button + Exact Song Title + Next Track button */}
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
