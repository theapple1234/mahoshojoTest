

import React, { useState, useEffect } from 'react';
import { useCharacterContext } from '../../context/CharacterContext';
import { 
    ARABELLA_DATA, ARABELLA_DATA_KO,
    COMPELLING_WILL_DATA, COMPELLING_WILL_DATA_KO,
    COMPELLING_WILL_SIGIL_TREE_DATA, COMPELLING_WILL_SIGIL_TREE_DATA_KO,
    TELEKINETICS_DATA, TELEKINETICS_DATA_KO,
    METATHERMICS_DATA, METATHERMICS_DATA_KO,
    BLESSING_ENGRAVINGS, BLESSING_ENGRAVINGS_KO
} from '../../constants';
import type { CompellingWillPower, CompellingWillSigil, ChoiceItem, MagicGrade, SigilCounts } from '../../types';
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
    iconButton?: React.ReactNode;
    onIconButtonClick?: () => void;
    fontSize?: 'regular' | 'large';
}> = ({ power, isSelected, isDisabled, onToggle, children, iconButton, onIconButtonClick, fontSize = 'regular' }) => {
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

    const handleIconClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onIconButtonClick?.();
    };
    
    // Robust check for children to avoid empty borders
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
    
    const descriptionClass = fontSize === 'large' ? 'text-sm' : 'text-xs';

    return (
        <div className={`${wrapperClass} relative`} onClick={() => !isDisabled && onToggle(power.id)}>
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
            {power.cost && <p className="text-xs text-yellow-300/70 italic mt-1">{power.cost}</p>}
            
            {/* Separator Line */}
            {power.description && <div className="w-16 h-px bg-white/10 mx-auto my-2"></div>}
            
            <p className={`${descriptionClass} text-gray-400 font-medium leading-relaxed flex-grow text-left whitespace-pre-wrap`} style={{ textShadow }}>{renderFormattedText(power.description)}</p>
            {hasChildren && (
                 <div className="mt-4 pt-4 border-t border-gray-700/50 w-full">
                    {children}
                 </div>
            )}
        </div>
    );
};

