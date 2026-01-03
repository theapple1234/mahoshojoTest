
import React, { Fragment, useMemo } from 'react';
import type { Classmate, ChoiceItem, Dominion } from '../types';
import { renderFormattedText } from './ui';
import {
  DOMINIONS,
  ESSENTIAL_BOONS_DATA, MINOR_BOONS_DATA, MAJOR_BOONS_DATA,
  TELEKINETICS_DATA, METATHERMICS_DATA,
  ELEANORS_TECHNIQUES_DATA, GENEVIEVES_TECHNIQUES_DATA,
  BREWING_DATA, SOUL_ALCHEMY_DATA, TRANSFORMATION_DATA,
  CHANNELLING_DATA, NECROMANCY_DATA, BLACK_MAGIC_DATA,
  TELEPATHY_DATA, MENTAL_MANIPULATION_DATA,
  ENTRANCE_DATA, FEATURES_DATA, INFLUENCE_DATA,
  NET_AVATAR_DATA, TECHNOMANCY_DATA, NANITE_CONTROL_DATA,
  RIGHTEOUS_CREATION_SPECIALTIES_DATA, RIGHTEOUS_CREATION_MAGITECH_DATA, 
  RIGHTEOUS_CREATION_ARCANE_CONSTRUCTS_DATA, RIGHTEOUS_CREATION_METAMAGIC_DATA,
  STAR_CROSSED_LOVE_PACTS_DATA
} from '../constants';

interface ClassmateCardProps {
  classmate: Classmate;
  isSelected: boolean;
  onSelect: (id: string) => void;
  disabled?: boolean;
  selectionColor?: 'amber' | 'brown';
  refundText?: string;
  uniformId?: string;
  uniformName?: string;
  onUniformButtonClick: (id: string) => void;
}

const UniformIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M17.293 3.293A1 1 0 0118 4v12a1 1 0 01-1 1H3a1 1 0 01-1-1V4a1 1 0 011-1h1.293l.94-1.566A1 1 0 016.133 2h7.734a1 1 0 01.894.434L15.707 3H17.293zM10 8a3 3 0 100 6 3 3 0 000-6z" />
        <path d="M4 4h2l-1-2-1 2zM14 4h2l-1-2-1 2z" />
    </svg>
);

const UNIFORM_SQUARE_IMAGES: Record<string, string> = {
    'idol': 'https://i.ibb.co/WvchRHJJ/uni1square.jpg',
    'witchy': 'https://i.ibb.co/dJX4K5L4/uni2square.png',
    'boyish': 'https://i.ibb.co/4ZXPyyZb/uni3square.jpg',
    'high_tech': 'https://i.ibb.co/YB1tLH4f/uni4square.jpg',
    'animal_themed': 'https://i.ibb.co/XxZ5Sspd/uni5square.jpg',
    'old_timey': 'https://i.ibb.co/r2hDt27q/uni6square.jpg',
    'oriental': 'https://i.ibb.co/3mdhV9G2/uni7square.jpg',
    'custom': 'https://i.ibb.co/vC5G31jM/uni8square.png',
};
const UNIDENTIFIED_IMAGE = 'https://i.ibb.co/HfL17Fvn/uniquestionsquare.jpg';

// Collect all power data for grade lookup
const ALL_POWERS = [
    ...ESSENTIAL_BOONS_DATA, ...MINOR_BOONS_DATA, ...MAJOR_BOONS_DATA,
    ...TELEKINETICS_DATA, ...METATHERMICS_DATA,
    ...ELEANORS_TECHNIQUES_DATA, ...GENEVIEVES_TECHNIQUES_DATA,
    ...BREWING_DATA, ...SOUL_ALCHEMY_DATA, ...TRANSFORMATION_DATA,
    ...CHANNELLING_DATA, ...NECROMANCY_DATA, ...BLACK_MAGIC_DATA,
    ...TELEPATHY_DATA, ...MENTAL_MANIPULATION_DATA,
    ...ENTRANCE_DATA, ...FEATURES_DATA, ...INFLUENCE_DATA,
    ...NET_AVATAR_DATA, ...TECHNOMANCY_DATA, ...NANITE_CONTROL_DATA,
    ...RIGHTEOUS_CREATION_SPECIALTIES_DATA, ...RIGHTEOUS_CREATION_MAGITECH_DATA,
    ...RIGHTEOUS_CREATION_ARCANE_CONSTRUCTS_DATA, ...RIGHTEOUS_CREATION_METAMAGIC_DATA,
    ...STAR_CROSSED_LOVE_PACTS_DATA
];

