
import React, { useState, useEffect } from 'react';
import { useCharacterContext } from '../../context/CharacterContext';
import { 
    GOOD_TIDINGS_DATA, GOOD_TIDINGS_DATA_KO,
    GOOD_TIDINGS_SIGIL_TREE_DATA, GOOD_TIDINGS_SIGIL_TREE_DATA_KO,
    ESSENTIAL_BOONS_DATA, ESSENTIAL_BOONS_DATA_KO,
    MINOR_BOONS_DATA, MINOR_BOONS_DATA_KO,
    MAJOR_BOONS_DATA, MAJOR_BOONS_DATA_KO,
    BLESSING_ENGRAVINGS 
} from '../../constants';
import type { GoodTidingsSigilTier, ChoiceItem, MagicGrade } from '../../types';
import { BlessingIntro, SectionHeader, SectionSubHeader, WeaponIcon, BoostedEffectBox, renderFormattedText } from '../ui';
import { WeaponSelectionModal } from '../WeaponSelectionModal';

const TierCard: React.FC<{
  tier: GoodTidingsSigilTier;
  isSelected: boolean;
  isDisabled: boolean;
  onSelect: (id: 'standard' | 'journeyman' | 'master') => void;
  requirementText: string;
  onToggleKp?: () => void;
  isKpPaid?: boolean;
}> = ({ tier, isSelected, isDisabled, onSelect, requirementText, onToggleKp, isKpPaid = false }) => {
    const color = tier.id === 'standard' ? 'gray' : tier.id === 'journeyman' ? 'green' : 'red';
    
    const colorClassMap = {
      red: { border: 'border-red-500', ring: 'ring-red-500', hover: 'hover:border-red-400/70', text: 'text-red-300' },
      green: { border: 'border-green-500', ring: 'ring-green-500', hover: 'hover:border-green-400/70', text: 'text-green-300' },
      gray: { border: 'border-gray-500', ring: 'ring-gray-500', hover: 'hover:border-gray-400/70', text: 'text-gray-300' },
    };
    
    const kpStyle = { border: 'border-pink-500', ring: 'ring-pink-500', hover: 'hover:border-pink-400', text: 'text-pink-300' };
    const currentColors = isKpPaid ? kpStyle : colorClassMap[color];

    const borderClass = isSelected 
        ? `border-2 ${currentColors.border} ring-2 ${currentColors.ring}` 
        : `border-gray-800 ${currentColors.hover}`;
    
    const interactionClass = isDisabled
        ? 'opacity-50 cursor-not-allowed'
        : 'cursor-pointer';

    const handleContextMenu = (e: React.MouseEvent) => {
        if (onToggleKp && isSelected) {
            e.preventDefault();
            e.stopPropagation();
            onToggleKp();
        }
    };

    return (
        <div 
          className={`relative flex-1 flex flex-col items-center p-6 bg-black/30 border rounded-lg transition-all ${borderClass} ${interactionClass}`}
          onClick={() => !isDisabled && onSelect(tier.id)}
          onContextMenu={handleContextMenu}
        >
            {isKpPaid && (
                <div className="absolute top-2 right-2 bg-pink-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm z-10">
                    KP
                </div>
            )}
            <img src={tier.imageSrc} alt={tier.title} className="w-20 h-20 mb-4" />
            <h4 className={`font-cinzel text-xl font-bold tracking-wider ${currentColors.text}`}>{tier.title}</h4>
            <p className="text-sm text-gray-400 font-medium mt-2 text-center flex-grow">{tier.description}</p>
            <div className="border-t border-gray-700 w-full text-center mt-4 pt-4">
                <p className="font-semibold text-green-400">{tier.benefits}</p>
                <p className="text-xs text-purple-300/80 mt-1 italic">{requirementText}</p>
            </div>
        </div>
    );
};

