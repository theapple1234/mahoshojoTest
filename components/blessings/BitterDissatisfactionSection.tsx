
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useCharacterContext } from '../../context/CharacterContext';
import { BITTER_DISSATISFACTION_DATA, BITTER_DISSATISFACTION_SIGIL_TREE_DATA, BREWING_DATA, SOUL_ALCHEMY_DATA, TRANSFORMATION_DATA, BLESSING_ENGRAVINGS } from '../../constants';
import type { BitterDissatisfactionPower, BitterDissatisfactionSigil, ChoiceItem, MagicGrade } from '../../types';
import { BlessingIntro, SectionHeader, SectionSubHeader, WeaponIcon, CompanionIcon, BookIcon, BoostedEffectBox, renderFormattedText } from '../ui';
import { CompellingWillSigilCard, SigilColor } from '../CompellingWillSigilCard';
import { WeaponSelectionModal } from '../WeaponSelectionModal';
import { CompanionSelectionModal } from '../SigilTreeOptionCard';
import { BeastSelectionModal } from '../BeastSelectionModal';
import { CurseEncyclopediaModal } from '../CurseEncyclopediaModal';


const sigilImageMap: {[key: string]: string} = { 'kaarn.png': 'kaarn', 'purth.png': 'purth', 'juathas.png': 'juathas', 'xuth.png': 'xuth', 'sinthru.png': 'sinthru', 'lekolu.png': 'lekolu' };
const getSigilTypeFromImage = (imageSrc: string): string | null => {
    for (const key in sigilImageMap) { if (imageSrc.endsWith(key)) { return sigilImageMap[key]; } }
    return null;
}

// Utility to get all divisors of a number
const getValidFactors = (n: number) => {
    if (n <= 0) return [];
    const factors = [];
    for (let i = 1; i <= n; i++) {
        // We limit to 60 to prevent UI overcrowding with tiny fractions for very high numbers
        if (n % i === 0 && i <= 60) factors.push(i);
    }
    return factors;
};

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
            <p className={`${descriptionClass} text-gray-400 font-medium leading-relaxed flex-grow text-left whitespace-pre-wrap`} style={{ textShadow }}>{renderFormattedText(power.description)}</p>
            {hasChildren && (
                 <div className="mt-4 pt-4 border-t border-gray-700/50 w-full">
                    {children}
                 </div>
            )}
        </div>
    );
};

