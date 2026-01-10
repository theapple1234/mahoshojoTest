

import React, { useState, useEffect } from 'react';
import { useCharacterContext } from '../../context/CharacterContext';
import { 
    FALLEN_PEACE_DATA, FALLEN_PEACE_DATA_KO, 
    FALLEN_PEACE_SIGIL_TREE_DATA, FALLEN_PEACE_SIGIL_TREE_DATA_KO, 
    TELEPATHY_DATA, TELEPATHY_DATA_KO, 
    MENTAL_MANIPULATION_DATA, MENTAL_MANIPULATION_DATA_KO, 
    BLESSING_ENGRAVINGS, BLESSING_ENGRAVINGS_KO
} from '../../constants';
import type { FallenPeacePower, FallenPeaceSigil, ChoiceItem, MagicGrade } from '../../types';
import { BlessingIntro, SectionHeader, SectionSubHeader, WeaponIcon, BoostedEffectBox, renderFormattedText } from '../ui';
import { CompellingWillSigilCard, SigilColor } from '../CompellingWillSigilCard';
import { WeaponSelectionModal } from '../WeaponSelectionModal';

const sigilImageMap: {[key: string]: string} = { 'kaarn.png': 'kaarn', 'purth.png': 'purth', 'juathas.png': 'juathas', 'xuth.png': 'xuth', 'sinthru.png': 'sinthru', 'lekolu.png': 'lekolu' };
const getSigilTypeFromImage = (imageSrc: string): string | null => {
    for (const key in sigilImageMap) { if (imageSrc.endsWith(key)) { return sigilImageMap[key]; } }
    return null;
}

const PowerCard: React.FC<{
    power: ChoiceItem;
    isSelected: boolean;
    isDisabled: boolean;
    onToggle: (id: string) => void;
    children?: React.ReactNode;
    fontSize?: 'regular' | 'large';
    className?: string;
}> = ({ power, isSelected, isDisabled, onToggle, children, fontSize = 'regular', className = '' }) => {
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
        <div className={`${wrapperClass} relative ${className}`} onClick={() => !isDisabled && onToggle(power.id)}>
            <img src={power.imageSrc} alt={power.title} className="w-full aspect-[3/2] rounded-md mb-4 object-cover" />
            <h4 className="font-cinzel font-bold tracking-wider text-xl" style={{ textShadow, color: titleColor }}>{power.title}</h4>
            {power.cost && <p className="text-xs text-yellow-300/70 italic mt-1">{power.cost}</p>}
            
            {/* Separator Line */}
            <div className="w-16 h-px bg-white/10 mx-auto my-2"></div>
            
            <p className={`${descriptionClass} text-gray-400 font-medium leading-relaxed flex-grow text-left whitespace-pre-wrap`} style={{ textShadow }}>{renderFormattedText(power.description)}</p>
            {children && (
                 <div className="mt-4 pt-4 border-t border-gray-700/50 w-full">
                    {children}
                 </div>
            )}
        </div>
    );
};

