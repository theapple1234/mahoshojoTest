
import React, { useState, useEffect } from 'react';
import { useCharacterContext } from '../../context/CharacterContext';
import { 
    FIDELIA_DATA, FIDELIA_DATA_KO, 
    LOST_HOPE_DATA, LOST_HOPE_DATA_KO, 
    LOST_HOPE_SIGIL_TREE_DATA, LOST_HOPE_SIGIL_TREE_DATA_KO, 
    CHANNELLING_DATA, CHANNELLING_DATA_KO, 
    NECROMANCY_DATA, NECROMANCY_DATA_KO, 
    BLACK_MAGIC_DATA, BLACK_MAGIC_DATA_KO, 
    BLESSING_ENGRAVINGS, BLESSING_ENGRAVINGS_KO
} from '../../constants';
import type { LostHopePower, LostHopeSigil, ChoiceItem, MagicGrade } from '../../types';
import { BlessingIntro, SectionHeader, SectionSubHeader, WeaponIcon, CompanionIcon, BookIcon, BoostedEffectBox, renderFormattedText } from '../ui';
import { CompellingWillSigilCard, SigilColor } from '../CompellingWillSigilCard';
import { WeaponSelectionModal } from '../WeaponSelectionModal';
import { CompanionSelectionModal } from '../SigilTreeOptionCard';
import { BeastSelectionModal } from '../BeastSelectionModal';
import { CurseEncyclopediaModal } from '../CurseEncyclopediaModal';


const sigilImageMap: {[key: string]: string} = { 
    'kaarn.webp': 'kaarn', 
    'purth.webp': 'purth', 
    'juathas.webp': 'juathas', 
    'xuth.webp': 'xuth', 
    'sinthru.webp': 'sinthru', 
    'lekolu.webp': 'lekolu' 
};
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
    
    const descriptionClass = fontSize === 'large' ? 'text-base' : 'text-sm';

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

