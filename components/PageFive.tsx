
import React, { useState, useMemo } from 'react';
import { useCharacterContext } from '../context/CharacterContext';
import { 
    CAREER_GOALS_DATA, COLLEAGUES_DATA, CUSTOM_COLLEAGUE_CHOICES_DATA, DOMINIONS,
    UNIFORMS_DATA, ALLMILLOR_CHOICES_DATA, ALLMILLOR_INTRO_DATA, CAREER_INTRO_DATA,
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
import { SectionHeader, SectionSubHeader, CompanionIcon, HouseIcon, renderFormattedText } from './ui';
import type { ChoiceItem, Colleague, CustomColleagueInstance, Mentor, Mentee, MovingOutHome } from '../types';
import { CompanionSelectionModal } from './SigilTreeOptionCard';
import { UniformSelectionModal } from './UniformSelectionModal';
import { MovingOutModal } from './MovingOutModal';
import { StudentSelectionModal } from './StudentSelectionModal';

// --- SHARED UTILITIES (Mirrored from ClassmateCard) ---

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
    
    // 1. Manual Aliases & Corrections
    if (normalized.includes('subatomic')) return TELEKINETICS_DATA.find(p => p.id === 'subatomic_manipulation');
    if (normalized.includes('vampirism')) return BLACK_MAGIC_DATA.find(p => p.id === 'vampirism');
    if (normalized.includes('undead thrall')) return BLACK_MAGIC_DATA.find(p => p.id === 'undead_thrall');
    if (normalized.includes('flower') && normalized.includes('blood')) return BLACK_MAGIC_DATA.find(p => p.id === 'flowers_of_blood');
    if (normalized.includes('manual override')) return TECHNOMANCY_DATA.find(p => p.id === 'manual_override');
    if (normalized.includes('hypnos')) return MENTAL_MANIPULATION_DATA.find(p => p.id === 'hypnotist');
    if (normalized.includes('human marionettes')) return SOUL_ALCHEMY_DATA.find(p => p.id === 'human_marionettes');
    
    // Additional Fixes for Power unique names and User reported misalignments
    if (normalized.includes('forsake humanity')) return TRANSFORMATION_DATA.find(p => p.id === 'shed_humanity_i');
    if (normalized.includes('subatomic destruction')) return TELEKINETICS_DATA.find(p => p.id === 'subatomic_manipulation');
    if (normalized.includes('guardian angel')) return ELEANORS_TECHNIQUES_DATA.find(p => p.id === 'guardian_angels');
    if (normalized.includes('speed run')) return MINOR_BOONS_DATA.find(p => p.id === 'speed_plus');
    if (normalized.includes('i am not a weapon')) return MENTAL_MANIPULATION_DATA.find(p => p.id === 'masquerade');
    if (normalized.includes('hokuto senjukai ken')) return MAJOR_BOONS_DATA.find(p => p.id === 'hokuto_senjukai_ken');
    if (normalized.includes('psychic_force_ii')) return TELEKINETICS_DATA.find(p => p.id === 'psychic_force_ii');
    if (normalized.includes('summon creature')) return INFLUENCE_DATA.find(p => p.id === 'summon_creature');
    if (normalized === 'c r a z y') return INFLUENCE_DATA.find(p => p.id === 'summon_weather') || ALL_POWERS.find(p => p.id === 'summon_weather');

    // 2. Standard matching
    const exact = ALL_POWERS.find(p => p.title.toLowerCase() === normalized);
    if (exact) return exact;
    const container = ALL_POWERS.find(p => p.title.toLowerCase().includes(normalized));
    if (container) return container;
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
                            <InfoTooltip title={powerData.title} description={powerData.description} imageSrc={powerData.imageSrc}>{content}</InfoTooltip>
                        ) : content}
                        {i < parts.length - 1 && <span className="text-white mr-1">, </span>}
                    </span>
                );
            })}
        </span>
    );
};

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

const formatCost = (cost: string | undefined) => {
    if (!cost) return '';
    return cost.replace(/Costs\s+\+?0\s+(FP|BP)/i, 'Costs -0 $1');
};

