
import React from 'react';
import type { ChoiceItem } from '../types';
import { renderFormattedText } from './ui';

interface ChoiceCardProps {
  item: ChoiceItem;
  isSelected: boolean;
  onSelect: (id: string) => void;
  disabled?: boolean;
  selectionColor?: 'cyan' | 'amber' | 'green' | 'brown' | 'purple';
  layout?: 'vertical' | 'horizontal' | 'horizontal-tall';
  imageShape?: 'rect' | 'circle';
  aspect?: 'square';
  assignedColors?: string[];
  noBorder?: boolean;
  children?: React.ReactNode;
  alwaysShowChildren?: boolean;
  onIconButtonClick?: () => void;
  iconButton?: React.ReactNode;
  imageRounding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  descriptionColor?: string;
  textScale?: number;
  descriptionSizeClass?: string;
  imageAspectRatio?: string;
}

export const ChoiceCard = React.memo<ChoiceCardProps>(({ item, isSelected, onSelect, disabled = false, selectionColor = 'cyan', layout = 'vertical', imageShape = 'rect', aspect, assignedColors = [], noBorder = false, children, alwaysShowChildren = false, onIconButtonClick, iconButton, imageRounding = 'lg', objectFit, descriptionColor = 'text-gray-400', textScale = 1, descriptionSizeClass, imageAspectRatio }) => {
  const { id, title, cost, description, imageSrc } = item;

  const renderCost = (costStr: string) => {
      if (!costStr) return null;
      
      const processedStr = costStr.replace(/Costs\s+\+?0\s+(FP|BP)/i, 'Costs -0 $1');

      // Tokenize by significant keywords and separators to style individually
      const regex = /(Costs|Grants|varies|,|[-+]?\d+\s*FP|[-+]?\d+\s*BP|Free)/gi;
      const parts = processedStr.split(regex).filter(p => p !== undefined && p !== "");
      
      let lastType: 'costs' | 'grants' | null = null;

      return (
          <span className="text-[0.625rem] font-semibold my-1 block">
              {parts.map((part, i) => {
                  const upper = part.trim().toUpperCase();
                  let colorClass = 'text-gray-500';

                  if (upper === 'COSTS') {
                      colorClass = "text-white";
                      lastType = 'costs';
                  } else if (upper === 'GRANTS') {
                      colorClass = "text-white";
                      lastType = 'grants';
                  } else if (upper === 'VARIES') {
                      // Special case: Magician trait on Page 1 uses BP for its varying cost
                      if (id === 'magician' || lastType === 'grants') {
                          colorClass = "font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-300 to-purple-400 drop-shadow-[0_0_2px_rgba(192,38,211,0.5)]";
                      } else if (lastType === 'costs') {
                          colorClass = "text-green-400 font-bold";
                      } else {
                          colorClass = "text-green-400 font-bold"; // Fallback
                      }
                  } else if (upper.includes('FP') || upper === 'FREE') {
                      colorClass = "text-green-400 font-bold";
                  } else if (upper.includes('BP')) {
                      colorClass = "font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-300 to-purple-400 drop-shadow-[0_0_2px_rgba(192,38,211,0.5)]";
                  } else if (part === ',') {
                      colorClass = "text-white mr-1";
                  }

                  return <span key={i} className={colorClass}>{part}</span>;
              })}
          </span>
      );
  };

  const colorThemes = {
    cyan: {
        border: 'border-cyan-400',
        ring: 'ring-cyan-400',
        hover: 'hover:border-cyan-300/70',
        ringHover: 'group-hover:ring-cyan-300/70',
        bg: 'bg-slate-900/80',
        iconBg: 'bg-cyan-900/50',
        iconText: 'text-cyan-200/70',
        iconHoverBg: 'hover:bg-cyan-800/60',
        iconHoverText: 'hover:text-cyan-100',
    },
    amber: {
        border: 'border-amber-400',
        ring: 'ring-amber-400',
        hover: 'hover:border-amber-300/70',
        ringHover: 'group-hover:ring-amber-300/70',
        bg: 'bg-slate-900/80',
        iconBg: 'bg-amber-900/50',
        iconText: 'text-amber-200/70',
        iconHoverBg: 'hover:bg-amber-800/60',
        iconHoverText: 'hover:text-amber-100',
    },
    green: {
        border: 'border-green-400',
        ring: 'ring-green-400',
        hover: 'hover:border-green-300/70',
        ringHover: 'group-hover:ring-amber-300/70',
        bg: 'bg-slate-900/80',
        iconBg: 'bg-green-900/50',
        iconText: 'text-green-200/70',
        iconHoverBg: 'hover:bg-green-800/60',
        iconHoverText: 'hover:text-green-100',
    },
    brown: {
        border: 'border-yellow-700',
        ring: 'ring-yellow-700',
        hover: 'hover:border-yellow-600/70',
        ringHover: 'group-hover:ring-yellow-600/70',
        bg: 'bg-black/40',
        iconBg: 'bg-yellow-900/50',
        iconText: 'text-yellow-200/70',
        iconHoverBg: 'hover:bg-yellow-800/60',
        iconHoverText: 'hover:text-yellow-100',
    },
    purple: {
        border: 'border-purple-400',
        ring: 'ring-purple-400',
        hover: 'hover:border-purple-300/70',
        ringHover: 'group-hover:ring-purple-300/70',
        bg: 'bg-slate-900/80',
        iconBg: 'bg-purple-900/50',
        iconText: 'text-purple-200/70',
        iconHoverBg: 'hover:bg-purple-800/60',
        iconHoverText: 'hover:text-purple-100',
    }
  };
  const currentTheme = colorThemes[selectionColor] || colorThemes.cyan;

  const hasAssignedColors = assignedColors.length > 0;
  
  const cardStyle: React.CSSProperties = {};
  if (hasAssignedColors) {
    cardStyle.boxShadow = assignedColors
        .map((color, i) => `inset 0 0 0 ${2 * (i + 1)}px ${color}`)
        .join(',');
  }

  let borderClass: string;
  if (isSelected) {
    if (hasAssignedColors) {
      borderClass = 'border-2 border-transparent';
    } else {
      borderClass = `border-2 ${currentTheme.border}`;
    }
  } else {
    borderClass = `border border-gray-800 ${currentTheme.hover}`;
  }
  
  const interactionClass = disabled
    ? 'opacity-50 cursor-not-allowed'
    : 'cursor-pointer transition-colors';

  const showChildren = (isSelected || alwaysShowChildren) && React.Children.count(children) > 0;
  
  const handleIconButtonClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      onIconButtonClick?.();
  };

  const roundingClasses = {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
  };
  const imageRoundingClass = roundingClasses[imageRounding] || 'rounded-md';

  const CardWrapper: React.FC<{ children: React.ReactNode, className: string }> = ({ children, className }) => (
    <div
      className={`${className} relative`}
      style={cardStyle}
      onClick={() => !disabled && onSelect(id)}
      aria-disabled={disabled}
      role="button"
      tabIndex={disabled ? -1 : 0}
    >
      {children}
      {onIconButtonClick && iconButton && (
        <button 
          onClick={handleIconButtonClick}
          className={`absolute top-2 right-2 p-3 rounded-full ${currentTheme.iconBg} ${currentTheme.iconText} ${currentTheme.iconHoverBg} ${currentTheme.iconHoverText} transition-colors z-10`}
          aria-label="Card action"
          title="Card action"
          disabled={disabled}
        >
          {iconButton}
        </button>
      )}
    </div>
  );

  const textSpanStyle = textScale !== 1 ? { fontSize: `${textScale * 100}%` } : undefined;

  if (layout === 'horizontal-tall') {
    return (
      <CardWrapper className={`${currentTheme.bg} backdrop-blur-sm rounded-lg p-3 flex flex-row items-start gap-4 h-full text-left ${borderClass} ${interactionClass}`}>
        <img src={imageSrc} alt={title} className={`w-28 h-48 object-cover ${imageRoundingClass} flex-shrink-0`} />
        <div className="flex flex-col justify-start pt-2">
          <h4 className="font-bold font-cinzel text-white text-base"><span style={textSpanStyle}>{title}</span></h4>
          {cost && renderCost(cost)}
          <p className={`${descriptionSizeClass || 'text-sm'} leading-snug mt-1 whitespace-pre-wrap ${descriptionColor}`}>{renderFormattedText(description)}</p>
          {showChildren && (
              <div className="mt-2 pt-2 border-t border-gray-700/50">
                  {children}
              </div>
          )}
        </div>
      </CardWrapper>
    );
  }
    
  if (layout === 'horizontal') {
    const imageSizeClass = aspect === 'square' ? 'w-32 h-32' : 'w-32 h-24';
    const objectFitClass = objectFit || (aspect === 'square' ? 'object-cover' : 'object-contain');

    return (
      <CardWrapper className={`${currentTheme.bg} backdrop-blur-sm rounded-lg p-3 flex flex-row items-start gap-4 h-full text-left ${borderClass} ${interactionClass}`}>
        <img 
            src={imageSrc} 
            alt={title} 
            className={`${imageSizeClass} ${objectFitClass} bg-black/20 flex-shrink-0 ${imageShape === 'circle' ? 'rounded-full' : imageRoundingClass}`} 
        />
        <div className="flex flex-col justify-center">
          <h4 className="font-bold font-cinzel text-white"><span style={textSpanStyle}>{title}</span></h4>
          {cost && renderCost(cost)}
          <p className={`${descriptionSizeClass || 'text-sm'} leading-snug mt-1 whitespace-pre-wrap ${descriptionColor}`}>{renderFormattedText(description)}</p>
           {showChildren && (
              <div className="mt-2 pt-2 border-t border-gray-700/50">
                  {children}
              </div>
          )}
        </div>
      </CardWrapper>
    );
  }

  const fitClass = objectFit ? `object-${objectFit}` : (aspect === 'square' ? 'object-contain' : 'object-cover');

  return (
    <CardWrapper className={`${currentTheme.bg} backdrop-blur-sm rounded-lg p-2 sm:p-4 flex flex-col h-full text-center ${borderClass} ${interactionClass} ${aspect === 'square' ? 'aspect-square' : ''}`}>
      {imageShape === 'circle' ? (
        <div className={`p-1 rounded-full mx-auto mb-2 sm:mb-4 transition-all`}>
          <img src={imageSrc} alt={title} className="w-36 h-36 object-cover rounded-full" />
        </div>
      ) : (
        <img 
            src={imageSrc} 
            alt={title} 
            className={`w-full ${aspect === 'square' ? 'flex-grow min-h-0' : (imageAspectRatio || 'h-48')} ${fitClass} ${imageRoundingClass} ${aspect === 'square' ? 'mb-2' : 'mb-4'}`} 
        />
      )}
      
      <div className={`flex flex-col justify-center ${aspect === 'square' ? '' : 'flex-grow'}`}>
        <h4 className={`font-bold font-cinzel text-white whitespace-pre-wrap ${description ? 'text-sm sm:text-base' : 'text-xs sm:text-sm'}`}>
            <span style={textSpanStyle}>{title}</span>
        </h4>
        {cost && renderCost(cost)}
        {description && aspect !== 'square' && <p className={`${descriptionSizeClass || 'text-xs'} leading-snug mt-2 flex-grow text-left whitespace-pre-wrap ${descriptionColor}`}>{renderFormattedText(description)}</p>}
        {showChildren && (
            <div className="mt-2 pt-2 border-t border-gray-700/50">
                {children}
            </div>
        )}
      </div>
    </CardWrapper>
  );
});
