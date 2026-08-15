# Lilac 🌸 — Personal Carrd-Style Intro System

[![Website](https://img.shields.io/badge/website-lilacbyte.xyz-f472b6?style=for-the-badge&logo=safari&logoColor=white)](https://lilacbyte.xyz)
[![Hosted on Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://lilacbyte.xyz)
[![Built with Vite](https://img.shields.io/badge/Vite-8.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

A mobile-first, soft pink Carrd.co-style intro profile system built for **Lilac** ([lilacbyte.xyz](https://lilacbyte.xyz)). Features live Discord profile syncing, background audio streaming with exact timestamp persistence, and performance optimization for Vercel Edge CDN.

---

## ✨ Features

- 🌸 **Carrd-Style Mobile Intro**: Glassmorphic pastel card design with responsive mobile-first typography and soft duotone icons.
- 🔄 **Live Discord Sync (3-Minute Interval)**: Automatically updates Discord avatar, banner, global display name, tag, custom status, and activity via zero-token CORS endpoints.
- 🔴 **Authentic Discord Presence Badge**: Shows pixel-perfect Discord status icons (`Online`, `Idle`, `Do Not Disturb`, `Offline`).
- 🎵 **Uninterrupted Audio Player (`Blank Space`)**:
  - Embedded YouTube Music player with autoplay and infinite repeat loop.
  - Real-time timestamp persistence to `localStorage` every 400ms.
  - Automatically restores exact sub-second timestamp on page updates and refreshes.
- 🌓 **Rosé Light / Dark Mode**: Seamless toggle between soft pastel pink and cozy dark rosé themes.
- 🌸 **Ambient 60 FPS Sakura Canvas**: Subtle petal animation throttled when tab is backgrounded.
- ⚡ **Optimized for Vercel Edge CDN**:
  - Edge caching rules (`stale-while-revalidate`, immutable hashed chunks).
  - App bundle size of just **`5.98 kB gzip`**.
  - Includes [`vercel.json`](vercel.json) with SPA rewrite rules and edge security headers.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler**: Vite 8 (with ESNext target & functional chunk splitting)
- **Styling**: Tailwind CSS v4 + Vanilla CSS Design Tokens
- **Icons**: Lucide React (Duotone Half-Filled Style)
- **Audio API**: Client-Side YouTube IFrame API
- **Deployment**: Vercel Edge Network

---

## 🚀 Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Build for production
npm run build
```

---

## ☁️ Deploy to Vercel

### Option 1: Vercel GitHub Integration (Recommended)
1. Push this repository to GitHub.
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Select your GitHub repository.
4. Set the Root Directory to `./` and click **"Deploy"**.
5. Add your custom domain **`lilacbyte.xyz`** in **Project Settings > Domains**.

### Option 2: Vercel CLI
```bash
npx vercel --prod
```

---

## 📄 License

Created with love by Lilac.
