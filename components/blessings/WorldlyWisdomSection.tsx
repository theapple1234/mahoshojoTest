
import React, { useState, useEffect } from 'react';
import { useCharacterContext } from '../../context/CharacterContext';
import { 
    WORLDLY_WISDOM_DATA, WORLDLY_WISDOM_DATA_KO,
    WORLDLY_WISDOM_SIGIL_TREE_DATA, WORLDLY_WISDOM_SIGIL_TREE_DATA_KO,
    ELEANORS_TECHNIQUES_DATA, ELEANORS_TECHNIQUES_DATA_KO,
    GENEVIEVES_TECHNIQUES_DATA, GENEVIEVES_TECHNIQUES_DATA_KO,
    BLESSING_ENGRAVINGS, BLESSING_ENGRAVINGS_KO
} from '../../constants';
import type { WorldlyWisdomPower, WorldlyWisdomSigil, ChoiceItem, MagicGrade, SigilCounts } from '../../types';
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
}> = ({ power, isSelected, isDisabled, onToggle, children, fontSize = 'regular' }) => {
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
    
    const descriptionClass = fontSize === 'large' ? 'text-sm' : 'text-xs';

    return (
        <div className={`${wrapperClass} relative`} onClick={() => !isDisabled && onToggle(power.id)}>
            <img src={power.imageSrc} alt={power.title} className="w-full aspect-[3/2] rounded-md mb-4 object-cover" />
            <h4 className="font-cinzel font-bold tracking-wider text-xl" style={{ textShadow, color: titleColor }}>{power.title}</h4>
            {power.cost && <p className="text-xs text-yellow-300/70 italic mt-1">{power.cost}</p>}
            
            {/* Separator Line */}
            {power.description && <div className="w-16 h-px bg-white/10 mx-auto my-2"></div>}
            
            <p className={`${descriptionClass} text-gray-400 font-medium leading-relaxed flex-grow text-left whitespace-pre-wrap`} style={{ textShadow }}>{renderFormattedText(power.description)}</p>
            {children && (
                 <div className="mt-4 pt-4 border-t border-gray-700/50 w-full">
                    {children}
                 </div>
            )}
        </div>
    );
};

