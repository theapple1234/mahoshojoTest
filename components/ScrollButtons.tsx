
import React from 'react';
import { useCharacterContext } from '../context/CharacterContext';

export const ScrollButtons: React.FC = () => {
  const { toggleSettings, isIntroDone } = useCharacterContext();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
  };

  return (
    <div className={`fixed top-8 left-8 z-[60] flex flex-col items-center transition-all duration-1000 ease-out delay-300 ${isIntroDone ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10 pointer-events-none'}`}>
      {/* Settings Button - Always visible, distinct style */}
      <button 
        onClick={toggleSettings}
        className="p-3 bg-black/60 border border-cyan-500/30 rounded-full hover:bg-slate-800 hover:border-cyan-400 text-cyan-500/70 hover:text-cyan-200 transition-all backdrop-blur-sm mb-6 shadow-lg hover:shadow-cyan-500/20"
        title="Settings"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {/* Scroll Controls Group - Fades in/out */}
      <div className="flex flex-col gap-2 opacity-30 hover:opacity-100 transition-opacity duration-300">
        <button 
          onClick={scrollToTop}
          className="p-3 bg-black/40 border border-white/10 rounded-full hover:bg-slate-800 hover:border-white/30 text-white/50 hover:text-white transition-all backdrop-blur-sm shadow-md"
          title="Scroll to Top"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
        <button 
          onClick={scrollToBottom}
          className="p-3 bg-black/40 border border-white/10 rounded-full hover:bg-slate-800 hover:border-white/30 text-white/50 hover:text-white transition-all backdrop-blur-sm shadow-md"
          title="Scroll to Bottom"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      </div>
    </div>
  );
};
