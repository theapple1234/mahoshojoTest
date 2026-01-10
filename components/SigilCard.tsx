
import React, { useRef } from 'react';
import type { Sigil } from '../types';
import { useCharacterContext } from '../context/CharacterContext';
import { useLongPress } from '../hooks/useLongPress';

interface SigilCardProps {
  sigil: Sigil;
  count: number;
  onAction: (action: 'buy' | 'sell') => void;
  onAnimate: (rect: DOMRect) => void;
}

export const SigilCard: React.FC<SigilCardProps> = ({ sigil, count, onAction, onAnimate }) => {
  const { id, title, description, imageSrc, cost } = sigil;
  const imgRef = useRef<HTMLImageElement>(null);
  const { language } = useCharacterContext();

  const handleBuy = () => {
    onAction('buy');
    if (imgRef.current) {
      onAnimate(imgRef.current.getBoundingClientRect());
    }
  };

  const handleSell = () => {
    if (count > 0) {
      onAction('sell');
    }
  };

  // Hybrid Interaction Logic:
  // Tap/Click -> Buy
  // Long Press -> Sell
  // Right Click -> Sell
  const longPressProps = useLongPress(
      (e) => {
         // Long Press Action
         handleSell();
         // Vibrate if supported
         if (navigator.vibrate) navigator.vibrate(50);
      },
      (e) => {
          // Tap/Click Action
          handleBuy();
      },
      { shouldPreventDefault: true, delay: 500 }
  );

  const glowColors: Record<string, string> = {
    kaarn: '#9ca3af',
    purth: '#4ade80',
    juathas: '#fbbf24',
  };
  const glowColor = glowColors[id] || '#ffffff';

  return (
    <div 
      className="group flex flex-col items-center text-center p-6 transition-all duration-300 ease-in-out bg-black/30 rounded-lg h-full border border-gray-700 hover:border-gray-500 cursor-pointer hover:bg-black/40 select-none relative active:scale-95"
      style={{ boxShadow: `0 0 10px ${glowColor}20` }}
      {...longPressProps}
      onContextMenu={(e) => { e.preventDefault(); handleSell(); }}
      role="button"
      tabIndex={0}
      aria-label={`Buy ${title}. Current count: ${count}`}
    >
      <div className="relative mb-4">
        <img 
            ref={imgRef} 
            src={imageSrc} 
            alt={title} 
            className="w-24 h-24 object-contain transition-transform group-hover:scale-110" 
            style={{ filter: `drop-shadow(0 0 10px ${glowColor}80)` }}
        />
      </div>
      <h3 className="font-cinzel text-2xl font-bold mt-2 mb-3 text-white tracking-wider" style={{ textShadow: `0 0 5px ${glowColor}` }}>{title}</h3>
      <div className="border-t border-gray-700 pt-4 flex-grow w-full">
        <p className="text-gray-200 text-sm leading-relaxed" style={{ textShadow: `0 0 3px ${glowColor}` }}>{description}</p>
        <p className="text-xs italic mt-4 font-bold" style={{ color: glowColor }}>{cost}</p>
      </div>
       <div className="mt-4 w-full">
         <p className="text-[10px] text-gray-500 italic font-mono uppercase tracking-tight">
            {language === 'ko' ? "좌클릭/탭: 구매 • 우클릭/홀드: 판매" : "L-Click/Tap: Buy • R-Click/Hold: Sell"}
         </p>
      </div>
    </div>
  );
};
