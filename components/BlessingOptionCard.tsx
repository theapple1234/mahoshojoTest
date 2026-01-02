
import React from 'react';
import type { ChoiceItem } from '../types';
import { renderFormattedText } from './ui';

interface BlessingOptionCardProps {
  item: ChoiceItem;
  isSelected: boolean;
  onSelect: (id: string) => void;
  children?: React.ReactNode;
  iconButton?: React.ReactNode;
  onIconButtonClick?: (e: React.MouseEvent) => void;
}

export const BlessingOptionCard: React.FC<BlessingOptionCardProps> = ({ item, isSelected, onSelect, children, iconButton, onIconButtonClick }) => {
  const { id, title, description, imageSrc } = item;
  
  const ringClass = isSelected 
    ? 'ring-2 ring-purple-400' 
    : 'group-hover:ring-2 group-hover:ring-purple-400/70';

  const handleIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onIconButtonClick?.(e);
  };

  return (
    <div 
      className="flex flex-col items-center text-center cursor-pointer group h-full"
      onClick={() => onSelect(id)}
      role="button"
      tabIndex={0}
    >
      <div className={`relative p-2 rounded-full transition-all duration-300 bg-black/20 ${ringClass}`}>
        <div className="w-64 h-64 rounded-full overflow-hidden shadow-lg shadow-black/50">
          <img 
            src={imageSrc} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
          />
        </div>
        {isSelected && iconButton && onIconButtonClick && (
          <button
            onClick={handleIconClick}
            className="absolute top-4 right-4 p-3 rounded-full bg-purple-900/50 text-purple-200/70 hover:bg-purple-800/60 hover:text-purple-100 transition-colors z-10"
            aria-label="Card action"
            title="Card action"
          >
            {iconButton}
          </button>
        )}
      </div>
      <h3 className="font-cinzel text-2xl font-bold mt-6 mb-3 text-white tracking-wider">{title}</h3>
      <div className="p-4 border-t border-gray-700 w-full max-w-sm flex-grow">
        <p className="text-gray-400 text-sm leading-relaxed">{renderFormattedText(description)}</p>
        {children}
      </div>
    </div>
  );
};
