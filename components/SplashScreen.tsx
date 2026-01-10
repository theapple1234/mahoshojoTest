
import React, { useState } from 'react';
import { useCharacterContext } from '../context/CharacterContext';

interface SplashScreenProps {
  onStart: () => void;
  isExiting: boolean;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onStart, isExiting }) => {
  const { setPhotosensitivityDisabled, setLanguage, language } = useCharacterContext();
  const [lang, setLang] = useState<'en' | 'ko'>(language);
  const [photosensitivity, setPhotosensitivity] = useState(false);
  
  const handleLangChange = (newLang: 'en' | 'ko') => {
      setLang(newLang);
      setLanguage(newLang);
  };

  const handleStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotosensitivityDisabled(photosensitivity);
    onStart();
  };

  // Main Splash Screen
  return (
    <div className={`fixed inset-0 z-[100] overflow-hidden flex flex-col items-center justify-center transition-opacity duration-1000 ${isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      
      {/* Invisible dummy text to force font download immediately */}
      <div className="font-cinzel absolute opacity-0 pointer-events-none w-0 h-0 overflow-hidden" aria-hidden="true">
        괴물은 사라져야 한다.
      </div>

      {/* Main Content Container - Centered */}
      <div className={`relative z-10 w-full max-w-6xl px-6 flex flex-col items-center justify-center min-h-screen ${isExiting ? 'animate-zoom-out-exit' : ''}`}>
        
        {/* Title Section */}
        <div className="text-center mb-20 animate-entrance relative">
            {/* Ambient Glow behind title */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-cyan-900/10 rounded-full blur-[80px] animate-pulse-slow pointer-events-none"></div>

            {lang === 'en' ? (
                <>
                    <h2 className="text-cyan-400/80 font-cinzel text-sm md:text-base tracking-[0.6em] uppercase mb-6 animate-float-slow">Choose Your Own Adventure</h2>
                    <h1 className="font-cinzel text-5xl md:text-7xl lg:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-cyan-900 tracking-[0.1em] drop-shadow-[0_0_35px_rgba(34,211,238,0.4)]">
                        SEINARU<br/>MAGECRAFT GIRLS
                    </h1>
                </>
            ) : (
                <>
                     <h2 className="font-cinzel text-white/60 text-lg md:text-2xl tracking-[0.3em] mb-6 animate-float-slow">
                        괴물은 사라져야 한다
                    </h2>
                    <h1 className="font-cinzel text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-cyan-900 leading-tight drop-shadow-[0_0_35px_rgba(34,211,238,0.4)]">
                        성스러운 마법소녀
                    </h1>
                </>
            )}
        </div>

        {/* Controls Container (Glassmorphism) */}
        <div className="w-full max-w-sm bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 flex flex-col items-center gap-8 animate-entrance delay-200 shadow-2xl transition-transform hover:scale-[1.01] duration-500">
            
            {/* Language Switcher */}
            <div className="relative flex bg-black/40 rounded-full p-1 border border-white/10">
                <button 
                    onClick={() => handleLangChange('en')}
                    className={`relative z-10 px-6 py-2 text-xs font-cinzel font-bold tracking-widest rounded-full transition-all duration-300 ${lang === 'en' ? 'text-black' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    ENGLISH
                </button>
                <button 
                    onClick={() => handleLangChange('ko')}
                    className={`relative z-10 px-6 py-2 text-xs font-cinzel font-bold tracking-widest rounded-full transition-all duration-300 ${lang === 'ko' ? 'text-black' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    KOREAN
                </button>
                {/* Sliding Background Pill */}
                <div 
                    className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-cyan-100 rounded-full transition-all duration-300 ease-out shadow-[0_0_15px_rgba(255,255,255,0.4)] ${lang === 'en' ? 'left-1' : 'left-[calc(50%+4px)]'}`}
                ></div>
            </div>

            {/* Start Button */}
            <button 
                onClick={handleStart}
                className="group relative w-full overflow-hidden rounded-lg bg-transparent px-8 py-5 transition-all duration-300 hover:bg-cyan-500/10 hover:shadow-[0_0_40px_rgba(34,211,238,0.2)] border border-cyan-500/50 hover:border-cyan-400"
            >
                <div className="absolute inset-0 w-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transition-all duration-[400ms] ease-out group-hover:w-full opacity-0 group-hover:opacity-100"></div>
                <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative font-cinzel text-2xl md:text-3xl text-cyan-100 tracking-[0.25em] font-bold group-hover:text-white transition-colors text-shadow-glow flex items-center justify-center">
                    {lang === 'en' ? "ENTER" : "시작하기"}
                </span>
            </button>

            {/* Photosensitivity Toggle */}
            <div className="flex items-center gap-3 group cursor-pointer opacity-60 hover:opacity-100 transition-opacity" onClick={() => setPhotosensitivity(!photosensitivity)}>
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${photosensitivity ? 'bg-cyan-600 border-cyan-500' : 'bg-transparent border-gray-600 group-hover:border-gray-400'}`}>
                    {photosensitivity && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                </div>
                <span className="text-[10px] text-gray-400 font-mono uppercase tracking-wider group-hover:text-gray-300 transition-colors select-none">
                    {lang === 'en' ? "Disable Flashing Effects" : "광과민성 효과 끄기"}
                </span>
            </div>

        </div>

        {/* Footer */}
        <div className="absolute bottom-6 opacity-30 hover:opacity-80 transition-opacity animate-entrance delay-300">
            <p className="text-[9px] text-white font-mono tracking-[0.2em] uppercase text-center">
                Original CYOA by NXTUB <span className="mx-2 text-cyan-500">•</span> Interactive by Saviapple
            </p>
        </div>

      </div>
    </div>
  );
};
