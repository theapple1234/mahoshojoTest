
import React, { useState } from 'react';
import { useCharacterContext } from '../context/CharacterContext';

interface SplashScreenProps {
  onStart: () => void;
  isExiting: boolean;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onStart, isExiting }) => {
  const { setPhotosensitivityDisabled, setLanguage } = useCharacterContext();
  const [lang, setLang] = useState<'en' | 'ko'>('en');
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

  const splashScreenClasses = `
    fixed top-0 left-0 w-full h-full bg-[#0a101f] z-[100]
    flex flex-col justify-center items-center
    ${isExiting ? 'animate' : ''}
  `;

  return (
    <div className={splashScreenClasses}>
      {/* Invisible dummy text to force font download immediately */}
      <div className="font-kidari absolute opacity-0 pointer-events-none w-0 h-0 overflow-hidden" aria-hidden="true">
        괴물은 사라져야 한다.
      </div>

      {/* Container - Centered */}
      <div className="flex flex-col items-center w-full max-w-4xl px-4">
        
        {/* Logo and Title Group */}
        <div className={`relative flex flex-col items-center justify-center mb-6 ${isExiting ? 'animate-logo-exit' : ''}`}>
            <img 
              id="splash-image" 
              src="/images/Z6tHPxPB-symbol-transparent.png" 
              alt="Symbol" 
              className="max-w-2xl w-3/4 md:w-1/2 no-glow relative z-0 opacity-90"
            />
            {/* Title below logo */}
            <h1 className="font-bold text-center mt-6 relative z-10">
                {lang === 'en' ? (
                    <span className="font-cinzel text-2xl md:text-3xl text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-cyan-400 tracking-[0.2em] drop-shadow-[0_0_10px_rgba(34,211,238,0.4)]">
                        SEINARU<br/>MAGECRAFT GIRLS
                    </span>
                ) : (
                    <>
                        <span className="font-kidari block text-2xl md:text-3xl mb-0 tracking-widest text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-normal">
                            괴물은 사라져야 한다.
                        </span>
                        <span className="font-kidari block text-4xl md:text-6xl font-bold -mt-2 pb-2 pt-4 leading-relaxed text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.4)]">
                            성스러운 마법소녀 CYOA
                        </span>
                    </>
                )}
            </h1>
        </div>
        
        {/* Controls Container - Slides Down on Exit */}
        <div className={`flex flex-col items-center transition-all mt-6 ${isExiting ? 'animate-slide-down-exit' : ''}`}>
            {/* Language Selection */}
            <div className="flex gap-4 mb-6">
                <button 
                    onClick={() => handleLangChange('en')}
                    className={`px-4 py-2 font-cinzel text-sm border rounded transition-all duration-300 ${lang === 'en' ? 'bg-cyan-900/50 border-cyan-500 text-cyan-200' : 'bg-transparent border-gray-700 text-gray-500 hover:text-gray-300'}`}
                >
                    ENGLISH
                </button>
                <button 
                    onClick={() => handleLangChange('ko')}
                    className={`px-4 py-2 font-cinzel text-sm border rounded transition-all duration-300 ${lang === 'ko' ? 'bg-cyan-900/50 border-cyan-500 text-cyan-200' : 'bg-transparent border-gray-700 text-gray-500 hover:text-gray-300'}`}
                >
                    KOREAN
                </button>
            </div>

            {/* Photosensitivity Toggle */}
            <div className="mb-8 flex items-start gap-3 max-w-md px-4">
                <input 
                    type="checkbox" 
                    id="photosensitivity-toggle"
                    checked={photosensitivity} 
                    onChange={(e) => setPhotosensitivity(e.target.checked)} 
                    className="mt-1 w-4 h-4 rounded border-gray-600 text-cyan-600 focus:ring-cyan-500 bg-gray-900 cursor-pointer"
                />
                <label htmlFor="photosensitivity-toggle" className="text-xs text-gray-400 cursor-pointer select-none leading-relaxed">
                {lang === 'en' 
                    ? "Disable photosensitive effects? Even though I don't know if it matters in this CYOA... there's always a 'what if'."
                    : "광과민성 연출을 끄시겠습니까? 비록 이런 CYOA에서 상관이 있을진 모르겠지만 말이에요... 만약이라는게 있으니 말이죠."}
                </label>
            </div>

            {/* Start Button */}
            <button 
                onClick={handleStart}
                className="px-12 py-3 font-cinzel text-2xl text-white tracking-[0.3em] border-2 border-white/20 hover:border-cyan-500 hover:text-cyan-300 hover:bg-cyan-950/30 rounded-sm transition-all duration-500 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]"
            >
                START
            </button>
        </div>

        <p id="splash-subtext" className="text-white text-[10px] mt-8 opacity-90 font-mono tracking-widest drop-shadow-md">
          ORIGINAL CYOA BY NXTUB | INTERACTIVE BY SAVIAPPLE IN ARCA.LIVE
        </p>
      </div>
    </div>
  );
};
