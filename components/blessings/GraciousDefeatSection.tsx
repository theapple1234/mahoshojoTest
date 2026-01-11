
import React, { useState, useRef, useEffect } from 'react';
import { useCharacterContext } from '../../context/CharacterContext';
import { 
    GRACIOUS_DEFEAT_DATA, GRACIOUS_DEFEAT_DATA_KO,
    GRACIOUS_DEFEAT_SIGIL_TREE_DATA, GRACIOUS_DEFEAT_SIGIL_TREE_DATA_KO, 
    ENTRANCE_DATA, ENTRANCE_DATA_KO,
    FEATURES_DATA, FEATURES_DATA_KO, 
    INFLUENCE_DATA, INFLUENCE_DATA_KO, 
    BLESSING_ENGRAVINGS, BLESSING_ENGRAVINGS_KO
} from '../../constants';
import type { GraciousDefeatPower, GraciousDefeatSigil, MagicGrade, SigilCounts } from '../../types';
import { BlessingIntro, SectionHeader, SectionSubHeader, WeaponIcon, CompanionIcon, BoostedEffectBox, renderFormattedText } from '../ui';
import { CompellingWillSigilCard, SigilColor } from '../CompellingWillSigilCard';
import { WeaponSelectionModal } from '../WeaponSelectionModal';
import { CompanionSelectionModal } from '../SigilTreeOptionCard';
import { BeastSelectionModal } from '../BeastSelectionModal';


const sigilImageMap: {[key: string]: keyof SigilCounts} = { 'kaarn.png': 'kaarn', 'purth.png': 'purth', 'juathas.png': 'juathas', 'xuth.png': 'xuth', 'sinthru.png': 'sinthru', 'lekolu.png': 'lekolu' };
const getSigilTypeFromImage = (imageSrc: string): keyof SigilCounts | null => {
    for (const key in sigilImageMap) { if (imageSrc.endsWith(key)) { return sigilImageMap[key]; } }
    return null;
}

const FeatureCounterCard: React.FC<{
    power: GraciousDefeatPower;
    count: number;
    onCountChange: (newCount: number) => void;
    isSelectionDisabled: boolean;
    calculateDisplayValue?: (count: number) => string;
    boostedText?: string;
    fontSize?: 'regular' | 'large';
}> = ({ power, count, onCountChange, isSelectionDisabled, calculateDisplayValue, boostedText, fontSize = 'regular' }) => {
    const gradeStyles: Record<string, string> = {
        kaarn: 'border-white ring-white/50',
        purth: 'border-green-400 ring-green-400/50',
        xuth: 'border-red-500 ring-red-500/50',
        lekolu: 'border-yellow-400 ring-yellow-400/50',
        sinthru: 'border-purple-500 ring-purple-500/50',
    };
    const activeStyle = gradeStyles[(power.grade as string) || 'kaarn'] || gradeStyles.kaarn;

    const wrapperClass = `bg-black/40 backdrop-blur-sm p-4 rounded-xl border flex flex-col text-center transition-all h-full ${
        count > 0
        ? `border-2 ${activeStyle} ring-2`
        : isSelectionDisabled
            ? 'opacity-50 border-gray-800'
            : 'border-white/10'
    }`;

    const shadowMap: Record<string, string> = {
        purth: '#C7DE95',
        xuth: '#E16456',
        lekolu: '#F1E350',
        sinthru: '#D481DC',
    };
    const shadowColor = power.grade ? shadowMap[power.grade] : undefined;
    const textShadow = shadowColor ? `0 0 2px ${shadowColor}` : 'none';
    const titleColor = shadowColor || 'white';
    
    const descriptionClass = fontSize === 'large' ? 'text-base' : 'text-sm';

    return (
        <div className={wrapperClass}>
            <img src={power.imageSrc} alt={power.title} className="w-full aspect-[3/2] rounded-md mb-4 object-cover" />
            <h4 className="font-cinzel font-bold tracking-wider text-xl" style={{ textShadow, color: titleColor }}>{power.title}</h4>
            {power.description && <div className="w-16 h-px bg-white/10 mx-auto my-2"></div>}
            <p className={`${descriptionClass} text-gray-400 font-medium leading-relaxed flex-grow text-left whitespace-pre-wrap`} style={{ textShadow }}>{renderFormattedText(power.description)}</p>
            {boostedText && <BoostedEffectBox text={boostedText} />}
            <div className="mt-4 pt-4 border-t border-gray-700/50 space-y-2">
                <div className="flex items-center justify-center gap-2">
                    <button onClick={() => onCountChange(count - 1)} disabled={count === 0} className="px-3 py-1 text-lg leading-none rounded bg-gray-800/50 border border-gray-700 hover:bg-gray-700 disabled:opacity-50">-</button>
                    <span className={`font-semibold w-24 text-center ${count > 0 ? 'text-white' : 'text-gray-500'}`}>
                        {calculateDisplayValue ? calculateDisplayValue(count) : `${count} taken`}
                    </span>
                    <button onClick={() => onCountChange(count + 1)} disabled={isSelectionDisabled} className="px-3 py-1 text-lg leading-none rounded bg-gray-800/50 border border-gray-700 hover:bg-gray-700 disabled:opacity-50">+</button>
                </div>
            </div>
        </div>
    );
};