const renderPersonCost = (costStr: string) => {
    const regex = /(Costs|Grants|[-+]?\d+\s*FP|[-+]?\d+\s*BP)/gi;
    const parts = costStr.split(regex).filter(p => p !== undefined && p !== "");
    return (
        <>
            {parts.map((part, i) => {
                const upper = part.trim().toUpperCase();
                if (upper === 'COSTS' || upper === 'GRANTS') return <span key={i} className="text-white">{part} </span>;
                if (upper.includes('FP')) return <span key={i} className="text-green-400 font-bold">{part}</span>;
                if (upper.includes('BP')) return <span key={i} className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-300 to-purple-400 drop-shadow-[0_0_2px_rgba(192,38,211,0.5)]">{part}</span>;
                return <span key={i}>{part}</span>;
            })}
        </>
    );
};

// --- COMPONENTS ---

const CyberChoiceCard: React.FC<{
    item: ChoiceItem;
    isSelected: boolean;
    onSelect: (id: string) => void;
    disabled?: boolean;
    children?: React.ReactNode;
    iconButton?: React.ReactNode;
    onIconButtonClick?: () => void;
    imageAspectRatio?: string;
}> = ({ item, isSelected, onSelect, disabled = false, children, iconButton, onIconButtonClick, imageAspectRatio = "h-48" }) => {
    const { id, title, cost, description, imageSrc } = item;
    const handleSelect = () => { if (!disabled) onSelect(id); };

    return (
        <div 
            onClick={handleSelect}
            className={`relative group overflow-hidden transition-all duration-300 border-2 backdrop-blur-md flex flex-col ${isSelected ? 'border-green-400 bg-green-950/40 shadow-[0_0_20px_rgba(74,222,128,0.3)]' : disabled ? 'border-gray-800 bg-black/40 opacity-50 cursor-not-allowed grayscale' : 'border-green-900/40 bg-black/60 hover:border-green-500/70 hover:shadow-[0_0_15px_rgba(34,197,94,0.15)] cursor-pointer'}`}
            style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
        >
            <div className={`absolute top-0 right-0 p-2 ${isSelected ? 'text-green-400' : 'text-green-900'} transition-colors`}><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 0H20V20" stroke="currentColor" strokeWidth="2"/></svg></div>
            <div className={`absolute bottom-0 left-0 p-2 ${isSelected ? 'text-green-400' : 'text-green-900'} transition-colors rotate-180`}><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 0H20V20" stroke="currentColor" strokeWidth="2"/></svg></div>
            <div className={`relative w-full overflow-hidden border-b border-green-900/30 ${imageAspectRatio}`}>
                <div className={`absolute inset-0 bg-green-500/10 z-10 transition-opacity duration-300 ${isSelected ? 'opacity-0' : 'group-hover:opacity-0 opacity-20'}`}></div>
                <img src={imageSrc} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"/>
                <div className="absolute bottom-0 right-0 bg-black/80 px-3 py-1 border-t-2 border-l-2 border-green-500/50 text-xs font-mono text-green-300 z-20">{formatCost(cost)}</div>
            </div>
            <div className="p-4 flex-grow flex flex-col relative">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>
                <h4 className={`font-cinzel text-lg font-bold mb-2 tracking-widest ${isSelected ? 'text-green-300 drop-shadow-[0_0_5px_rgba(74,222,128,0.8)]' : 'text-gray-200 group-hover:text-green-200'}`}>{title}</h4>
                <p className="text-xs text-gray-400 leading-relaxed font-sans border-t border-green-900/30 pt-2 flex-grow">{renderFormattedText(description)}</p>
                {children && <div className="mt-3 pt-2 border-t border-green-900/30">{children}</div>}
            </div>
            {iconButton && onIconButtonClick && isSelected && (
                <button onClick={(e) => { e.stopPropagation(); onIconButtonClick(); }} className="absolute top-2 left-2 p-2 rounded-md bg-black/70 border border-green-500 text-green-400 hover:bg-green-900/50 hover:text-white transition-all z-30 shadow-[0_0_10px_rgba(34,197,94,0.3)]">{iconButton}</button>
            )}
        </div>
    );
};

