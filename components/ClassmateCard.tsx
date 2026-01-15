
import React, { Fragment, useMemo } from 'react';
import type { Classmate, ChoiceItem, Dominion } from '../types';
import { renderFormattedText } from './ui';
import { useCharacterContext } from '../context/CharacterContext';
import {
  DOMINIONS, DOMINIONS_KO,
  ESSENTIAL_BOONS_DATA, MINOR_BOONS_DATA, MAJOR_BOONS_DATA,
  ESSENTIAL_BOONS_DATA_KO, MINOR_BOONS_DATA_KO, MAJOR_BOONS_DATA_KO,
  TELEKINETICS_DATA, METATHERMICS_DATA,
  TELEKINETICS_DATA_KO, METATHERMICS_DATA_KO,
  ELEANORS_TECHNIQUES_DATA, GENEVIEVES_TECHNIQUES_DATA,
  ELEANORS_TECHNIQUES_DATA_KO, GENEVIEVES_TECHNIQUES_DATA_KO,
  BREWING_DATA, SOUL_ALCHEMY_DATA, TRANSFORMATION_DATA,
  BREWING_DATA_KO, SOUL_ALCHEMY_DATA_KO, TRANSFORMATION_DATA_KO,
  CHANNELLING_DATA, NECROMANCY_DATA, BLACK_MAGIC_DATA,
  CHANNELLING_DATA_KO, NECROMANCY_DATA_KO, BLACK_MAGIC_DATA_KO,
  TELEPATHY_DATA, MENTAL_MANIPULATION_DATA,
  TELEPATHY_DATA_KO, MENTAL_MANIPULATION_DATA_KO,
  ENTRANCE_DATA, FEATURES_DATA, INFLUENCE_DATA,
  ENTRANCE_DATA_KO, FEATURES_DATA_KO, INFLUENCE_DATA_KO,
  NET_AVATAR_DATA, TECHNOMANCY_DATA, NANITE_CONTROL_DATA,
  NET_AVATAR_DATA_KO, TECHNOMANCY_DATA_KO, NANITE_CONTROL_DATA_KO,
  RIGHTEOUS_CREATION_SPECIALTIES_DATA, RIGHTEOUS_CREATION_MAGITECH_DATA, 
  RIGHTEOUS_CREATION_ARCANE_CONSTRUCTS_DATA, RIGHTEOUS_CREATION_METAMAGIC_DATA,
  RIGHTEOUS_CREATION_SPECIALTIES_DATA_KO, RIGHTEOUS_CREATION_MAGITECH_DATA_KO,
  RIGHTEOUS_CREATION_ARCANE_CONSTRUCTS_DATA_KO, RIGHTEOUS_CREATION_METAMAGIC_DATA_KO,
  STAR_CROSSED_LOVE_PACTS_DATA, STAR_CROSSED_LOVE_PACTS_DATA_KO
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
    'idol': '/images/WvchRHJJ-uni1square.webp',
    'witchy': '/images/dJX4K5L4-uni2square.webp',
    'boyish': '/images/4ZXPyyZb-uni3square.webp',
    'high_tech': '/images/YB1tLH4f-uni4square.webp',
    'animal_themed': '/images/XxZ5Sspd-uni5square.webp',
    'old_timey': '/images/r2hDt27q-uni6square.webp',
    'oriental': '/images/3mdhV9G2-uni7square.webp',
    'custom': '/images/vC5G31jM-uni8square.webp',
};
const UNIDENTIFIED_IMAGE = '/images/HfL17Fvn-uniquestionsquare.webp';

