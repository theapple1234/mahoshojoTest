
import React from 'react';
import { renderFormattedText } from '../ui';
import { useCharacterContext } from '../../context/CharacterContext';

interface ReferenceItemCardProps { 
    item: any; 
    isSelected: boolean; 
    onSelect: (id: string) => void; 
    disabled?: boolean; 
    layout?: 'default' | 'trait';
    children?: React.ReactNode;
    iconButton?: React.ReactNode;
    onIconButtonClick?: () => void;
}

export const ReferenceItemCard: React.FC<ReferenceItemCardProps> = ({ item, isSelected, onSelect, disabled, layout = 'default', children, iconButton, onIconButtonClick }) => {
    const { language } = useCharacterContext();

    let borderClass = isSelected 
        ? 'border-cyan-400 ring-2 ring-cyan-400/50' 
        : disabled 
            ? 'border-gray-800 opacity-50 cursor-not-allowed' 
            : 'border-gray-700 hover:border-cyan-400/50 cursor-pointer';
            
    let bgClass = isSelected ? 'bg-cyan-900/20' : 'bg-black/40';

    // Custom styling for Personality Traits
    if (layout === 'trait') {
        borderClass = isSelected 
            ? 'border-transparent ring-2 ring-cyan-400/50' 
            : disabled 
                ? 'border-transparent opacity-50 cursor-not-allowed' 
                : 'border-transparent hover:bg-white/10 cursor-pointer';
        
        bgClass = isSelected ? 'bg-cyan-900/20' : 'bg-transparent';
    }
    
    const renderCost = (cost: any) => {
         if (language === 'ko') {
             if (typeof cost === 'number') {
                 return `${cost} 포인트`;
             }
             if (typeof cost === 'string') {
                 return cost.replace('points', '포인트').replace('pts', '포인트');
             }
         }
         return typeof cost === 'number' ? `${cost} points` : cost;
    };

    return (
        <div 
            className={`p-3 rounded-lg border transition-all flex flex-col items-center text-center h-full relative ${borderClass} ${bgClass}`}
            onClick={() => !disabled && onSelect(item.id)}
        >
            {layout === 'default' && (
                <img src={item.imageSrc} alt={item.title} className="w-full aspect-[4/3] object-cover mb-3 rounded-md bg-black/20" />
            )}
            {layout === 'trait' && (
                <img src={item.imageSrc} alt={item.title} className="w-16 h-16 object-cover rounded-full mb-2 scale-110" />
            )}
            
            {isSelected && iconButton && (
                <div 
                    className="absolute top-2 right-2 z-10 flex flex-col gap-2"
                    onClick={(e) => e.stopPropagation()} 
                >
                    {onIconButtonClick ? (
                        <button
                            onClick={(e) => { e.stopPropagation(); onIconButtonClick(); }}
                            className="p-2 rounded-full bg-cyan-900/80 text-cyan-200 hover:bg-cyan-700 hover:text-white transition-colors border border-cyan-500/50"
                            title="Action"
                        >
                            {iconButton}
                        </button>
                    ) : (
                        iconButton
                    )}
                </div>
            )}
            
            <h4 className={`font-cinzel font-bold text-white ${layout === 'trait' ? 'text-sm' : 'text-lg'}`}>{item.title}</h4>
            
            {layout === 'default' && item.requirement && (
                <p className="text-[10px] text-yellow-500/90 italic font-medium mt-1 mb-0.5 px-1 leading-tight">{item.requirement}</p>
            )}

            {item.cost !== undefined && item.cost !== 0 && (
                <p className="text-xs text-red-400 font-semibold mt-1">
                    {renderCost(item.cost)}
                </p>
            )}
            
            {layout === 'default' && item.description && (
                <p className="text-xs text-gray-400 mt-2 leading-tight flex-grow whitespace-pre-wrap">{renderFormattedText(item.description)}</p>
            )}
            
            {children}
        </div>
    );
};
