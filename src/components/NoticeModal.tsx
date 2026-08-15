import { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';

export function NoticeModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const dismissed = sessionStorage.getItem('lilac_notice_dismissed');
      if (!dismissed) {
        const timer = setTimeout(() => setIsOpen(true), 500);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
      
      {/* Modal Container with Floral Garland Framing */}
      <div className="relative w-full max-w-[350px] rounded-[2.2rem] pink-glass p-7 text-center shadow-2xl border-2 border-pink-300/80 dark:border-pink-500/50 animate-in zoom-in-95 duration-300 overflow-visible">
        
        {/* TOP FLORAL GARLAND CROWNING THE MODAL */}
        <div className="absolute -top-4 inset-x-0 flex justify-between items-center px-3 pointer-events-none select-none z-20">
          <span className="text-xl transform -rotate-12 animate-pulse">🌺</span>
          <span className="text-lg -mt-1">🌸</span>
          <span className="text-xl -mt-2">🌺</span>
          <span className="text-lg -mt-1">🌸</span>
          <span className="text-xl transform rotate-12 animate-pulse">🌺</span>
        </div>

        {/* LEFT SIDE FLOWERS DRAPING DOWN */}
        <div className="absolute -left-3 top-7 bottom-7 flex flex-col justify-between pointer-events-none select-none z-20 text-base">
          <span className="transform -rotate-45">🌸</span>
          <span className="transform -rotate-12">🌺</span>
          <span className="transform -rotate-45">🌸</span>
        </div>

        {/* RIGHT SIDE FLOWERS DRAPING DOWN */}
        <div className="absolute -right-3 top-7 bottom-7 flex flex-col justify-between pointer-events-none select-none z-20 text-base">
          <span className="transform rotate-45">🌸</span>
          <span className="transform rotate-12">🌺</span>
          <span className="transform rotate-45">🌸</span>
        </div>

        {/* BOTTOM CORNERS FLORAL ACCENTS */}
        <div className="absolute -bottom-3 inset-x-0 flex justify-around items-center px-4 pointer-events-none select-none z-20">
          <span className="text-lg transform -rotate-12">🌺</span>
          <span className="text-base">🌸</span>
          <span className="text-lg transform rotate-12">🌺</span>
        </div>

        {/* Close Icon Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-3.5 right-3.5 p-1.5 rounded-full bg-pink-100/90 dark:bg-pink-950/70 text-pink-600 dark:text-pink-300 hover:scale-110 active:scale-95 transition-all cursor-pointer z-30 shadow-sm"
          title="Close notice"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* Card Header & Content (Clean, No 🌸 in text) */}
        <div className="pt-1">
          {/* Title */}
          <h3 className="text-base font-bold text-foreground flex items-center justify-center gap-1.5">
            <span>Still in the making!</span>
            <Sparkles className="w-3.5 h-3.5 text-pink-400 fill-current" fillOpacity={0.25} />
          </h3>

          {/* Clean Notice Message */}
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed font-normal">
            This website is still a work in progress! Some lower sections contain placeholders, but all profile information at the top is live &amp; accurate.
          </p>

          {/* Action Button: only says 'understood' with a little rose on top right */}
          <div className="relative mt-5 w-full">
            <button
              onClick={handleDismiss}
              className="relative w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white font-semibold text-xs shadow-md shadow-pink-300/50 flex items-center justify-center transition-all active:scale-95 cursor-pointer"
            >
              <span>understood</span>
              {/* Little rose on top right of the button */}
              <span className="absolute -top-2 -right-1 text-sm select-none transform rotate-12">
                🌹
              </span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
