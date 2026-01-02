
import React, { useState } from 'react';
import { COMMON_SIGILS_DATA, SPECIAL_SIGILS_DATA } from '../constants';

interface SigilCounterProps {
  counts: { kaarn: number; purth: number; juathas: number; xuth: number; sinthru: number; lekolu: number; };
  onAction: (id: string, action: 'buy' | 'sell') => void;
  // New props for Special Sigil interactions
  selectedSpecialSigilChoices?: Map<string, Set<string>>;
  onSpecialSigilChoice?: (sigilId: string, subOptionId: string) => void;
  acquiredLekoluJobs?: Map<string, number>;
  onLekoluJobAction?: (subOptionId: string, action: 'buy' | 'sell') => void;
}

const ALL_SIGILS_META = [
    ...COMMON_SIGILS_DATA,
    ...SPECIAL_SIGILS_DATA
];

// Custom order: Lekolu moved before Sinthru
const SIGIL_DISPLAY_ORDER = ['kaarn', 'purth', 'juathas', 'xuth', 'lekolu', 'sinthru'];

export const SigilCounter: React.FC<SigilCounterProps> = ({ 
    counts, 
    onAction,
    selectedSpecialSigilChoices,
    onSpecialSigilChoice,
    acquiredLekoluJobs,
    onLekoluJobAction
}) => {
  const [activeSpecialSigil, setActiveSpecialSigil] = useState<string | null>(null);
  
  const handleItemClick = (e: React.MouseEvent, id: string, isCommon: boolean) => {
    e.stopPropagation();
    if (isCommon) {
      onAction(id, 'buy');
      setActiveSpecialSigil(null);
    } else {
      // Toggle popover for special sigils
      setActiveSpecialSigil(prev => prev === id ? null : id);
    }
  };

  const handleContextMenu = (e: React.MouseEvent, id: string, isCommon: boolean) => {
    if (isCommon) {
        e.preventDefault();
        e.stopPropagation();
        onAction(id, 'sell');
    } else {
        e.preventDefault();
        setActiveSpecialSigil(null);
    }
  };

  const getSigilColor = (id: string) => {
      switch(id) {
          case 'xuth': return 'border-red-500 text-red-100';
          case 'lekolu': return 'border-yellow-500 text-yellow-100';
          case 'sinthru': return 'border-purple-500 text-purple-100';
          default: return 'border-gray-500 text-white';
      }
  };

  const renderMissionPopover = () => {
      if (!activeSpecialSigil) return null;
      
      const sigilData = SPECIAL_SIGILS_DATA.find(s => s.id === activeSpecialSigil);
      if (!sigilData || !sigilData.subOptions) return null;

      const themeClass = getSigilColor(activeSpecialSigil);
      const isLekolu = activeSpecialSigil === 'lekolu';

      return (
          <div 
            className={`absolute right-[110%] top-0 w-80 max-h-[80vh] overflow-y-auto bg-black/95 backdrop-blur-xl border-2 rounded-xl p-4 shadow-2xl z-[100] ${themeClass} animate-slide-in-right`}
            onClick={(e) => e.stopPropagation()}
          >
              <div className="flex justify-between items-center mb-4 border-b border-white/20 pb-2">
                  <h5 className="font-cinzel font-bold text-lg tracking-wider">{sigilData.title} MISSIONS</h5>
                  <button 
                    onClick={() => setActiveSpecialSigil(null)}
                    className="text-white/50 hover:text-white transition-colors"
                  >
                      &times;
                  </button>
              </div>
              
              <div className="space-y-3">
                  {sigilData.subOptions.map(option => {
                      const isSelected = isLekolu 
                        ? (acquiredLekoluJobs?.get(option.id) || 0) > 0
                        : selectedSpecialSigilChoices?.get(activeSpecialSigil)?.has(option.id);
                      
                      const count = isLekolu ? (acquiredLekoluJobs?.get(option.id) || 0) : (isSelected ? 1 : 0);

                      return (
                          <div 
                            key={option.id}
                            className={`
                                relative p-2 rounded border transition-all cursor-pointer group flex gap-3
                                ${isSelected ? 'bg-white/10 border-current' : 'bg-transparent border-white/10 hover:border-white/30'}
                            `}
                            onClick={() => {
                                if (!isLekolu && onSpecialSigilChoice) {
                                    onSpecialSigilChoice(activeSpecialSigil, option.id);
                                } else if (isLekolu && onLekoluJobAction) {
                                    onLekoluJobAction(option.id, 'buy');
                                }
                            }}
                            onContextMenu={(e) => {
                                e.preventDefault();
                                if (isLekolu && onLekoluJobAction) {
                                    onLekoluJobAction(option.id, 'sell');
                                } else if (!isLekolu && onSpecialSigilChoice && isSelected) {
                                    onSpecialSigilChoice(activeSpecialSigil, option.id);
                                }
                            }}
                          >
                              <img src={option.imageSrc} alt="" className="w-16 h-16 object-cover rounded flex-shrink-0 bg-black/50" />
                              <div className="flex-grow min-w-0">
                                  <div className="flex justify-between items-start">
                                      <p className="text-[10px] text-gray-300 leading-tight line-clamp-3 mb-1">{option.description}</p>
                                  </div>
                                  
                                  {isLekolu && (
                                      <div className="flex items-center justify-end gap-2 mt-2">
                                          <span className="text-[10px] text-gray-500 uppercase tracking-wider">Count:</span>
                                          <span className="font-bold text-yellow-400">{count}</span>
                                      </div>
                                  )}
                                  {!isLekolu && isSelected && (
                                      <div className="flex justify-end mt-1">
                                          <span className="text-[10px] bg-white/20 px-1.5 rounded text-white font-bold tracking-wider">ACTIVE</span>
                                      </div>
                                  )}
                              </div>
                          </div>
                      );
                  })}
              </div>
              <div className="mt-3 pt-2 border-t border-white/10 text-[9px] text-center opacity-60">
                  {isLekolu ? "L-Click: Buy (+1) | R-Click: Sell (-1)" : "Click to Toggle Selection"}
              </div>
          </div>
      );
  };

  return (
    <div 
      className="fixed top-[35%] right-0 -translate-y-1/2 bg-black/80 backdrop-blur-md p-4 rounded-l-xl border-l border-t border-b border-gray-700 z-[80] shadow-2xl shadow-purple-900/20"
    >
      <h4 className="font-cinzel text-lg text-purple-300 mb-4 text-center tracking-widest border-b border-gray-700 pb-2">SIGILS</h4>
      
      {/* Container for Relative Positioning of Popover */}
      <div className="relative flex flex-col gap-2">
        {renderMissionPopover()}
        
        {SIGIL_DISPLAY_ORDER.map((id) => {
          const sigil = ALL_SIGILS_META.find(s => s.id === id);
          if (!sigil) return null;
          
          const count = counts[id as keyof typeof counts];
          const isCommon = ['kaarn', 'purth', 'juathas'].includes(id);
          const isActive = activeSpecialSigil === id;

          return (
            <div 
                key={id} 
                className={`
                    group flex items-center justify-between gap-3 p-2 rounded-lg transition-all cursor-pointer select-none active:scale-95
                    ${isActive ? 'bg-white/20 ring-1 ring-white/50' : 'hover:bg-white/10'}
                `}
                onClick={(e) => handleItemClick(e, id, isCommon)}
                onContextMenu={(e) => handleContextMenu(e, id, isCommon)}
                title={isCommon ? "Left-Click: Buy (+1) | Right-Click: Sell (-1)" : "Click to Open Mission Menu"}
            >
              <img src={sigil.imageSrc} alt={sigil.title} className="w-10 h-10 object-contain drop-shadow-md group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all" />
              <span className={`text-xl font-bold w-8 text-center ${count > 0 ? 'text-white' : 'text-gray-600'}`}>{count}</span>
            </div>
          );
        })}
      </div>
      <p className="text-[10px] text-gray-500 text-center mt-3 italic">
        L-Click: Buy/Menu<br/>R-Click: Sell/Close
      </p>
      
      <style>{`
        @keyframes slideInRight {
            from { opacity: 0; transform: translateX(20px); }
            to { opacity: 1; transform: translateX(0); }
        }
        .animate-slide-in-right {
            animation: slideInRight 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