const SmallRoundChoiceCard: React.FC<{
    item: ChoiceItem;
    isSelected: boolean;
    onSelect: (id: string) => void;
    disabled?: boolean;
    children?: React.ReactNode;
    iconButton?: React.ReactNode;
    onIconButtonClick?: () => void;
}> = ({ item, isSelected, onSelect, disabled = false, children, iconButton, onIconButtonClick }) => {
    return (
        <div onClick={() => !disabled && onSelect(item.id)} className={`flex flex-col items-center p-6 rounded-xl transition-all duration-300 relative group h-full ${disabled ? 'opacity-50 grayscale cursor-not-allowed' : 'cursor-pointer'} ${isSelected ? 'bg-green-950/30 border border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.3)]' : 'bg-black/40 border border-green-900/20 hover:bg-green-900/10 hover:border-green-800/50'}`}>
            <div className={`relative w-40 h-40 mb-4 rounded-full p-1.5 transition-all flex-shrink-0 ${isSelected ? 'bg-gradient-to-tr from-green-400 to-green-600 shadow-[0_0_30px_rgba(34,197,94,0.5)]' : 'bg-gray-800 group-hover:bg-green-800/50'}`}>
                <img src={item.imageSrc} alt={item.title} className="w-full h-full rounded-full object-cover border-2 border-black"/>
                {iconButton && onIconButtonClick && isSelected && (
                    <button onClick={(e) => { e.stopPropagation(); onIconButtonClick(); }} className="absolute -bottom-1 -right-1 p-3 rounded-full bg-black/80 border border-green-500 text-green-400 hover:bg-green-900 hover:text-white transition-colors z-20 shadow-lg">{iconButton}</button>
                )}
            </div>
            <h4 className={`font-cinzel font-bold text-center text-lg tracking-wide ${isSelected ? 'text-green-300 text-shadow-neon' : 'text-gray-300 group-hover:text-green-200'}`}>{item.title}</h4>
            <p className={`text-xs font-mono mt-1 ${isSelected ? 'text-green-400' : 'text-gray-500'}`}>{formatCost(item.cost)}</p>
            <p className="text-xs text-gray-400 text-center mt-3 leading-relaxed border-t border-green-900/30 pt-2 w-full flex-grow min-h-[4rem]">{renderFormattedText(item.description)}</p>
            {children && <div className="mt-3 w-full">{children}</div>}
        </div>
    );
};

interface ColleagueCardProps {
  colleague: Colleague;
  isSelected: boolean;
  onSelect: (id: string) => void;
  disabled?: boolean;
  uniformId?: string;
  uniformName?: string;
  onUniformButtonClick: (id: string, name: string) => void;
  isMentor: boolean;
  refundText?: string;
}