export const LostHopeSection: React.FC = () => {
    const ctx = useCharacterContext();
    const [isWeaponModalOpen, setIsWeaponModalOpen] = useState(false);
    const [isUndeadThrallModalOpen, setIsUndeadThrallModalOpen] = useState(false);
    const [isUndeadBeastModalOpen, setIsUndeadBeastModalOpen] = useState(false);
    const [isEncyclopediaOpen, setIsEncyclopediaOpen] = useState(false);

    const {
        selectedBlessingEngraving,
        lostHopeEngraving,
        handleLostHopeEngravingSelect,
        lostHopeWeaponName,
        handleLostHopeWeaponAssign,
        selectedTrueSelfTraits,
        isLostHopeMagicianApplied,
        handleToggleLostHopeMagician,
        disableLostHopeMagician,
        lostHopeSigilTreeCost,
        undeadThrallCompanionName,
        handleUndeadThrallCompanionAssign,
        undeadBeastName,
        handleUndeadBeastAssign,
        kpPaidNodes, toggleKpNode,
        fontSize,
        language
    } = useCharacterContext();

    const activeFidelia = language === 'ko' ? FIDELIA_DATA_KO : FIDELIA_DATA;
    const activeLostHope = language === 'ko' ? LOST_HOPE_DATA_KO : LOST_HOPE_DATA;
    const activeTree = language === 'ko' ? LOST_HOPE_SIGIL_TREE_DATA_KO : LOST_HOPE_SIGIL_TREE_DATA;
    const activeChannelling = language === 'ko' ? CHANNELLING_DATA_KO : CHANNELLING_DATA;
    const activeNecromancy = language === 'ko' ? NECROMANCY_DATA_KO : NECROMANCY_DATA;
    const activeBlackMagic = language === 'ko' ? BLACK_MAGIC_DATA_KO : BLACK_MAGIC_DATA;
    const activeEngravings = language === 'ko' ? BLESSING_ENGRAVINGS_KO : BLESSING_ENGRAVINGS;

    const finalEngraving = lostHopeEngraving ?? selectedBlessingEngraving;
    const isSkinEngraved = finalEngraving === 'skin';

    useEffect(() => {
        if (!isSkinEngraved && isLostHopeMagicianApplied) {
            disableLostHopeMagician();
        }
    }, [isSkinEngraved, isLostHopeMagicianApplied, disableLostHopeMagician]);

    const isLostHopePowerDisabled = (power: LostHopePower, type: 'channelling' | 'necromancy' | 'blackMagic'): boolean => {
        const selectedSet = type === 'channelling' ? ctx.selectedChannelling : type === 'necromancy' ? ctx.selectedNecromancy : ctx.selectedBlackMagic;
        const availablePicks = type === 'channelling' ? ctx.availableChannellingPicks : type === 'necromancy' ? ctx.availableNecromancyPicks : ctx.availableBlackMagicPicks;

        if (!selectedSet.has(power.id) && selectedSet.size >= availablePicks) return true;
        if (power.requires) {
            const allSelected = new Set([...ctx.selectedChannelling, ...ctx.selectedNecromancy, ...ctx.selectedBlackMagic, ...ctx.selectedLostHopeSigils]);
            if (!power.requires.every(req => allSelected.has(req))) return true;
        }
        return false;
    };

    const isLostHopeSigilDisabled = (sigil: LostHopeSigil): boolean => {
        if (ctx.selectedLostHopeSigils.has(sigil.id)) return false; 
        if (!sigil.prerequisites.every(p => ctx.selectedLostHopeSigils.has(p))) return true;
        
        // KP check
        if (kpPaidNodes.has(String(sigil.id))) return false;

        const sigilType = getSigilTypeFromImage(sigil.imageSrc);
        const sigilCost = sigilType ? 1 : 0;
        if (sigilType && ctx.availableSigilCounts[sigilType as keyof typeof ctx.availableSigilCounts] < sigilCost) return true;

        return false;
    };

    const getLostHopeSigil = (id: string) => activeTree.find(s => s.id === id)!;
    
    const getSigilDisplayInfo = (sigil: LostHopeSigil): { color: SigilColor, benefits: React.ReactNode } => {
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
                {sigil.benefits.channeling ? <p className="text-orange-300">+ {sigil.benefits.channeling} {language === 'ko' ? "혼령술" : "Channelling"}</p> : null}
                {sigil.benefits.necromancy ? <p className="text-gray-300">+ {sigil.benefits.necromancy} {language === 'ko' ? "강령술" : "Necromancy"}</p> : null}
                {sigil.benefits.blackMagic ? <p className="text-purple-300">+ {sigil.benefits.blackMagic} {language === 'ko' ? "흑마법" : "Black Magic"}</p> : null}
            </>
        );
        return { color, benefits };
    };

    const handleKpToggle = (sigil: LostHopeSigil) => {
        const type = getSigilTypeFromImage(sigil.imageSrc);
        if (type) {
            toggleKpNode(String(sigil.id), type);
        }
    };

    const renderSigilNode = (id: string) => {
        const sigil = getLostHopeSigil(id);
        const { color, benefits } = getSigilDisplayInfo(sigil);
        
        // Custom scale for long titles
        const isForbiddenArts = id.startsWith('forbidden_arts');
        const titleClassName = isForbiddenArts ? 'text-[10px]' : 'text-sm';

        return (
            <CompellingWillSigilCard 
                sigil={sigil} 
                isSelected={ctx.selectedLostHopeSigils.has(id)} 
                isDisabled={isLostHopeSigilDisabled(sigil)} 
                onSelect={ctx.handleLostHopeSigilSelect} 
                benefitsContent={benefits} 
                color={color} 
                compact={true}
                onToggleKp={() => handleKpToggle(sigil)}
                isKpPaid={kpPaidNodes.has(String(id))}
                titleClassName={titleClassName}
            />
        );
    };

    const boostDescriptions: { [key: string]: string } = language === 'ko' ? {
        spirit_medium: "혼령들을 직접 현계시켜 당신을 돕게 할 수 있습니다.",
        fata_morgana_curse: "강력하고 사악한 사령들이 대상을 괴롭힙니다. 마녀들에게도 물리적인 피해를 줄 수 있습니다.",
        spectral_form: "모든 마녀들의 눈에 보이지 않게 됩니다.",
        life_drain: "흡수 속도가 두 배가 됩니다. 거머리들을 떼어내기 더 어려워집니다.",
        undead_beast: "동물 점수 10점이 추가로 주어집니다.",
        rise_from_your_graves: "능력의 범위가 두 배가 됩니다. 소환된 언데드의 힘과 체력이 두 배가 됩니다.",
        grasping_dead: "구체가 커지고, 빨라지고, 벗어나기 두 배 어려워집니다.",
        the_moon_samurai: "지불해야 하는 영혼이 절반이 됩니다. 사무라이들이 강화됩니다.",
        undead_thrall: "동료 점수 10점이 추가로 주어집니다.",
        vampirism: "훔쳐낸 마법의 지속 시간이 두 배 증가합니다. 힘을 얻기 위해 필요한 흡혈량이 줄어듭니다.",
        cursemakers_cookbook: "저주를 제거하는 것이 두 배 힘들어집니다.",
        flowers_of_blood: "이제 한 달에 한 번만 '물'을 주면 됩니다."
    } : {
        spirit_medium: "Can conjure spirits physically to manifest and aid you.",
        fata_morgana_curse: "Includes wraiths, particularly powerful and malevolent spirits capable of physically damaging even mages.",
        spectral_form: "Invisible to all mages.",
        life_drain: "Doubled rate. Leeches harder to remove.",
        undead_beast: "+10 Beast Points",
        rise_from_your_graves: "Doubled range and double strength and durability for undead.",
        grasping_dead: "Ball is larger, faster, and twice as difficult to escape from.",
        the_moon_samurai: "Halves the required souls and buffs the samurai.",
        undead_thrall: "+10 Companion Points",
        vampirism: "Doubles duration of stolen spells, strength gains require less blood.",
        cursemakers_cookbook: "Curses twice as difficult to remove.",
        flowers_of_blood: "Only need watered on a monthly basis."
    };

    const isChannellingBoostDisabled = !ctx.isChannellingBoosted && ctx.availableSigilCounts.kaarn <= 0;
    const isNecromancyBoostDisabled = !ctx.isNecromancyBoosted && ctx.availableSigilCounts.purth <= 0;
    
    const isSinthruBoostDisabled = ctx.blackMagicBoostSigil !== 'sinthru' && ctx.availableSigilCounts.sinthru <= 0;
    const isXuthBoostDisabled = ctx.blackMagicBoostSigil !== 'xuth' && ctx.availableSigilCounts.xuth <= 0;

    const isMagicianSelected = selectedTrueSelfTraits.has('magician');
    const additionalCost = Math.floor(lostHopeSigilTreeCost * 0.25);
    
    // Lost Hope has no Lekolu sigils, so additionalFpCost is 0.
    const costText = language === 'ko'
        ? `(축복 점수 -${additionalCost})`
        : `(-${additionalCost} BP)`;
    
    const isBlackMagicBoosted = ctx.blackMagicBoostSigil !== null;
    const undeadThrallPointLimit = isBlackMagicBoosted ? 60 : 50;
    const undeadBeastPointLimit = ctx.isNecromancyBoosted ? 70 : 60;

    // Style to counteract global zoom for specific sections
    // Global Large is 120%. 1 / 1.2 = 0.83333
    const staticScaleStyle: React.CSSProperties = fontSize === 'large' ? { zoom: 0.83333 } : {};

    return (
        <section>
            <BlessingIntro {...activeFidelia} />
            <BlessingIntro {...activeLostHope} reverse />
            
            <div className="mt-8 mb-16 max-w-3xl mx-auto">
                <h4 className="font-cinzel text-xl text-center tracking-widest my-6 text-purple-300 uppercase">
                    {language === 'ko' ? "축복 각인" : "Engrave this Blessing"}
                </h4>
                <div className="grid grid-cols-3 gap-4">
                    {activeEngravings.map(engraving => {
                        const isSelected = finalEngraving === engraving.id;
                        const isOverridden = lostHopeEngraving !== null;
                        const isWeapon = engraving.id === 'weapon';

                        return (
                             <div key={engraving.id} className="relative">
                                <button
                                    onClick={() => handleLostHopeEngravingSelect(engraving.id)}
                                    className={`w-full p-4 rounded-lg border-2 transition-colors flex flex-col items-center justify-center h-full text-center
                                        ${isSelected 
                                            ? (isOverridden ? 'border-purple-400 bg-purple-900/40' : 'border-purple-600/50 bg-purple-900/20') 
                                            : 'border-gray-700 bg-black/30 hover:border-purple-400/50'}
                                    `}
                                >
                                    <span className="font-cinzel tracking-wider uppercase">{engraving.title}</span>
                                    {isWeapon && isSelected && lostHopeWeaponName && (
                                        <p className="text-xs text-purple-300 mt-2 truncate">({lostHopeWeaponName})</p>
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
                            onClick={handleToggleLostHopeMagician}
                            className={`px-6 py-3 text-sm rounded-lg border transition-colors ${
                                isLostHopeMagicianApplied
                                    ? 'bg-purple-800/60 border-purple-500 text-white'
                                    : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:border-purple-500/70'
                            }`}
                        >
                            {isLostHopeMagicianApplied
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
                        handleLostHopeWeaponAssign(weaponName);
                        setIsWeaponModalOpen(false);
                    }}
                    currentWeaponName={lostHopeWeaponName}
                />
            )}

            <div className="my-16 bg-black/20 p-8 rounded-lg border border-gray-800 overflow-x-auto">
                <SectionHeader>{language === 'ko' ? "표식 트리" : "SIGIL TREE"}</SectionHeader>
                <div className="flex items-center min-w-max pb-8 px-4 justify-center">
                    
                    {/* Column 1: Root */}
                    <div className="flex flex-col justify-center h-[28rem]">
                        {renderSigilNode('young_witch')}
                    </div>

                    {/* SVG Connector 1 (Split) */}
                    <svg className="w-16 h-[28rem] flex-shrink-0 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M 0 224 H 20" /> {/* Center Out */}
                        <path d="M 20 224 V 100 H 64" /> {/* Branch Top (Spirit Channel) */}
                        <path d="M 20 224 V 348 H 64" /> {/* Branch Bottom (Deadseer) */}
                    </svg>

                    {/* Column 2 */}
                    <div className="flex flex-col justify-between h-[28rem]">
                        <div className="h-44 flex items-center justify-center">
                            {renderSigilNode('spirit_channel')}
                        </div>
                        <div className="h-44 flex items-center justify-center">
                            {renderSigilNode('deadseer')}
                        </div>
                    </div>

                    {/* SVG Connector 2 */}
                    <svg className="w-16 h-[28rem] flex-shrink-0 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M 0 100 H 64" /> {/* Spirit Channel -> Necromancer */}
                        <path d="M 0 348 H 64" /> {/* Deadseer -> Forbidden Arts I */}
                    </svg>

                    {/* Column 3 */}
                    <div className="flex flex-col justify-between h-[28rem]">
                        <div className="h-44 flex items-center justify-center">
                            {renderSigilNode('necromancer')}
                        </div>
                        <div className="h-44 flex items-center justify-center">
                            {renderSigilNode('forbidden_arts_i')}
                        </div>
                    </div>

                    {/* SVG Connector 3 */}
                    <svg className="w-16 h-[28rem] flex-shrink-0 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M 0 100 H 64" /> {/* Necromancer -> Lazarus */}
                        <path d="M 0 100 H 20 V 348 H 64" /> {/* Necromancer -> Forbidden Arts II */}
                    </svg>

                    {/* Column 4 */}
                    <div className="flex flex-col justify-between h-[28rem]">
                        <div className="h-44 flex items-center justify-center">
                            {renderSigilNode('lazarus')}
                        </div>
                        <div className="h-44 flex items-center justify-center">
                            {renderSigilNode('forbidden_arts_ii')}
                        </div>
                    </div>

                    {/* SVG Connector 4 */}
                    <svg className="w-16 h-[28rem] flex-shrink-0 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M 0 100 H 64" /> {/* Lazarus -> Forbidden Arts III */}
                        <path d="M 0 100 H 40 V 348 H 64" /> {/* Lazarus -> Lich Queen */}
                    </svg>

                    {/* Column 5 */}
                    <div className="flex flex-col justify-between h-[28rem] relative">
                        <div className="h-44 flex items-center justify-center">
                            {renderSigilNode('forbidden_arts_iii')}
                        </div>
                        
                        <div className="h-44 flex items-center justify-center">
                            {renderSigilNode('lich_queen')}
                        </div>
                    </div>

                </div>
            </div>

            <div className="mt-16">
                <SectionHeader>{language === 'ko' ? "혼령술" : "Channelling"}</SectionHeader>
                <div className={`my-4 max-w-sm mx-auto p-4 border rounded-lg transition-all bg-black/20 ${ ctx.isChannellingBoosted ? 'border-amber-400 ring-2 ring-amber-400/50 cursor-pointer hover:border-amber-300' : isChannellingBoostDisabled ? 'border-gray-700 opacity-50 cursor-not-allowed' : 'border-gray-700 hover:border-amber-400/50 cursor-pointer'}`} onClick={!isChannellingBoostDisabled ? () => ctx.handleLostHopeBoostToggle('channelling') : undefined}>
                    <div className="flex items-center justify-center gap-4">
                        <img src="https://cdn.jsdelivr.net/gh/theapple1234/saviapple_Seinarumagecraft_CYOA/public/images/zTm8fcLb-kaarn.webp" alt="Kaarn Sigil" className="w-16 h-16"/>
                        <div className="text-left">
                            <h4 className="font-cinzel text-lg font-bold text-amber-300 tracking-widest">{ctx.isChannellingBoosted ? 'BOOSTED' : 'BOOST'}</h4>
                            {!ctx.isChannellingBoosted && <p className="text-xs text-gray-400 mt-1">
                                {language === 'ko' ? "활성화 시 카른 표식 1개 소모" : "Activating this will consume one Kaarn sigil."}
                            </p>}
                        </div>
                    </div>
                </div>
                <SectionSubHeader>
                    {language === 'ko' ? `선택 가능: ${ctx.availableChannellingPicks - ctx.selectedChannelling.size} / ${ctx.availableChannellingPicks}` : `Picks Available: ${ctx.availableChannellingPicks - ctx.selectedChannelling.size} / ${ctx.availableChannellingPicks}`}
                </SectionSubHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" style={staticScaleStyle}>
                    {activeChannelling.map(power => {
                        const boostedText = ctx.isChannellingBoosted && boostDescriptions[power.id];
                        
                        return (
                            <PowerCard 
                                key={power.id} 
                                power={{...power, cost: ''}} 
                                isSelected={ctx.selectedChannelling.has(power.id)} 
                                onToggle={ctx.handleChannellingSelect} 
                                isDisabled={isLostHopePowerDisabled(power, 'channelling')}
                                fontSize={fontSize}
                            >
                                {boostedText && <BoostedEffectBox text={boostedText} />}
                            </PowerCard>
                        )
                    })}
                </div>
            </div>

            <div className="mt-16">
                <SectionHeader>{language === 'ko' ? "강령술" : "Necromancy"}</SectionHeader>
                <div className={`my-4 max-w-sm mx-auto p-4 border rounded-lg transition-all bg-black/20 ${ ctx.isNecromancyBoosted ? 'border-amber-400 ring-2 ring-amber-400/50 cursor-pointer hover:border-amber-300' : isNecromancyBoostDisabled ? 'border-gray-700 opacity-50 cursor-not-allowed' : 'border-gray-700 hover:border-amber-400/50 cursor-pointer'}`} onClick={!isNecromancyBoostDisabled ? () => ctx.handleLostHopeBoostToggle('necromancy') : undefined}>
                    <div className="flex items-center justify-center gap-4">
                        <img src="https://cdn.jsdelivr.net/gh/theapple1234/saviapple_Seinarumagecraft_CYOA/public/images/Dg6nz0R1-purth.webp" alt="Purth Sigil" className="w-16 h-16"/>
                        <div className="text-left">
                            <h4 className="font-cinzel text-lg font-bold text-amber-300 tracking-widest">{ctx.isNecromancyBoosted ? 'BOOSTED' : 'BOOST'}</h4>
                            {!ctx.isNecromancyBoosted && <p className="text-xs text-gray-400 mt-1">
                                {language === 'ko' ? "활성화 시 퍼르스 표식 1개 소모" : "Activating this will consume one Purth sigil."}
                            </p>}
                        </div>
                    </div>
                </div>
                <SectionSubHeader>
                    {language === 'ko' ? `선택 가능: ${ctx.availableNecromancyPicks - ctx.selectedNecromancy.size} / ${ctx.availableNecromancyPicks}` : `Picks Available: ${ctx.availableNecromancyPicks - ctx.selectedNecromancy.size} / ${ctx.availableNecromancyPicks}`}
                </SectionSubHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" style={staticScaleStyle}>
                    {activeNecromancy.map(power => {
                        const boostedText = ctx.isNecromancyBoosted && boostDescriptions[power.id];
                        const isUndeadBeast = power.id === 'undead_beast';
                        const isSelected = ctx.selectedNecromancy.has(power.id);

                        return (
                            <PowerCard 
                                key={power.id} 
                                power={{...power, cost: ''}} 
                                isSelected={isSelected} 
                                onToggle={ctx.handleNecromancySelect} 
                                isDisabled={isLostHopePowerDisabled(power, 'necromancy')}
                                iconButton={isUndeadBeast && isSelected ? <CompanionIcon /> : undefined}
                                onIconButtonClick={isUndeadBeast && isSelected ? () => setIsUndeadBeastModalOpen(true) : undefined}
                                fontSize={fontSize}
                            >
                                {boostedText && <BoostedEffectBox text={boostedText} />}
                                {isUndeadBeast && isSelected && undeadBeastName && (
                                    <div className="text-center mt-2 pt-2 border-t border-gray-700/50">
                                        <p className="text-xs text-gray-400">{language === 'ko' ? "할당된 야수:" : "Assigned Beast:"}</p>
                                        <p className="text-sm font-bold text-amber-300">{undeadBeastName}</p>
                                    </div>
                                )}
                            </PowerCard>
                        )
                    })}
                </div>
            </div>

            <div className="mt-16">
                <SectionHeader>{language === 'ko' ? "흑마법" : "Black Magic"}</SectionHeader>
                <div className="flex flex-col lg:flex-row items-center justify-center gap-6 my-6 max-w-4xl mx-auto">
                    {/* Sinthru Option */}
                    <div 
                        className={`flex-1 w-full p-4 border rounded-lg transition-all bg-black/20 ${ctx.blackMagicBoostSigil === 'sinthru' ? 'border-amber-400 ring-2 ring-amber-400/50 cursor-pointer hover:border-amber-300' : isSinthruBoostDisabled ? 'border-gray-700 opacity-50 cursor-not-allowed' : 'border-gray-700 hover:border-amber-400/50 cursor-pointer'}`}
                        onClick={() => {
                            if (!isSinthruBoostDisabled) {
                                ctx.handleLostHopeBoostToggle('blackMagic', 'sinthru');
                            }
                        }}
                    >
                        <div className="flex items-center justify-center gap-4">
                            <img src="https://cdn.jsdelivr.net/gh/theapple1234/saviapple_Seinarumagecraft_CYOA/public/images/nq80Y3pk-sinthru.webp" alt="Sinthru Sigil" className="w-16 h-16"/>
                            <div className="text-left">
                                <h4 className="font-cinzel text-lg font-bold text-amber-300 tracking-widest">{ctx.blackMagicBoostSigil === 'sinthru' ? 'BOOSTED' : 'BOOST'}</h4>
                                {!ctx.blackMagicBoostSigil && <p className="text-xs text-gray-400 mt-1">
                                    {language === 'ko' ? "활성화 시 신스루 표식 1개 소모" : "Activating this will consume one Sinthru sigil."}
                                </p>}
                                {ctx.blackMagicBoostSigil === 'xuth' && <p className="text-xs text-gray-400 mt-1">
                                    {language === 'ko' ? "신스루 표식 소모로 전환" : "Switch to consume Sinthru sigil."}
                                </p>}
                            </div>
                        </div>
                    </div>

                    <span className="font-cinzel text-gray-600 font-bold text-xl">OR</span>

                    {/* Xuth Option */}
                    <div 
                        className={`flex-1 w-full p-4 border rounded-lg transition-all bg-black/20 ${ctx.blackMagicBoostSigil === 'xuth' ? 'border-amber-400 ring-2 ring-amber-400/50 cursor-pointer hover:border-amber-300' : isXuthBoostDisabled ? 'border-gray-700 opacity-50 cursor-not-allowed' : 'border-gray-700 hover:border-amber-400/50 cursor-pointer'}`}
                        onClick={() => {
                            if (!isXuthBoostDisabled) {
                                ctx.handleLostHopeBoostToggle('blackMagic', 'xuth');
                            }
                        }}
                    >
                        <div className="flex items-center justify-center gap-4">
                            <img src="https://cdn.jsdelivr.net/gh/theapple1234/saviapple_Seinarumagecraft_CYOA/public/images/rfs5FtF3-xuth.webp" alt="Xuth Sigil" className="w-16 h-16"/>
                            <div className="text-left">
                                <h4 className="font-cinzel text-lg font-bold text-amber-300 tracking-widest">{ctx.blackMagicBoostSigil === 'xuth' ? 'BOOSTED' : 'BOOST'}</h4>
                                {!ctx.blackMagicBoostSigil && <p className="text-xs text-gray-400 mt-1">
                                    {language === 'ko' ? "활성화 시 주스 표식 1개 소모" : "Activating this will consume one Xuth sigil."}
                                </p>}
                                {ctx.blackMagicBoostSigil === 'sinthru' && <p className="text-xs text-gray-400 mt-1">
                                    {language === 'ko' ? "주스 표식 소모로 전환" : "Switch to consume Xuth sigil."}
                                </p>}
                            </div>
                        </div>
                    </div>
                </div>

                <SectionSubHeader>
                    {language === 'ko' ? `선택 가능: ${ctx.availableBlackMagicPicks - ctx.selectedBlackMagic.size} / ${ctx.availableBlackMagicPicks}` : `Picks Available: ${ctx.availableBlackMagicPicks - ctx.selectedBlackMagic.size} / ${ctx.availableBlackMagicPicks}`}
                </SectionSubHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" style={staticScaleStyle}>
                    {activeBlackMagic.map(power => {
                        const boostedText = ctx.blackMagicBoostSigil && boostDescriptions[power.id];
                        const isUndeadThrall = power.id === 'undead_thrall';
                        const isCursemaker = power.id === 'cursemakers_cookbook';
                        const isSelected = ctx.selectedBlackMagic.has(power.id);

                        return (
                            <PowerCard 
                                key={power.id} 
                                power={{...power, cost: ''}} 
                                isSelected={isSelected} 
                                onToggle={ctx.handleBlackMagicSelect} 
                                isDisabled={isLostHopePowerDisabled(power, 'blackMagic')}
                                iconButton={
                                    (isUndeadThrall && isSelected) ? <CompanionIcon /> :
                                    (isCursemaker && isSelected) ? <BookIcon /> : undefined
                                }
                                onIconButtonClick={
                                    (isUndeadThrall && isSelected) ? () => setIsUndeadThrallModalOpen(true) :
                                    (isCursemaker && isSelected) ? () => setIsEncyclopediaOpen(true) : undefined
                                }
                                fontSize={fontSize}
                            >
                                {boostedText && <BoostedEffectBox text={boostedText} />}
                                {isUndeadThrall && isSelected && undeadThrallCompanionName && (
                                    <div className="text-center mt-2 pt-2 border-t border-gray-700/50">
                                        <p className="text-xs text-gray-400">{language === 'ko' ? "할당된 노예:" : "Assigned Thrall:"}</p>
                                        <p className="text-sm font-bold text-purple-300">{undeadThrallCompanionName}</p>
                                    </div>
                                )}
                            </PowerCard>
                        )
                    })}
                </div>
            </div>

            {/* Modals */}
            {isUndeadThrallModalOpen && (
                <CompanionSelectionModal
                    currentCompanionName={undeadThrallCompanionName}
                    onClose={() => setIsUndeadThrallModalOpen(false)}
                    onSelect={(name) => {
                        handleUndeadThrallCompanionAssign(name);
                        setIsUndeadThrallModalOpen(false);
                    }}
                    pointLimit={undeadThrallPointLimit}
                    title={language === 'ko' ? "언데드 노예 할당" : "Assign Undead Thrall"}
                    categoryFilter="undead"
                />
            )}

            {isUndeadBeastModalOpen && (
                <BeastSelectionModal
                    onClose={() => setIsUndeadBeastModalOpen(false)}
                    onSelect={(name) => {
                        handleUndeadBeastAssign(name);
                        setIsUndeadBeastModalOpen(false);
                    }}
                    currentBeastName={undeadBeastName}
                    pointLimit={undeadBeastPointLimit}
                    title={language === 'ko' ? "언데드 야수 할당" : "Assign Undead Beast"}
                    requiredPerkId="undead_perk"
                    excludedPerkIds={['chatterbox_beast', 'magical_beast']}
                />
            )}

            {isEncyclopediaOpen && (
                <CurseEncyclopediaModal onClose={() => setIsEncyclopediaOpen(false)} />
            )}
        </section>
    );
};
