import { useState, useEffect } from 'react';
import { LilacCard } from '@/components/LilacCard';
import { LilacPetalsBackground } from '@/components/LilacPetalsBackground';
import { NoticeModal } from '@/components/NoticeModal';

function App() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div className="min-h-screen w-full relative flex flex-col items-center justify-center py-6 px-3 bg-gradient-to-b from-[#fff2f7] via-[#ffe8f0] to-[#fff5f8] dark:from-[#160c13] dark:via-[#1c0f19] dark:to-[#120a10] text-foreground font-sans transition-colors duration-500 overflow-x-hidden selection:bg-pink-300/40">
      
      {/* Soft Ambient Floating Petals Canvas */}
      <LilacPetalsBackground />

      {/* Aesthetic Soft Glow Behind Card */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[480px] bg-pink-300/30 dark:bg-pink-600/10 rounded-full blur-[100px] pointer-events-none -z-0" />

      {/* Main Carrd Container */}
      <LilacCard
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
      />

      {/* Work In Progress Floral Notice Pop-up */}
      <NoticeModal />

    </div>
  );
}

export default App;