// Separate Data Sets
const ALL_POWERS_EN = [
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

const ALL_POWERS_KO = [
    ...ESSENTIAL_BOONS_DATA_KO, ...MINOR_BOONS_DATA_KO, ...MAJOR_BOONS_DATA_KO,
    ...TELEKINETICS_DATA_KO, ...METATHERMICS_DATA_KO,
    ...ELEANORS_TECHNIQUES_DATA_KO, ...GENEVIEVES_TECHNIQUES_DATA_KO,
    ...BREWING_DATA_KO, ...SOUL_ALCHEMY_DATA_KO, ...TRANSFORMATION_DATA_KO,
    ...CHANNELLING_DATA_KO, ...NECROMANCY_DATA_KO, ...BLACK_MAGIC_DATA_KO,
    ...TELEPATHY_DATA_KO, ...MENTAL_MANIPULATION_DATA_KO,
    ...ENTRANCE_DATA_KO, ...FEATURES_DATA_KO, ...INFLUENCE_DATA_KO,
    ...NET_AVATAR_DATA_KO, ...TECHNOMANCY_DATA_KO, ...NANITE_CONTROL_DATA_KO,
    ...RIGHTEOUS_CREATION_SPECIALTIES_DATA_KO, ...RIGHTEOUS_CREATION_MAGITECH_DATA_KO,
    ...RIGHTEOUS_CREATION_ARCANE_CONSTRUCTS_DATA_KO, ...RIGHTEOUS_CREATION_METAMAGIC_DATA_KO,
    ...STAR_CROSSED_LOVE_PACTS_DATA_KO
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

const getPowerIdFromAlias = (text: string): string | null => {
    const normalized = text.toLowerCase().trim();
    
    // Manual Aliases
    if (normalized.includes('subatomic') || normalized === '분자세계 조작') return 'subatomic_manipulation';
    if (normalized.includes('vampirism') || normalized === '흡혈') return 'vampirism';
    if (normalized.includes('undead thrall') || normalized === '언데드 노예') return 'undead_thrall';
    if ((normalized.includes('flower') && normalized.includes('blood')) || normalized === '혈화') return 'flowers_of_blood';
    if (normalized.includes('manual override') || normalized === '수동 제어') return 'manual_override';
    if (normalized.includes('hypnos') || normalized === '최면술사') return 'hypnotist';
    if (normalized.includes('human marionettes') || normalized === '인간 마리오네트') return 'human_marionettes';
    if (normalized.includes('forsake humanity') || normalized === '괴수화 i') return 'shed_humanity_i';
    if (normalized.includes('subatomic destruction')) return 'subatomic_manipulation';
    if (normalized.includes('guardian angel') || normalized === '수호천사') return 'guardian_angels';
    if (normalized.includes('speed run')) return 'speed_plus';
    if (normalized.includes('i am not a weapon')) return 'masquerade';
    if (normalized.includes('hokuto senjukai ken') || normalized === '북두천수괴권') return 'hokuto_senjukai_ken';
    if (normalized.includes('psychic_force_ii') || normalized === '염동력 ii') return 'psychic_force_ii';
    if (normalized.includes('summon creature') || normalized === '마수 소환') return 'summon_creature';
    if (normalized === 'c r a z y') return 'summon_weather';

    // New Aliases from User Feedback
    if (normalized === '우주의 균열') return 'tears_in_space';
    if (normalized === '인공 환경') return 'artificial_environment';
    if (normalized === '언데드 마수') return 'undead_beast';
    if (normalized === '망자의 손아귀') return 'grasping_dead';
    if (normalized === '초인의 두뇌') return 'superpowered_mind';
    if (normalized === '회생의 화살') return 'rejuvenating_bolt';
    if (normalized === '최고의 보안') return 'max_security';
    if (normalized === '혼령 조종') return 'spirit_medium';

    return null;
};

const resolvePowerData = (text: string, powerList: ChoiceItem[]): ChoiceItem | undefined => {
    const normalized = text.toLowerCase().trim();
    
    // 1. Check ID via Alias
    const aliasId = getPowerIdFromAlias(text);
    if (aliasId) {
        const found = powerList.find(p => p.id === aliasId);
        if (found) return found;
    }

    // 2. Exact Title Match
    const exact = powerList.find(p => p.title.toLowerCase() === normalized);
    if (exact) return exact;

    // 3. Contains Match
    const container = powerList.find(p => p.title.toLowerCase().includes(normalized));
    if (container) return container;
    
    // 4. Reverse Contains
    const contained = powerList.find(p => normalized.includes(p.title.toLowerCase()));
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
                    {renderFormattedText(description)}
                </div>
            </div>
            {/* Arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-[#0a0a0a]"></div>
        </span>
    </span>
);

const ColoredPowerText: React.FC<{ text: string; isBold?: boolean }> = ({ text, isBold = true }) => {
    const { language } = useCharacterContext();
    const parts = useMemo(() => text.split(',').map(p => p.trim()), [text]);
    const activePowerList = language === 'ko' ? ALL_POWERS_KO : ALL_POWERS_EN;
    
    return (
        <span>
            {parts.map((part, i) => {
                const powerData = resolvePowerData(part, activePowerList);
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
  const { language } = useCharacterContext();

  const dominionInfo = useMemo(() => {
      const normalizedBirthplace = birthplace.toLowerCase().trim();
      const activeDominions = language === 'ko' ? DOMINIONS_KO : DOMINIONS;
      
      // Try to find in active list first
      let found = activeDominions.find(d => 
          d.title.toLowerCase() === normalizedBirthplace || 
          d.id.toLowerCase() === normalizedBirthplace
      );
      
      // Fallback to English DOMINIONS lookup if not found (e.g. if birthplace in data is English but user switched to Korean)
      if (!found) {
           found = DOMINIONS.find(d => 
              d.title.toLowerCase() === normalizedBirthplace || 
              d.id.toLowerCase() === normalizedBirthplace
          );
          // If found in English list, try to map to Korean equivalent for display if needed
          if (found && language === 'ko') {
              const koFound = DOMINIONS_KO.find(d => d.id === found!.id);
              if (koFound) found = koFound;
          }
      }
      
      return found;
  }, [birthplace, language]);

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
      if (language === 'ko') {
          const parts = costStr.split(/((?:Costs|Grants)\s*[+-]?\d+\s*(?:FP|BP))/i);
          return (
              <span className="text-sm font-semibold">
                  {parts.map((part, i) => {
                        const trimmed = part.trim();
                        if (!trimmed) return null;
                        
                        const fpMatch = trimmed.match(/(?:Costs|Grants)\s*([+-]?\d+)\s*FP/i);
                        if (fpMatch) {
                             return <span key={i} className="text-green-400 font-bold">행운 점수 {fpMatch[1]} </span>;
                        }

                        const bpMatch = trimmed.match(/(?:Costs|Grants)\s*([+-]?\d+)\s*BP/i);
                        if (bpMatch) {
                             return <span key={i} className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-300 to-purple-400 drop-shadow-[0_0_2px_rgba(192,38,211,0.5)]">축복 점수 {bpMatch[1]} </span>;
                        }
                        
                        return <span key={i} className="text-white">{part}</span>;
                  })}
              </span>
          )
      }

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
        const paragraphs = description.split('\n\n');
        return (
            <>
                {paragraphs.map((part, index) => {
                    // English Logic
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

                    // Korean Logic - Fixed to properly display the middle text and apply gradient only to the last sentence
                    if (part.includes("소문에 따르면 그 유령이 라이센다의 누이")) {
                        const sisterWord = "누이";
                        const fadeText = "그 누이의 이름은 아예 기억도 안 나네요.";
                        
                        // 1. Split the paragraph into the part before the fade-out sentence and the fade-out sentence itself
                        const splitAtFade = part.split(fadeText);
                        const mainTextContent = splitAtFade[0]; // All text before the final sentence
                        
                        // 2. Further split the main text to highlight the FIRST instance of "누이" (which is "라이센다의 누이")
                        const targetPhrase = "라이센다의 " + sisterWord;
                        const [beforeSister, afterSister] = mainTextContent.split(targetPhrase);
                        
                        return (
                            <p key={index} className="mb-4 last:mb-0">
                                {renderFormattedText(beforeSister)}
                                {renderFormattedText("라이센다의 ")}
                                <span className="text-white/30 font-bold">{sisterWord}</span>
                                {renderFormattedText(afterSister)}
                                <span className="bg-gradient-to-r from-gray-400 to-transparent text-transparent bg-clip-text font-bold decoration-clone">{fadeText}</span>
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
                       // Korean translation for refund text if needed, though usually standard format handles it
                      if (language === 'ko') return <span key={i} className="text-green-400 font-bold">{part.replace('FP', '')} 행운 점수</span>;
                      return <span key={i} className="text-green-400 font-bold">{part}</span>;
                  }
                  if (language === 'ko' && part.trim() === 'Grants') return <span key={i} className="text-white">제공: </span>;
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
                <strong className="text-gray-500 font-bold block md:inline md:mr-1 uppercase tracking-wider text-[0.625rem]">
                    {language === 'ko' ? "출신지:" : "Birthplace:"}
                </strong> 
                {dominionInfo ? (
                    <InfoTooltip title={dominionInfo.title} description={dominionInfo.description} imageSrc={dominionInfo.imageSrc}>
                        <span className="text-gray-200">{birthplace}</span>
                    </InfoTooltip>
                ) : (
                    <span className="text-gray-200">{birthplace}</span>
                )}
              </p>
              <p>
                  <strong className="text-gray-500 font-bold block md:inline md:mr-1 uppercase tracking-wider text-[0.625rem]">
                      {language === 'ko' ? "주력기:" : "Signature:"}
                  </strong> 
                  <ColoredPowerText text={signature} isBold={true} />
              </p>
              <p>
                  <strong className="text-gray-500 font-bold block md:inline md:mr-1 uppercase tracking-wider text-[0.625rem]">
                      {language === 'ko' ? "기타 능력:" : "Other Powers:"}
                  </strong> 
                  <ColoredPowerText text={otherPowers} isBold={false} />
              </p>
              <div className="pt-2 mt-2 border-t border-white/10">
                <p className="flex items-center justify-between">
                    <strong className="text-gray-500 font-bold uppercase tracking-wider text-[0.625rem]">
                        {language === 'ko' ? "의복:" : "Uniform:"}
                    </strong> 
                    <span className="relative group/uniform">
                        <span className="text-amber-200/80 cursor-help hover:text-amber-100 transition-colors">
                            {uniformName || (language === 'ko' ? '미정' : 'Unidentified')}
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
        title={language === 'ko' ? "의복 변경" : "Change Uniform"}
        disabled={disabled}
      >
        <UniformIcon />
      </button>
    </div>
  );
};
