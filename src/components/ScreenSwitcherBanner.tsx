import React from 'react';

export type AppScreen = 'login' | 'register' | 'dashboard' | 'compare';

interface ScreenSwitcherBannerProps {
  currentScreen: AppScreen;
  onSelectScreen: (screen: AppScreen) => void;
  isMobileFrame: boolean;
  onToggleMobileFrame: () => void;
}

export const ScreenSwitcherBanner: React.FC<ScreenSwitcherBannerProps> = ({
  currentScreen,
  onSelectScreen,
  isMobileFrame,
  onToggleMobileFrame,
}) => {
  return (
    <div className="bg-[#191c1e] text-white text-xs px-4 py-2 border-b border-gray-800 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-40 shadow-md">
      <div className="flex items-center gap-2">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="font-semibold text-white tracking-wide">ShopCommission স্ক্রিন ভিউয়ার:</span>
      </div>

      {/* Screen Tabs */}
      <div className="flex items-center gap-1.5 bg-gray-900/80 p-1 rounded-lg border border-gray-700/60 overflow-x-auto">
        <button
          onClick={() => onSelectScreen('login')}
          className={`px-3 py-1 rounded-md font-medium transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            currentScreen === 'login'
              ? 'bg-gradient-to-r from-[#4f46e5] to-[#712ae2] text-white shadow-xs'
              : 'text-gray-300 hover:text-white hover:bg-gray-800'
          }`}
        >
          <span className="material-symbols-outlined text-sm">lock</span>
          <span>Image 1: লগইন স্ক্রিন</span>
        </button>

        <button
          onClick={() => onSelectScreen('register')}
          className={`px-3 py-1 rounded-md font-medium transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            currentScreen === 'register'
              ? 'bg-gradient-to-r from-[#4f46e5] to-[#712ae2] text-white shadow-xs'
              : 'text-gray-300 hover:text-white hover:bg-gray-800'
          }`}
        >
          <span className="material-symbols-outlined text-sm">rocket_launch</span>
          <span>Image 3: নতুন একাউন্ট</span>
        </button>

        <button
          onClick={() => onSelectScreen('dashboard')}
          className={`px-3 py-1 rounded-md font-medium transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            currentScreen === 'dashboard'
              ? 'bg-gradient-to-r from-[#4f46e5] to-[#712ae2] text-white shadow-xs'
              : 'text-gray-300 hover:text-white hover:bg-gray-800'
          }`}
        >
          <span className="material-symbols-outlined text-sm">dashboard</span>
          <span>লাইভ আর্নিংস ড্যাশবোর্ড</span>
        </button>

        <button
          onClick={() => onSelectScreen('compare')}
          className={`px-3 py-1 rounded-md font-medium transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            currentScreen === 'compare'
              ? 'bg-gradient-to-r from-[#4f46e5] to-[#712ae2] text-white shadow-xs'
              : 'text-gray-300 hover:text-white hover:bg-gray-800'
          }`}
        >
          <span className="material-symbols-outlined text-sm">splitscreen</span>
          <span>পাশাপাশি তুলনা</span>
        </button>
      </div>

      {/* Frame Toggle */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleMobileFrame}
          className={`px-2.5 py-1 rounded-md border text-xs flex items-center gap-1 transition-colors cursor-pointer ${
            isMobileFrame
              ? 'bg-indigo-950 border-indigo-500 text-indigo-200'
              : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
          }`}
          title="মোবাইল ফ্রেম টগল করুন"
        >
          <span className="material-symbols-outlined text-sm">
            {isMobileFrame ? 'stay_current_portrait' : 'desktop_windows'}
          </span>
          <span className="hidden sm:inline">
            {isMobileFrame ? 'মোবাইল ফ্রেম চালু' : 'ফুল ভিউ চালু'}
          </span>
        </button>
      </div>
    </div>
  );
};
