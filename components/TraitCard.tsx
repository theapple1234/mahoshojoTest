
import React from 'react';
import type { ChoiceItem } from '../types';
import { renderFormattedText } from './ui';
import { useCharacterContext } from '../context/CharacterContext';

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
  hideImageBorder?: boolean;
  imagePaddingTop?: boolean;
}

// Configuration for Glass Themes
const GLASS_THEMES = {
    cyan: {
        borderSelected: 'border-cyan-400/60',
        bgSelected: 'bg-cyan-900/30',
        shadowSelected: 'shadow-[0_0_25px_rgba(34,211,238,0.15)]',
        textSelected: 'text-cyan-200',
        titleGlow: 'drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]',
        iconBg: 'bg-cyan-500',
        accentGradient: 'from-cyan-500/0 via-cyan-500/10 to-cyan-500/0'
    },
    amber: {
        borderSelected: 'border-amber-400/60',
        bgSelected: 'bg-amber-900/30',
        shadowSelected: 'shadow-[0_0_25px_rgba(251,191,36,0.15)]',
        textSelected: 'text-amber-200',
        titleGlow: 'drop-shadow-[0_0_5px_rgba(251,191,36,0.8)]',
        iconBg: 'bg-amber-500',
        accentGradient: 'from-amber-500/0 via-amber-500/10 to-amber-500/0'
    },
    green: {
        borderSelected: 'border-green-400/60',
        bgSelected: 'bg-green-900/30',
        shadowSelected: 'shadow-[0_0_25px_rgba(74,222,128,0.15)]',
        textSelected: 'text-green-200',
        titleGlow: 'drop-shadow-[0_0_5px_rgba(74,222,128,0.8)]',
        iconBg: 'bg-green-500',
        accentGradient: 'from-green-500/0 via-green-500/10 to-green-500/0'
    },
    brown: { // Mapping Brown to a warm Orange/Sepia tone for better visuals
        borderSelected: 'border-orange-400/60',
        bgSelected: 'bg-orange-950/30',
        shadowSelected: 'shadow-[0_0_25px_rgba(251,146,60,0.15)]',
        textSelected: 'text-orange-200',
        titleGlow: 'drop-shadow-[0_0_5px_rgba(251,146,60,0.8)]',
        iconBg: 'bg-orange-500',
        accentGradient: 'from-orange-500/0 via-orange-500/10 to-orange-500/0'
    },
    purple: {
        borderSelected: 'border-purple-400/60',
        bgSelected: 'bg-purple-900/30',
        shadowSelected: 'shadow-[0_0_25px_rgba(192,38,211,0.15)]',
        textSelected: 'text-purple-200',
        titleGlow: 'drop-shadow-[0_0_5px_rgba(192,38,211,0.8)]',
        iconBg: 'bg-purple-500',
        accentGradient: 'from-purple-500/0 via-purple-500/10 to-purple-500/0'
    }
};