const FeatureToggleCard: React.FC<{
    power: GraciousDefeatPower;
    isSelected: boolean;
    isDisabled: boolean;
    onToggle: () => void;
    children?: React.ReactNode;
    boostedText?: string;
    iconButton?: React.ReactNode;
    onIconButtonClick?: () => void;
    fontSize?: 'regular' | 'large';
    hideSeparator?: boolean;
}> = ({ power, isSelected, isDisabled, onToggle, children, boostedText, iconButton, onIconButtonClick, fontSize = 'regular', hideSeparator = false }) => {
    const gradeStyles: Record<string, string> = {
        kaarn: 'border-white ring-white/50',
        purth: 'border-green-400 ring-green-400/50',
        xuth: 'border-red-500 ring-red-500/50',
        lekolu: 'border-yellow-400 ring-yellow-400/50',
        sinthru: 'border-purple-500 ring-purple-500/50',
    };
    const activeStyle = gradeStyles[(power.grade as string) || 'kaarn'] || gradeStyles.kaarn;

    const wrapperClass = `bg-black/40 backdrop-blur-sm p-4 rounded-xl border flex flex-col text-center transition-all h-full ${
        isSelected
        ? `border-2 ${activeStyle} ring-2`
        : isDisabled
            ? 'opacity-50 cursor-not-allowed border-gray-800'
            : 'border-white/10 hover:border-white/40 cursor-pointer'
    }`;
    
    const hasChildren = React.Children.toArray(children).some(child => child);

    const shadowMap: Record<string, string> = {
        purth: '#C7DE95',
        xuth: '#E16456',
        lekolu: '#F1E350',
        sinthru: '#D481DC',
    };
    const shadowColor = power.grade ? shadowMap[power.grade] : undefined;
    const textShadow = shadowColor ? `0 0 2px ${shadowColor}` : 'none';
    const titleColor = shadowColor || 'white';
    
    const descriptionClass = fontSize === 'large' ? 'text-base' : 'text-sm';

    const handleIconClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onIconButtonClick?.();
    };

    return (
        <div className={`${wrapperClass} relative`} onClick={isDisabled ? undefined : onToggle}>
            {iconButton && onIconButtonClick && isSelected && (
                <button
                    onClick={handleIconClick}
                    className="absolute top-2 right-2 p-2 rounded-full bg-purple-900/50 text-purple-200/70 hover:bg-purple-800/60 hover:text-purple-100 transition-colors z-10"
                    aria-label="Card action"
                >
                    {iconButton}
                </button>
            )}
            <img src={power.imageSrc} alt={power.title} className="w-full aspect-[3/2] rounded-md mb-4 object-cover" />
            <h4 className="font-cinzel font-bold tracking-wider text-xl" style={{ textShadow, color: titleColor }}>{power.title}</h4>
            {power.description && !hideSeparator && <div className="w-16 h-px bg-white/10 mx-auto my-2"></div>}
            <p className={`${descriptionClass} text-gray-400 font-medium leading-relaxed flex-grow text-left whitespace-pre-wrap`} style={{ textShadow }}>{renderFormattedText(power.description)}</p>
            {boostedText && <BoostedEffectBox text={boostedText} />}
            {hasChildren && (
                 <div className="mt-4 pt-4 border-t border-gray-700/50 w-full">
                    {children}
                 </div>
            )}
        </div>
    );
};