const getGradeColorClass = (grade?: string, isBold: boolean = true) => {
    const weight = isBold ? 'font-bold' : 'font-normal';
    switch (grade) {
        case 'kaarn': return `text-white ${weight}`;
        case 'purth': return `text-green-400 ${weight}`;
        case 'xuth': return `text-red-400 ${weight}`;
        case 'sinthru': return `text-purple-400 ${weight}`;
        case 'lekolu': return `text-yellow-400 ${weight}`;
        default: return `text-white ${weight}`;
    }
};

const resolvePowerData = (text: string): ChoiceItem | undefined => {
    const normalized = text.toLowerCase().trim();
    
    // 1. Manual Aliases & Correction logic
    if (normalized.includes('subatomic')) return TELEKINETICS_DATA.find(p => p.id === 'subatomic_manipulation');
    if (normalized.includes('vampirism')) return BLACK_MAGIC_DATA.find(p => p.id === 'vampirism');
    if (normalized.includes('undead thrall')) return BLACK_MAGIC_DATA.find(p => p.id === 'undead_thrall');
    if (normalized.includes('flower') && normalized.includes('blood')) return BLACK_MAGIC_DATA.find(p => p.id === 'flowers_of_blood');
    if (normalized.includes('manual override')) return TECHNOMANCY_DATA.find(p => p.id === 'manual_override');
    if (normalized.includes('hypnos')) return MENTAL_MANIPULATION_DATA.find(p => p.id === 'hypnotist');
    if (normalized.includes('human marionettes')) return SOUL_ALCHEMY_DATA.find(p => p.id === 'human_marionettes');
    
    // Additional Fixes
    if (normalized.includes('forsake humanity')) return TRANSFORMATION_DATA.find(p => p.id === 'shed_humanity_i');
    if (normalized.includes('subatomic destruction')) return TELEKINETICS_DATA.find(p => p.id === 'subatomic_manipulation');
    if (normalized.includes('guardian angel')) return ELEANORS_TECHNIQUES_DATA.find(p => p.id === 'guardian_angels');
    if (normalized.includes('speed run')) return MINOR_BOONS_DATA.find(p => p.id === 'speed_plus');
    if (normalized.includes('i am not a weapon')) return MENTAL_MANIPULATION_DATA.find(p => p.id === 'masquerade');
    if (normalized.includes('hokuto senjukai ken')) return MAJOR_BOONS_DATA.find(p => p.id === 'hokuto_senjukai_ken');
    if (normalized.includes('psychic force ii')) return TELEKINETICS_DATA.find(p => p.id === 'psychic_force_ii');
    if (normalized.includes('summon creature')) return INFLUENCE_DATA.find(p => p.id === 'summon_creature');
    if (normalized === 'c r a z y') return INFLUENCE_DATA.find(p => p.id === 'summon_weather') || ALL_POWERS.find(p => p.id === 'summon_weather');
    
    // 2. Exact Title Match
    const exact = ALL_POWERS.find(p => p.title.toLowerCase() === normalized);
    if (exact) return exact;

    // 3. Contains Match
    const container = ALL_POWERS.find(p => p.title.toLowerCase().includes(normalized));
    if (container) return container;
    
    // 4. Reverse Contains
    const contained = ALL_POWERS.find(p => normalized.includes(p.title.toLowerCase()));
    if (contained) return contained;

    return undefined;
};