export const WorldlyWisdomSection: React.FC = () => {
    const ctx = useCharacterContext();
    const [isWeaponModalOpen, setIsWeaponModalOpen] = useState(false);

    const {
        selectedBlessingEngraving,
        worldlyWisdomEngraving,
        handleWorldlyWisdomEngravingSelect,
        worldlyWisdomWeaponName,
        handleWorldlyWisdomWeaponAssign,
        selectedTrueSelfTraits,
        isWorldlyWisdomMagicianApplied,
        handleToggleWorldlyWisdomMagician,
        disableWorldlyWisdomMagician,
        worldlyWisdomSigilTreeCost,
        kpPaidNodes, toggleKpNode,
        fontSize,
        language
    } = useCharacterContext();

    const activeData = language === 'ko' ? WORLDLY_WISDOM_DATA_KO : WORLDLY_WISDOM_DATA;
    const activeTree = language === 'ko' ? WORLDLY_WISDOM_SIGIL_TREE_DATA_KO : WORLDLY_WISDOM_SIGIL_TREE_DATA;
    const activeEleanors = language === 'ko' ? ELEANORS_TECHNIQUES_DATA_KO : ELEANORS_TECHNIQUES_DATA;
    const activeGenevieves = language === 'ko' ? GENEVIEVES_TECHNIQUES_DATA_KO : GENEVIEVES_TECHNIQUES_DATA;
    const activeEngravings = language === 'ko' ? BLESSING_ENGRAVINGS_KO : BLESSING_ENGRAVINGS;

    const finalEngraving = worldlyWisdomEngraving ?? selectedBlessingEngraving;
    const isSkinEngraved = finalEngraving === 'skin';

    useEffect(() => {
        if (!isSkinEngraved && isWorldlyWisdomMagicianApplied) {
            disableWorldlyWisdomMagician();
        }
    }, [isSkinEngraved, isWorldlyWisdomMagicianApplied, disableWorldlyWisdomMagician]);

    const isWorldlyWisdomPowerDisabled = (power: WorldlyWisdomPower, type: 'eleanorsTechniques' | 'genevievesTechniques'): boolean => {
        const selectedSet = type === 'eleanorsTechniques' ? ctx.selectedEleanorsTechniques : ctx.selectedGenevievesTechniques;
        const availablePicks = type === 'eleanorsTechniques' ? ctx.availableEleanorsPicks : ctx.availableGenevievesPicks;

        if (!selectedSet.has(power.id) && selectedSet.size >= availablePicks) return true;
        if (power.requires) {
            const allSelected = new Set([...ctx.selectedEleanorsTechniques, ...ctx.selectedGenevievesTechniques, ...ctx.selectedWorldlyWisdomSigils]);
            if (!power.requires.every(req => allSelected.has(req))) return true;
        }
        if (power.specialRequirement === 'requires_3_eleanor') {
            if (ctx.selectedEleanorsTechniques.size < 3) return true;
        }
        return false;
    };

    const isWorldlyWisdomSigilDisabled = (sigil: WorldlyWisdomSigil): boolean => {
        if (ctx.selectedWorldlyWisdomSigils.has(sigil.id)) return false; 
        if (!sigil.prerequisites.every(p => ctx.selectedWorldlyWisdomSigils.has(p))) return true;
        
        // KP check
        if (kpPaidNodes.has(String(sigil.id))) return false;

        const sigilType = getSigilTypeFromImage(sigil.imageSrc);
        const sigilCost = sigilType ? 1 : 0;
        if (sigilType && ctx.availableSigilCounts[sigilType as keyof SigilCounts] < sigilCost) return true;

        return false;
    };

    const getWorldlyWisdomSigil = (id: string) => activeTree.find(s => s.id === id)!;
    
    const getSigilDisplayInfo = (sigil: WorldlyWisdomSigil): { color: SigilColor, benefits: React.ReactNode } => {
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
                {sigil.benefits.eleanors ? <p className="text-lime-300">+ {sigil.benefits.eleanors} {language === 'ko' ? "엘레노어" : "Eleanor's"}</p> : null}
                {sigil.benefits.genevieves ? <p className="text-red-300">+ {sigil.benefits.genevieves} {language === 'ko' ? "제네비브" : "Genevieve's"}</p> : null}
            </>
        );
        return { color, benefits };
    };

    const handleKpToggle = (sigil: WorldlyWisdomSigil) => {
        const type = getSigilTypeFromImage(sigil.imageSrc);
        if (type) {
            toggleKpNode(String(sigil.id), type);
        }
    };

    const renderSigilNode = (id: string) => {
        const sigil = getWorldlyWisdomSigil(id);
        const { color, benefits } = getSigilDisplayInfo(sigil);
        return (
            <CompellingWillSigilCard 
                sigil={sigil} 
                isSelected={ctx.selectedWorldlyWisdomSigils.has(id)} 
                isDisabled={isWorldlyWisdomSigilDisabled(sigil)} 
                onSelect={ctx.handleWorldlyWisdomSigilSelect} 
                benefitsContent={benefits} 
                color={color} 
                compact={true}
                onToggleKp={() => handleKpToggle(sigil)}
                isKpPaid={kpPaidNodes.has(String(id))}
            />
        );
    };

    const eleanorBoostDescriptions: { [key: string]: string } = language === 'ko' ? {
        healing_bliss: "치유 속도가 두 배가 됩니다. 집중을 덜 해도 됩니다.",
        defensive_circle: "원 안에 있는 동료들이 받는 피해를 절반으로 줄입니다.",
        rejuvenating_bolt: "치유량이 두 배가 되고, 재충전 속도가 두 배 빨라집니다.",
        guardian_angels: "수호천사들이 훨씬 튼튼해지고 운을 더 크게 올려줍니다.",
        psychic_surgery: "수술 속도가 두 배가 됩니다.",
        chloromancy: "식물의 성장 및 변이 속도가 두 배가 됩니다.",
        botanic_mistresses: "드리아드가 엘레노어의 기술 5가지를 사용할 수 있게 됩니다.",
        maneaters: "식물들이 두 배 크고, 두 배 튼튼해집니다."
    } : {
        healing_bliss: "Heals twice as fast, requires less focus.",
        defensive_circle: "Halves damage taken by allies within.",
        rejuvenating_bolt: "Heals twice as much damage, recharges twice as fast.",
        guardian_angels: "Angels are much more durable and provide even more luck.",
        psychic_surgery: "Surgeries take half as long.",
        chloromancy: "Plants grow and mutate twice as fast.",
        botanic_mistresses: "Can use 5 techniques.",
        maneaters: "Twice as large and durable."
    };

    const genevieveBoostDescriptions: { [key: string]: string } = language === 'ko' ? {
        flashback: "시간을 4시간 전으로 되돌릴 수 있습니다. 마력 흡수 속도가 빨라집니다.",
        sustaining_bond: "당신이 탈진하는 시간이 줄어듭니다.",
        tree_of_life: "부활 가능한 시간이 죽은 지 하루 이내로 늘어납니다.",
        the_reinmans_curse: "노화 속도가 100배 더 빨라집니다."
    } : {
        flashback: "Reverts 4 hours. Drains faster.",
        sustaining_bond: "Exhaustion lasts less time.",
        tree_of_life: "Can resurrect within a day.",
        the_reinmans_curse: "Ages 100x faster."
    };

    const isEleanorsBoostDisabled = !ctx.isEleanorsTechniquesBoosted && ctx.availableSigilCounts.kaarn <= 0;
    const isGenevievesBoostDisabled = !ctx.isGenevievesTechniquesBoosted && ctx.availableSigilCounts.purth <= 0;

    const isMagicianSelected = selectedTrueSelfTraits.has('magician');
    const additionalCost = Math.floor(worldlyWisdomSigilTreeCost * 0.25);
    
    // Worldly Wisdom has no Lekolu sigils, so additionalFpCost is 0.
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
                        const isOverridden = worldlyWisdomEngraving !== null;
                        const isWeapon = engraving.id === 'weapon';

                        return (
                             <div key={engraving.id} className="relative">
                                <button
                                    onClick={() => handleWorldlyWisdomEngravingSelect(engraving.id)}
                                    className={`w-full p-4 rounded-lg border-2 transition-colors flex flex-col items-center justify-center h-full text-center
                                        ${isSelected 
                                            ? (isOverridden ? 'border-purple-400 bg-purple-900/40' : 'border-purple-600/50 bg-purple-900/20') 
                                            : 'border-gray-700 bg-black/30 hover:border-purple-400/50'}
                                    `}
                                >
                                    <span className="font-cinzel tracking-wider uppercase">{engraving.title}</span>
                                    {isWeapon && isSelected && worldlyWisdomWeaponName && (
                                        <p className="text-xs text-purple-300 mt-2 truncate">({worldlyWisdomWeaponName})</p>
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
                            onClick={handleToggleWorldlyWisdomMagician}
                            className={`px-6 py-3 text-sm rounded-lg border transition-colors ${
                                isWorldlyWisdomMagicianApplied
                                    ? 'bg-purple-800/60 border-purple-500 text-white'
                                    : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:border-purple-500/70'
                            }`}
                        >
                             {isWorldlyWisdomMagicianApplied
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
                        handleWorldlyWisdomWeaponAssign(weaponName);
                        setIsWeaponModalOpen(false);
                    }}
                    currentWeaponName={worldlyWisdomWeaponName}
                />
            )}

            <div className="my-16 bg-black/20 p-8 rounded-lg border border-gray-800 overflow-x-auto">
                <SectionHeader>{language === 'ko' ? "표식 트리" : "SIGIL TREE"}</SectionHeader>
                <div className="flex items-center min-w-max pb-8 px-4 justify-center">
                    
                    {/* Column 1: Root */}
                    <div className="flex flex-col justify-center h-[28rem]">
                        {renderSigilNode('arborealist')}
                    </div>

                    {/* SVG Connector 1 (Split) */}
                    <svg className="w-16 h-[28rem] flex-shrink-0 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M 0 224 H 20" /> {/* Center Out */}
                        <path d="M 20 224 V 100 H 64" /> {/* Branch Top (Sanctified) */}
                        <path d="M 20 224 V 348 H 64" /> {/* Branch Bottom (Healer) */}
                    </svg>

                    {/* Column 2 */}
                    <div className="flex flex-col justify-between h-[28rem]">
                        <div className="h-44 flex items-center justify-center">
                            {renderSigilNode('sanctified_i')}
                        </div>
                        <div className="h-44 flex items-center justify-center">
                            {renderSigilNode('healer_i')}
                        </div>
                    </div>

                    {/* SVG Connector 2 */}
                    <svg className="w-12 h-[28rem] flex-shrink-0 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M 0 348 H 48" /> {/* Healer I -> Healer II */}
                    </svg>

                    {/* Column 3 */}
                    <div className="flex flex-col justify-end h-[28rem]">
                        <div className="h-44 flex items-center justify-center">
                            {renderSigilNode('healer_ii')}
                        </div>
                    </div>

                    {/* SVG Connector 3 */}
                    <svg className="w-12 h-[28rem] flex-shrink-0 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M 0 348 H 20 V 100 H 48" /> {/* Healer II -> Sanctified II */}
                        <path d="M 0 348 H 48" /> {/* Healer II -> Healer III */}
                    </svg>

                    {/* Column 4 */}
                    <div className="flex flex-col justify-between h-[28rem]">
                        <div className="h-44 flex items-center justify-center">
                            {renderSigilNode('sanctified_ii')}
                        </div>
                        <div className="h-44 flex items-center justify-center">
                            {renderSigilNode('healer_iii')}
                        </div>
                    </div>
                    
                    {/* SVG Connector 4 */}
                    <svg className="w-12 h-[28rem] flex-shrink-0 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2">
                         <path d="M 0 348 H 48" /> {/* Healer III -> Healer IV */}
                    </svg>

                    {/* Column 5 */}
                    <div className="flex flex-col justify-end h-[28rem]">
                        <div className="h-44 flex items-center justify-center">
                            {renderSigilNode('healer_iv')}
                        </div>
                    </div>
                    
                    {/* SVG Connector 5 */}
                    <svg className="w-12 h-[28rem] flex-shrink-0 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M 0 348 H 20 V 100 H 48" /> {/* Healer IV -> Dark Art */}
                        <path d="M 0 348 H 48" /> {/* Healer IV -> Sanctified III */}
                    </svg>

                    {/* Column 6 */}
                    <div className="flex flex-col justify-between h-[28rem]">
                        <div className="h-44 flex items-center justify-center">
                            {renderSigilNode('dark_art')}
                        </div>
                        <div className="h-44 flex items-center justify-center">
                            {renderSigilNode('sanctified_iii')}
                        </div>
                    </div>

                </div>
            </div>

            <div className="mt-16 px-4 lg:px-8">
                <SectionHeader>{language === 'ko' ? "엘레노어의 기술" : "Eleanor's Techniques"}</SectionHeader>
                <div className={`my-4 max-w-sm mx-auto p-4 border rounded-lg transition-all bg-black/20 ${ ctx.isEleanorsTechniquesBoosted ? 'border-amber-400 ring-2 ring-amber-400/50 cursor-pointer hover:border-amber-300' : isEleanorsBoostDisabled ? 'border-gray-700 opacity-50 cursor-not-allowed' : 'border-gray-700 hover:border-amber-400/50 cursor-pointer'}`} onClick={!isEleanorsBoostDisabled ? () => ctx.handleWorldlyWisdomBoostToggle('eleanorsTechniques') : undefined}>
                    <div className="flex items-center justify-center gap-4">
                        <img src="/images/zTm8fcLb-kaarn.png" alt="Kaarn Sigil" className="w-16 h-16"/>
                        <div className="text-left">
                            <h4 className="font-cinzel text-lg font-bold text-amber-300 tracking-widest">{ctx.isEleanorsTechniquesBoosted ? 'BOOSTED' : 'BOOST'}</h4>
                            {!ctx.isEleanorsTechniquesBoosted && <p className="text-xs text-gray-400 mt-1">
                                {language === 'ko' ? "활성화 시 카른 표식 1개 소모" : "Activating this will consume one Kaarn sigil."}
                            </p>}
                        </div>
                    </div>
                </div>
                <SectionSubHeader>
                    {language === 'ko' ? `선택 가능: ${ctx.availableEleanorsPicks - ctx.selectedEleanorsTechniques.size} / ${ctx.availableEleanorsPicks}` : `Picks Available: ${ctx.availableEleanorsPicks - ctx.selectedEleanorsTechniques.size} / ${ctx.availableEleanorsPicks}`}
                </SectionSubHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" style={staticScaleStyle}>
                    {activeEleanors.map(power => {
                        const boostedText = ctx.isEleanorsTechniquesBoosted && eleanorBoostDescriptions[power.id];
                        
                        return (
                            <PowerCard 
                                key={power.id} 
                                power={{...power, cost: ''}} 
                                isSelected={ctx.selectedEleanorsTechniques.has(power.id)} 
                                onToggle={ctx.handleEleanorsTechniqueSelect} 
                                isDisabled={isWorldlyWisdomPowerDisabled(power, 'eleanorsTechniques')}
                                fontSize={fontSize}
                            >
                                {boostedText && <BoostedEffectBox text={boostedText} />}
                            </PowerCard>
                        )
                    })}
                </div>
            </div>

            <div className="mt-16 px-4 lg:px-8">
                <SectionHeader>{language === 'ko' ? "제네비브의 기술" : "Genevieve's Techniques"}</SectionHeader>
                <div className={`my-4 max-w-sm mx-auto p-4 border rounded-lg transition-all bg-black/20 ${ ctx.isGenevievesTechniquesBoosted ? 'border-amber-400 ring-2 ring-amber-400/50 cursor-pointer hover:border-amber-300' : isGenevievesBoostDisabled ? 'border-gray-700 opacity-50 cursor-not-allowed' : 'border-gray-700 hover:border-amber-400/50 cursor-pointer'}`} onClick={!isGenevievesBoostDisabled ? () => ctx.handleWorldlyWisdomBoostToggle('genevievesTechniques') : undefined}>
                    <div className="flex items-center justify-center gap-4">
                        <img src="/images/Dg6nz0R1-purth.png" alt="Purth Sigil" className="w-16 h-16"/>
                        <div className="text-left">
                            <h4 className="font-cinzel text-lg font-bold text-amber-300 tracking-widest">{ctx.isGenevievesTechniquesBoosted ? 'BOOSTED' : 'BOOST'}</h4>
                            {!ctx.isGenevievesTechniquesBoosted && <p className="text-xs text-gray-400 mt-1">
                                {language === 'ko' ? "활성화 시 퍼르스 표식 1개 소모" : "Activating this will consume one Purth sigil."}
                            </p>}
                        </div>
                    </div>
                </div>
                <SectionSubHeader>
                    {language === 'ko' ? `선택 가능: ${ctx.availableGenevievesPicks - ctx.selectedGenevievesTechniques.size} / ${ctx.availableGenevievesPicks}` : `Picks Available: ${ctx.availableGenevievesPicks - ctx.selectedGenevievesTechniques.size} / ${ctx.availableGenevievesPicks}`}
                </SectionSubHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" style={staticScaleStyle}>
                    {activeGenevieves.map(power => {
                        const boostedText = ctx.isGenevievesTechniquesBoosted && genevieveBoostDescriptions[power.id];
                        
                        return (
                            <PowerCard 
                                key={power.id} 
                                power={{...power, cost: ''}} 
                                isSelected={ctx.selectedGenevievesTechniques.has(power.id)} 
                                onToggle={ctx.handleGenevievesTechniqueSelect} 
                                isDisabled={isWorldlyWisdomPowerDisabled(power, 'genevievesTechniques')}
                                fontSize={fontSize}
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
