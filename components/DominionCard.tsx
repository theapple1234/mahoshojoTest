
import React from 'react';
import type { Dominion } from '../types';

interface DominionCardProps {
  dominion: Dominion;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export const DominionCard = React.memo<DominionCardProps>(({ dominion, isSelected, onSelect }) => {
  const { id, title, description, imageSrc } = dominion;

  const cardBorderClass = isSelected 
    ? 'border-white/30' 
    : 'border-gray-800/50 group-hover:border-white/20';

  const imageRingClass = isSelected
    ? 'ring-white/50 ring-2'
    : 'ring-gray-700/50 ring-1 group-hover:ring-white/40';

  return (
    <div 
      className="group relative pt-32 h-full cursor-pointer"
      onClick={() => onSelect(id)}
      role="button"
      tabIndex={0}
      aria-label={`Select Dominion: ${title}`}
      aria-pressed={isSelected}
    >
      {/* The circular image that overlaps */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 transition-all duration-300">
        <div className={`w-full h-full rounded-full bg-slate-900 p-1 transition-all duration-300 ${imageRingClass}`}>
            <img 
                src={imageSrc} 
                alt={title} 
                className="w-full h-full object-cover rounded-full"
            />
        </div>
         {/* Glow effect for selected state */}
        {isSelected && <div className="absolute top-0 left-0 w-full h-full rounded-full bg-white/10 blur-xl -z-10"></div>}
      </div>

      {/* The main card body for content */}
      <div className={`rounded-xl border p-6 pt-36 text-center h-full transition-colors duration-300 flex flex-col ${cardBorderClass}`}>
        <h3 className="font-cinzel text-xl font-bold mb-3 text-white tracking-wider uppercase">{title}</h3>
        <div className="w-20 h-px bg-white/20 mx-auto mb-4"></div>
        <p className="text-gray-300 text-sm leading-relaxed flex-grow">{description}</p>
      </div>
    </div>
  );
});