export const ChoiceCard = React.memo<ChoiceCardProps>(({ 
    item, isSelected, onSelect, disabled = false, selectionColor = 'cyan', layout = 'vertical', 
    imageShape = 'rect', aspect, assignedColors = [], noBorder = false, children, 
    alwaysShowChildren = false, onIconButtonClick, iconButton, imageRounding = 'lg', 
    objectFit, descriptionColor = 'text-gray-400', textScale = 1, descriptionSizeClass, imageAspectRatio,
    hideImageBorder = false, imagePaddingTop = false
}) => {
  const { id, title, cost, description, imageSrc } = item;
  const { language } = useCharacterContext();
  const theme = GLASS_THEMES[selectionColor] || GLASS_THEMES.cyan;

  // --- Cost Rendering (Localized) ---
  const renderCost = (costStr: string) => {
      if (!costStr) return null;
      const processedStr = costStr.replace(/Costs\s+\+?0\s+(FP|BP)/i, 'Costs -0 $1');

      // Helper for English parsing
      const parseEnglish = () => {
          const regex = /(Costs|Grants|varies|,|[-+]?\d+\s*FP|[-+]?\d+\s*BP|Free)/gi;
          const parts = processedStr.split(regex).filter(p => p !== undefined && p !== "");
          let lastType: 'costs' | 'grants' | null = null;
          
          return parts.map((part, i) => {
              const upper = part.trim().toUpperCase();
              let colorClass = 'text-gray-500';
              if (upper === 'COSTS') { colorClass = "text-gray-400 font-bold uppercase text-[10px] tracking-wider"; lastType = 'costs'; }
              else if (upper === 'GRANTS') { colorClass = "text-gray-400 font-bold uppercase text-[10px] tracking-wider"; lastType = 'grants'; }
              else if (upper.includes('FP') || upper === 'FREE') colorClass = "text-green-400 font-bold shadow-black drop-shadow-sm";
              else if (upper.includes('BP')) colorClass = "font-bold text-fuchsia-300 drop-shadow-[0_0_3px_rgba(216,180,254,0.6)]";
              else if (upper.includes('VARIES')) colorClass = "text-yellow-400 font-bold";
              
              return <span key={i} className={colorClass}>{part} </span>;
          });
      };

      // Helper for Korean parsing
      const parseKorean = () => {
           const parts = processedStr.split(/((?:Costs|Grants)\s*[+-]?\d+\s*(?:FP|BP)|Free|Costs\s+Varies|Costs\s+varies|varies|소모값\s+변동)/i);
           return parts.map((part, i) => {
               const trimmed = part.trim();
               if (!trimmed) return null;
               if (trimmed.match(/^Free$/i)) return <span key={i} className="text-green-400 font-bold shadow-black drop-shadow-sm">무료</span>;
               
               const fpMatch = trimmed.match(/(?:Costs|Grants)\s*([+-]?\d+)\s*FP/i);
               if (fpMatch) return <span key={i} className="text-green-400 font-bold shadow-black drop-shadow-sm">행운 점수 {fpMatch[1]}</span>;

               const bpMatch = trimmed.match(/(?:Costs|Grants)\s*([+-]?\d+)\s*BP/i);
               if (bpMatch) return <span key={i} className="font-bold text-fuchsia-300 drop-shadow-[0_0_3px_rgba(216,180,254,0.6)]">축복 점수 {bpMatch[1]}</span>;

               if (trimmed.match(/Costs\s+Varies|Costs\s+varies|varies|소모값\s+변동/i)) {
                   if (id === 'magician') return <span key={i} className="font-bold text-fuchsia-300">축복 점수 -???</span>;
                   return <span key={i} className="text-yellow-400 font-bold">소모값 변동</span>;
               }
               if (['and', 'or', ','].includes(trimmed.toLowerCase())) return <span key={i} className="text-gray-500 mx-1">{trimmed === ',' ? ',' : (trimmed === 'and' ? '및' : '또는')}</span>;
               return null;
           });
      };

      return (
          <div className="text-[11px] mt-1.5 mb-0.5 bg-black/40 px-2 py-1 rounded-md border border-white/5 inline-block">
              {language === 'ko' ? parseKorean() : parseEnglish()}
          </div>
      );
  };

  // --- Dynamic Styles ---
  
  // Container State
  const containerClass = isSelected
    ? `${theme.bgSelected} ${theme.borderSelected} ${theme.shadowSelected} backdrop-blur-xl`
    : disabled
        ? "bg-black/20 border-white/5 opacity-50 grayscale cursor-not-allowed"
        : "bg-black/40 border-white/10 hover:border-white/30 hover:bg-black/60 hover:-translate-y-1 hover:shadow-xl backdrop-blur-md cursor-pointer";

  // Family Member Ring Colors (if assigned)
  // FIX: initializing ringStyle with values directly to avoid property access errors on CSSProperties type
  const ringStyle: React.CSSProperties = assignedColors.length > 0 ? {
      boxShadow: assignedColors
          .map((color, i) => `0 0 0 ${2 + i * 2}px ${color}, 0 0 10px ${2 + i * 2}px ${color}80`) // Glowy rings
          .join(',')
  } : {};

  // Rounding
  const roundingMap = { none: 'rounded-none', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', xl: 'rounded-xl' };
  const roundingClass = roundingMap[imageRounding] || 'rounded-lg';

  // --- Layout Renders ---

  // 1. Horizontal Tall (e.g. Uniforms)
  if (layout === 'horizontal-tall') {
    return (
      <div
        className={`relative flex flex-row p-1 rounded-xl border transition-all duration-300 group overflow-hidden ${containerClass}`}
        onClick={() => !disabled && onSelect(id)}
        style={ringStyle}
      >
        {/* Selection Gradient Overlay */}
        {isSelected && <div className={`absolute inset-0 bg-gradient-to-r ${theme.accentGradient} opacity-50 pointer-events-none`}></div>}
        
        <div className="relative w-28 h-40 flex-shrink-0 m-1 overflow-hidden rounded-lg">
             <div className={`absolute inset-0 bg-black/20 z-10 transition-opacity ${isSelected ? 'opacity-0' : 'opacity-20 group-hover:opacity-0'}`}></div>
             <img src={imageSrc} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        </div>
        
        <div className="flex flex-col justify-center p-3 flex-grow relative z-10">
             <h4 className={`font-cinzel font-bold text-sm leading-tight transition-colors ${isSelected ? theme.textSelected : 'text-gray-200 group-hover:text-white'}`}>
                <span style={textScale !== 1 ? { fontSize: `${textScale * 100}%` } : undefined}>{title}</span>
            </h4>
            {cost && renderCost(cost)}
            <div className="h-px w-full bg-white/10 my-2"></div>
            <p className="text-xs text-gray-400 leading-relaxed font-sans">{renderFormattedText(description)}</p>
            {(isSelected || alwaysShowChildren) && children && <div className="mt-2 pt-2 border-t border-white/10 w-full">{children}</div>}
        </div>
      </div>
    );
  }
    
  // 2. Horizontal (e.g. Traits)
  if (layout === 'horizontal') {
    const isSquare = aspect === 'square';
    const imgSize = isSquare ? 'w-24 h-24' : 'w-32 h-20';
    
    return (
      <div
        className={`relative flex items-center gap-4 p-3 rounded-xl border transition-all duration-300 group overflow-hidden ${containerClass}`}
        onClick={() => !disabled && onSelect(id)}
        style={ringStyle}
      >
        {/* Shine */}
        <div className="absolute top-0 -left-[100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 group-hover:animate-shine pointer-events-none"></div>

        <div className={`relative ${imgSize} flex-shrink-0 overflow-hidden ${imageShape === 'circle' ? `rounded-full ${hideImageBorder ? '' : 'border border-white/20'}` : roundingClass} ${imagePaddingTop ? 'mt-4' : ''}`}>
             <img src={imageSrc} alt={title} className={`w-full h-full ${objectFit || 'object-cover'} transition-transform duration-500 group-hover:scale-110`} />
             {onIconButtonClick && iconButton && (
                <button 
                  onClick={(e) => { e.stopPropagation(); onIconButtonClick(); }}
                  className={`absolute bottom-0 right-0 p-1.5 rounded-tl-lg ${theme.iconBg} text-white shadow-lg hover:brightness-110 transition-all z-20`}
                >
                  {iconButton}
                </button>
             )}
        </div>
        
        <div className="flex flex-col justify-center min-w-0 relative z-10">
          <h4 className={`font-cinzel font-bold text-sm truncate pr-2 transition-colors ${isSelected ? theme.textSelected : 'text-gray-200 group-hover:text-white'}`}>
              <span style={textScale !== 1 ? { fontSize: `${textScale * 100}%` } : undefined}>{title}</span>
          </h4>
          {cost && renderCost(cost)}
          <p className="text-[10px] text-gray-400 leading-tight mt-1 line-clamp-3">{renderFormattedText(description)}</p>
           {(isSelected || alwaysShowChildren) && children && <div className="mt-2">{children}</div>}
        </div>
      </div>
    );
  }

  // 3. Vertical (Standard Card)
  const fitClass = objectFit ? `object-${objectFit}` : (aspect === 'square' ? 'object-contain' : 'object-cover');
  const isCircle = imageShape === 'circle';

  // Fix: Handle circle layout specifically to prevent dimension conflicts
  const imageContainerClass = isCircle 
    ? `relative w-32 h-32 mx-auto rounded-full overflow-hidden ${hideImageBorder ? '' : 'border-2 border-white/10'} mb-3 flex-shrink-0 bg-black/20 shadow-md ${imagePaddingTop ? 'mt-4' : ''}`
    : `relative w-full ${aspect === 'square' ? 'h-full aspect-square' : (imageAspectRatio || 'h-40')} overflow-hidden ${roundingClass} mb-3 flex-shrink-0 bg-black/20 ${imagePaddingTop ? 'mt-4' : ''}`;

  return (
    <div
      className={`relative flex flex-col p-2 rounded-xl border transition-all duration-500 group overflow-hidden h-full ${containerClass}`}
      onClick={() => !disabled && onSelect(id)}
      style={ringStyle}
    >
      {/* Background Gradient for Selected */}
      {isSelected && <div className={`absolute inset-0 bg-gradient-to-b ${theme.accentGradient} opacity-30 pointer-events-none`}></div>}
      
      {/* Image Container */}
      <div className={imageContainerClass}>
         <div className={`absolute inset-0 transition-opacity duration-300 ${isSelected ? 'bg-transparent' : 'bg-black/10 group-hover:bg-transparent'}`}></div>
         <img 
            src={imageSrc} 
            alt={title} 
            className={`w-full h-full ${fitClass} transition-transform duration-700 ease-out group-hover:scale-105`} 
         />
         
         {/* Icon Button Overlay */}
         {onIconButtonClick && iconButton && (
            <button 
              onClick={(e) => { e.stopPropagation(); onIconButtonClick(); }}
              className={`absolute p-2 rounded-full backdrop-blur-md bg-black/50 border border-white/20 text-white hover:${theme.iconBg} hover:border-transparent transition-all z-20 shadow-lg`}
              style={isCircle ? { bottom: '4px', right: '4px' } : { top: '8px', right: '8px' }}
            >
              {iconButton}
            </button>
         )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow relative z-10 px-1">
        <h4 className={`font-cinzel font-bold text-center leading-tight transition-all duration-300 ${description ? 'text-sm mb-1' : 'text-xs'} ${isSelected ? `${theme.textSelected} ${theme.titleGlow}` : 'text-gray-200 group-hover:text-white'}`}>
             <span style={textScale !== 1 ? { fontSize: `${textScale * 100}%` } : undefined}>{title}</span>
        </h4>
        
        {cost && <div className="flex justify-center mb-2">{renderCost(cost)}</div>}
        
        {description && aspect !== 'square' && (
             <>
                <div className={`h-px w-12 mx-auto my-2 transition-all duration-500 ${isSelected ? 'bg-white/30 w-full' : 'bg-white/10 group-hover:w-24'}`}></div>
                <p className={`${descriptionSizeClass || 'text-[10px]'} leading-relaxed text-gray-400 ${isCircle ? 'text-center' : 'text-left'} flex-grow font-sans`}>
                    {renderFormattedText(description)}
                </p>
             </>
        )}

        {(isSelected || alwaysShowChildren) && children && (
            <div className="mt-3 pt-2 border-t border-white/10 w-full animate-fade-in">
                {children}
            </div>
        )}
      </div>

      {/* Selection Border Glow (Extra aesthetic layer) */}
      {isSelected && <div className={`absolute inset-0 rounded-xl border ${theme.borderSelected} pointer-events-none`}></div>}
    </div>
  );
});
