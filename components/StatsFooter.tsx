
import React from 'react';
import { useCharacterContext } from '../context/CharacterContext';

export const StatsFooter: React.FC = () => {
  const { blessingPoints, fortunePoints, kuriPoints, selectedStarCrossedLovePacts, language, isIntroDone } = useCharacterContext();

  // Check if the specific pact is active to show KP
  const showKp = selectedStarCrossedLovePacts?.has('kuri_odans_charm');

  return (
    <div className={`fixed bottom-36 right-4 md:right-8 z-[90] pointer-events-none flex flex-col gap-3 items-end transition-all duration-1000 ease-out delay-[600ms] ${isIntroDone ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* BP Display */}
        <div className="pointer-events-auto relative group">
            <div className="absolute inset-0 bg-purple-600/20 blur-md rounded-lg group-hover:bg-purple-600/30 transition-all duration-500 opacity-75"></div>
            <div className="relative bg-[#0a0510]/90 border border-purple-500/30 backdrop-blur-xl p-3 pl-4 pr-6 rounded-lg flex flex-col min-w-[120px] md:min-w-[140px] shadow-lg transition-transform hover:scale-105 hover:border-purple-500/60">
                <div className="absolute top-0 left-0 w-1 h-full bg-purple-500 rounded-l-lg shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
                <span className="text-[9px] md:text-[10px] font-bold text-purple-400 uppercase tracking-[0.2em] mb-0.5 text-shadow-sm">
                    {language === 'ko' ? '축복 점수' : 'Blessing'}
                </span>
                <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl md:text-3xl font-cinzel font-bold text-white drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]">{blessingPoints}</span>
                    <span className="text-[10px] text-purple-500/80 font-bold">
                        {language === 'ko' ? '점' : 'BP'}
                    </span>
                </div>
            </div>
        </div>

        {/* FP Display */}
        <div className="pointer-events-auto relative group">
            <div className="absolute inset-0 bg-emerald-600/20 blur-md rounded-lg group-hover:bg-emerald-600/30 transition-all duration-500 opacity-75"></div>
            <div className="relative bg-[#05100a]/90 border border-emerald-500/30 backdrop-blur-xl p-3 pl-4 pr-6 rounded-lg flex flex-col min-w-[120px] md:min-w-[140px] shadow-lg transition-transform hover:scale-105 hover:border-emerald-500/60">
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 rounded-l-lg shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                <span className="text-[9px] md:text-[10px] font-bold text-emerald-400 uppercase tracking-[0.2em] mb-0.5 text-shadow-sm">
                    {language === 'ko' ? '행운 점수' : 'Fortune'}
                </span>
                <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl md:text-3xl font-cinzel font-bold text-white drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]">{fortunePoints}</span>
                    <span className="text-[10px] text-emerald-500/80 font-bold">
                        {language === 'ko' ? '점' : 'FP'}
                    </span>
                </div>
            </div>
        </div>

        {/* KP Display (Conditional) */}
        {showKp && (
            <div className="pointer-events-auto relative group animate-slide-in">
                <div className="absolute inset-0 bg-pink-600/20 blur-md rounded-lg group-hover:bg-pink-600/30 transition-all duration-500 opacity-75"></div>
                <div className="relative bg-[#10050a]/90 border border-pink-500/30 backdrop-blur-xl p-3 pl-4 pr-6 rounded-lg flex flex-col min-w-[120px] md:min-w-[140px] shadow-lg transition-transform hover:scale-105 hover:border-pink-500/60">
                    <div className="absolute top-0 left-0 w-1 h-full bg-pink-500 rounded-l-lg shadow-[0_0_10px_rgba(236,72,153,0.5)]"></div>
                    <span className="text-[9px] md:text-[10px] font-bold text-pink-400 uppercase tracking-[0.2em] mb-0.5 text-shadow-sm">
                        {language === 'ko' ? '쿠리-오단 점수' : 'Kuri-Odan'}
                    </span>
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl md:text-3xl font-cinzel font-bold text-white drop-shadow-[0_0_8px_rgba(236,72,153,0.6)]">{kuriPoints}</span>
                        <span className="text-[10px] text-pink-500/80 font-bold">
                            {language === 'ko' ? '점' : 'KP'}
                        </span>
                    </div>
                </div>
            </div>
        )}
        
        <style>{`
            .text-shadow-sm {
                text-shadow: 0 1px 2px rgba(0,0,0,0.8);
            }
            @keyframes slideInRight {
                from { opacity: 0; transform: translateX(20px); }
                to { opacity: 1; transform: translateX(0); }
            }
            .animate-slide-in {
                animation: slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
        `}</style>
    </div>
  );
};