export const BitterDissatisfactionSection: React.FC = () => {
    const ctx = useCharacterContext();
    const [isWeaponModalOpen, setIsWeaponModalOpen] = useState(false);
    const [isBeastModalOpen, setIsBeastModalOpen] = useState(false);
    
    // Modals state
    const [beastmasterModalState, setBeastmasterModalState] = useState<{ isOpen: boolean, index: number | null }>({ isOpen: false, index: null });
    const [humanMarionetteModalState, setHumanMarionetteModalState] = useState<{ isOpen: boolean, index: number | null }>({ isOpen: false, index: null });
    const [isPersonificationModalOpen, setIsPersonificationModalOpen] = useState(false);
    const [isShedHumanityModalOpen, setIsShedHumanityModalOpen] = useState(false);
    const [isMalrayootsMageModalOpen, setIsMalrayootsMageModalOpen] = useState(false);
    const [isMalrayootsUniversalModalOpen, setIsMalrayootsUniversalModalOpen] = useState(false);
    const [isEncyclopediaOpen, setIsEncyclopediaOpen] = useState(false);
    
    const {
        selectedBlessingEngraving,
        bitterDissatisfactionEngraving,
        handleBitterDissatisfactionEngravingSelect,
        bitterDissatisfactionWeaponName,
        handleBitterDissatisfactionWeaponAssign,
        selectedTrueSelfTraits,
        isBitterDissatisfactionMagicianApplied,
        handleToggleBitterDissatisfactionMagician,
        disableBitterDissatisfactionMagician,
        bitterDissatisfactionSigilTreeCost,
        
        humanMarionetteCount,
        handleHumanMarionetteCountChange,
        humanMarionetteCompanionNames,
        handleHumanMarionetteCompanionAssign,
        
        totalBeastPoints,
        mageFamiliarBeastName, handleMageFamiliarBeastAssign,
        beastmasterCount, handleBeastmasterCountChange,
        beastmasterBeastNames, handleBeastmasterBeastAssign,
        
        personificationBuildName, handlePersonificationBuildAssign,
        shedHumanityPoints,
        shedHumanityBeastName, handleShedHumanityBeastAssign,
        malrayootsMageFormName, handleMalrayootsMageFormAssign,
        malrayootsUniversalFormName, handleMalrayootsUniversalFormAssign,
        
        kpPaidNodes, toggleKpNode,
        fontSize
    } = useCharacterContext();

    const finalEngraving = bitterDissatisfactionEngraving ?? selectedBlessingEngraving;
    const isSkinEngraved = finalEngraving === 'skin';

    useEffect(() => {
        if (!isSkinEngraved && isBitterDissatisfactionMagicianApplied) {
            disableBitterDissatisfactionMagician();
        }
    }, [isSkinEngraved, isBitterDissatisfactionMagicianApplied, disableBitterDissatisfactionMagician]);

    const isBitterDissatisfactionPowerDisabled = (power: BitterDissatisfactionPower, type: 'brewing' | 'soulAlchemy' | 'transformation'): boolean => {
        const selectedSet = type === 'brewing' ? ctx.selectedBrewing : type === 'soulAlchemy' ? ctx.selectedSoulAlchemy : ctx.selectedTransformation;
        const availablePicks = type === 'brewing' ? ctx.availableBrewingPicks : type === 'soulAlchemy' ? ctx.availableSoulAlchemyPicks : ctx.availableTransformationPicks;

        if (!selectedSet.has(power.id) && selectedSet.size >= availablePicks) return true;
        if (power.requires) {
            const allSelected = new Set([...ctx.selectedBrewing, ...ctx.selectedSoulAlchemy, ...ctx.selectedTransformation, ...ctx.selectedBitterDissatisfactionSigils]);
            if (!power.requires.every(req => allSelected.has(req))) return true;
        }
        return false;
    };

    const isBitterDissatisfactionSigilDisabled = (sigil: BitterDissatisfactionSigil): boolean => {
        if (ctx.selectedBitterDissatisfactionSigils.has(sigil.id)) return false; 
        if (!sigil.prerequisites.every(p => ctx.selectedBitterDissatisfactionSigils.has(p))) return true;
        
        // KP check: if paid with KP, ignore count requirement
        if (kpPaidNodes.has(String(sigil.id))) return false;

        const sigilType = getSigilTypeFromImage(sigil.imageSrc);
        const sigilCost = sigilType ? 1 : 0;
        if (sigilType && ctx.availableSigilCounts[sigilType] < sigilCost) return true;

        return false;
    };

    const getBitterDissatisfactionSigil = (id: string) => BITTER_DISSATISFACTION_SIGIL_TREE_DATA.find(s => s.id === id)!;
    
    const getSigilDisplayInfo = (sigil: BitterDissatisfactionSigil): { color: SigilColor, benefits: React.ReactNode } => {
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

        // Recalculate base limits locally to determine visuals
        let baseBrewing = 0, baseSoul = 0, baseTrans = 0;
        ctx.selectedBitterDissatisfactionSigils.forEach(id => {
            const s = BITTER_DISSATISFACTION_SIGIL_TREE_DATA.find(node => node.id === id);
            if (s && s.id !== 'fireborn') {
                baseBrewing += s.benefits.brewing ?? 0;
                baseSoul += s.benefits.soulAlchemy ?? 0;
                // FIX: Corrected variable name from baseTransformation to baseTrans
                baseTrans += s.benefits.transformation ?? 0;
            }
        });

        // Determine if specific categories are relying on the Fireborn bonus
        const brewingNeedsBonus = ctx.selectedBrewing.size > baseBrewing;
        const soulNeedsBonus = ctx.selectedSoulAlchemy.size > baseSoul;
        const transNeedsBonus = ctx.selectedTransformation.size > baseTrans;
        const usedBonusSlots = (brewingNeedsBonus ? 1 : 0) + (soulNeedsBonus ? 1 : 0) + (transNeedsBonus ? 1 : 0);

        const getStyle = (type: 'brewing' | 'soulAlchemy' | 'transformation', defaultColor: string) => {
            if (sigil.id !== 'fireborn') return defaultColor;
            
            // If less than 2 slots are "locked" by exceeding base, all options are theoretically available
            if (usedBonusSlots < 2) return defaultColor;
            
            // If 2 slots are used, check if THIS specific type is one of them.
            if (type === 'brewing' && brewingNeedsBonus) return defaultColor;
            if (type === 'soulAlchemy' && soulNeedsBonus) return defaultColor;
            if (type === 'transformation' && transNeedsBonus) return defaultColor;
            
            // Otherwise, it's effectively disabled/crossed out
            return "text-gray-600 line-through";
        };

        const benefits = (
            <>
                {sigil.benefits.brewing ? <p className={getStyle('brewing', "text-green-300")}>+ {sigil.benefits.brewing} Brewing</p> : null}
                {sigil.benefits.soulAlchemy ? <p className={getStyle('soulAlchemy', "text-red-300")}>+ {sigil.benefits.soulAlchemy} Soul Alchemy</p> : null}
                {sigil.benefits.transformation ? <p className={getStyle('transformation', "text-blue-300")}>+ {sigil.benefits.transformation} Transformation</p> : null}
            </>
        );
        return { color, benefits };
    };

    const handleKpToggle = (sigil: BitterDissatisfactionSigil) => {
        const type = getSigilTypeFromImage(sigil.imageSrc);
        if (type) {
            toggleKpNode(String(sigil.id), type);
        }
    };

    // Calculate total points for Human Marionettes (100 base + 20 boost)
    const marionetteTotalPoints = 100 + (ctx.isSoulAlchemyBoosted ? 20 : 0);
    const validMarionetteCounts = useMemo(() => getValidFactors(marionetteTotalPoints), [marionetteTotalPoints]);

    const handleMarionetteCountStep = (step: number) => {
        const currentCount = humanMarionetteCount || 1;
        let currentIndex = validMarionetteCounts.indexOf(currentCount);

        // If current count is invalid (e.g. from boost toggle), find nearest valid
        if (currentIndex === -1) {
            currentIndex = validMarionetteCounts.reduce((prevIdx, currVal, currIdx) => 
                Math.abs(currVal - currentCount) < Math.abs(validMarionetteCounts[prevIdx] - currentCount) ? currIdx : prevIdx
            , 0);
        }

        const newIndex = currentIndex + step;
        if (newIndex >= 0 && newIndex < validMarionetteCounts.length) {
            handleHumanMarionetteCountChange(validMarionetteCounts[newIndex]);
        }
    };
    
    // Calculate valid counts for Beastmaster based on total Beast Points
    // totalBeastPoints comes from context (Mage's Familiar level + Boost)
    const validBeastmasterCounts = useMemo(() => getValidFactors(totalBeastPoints), [totalBeastPoints]);

    const handleBeastmasterCountStep = (step: number) => {
        const currentCount = beastmasterCount || 0;
        let currentIndex = validBeastmasterCounts.indexOf(currentCount);
        
        // Handle initial state (0 or null) - start at index 0 (1 beast)
        if (currentCount === 0 || currentCount === null) {
            if (step > 0 && validBeastmasterCounts.length > 0) {
                handleBeastmasterCountChange(validBeastmasterCounts[0]);
            }
            return;
        }

        // If current count is invalid (e.g. lost a perk), snap to nearest
        if (currentIndex === -1) {
            currentIndex = validBeastmasterCounts.reduce((prevIdx, currVal, currIdx) => 
                Math.abs(currVal - currentCount) < Math.abs(validBeastmasterCounts[prevIdx] - currentCount) ? currIdx : prevIdx
            , 0);
        }

        const newIndex = currentIndex + step;
        if (newIndex >= 0 && newIndex < validBeastmasterCounts.length) {
            handleBeastmasterCountChange(validBeastmasterCounts[newIndex]);
        } else if (newIndex < 0) {
            // Allow going back to 0/Disabled
            handleBeastmasterCountChange(0);
        }
    };

    const renderSigilNode = (id: string, compact = true) => {
        const sigil = getBitterDissatisfactionSigil(id);
        const { color, benefits } = getSigilDisplayInfo(sigil);
        return (
            <CompellingWillSigilCard 
                sigil={sigil} 
                isSelected={ctx.selectedBitterDissatisfactionSigils.has(id)} 
                isDisabled={isBitterDissatisfactionSigilDisabled(sigil)} 
                onSelect={ctx.handleBitterDissatisfactionSigilSelect} 
                benefitsContent={benefits} 
                color={color}
                compact={compact}
                onToggleKp={() => handleKpToggle(sigil)}
                isKpPaid={kpPaidNodes.has(String(id))}
            />
        );
    };

    const boostDescriptions: { [key: string]: string } = {
        vitae_potions: "Twice as cheap and effective.",
        colorless_odorless: "Twice as cheap and effective.",
        magecraft_boosters: "Twice as cheap and effective.",
        mass_production: "Twice as cheap and effective.",
        water_of_life: "Twice as cheap and effective.",
        bolstering_tonics: "Twice as cheap and effective.",
        love_potion: "Twice as cheap and effective.",
        mages_familiar_i: "+10 Beast Points.",
        mages_familiar_ii: "+10 Beast Points.",
        mages_familiar_iii: "+10 Beast Points.",
        human_marionettes: "+20 Companion Points total (split).",
        self_duplication: "Up to 15 bodies.",
        personification: "Become more humanlike.",
        material_transmutation: "Quadrupled rate.",
        internal_manipulation: "Double durability.",
        shed_humanity_i: "+10 Beast Points.",
        shed_humanity_ii: "+10 Beast Points.",
        phase_shift: "Removed vulnerability.",
        rubber_physiology: "Can stretch 100x length.",
        supersize_me: "Giant for twice the time.",
        malrayoots: "+10 Beast Points."
    };

    const isBrewingBoostDisabled = !ctx.isBrewingBoosted && ctx.availableSigilCounts.kaarn <= 0;
    const isSoulAlchemyBoostDisabled = !ctx.isSoulAlchemyBoosted && ctx.availableSigilCounts.kaarn <= 0;
    const isTransformationBoostDisabled = !ctx.isTransformationBoosted && ctx.availableSigilCounts.kaarn <= 0;

    const isMagicianSelected = selectedTrueSelfTraits.has('magician');
    const additionalCost = Math.floor(bitterDissatisfactionSigilTreeCost * 0.25);

    const humanMarionettePointsPer = marionetteTotalPoints / (humanMarionetteCount || 1);

    // Style to counteract global zoom for specific sections
    // Global Large is 120%. 1 / 1.2 = 0.83333
    const staticScaleStyle: React.CSSProperties = fontSize === 'large' ? { zoom: 0.83333 } : {};

    return (
        <section>
            <BlessingIntro {...BITTER_DISSATISFACTION_DATA} />
            <div className="mt-8 mb-16 max-w-3xl mx-auto">
                <h4 className="font-cinzel text-xl text-center tracking-widest my-6 text-purple-300 uppercase">
                    Engrave this Blessing
                </h4>
                <div className="grid grid-cols-3 gap-4">
                    {BLESSING_ENGRAVINGS.map(engraving => {
                        const isSelected = finalEngraving === engraving.id;
                        const isOverridden = bitterDissatisfactionEngraving !== null;
                        const isWeapon = engraving.id === 'weapon';

                        return (
                             <div key={engraving.id} className="relative">
                                <button
                                    onClick={() => handleBitterDissatisfactionEngravingSelect(engraving.id)}
                                    className={`w-full p-4 rounded-lg border-2 transition-colors flex flex-col items-center justify-center h-full text-center
                                        ${isSelected 
                                            ? (isOverridden ? 'border-purple-400 bg-purple-900/40' : 'border-purple-600/50 bg-purple-900/20') 
                                            : 'border-gray-700 bg-black/30 hover:border-purple-400/50'}
                                    `}
                                >
                                    <span className="font-cinzel tracking-wider uppercase">{engraving.title}</span>
                                    {isWeapon && isSelected && bitterDissatisfactionWeaponName && (
                                        <p className="text-xs text-purple-300 mt-2 truncate">({bitterDissatisfactionWeaponName})</p>
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
                            onClick={handleToggleBitterDissatisfactionMagician}
                            className={`px-6 py-3 text-sm rounded-lg border transition-colors ${
                                isBitterDissatisfactionMagicianApplied
                                    ? 'bg-purple-800/60 border-purple-500 text-white'
                                    : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:border-purple-500/70'
                            }`}
                        >
                            {isBitterDissatisfactionMagicianApplied
                                ? `The 'Magician' trait is applied. Click to remove. (+${additionalCost} BP)`
                                : `Click to apply the 'Magician' trait from your True Self. This allows you to use the Blessing without transforming for an additional ${additionalCost} BP.`}
                        </button>
                    </div>
                )}
            </div>

            {isWeaponModalOpen && (
                <WeaponSelectionModal
                    onClose={() => setIsWeaponModalOpen(false)}
                    onSelect={(weaponName) => {
                        handleBitterDissatisfactionWeaponAssign(weaponName);
                        setIsWeaponModalOpen(false);
                    }}
                    currentWeaponName={bitterDissatisfactionWeaponName}
                />
            )}

            <div className="my-16 bg-black/20 p-8 rounded-lg border border-gray-800 overflow-x-auto">
                <SectionHeader>SIGIL TREE</SectionHeader>
                <div className="flex items-center min-w-max pb-8 px-4 justify-center">
                    
                    {/* Column 1: Root */}
                    <div className="flex flex-col justify-center h-[40rem]">
                        {renderSigilNode('fireborn')}
                    </div>

                    {/* SVG Connector 1 (Split) */}
                    <svg className="w-16 h-[40rem] flex-shrink-0 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M 0 280 H 20" /> {/* Center Out */}
                        
                        {/* Branch to Top (Brewer) */}
                        <path d="M 20 280 V 40 H 64" />
                        
                        {/* Branch to Middle (Beastmother) */}
                        <path d="M 20 280 H 64" />
                        
                        {/* Branch to Bottom (Shifter) */}
                        <path d="M 20 280 V 520 H 64" />
                    </svg>

                    {/* Column 2: Level I */}
                    <div className="flex flex-col justify-between h-[40rem]">
                        <div className="h-40 flex items-center justify-center">
                            {renderSigilNode('brewer_i')}
                        </div>
                        <div className="h-40 flex items-center justify-center">
                            {renderSigilNode('beastmother_i')}
                        </div>
                        <div className="h-40 flex items-center justify-center">
                            {renderSigilNode('shifter_i')}
                        </div>
                    </div>

                    {/* SVG Connector 2 (Level I -> Level II) */}
                    <svg className="w-12 h-[40rem] flex-shrink-0 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M 0 40 H 48" />   {/* Brewer */}
                        <path d="M 0 280 H 48" />  {/* Beastmother */}
                        <path d="M 0 520 H 48" />  {/* Shifter */}
                    </svg>

                    {/* Column 3: Level II */}
                    <div className="flex flex-col justify-between h-[40rem]">
                        <div className="h-40 flex items-center justify-center">
                            {renderSigilNode('brewer_ii')}
                        </div>
                        <div className="h-40 flex items-center justify-center">
                            {renderSigilNode('beastmother_ii')}
                        </div>
                        <div className="h-40 flex items-center justify-center">
                            {renderSigilNode('shifter_ii')}
                        </div>
                    </div>

                    {/* SVG Connector 3 (Level II -> Level III) */}
                    <svg className="w-12 h-[40rem] flex-shrink-0 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M 0 40 H 48" />   {/* Brewer */}
                        <path d="M 0 280 H 48" />  {/* Beastmother */}
                        <path d="M 0 520 H 48" />  {/* Shifter */}
                    </svg>

                    {/* Column 4: Level III */}
                    <div className="flex flex-col justify-between h-[40rem]">
                        <div className="h-40 flex items-center justify-center">
                            {renderSigilNode('brewer_iii')}
                        </div>
                        <div className="h-40 flex items-center justify-center">
                            {renderSigilNode('beastmother_iii')}
                        </div>
                        <div className="h-40 flex items-center justify-center">
                            {renderSigilNode('shifter_iii')}
                        </div>
                    </div>

                    {/* SVG Connector 4 (Level III -> Final) */}
                    <svg className="w-20 h-[40rem] flex-shrink-0 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2">
                        {/* Inputs: Brewer (40), Beastmother (280), Shifter (520) connect to first vertical bar at x=20 */}
                        <path d="M 0 40 H 20" />
                        <path d="M 0 280 H 20" />
                        <path d="M 0 520 H 20" />
                        
                        {/* First Vertical Bar */}
                        <path d="M 20 40 V 520" />
                        
                        {/* Bridge from center (280) to second vertical bar at x=60 */}
                        <path d="M 20 280 H 60" />
                        
                        {/* Second Vertical Bar splitting to Mageweaver (160) and Parasitology (400) */}
                        <path d="M 60 160 V 400" />
                        
                        {/* Outputs */}
                        <path d="M 60 160 H 80" />
                        <path d="M 60 400 H 80" />
                    </svg>

                    {/* Column 5: Final Tier */}
                    <div className="flex flex-col justify-center gap-20 h-[40rem]">
                        <div className="h-40 flex items-center justify-center">
                            {renderSigilNode('mageweaver')}
                        </div>
                        <div className="h-40 flex items-center justify-center">
                            {renderSigilNode('parasitology')}
                        </div>
                    </div>

                </div>
            </div>

            {/* Brewing */}
            <div className="mt-16">
                <SectionHeader>Brewing</SectionHeader>
                <div className={`my-4 max-w-sm mx-auto p-4 border rounded-lg transition-all bg-black/20 ${ ctx.isBrewingBoosted ? 'border-amber-400 ring-2 ring-amber-400/50 cursor-pointer hover:border-amber-300' : isBrewingBoostDisabled ? 'border-gray-700 opacity-50 cursor-not-allowed' : 'border-gray-700 hover:border-amber-400/50 cursor-pointer'}`} onClick={!isBrewingBoostDisabled ? () => ctx.handleBitterDissatisfactionBoostToggle('brewing') : undefined}>
                    <div className="flex items-center justify-center gap-4">
                        <img src="/images/zTm8fcLb-kaarn.png" alt="Kaarn Sigil" className="w-16 h-16"/>
                        <div className="text-left">
                            <h4 className="font-cinzel text-lg font-bold text-amber-300 tracking-widest">{ctx.isBrewingBoosted ? 'BOOSTED' : 'BOOST'}</h4>
                            {!ctx.isBrewingBoosted && <p className="text-xs text-gray-400 mt-1">Activating this will consume one Kaarn sigil.</p>}
                        </div>
                    </div>
                </div>
                <SectionSubHeader>Picks Available: {ctx.availableBrewingPicks - ctx.selectedBrewing.size} / {ctx.availableBrewingPicks}</SectionSubHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" style={staticScaleStyle}>
                    {BREWING_DATA.map(power => {
                        const boostedText = ctx.isBrewingBoosted && boostDescriptions[power.id];
                        const isColorlessOdorless = power.id === 'colorless_odorless';
                        const isSelected = ctx.selectedBrewing.has(power.id);

                        return (
                            <PowerCard 
                                key={power.id} 
                                power={{...power, cost: ''}} 
                                isSelected={isSelected} 
                                onToggle={ctx.handleBrewingSelect} 
                                isDisabled={isBitterDissatisfactionPowerDisabled(power, 'brewing')} 
                                iconButton={isColorlessOdorless && isSelected ? <BookIcon /> : undefined}
                                onIconButtonClick={isColorlessOdorless && isSelected ? () => setIsEncyclopediaOpen(true) : undefined}
                                fontSize={fontSize}
                            >
                                {boostedText && <BoostedEffectBox text={boostedText} />}
                            </PowerCard>
                        )
                    })}
                </div>
            </div>

            {/* Soul Alchemy */}
            <div className="mt-16">
                <SectionHeader>Soul Alchemy</SectionHeader>
                <div className={`my-4 max-w-sm mx-auto p-4 border rounded-lg transition-all bg-black/20 ${ ctx.isSoulAlchemyBoosted ? 'border-amber-400 ring-2 ring-amber-400/50 cursor-pointer hover:border-amber-300' : isSoulAlchemyBoostDisabled ? 'border-gray-700 opacity-50 cursor-not-allowed' : 'border-gray-700 hover:border-amber-400/50 cursor-pointer'}`} onClick={!isSoulAlchemyBoostDisabled ? () => ctx.handleBitterDissatisfactionBoostToggle('soulAlchemy') : undefined}>
                    <div className="flex items-center justify-center gap-4">
                        <img src="/images/zTm8fcLb-kaarn.png" alt="Kaarn Sigil" className="w-16 h-16"/>
                        <div className="text-left">
                            <h4 className="font-cinzel text-lg font-bold text-amber-300 tracking-widest">{ctx.isSoulAlchemyBoosted ? 'BOOSTED' : 'BOOST'}</h4>
                            {!ctx.isSoulAlchemyBoosted && <p className="text-xs text-gray-400 mt-1">Activating this will consume one Kaarn sigil.</p>}
                        </div>
                    </div>
                </div>
                <SectionSubHeader>Picks Available: {ctx.availableSoulAlchemyPicks - ctx.selectedSoulAlchemy.size} / {ctx.availableSoulAlchemyPicks}</SectionSubHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" style={staticScaleStyle}>
                    {(() => {
                        const humanMarionettes = SOUL_ALCHEMY_DATA.find(p => p.id === 'human_marionettes');
                        const otherPowers = SOUL_ALCHEMY_DATA.filter(p => p.id !== 'human_marionettes');
                        const firstHalf = otherPowers.slice(0, 3);
                        const secondHalf = otherPowers.slice(3);

                        const renderPower = (power: BitterDissatisfactionPower) => {
                            const boostedText = ctx.isSoulAlchemyBoosted && boostDescriptions[power.id];
                            const isSelected = ctx.selectedSoulAlchemy.has(power.id);
                            
                            const isMageFamiliar = ['mages_familiar_i', 'mages_familiar_ii', 'mages_familiar_iii'].includes(power.id);
                            const isHighestFamiliar = power.id === 'mages_familiar_iii' && isSelected;
                            const isMidFamiliar = power.id === 'mages_familiar_ii' && isSelected && !ctx.selectedSoulAlchemy.has('mages_familiar_iii');
                            const isLowFamiliar = power.id === 'mages_familiar_i' && isSelected && !ctx.selectedSoulAlchemy.has('mages_familiar_ii');
                            const showFamiliarButton = isHighestFamiliar || isMidFamiliar || isLowFamiliar;

                            const isHumanMarionettes = power.id === 'human_marionettes';
                            const isBeastmaster = power.id === 'beastmaster';
                            const isPersonification = power.id === 'personification';

                            return (
                                <PowerCard 
                                    key={power.id} 
                                    power={{...power, cost: ''}} 
                                    isSelected={isSelected} 
                                    onToggle={ctx.handleSoulAlchemySelect} 
                                    isDisabled={isBitterDissatisfactionPowerDisabled(power, 'soulAlchemy')}
                                    iconButton={
                                        (isMageFamiliar && showFamiliarButton) ? <CompanionIcon /> :
                                        (isPersonification && isSelected) ? <CompanionIcon /> : undefined
                                    }
                                    onIconButtonClick={
                                        (isMageFamiliar && showFamiliarButton) ? () => setIsBeastModalOpen(true) :
                                        (isPersonification && isSelected) ? () => setIsPersonificationModalOpen(true) : undefined
                                    }
                                    fontSize={fontSize}
                                >
                                    {boostedText && <BoostedEffectBox text={boostedText} />}
                                    {isMageFamiliar && showFamiliarButton && mageFamiliarBeastName && (
                                        <div className="text-center mt-2 border-t border-gray-700/50 pt-2">
                                            <p className="text-xs text-gray-400">Assigned Familiar:</p>
                                            <p className="text-sm font-bold text-amber-300">{mageFamiliarBeastName}</p>
                                        </div>
                                    )}
                                    {isPersonification && isSelected && personificationBuildName && (
                                        <div className="text-center mt-2 border-t border-gray-700/50 pt-2">
                                            <p className="text-xs text-gray-400">Assigned Personality:</p>
                                            <p className="text-sm font-bold text-amber-300">{personificationBuildName}</p>
                                        </div>
                                    )}
                                    {isHumanMarionettes && isSelected && (
                                        <div className="w-full pt-2" onClick={e => e.stopPropagation()}>
                                            <div className="flex items-center justify-center gap-4 mb-3 bg-black/20 p-2 rounded-lg">
                                                <button onClick={() => handleMarionetteCountStep(-1)} className="w-8 h-8 flex items-center justify-center bg-gray-800 hover:bg-gray-700 rounded text-lg font-bold transition-colors border border-gray-600">-</button>
                                                <div className="flex flex-col items-center min-w-[4rem]">
                                                    <span className="text-xl font-bold text-white leading-none">{humanMarionetteCount || 1}</span>
                                                    <span className="text-[9px] text-gray-400 uppercase tracking-widest mt-1">Puppets</span>
                                                </div>
                                                <button onClick={() => handleMarionetteCountStep(1)} className="w-8 h-8 flex items-center justify-center bg-gray-800 hover:bg-gray-700 rounded text-lg font-bold transition-colors border border-gray-600">+</button>
                                            </div>
                                            
                                            <div className="text-center mb-4">
                                                <span className="text-xs font-mono font-bold text-green-400 bg-green-950/30 px-3 py-1 rounded border border-green-500/30">
                                                    {Math.floor(humanMarionettePointsPer)} CP / Each
                                                </span>
                                            </div>

                                            <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                                                {Array.from({length: humanMarionetteCount || 1}).map((_, idx) => (
                                                    <div key={idx} className="flex justify-between items-center text-xs bg-black/40 border border-gray-700/50 p-2 rounded hover:border-gray-500 transition-colors group">
                                                        <span className="text-gray-500 font-bold uppercase text-[9px] tracking-wider">Puppet #{idx+1}</span>
                                                        <button 
                                                            onClick={() => setHumanMarionetteModalState({ isOpen: true, index: idx })}
                                                            className={`px-3 py-1.5 rounded text-[9px] uppercase font-bold tracking-widest transition-all ${
                                                                humanMarionetteCompanionNames[idx] 
                                                                ? 'bg-purple-900/30 text-purple-300 border border-purple-500/30 hover:bg-purple-800/50 hover:text-white' 
                                                                : 'bg-cyan-900/30 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-800/50 hover:text-white'
                                                            }`}
                                                        >
                                                            {humanMarionetteCompanionNames[idx] ? 'Edit' : 'Assign'}
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {isBeastmaster && isSelected && (
                                        <div className="w-full pt-2" onClick={e => e.stopPropagation()}>
                                            <div className="flex items-center justify-center gap-4 mb-3 bg-black/20 p-2 rounded-lg">
                                                <button 
                                                    onClick={() => handleBeastmasterCountStep(-1)} 
                                                    disabled={!beastmasterCount} 
                                                    className="w-8 h-8 flex items-center justify-center bg-gray-800 hover:bg-gray-700 rounded text-lg font-bold transition-colors disabled:opacity-30 disabled:cursor-not-allowed border border-gray-600"
                                                >
                                                    -
                                                </button>
                                                <div className="flex flex-col items-center min-w-[4rem]">
                                                    <span className="text-xl font-bold text-white leading-none">{beastmasterCount || 0}</span>
                                                    <span className="text-[9px] text-gray-400 uppercase tracking-widest mt-1">Familiars</span>
                                                </div>
                                                <button 
                                                    onClick={() => handleBeastmasterCountStep(1)} 
                                                    className="w-8 h-8 flex items-center justify-center bg-gray-800 hover:bg-gray-700 rounded text-lg font-bold transition-colors border border-gray-600"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            
                                            <div className="text-center mb-4">
                                                 <span className="text-xs font-mono font-bold text-green-400 bg-green-950/30 px-3 py-1 rounded border border-green-500/30">
                                                    {beastmasterCount ? Math.floor(totalBeastPoints / beastmasterCount) : totalBeastPoints} BP / Each
                                                </span>
                                            </div>

                                            <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                                                {Array.from({length: beastmasterCount || 0}).map((_, idx) => (
                                                    <div key={idx} className="flex justify-between items-center text-xs bg-black/40 border border-gray-700/50 p-2 rounded hover:border-gray-500 transition-colors group">
                                                        <div className="flex flex-col items-start text-left">
                                                            <span className="text-gray-500 font-bold uppercase text-[9px] tracking-wider mb-0.5">Familiar #{idx+1}</span>
                                                            <span className={`truncate max-w-[110px] font-medium ${beastmasterBeastNames[idx] ? 'text-amber-200' : 'text-gray-600 italic'}`}>
                                                                {beastmasterBeastNames[idx] || 'Unassigned'}
                                                            </span>
                                                        </div>
                                                        <button 
                                                            onClick={() => setBeastmasterModalState({ isOpen: true, index: idx })}
                                                            className={`px-3 py-1.5 rounded text-[9px] uppercase font-bold tracking-widest transition-all ${
                                                                beastmasterBeastNames[idx] 
                                                                ? 'bg-purple-900/30 text-purple-300 border border-purple-500/30 hover:bg-purple-800/50 hover:text-white' 
                                                                : 'bg-cyan-900/30 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-800/50 hover:text-white'
                                                            }`}
                                                        >
                                                            {beastmasterBeastNames[idx] ? 'Edit' : 'Assign'}
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </PowerCard>
                            );
                        };

                        return (
                            <>
                                {firstHalf.map(renderPower)}
                                {humanMarionettes && (
                                    <div className="lg:row-span-2">
                                        {renderPower(humanMarionettes)}
                                    </div>
                                )}
                                {secondHalf.map(renderPower)}
                            </>
                        );
                    })()}
                </div>
            </div>

            {/* Transformation */}
            <div className="mt-16">
                <SectionHeader>Transformation</SectionHeader>
                <div className={`my-4 max-w-sm mx-auto p-4 border rounded-lg transition-all bg-black/20 ${ ctx.isTransformationBoosted ? 'border-amber-400 ring-2 ring-amber-400/50 cursor-pointer hover:border-amber-300' : isTransformationBoostDisabled ? 'border-gray-700 opacity-50 cursor-not-allowed' : 'border-gray-700 hover:border-amber-400/50 cursor-pointer'}`} onClick={!isTransformationBoostDisabled ? () => ctx.handleBitterDissatisfactionBoostToggle('transformation') : undefined}>
                    <div className="flex items-center justify-center gap-4">
                        <img src="/images/zTm8fcLb-kaarn.png" alt="Kaarn Sigil" className="w-16 h-16"/>
                        <div className="text-left">
                            <h4 className="font-cinzel text-lg font-bold text-amber-300 tracking-widest">{ctx.isTransformationBoosted ? 'BOOSTED' : 'BOOST'}</h4>
                            {!ctx.isTransformationBoosted && <p className="text-xs text-gray-400 mt-1">Activating this will consume one Kaarn sigil.</p>}
                        </div>
                    </div>
                </div>
                <SectionSubHeader>Picks Available: {ctx.availableTransformationPicks - ctx.selectedTransformation.size} / {ctx.availableTransformationPicks}</SectionSubHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" style={staticScaleStyle}>
                    {TRANSFORMATION_DATA.map(power => {
                        const boostedText = ctx.isTransformationBoosted && boostDescriptions[power.id];
                        const isSelected = ctx.selectedTransformation.has(power.id);
                        
                        const isShedHumanity1 = power.id === 'shed_humanity_i';
                        const isShedHumanity2 = power.id === 'shed_humanity_ii';
                        const showShedHumanityButton = (isShedHumanity1 && isSelected && !ctx.selectedTransformation.has('shed_humanity_ii')) || (isShedHumanity2 && isSelected);
                        
                        const isMalrayoots = power.id === 'malrayoots';

                        return (
                            <PowerCard 
                                key={power.id} 
                                power={{...power, cost: ''}} 
                                isSelected={isSelected} 
                                onToggle={ctx.handleTransformationSelect} 
                                isDisabled={isBitterDissatisfactionPowerDisabled(power, 'transformation')} 
                                iconButton={
                                    (showShedHumanityButton) ? <CompanionIcon /> :
                                    (isMalrayoots && isSelected) ? <CompanionIcon /> : undefined
                                }
                                onIconButtonClick={
                                    (showShedHumanityButton) ? () => setIsShedHumanityModalOpen(true) :
                                    (isMalrayoots && isSelected) ? () => {} : undefined // Handled via inline buttons below
                                }
                                fontSize={fontSize}
                            >
                                {boostedText && <BoostedEffectBox text={boostedText} />}
                                {showShedHumanityButton && shedHumanityBeastName && (
                                    <div className="text-center mt-2 pt-2 border-t border-gray-700/50">
                                        <p className="text-xs text-gray-400">Assigned Form:</p>
                                        <p className="text-sm font-bold text-amber-300">{shedHumanityBeastName}</p>
                                    </div>
                                )}
                                {isMalrayoots && isSelected && (
                                    <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                                        <button 
                                            onClick={() => setIsMalrayootsMageModalOpen(true)}
                                            className={`flex-1 flex flex-col items-center justify-center p-1 rounded border text-[9px] transition-all ${
                                                malrayootsMageFormName 
                                                ? 'bg-purple-900/60 border-purple-500 text-purple-100 hover:bg-purple-800' 
                                                : 'bg-gray-900/40 border-gray-600 text-gray-400 hover:border-purple-500/50 hover:text-purple-300'
                                            }`}
                                        >
                                            <span className="font-bold uppercase tracking-wider mb-0.5">Mage Only</span>
                                            <span className="truncate w-full text-center font-mono opacity-90">
                                                {malrayootsMageFormName || '70 BP'}
                                            </span>
                                        </button>
                                        <button 
                                            onClick={() => setIsMalrayootsUniversalModalOpen(true)}
                                            className={`flex-1 flex flex-col items-center justify-center p-1 rounded border text-[9px] transition-all ${
                                                malrayootsUniversalFormName 
                                                ? 'bg-purple-900/60 border-purple-500 text-purple-100 hover:bg-purple-800' 
                                                : 'bg-gray-900/40 border-gray-600 text-gray-400 hover:border-purple-500/50 hover:text-purple-300'
                                            }`}
                                        >
                                            <span className="font-bold uppercase tracking-wider mb-0.5">Universal</span>
                                            <span className="truncate w-full text-center font-mono opacity-90">
                                                {malrayootsUniversalFormName || '40 BP'}
                                            </span>
                                        </button>
                                    </div>
                                )}
                            </PowerCard>
                        )
                    })}
                </div>
            </div>

            {/* Modals */}
            {isBeastModalOpen && (
                <BeastSelectionModal
                    onClose={() => setIsBeastModalOpen(false)}
                    onSelect={(name) => {
                        handleMageFamiliarBeastAssign(name);
                        setIsBeastModalOpen(false);
                    }}
                    currentBeastName={mageFamiliarBeastName}
                    pointLimit={totalBeastPoints}
                    title={`Assign Familiar (${totalBeastPoints} BP)`}
                />
            )}
            
            {beastmasterModalState.isOpen && beastmasterModalState.index !== null && (
                <BeastSelectionModal
                    onClose={() => setBeastmasterModalState({ isOpen: false, index: null })}
                    onSelect={(name) => {
                        handleBeastmasterBeastAssign(beastmasterModalState.index!, name);
                        setBeastmasterModalState({ isOpen: false, index: null });
                    }}
                    currentBeastName={beastmasterBeastNames[beastmasterModalState.index] || null}
                    pointLimit={beastmasterCount ? Math.floor(totalBeastPoints / beastmasterCount) : totalBeastPoints}
                    title={`Assign Familiar #${beastmasterModalState.index + 1}`}
                />
            )}

            {humanMarionetteModalState.isOpen && humanMarionetteModalState.index !== null && (
                <CompanionSelectionModal
                    onClose={() => setHumanMarionetteModalState({ isOpen: false, index: null })}
                    onSelect={(name) => {
                        handleHumanMarionetteCompanionAssign(humanMarionetteModalState.index!, name);
                        setHumanMarionetteModalState({ isOpen: false, index: null });
                    }}
                    currentCompanionName={humanMarionetteCompanionNames[humanMarionetteModalState.index] || null}
                    pointLimit={Math.floor(humanMarionettePointsPer)}
                    title={`Assign Puppet #${humanMarionetteModalState.index + 1}`}
                    categoryFilter="puppet"
                />
            )}

            {isPersonificationModalOpen && (
                <CompanionSelectionModal
                    onClose={() => setIsPersonificationModalOpen(false)}
                    onSelect={(name) => {
                        handlePersonificationBuildAssign(name);
                        setIsPersonificationModalOpen(false);
                    }}
                    currentCompanionName={personificationBuildName}
                    pointLimit={50} // Rough estimate, mainly personality traits
                    title="Assign Personification Personality"
                    validator={(data) => {
                        // Only allow personality traits
                        const hasCategory = !!data.category;
                        const hasPerks = data.perks && data.perks.size > 0;
                        return !hasCategory && !hasPerks && data.traits.size > 0;
                    }}
                />
            )}

            {isShedHumanityModalOpen && (
                <BeastSelectionModal
                    onClose={() => setIsShedHumanityModalOpen(false)}
                    onSelect={(name) => {
                        handleShedHumanityBeastAssign(name);
                        setIsShedHumanityModalOpen(false);
                    }}
                    currentBeastName={shedHumanityBeastName}
                    pointLimit={shedHumanityPoints}
                    title="Assign Shed Humanity Form"
                    excludedPerkIds={['chatterbox_beast', 'magical_beast']}
                />
            )}

            {isMalrayootsMageModalOpen && (
                <BeastSelectionModal
                    onClose={() => setIsMalrayootsMageModalOpen(false)}
                    onSelect={(name) => {
                        handleMalrayootsMageFormAssign(name);
                        setIsMalrayootsMageModalOpen(false);
                    }}
                    currentBeastName={malrayootsMageFormName}
                    pointLimit={70}
                    title="Assign Malrayoots Mage-Only Form"
                />
            )}

            {isMalrayootsUniversalModalOpen && (
                <BeastSelectionModal
                    onClose={() => setIsMalrayootsUniversalModalOpen(false)}
                    onSelect={(name) => {
                        handleMalrayootsUniversalFormAssign(name);
                        setIsMalrayootsUniversalModalOpen(false);
                    }}
                    currentBeastName={malrayootsUniversalFormName}
                    pointLimit={40}
                    title="Assign Malrayoots Universal Form"
                />
            )}

            {isEncyclopediaOpen && (
                <CurseEncyclopediaModal onClose={() => setIsEncyclopediaOpen(false)} />
            )}
        </section>
    );
};
