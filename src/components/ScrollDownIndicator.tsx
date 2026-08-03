import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { smoothScrollBy } from '../utils/smoothScroll';

export const ScrollDownIndicator: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate how close user is to the bottom of the page
      const windowHeight = window.innerHeight;
      const scrollY = window.scrollY || window.pageYOffset;
      const documentHeight = document.documentElement.scrollHeight;

      // If within 180px of the bottom or page is not scrollable, hide indicator
      if (documentHeight - (scrollY + windowHeight) < 180 || documentHeight <= windowHeight + 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Check initial height on mount
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollDown = () => {
    const targetDistance = Math.min(window.innerHeight * 0.65, 500);
    smoothScrollBy(targetDistance, 750);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 transition-all duration-300 animate-bounce">
      <button
        type="button"
        onClick={handleScrollDown}
        className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-900/90 text-white text-xs font-semibold shadow-lg shadow-indigo-950/40 border border-slate-700/80 hover:bg-indigo-600 hover:border-indigo-500 backdrop-blur-md transition-all cursor-pointer group"
        title="Scroll down for more questions"
      >
        <span>Scroll for questions</span>
        <ChevronDown className="w-4 h-4 text-indigo-300 group-hover:text-white transition-transform group-hover:translate-y-0.5" />
      </button>
    </div>
  );
};