const ColleagueCard: React.FC<ColleagueCardProps> = ({ colleague, isSelected, onSelect, disabled = false, uniformId, uniformName, onUniformButtonClick, isMentor, refundText }) => {
  const { id, name, cost, description, imageSrc, birthplace, signature, otherPowers } = colleague;

  const dominionInfo = useMemo(() => {
      const normalizedBirthplace = birthplace.toLowerCase().trim();
      return DOMINIONS.find(d => d.title.toLowerCase() === normalizedBirthplace || d.id.toLowerCase() === normalizedBirthplace);
  }, [birthplace]);

  const renderDescriptionText = (text: string) => {
    // Basic formatting first
    return renderFormattedText(text);
  };

  const renderDescription = () => {
    if (id === 'lilith') {
        const target = "uthveqojtx7dhzacsm6";
        const parts = description.split(target);
        return (
            <p className="mb-4 last:mb-0">
                {renderDescriptionText(parts[0])}
                <span className="bg-gradient-to-r from-gray-400 to-transparent text-transparent bg-clip-text font-bold decoration-clone">{target}</span>
                {parts[1] && renderDescriptionText(parts[1])}
            </p>
        );
    }
    return description.split('\n\n').map((paragraph, idx) => (
        <p key={idx} className="mb-4 last:mb-0">{renderDescriptionText(paragraph)}</p>
    ));
  };

  return (
    <div
      className={`relative flex flex-col md:flex-row p-1 transition-all duration-300 ${disabled ? 'opacity-50 grayscale cursor-not-allowed' : 'cursor-pointer'} ${isSelected ? 'scale-[1.01]' : 'hover:scale-[1.01]'}`}
      onClick={() => !disabled && onSelect(id)}
    >
      <div className={`absolute inset-0 border-2 pointer-events-none z-0 ${isSelected ? 'border-green-400 shadow-[0_0_20px_rgba(34,197,94,0.3)] bg-green-950/30' : 'border-green-900/40 bg-black/60 group-hover:border-green-600/60'}`} style={{ clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)' }}></div>
      <div className="relative z-10 flex flex-col md:flex-row gap-6 p-5 w-full h-full">
          <div className="w-full md:w-64 flex-shrink-0 flex flex-col">
                <img src={imageSrc} alt={name} className={`w-full aspect-[2/3] object-cover rounded-sm border ${isSelected ? 'border-green-500/50' : 'border-green-900/50'}`} />
                <div className="text-center mt-3">
                    <h4 className={`font-bold font-cinzel text-2xl tracking-widest ${isSelected ? 'text-green-300 text-shadow-neon' : 'text-gray-200'}`}>{name}</h4>
                    <div className="flex flex-col items-center gap-1 mt-1">
                        <span className={`text-xs font-mono border border-white/10 px-2 py-0.5 bg-black/40`}>{renderPersonCost(cost)}</span>
                        {isMentor && <span className="px-2 py-0.5 bg-amber-900/40 text-amber-300 text-[10px] border border-amber-500/50 uppercase font-bold tracking-wider">Mentor</span>}
                        {refundText && <span className="text-xs font-mono text-green-400 font-bold border border-green-500/30 px-2 py-0.5 bg-green-900/20">{refundText}</span>}
                    </div>
                </div>
                <div className="mt-4 p-3 bg-black/40 rounded border border-green-900/30 text-xs text-gray-300 space-y-2">
                    <p><strong className="text-green-700 uppercase mr-1 text-[10px]">Origin:</strong> 
                        {dominionInfo ? (
                            <InfoTooltip title={dominionInfo.title} description={dominionInfo.description} imageSrc={dominionInfo.imageSrc}>
                                <span className="text-green-100">{birthplace}</span>
                            </InfoTooltip>
                        ) : <span className="text-green-100">{birthplace}</span>}
                    </p>
                    <p><strong className="text-green-700 uppercase mr-1 text-[10px]">Signature:</strong> <ColoredPowerText text={signature} isBold={true} /></p>
                    <p><strong className="text-green-700 uppercase mr-1 text-[10px]">Other Powers:</strong> <ColoredPowerText text={otherPowers} isBold={false} /></p>
                    <div className="pt-2 border-t border-green-900/30 flex items-center justify-between">
                        <strong className="text-green-700 uppercase text-[10px]">Costume:</strong>
                        <div className="relative group/col-uniform flex items-center">
                            <span className="text-green-300 cursor-help hover:text-green-100 transition-colors">{uniformName || 'UNIDENTIFIED'}</span>
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-20 h-20 opacity-0 group-hover/col-uniform:opacity-100 transition-opacity pointer-events-none z-50 rounded border border-green-500/30 shadow-xl overflow-hidden bg-black">
                                <img src={uniformId ? UNIFORM_SQUARE_IMAGES[uniformId] : UNIDENTIFIED_IMAGE} alt="" className="w-full h-full object-cover" />
                            </span>
                        </div>
                    </div>
                </div>
          </div>
          <div className="flex flex-grow border-l-0 md:border-l border-green-900/30 md:pl-6 flex flex-col justify-center">
            <div className="text-[0.9375rem] text-gray-300 leading-relaxed text-justify">{renderDescription()}</div>
          </div>
          <button onClick={(e) => { e.stopPropagation(); onUniformButtonClick(id, name); }} className="absolute top-2 right-2 p-2 rounded-full bg-black/50 text-green-300/70 hover:bg-green-900/50 hover:text-green-100 transition-colors z-10" title="Change Costume" disabled={disabled}><UniformIcon /></button>
      </div>
    </div>
  );
};

export const PageFive: React.FC = () => {
    const { 
        selectedAllmillorIds, 
        handleAllmillorSelect,
        selectedCareerGoalIds,
        handleCareerGoalSelect,
        selectedClubIds,
        selectedMiscActivityIds,
        selectedColleagueIds, 
        handleColleagueSelect,
        selectedDominionId,
        isMultiplayer,
        joysOfParentingCompanionName,
        handleJoysOfParentingCompanionAssign,
        colleagueUniforms,
        handleColleagueUniformSelect,
        customColleagues,
        handleAddCustomColleague,
        handleRemoveCustomColleague,
        assigningColleague,
        handleOpenAssignColleagueModal,
        handleCloseAssignColleagueModal,
        handleAssignCustomColleagueName,
        selectedMentors,
        selectedStarCrossedLovePacts,
        movingOutHomes,
        mentee,
        handleMenteeSelect,
        selectedClassmateIds
    } = useCharacterContext();

    const [isJoysOfParentingModalOpen, setIsJoysOfParentingModalOpen] = useState(false);
    const [isMovingOutModalOpen, setIsMovingOutModalOpen] = useState(false);
    const [isStudentSelectionModalOpen, setIsStudentSelectionModalOpen] = useState(false);
    const [uniformModalState, setUniformModalState] = useState<{ isOpen: boolean; colleagueId: string | null; colleagueName: string | null; }>({ isOpen: false, colleagueId: null, colleagueName: null });

    const pointLimit = useMemo(() => {
        if (!assigningColleague) return 0;
        return assigningColleague.optionId === 'custom_colleague_25' ? 25 : assigningColleague.optionId === 'custom_colleague_35' ? 35 : assigningColleague.optionId === 'custom_colleague_50' ? 50 : 0;
    }, [assigningColleague]);

    const isEvoghosVowActive = selectedStarCrossedLovePacts.has('evoghos_vow');
    const handleOpenUniformModal = (colleagueId: string, colleagueName: string) => { setUniformModalState({ isOpen: true, colleagueId, colleagueName }); };
    const handleCloseUniformModal = () => { setUniformModalState({ isOpen: false, colleagueId: null, colleagueName: null }); };
    const handleSelectUniformInModal = (uniformId: string) => { if (uniformModalState.colleagueId) { handleColleagueUniformSelect(uniformModalState.colleagueId, uniformId); } handleCloseUniformModal(); };

    const isGoalDisabled = (goal: ChoiceItem): boolean => {
        if (!goal.requires) return false;
        const requiredIds = Array.isArray(goal.requires) ? goal.requires : [goal.requires];
        const selectedPrereqs = new Set([...selectedClubIds, ...selectedMiscActivityIds, ...selectedCareerGoalIds]);
        return !requiredIds.every(reqId => selectedPrereqs.has(reqId));
    };

    return (
        <>
            <style>{`
                .text-shadow-neon { text-shadow: 0 0 5px rgba(74, 222, 128, 0.5), 0 0 10px rgba(74, 222, 128, 0.3); }
            `}</style>
            <section className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 mb-16 relative">
                <div className="absolute inset-0 bg-green-900/5 blur-3xl -z-10"></div>
                <div className="flex-shrink-0 relative">
                    <div className="absolute inset-0 border-2 border-green-500/30 rounded-lg translate-x-2 translate-y-2"></div>
                    <img src={CAREER_INTRO_DATA.imageSrc} alt="Your Career Intro" className="w-full max-w-xl rounded-lg relative z-10 border border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.2)]" />
                </div>
                <div className="max-w-2xl text-center lg:text-left">
                    <h2 className="text-xl font-mono text-green-500/70 mb-2 tracking-tighter">/// STAGE_III_INIT</h2>
                    <h1 className="text-5xl font-bold font-cinzel my-2 text-white drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]">{CAREER_INTRO_DATA.title}</h1>
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-green-500/50 to-transparent my-6"></div>
                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap font-sans text-sm md:text-base">{renderFormattedText(CAREER_INTRO_DATA.description)}</p>
                    <img src="https://i.ibb.co/99KvcyT0/main3.jpg" alt="Career Path" className="mt-6 rounded-lg shadow-lg shadow-green-900/20 w-64 mx-auto lg:mx-0 border border-green-500/30 opacity-90 hover:opacity-100 transition-opacity" />
                </div>
            </section>
            
            <section className="my-24">
                 <div className="flex flex-col md:flex-row gap-8 max-w-7xl mx-auto items-center bg-black/80 p-8 rounded-lg border border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.1)] relative overflow-hidden">
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                    <div className="md:w-1/3 relative z-10"><img src={ALLMILLOR_INTRO_DATA.imageSrc} alt={ALLMILLOR_INTRO_DATA.title} className="rounded-lg shadow-lg w-full" /></div>
                    <div className="md:w-2/3 text-gray-300 text-sm space-y-4 relative z-10">
                        <h3 className="font-cinzel text-3xl text-center text-green-100 mb-4 drop-shadow-[0_0_8px_rgba(74,222,128,0.3)]">{ALLMILLOR_INTRO_DATA.title}</h3>
                        <p className="whitespace-pre-wrap leading-relaxed">{renderFormattedText(ALLMILLOR_INTRO_DATA.description)}</p>
                    </div>
                </div>
            </section>

            <section className="my-16">
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ALLMILLOR_CHOICES_DATA.map(choice => (
                        <CyberChoiceCard key={choice.id} item={choice} isSelected={selectedAllmillorIds.has(choice.id)} onSelect={handleAllmillorSelect} disabled={!selectedAllmillorIds.has(choice.id) && selectedAllmillorIds.size >= 3} imageAspectRatio="aspect-[2/1]" />
                    ))}
                </div>
            </section>

             <section className="my-16">
                <SectionHeader className="text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.6)]">CAREER GOALS</SectionHeader>
                <SectionSubHeader><span className="text-green-200/70 font-mono text-xs">First off, if you played sports in school, you might just be able to go pro!</span></SectionSubHeader>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {CAREER_GOALS_DATA.proSports.map(goal => (
                        <CyberChoiceCard key={goal.id} item={goal} isSelected={selectedCareerGoalIds.has(goal.id)} onSelect={handleCareerGoalSelect} disabled={isGoalDisabled(goal)} imageAspectRatio="aspect-[2/1]" />
                    ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
                    {CAREER_GOALS_DATA.general.map(goal => (
                        <CyberChoiceCard key={goal.id} item={goal} isSelected={selectedCareerGoalIds.has(goal.id)} onSelect={handleCareerGoalSelect} disabled={isGoalDisabled(goal)} imageAspectRatio="aspect-[4/3]" />
                    ))}
                </div>
                <div className="mt-40 pt-12 border-t border-green-900/30">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
                        {CAREER_GOALS_DATA.finishingTouches.map(goal => {
                            const isJoysOfParenting = goal.id === 'joys_of_parenting';
                            const isMovingOut = goal.id === 'moving_out';
                            const isMentorCareer = goal.id === 'mentor_career';
                            const isSelected = selectedCareerGoalIds.has(goal.id);
                            return (
                                <SmallRoundChoiceCard key={goal.id} item={goal} isSelected={isSelected} onSelect={handleCareerGoalSelect} disabled={isGoalDisabled(goal)} iconButton={(isJoysOfParenting && isSelected) ? <CompanionIcon /> : (isMovingOut && isSelected) ? <HouseIcon /> : (isMentorCareer && isSelected) ? <CompanionIcon /> : undefined} onIconButtonClick={(isJoysOfParenting && isSelected) ? () => setIsJoysOfParentingModalOpen(true) : (isMovingOut && isSelected) ? () => setIsMovingOutModalOpen(true) : (isMentorCareer && isSelected) ? () => setIsStudentSelectionModalOpen(true) : undefined}>
                                    {isJoysOfParenting && isSelected && joysOfParentingCompanionName && <div className="text-center"><p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Successor</p><p className="text-xs font-bold text-green-300 font-mono truncate">{joysOfParentingCompanionName}</p></div>}
                                    {isMovingOut && isSelected && movingOutHomes.length > 0 && <div className="text-center"><p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Assigned</p><p className="text-xs font-bold text-green-300 font-mono truncate">{movingOutHomes.length} Home{movingOutHomes.length > 1 ? 's' : ''}</p></div>}
                                    {isMentorCareer && isSelected && mentee && <div className="text-center"><p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Student</p><p className="text-xs font-bold text-green-300 font-mono truncate">{mentee.name}</p></div>}
                                </SmallRoundChoiceCard>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="my-16">
                <SectionHeader className="text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.6)]">SELECT YOUR COLLEAGUES</SectionHeader>
                <SectionSubHeader className="!max-w-6xl"><span className="text-green-200/70 font-mono text-xs">You know the drill by this point. Same rules apply as for Classmates. With these, you have a lot more leeway in figuring out how you two met and what kind of relationship you have, since you haven't merely been stuck in the same school together.</span></SectionSubHeader>
                {isEvoghosVowActive && <div className="bg-red-950/30 border border-red-500/50 p-4 rounded text-center max-w-3xl mx-auto mb-10"><p className="text-red-400 font-bold text-lg font-mono">/// ERROR: EVOGHOS_PROTOCOL_ACTIVE ///</p><p className="text-red-300/70 text-sm mt-1">Colleague selection disabled.</p></div>}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {COLLEAGUES_DATA.map(colleague => {
                        const selectedUniformId = colleagueUniforms.get(colleague.id);
                        const uniform = UNIFORMS_DATA.find(u => u.id === selectedUniformId);
                        const isMentor = selectedMentors.some(m => m.id === colleague.id && m.type === 'premade');
                        const dominion = DOMINIONS.find(d => d.id === selectedDominionId);
                        const hasRefund = dominion && colleague.birthplace.toUpperCase() === dominion.title.toUpperCase();
                        const refundText = hasRefund ? 'GRANTS +2 FP' : undefined;
                        return (
                            <ColleagueCard 
                                key={colleague.id} 
                                colleague={colleague}
                                isSelected={selectedColleagueIds.has(colleague.id)} 
                                onSelect={handleColleagueSelect} 
                                disabled={isMultiplayer || isMentor || isEvoghosVowActive}
                                uniformId={selectedUniformId}
                                uniformName={uniform?.title}
                                onUniformButtonClick={handleOpenUniformModal}
                                isMentor={isMentor}
                                refundText={refundText}
                            />
                        );
                    })}
                </div>
                <div className="mt-8">
                    <div className="relative flex flex-row items-start p-6 bg-black/80 border-2 border-green-500/30 rounded-lg gap-6 overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-3xl"></div>
                        <img src="https://i.ibb.co/wNfdjNJ0/c25.png" alt="Create your own companion" className="w-2/5 sm:w-1/3 aspect-[4/3] object-cover object-left rounded-sm flex-shrink-0" />
                        <div className="flex flex-col flex-grow relative z-10">
                            <p className="text-gray-300 text-sm leading-relaxed mb-4">
                                {renderFormattedText("Same as last time, if none of the options above suffice (or you're playing Multiplayer), you can create your own colleague! If you spend {fp}-4 FP{/fp}, you can create a companion with 25 Companion Points on the {i}Reference page{/i}; if you spend {fp}-6 FP{/fp}, you are given 35 Companion Points instead; and if you spend {fp}-8 FP{/fp}, you are given 50 Companion Points.")}
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {CUSTOM_COLLEAGUE_CHOICES_DATA.map(option => (
                                    <div key={option.id} onClick={!isEvoghosVowActive ? () => handleAddCustomColleague(option.id) : undefined} className={`relative p-4 bg-gray-900/80 border border-green-800 rounded-sm transition-all text-center group ${isEvoghosVowActive ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-green-400 hover:bg-green-900/20'}`} role="button" tabIndex={0}><div className="absolute top-1 right-1 p-1 text-green-500/30 group-hover:text-green-400"><CompanionIcon /></div><p className="font-bold text-xs text-green-400 font-mono group-hover:text-green-300">{option.cost.toUpperCase()}</p><p className="text-xs text-gray-400 mt-1 group-hover:text-gray-200">{renderFormattedText(option.description)}</p></div>
                                ))}
                            </div>
                            {customColleagues.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-green-800/30 space-y-2">
                                    <h4 className="font-mono text-xs text-green-500/70 uppercase tracking-widest mb-2">/// Active Fabrications</h4>
                                    {customColleagues.map(c => {
                                        const optionData = CUSTOM_COLLEAGUE_CHOICES_DATA.find(opt => opt.id === c.optionId);
                                        const isMentor = selectedMentors.some(m => m.id === c.id.toString() && m.type === 'custom');
                                        return (
                                            <div key={c.id} className="bg-black/60 border border-green-900/30 p-2 rounded flex justify-between items-center hover:border-green-700/50 transition-colors">
                                                <div className="flex items-center gap-3">{!isMentor && <button onClick={() => handleRemoveCustomColleague(c.id)} className="text-red-500 hover:text-red-400 text-lg font-bold px-2" title="Terminate">&times;</button>}<div><p className="text-xs font-semibold text-green-100">{renderFormattedText(optionData?.description || '')} {isMentor && <span className="ml-2 text-amber-300 text-[10px] uppercase font-bold border border-amber-500/50 px-1 rounded">[MENTOR]</span>}</p><p className="text-[10px] text-gray-500 font-mono">ASSIGNMENT: <span className="text-green-300">{c.companionName || 'UNASSIGNED'}</span></p></div></div>
                                                <button onClick={() => handleOpenAssignColleagueModal(c)} className="p-1.5 rounded bg-green-900/20 text-green-400 hover:bg-green-500/20 hover:text-green-200 transition-colors border border-green-800/50" title="Configure"><CompanionIcon /></button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {isJoysOfParentingModalOpen && <CompanionSelectionModal currentCompanionName={joysOfParentingCompanionName} onClose={() => setIsJoysOfParentingModalOpen(false)} onSelect={(name) => { handleJoysOfParentingCompanionAssign(name); setIsJoysOfParentingModalOpen(false); }} pointLimit={50} title="Assign Your Mage Child" categoryFilter="mage" colorTheme="green" />}
            {isMovingOutModalOpen && <MovingOutModal onClose={() => setIsMovingOutModalOpen(false)} />}
            {uniformModalState.isOpen && uniformModalState.colleagueId && uniformModalState.colleagueName && <UniformSelectionModal classmateName={uniformModalState.colleagueName} currentUniformId={colleagueUniforms.get(uniformModalState.colleagueId)} onClose={handleCloseUniformModal} onSelect={handleSelectUniformInModal} mode="costume" theme="green" />}
            {assigningColleague && <CompanionSelectionModal currentCompanionName={assigningColleague.companionName} onClose={handleCloseAssignColleagueModal} onSelect={(name) => { handleAssignCustomColleagueName(assigningColleague.id, name); handleCloseAssignColleagueModal(); }} pointLimit={pointLimit} title={`Assign Custom Colleague (${pointLimit} CP)`} categoryFilter="mage" colorTheme="green" />}
            {isStudentSelectionModalOpen && <StudentSelectionModal onClose={() => setIsStudentSelectionModalOpen(false)} onSelect={(mentee) => { handleMenteeSelect(mentee); setIsStudentSelectionModalOpen(false); }} currentMenteeId={mentee?.id || null} selectedClassmateIds={selectedClassmateIds} />}
        </>
    );
};