const PowerCard: React.FC<{
    power: ChoiceItem;
    isSelected: boolean;
    isDisabled: boolean;
    onToggle: (id: string) => void;
    children?: React.ReactNode;
    fontSize?: 'regular' | 'large';
    isOnisBoosted?: boolean;
}> = ({ power, isSelected, isDisabled, onToggle, children, fontSize = 'regular', isOnisBoosted = false }) => {
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
        <div className={`${wrapperClass} relative`} onClick={() => !isDisabled && onToggle(power.id)}>
             {isOnisBoosted && isSelected && (
                <div className="absolute -top-2 -left-2 z-20" title="Boosted by Oni's Blessing">
                    <div className="relative w-8 h-8 flex items-center justify-center">
                        <div className="absolute inset-0 bg-red-600 rounded-full blur-[4px] opacity-60"></div>
                        <img src="https://cdn.jsdelivr.net/gh/theapple1234/saviapple_Seinarumagecraft_CYOA/public/images/4wHGP0W5-c1.webp" className="w-full h-full rounded-full border border-red-400 object-cover relative z-10" alt="Oni Icon" />
                    </div>
                </div>
            )}
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


export const GoodTidingsSection: React.FC = () => {
    const {
        selectedBlessingEngraving,
        selectedGoodTidingsTier, handleGoodTidingsTierSelect,
        selectedEssentialBoons, handleEssentialBoonSelect, availableEssentialBoonPicks,
        selectedMinorBoons, handleMinorBoonSelect, availableMinorBoonPicks,
        selectedMajorBoons, handleMajorBoonSelect, availableMajorBoonPicks,
        availableSigilCounts, handleGoodTidingsBoostToggle, isMinorBoonsBoosted, isMajorBoonsBoosted,
        isEssentialBoosted, isMinorBoosted, isMajorBoosted, // effective boosts
        selectedStarCrossedLovePacts,
        goodTidingsEngraving, handleGoodTidingsEngravingSelect,
        goodTidingsWeaponName, handleGoodTidingsWeaponAssign,
        selectedTrueSelfTraits,
        isGoodTidingsMagicianApplied,
        handleToggleGoodTidingsMagician,
        disableGoodTidingsMagician,
        goodTidingsSigilTreeCost,
        
        kpPaidNodes, toggleKpNode,
        fontSize,
        language
    } = useCharacterContext();

    const [isWeaponModalOpen, setIsWeaponModalOpen] = useState(false);
    const isOnisBlessingActive = selectedStarCrossedLovePacts.has('onis_blessing');

    const activeData = language === 'ko' ? GOOD_TIDINGS_DATA_KO : GOOD_TIDINGS_DATA;
    const activeTree = language === 'ko' ? GOOD_TIDINGS_SIGIL_TREE_DATA_KO : GOOD_TIDINGS_SIGIL_TREE_DATA;
    const activeEssential = language === 'ko' ? ESSENTIAL_BOONS_DATA_KO : ESSENTIAL_BOONS_DATA;
    const activeMinor = language === 'ko' ? MINOR_BOONS_DATA_KO : MINOR_BOONS_DATA;
    const activeMajor = language === 'ko' ? MAJOR_BOONS_DATA_KO : MAJOR_BOONS_DATA;

    const isEssentialBoonDisabled = (boon: ChoiceItem): boolean => {
        return !selectedGoodTidingsTier || (!selectedEssentialBoons.has(boon.id) && selectedEssentialBoons.size >= availableEssentialBoonPicks);
    };

    const isMinorBoonDisabled = (boon: ChoiceItem): boolean => {
        return !(selectedGoodTidingsTier === 'journeyman' || selectedGoodTidingsTier === 'master') || (!selectedMinorBoons.has(boon.id) && selectedMinorBoons.size >= availableMinorBoonPicks);
    };
    
    const isMajorBoonDisabled = (boon: ChoiceItem): boolean => {
        if (selectedGoodTidingsTier !== 'master') return true;
        if (!selectedMajorBoons.has(boon.id) && selectedMajorBoons.size >= availableMajorBoonPicks) return true;
        if (boon.requires && !selectedMinorBoons.has(Array.isArray(boon.requires) ? boon.requires[0] : boon.requires)) {
            return true;
        }
        return false;
    };
    
    const tierOrder: ('standard' | 'journeyman' | 'master')[] = ['standard', 'journeyman', 'master'];
    const selectedTierIndex = selectedGoodTidingsTier ? tierOrder.indexOf(selectedGoodTidingsTier) : -1;
    
    const isTierDisabled = (tierId: 'standard' | 'journeyman' | 'master'): boolean => {
        const tierIndex = tierOrder.indexOf(tierId);

        if (tierIndex > selectedTierIndex) {
            if (tierIndex !== selectedTierIndex + 1) {
                return true;
            }
            if (kpPaidNodes.has(tierId)) return false;
            if (tierId === 'standard' && availableSigilCounts.kaarn < 1) return true;
            if (tierId === 'journeyman' && availableSigilCounts.purth < 1) return true;
            if (tierId === 'master' && availableSigilCounts.xuth < 1) return true;
        }
        
        return false;
    };
    
    const tierRequirements = language === 'ko' ? {
        standard: "필요: 카른 1개",
        journeyman: "필요: 퍼르스 1개",
        master: "필요: 주스 1개",
    } : {
        standard: "Requires: 1 KAARN",
        journeyman: "Requires: 1 PURTH",
        master: "Requires: 1 XUTH",
    };
    
    const handleKpToggle = (tierId: 'standard' | 'journeyman' | 'master') => {
        let type = 'kaarn';
        if (tierId === 'journeyman') type = 'purth';
        if (tierId === 'master') type = 'xuth';
        toggleKpNode(tierId, type);
    };

    const purthBoostDescriptions: { [key: string]: string } = language === 'ko' ? {
      quick_twitch: "완전히 즉각적인 반응 속도를 갖습니다.",
      incredible_will: "일시적으로 모든 통각을 차단할 수 있습니다.",
      sensory_master: "모든 감각의 범위와 민감도가 두 배가 됩니다.",
      cowards_boon: "속도 증가량이 180%로 증가합니다..",
      charisma_plus: "타인의 모습을 보고 약점이나 순진함을 파악할 수 있습니다.",
      strength_plus: "일시적으로 힘을 2배 강화시킬 수 있습니다. 효과가 끝나면 탈진합니다.",
      speed_plus: "최고 속도가 800km/h로 증가합니다.",
      smarts_plus: "일시적으로 모든 정신적 간섭을 뿌리칠 수 있습니다. 효과가 끝나면 탈진합니다."
    } : {
      quick_twitch: "Reaction time is now truly instant.",
      incredible_will: "Can temporarily shut off all pain receptors.",
      sensory_master: "Range and acuity of senses are doubled.",
      cowards_boon: "Boosted 180% instead of 150%.",
      charisma_plus: "You can tell a person’s vulnerabilities and level of gullibility just by looking at them.",
      strength_plus: "Can unleash bursts of strength that double your abilities, at the price of exhaustion.",
      speed_plus: "Speed cap of 500 instead of 400.",
      smarts_plus: "Can become temporarily immune to all psychic influence, at the price of exhaustion."
    };

    const xuthBoostDescriptions: { [key: string]: string } = language === 'ko' ? {
        hokuto_senjukai_ken: "주먹을 지르면 주먹 끝에서 파괴적인 폭발이 발생합니다.",
        dont_blink: "이제 초신속으로 공격할 때 자신의 신체에 상해를 입지 않습니다. 다만 공격의 세기는 통상 공격과 다르지 않고, 신체에 엄청난 부담을 줍니다. 다른 물체와 맞닿지 않는 한 탈진하지 않고 계속해서 달릴 수 있습니다.",
        superpowered_mind: "당신에게 필적하는 지능을 갖는 존재라 해도 당신의 정신에 간섭할 수 없습니다."
    } : {
        hokuto_senjukai_ken: "Can punch hard enough to create devastating explosions at the end of your fists.",
        dont_blink: "Can attack while in super speed without self-harm, although these attacks won't do any more than regular damage and will be extremely exhausting. Can run without exhaustion as long as you aren't interacting with anything.",
        superpowered_mind: "Immune to psychic influence even by others with the same level of intellect."
    };

    // Manual toggle disabled if active via Oni
    const isMinorBoostDisabled = (!isMinorBoonsBoosted && availableSigilCounts.purth <= 0) || isOnisBlessingActive;
    const isMajorBoostDisabled = (!isMajorBoonsBoosted && availableSigilCounts.xuth <= 0) || isOnisBlessingActive;

    const isMagicianSelected = selectedTrueSelfTraits.has('magician');
    const finalEngraving = goodTidingsEngraving ?? (selectedBlessingEngraving === 'weapon' ? null : selectedBlessingEngraving);
    const isSkinEngraved = finalEngraving === 'skin';
    const additionalCost = Math.floor(goodTidingsSigilTreeCost * 0.25);
    
    // Good Tidings has no Lekolu sigils, so additionalFpCost is 0.
    const costText = language === 'ko'
        ? `(축복 점수 -${additionalCost})`
        : `(-${additionalCost} BP)`;

    useEffect(() => {
        if (!isSkinEngraved && isGoodTidingsMagicianApplied) {
            disableGoodTidingsMagician();
        }
    }, [isSkinEngraved, isGoodTidingsMagicianApplied, disableGoodTidingsMagician]);

    const staticScaleStyle: React.CSSProperties = fontSize === 'large' ? { zoom: 0.83333 } : {};

    return (
        <section>
            <BlessingIntro {...activeData} />

            <div className="mt-8 mb-16 max-w-3xl mx-auto">
                <h4 className="font-cinzel text-xl text-center tracking-widest my-6 text-purple-300 uppercase">
                    {language === 'ko' ? "축복 각인" : "Engrave this Blessing"}
                </h4>
                <div className="grid grid-cols-3 gap-4">
                    {BLESSING_ENGRAVINGS.map(engraving => {
                        const isSelected = finalEngraving === engraving.id;
                        const isOverridden = goodTidingsEngraving !== null;
                        const isWeapon = engraving.id === 'weapon';
                        const isRestricted = isWeapon;

                        return (
                             <div key={engraving.id} className="relative">
                                <button
                                    onClick={() => !isRestricted && handleGoodTidingsEngravingSelect(engraving.id)}
                                    disabled={isRestricted}
                                    className={`w-full p-4 rounded-lg border-2 transition-colors flex flex-col items-center justify-center h-full text-center
                                        ${isSelected 
                                            ? (isOverridden ? 'border-purple-400 bg-purple-900/40' : 'border-purple-600/50 bg-purple-900/20') 
                                            : isRestricted 
                                                ? 'border-gray-800/50 bg-black/10 opacity-40 cursor-not-allowed grayscale' 
                                                : 'border-gray-700 bg-black/30 hover:border-purple-400/50'}
                                    `}
                                >
                                    <span className="font-cinzel tracking-wider uppercase">
                                        {language === 'ko' && engraving.id === 'skin' ? "피부" : 
                                         language === 'ko' && engraving.id === 'clothes' ? "의복" : 
                                         language === 'ko' && engraving.id === 'weapon' ? "무기" : engraving.title}
                                    </span>
                                    {isWeapon && isSelected && goodTidingsWeaponName && (
                                        <p className="text-xs text-purple-300 mt-2 truncate">({goodTidingsWeaponName})</p>
                                    )}
                                    {isRestricted && <span className="text-[10px] text-red-500 mt-1 uppercase font-bold tracking-tighter">{language === 'ko' ? "제한됨" : "Restricted"}</span>}
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
                            onClick={handleToggleGoodTidingsMagician}
                            className={`px-6 py-3 text-sm rounded-lg border transition-colors ${
                                isGoodTidingsMagicianApplied
                                    ? 'bg-purple-800/60 border-purple-500 text-white'
                                    : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:border-purple-500/70'
                            }`}
                        >
                             {isGoodTidingsMagicianApplied
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
                        handleGoodTidingsWeaponAssign(weaponName);
                        setIsWeaponModalOpen(false);
                    }}
                    currentWeaponName={goodTidingsWeaponName}
                />
            )}

            <div className="my-16 bg-black/20 p-8 rounded-lg border border-gray-800">
                <SectionHeader>{language === 'ko' ? "표식 트리" : "SIGIL TREE"}</SectionHeader>
                <div className="flex flex-col md:flex-row items-stretch justify-center gap-8 max-w-5xl mx-auto">
                    {activeTree.map((tier, index) => (
                        <React.Fragment key={tier.id}>
                            <TierCard 
                                tier={tier}
                                isSelected={selectedTierIndex >= index}
                                isDisabled={isTierDisabled(tier.id)}
                                onSelect={handleGoodTidingsTierSelect}
                                requirementText={tierRequirements[tier.id]}
                                onToggleKp={() => handleKpToggle(tier.id)}
                                isKpPaid={kpPaidNodes.has(tier.id)}
                            />
                            {index < activeTree.length - 1 && (
                                <div className="hidden md:flex items-center justify-center">
                                    <div className="h-px w-16 bg-gray-600"></div>
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            <div className="mt-16 px-4 lg:px-8">
                <SectionHeader>{language === 'ko' ? "필수 혜택" : "ESSENTIAL BOONS"}</SectionHeader>
                <SectionSubHeader>
                    {language === 'ko' ? `선택 가능: ${availableEssentialBoonPicks - selectedEssentialBoons.size} / ${availableEssentialBoonPicks}` : `Picks Available: ${availableEssentialBoonPicks - selectedEssentialBoons.size} / ${availableEssentialBoonPicks}`}
                </SectionSubHeader>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto" style={staticScaleStyle}>
                    {activeEssential.map(boon => (
                        <PowerCard 
                            key={boon.id} 
                            power={{...boon, cost: ''}} 
                            isSelected={selectedEssentialBoons.has(boon.id)} 
                            onToggle={handleEssentialBoonSelect}
                            isDisabled={isEssentialBoonDisabled(boon)}
                            fontSize={fontSize}
                            isOnisBoosted={isOnisBlessingActive}
                        />
                    ))}
                </div>
            </div>

            <div className="mt-16 px-4 lg:px-8">
                <SectionHeader>{language === 'ko' ? "하위 혜택" : "MINOR BOONS"}</SectionHeader>
                <div 
                    className={`my-4 max-w-sm mx-auto p-4 border rounded-lg transition-all bg-black/20 ${
                        isMinorBoosted
                        ? 'border-amber-400 ring-2 ring-amber-400/50 cursor-pointer hover:border-amber-300'
                        : isMinorBoostDisabled 
                            ? 'border-gray-700 opacity-50 cursor-not-allowed'
                            : 'border-gray-700 hover:border-amber-400/50 cursor-pointer'
                    }`}
                    onClick={!isMinorBoostDisabled ? () => handleGoodTidingsBoostToggle('minorBoons') : undefined}
                    role="button"
                    tabIndex={isMinorBoostDisabled ? -1 : 0}
                    aria-pressed={isMinorBoosted}
                    aria-disabled={isMinorBoostDisabled}
                >
                    <div className="flex items-center justify-center gap-4">
                         {isOnisBlessingActive ? (
                            <img src="https://cdn.jsdelivr.net/gh/theapple1234/saviapple_Seinarumagecraft_CYOA/public/images/4wHGP0W5-c1.webp" alt="Oni Blessing" className="w-16 h-16 rounded-full border border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)] object-cover"/>
                        ) : (
                            <img src="https://cdn.jsdelivr.net/gh/theapple1234/saviapple_Seinarumagecraft_CYOA/public/images/Dg6nz0R1-purth.webp" alt="Purth Sigil" className="w-16 h-16"/>
                        )}
                        <div className="text-left">
                            <h4 className="font-cinzel text-lg font-bold text-amber-300 tracking-widest">
                                {isMinorBoosted ? 'BOOSTED' : 'BOOST'}
                            </h4>
                            {isOnisBlessingActive ? (
                                <p className="text-[10px] text-red-400 mt-1 uppercase font-bold tracking-widest animate-pulse">Oni's Blessing Protocol</p>
                            ) : (
                                !isMinorBoosted && <p className="text-xs text-gray-400 mt-1">
                                    {language === 'ko' ? "활성화 시 퍼르스 표식 1개 소모" : "Activating this will consume one Purth sigil."}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
                <SectionSubHeader>
                    {language === 'ko' ? `선택 가능: ${availableMinorBoonPicks - selectedMinorBoons.size} / ${availableMinorBoonPicks}` : `Picks Available: ${availableMinorBoonPicks - selectedMinorBoons.size} / ${availableMinorBoonPicks}`}
                </SectionSubHeader>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" style={staticScaleStyle}>
                    {activeMinor.map(boon => {
                        const boostedText = isMinorBoosted && purthBoostDescriptions[boon.id];
                        
                        return (
                            <PowerCard 
                                key={boon.id} 
                                power={{...boon, cost: ''}} 
                                isSelected={selectedMinorBoons.has(boon.id)} 
                                onToggle={handleMinorBoonSelect}
                                isDisabled={isMinorBoonDisabled(boon)}
                                fontSize={fontSize}
                                isOnisBoosted={isOnisBlessingActive}
                            >
                                {boostedText && <BoostedEffectBox text={boostedText} />}
                            </PowerCard>
                        )
                    })}
                </div>
            </div>
            
            <div className="mt-16 px-4 lg:px-8">
                <SectionHeader>{language === 'ko' ? "상위 혜택" : "MAJOR BOONS"}</SectionHeader>
                 <div 
                    className={`my-4 max-w-sm mx-auto p-4 border rounded-lg transition-all bg-black/20 ${
                        isMajorBoosted
                        ? 'border-amber-400 ring-2 ring-amber-400/50 cursor-pointer hover:border-amber-300'
                        : isMajorBoostDisabled 
                            ? 'border-gray-700 opacity-50 cursor-not-allowed'
                            : 'border-gray-700 hover:border-amber-400/50 cursor-pointer'
                    }`}
                    onClick={!isMajorBoostDisabled ? () => handleGoodTidingsBoostToggle('majorBoons') : undefined}
                    role="button"
                    tabIndex={isMajorBoostDisabled ? -1 : 0}
                    aria-pressed={isMajorBoosted}
                    aria-disabled={isMajorBoostDisabled}
                >
                    <div className="flex items-center justify-center gap-4">
                        {isOnisBlessingActive ? (
                            <img src="https://cdn.jsdelivr.net/gh/theapple1234/saviapple_Seinarumagecraft_CYOA/public/images/4wHGP0W5-c1.webp" alt="Oni Blessing" className="w-16 h-16 rounded-full border border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)] object-cover"/>
                        ) : (
                            <img src="https://cdn.jsdelivr.net/gh/theapple1234/saviapple_Seinarumagecraft_CYOA/public/images/rfs5FtF3-xuth.webp" alt="Xuth Sigil" className="w-16 h-16"/>
                        )}
                        <div className="text-left">
                            <h4 className="font-cinzel text-lg font-bold text-amber-300 tracking-widest">
                                {isMajorBoosted ? 'BOOSTED' : 'BOOST'}
                            </h4>
                            {isOnisBlessingActive ? (
                                <p className="text-[10px] text-red-400 mt-1 uppercase font-bold tracking-widest animate-pulse">Oni's Blessing Protocol</p>
                            ) : (
                                !isMajorBoosted && <p className="text-xs text-gray-400 mt-1">
                                    {language === 'ko' ? "활성화 시 주스 표식 1개 소모" : "Activating this will consume one Xuth sigil."}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
                <SectionSubHeader>
                    {language === 'ko' ? `선택 가능: ${availableMajorBoonPicks - selectedMajorBoons.size} / ${availableMajorBoonPicks}` : `Picks Available: ${availableMajorBoonPicks - selectedMajorBoons.size} / ${availableMajorBoonPicks}`}
                </SectionSubHeader>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto" style={staticScaleStyle}>
                    {activeMajor.map(boon => {
                        const boostedText = isMajorBoosted && xuthBoostDescriptions[boon.id];
                        
                        // We use MINOR_BOONS_DATA for lookups for English requirement string generation.
                        // For Korean, we handle localized requirement text in the data directly if possible, or assume generic.
                        // Here, we dynamically find the required boon name.
                        let reqText = '';
                        if (boon.requires) {
                             const reqId = boon.requires; // Assuming single string for Major Boons per data
                             // Get title from active data
                             const activeReqBoon = activeMinor.find(b => b.id === reqId);
                             
                             if (activeReqBoon) {
                                 reqText = language === 'ko' ? `필요: ${activeReqBoon.title}` : `Requires: ${activeReqBoon.title}`;
                             }
                        }

                        return (
                            <PowerCard 
                                key={boon.id} 
                                power={{...boon, cost: reqText}} 
                                isSelected={selectedMajorBoons.has(boon.id)} 
                                onToggle={handleMajorBoonSelect}
                                isDisabled={isMajorBoonDisabled(boon)}
                                fontSize={fontSize}
                                isOnisBoosted={isOnisBlessingActive}
                            >
                                {boostedText && <BoostedEffectBox text={boostedText} />}
                            </PowerCard>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
