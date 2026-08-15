import type { VercelRequest, VercelResponse } from '@vercel/node';

// Shared state cache at Edge/Serverless memory
let cachedBotState = {
  online: true,
  lastPing: new Date().toISOString(),
  guildCount: 1,
  userCount: 1,
  currentActivity: 'Vibing to Cruel Summer 🌸',
  customStatus: null as string | null,
  version: '1.0.0'
};

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-bot-token');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET: Website / users check Railway bot live status
  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      service: 'lilacbyte.xyz <-> Railway Connector',
      bot: {
        ...cachedBotState,
        connectorUrl: 'https://lilacbyte.xyz/api/bot'
      }
    });
  }

  // POST: Railway bot pushes live presence/stats to lilacbyte.xyz
  if (req.method === 'POST') {
    const authHeader = req.headers.authorization || req.headers['x-bot-token'];
    const botSecret = process.env.LILAC_BOT_SECRET;

    // Optional bearer validation if configured in Vercel environment
    if (botSecret && authHeader !== `Bearer ${botSecret}` && authHeader !== botSecret) {
      return res.status(401).json({ error: 'Unauthorized connector request' });
    }

    const { guildCount, userCount, currentActivity, customStatus } = req.body || {};

    cachedBotState = {
      online: true,
      lastPing: new Date().toISOString(),
      guildCount: typeof guildCount === 'number' ? guildCount : cachedBotState.guildCount,
      userCount: typeof userCount === 'number' ? userCount : cachedBotState.userCount,
      currentActivity: currentActivity || cachedBotState.currentActivity,
      customStatus: customStatus !== undefined ? customStatus : cachedBotState.customStatus,
      version: '1.0.0'
    };

    return res.status(200).json({
      success: true,
      message: 'State synced with lilacbyte.xyz',
      syncedAt: cachedBotState.lastPing
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
