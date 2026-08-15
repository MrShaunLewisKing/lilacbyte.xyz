import { useState, useEffect, useCallback } from 'react';

export type DiscordStatusType = 'online' | 'idle' | 'dnd' | 'offline';

export interface DiscordProfile {
  id: string;
  username: string;
  global_name: string;
  tag: string;
  avatarURL: string;
  bannerURL: string | null;
  bannerColor: string | null;
  status: DiscordStatusType;
  customStatus: string | null;
  activity: string | null;
  isNitro: boolean;
  lastUpdated: number;
}

const DISCORD_USER_ID = '622858248587837481';
const REFRESH_INTERVAL_MS = 3 * 60 * 1000; // 3 minutes
const CACHE_KEY = 'lilac_discord_profile_cache_v2';

export function useDiscordProfile() {
  const [profile, setProfile] = useState<DiscordProfile>(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch {}
    return {
      id: DISCORD_USER_ID,
      username: 'lilacbyte',
      global_name: '♡₊˚ Lilac .ᐟ',
      tag: 'lilacbyte',
      avatarURL: `https://cdn.discordapp.com/avatars/${DISCORD_USER_ID}/fe4a9783f89ee5f27539a78675f0bb2c.png?size=512`,
      bannerURL: `https://cdn.discordapp.com/banners/${DISCORD_USER_ID}/059d31c98c90366335465ee69b8d1b39.png?size=1024`,
      bannerColor: null,
      status: 'online',
      customStatus: null,
      activity: null,
      isNitro: true,
      lastUpdated: Date.now()
    };
  });

  const [isLoading, setIsLoading] = useState(false);

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      // 1. Fetch user profile from Japi (Avatar, Banner, Username)
      const japiPromise = fetch(`https://japi.rest/discord/v1/user/${DISCORD_USER_ID}`, {
        headers: { 'Accept': 'application/json' }
      }).then(r => r.ok ? r.json() : null).catch(() => null);

      // 2. Fetch presence from Lanyard (Live Status: online/idle/dnd, Custom Status, Activities)
      const lanyardPromise = fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`, {
        headers: { 'Accept': 'application/json' }
      }).then(r => r.ok ? r.json() : null).catch(() => null);

      const [japiRes, lanyardRes] = await Promise.all([japiPromise, lanyardPromise]);

      let avatarURL = profile.avatarURL;
      let bannerURL = profile.bannerURL;
      let global_name = profile.global_name;
      let username = profile.username;
      let tag = profile.tag;
      let isNitro = profile.isNitro;
      let status: DiscordStatusType = 'online';
      let customStatus: string | null = null;
      let activity: string | null = null;

      if (japiRes && japiRes.data) {
        const d = japiRes.data;
        const isAnimatedAvatar = d.avatar && d.avatar.startsWith('a_');
        const isAnimatedBanner = d.banner && d.banner.startsWith('a_');
        const avatarExt = isAnimatedAvatar ? 'gif' : 'png';
        const bannerExt = isAnimatedBanner ? 'gif' : 'png';

        avatarURL = d.avatar
          ? `https://cdn.discordapp.com/avatars/${d.id}/${d.avatar}.${avatarExt}?size=512`
          : d.defaultAvatarURL || `https://cdn.discordapp.com/embed/avatars/0.png`;

        bannerURL = d.banner
          ? `https://cdn.discordapp.com/banners/${d.id}/${d.banner}.${bannerExt}?size=1024`
          : null;

        global_name = d.global_name || d.username || '♡₊˚ Lilac .ᐟ';
        username = d.username || 'lilacbyte';
        tag = d.tag || d.username || 'lilacbyte';
        isNitro = Array.isArray(d.public_flags_array) && d.public_flags_array.includes('NITRO');
      }

      // Check Lanyard Presence for live Discord status & custom status
      if (lanyardRes && lanyardRes.success && lanyardRes.data) {
        const lData = lanyardRes.data;
        if (lData.discord_status) {
          status = lData.discord_status as DiscordStatusType;
        }

        // Custom status activity (type 4 in Discord API)
        if (Array.isArray(lData.activities)) {
          const custom = lData.activities.find((a: { type: number; state?: string }) => a.type === 4);
          if (custom && custom.state) {
            customStatus = custom.state;
          }

          // Other activity (game / Spotify / streaming)
          const other = lData.activities.find((a: { type: number; name?: string }) => a.type !== 4);
          if (other && other.name) {
            activity = other.name;
          }
        }
      }

      const newProfile: DiscordProfile = {
        id: DISCORD_USER_ID,
        username,
        global_name,
        tag,
        avatarURL,
        bannerURL,
        bannerColor: null,
        status,
        customStatus,
        activity,
        isNitro,
        lastUpdated: Date.now()
      };

      setProfile(newProfile);
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(newProfile));
      } catch {}
    } catch {
      // Graceful fallback
    } finally {
      setIsLoading(false);
    }
  }, [profile]);

  useEffect(() => {
    fetchProfile();
    const interval = setInterval(() => {
      fetchProfile();
    }, REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchProfile]);

  return { profile, isLoading, refresh: fetchProfile };
}
