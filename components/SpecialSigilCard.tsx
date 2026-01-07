
import React from 'react';
import type { Sigil } from '../types';
import { useCharacterContext } from '../context/CharacterContext';

interface SpecialSigilCardProps {
  sigil: Sigil;
  selectedSubOptionIds: Set<string> | null;
  onSubOptionSelect: (id: string) => void;
  lekoluJobCounts?: Map<string, number>;
  onLekoluJobAction?: (subOptionId: string, action: 'buy' | 'sell') => void;
  fontSize?: 'regular' | 'large';
}

export const SpecialSigilCard: React.FC<SpecialSigilCardProps> = ({ sigil, selectedSubOptionIds, onSubOptionSelect, lekoluJobCounts, onLekoluJobAction, fontSize = 'regular' }) => {
  const { id, title, description, imageSrc, cost, subOptions } = sigil;
  const { language } = useCharacterContext();

  const glowColors: Record<string, string> = {
    xuth: '#ef4444',
    lekolu: '#facc15',
    sinthru: '#a855f7'
  };
  const glowColor = glowColors[id] || '#ffffff';
  
  const containerStyle = {
      boxShadow: `0 0 20px ${glowColor}15`,
      borderColor: `${glowColor}40`
  };

  const descriptionClass = fontSize === 'large' ? 'text-base' : 'text-sm';
  const subDescriptionClass = fontSize === 'large' ? 'text-sm' : 'text-xs';

  return (
    <div 
        className="flex flex-col lg:flex-row p-4 bg-black/30 rounded-lg border gap-4 select-none"
        style={containerStyle}
    >
      <div className="lg:w-1/3 flex-shrink-0 flex flex-col items-center lg:items-start text-center lg:text-left p-4 border-b lg:border-b-0 lg:border-r border-gray-700">
        <img 
            src={imageSrc} 
            alt={title} 
            className="w-24 h-24 object-contain flex-shrink-0 mb-4" 
            style={{ filter: `drop-shadow(0 0 8px ${glowColor}60)` }}
        />
        <div>
          <h3 className="font-cinzel text-3xl font-bold text-white tracking-wider" style={{ textShadow: `0 0 10px ${glowColor}80` }}>{title}</h3>
          <p className={`text-gray-200 ${descriptionClass} leading-relaxed mt-2`} style={{ textShadow: `0 0 3px ${glowColor}` }}>{description}</p>
          <p className="text-xs italic mt-2 font-bold" style={{ color: glowColor }}>{cost}</p>
        </div>
      </div>

      <div className="flex-grow p-2">
        {subOptions && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 h-full">
            {subOptions.map(option => {
              const count = id === 'lekolu' && lekoluJobCounts ? lekoluJobCounts.get(option.id) ?? 0 : 0;
              const isSelected = id === 'lekolu' ? count > 0 : selectedSubOptionIds?.has(option.id) ?? false;
              
              const colorConfig = {
                xuth: { selected: 'border-orange-500 ring-2 ring-orange-500/50', hover: 'hover:border-orange-400/70' },
                lekolu: { selected: 'border-yellow-400 ring-2 ring-yellow-400/50 bg-yellow-900/10', hover: 'hover:border-yellow-400/70' },
                sinthru: { selected: 'border-purple-500 ring-2 ring-purple-500/50', hover: 'hover:border-purple-400/70' },
                default: { selected: 'border-cyan-400 ring-2 ring-cyan-400', hover: 'hover:border-cyan-400/50' },
              };
              
              const theme = colorConfig[id as keyof typeof colorConfig] || colorConfig.default;
              const subBorderClass = isSelected ? theme.selected : `border-gray-700 ${theme.hover}`;

              if (id === 'lekolu' && onLekoluJobAction && lekoluJobCounts) {
                const handleBuy = (e: React.MouseEvent) => {
                    e.stopPropagation();
                    onLekoluJobAction(option.id, 'buy');
                };
                const handleSell = (e: React.MouseEvent) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (count > 0) onLekoluJobAction(option.id, 'sell');
                };

                return (
                  <div 
                    key={option.id} 
                    className={`flex flex-col p-3 bg-gray-900/50 border rounded-lg h-full transition-all duration-300 cursor-pointer relative group ${subBorderClass} ${count > 0 ? 'shadow-[0_0_15px_rgba(234,179,8,0.15)] transform -translate-y-1' : ''}`}
                    onClick={handleBuy}
                    onContextMenu={handleSell}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="relative">
                        <img 
                            src={option.imageSrc} 
                            alt="" 
                            className={`w-full h-32 object-cover rounded-md mb-3 transition-opacity duration-300 ${count > 0 ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'}`}
                        />
                        {count > 0 && (
                            <div className="absolute -top-3 -right-3 z-10 filter drop-shadow-lg">
                                <div className="relative w-12 h-12 flex items-center justify-center">
                                    <div className="absolute inset-0 bg-yellow-500/20 rounded-full blur-md"></div>
                                    <div className="absolute inset-2 bg-[#1a1005] border-2 border-yellow-500 transform rotate-45 shadow-[0_0_10px_rgba(234,179,8,0.5)]"></div>
                                    <div className="absolute inset-3 border border-yellow-500/50 transform rotate-45"></div>
                                    <span className="relative z-10 font-cinzel font-bold text-yellow-400 text-xl tracking-tighter drop-shadow-md select-none">
                                        {count}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                    <p className={`${subDescriptionClass} text-gray-200 leading-snug flex-grow`} style={{ textShadow: `0 0 2px ${glowColor}` }}>{option.description}</p>
                    <div className="mt-3 pt-2 border-t border-gray-700/50 flex justify-between text-[10px] text-gray-500 font-mono tracking-tight uppercase">
                        <span>{language === 'ko' ? "좌클릭: +1" : "L-Click: +1"}</span>
                        <span>{language === 'ko' ? "우클릭: -1" : "R-Click: -1"}</span>
                    </div>
                  </div>
                );
              } else {
                const columnSpanClass = id === 'xuth' ? 'sm:col-span-2' : '';
                return (
                  <div 
                    key={option.id}
                    className={`flex flex-col p-3 bg-gray-900/50 border rounded-lg h-full transition-colors cursor-pointer relative ${subBorderClass} ${columnSpanClass}`}
                    onClick={() => onSubOptionSelect(option.id)}
                    role="button"
                    tabIndex={0}
                  >
                    <img src={option.imageSrc} alt="" className="w-full h-32 object-cover rounded-md mb-3" />
                    <p className={`${subDescriptionClass} text-gray-200 leading-snug flex-grow`} style={{ textShadow: `0 0 2px ${glowColor}` }}>{option.description}</p>
                  </div>
                );
              }
            })}
          </div>
        )}
      </div>
    </div>
  );
};
