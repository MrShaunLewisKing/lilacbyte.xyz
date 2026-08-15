import { useState, useEffect } from 'react';
import { X, Sparkles, Heart } from 'lucide-react';

export function NoticeModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user already dismissed in this session
    try {
      const dismissed = sessionStorage.getItem('lilac_notice_dismissed');
      if (!dismissed) {
        // Show with a gentle 600ms entrance delay
        const timer = setTimeout(() => setIsOpen(true), 600);
        return () => clearTimeout(timer);
      }
    } catch {
      setIsOpen(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsOpen(false);
    try {
      sessionStorage.setItem('lilac_notice_dismissed', 'true');
    } catch {}
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/35 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-[340px] rounded-3xl pink-glass p-6 text-center shadow-2xl border-2 border-pink-300/70 dark:border-pink-500/40 animate-in zoom-in-95 duration-300">
        
        {/* Decorative Flower Accents around the card */}
        <div className="absolute -top-3 -left-3 text-2xl select-none animate-bounce" style={{ animationDuration: '3s' }}>
          🌸
        </div>
        <div className="absolute -top-4 -right-2 text-2xl select-none animate-pulse">
          🌺
        </div>
        <div className="absolute -bottom-3 -left-2 text-xl select-none">
          🌷
        </div>
        <div className="absolute -bottom-3 -right-3 text-2xl select-none animate-bounce" style={{ animationDuration: '2.5s' }}>
          🌸
        </div>

        {/* Close Icon Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-pink-100/80 dark:bg-pink-950/60 text-pink-600 dark:text-pink-300 hover:scale-110 transition-transform cursor-pointer"
          title="Close notice"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* Center Floral Badge */}
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-tr from-pink-300 to-rose-200 dark:from-pink-900 dark:to-rose-800 flex items-center justify-center shadow-inner border border-pink-200 dark:border-pink-700 select-none text-xl">
          🌸
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-foreground flex items-center justify-center gap-1.5">
          <span>Still in the making!</span>
          <Sparkles className="w-3.5 h-3.5 text-pink-400 fill-current" fillOpacity={0.25} />
        </h3>

        {/* Notice Message */}
        <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
          This website is still a work in progress! Some lower sections contain placeholders, but all profile information at the top is live &amp; accurate. 🌸
        </p>

        {/* Action Button */}
        <button
          onClick={handleDismiss}
          className="w-full mt-4 py-2.5 px-4 rounded-xl bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white font-semibold text-xs shadow-md shadow-pink-300/50 flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
        >
          <Heart className="w-3.5 h-3.5 fill-current" />
          <span>Understood ♡</span>
        </button>

      </div>

    </div>
  );
}
