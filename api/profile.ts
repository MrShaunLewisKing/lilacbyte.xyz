import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const userId = '622858248587837481';

  try {
    const japiRes = await fetch(`https://japi.rest/discord/v1/user/${userId}`);
    const japiData = japiRes.ok ? await japiRes.json() : null;

    const lanyardRes = await fetch(`https://api.lanyard.rest/v1/users/${userId}`);
    const lanyardData = lanyardRes.ok ? await lanyardRes.json() : null;

    return res.status(200).json({
      user: {
        id: userId,
        username: japiData?.data?.username || 'lilacbyte',
        displayName: japiData?.data?.global_name || '♡₊˚ Lilac .ᐟ',
        avatar: japiData?.data?.avatarURL?.replace('size=128', 'size=512'),
        banner: japiData?.data?.bannerURL?.replace('size=600', 'size=1024'),
        status: lanyardData?.data?.discord_status || 'online',
        customStatus: lanyardData?.data?.activities?.find((a: { type: number }) => a.type === 4)?.state || null
      },
      stats: {
        age: 22,
        from: 'United Kingdom',
        gender: 'Female (Femboy)',
        pronouns: 'she/her',
        nicknames: ['Lilac', 'Lily', 'Lili']
      },
      music: {
        currentTrack: 'Cruel Summer',
        artist: 'Taylor Swift',
        youtubeId: 'ic8j13piAhQ'
      },
      links: {
        website: 'https://lilacbyte.xyz',
        discord: '@lilacbyte'
      }
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to fetch live Discord data',
      fallback: {
        id: userId,
        username: 'lilacbyte',
        displayName: '♡₊˚ Lilac .ᐟ',
        website: 'https://lilacbyte.xyz'
      }
    });
  }
}
