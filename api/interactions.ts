import type { VercelRequest, VercelResponse } from '@vercel/node';
import { InteractionType, InteractionResponseType, verifyKey } from 'discord-interactions';

export const config = {
  api: {
    bodyParser: false
  }
};

async function getRawBody(readable: VercelRequest): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const signature = req.headers['x-signature-ed25519'] as string;
  const timestamp = req.headers['x-signature-timestamp'] as string;

  if (!signature || !timestamp) {
    return res.status(401).json({ error: 'Missing Discord signature headers' });
  }

  const rawBody = await getRawBody(req);
  const publicKey = process.env.DISCORD_PUBLIC_KEY || '';

  // Verify signature if DISCORD_PUBLIC_KEY is configured
  if (publicKey) {
    const isValid = verifyKey(rawBody, signature, timestamp, publicKey);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid signature' });
    }
  }

  const interaction = JSON.parse(rawBody.toString('utf-8'));

  // 1. Handshake PING from Discord Developer Portal
  if (interaction.type === InteractionType.PING) {
    return res.status(200).json({ type: InteractionResponseType.PONG });
  }

  // 2. Slash Commands
  if (interaction.type === InteractionType.APPLICATION_COMMAND) {
    const { name } = interaction.data;

    if (name === 'ping') {
      return res.status(200).json({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: '🌸 Pong! `lilacbyte.xyz` API is operational and running at the Edge.'
        }
      });
    }

    if (name === 'card' || name === 'profile') {
      return res.status(200).json({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          embeds: [
            {
              title: '♡₊˚ Lilac .ᐟ 🌸',
              description: 'Check out Lilac\'s official Carrd-style profile & intro card!',
              url: 'https://lilacbyte.xyz',
              color: 0xf472b6,
              fields: [
                { name: '🎂 Age', value: '22', inline: true },
                { name: '📍 Location', value: 'United Kingdom', inline: true },
                { name: '🌸 Gender', value: 'Female (Femboy)', inline: true },
                { name: '🎵 Current Track', value: 'Cruel Summer by Taylor Swift', inline: false }
              ],
              footer: {
                text: 'created with love by lilac. • lilacbyte.xyz'
              }
            }
          ]
        }
      });
    }

    if (name === 'music') {
      return res.status(200).json({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: '🎵 Now Playing on https://lilacbyte.xyz:\n**Taylor Swift — Cruel Summer** (with seamless playlist loop)'
        }
      });
    }
  }

  return res.status(200).json({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: '✦ Lilac Bot received command.'
    }
  });
}
