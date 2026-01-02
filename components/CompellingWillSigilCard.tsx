
import React from 'react';

export type SigilColor = 'red' | 'green' | 'gray' | 'yellow' | 'orange' | 'lime' | 'purple' | 'blue';

interface CompellingWillSigilCardProps {
  sigil: {id: string, title: string, imageSrc: string, description?: string};
  isSelected: boolean;
  isDisabled: boolean;
  onSelect: (id: string) => void;
  benefitsContent: React.ReactNode;
  color: SigilColor;
  compact?: boolean;
  onToggleKp?: () => void;
  isKpPaid?: boolean;
  titleClassName?: string;
}

export const CompellingWillSigilCard: React.FC<CompellingWillSigilCardProps> = ({ 
    sigil, isSelected, isDisabled, onSelect, benefitsContent, color, compact = false, onToggleKp, isKpPaid = false, titleClassName = ""
}) => {
  const { id, title, imageSrc, description } = sigil;
  
  const colorClassMap = {
      red: { border: 'border-red-400', ring: 'ring-red-400', hover: 'hover:border-red-400/70', text: 'text-red-300' },
      green: { border: 'border-green-400', ring: 'ring-green-400', hover: 'hover:border-green-400/70', text: 'text-green-300' },
      gray: { border: 'border-gray-400', ring: 'ring-gray-400', hover: 'hover:border-gray-400/70', text: 'text-gray-300' },
      yellow: { border: 'border-yellow-400', ring: 'ring-yellow-400', hover: 'hover:border-yellow-400/70', text: 'text-yellow-300' },
      orange: { border: 'border-orange-400', ring: 'ring-orange-400', hover: 'hover:border-orange-400/70', text: 'text-orange-300' },
      lime: { border: 'border-lime-400', ring: 'ring-lime-400', hover: 'hover:border-lime-400/70', text: 'text-lime-300' },
      purple: { border: 'border-purple-400', ring: 'ring-purple-400', hover: 'hover:border-purple-400/70', text: 'text-purple-300' },
      blue: { border: 'border-blue-400', ring: 'ring-blue-400', hover: 'hover:border-blue-400/70', text: 'text-blue-300' },
  };

  const kpStyle = { border: 'border-pink-500', ring: 'ring-pink-500', hover: 'hover:border-pink-400', text: 'text-pink-300' };
  const currentColors = isKpPaid ? kpStyle : (colorClassMap[color] || colorClassMap.gray);

  const borderClass = isSelected 
    ? `${currentColors.border} ring-2 ${currentColors.ring}` 
    : `border-gray-700 ${currentColors.hover}`;
  
  const interactionClass = isDisabled
    ? 'opacity-40 cursor-not-allowed'
    : 'cursor-pointer';

  const layoutClass = compact 
    ? 'w-44 aspect-square justify-center' 
    : 'h-full w-44 min-h-[160px] justify-between';

  const handleContextMenu = (e: React.MouseEvent) => {
      if (onToggleKp && isSelected) {
          e.preventDefault();
          e.stopPropagation();
          onToggleKp();
      }
  };

  return (
    <div 
      className={`group flex flex-col items-center text-center p-3 transition-all duration-300 ease-in-out bg-black/40 rounded-lg border ${borderClass} ${interactionClass} ${layoutClass} relative`}
      onClick={() => !isDisabled && onSelect(id)}
      onContextMenu={handleContextMenu}
      role="button"
      tabIndex={isDisabled ? -1 : 0}
      aria-disabled={isDisabled}
    >
      {isKpPaid && (
          <div className="absolute top-2 right-2 bg-pink-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm z-10">
            KP
          </div>
      )}
      <img src={imageSrc} alt={title} className={`w-16 h-16 object-contain ${compact ? 'mb-3' : 'mb-2'}`} />
      <div className="flex flex-col w-full">
        <h3 className={`font-cinzel font-bold tracking-wider ${currentColors.text} ${titleClassName || 'text-sm'}`}>{title}</h3>
        <div className={`border-t border-gray-600 w-full pt-2 mt-2 text-xs`}>
          {benefitsContent}
          {description && <p className="text-yellow-300 italic text-[10px] mt-1 whitespace-pre-wrap">{description}</p>}
        </div>
      </div>
    </div>
  );
};