export const CompellingWillSection: React.FC = () => {
    const ctx = useCharacterContext();
    const [isWeaponModalOpen, setIsWeaponModalOpen] = useState(false);
    const [isThermalWeaponryModalOpen, setIsThermalWeaponryModalOpen] = useState(false);

    const {
        selectedBlessingEngraving,
        compellingWillEngraving,
        handleCompellingWillEngravingSelect,
        compellingWillWeaponName,
        handleCompellingWillWeaponAssign,
        thermalWeaponryWeaponName,
        handleThermalWeaponryWeaponAssign,
        selectedTrueSelfTraits,
        isCompellingWillMagicianApplied,
        handleToggleCompellingWillMagician,
        disableCompellingWillMagician,
        compellingWillSigilTreeCost,
        
        kpPaidNodes, toggleKpNode,
        fontSize,
        language
    } = useCharacterContext();

    const activeArabella = language === 'ko' ? ARABELLA_DATA_KO : ARABELLA_DATA;
    const activeCompellingWill = language === 'ko' ? COMPELLING_WILL_DATA_KO : COMPELLING_WILL_DATA;
    const activeTree = language === 'ko' ? COMPELLING_WILL_SIGIL_TREE_DATA_KO : COMPELLING_WILL_SIGIL_TREE_DATA;
    const activeTelekinetics = language === 'ko' ? TELEKINETICS_DATA_KO : TELEKINETICS_DATA;
    const activeMetathermics = language === 'ko' ? METATHERMICS_DATA_KO : METATHERMICS_DATA;

    const finalEngraving = compellingWillEngraving ?? selectedBlessingEngraving;
    const isSkinEngraved = finalEngraving === 'skin';

    useEffect(() => {
        if (!isSkinEngraved && isCompellingWillMagicianApplied) {
            disableCompellingWillMagician();
        }
    }, [isSkinEngraved, isCompellingWillMagicianApplied, disableCompellingWillMagician]);

    const isCompellingWillPowerDisabled = (power: CompellingWillPower, type: 'telekinetics' | 'metathermics'): boolean => {
        const selectedSet = type === 'telekinetics' ? ctx.selectedTelekinetics : ctx.selectedMetathermics;
        const availablePicks = type === 'telekinetics' ? ctx.availableTelekineticsPicks : ctx.availableMetathermicsPicks;

        if (!selectedSet.has(power.id) && selectedSet.size >= availablePicks) return true;

        if (power.requires) {
            const allSelectedPowersAndSigils = new Set([...ctx.selectedTelekinetics, ...ctx.selectedMetathermics, ...ctx.selectedCompellingWillSigils]);
            if (!power.requires.every(req => allSelectedPowersAndSigils.has(req))) return true;
        }
        return false;
    };
    
    const isCompellingWillSigilDisabled = (sigil: CompellingWillSigil): boolean => {
        if (ctx.selectedCompellingWillSigils.has(sigil.id)) return false; 
        if (!sigil.prerequisites.every(p => ctx.selectedCompellingWillSigils.has(p))) return true;

        // KP Check
        if (kpPaidNodes.has(String(sigil.id))) return false;

        const sigilType = getSigilTypeFromImage(sigil.imageSrc);
        if (sigilType && ctx.availableSigilCounts[sigilType as keyof SigilCounts] < 1) return true;

        return false;
    };

    const getCompellingWillSigil = (id: string) => activeTree.find(s => s.id === id)!;
    
    const getSigilDisplayInfo = (sigil: CompellingWillSigil): { color: SigilColor, benefits: React.ReactNode } => {
        let color: SigilColor = 'gray';
        
        switch(sigil.id) {
            case 'manipulator': case 'reality_bender': color = 'red'; break;
            case 'psycho': case 'thermal_master': color = 'green'; break;
            case 'thermosword': color = 'yellow'; break;
            default: color = 'gray'; break;
        }

        const benefits = (
            <>
                {sigil.benefits.telekinetics ? <p className="text-cyan-300">+ {sigil.benefits.telekinetics} {language === 'ko' ? '염력' : 'Telekinetics'}</p> : null}
                {sigil.benefits.metathermics ? <p className="text-rose-300">+ {sigil.benefits.metathermics} {language === 'ko' ? '메타열역학' : 'Metathermics'}</p> : null}
            </>
        );
        return { color, benefits };
    };
    
    const handleKpToggle = (sigil: CompellingWillSigil) => {
        const sigilType = getSigilTypeFromImage(sigil.imageSrc);
        if (sigilType) {
            toggleKpNode(String(sigil.id), sigilType);
        }
    };

    const renderSigilNode = (id: string, compact = true) => {
        const sigil = getCompellingWillSigil(id);
        const { color, benefits } = getSigilDisplayInfo(sigil);
        return (
            <CompellingWillSigilCard 
                sigil={sigil} 
                isSelected={ctx.selectedCompellingWillSigils.has(id)} 
                isDisabled={isCompellingWillSigilDisabled(sigil)} 
                onSelect={ctx.handleCompellingWillSigilSelect} 
                benefitsContent={benefits} 
                color={color} 
                compact={compact}
                onToggleKp={() => handleKpToggle(sigil)}
                isKpPaid={kpPaidNodes.has(String(id))}
            />
        );
    };

    const kaarnBoostDescriptions: { [key: string]: string } = language === 'ko' ? {
        psychic_force_i: "능력을 두 배 강하게 사용할 수 있습니다. 단, 사용하고 나면 지치게 됩니다.",
        psychic_force_ii: "능력을 두 배 강하게 사용할 수 있습니다. 단, 사용하고 나면 지치게 됩니다.",
        forcefield: "일반적인 역장보다 열 배 강한 고정형 역장을 만들 수 있습니다. 다만 그 동안 움직일 수 없습니다.",
        subatomic_manipulation: "변화가 두 배 빠르게 일어납니다. 폭발 위력이 0.2킬로톤으로 증가합니다.",
        energy_channel: "에너지 광선의 위력이 소폭 상승합니다. 하루에 한 번 두 배의 위력을 갖는 광선을 발사할 수 있습니다.",
        aquatic_force: "능력을 두 배 강하게 사용할 수 있습니다. 단, 사용하고 나면 지치게 됩니다.",
        sonic_boom: "능력을 사용하면 더 이상 피해를 입지 않고 탈진하기만 합니다."
    } : {
        psychic_force_i: "Can exert twice as much force at the price of exhaustion.",
        psychic_force_ii: "Can exert twice as much force at the price of exhaustion.",
        forcefield: "Can set down a static force field that is ten times as difficult to destroy, as long as you dont move.",
        subatomic_manipulation: "Changes take effect twice as quickly. Explosion force increased to 0.2 kilotons.",
        energy_channel: "Each beam slightly more powerful. Once per day, release a beam with doubled power.",
        aquatic_force: "Can exert twice as much force at the price of exhaustion.",
        sonic_boom: "Will exhaust rather than injure you."
    };

    const purthBoostDescriptions: { [key: string]: string } = language === 'ko' ? {
        pyromaniac_i: "화염의 열기가 두 배 강해지지만, 투사하는 당신에게도 피해를 줍니다.",
        pyromaniac_ii: "화염의 열기가 두 배 강해지지만, 투사하는 당신에게도 피해를 줍니다.",
        pyromaniac_iii: "화염의 열기가 두 배 강해지지만, 투사하는 당신에게도 피해를 줍니다.",
        ice_cold_i: "얼음의 냉기가 두 배 강해지지만, 투사하는 당신에게도 피해를 줍니다.",
        ice_cold_ii: "얼음의 냉기가 두 배 강해지지만, 투사하는 당신에게도 피해를 줍니다.",
        ice_cold_iii: "얼음의 냉기가 두 배 강해지지만, 투사하는 당신에게도 피해를 줍니다.",
        plasma_strike: "번개의 위력이 소폭 상승합니다. 하루에 한 번 두 배의 위력을 갖는 번개를 발사할 수 있습니다.",
        thermal_weaponry: "이제 무기 점수 35점이 주어집니다."
    } : {
        pyromaniac_i: "Can use flame spells with twice the heat, though they’re so intense they injure you just to release.",
        pyromaniac_ii: "Can use flame spells with twice the heat, though they’re so intense they injure you just to release.",
        pyromaniac_iii: "Can use flame spells with twice the heat, though they’re so intense they injure you just to release.",
        ice_cold_i: "Can use ice spells with twice the cold, though they’re so intense they injure you just to release.",
        ice_cold_ii: "Can use ice spells with twice the cold, though they’re so intense they injure you just to release.",
        ice_cold_iii: "Can use ice spells with twice the cold, though they’re so intense they injure you just to release.",
        plasma_strike: "Each strike slightly more powerful. Once per day, can double the power of a strike.",
        thermal_weaponry: "Gives 35 weapon points."
    };

    const isTelekineticsBoostDisabled = !ctx.isTelekineticsBoosted && ctx.availableSigilCounts.kaarn <= 0;
    const isMetathermicsBoostDisabled = !ctx.isMetathermicsBoosted && ctx.availableSigilCounts.purth <= 0;

    const isMagicianSelected = selectedTrueSelfTraits.has('magician');
    const additionalCost = Math.floor(compellingWillSigilTreeCost * 0.25);
    
    // Calculate Lekolu FP cost for Magician Trait
    const lekoluSigils = ['thermosword']; 
    const selectedLekoluCount = Array.from(ctx.selectedCompellingWillSigils).filter(id => lekoluSigils.includes(id)).length;
    const additionalFpCost = Math.floor(selectedLekoluCount * 6 * 0.25);

    const costText = language === 'ko'
        ? `(축복 점수 -${additionalCost}${additionalFpCost > 0 ? `, 행운 점수 -${additionalFpCost}` : ''})`
        : `(-${additionalCost} BP${additionalFpCost > 0 ? `, -${additionalFpCost} FP` : ''})`;

    const staticScaleStyle: React.CSSProperties = fontSize === 'large' ? { zoom: 0.83333 } : {};

    return (
        <section>
            <BlessingIntro {...activeArabella} />
            <BlessingIntro {...activeCompellingWill} reverse />
            
            <div className="mt-8 mb-16 max-w-3xl mx-auto">
                <h4 className="font-cinzel text-xl text-center tracking-widest my-6 text-purple-300 uppercase">
                    {language === 'ko' ? "축복 각인" : "Engrave this Blessing"}
                </h4>
                <div className="grid grid-cols-3 gap-4">
                    {(language === 'ko' ? BLESSING_ENGRAVINGS_KO : BLESSING_ENGRAVINGS).map(engraving => {
                        const isSelected = finalEngraving === engraving.id;
                        const isOverridden = compellingWillEngraving !== null;
                        const isWeapon = engraving.id === 'weapon';

                        return (
                             <div key={engraving.id} className="relative">
                                <button
                                    onClick={() => handleCompellingWillEngravingSelect(engraving.id)}
                                    className={`w-full p-4 rounded-lg border-2 transition-colors flex flex-col items-center justify-center h-full text-center
                                        ${isSelected 
                                            ? (isOverridden ? 'border-purple-400 bg-purple-900/40' : 'border-purple-600/50 bg-purple-900/20') 
                                            : 'border-gray-700 bg-black/30 hover:border-purple-400/50'}
                                    `}
                                >
                                    <span className="font-cinzel tracking-wider uppercase">{engraving.title}</span>
                                    {isWeapon && isSelected && compellingWillWeaponName && (
                                        <p className="text-xs text-purple-300 mt-2 truncate">({compellingWillWeaponName})</p>
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
                            onClick={handleToggleCompellingWillMagician}
                            className={`px-6 py-3 text-sm rounded-lg border transition-colors ${
                                isCompellingWillMagicianApplied
                                    ? 'bg-purple-800/60 border-purple-500 text-white'
                                    : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:border-purple-500/70'
                            }`}
                        >
                            {isCompellingWillMagicianApplied
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
                        handleCompellingWillWeaponAssign(weaponName);
                        setIsWeaponModalOpen(false);
                    }}
                    currentWeaponName={compellingWillWeaponName}
                />
            )}

            {isThermalWeaponryModalOpen && (
                <WeaponSelectionModal
                    onClose={() => setIsThermalWeaponryModalOpen(false)}
                    onSelect={(weaponName) => {
                        handleThermalWeaponryWeaponAssign(weaponName);
                        setIsThermalWeaponryModalOpen(false);
                    }}
                    currentWeaponName={thermalWeaponryWeaponName}
                    pointLimit={ctx.isMetathermicsBoosted ? 35 : 30}
                    title={language === 'ko' ? "열 병기 할당" : "Assign Thermal Weapon"}
                    categoryFilter={['bladed_melee', 'blunt_melee']}
                    requiredPerkId="thermal_supercharge"
                />
            )}

            <div className="my-16 bg-black/20 p-8 rounded-lg border border-gray-800 overflow-x-auto">
                <SectionHeader>{language === 'ko' ? "표식 트리" : "SIGIL TREE"}</SectionHeader>
                <div className="flex items-center min-w-max pb-8 px-4 justify-center">
                    
                    {/* Column 1: Root */}
                    <div className="flex flex-col justify-center h-[28rem]">
                        {renderSigilNode('manipulator')}
                    </div>

                    {/* SVG Connector 1 (Split) */}
                    <svg className="w-16 h-[28rem] flex-shrink-0 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M 0 224 H 32" /> {/* Center Out */}
                        <path d="M 32 100 V 348" /> {/* Vertical Line */}
                        <path d="M 32 100 H 64" /> {/* Top Out */}
                        <path d="M 32 348 H 64" /> {/* Bottom Out */}
                    </svg>

                    {/* Column 2 */}
                    <div className="flex flex-col justify-between h-[28rem]">
                        <div className="h-44 flex items-center justify-center">
                            {renderSigilNode('telekinetic_i')}
                        </div>
                        <div className="h-44 flex items-center justify-center">
                            {renderSigilNode('thermal_master')}
                        </div>
                    </div>

                    {/* SVG Connector 2 (Complex H-Shape) */}
                    <svg className="w-12 h-[28rem] flex-shrink-0 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2">
                        {/* Inputs from Left */}
                        <path d="M 0 100 H 12" />
                        <path d="M 0 348 H 12" />
                        
                        {/* Left Vertical Bar */}
                        <path d="M 12 100 V 348" />
                        
                        {/* Center Horizontal Bridge */}
                        <path d="M 12 224 H 36" />
                        
                        {/* Right Vertical Bar */}
                        <path d="M 36 100 V 348" />
                        
                        {/* Outputs to Right */}
                        <path d="M 36 100 H 48" />
                        <path d="M 36 348 H 48" />
                    </svg>

                    {/* Column 3 */}
                    <div className="flex flex-col justify-between h-[28rem]">
                        <div className="h-44 flex items-center justify-center">
                            {renderSigilNode('psycho')}
                        </div>
                        <div className="h-44 flex items-center justify-center">
                            {renderSigilNode('thermosword')}
                        </div>
                    </div>

                    {/* SVG Connector 3 (Straight Top) */}
                    <svg className="w-12 h-[28rem] flex-shrink-0 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M 0 100 H 48" />
                    </svg>

                    {/* Column 4 */}
                    <div className="flex flex-col justify-start h-[28rem]">
                        <div className="h-44 flex items-center justify-center">
                            {renderSigilNode('telekinetic_ii')}
                        </div>
                    </div>

                    {/* SVG Connector 4 (Straight Top) */}
                    <svg className="w-12 h-[28rem] flex-shrink-0 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M 0 100 H 48" />
                    </svg>

                    {/* Column 5 */}
                    <div className="flex flex-col justify-start h-[28rem]">
                        <div className="h-44 flex items-center justify-center">
                            {renderSigilNode('reality_bender')}
                        </div>
                    </div>

                </div>
            </div>
            <div className="mt-16 px-4 lg:px-8">
                <SectionHeader>{language === 'ko' ? "염력" : "Telekinetics"}</SectionHeader>
                <div className={`my-4 max-w-sm mx-auto p-4 border rounded-lg transition-all bg-black/20 ${ ctx.isTelekineticsBoosted ? 'border-amber-400 ring-2 ring-amber-400/50 cursor-pointer hover:border-amber-300' : isTelekineticsBoostDisabled ? 'border-gray-700 opacity-50 cursor-not-allowed' : 'border-gray-700 hover:border-amber-400/50 cursor-pointer'}`} onClick={!isTelekineticsBoostDisabled ? () => ctx.handleCompellingWillBoostToggle('telekinetics') : undefined}>
                    <div className="flex items-center justify-center gap-4">
                        <img src="/images/zTm8fcLb-kaarn.png" alt="Kaarn Sigil" className="w-16 h-16"/>
                        <div className="text-left">
                            <h4 className="font-cinzel text-lg font-bold text-amber-300 tracking-widest">{ctx.isTelekineticsBoosted ? 'BOOSTED' : 'BOOST'}</h4>
                            {!ctx.isTelekineticsBoosted && <p className="text-xs text-gray-400 mt-1">
                                {language === 'ko' ? "활성화 시 카른 표식 1개 소모" : "Activating this will consume one Kaarn sigil."}
                            </p>}
                        </div>
                    </div>
                </div>
                <SectionSubHeader>
                    {language === 'ko' ? `선택 가능: ${ctx.availableTelekineticsPicks - ctx.selectedTelekinetics.size} / ${ctx.availableTelekineticsPicks}` : `Picks Available: ${ctx.availableTelekineticsPicks - ctx.selectedTelekinetics.size} / ${ctx.availableTelekineticsPicks}`}
                </SectionSubHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" style={staticScaleStyle}>
                    {(() => {
                        const specialPower = activeTelekinetics.find(p => p.id === 'subatomic_manipulation');
                        const otherPowers = activeTelekinetics.filter(p => p.id !== 'subatomic_manipulation');
                        const firstHalf = otherPowers.slice(0, 3);
                        const secondHalf = otherPowers.slice(3);

                        const renderPower = (power: CompellingWillPower) => {
                            const boostedText = ctx.isTelekineticsBoosted && kaarnBoostDescriptions[power.id];
                            return (
                                <PowerCard 
                                    key={power.id} 
                                    power={{...power, cost: ''}} 
                                    isSelected={ctx.selectedTelekinetics.has(power.id)} 
                                    onToggle={ctx.handleTelekineticsSelect} 
                                    isDisabled={isCompellingWillPowerDisabled(power, 'telekinetics')}
                                    fontSize={fontSize}
                                >
                                    {boostedText && <BoostedEffectBox text={boostedText} />}
                                </PowerCard>
                            )
                        };

                        return (
                            <>
                                {firstHalf.map(renderPower)}
                                {specialPower && (
                                    <div key={specialPower.id} className="lg:row-span-2">
                                        {renderPower(specialPower)}
                                    </div>
                                )}
                                {secondHalf.map(renderPower)}
                            </>
                        );
                    })()}
                </div>
            </div>
            <div className="mt-16 px-4 lg:px-8">
                <SectionHeader>{language === 'ko' ? "메타열역학" : "Metathermics"}</SectionHeader>
                <div className={`my-4 max-w-sm mx-auto p-4 border rounded-lg transition-all bg-black/20 ${ ctx.isMetathermicsBoosted ? 'border-amber-400 ring-2 ring-amber-400/50 cursor-pointer hover:border-amber-300' : isMetathermicsBoostDisabled ? 'border-gray-700 opacity-50 cursor-not-allowed' : 'border-gray-700 hover:border-amber-400/50 cursor-pointer'}`} onClick={!isMetathermicsBoostDisabled ? () => ctx.handleCompellingWillBoostToggle('metathermics') : undefined}>
                    <div className="flex items-center justify-center gap-4">
                        <img src="/images/Dg6nz0R1-purth.png" alt="Purth Sigil" className="w-16 h-16"/>
                        <div className="text-left">
                            <h4 className="font-cinzel text-lg font-bold text-amber-300 tracking-widest">{ctx.isMetathermicsBoosted ? 'BOOSTED' : 'BOOST'}</h4>
                            {!ctx.isMetathermicsBoosted && <p className="text-xs text-gray-400 mt-1">
                                {language === 'ko' ? "활성화 시 퍼르스 표식 1개 소모" : "Activating this will consume one Purth sigil."}
                            </p>}
                        </div>
                    </div>
                </div>
                <SectionSubHeader>
                    {language === 'ko' ? `선택 가능: ${ctx.availableMetathermicsPicks - ctx.selectedMetathermics.size} / ${ctx.availableMetathermicsPicks}` : `Picks Available: ${ctx.availableMetathermicsPicks - ctx.selectedMetathermics.size} / ${ctx.availableMetathermicsPicks}`}
                </SectionSubHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" style={staticScaleStyle}>
                    {activeMetathermics.map(power => {
                        const boostedText = ctx.isMetathermicsBoosted && purthBoostDescriptions[power.id];
                        const isThermalWeaponry = power.id === 'thermal_weaponry';
                        const isSelected = ctx.selectedMetathermics.has(power.id);

                        return (
                            <PowerCard 
                                key={power.id} 
                                power={{...power, cost: ''}} 
                                isSelected={isSelected} 
                                onToggle={ctx.handleMetathermicsSelect} 
                                isDisabled={isCompellingWillPowerDisabled(power, 'metathermics')} 
                                iconButton={isThermalWeaponry && isSelected ? <WeaponIcon /> : undefined}
                                onIconButtonClick={isThermalWeaponry && isSelected ? () => setIsThermalWeaponryModalOpen(true) : undefined}
                                fontSize={fontSize}
                            >
                                 {boostedText && <BoostedEffectBox text={boostedText} />}
                                 {isThermalWeaponry && isSelected && thermalWeaponryWeaponName && (
                                    <div className="text-center mt-2 border-t border-gray-700/50 pt-2">
                                        <p className="text-xs text-gray-400">{language === 'ko' ? "할당된 무기:" : "Assigned Weapon:"}</p>
                                        <p className="text-sm font-bold text-amber-300">{thermalWeaponryWeaponName}</p>
                                    </div>
                                )}
                            </PowerCard>
                        )
                    })}
                </div>
            </div>
        </section>
    );
};