export const FallenPeaceSection: React.FC = () => {
    const ctx = useCharacterContext();
    const [isWeaponModalOpen, setIsWeaponModalOpen] = useState(false);

    const {
        selectedBlessingEngraving,
        fallenPeaceEngraving,
        handleFallenPeaceEngravingSelect,
        fallenPeaceWeaponName,
        handleFallenPeaceWeaponAssign,
        selectedTrueSelfTraits,
        isFallenPeaceMagicianApplied,
        handleToggleFallenPeaceMagician,
        disableFallenPeaceMagician,
        fallenPeaceSigilTreeCost,
        kpPaidNodes, toggleKpNode,
        fontSize,
        language
    } = useCharacterContext();

    const activeData = language === 'ko' ? FALLEN_PEACE_DATA_KO : FALLEN_PEACE_DATA;
    const activeTree = language === 'ko' ? FALLEN_PEACE_SIGIL_TREE_DATA_KO : FALLEN_PEACE_SIGIL_TREE_DATA;
    const activeTelepathy = language === 'ko' ? TELEPATHY_DATA_KO : TELEPATHY_DATA;
    const activeMentalManipulation = language === 'ko' ? MENTAL_MANIPULATION_DATA_KO : MENTAL_MANIPULATION_DATA;
    const activeEngravings = language === 'ko' ? BLESSING_ENGRAVINGS_KO : BLESSING_ENGRAVINGS;

    const finalEngraving = fallenPeaceEngraving ?? selectedBlessingEngraving;
    const isSkinEngraved = finalEngraving === 'skin';

    useEffect(() => {
        if (!isSkinEngraved && isFallenPeaceMagicianApplied) {
            disableFallenPeaceMagician();
        }
    }, [isSkinEngraved, isFallenPeaceMagicianApplied, disableFallenPeaceMagician]);

    const isFallenPeacePowerDisabled = (power: FallenPeacePower, type: 'telepathy' | 'mentalManipulation'): boolean => {
        const selectedSet = type === 'telepathy' ? ctx.selectedTelepathy : ctx.selectedMentalManipulation;
        const availablePicks = type === 'telepathy' ? ctx.availableTelepathyPicks : ctx.availableMentalManipulationPicks;

        if (!selectedSet.has(power.id) && selectedSet.size >= availablePicks) return true;
        if (power.requires) {
            const allSelected = new Set([...ctx.selectedTelepathy, ...ctx.selectedMentalManipulation, ...ctx.selectedFallenPeaceSigils]);
            if (!power.requires.every(req => allSelected.has(req))) return true;
        }
        return false;
    };

    const isFallenPeaceSigilDisabled = (sigil: FallenPeaceSigil): boolean => {
        if (ctx.selectedFallenPeaceSigils.has(sigil.id)) return false; 
        if (!sigil.prerequisites.every(p => ctx.selectedFallenPeaceSigils.has(p))) return true;
        
        // KP check
        if (kpPaidNodes.has(String(sigil.id))) return false;

        const sigilType = getSigilTypeFromImage(sigil.imageSrc);
        const sigilCost = sigilType ? 1 : 0;
        if (sigilType && ctx.availableSigilCounts[sigilType as keyof typeof ctx.availableSigilCounts] < sigilCost) return true;

        return false;
    };

    const getFallenPeaceSigil = (id: string) => activeTree.find(s => s.id === id)!;
    
    const getSigilDisplayInfo = (sigil: FallenPeaceSigil): { color: SigilColor, benefits: React.ReactNode } => {
        const sigilType = getSigilTypeFromImage(sigil.imageSrc);
        let color: SigilColor = 'gray';
        
        switch (sigilType) {
            case 'kaarn': color = 'gray'; break;
            case 'purth': color = 'green'; break;
            case 'juathas': color = 'orange'; break;
            case 'xuth': color = 'red'; break;
            case 'sinthru': color = 'purple'; break;
            case 'lekolu': color = 'yellow'; break;
        }

        const benefits = (
            <>
                {sigil.benefits.telepathy ? <p className="text-orange-300">+ {sigil.benefits.telepathy} {language === 'ko' ? "텔레파시" : "Telepathy"}</p> : null}
                {sigil.benefits.mentalManipulation ? <p className="text-green-300">+ {sigil.benefits.mentalManipulation} {language === 'ko' ? "정신 조작" : "Mental Manipulation"}</p> : null}
            </>
        );
        return { color, benefits };
    };

    const handleKpToggle = (sigil: FallenPeaceSigil) => {
        const type = getSigilTypeFromImage(sigil.imageSrc);
        if (type) {
            toggleKpNode(String(sigil.id), type);
        }
    };

    const renderSigilNode = (id: string) => {
        const sigil = getFallenPeaceSigil(id);
        const { color, benefits } = getSigilDisplayInfo(sigil);
        return (
            <CompellingWillSigilCard 
                sigil={sigil} 
                isSelected={ctx.selectedFallenPeaceSigils.has(id)} 
                isDisabled={isFallenPeaceSigilDisabled(sigil)} 
                onSelect={ctx.handleFallenPeaceSigilSelect} 
                benefitsContent={benefits} 
                color={color} 
                compact={true}
                onToggleKp={() => handleKpToggle(sigil)}
                isKpPaid={kpPaidNodes.has(String(id))}
            />
        );
    };

    const telepathyBoostDescriptions: { [key: string]: string } = language === 'ko' ? {
        thoughtseer: "수많은 군중의 생각과 감정을 동시에 파악할 수 있습니다. 사람들을 조종하는 능력도 강화됩니다.",
        lucid_dreamer: "깨어 있는 동안에도 타인의 꿈에 침투할 수 있습니다. 꿈 속에서는 시간의 흐름이 느려지고, 감정이 더 격렬해집니다.",
        memory_lane: "훨씬 더 먼 과거의 기억도 읽을 수 있습니다. 정신 차단벽을 보다 더 잘 뚫을 수 있습니다.",
        mental_block: "차단의 방어력, 또는 지킬 수 있는 기억의 개수가 두 배 증가합니다."
    } : {
        thoughtseer: "Can read the minds of dozens of people in a crowd at once. Manipulation ability is increased.",
        lucid_dreamer: "Can invade dreams while awake, and time moves slower and feelings are more intense in the dreams.",
        memory_lane: "Can see much further back with more clarity. Better at breaking through mental blocks.",
        mental_block: "Blocks are twice as strong, or twice as many memories can be blocked."
    };

    const mentalManipulationBoostDescriptions: { [key: string]: string } = language === 'ko' ? {
        perfect_stranger: "당신을 잊는 데 걸리는 시간이 반감됩니다.",
        masquerade: "누구도 당신의 위장을 간파할 수 없습니다.",
        psychic_vampire: "반경 1.6km 내에 있는 사람들의 감정을 지속적으로 흡수하게 됩니다.",
        master_telepath: "환상이 더욱 생생해지고, 동시에 저항하기도 아주 어려워집니다.",
        crowd_control: "능력의 범위와, 대상으로 할 수 있는 일반인의 수가 두 배 증가합니다.",
        hypnotist: "조종 강도와 지속 시간이 상당히 강화됩니다.",
        breaker_of_minds: "최대 20명의 요원을 부릴 수 있습니다."
    } : {
        perfect_stranger: "Time taken to forget is halved.",
        masquerade: "Disguise is impenetrable.",
        psychic_vampire: "Passively drains emotions from everyone in a mile radius.",
        master_telepath: "Hallucinations are more vivid and much harder to resist.",
        crowd_control: "Range and capacity of crowd control doubled.",
        hypnotist: "Commands are stronger and last longer.",
        breaker_of_minds: "Can have up to 20 agents."
    };

    const isTelepathyBoostDisabled = !ctx.isTelepathyBoosted && ctx.availableSigilCounts.kaarn <= 0;
    const isMentalManipulationBoostDisabled = !ctx.isMentalManipulationBoosted && ctx.availableSigilCounts.purth <= 0;

    const isMagicianSelected = selectedTrueSelfTraits.has('magician');
    const additionalCost = Math.floor(fallenPeaceSigilTreeCost * 0.25);

    // Fallen Peace has no Lekolu sigils, so additionalFpCost is 0.
    const costText = language === 'ko'
        ? `(축복 점수 -${additionalCost})`
        : `(-${additionalCost} BP)`;

    // Style to counteract global zoom for specific sections
    // Global Large is 120%. 1 / 1.2 = 0.83333
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
                        const isOverridden = fallenPeaceEngraving !== null;
                        const isWeapon = engraving.id === 'weapon';

                        return (
                             <div key={engraving.id} className="relative">
                                <button
                                    onClick={() => handleFallenPeaceEngravingSelect(engraving.id)}
                                    className={`w-full p-4 rounded-lg border-2 transition-colors flex flex-col items-center justify-center h-full text-center
                                        ${isSelected 
                                            ? (isOverridden ? 'border-purple-400 bg-purple-900/40' : 'border-purple-600/50 bg-purple-900/20') 
                                            : 'border-gray-700 bg-black/30 hover:border-purple-400/50'}
                                    `}
                                >
                                    <span className="font-cinzel tracking-wider uppercase">{engraving.title}</span>
                                    {isWeapon && isSelected && fallenPeaceWeaponName && (
                                        <p className="text-xs text-purple-300 mt-2 truncate">({fallenPeaceWeaponName})</p>
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
                            onClick={handleToggleFallenPeaceMagician}
                            className={`px-6 py-3 text-sm rounded-lg border transition-colors ${
                                isFallenPeaceMagicianApplied
                                    ? 'bg-purple-800/60 border-purple-500 text-white'
                                    : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:border-purple-500/70'
                            }`}
                        >
                            {isFallenPeaceMagicianApplied
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
                        handleFallenPeaceWeaponAssign(weaponName);
                        setIsWeaponModalOpen(false);
                    }}
                    currentWeaponName={fallenPeaceWeaponName}
                />
            )}

            <div className="my-16 bg-black/20 p-8 rounded-lg border border-gray-800 overflow-x-auto">
                <SectionHeader>{language === 'ko' ? "표식 트리" : "SIGIL TREE"}</SectionHeader>
                <div className="flex items-center min-w-max pb-8 px-4 justify-center">
                    
                    {/* Column 1: Root */}
                    <div className="flex flex-col justify-center h-[28rem]">
                        {renderSigilNode('left_brained')}
                    </div>

                    {/* SVG Connector 1 (Split) */}
                    <svg className="w-16 h-[28rem] flex-shrink-0 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M 0 224 H 20" /> {/* Center Out */}
                        <path d="M 20 224 V 100 H 64" /> {/* Branch Top (Parietal) */}
                        <path d="M 20 224 V 348 H 64" /> {/* Branch Bottom (Broca) */}
                    </svg>

                    {/* Column 2 */}
                    <div className="flex flex-col justify-between h-[28rem]">
                        <div className="h-44 flex items-center justify-center">
                            {renderSigilNode('parietal_lobe')}
                        </div>
                        <div className="h-44 flex items-center justify-center">
                            {renderSigilNode('brocas_area')}
                        </div>
                    </div>

                    {/* SVG Connector 2 (Converge to Frontal) */}
                    <svg className="w-16 h-[28rem] flex-shrink-0 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M 0 100 H 20 V 224 H 64" /> {/* Top In */}
                        <path d="M 0 348 H 20 V 224" /> {/* Bottom In */}
                    </svg>

                    {/* Column 3: Frontal Lobe */}
                    <div className="flex flex-col justify-center h-[28rem]">
                        {renderSigilNode('frontal_lobe')}
                    </div>

                    {/* SVG Connector 3 (Split) */}
                    <svg className="w-16 h-[28rem] flex-shrink-0 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M 0 224 H 20" /> {/* Center Out */}
                        <path d="M 20 224 V 100 H 64" /> {/* Branch Top (Cerebellum) */}
                        <path d="M 20 224 V 348 H 64" /> {/* Branch Bottom (Temporal) */}
                    </svg>

                    {/* Column 4 */}
                    <div className="flex flex-col justify-between h-[28rem]">
                        <div className="h-44 flex items-center justify-center">
                            {renderSigilNode('cerebellum')}
                        </div>
                        <div className="h-44 flex items-center justify-center">
                            {renderSigilNode('temporal_lobe')}
                        </div>
                    </div>

                     {/* SVG Connector 4 (Converge to Right) */}
                    <svg className="w-16 h-[28rem] flex-shrink-0 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M 0 100 H 20 V 224 H 64" /> {/* Top In */}
                        <path d="M 0 348 H 20 V 224" /> {/* Bottom In */}
                    </svg>

                    {/* Column 5 */}
                    <div className="flex flex-col justify-center h-[28rem]">
                        {renderSigilNode('right_brained')}
                    </div>

                </div>
            </div>

            <div className="mt-16 px-4 lg:px-8">
                <SectionHeader>{language === 'ko' ? "텔레파시" : "Telepathy"}</SectionHeader>
                <div className={`my-4 max-w-sm mx-auto p-4 border rounded-lg transition-all bg-black/20 ${ ctx.isTelepathyBoosted ? 'border-amber-400 ring-2 ring-amber-400/50 cursor-pointer hover:border-amber-300' : isTelepathyBoostDisabled ? 'border-gray-700 opacity-50 cursor-not-allowed' : 'border-gray-700 hover:border-amber-400/50 cursor-pointer'}`} onClick={!isTelepathyBoostDisabled ? () => ctx.handleFallenPeaceBoostToggle('telepathy') : undefined}>
                    <div className="flex items-center justify-center gap-4">
                        <img src="/images/zTm8fcLb-kaarn.png" alt="Kaarn Sigil" className="w-16 h-16"/>
                        <div className="text-left">
                            <h4 className="font-cinzel text-lg font-bold text-amber-300 tracking-widest">{ctx.isTelepathyBoosted ? 'BOOSTED' : 'BOOST'}</h4>
                            {!ctx.isTelepathyBoosted && <p className="text-xs text-gray-400 mt-1">
                                {language === 'ko' ? "활성화 시 카른 표식 1개 소모" : "Activating this will consume one Kaarn sigil."}
                            </p>}
                        </div>
                    </div>
                </div>
                <SectionSubHeader>
                    {language === 'ko' ? `선택 가능: ${ctx.availableTelepathyPicks - ctx.selectedTelepathy.size} / ${ctx.availableTelepathyPicks}` : `Picks Available: ${ctx.availableTelepathyPicks - ctx.selectedTelepathy.size} / ${ctx.availableTelepathyPicks}`}
                </SectionSubHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" style={staticScaleStyle}>
                    {activeTelepathy.map(power => {
                        const boostedText = ctx.isTelepathyBoosted && telepathyBoostDescriptions[power.id];
                        
                        return (
                            <PowerCard 
                                key={power.id} 
                                power={{...power, cost: ''}} 
                                isSelected={ctx.selectedTelepathy.has(power.id)} 
                                onToggle={ctx.handleTelepathySelect} 
                                isDisabled={isFallenPeacePowerDisabled(power, 'telepathy')}
                                fontSize={fontSize}
                            >
                                {boostedText && <BoostedEffectBox text={boostedText} />}
                            </PowerCard>
                        )
                    })}
                </div>
            </div>

            <div className="mt-16 px-4 lg:px-8">
                <SectionHeader>{language === 'ko' ? "정신 조작" : "Mental Manipulation"}</SectionHeader>
                <div className={`my-4 max-w-sm mx-auto p-4 border rounded-lg transition-all bg-black/20 ${ ctx.isMentalManipulationBoosted ? 'border-amber-400 ring-2 ring-amber-400/50 cursor-pointer hover:border-amber-300' : isMentalManipulationBoostDisabled ? 'border-gray-700 opacity-50 cursor-not-allowed' : 'border-gray-700 hover:border-amber-400/50 cursor-pointer'}`} onClick={!isMentalManipulationBoostDisabled ? () => ctx.handleFallenPeaceBoostToggle('mentalManipulation') : undefined}>
                    <div className="flex items-center justify-center gap-4">
                        <img src="/images/Dg6nz0R1-purth.png" alt="Purth Sigil" className="w-16 h-16"/>
                        <div className="text-left">
                            <h4 className="font-cinzel text-lg font-bold text-amber-300 tracking-widest">{ctx.isMentalManipulationBoosted ? 'BOOSTED' : 'BOOST'}</h4>
                            {!ctx.isMentalManipulationBoosted && <p className="text-xs text-gray-400 mt-1">
                                {language === 'ko' ? "활성화 시 퍼르스 표식 1개 소모" : "Activating this will consume one Purth sigil."}
                            </p>}
                        </div>
                    </div>
                </div>
                <SectionSubHeader>
                    {language === 'ko' ? `선택 가능: ${ctx.availableMentalManipulationPicks - ctx.selectedMentalManipulation.size} / ${ctx.availableMentalManipulationPicks}` : `Picks Available: ${ctx.availableMentalManipulationPicks - ctx.selectedMentalManipulation.size} / ${ctx.availableMentalManipulationPicks}`}
                </SectionSubHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" style={staticScaleStyle}>
                    {activeMentalManipulation.map(power => {
                        const boostedText = ctx.isMentalManipulationBoosted && mentalManipulationBoostDescriptions[power.id];
                        const isBreakerOfMinds = power.id === 'breaker_of_minds';

                        return (
                            <PowerCard 
                                key={power.id} 
                                power={{...power, cost: ''}} 
                                isSelected={ctx.selectedMentalManipulation.has(power.id)} 
                                onToggle={ctx.handleMentalManipulationSelect} 
                                isDisabled={isFallenPeacePowerDisabled(power, 'mentalManipulation')}
                                fontSize={fontSize}
                                className={isBreakerOfMinds ? "lg:row-span-2" : ""}
                            >
                                {boostedText && <BoostedEffectBox text={boostedText} />}
                            </PowerCard>
                        )
                    })}
                </div>
            </div>
        </section>
    );
};