export const GraciousDefeatSection: React.FC = () => {
    const ctx = useCharacterContext();
    const [isWeaponModalOpen, setIsWeaponModalOpen] = useState(false);
    const [attendantModalState, setAttendantModalState] = useState<{ isOpen: boolean, index: number | null }>({ isOpen: false, index: null });
    const [livingInhabitantModalState, setLivingInhabitantModalState] = useState<{ isOpen: boolean; id: number | null; type: 'populated' | 'rarer' | null }>({ isOpen: false, id: null, type: null });
    const [isOverlordModalOpen, setIsOverlordModalOpen] = useState(false);

    const {
        selectedBlessingEngraving,
        graciousDefeatEngraving,
        handleGraciousDefeatEngravingSelect,
        graciousDefeatWeaponName,
        handleGraciousDefeatWeaponAssign,
        verseAttendantCount,
        handleVerseAttendantCountChange,
        verseAttendantCompanionNames,
        handleVerseAttendantCompanionAssign,
        livingInhabitants,
        addLivingInhabitant,
        removeLivingInhabitant,
        assignLivingInhabitantBeast,
        overlordBeastName,
        handleOverlordBeastAssign,
        featurePicksUsed,
        shiftingWeatherCount,
        kpPaidNodes, toggleKpNode,
        fontSize,
        language
    } = useCharacterContext();

    const activeData = language === 'ko' ? GRACIOUS_DEFEAT_DATA_KO : GRACIOUS_DEFEAT_DATA;
    const activeTree = language === 'ko' ? GRACIOUS_DEFEAT_SIGIL_TREE_DATA_KO : GRACIOUS_DEFEAT_SIGIL_TREE_DATA;
    const activeEntrance = language === 'ko' ? ENTRANCE_DATA_KO : ENTRANCE_DATA;
    const activeFeatures = language === 'ko' ? FEATURES_DATA_KO : FEATURES_DATA;
    const activeInfluence = language === 'ko' ? INFLUENCE_DATA_KO : INFLUENCE_DATA;
    const activeEngravings = language === 'ko' ? BLESSING_ENGRAVINGS_KO : BLESSING_ENGRAVINGS;

    const openCompanionModal = (index: number) => {
        setAttendantModalState({ isOpen: true, index });
    };

    const closeCompanionModal = () => {
        setAttendantModalState({ isOpen: false, index: null });
    };

    const isGraciousDefeatPowerDisabled = (power: GraciousDefeatPower, type: 'entrance' | 'influence'): boolean => {
        if (type === 'entrance') {
            const selectedSet = ctx.selectedEntrance;
            const availablePicks = ctx.availableEntrancePicks;
            if (!selectedSet.has(power.id) && selectedSet.size >= availablePicks) return true;
        } else { // influence
            const selectedSet = ctx.selectedInfluence;
            const availablePicks = ctx.availableInfluencePicks;
            if (!selectedSet.has(power.id) && selectedSet.size >= availablePicks) return true;
        }
        
        if (power.requires) {
            const allSelected = new Set([...ctx.selectedEntrance, ...ctx.selectedInfluence, ...ctx.selectedGraciousDefeatSigils]);
            
            return !power.requires.every(req => {
                if (allSelected.has(req)) return true;
                if (req === 'verse_attendant' && verseAttendantCount > 0) return true;
                if (req === 'living_inhabitants' && livingInhabitants.length > 0) return true;
                if (req === 'shifting_weather' && shiftingWeatherCount > 0) return true;
                return false;
            });
        }
        return false;
    };

    const isGraciousDefeatSigilDisabled = (sigil: GraciousDefeatSigil): boolean => {
        if (ctx.selectedGraciousDefeatSigils.has(sigil.id)) return false; 
        if (!sigil.prerequisites.every(p => ctx.selectedGraciousDefeatSigils.has(p))) return true;

        if (kpPaidNodes.has(String(sigil.id))) return false;
        
        const sigilType = getSigilTypeFromImage(sigil.imageSrc);
        const sigilCost = sigilType ? 1 : 0;
        if (sigilType && ctx.availableSigilCounts[sigilType] < sigilCost) return true;

        return false;
    };

    const getGraciousDefeatSigil = (id: string) => activeTree.find(s => s.id === id)!;

    const getSigilDisplayInfo = (sigil: GraciousDefeatSigil): { color: SigilColor, benefits: React.ReactNode } => {
        // Use ID based type mapping because titles are localized
        const colorMap: Record<string, SigilColor> = {
            'Fireborn': 'orange', 'Cultivate': 'gray', 'Realmkeeper': 'yellow', 'Strengthen': 'lime',
            'Sweet Suffering': 'purple', 'Pocket God': 'red', 'Realmmaster': 'yellow',
        };
        const color = colorMap[sigil.type] || 'gray';
        const benefits = (
            <>
                {sigil.benefits.entrance ? <p className="text-blue-300">+ {sigil.benefits.entrance} {language === 'ko' ? "도입" : "Entrance"}</p> : null}
                {sigil.benefits.features ? <p className="text-green-300">+ {sigil.benefits.features} {language === 'ko' ? "특성" : "Features"}</p> : null}
                {sigil.benefits.influence ? <p className="text-red-300">+ {sigil.benefits.influence} {language === 'ko' ? "영향" : "Influence"}</p> : null}
            </>
        );
        return { color, benefits };
    };

    const handleKpToggle = (sigil: GraciousDefeatSigil) => {
        const sigilType = getSigilTypeFromImage(sigil.imageSrc);
        if (sigilType) {
            toggleKpNode(String(sigil.id), sigilType);
        }
    };

    const renderSigilNode = (id: string) => {
        const sigil = getGraciousDefeatSigil(id);
        const { color, benefits } = getSigilDisplayInfo(sigil);
        return (
            <CompellingWillSigilCard 
                sigil={sigil} 
                isSelected={ctx.selectedGraciousDefeatSigils.has(id)} 
                isDisabled={isGraciousDefeatSigilDisabled(sigil)} 
                onSelect={ctx.handleGraciousDefeatSigilSelect} 
                benefitsContent={benefits} 
                color={color} 
                compact={true}
                onToggleKp={() => handleKpToggle(sigil)}
                isKpPaid={kpPaidNodes.has(String(id))}
            />
        );
    };

    const boostDescriptions: { [key: string]: string } = language === 'ko' ? {
        natural_environment: "매 선택마다 면적이 세 배 증가합니다.",
        artificial_environment: "매 선택마다 면적이 세 배 증가합니다.",
        shifting_weather: "기상이변의 잠재력과 피해가 두 배 증가합니다.",
        living_inhabitants: "동물 점수 10점이 추가로 주어집니다.",
        broken_space: "가상 우주의 특정 공간에 공간적 '함정'을 설치합니다. 그 안에서 살아남거나 방향을 잡는 것은 사실상 불가능합니다.",
        broken_time: "가상 우주에서 하루가 흐를 때 현실에서 한 달이 흐르도록 할 수 있습니다.",
        promised_land: "동시 방문자 제한이 세 배로 증가합니다.",
        verse_attendant: "동료 점수 50점이 추가로 주어집니다."
    } : {
        natural_environment: "Triples acreage instead of doubles.",
        artificial_environment: "Triples acreage instead of doubles.",
        shifting_weather: "Doubles the potential power and damage of weather events.",
        living_inhabitants: "+10 Beast Points.",
        broken_space: "Can create spatial “booby traps” that are near-impossible to survive or navigate at limited areas of the verse.",
        broken_time: "Can set a day in the verse to be a month in real time.",
        promised_land: "Triples population limit instead of doubles.",
        verse_attendant: "+50 Companion Points."
    };

    const isFeaturesBoostDisabled = !ctx.isFeaturesBoosted && ctx.availableSigilCounts.kaarn <= 0;
    
    const featureStateMap = {
        'natural_environment': { count: ctx.naturalEnvironmentCount, handler: ctx.handleNaturalEnvironmentCountChange },
        'artificial_environment': { count: ctx.artificialEnvironmentCount, handler: ctx.handleArtificialEnvironmentCountChange },
        'shifting_weather': { count: ctx.shiftingWeatherCount, handler: ctx.handleShiftingWeatherCountChange },
        'broken_space': { count: ctx.brokenSpaceCount, handler: ctx.handleBrokenSpaceCountChange },
        'broken_time': { count: ctx.brokenTimeCount, handler: ctx.handleBrokenTimeCountChange },
        'promised_land': { count: ctx.promisedLandCount, handler: ctx.handlePromisedLandCountChange },
    };

    const isMagicianSelected = ctx.selectedTrueSelfTraits.has('magician');
    const finalEngraving = graciousDefeatEngraving ?? selectedBlessingEngraving;
    const isSkinEngraved = finalEngraving === 'skin';
    const additionalCost = Math.floor(ctx.graciousDefeatSigilTreeCost * 0.25);
    
    // Calculate Lekolu FP cost for Magician Trait
    const lekoluSigils = ['realmkeeper', 'realmmaster']; 
    const selectedLekoluCount = Array.from(ctx.selectedGraciousDefeatSigils).filter((id: string) => lekoluSigils.includes(id)).length;
    const additionalFpCost = Math.floor(selectedLekoluCount * 6 * 0.25);

    const costText = language === 'ko'
        ? `(축복 점수 -${additionalCost}${additionalFpCost > 0 ? `, 행운 점수 -${additionalFpCost}` : ''})`
        : `(-${additionalCost} BP${additionalFpCost > 0 ? `, -${additionalFpCost} FP` : ''})`;

    useEffect(() => {
        if (!isSkinEngraved && ctx.isGraciousDefeatMagicianApplied) {
            ctx.disableGraciousDefeatMagician();
        }
    }, [isSkinEngraved, ctx.isGraciousDefeatMagicianApplied, ctx.disableGraciousDefeatMagician]);

    const staticScaleStyle: React.CSSProperties = fontSize === 'large' ? { zoom: 0.83333 } : {};

    return (
        <section>
            <BlessingIntro {...activeData} />
            <div className="mt-8 mb-16 max-w-3xl mx-auto">
                <h4 className="font-cinzel text-xl text-center tracking-widest my-6 text-purple-300 uppercase">
                    {language === 'ko' ? "축복 각인" : "Engrave this Blessing"}
                </h4>
                <div className="grid grid-cols-3 gap-4">
                    {activeEngravings.map(engraving => {
                        const isSelected = finalEngraving === engraving.id;
                        const isOverridden = graciousDefeatEngraving !== null;
                        const isWeapon = engraving.id === 'weapon';

                        return (
                             <div key={engraving.id} className="relative">
                                <button
                                    onClick={() => handleGraciousDefeatEngravingSelect(engraving.id)}
                                    className={`w-full p-4 rounded-lg border-2 transition-colors flex flex-col items-center justify-center h-full text-center
                                        ${isSelected 
                                            ? (isOverridden ? 'border-purple-400 bg-purple-900/40' : 'border-purple-600/50 bg-purple-900/20') 
                                            : 'border-gray-700 bg-black/30 hover:border-purple-400/50'}
                                    `}
                                >
                                    <span className="font-cinzel tracking-wider uppercase">{engraving.title}</span>
                                    {isWeapon && isSelected && graciousDefeatWeaponName && (
                                        <p className="text-xs text-purple-300 mt-2 truncate">({graciousDefeatWeaponName})</p>
                                    )}
                                </button>
                                {isWeapon && isSelected && (
                                    <button
                                        onClick={() => setIsWeaponModalOpen(true)}
                                        className="absolute top-2 right-2 p-2 rounded-full bg-purple-900/50 text-purple-200/70 hover:bg-purple-800/60 hover:text-purple-100 transition-colors z-10"
                                        aria-label="Change Weapon"
                                        title="Change Weapon"
                                    >
                                        <WeaponIcon />
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
                {isMagicianSelected && isSkinEngraved && (
                    <div className="text-center mt-4">
                        <button
                            onClick={ctx.handleToggleGraciousDefeatMagician}
                            className={`px-6 py-3 text-sm rounded-lg border transition-colors ${
                                ctx.isGraciousDefeatMagicianApplied
                                    ? 'bg-purple-800/60 border-purple-500 text-white'
                                    : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:border-purple-500/70'
                            }`}
                        >
                            {ctx.isGraciousDefeatMagicianApplied
                                ? (language === 'ko' ? `'마법사' 특성이 적용되었습니다. ${costText}` : `The Magician trait is applied. ${costText}`)
                                : (language === 'ko' ? `'마법사' 특성을 적용할 수 있습니다. 변신 없이 축복을 사용할 수 있게 됩니다. ${costText}` : `Click to enable the Magician trait from your True Self, allowing you to use the Blessing without transforming. ${costText}`)}
                        </button>
                    </div>
                )}
            </div>

            {isWeaponModalOpen && (
                <WeaponSelectionModal
                    onClose={() => setIsWeaponModalOpen(false)}
                    onSelect={(weaponName) => {
                        handleGraciousDefeatWeaponAssign(weaponName);
                        setIsWeaponModalOpen(false);
                    }}
                    currentWeaponName={graciousDefeatWeaponName}
                />
            )}
            <div className="my-16 bg-black/20 p-8 rounded-lg border border-gray-800 overflow-x-auto">
                <SectionHeader>{language === 'ko' ? "표식 트리" : "SIGIL TREE"}</SectionHeader>
                <div className="flex items-center min-w-max pb-8 px-4 justify-center">
                    
                    {/* Column 1: Root */}
                    <div className="flex flex-col justify-center h-[28rem]">
                        {renderSigilNode('gd_fireborn')}
                    </div>

                    {/* SVG Connector 1 (Split) */}
                    <svg className="w-16 h-[28rem] flex-shrink-0 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M 0 224 H 20" /> {/* Center Out */}
                        <path d="M 20 224 V 88 H 64" /> {/* Branch Top (Cultivate Path) */}
                        <path d="M 20 224 V 360 H 64" /> {/* Branch Bottom (Realmkeeper Path) */}
                    </svg>

                    {/* Column 2 */}
                    <div className="flex flex-col justify-between h-[28rem]">
                        <div className="h-44 flex items-center justify-center">
                            {renderSigilNode('cultivate_i')}
                        </div>
                        <div className="h-44 flex items-center justify-center">
                            {renderSigilNode('realmkeeper')}
                        </div>
                    </div>

                    {/* SVG Connector 2 (Straight) */}
                    <svg className="w-16 h-[28rem] flex-shrink-0 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M 0 88 H 64" /> {/* Top Path */}
                        <path d="M 0 360 H 64" /> {/* Bottom Path */}
                    </svg>

                    {/* Column 3 */}
                    <div className="flex flex-col justify-between h-[28rem]">
                        <div className="h-44 flex items-center justify-center">
                            {renderSigilNode('cultivate_ii')}
                        </div>
                        <div className="h-44 flex items-center justify-center">
                            {renderSigilNode('strengthen_i')}
                        </div>
                    </div>

                    {/* SVG Connector 3 (Crossover + Straight) */}
                    <svg className="w-16 h-[28rem] flex-shrink-0 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2">
                        {/* Strengthen I -> Realmmaster (Straight Bottom) */}
                        <path d="M 0 360 H 64" />
                        {/* Strengthen I -> Sweet Suffering (Bottom to Top) */}
                        <path d="M 0 360 H 20 V 88 H 64" />
                    </svg>

                    {/* Column 4 */}
                    <div className="flex flex-col justify-between h-[28rem]">
                        <div className="h-44 flex items-center justify-center">
                            {renderSigilNode('sweet_suffering')}
                        </div>
                        <div className="h-44 flex items-center justify-center">
                            {renderSigilNode('realmmaster')}
                        </div>
                    </div>

                    {/* SVG Connector 4 (Crossover + Straight) */}
                    <svg className="w-16 h-[28rem] flex-shrink-0 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2">
                        {/* Realmmaster -> Strengthen II (Straight Bottom) */}
                        <path d="M 0 360 H 64" />
                        {/* Realmmaster -> Pocket God (Bottom to Top) */}
                        <path d="M 0 360 H 20 V 88 H 64" /> 
                    </svg>

                    {/* Column 5 */}
                    <div className="flex flex-col justify-between h-[28rem]">
                        <div className="h-44 flex items-center justify-center">
                            {renderSigilNode('pocket_god')}
                        </div>
                        <div className="h-44 flex items-center justify-center">
                            {renderSigilNode('strengthen_ii')}
                        </div>
                    </div>

                </div>
            </div>
            <div className="mt-16 px-4 lg:px-8">
                <SectionHeader>{language === 'ko' ? "도입" : "Entrance"}</SectionHeader>
                <SectionSubHeader>{language === 'ko' ? `선택 가능: ${ctx.availableEntrancePicks - ctx.selectedEntrance.size} / ${ctx.availableEntrancePicks}` : `Picks Available: ${ctx.availableEntrancePicks - ctx.selectedEntrance.size} / ${ctx.availableEntrancePicks}`}</SectionSubHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" style={staticScaleStyle}>
                    {activeEntrance.map(power => {
                        const isSelected = ctx.selectedEntrance.has(power.id);
                        const isDisabled = isGraciousDefeatPowerDisabled(power, 'entrance');
                        return <FeatureToggleCard
                                    key={power.id}
                                    power={power}
                                    isSelected={isSelected}
                                    isDisabled={isDisabled && !isSelected}
                                    onToggle={() => ctx.handleEntranceSelect(power.id)}
                                    fontSize={fontSize}
                                />;
                    })}
                </div>
            </div>
            <div className="mt-16 px-4 lg:px-8">
                <SectionHeader>{language === 'ko' ? "특성" : "Features"}</SectionHeader>
                <div className={`my-4 max-w-sm mx-auto p-4 border rounded-lg transition-all bg-black/20 ${ ctx.isFeaturesBoosted ? 'border-amber-400 ring-2 ring-amber-400/50 cursor-pointer hover:border-amber-300' : isFeaturesBoostDisabled ? 'border-gray-700 opacity-50 cursor-not-allowed' : 'border-gray-700 hover:border-amber-400/50 cursor-pointer'}`} onClick={!isFeaturesBoostDisabled ? () => ctx.handleGraciousDefeatBoostToggle('features') : undefined}>
                    <div className="flex items-center justify-center gap-4">
                        <img src="/images/zTm8fcLb-kaarn.webp" alt="Kaarn Sigil" className="w-16 h-16"/>
                        <div className="text-left">
                            <h4 className="font-cinzel text-lg font-bold text-amber-300 tracking-widest">{ctx.isFeaturesBoosted ? 'BOOSTED' : 'BOOST'}</h4>
                            {!ctx.isFeaturesBoosted && <p className="text-xs text-gray-400 mt-1">
                                {language === 'ko' ? "활성화 시 카른 표식 1개 소모" : "Activating this will consume one Kaarn sigil."}
                            </p>}
                        </div>
                    </div>
                </div>
                <SectionSubHeader>{language === 'ko' ? `선택 가능: ${ctx.availableFeaturesPicks - featurePicksUsed} / ${ctx.availableFeaturesPicks}` : `Picks Available: ${ctx.availableFeaturesPicks - featurePicksUsed} / ${ctx.availableFeaturesPicks}`}</SectionSubHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" style={staticScaleStyle}>
                    {activeFeatures.map(power => {
                        const isSelectionDisabled = featurePicksUsed >= ctx.availableFeaturesPicks;
                        const boostedText = ctx.isFeaturesBoosted && boostDescriptions[power.id];
                        const stateInfo = featureStateMap[power.id as keyof typeof featureStateMap];

                        const isSingleSelect = ['shifting_weather', 'broken_space', 'broken_time'].includes(power.id);

                        if (isSingleSelect && stateInfo) {
                             const isSelected = stateInfo.count > 0;
                             const isDisabled = isSelectionDisabled && !isSelected;
                             return <FeatureToggleCard
                                        key={power.id}
                                        power={power}
                                        isSelected={isSelected}
                                        isDisabled={isDisabled}
                                        onToggle={() => stateInfo.handler(isSelected ? 0 : 1)}
                                        boostedText={boostedText}
                                        fontSize={fontSize}
                                     />;
                        }

                        if (power.id === 'verse_attendant') {
                            const gradeStyles: Record<string, string> = {
                                kaarn: 'border-white ring-white/50',
                                purth: 'border-green-400 ring-green-400/50',
                                xuth: 'border-red-500 ring-red-500/50',
                                lekolu: 'border-yellow-400 ring-yellow-400/50',
                                sinthru: 'border-purple-500 ring-purple-500/50',
                            };
                            const activeStyle = gradeStyles[(power.grade as string) || 'kaarn'] || gradeStyles.kaarn;

                            const wrapperClass = `bg-black/40 backdrop-blur-sm p-4 rounded-xl border flex flex-col text-center transition-all h-full ${
                                verseAttendantCount > 0
                                ? `border-2 ${activeStyle} ring-2`
                                : isSelectionDisabled
                                    ? 'opacity-50 border-gray-800'
                                    : 'border-white/10'
                            }`;
                            
                            const shadowMap: Record<string, string> = {
                                purth: '#C7DE95',
                                xuth: '#E16456',
                                lekolu: '#F1E350',
                                sinthru: '#D481DC',
                            };
                            const shadowColor = power.grade ? shadowMap[power.grade] : undefined;
                            const textShadow = shadowColor ? `0 0 2px ${shadowColor}` : 'none';
                            const titleColor = shadowColor || 'white';
                            
                            const descriptionClass = fontSize === 'large' ? 'text-base' : 'text-sm';

                            return (
                                <div key={power.id} className={wrapperClass}>
                                    <img src={power.imageSrc} alt={power.title} className="w-full aspect-[3/2] rounded-md mb-4 object-cover" />
                                    <h4 className="font-cinzel font-bold tracking-wider text-2xl" style={{ textShadow, color: titleColor }}>{power.title}</h4>
                                    <div className="w-16 h-px bg-white/10 mx-auto my-2"></div>
                                    <p className={`${descriptionClass} text-gray-400 font-medium leading-relaxed flex-grow text-left whitespace-pre-wrap`} style={{ textShadow }}>{renderFormattedText(power.description)}</p>
                                    {boostedText && <BoostedEffectBox text={boostedText} />}
                                    <div className="mt-4 pt-4 border-t border-gray-700/50 w-full">
                                         <div className="flex items-center justify-center gap-2 mb-3">
                                            <button onClick={() => handleVerseAttendantCountChange(verseAttendantCount - 1)} disabled={verseAttendantCount === 0} className="px-3 py-1 text-lg leading-none rounded bg-gray-800/50 border border-gray-700 hover:bg-gray-700 disabled:opacity-50">-</button>
                                            <span className={`font-semibold w-24 text-center ${verseAttendantCount > 0 ? 'text-white' : 'text-gray-500'}`}>
                                                {verseAttendantCount} {language === 'ko' ? "명" : "taken"}
                                            </span>
                                            <button onClick={() => handleVerseAttendantCountChange(verseAttendantCount + 1)} disabled={isSelectionDisabled} className="px-3 py-1 text-lg leading-none rounded bg-gray-800/50 border border-gray-700 hover:bg-gray-700 disabled:opacity-50">+</button>
                                        </div>
                                        
                                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                                            {Array.from({ length: verseAttendantCount }).map((_, index) => (
                                                <div key={index} className="flex justify-between items-center text-xs bg-black/40 border border-gray-700/50 p-2 rounded hover:border-gray-500 transition-colors group">
                                                    <div className="flex flex-col items-start text-left">
                                                        <span className="text-gray-500 font-bold uppercase text-[9px] tracking-wider mb-0.5">Attendant #{index + 1}</span>
                                                        <span className={`truncate max-w-[110px] font-medium ${verseAttendantCompanionNames[index] ? 'text-purple-200' : 'text-gray-600 italic'}`}>
                                                            {verseAttendantCompanionNames[index] || 'Unassigned'}
                                                        </span>
                                                    </div>
                                                    <button 
                                                        onClick={() => openCompanionModal(index)}
                                                        className={`px-3 py-1.5 rounded text-[9px] uppercase font-bold tracking-widest transition-all ${
                                                            verseAttendantCompanionNames[index] 
                                                            ? 'bg-purple-900/30 text-purple-300 border border-purple-500/30 hover:bg-purple-800/50 hover:text-white' 
                                                            : 'bg-cyan-900/30 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-800/50 hover:text-white'
                                                        }`}
                                                    >
                                                        {verseAttendantCompanionNames[index] ? 'Edit' : 'Assign'}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        }

                        if (power.id === 'living_inhabitants') {
                            const gradeStyles: Record<string, string> = {
                                kaarn: 'border-white ring-white/50',
                                purth: 'border-green-400 ring-green-400/50',
                                xuth: 'border-red-500 ring-red-500/50',
                                lekolu: 'border-yellow-400 ring-yellow-400/50',
                                sinthru: 'border-purple-500 ring-purple-500/50',
                            };
                            const activeStyle = gradeStyles[(power.grade as string) || 'kaarn'] || gradeStyles.kaarn;

                            const wrapperClass = `bg-black/40 backdrop-blur-sm p-4 rounded-xl border flex flex-col text-center transition-all h-full ${
                                livingInhabitants.length > 0
                                ? `border-2 ${activeStyle} ring-2`
                                : isSelectionDisabled
                                    ? 'opacity-50 border-gray-800'
                                    : 'border-white/10'
                            }`;
                            
                            const shadowMap: Record<string, string> = {
                                purth: '#C7DE95',
                                xuth: '#E16456',
                                lekolu: '#F1E350',
                                sinthru: '#D481DC',
                            };
                            const shadowColor = power.grade ? shadowMap[power.grade] : undefined;
                            const textShadow = shadowColor ? `0 0 2px ${shadowColor}` : 'none';
                            const titleColor = shadowColor || 'white';
                            
                            const descriptionClass = fontSize === 'large' ? 'text-base' : 'text-sm';

                            return (
                                <div key={power.id} className={wrapperClass}>
                                    <img src={power.imageSrc} alt={power.title} className="w-full aspect-[3/2] rounded-md mb-4 object-cover" />
                                    <h4 className="font-cinzel font-bold tracking-wider text-2xl" style={{ textShadow, color: titleColor }}>{power.title}</h4>
                                    <div className="w-16 h-px bg-white/10 mx-auto my-2"></div>
                                    <p className={`${descriptionClass} text-gray-400 font-medium leading-relaxed flex-grow text-left whitespace-pre-wrap`} style={{ textShadow }}>{renderFormattedText(power.description)}</p>
                                    {boostedText && <BoostedEffectBox text={boostedText} />}
                                    <div className="mt-4 pt-4 border-t border-gray-700/50 w-full">
                                         <div className="flex items-center justify-center gap-2 mb-3">
                                            <button onClick={() => removeLivingInhabitant(livingInhabitants[livingInhabitants.length - 1]?.id)} disabled={livingInhabitants.length === 0} className="px-3 py-1 text-lg leading-none rounded bg-gray-800/50 border border-gray-700 hover:bg-gray-700 disabled:opacity-50">-</button>
                                            <span className={`font-semibold w-24 text-center ${livingInhabitants.length > 0 ? 'text-white' : 'text-gray-500'}`}>
                                                {livingInhabitants.length} {language === 'ko' ? "종" : "species"}
                                            </span>
                                            <button onClick={() => addLivingInhabitant()} disabled={isSelectionDisabled} className="px-3 py-1 text-lg leading-none rounded bg-gray-800/50 border border-gray-700 hover:bg-gray-700 disabled:opacity-50">+</button>
                                        </div>
                                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                                            {livingInhabitants.map((inhabitant, index) => (
                                                <div key={inhabitant.id} className="text-xs bg-black/40 border border-gray-700/50 p-2 rounded hover:border-gray-500 transition-colors flex flex-col gap-2">
                                                    <div className="flex justify-between items-center">
                                                        <div className="flex flex-col items-start text-left">
                                                            <span className="text-gray-500 font-bold uppercase text-[9px] tracking-wider">Species #{index + 1}</span>
                                                        </div>
                                                         <select 
                                                            value={inhabitant.type || ''}
                                                            onChange={(e) => assignLivingInhabitantBeast(inhabitant.id, e.target.value as any, inhabitant.beastName)}
                                                            className="bg-gray-900 border border-gray-600 text-[9px] rounded px-1 py-0.5 text-gray-300 focus:border-purple-500 focus:outline-none"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <option value="">Type...</option>
                                                            <option value="populated">{language === 'ko' ? "다수 종족 (40 BP)" : "Populated (40 BP)"}</option>
                                                            <option value="rarer">{language === 'ko' ? "희귀 종족 (70 BP)" : "Rarer (70 BP)"}</option>
                                                        </select>
                                                    </div>
                                                    
                                                    {inhabitant.type && (
                                                        <div className="flex justify-between items-center border-t border-gray-700/30 pt-2 mt-1">
                                                             <span className={`truncate max-w-[100px] font-medium text-[10px] ${inhabitant.beastName ? 'text-green-200' : 'text-gray-600 italic'}`}>
                                                                {inhabitant.beastName || 'Unassigned Form'}
                                                            </span>
                                                            <button 
                                                                onClick={() => setLivingInhabitantModalState({ isOpen: true, id: inhabitant.id, type: inhabitant.type })}
                                                                className={`px-3 py-1 rounded text-[9px] uppercase font-bold tracking-widest transition-all ${
                                                                    inhabitant.beastName 
                                                                    ? 'bg-purple-900/30 text-purple-300 border border-purple-500/30 hover:bg-purple-800/50 hover:text-white' 
                                                                    : 'bg-cyan-900/30 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-800/50 hover:text-white'
                                                                }`}
                                                            >
                                                                {inhabitant.beastName ? 'Edit' : 'Assign'}
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        }

                        if (['natural_environment', 'artificial_environment', 'promised_land'].includes(power.id) && stateInfo) {
                            return <FeatureCounterCard
                                        key={power.id}
                                        power={power}
                                        count={stateInfo.count}
                                        onCountChange={stateInfo.handler}
                                        isSelectionDisabled={isSelectionDisabled}
                                        boostedText={boostedText}
                                        calculateDisplayValue={power.id === 'promised_land' 
                                            ? (c) => {
                                                if (c === 0) return `0 ${language === 'ko' ? '명' : 'ppl'}`;
                                                const val = 15 * Math.pow(ctx.isFeaturesBoosted ? 3 : 2, c - 1);
                                                return `${val} ${language === 'ko' ? '명' : 'ppl'}`;
                                            }
                                            : (c) => {
                                                if (c === 0) return `0 ${language === 'ko' ? '헥타르' : 'acres'}`;
                                                // Base: 30 acres for EN, 12 hectares for KO
                                                const base = language === 'ko' ? 12 : 30;
                                                const val = base * Math.pow(ctx.isFeaturesBoosted ? 3 : 2, c - 1);
                                                return `${val} ${language === 'ko' ? '헥타르' : 'acres'}`;
                                            }
                                        }
                                        fontSize={fontSize}
                                    />;
                        }

                        return null; 
                    })}
                </div>
            </div>
            
            <div className="mt-16 px-4 lg:px-8">
                <SectionHeader>{language === 'ko' ? "영향" : "Influence"}</SectionHeader>
                <SectionSubHeader>{language === 'ko' ? `선택 가능: ${ctx.availableInfluencePicks - ctx.selectedInfluence.size} / ${ctx.availableInfluencePicks}` : `Picks Available: ${ctx.availableInfluencePicks - ctx.selectedInfluence.size} / ${ctx.availableInfluencePicks}`}</SectionSubHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" style={staticScaleStyle}>
                    {activeInfluence.map(power => {
                        const boostedText = ctx.isFeaturesBoosted && boostDescriptions[power.id];
                        const isSelected = ctx.selectedInfluence.has(power.id);
                        const isDisabled = isGraciousDefeatPowerDisabled(power, 'influence');
                        const isOverlord = power.id === 'overlord';
                        const isRealityInvasion = power.id === 'reality_invasion';

                        const divClass = isRealityInvasion ? 'lg:row-span-2' : '';

                        return (
                            <div key={power.id} className={divClass}>
                                <FeatureToggleCard
                                    power={power}
                                    isSelected={isSelected}
                                    isDisabled={isDisabled && !isSelected}
                                    onToggle={() => ctx.handleInfluenceSelect(power.id)}
                                    boostedText={boostedText}
                                    iconButton={isOverlord && isSelected ? <CompanionIcon /> : undefined}
                                    onIconButtonClick={isOverlord && isSelected ? () => setIsOverlordModalOpen(true) : undefined}
                                    fontSize={fontSize}
                                    hideSeparator={true}
                                >
                                    {isOverlord && isSelected && overlordBeastName && (
                                        <div className="text-center mt-2 border-t border-gray-700/50 pt-2">
                                            <p className="text-xs text-gray-400">Assigned Form:</p>
                                            <p className="text-sm font-bold text-amber-300">{overlordBeastName}</p>
                                        </div>
                                    )}
                                </FeatureToggleCard>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Modals */}
            {attendantModalState.isOpen && attendantModalState.index !== null && (
                <CompanionSelectionModal
                    onClose={closeCompanionModal}
                    onSelect={(name) => {
                        handleVerseAttendantCompanionAssign(attendantModalState.index!, name);
                        closeCompanionModal();
                    }}
                    currentCompanionName={verseAttendantCompanionNames[attendantModalState.index] || null}
                    pointLimit={50 + (ctx.isFeaturesBoosted ? 50 : 0)}
                    title={language === 'ko' ? `관리자 #${attendantModalState.index + 1} 할당` : `Assign Attendant #${attendantModalState.index + 1}`}
                    categoryFilter="puppet" 
                />
            )}

            {isOverlordModalOpen && (
                <BeastSelectionModal
                    onClose={() => setIsOverlordModalOpen(false)}
                    onSelect={(name) => {
                        handleOverlordBeastAssign(name);
                        setIsOverlordModalOpen(false);
                    }}
                    currentBeastName={overlordBeastName}
                    pointLimit={Infinity} // Infinite points
                    title={language === 'ko' ? "최고존엄 형태 할당 (무한 BP)" : "Assign Overlord Form (Infinite Points)"}
                    excludedPerkIds={['chatterbox_beast', 'magical_beast']}
                />
            )}
            
            {livingInhabitantModalState.isOpen && livingInhabitantModalState.id !== null && livingInhabitantModalState.type && (
                <BeastSelectionModal
                    onClose={() => setLivingInhabitantModalState({ isOpen: false, id: null, type: null })}
                    onSelect={(name) => {
                        assignLivingInhabitantBeast(livingInhabitantModalState.id!, livingInhabitantModalState.type!, name);
                        setLivingInhabitantModalState({ isOpen: false, id: null, type: null });
                    }}
                    currentBeastName={livingInhabitants.find(i => i.id === livingInhabitantModalState.id)?.beastName || null}
                    pointLimit={livingInhabitantModalState.type === 'populated' ? (40 + (ctx.isFeaturesBoosted ? 10 : 0)) : (70 + (ctx.isFeaturesBoosted ? 10 : 0))}
                    title={language === 'ko' ? `종족 할당 (${livingInhabitantModalState.type === 'populated' ? '다수' : '희귀'})` : `Assign ${livingInhabitantModalState.type === 'populated' ? 'Populated' : 'Rarer'} Inhabitant`}
                />
            )}
        </section>
    );
};