const InfoTooltip: React.FC<{ title: string; description: string; imageSrc: string; children: React.ReactNode }> = ({ title, description, imageSrc, children }) => (
    <span className="relative group/tooltip inline-block">
        <span className="border-b border-dashed border-white/30 cursor-help hover:text-white transition-colors">
            {children}
        </span>
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-72 p-0 bg-[#0a0a0a] border border-white/20 rounded-lg shadow-[0_0_25px_rgba(0,0,0,0.9)] opacity-0 group-hover/tooltip:opacity-100 transition-all duration-200 pointer-events-none z-[100] text-left scale-95 group-hover/tooltip:scale-100 origin-bottom">
            <div className="relative h-32 w-full overflow-hidden rounded-t-lg bg-gray-900">
                <img src={imageSrc} className="w-full h-full object-cover opacity-80" alt={title} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent opacity-60"></div>
                <div className="absolute bottom-2 left-3 font-cinzel text-xs font-bold text-white uppercase tracking-wider drop-shadow-md">{title}</div>
            </div>
            <div className="p-3">
                <div className="text-[10px] text-gray-300 leading-normal font-normal whitespace-normal line-clamp-6 text-justify">
                    {description}
                </div>
            </div>
            {/* Arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-[#0a0a0a]"></div>
        </span>
    </span>
);

const ColoredPowerText: React.FC<{ text: string; isBold?: boolean }> = ({ text, isBold = true }) => {
    const parts = useMemo(() => text.split(',').map(p => p.trim()), [text]);
    
    return (
        <span>
            {parts.map((part, i) => {
                const powerData = resolvePowerData(part);
                const colorClass = getGradeColorClass(powerData?.grade, isBold);
                
                const content = <span className={colorClass}>{part}</span>;

                return (
                    <span key={i}>
                        {powerData ? (
                            <InfoTooltip 
                                title={powerData.title} 
                                description={powerData.description} 
                                imageSrc={powerData.imageSrc}
                            >
                                {content}
                            </InfoTooltip>
                        ) : content}
                        {i < parts.length - 1 && <span className="text-white mr-1">, </span>}
                    </span>
                );
            })}
        </span>
    );
};

export const ClassmateCard: React.FC<ClassmateCardProps> = ({ classmate, isSelected, onSelect, disabled = false, selectionColor = 'amber', refundText, uniformId, uniformName, onUniformButtonClick }) => {
  const { id, name, cost, description, imageSrc, birthplace, signature, otherPowers } = classmate;

  const dominionInfo = useMemo(() => {
      const normalizedBirthplace = birthplace.toLowerCase().trim();
      return DOMINIONS.find(d => 
          d.title.toLowerCase() === normalizedBirthplace || 
          d.id.toLowerCase() === normalizedBirthplace
      );
  }, [birthplace]);

  const themeClasses = {
      amber: {
          border: 'border-amber-400',
          ring: 'ring-amber-400',
          hover: 'hover:border-amber-300/70',
          bg: 'bg-black/30'
      },
      brown: {
          border: 'border-yellow-700',
          ring: 'ring-yellow-700',
          hover: 'hover:border-yellow-600/70',
          bg: 'bg-black/40'
      }
  };
  const currentTheme = themeClasses[selectionColor];

  const borderClass = isSelected ? `${currentTheme.border} ring-2 ${currentTheme.ring}` : 'border-gray-800';

  const interactionClass = disabled
    ? 'opacity-50 cursor-not-allowed'
    : `cursor-pointer ${currentTheme.hover} transition-colors`;

  const handleUniformClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUniformButtonClick(id);
  };

  const renderCost = (costStr: string) => {
      const regex = /(Costs|Grants|[-+]?\d+\s*FP|[-+]?\d+\s*BP)/gi;
      const parts = costStr.split(regex).filter(p => p !== undefined && p !== "");
      
      return (
          <span className="text-sm font-semibold">
              {parts.map((part, i) => {
                  const upper = part.trim().toUpperCase();
                  if (upper === 'COSTS' || upper === 'GRANTS') {
                      return <span key={i} className="text-white">{part} </span>;
                  }
                  if (upper.includes('FP')) {
                      return <span key={i} className="text-green-400 font-bold">{part}</span>;
                  }
                  if (upper.includes('BP')) {
                      return <span key={i} className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-300 to-purple-400 drop-shadow-[0_0_2px_rgba(192,38,211,0.5)]">{part}</span>;
                  }
                  return <span key={i}>{part}</span>;
              })}
          </span>
      );
  };

  const renderDescription = () => {
    if (id === 'licenda') {
        const parts = description.split('\n\n');
        return (
            <>
                {parts.map((part, index) => {
                    if (part.includes("Some rumor that the spirit")) {
                        const splitText = "Some rumor that the spirit is her own ";
                        const [before] = part.split(splitText);
                        
                        return (
                            <p key={index} className="mb-4 last:mb-0">
                                {renderFormattedText(before)}
                                {splitText}
                                <span className="text-white/30 font-bold">sister</span>
                                , whose life she was forced to snuff out for the viewing pleasure of their captors. I don't <span className="bg-gradient-to-r from-gray-400 to-transparent text-transparent bg-clip-text font-bold decoration-clone">even remember what her name was.</span>
                            </p>
                        );
                    }
                    return <p key={index} className="mb-4 last:mb-0">{renderFormattedText(part)}</p>;
                })}
            </>
        );
    }
    return description.split('\n\n').map((paragraph, idx) => (
        <p key={idx} className="mb-4 last:mb-0">{renderFormattedText(paragraph)}</p>
    ));
  };

  const renderRefund = (text: string) => {
      const parts = text.split(/(\+?\d+\s*FP)/g);
      return (
          <p className="text-xs font-semibold mt-1">
              {parts.map((part, i) => {
                  if (part.match(/\+?\d+\s*FP/)) {
                      return <span key={i} className="text-green-400 font-bold">{part}</span>;
                  }
                  return <span key={i} className="text-white">{part}</span>;
              })}
          </p>
      );
  };

  return (
    <div
      className={`relative flex flex-col md:flex-row p-4 ${currentTheme.bg} border rounded-lg h-full gap-6 ${interactionClass} ${borderClass}`}
      onClick={() => !disabled && onSelect(id)}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
    >
      {/* Left Column: Image, Name, Cost, Stats */}
      <div className="w-full md:w-72 flex-shrink-0 flex flex-col">
          <img 
            src={imageSrc} 
            alt={name} 
            className="w-full aspect-[3/4] object-cover rounded-md mb-4 border border-white/10" 
          />
          
          <div className="text-center mb-4">
              <h4 className="font-bold font-cinzel text-white text-2xl tracking-widest mb-1">{name}</h4>
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-white/40 to-transparent mx-auto mb-2"></div>
              {renderCost(cost)}
              {refundText && renderRefund(refundText)}
          </div>

          <div className="text-xs text-gray-300 space-y-2 text-center md:text-left bg-black/20 p-3 rounded border border-white/5 flex-grow">
              <p>
                <strong className="text-gray-500 font-bold block md:inline md:mr-1 uppercase tracking-wider text-[0.625rem]">Birthplace:</strong> 
                {dominionInfo ? (
                    <InfoTooltip title={dominionInfo.title} description={dominionInfo.description} imageSrc={dominionInfo.imageSrc}>
                        <span className="text-gray-200">{birthplace}</span>
                    </InfoTooltip>
                ) : (
                    <span className="text-gray-200">{birthplace}</span>
                )}
              </p>
              <p><strong className="text-gray-500 font-bold block md:inline md:mr-1 uppercase tracking-wider text-[0.625rem]">Signature:</strong> <ColoredPowerText text={signature} isBold={true} /></p>
              <p><strong className="text-gray-500 font-bold block md:inline md:mr-1 uppercase tracking-wider text-[0.625rem]">Other Powers:</strong> <ColoredPowerText text={otherPowers} isBold={false} /></p>
              <div className="pt-2 mt-2 border-t border-white/10">
                <p className="flex items-center justify-between">
                    <strong className="text-gray-500 font-bold uppercase tracking-wider text-[0.625rem]">Uniform:</strong> 
                    <span className="relative group/uniform">
                        <span className="text-amber-200/80 cursor-help hover:text-amber-100 transition-colors">
                            {uniformName || 'Unidentified'}
                        </span>
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-20 h-20 opacity-0 group-hover/uniform:opacity-100 transition-opacity pointer-events-none z-50 rounded border border-white/20 shadow-xl overflow-hidden bg-black">
                            <img 
                                src={uniformId ? UNIFORM_SQUARE_IMAGES[uniformId] : UNIDENTIFIED_IMAGE} 
                                alt="" 
                                className="w-full h-full object-cover" 
                            />
                        </span>
                    </span>
                </p>
              </div>
          </div>
      </div>

      {/* Right Column: Description */}
      <div className="flex-grow border-l-0 md:border-l border-white/10 md:pl-6 md:pr-4 flex flex-col justify-center">
        <div className="text-[0.9375rem] text-gray-300 leading-relaxed text-justify">
          {renderDescription()}
        </div>
      </div>

       <button 
        onClick={handleUniformClick}
        className="absolute top-2 right-2 p-2 rounded-full bg-black/50 text-amber-200/70 hover:bg-yellow-900/50 hover:text-amber-100 transition-colors z-10"
        aria-label={`Change ${name}'s uniform`}
        title="Change Uniform"
        disabled={disabled}
      >
        <UniformIcon />
      </button>
    </div>
  );
};
