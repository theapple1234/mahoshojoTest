
import React, { useState, useEffect } from 'react';
import { useCharacterContext } from '../../context/CharacterContext';
import { FALLEN_PEACE_DATA, FALLEN_PEACE_SIGIL_TREE_DATA, TELEPATHY_DATA, MENTAL_MANIPULATION_DATA, BLESSING_ENGRAVINGS } from '../../constants';
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

export const FallenPeaceSection: React.FC = () => {
    // ... existing component code ...
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
        fontSize
    } = useCharacterContext();

    const finalEngraving = fallenPeaceEngraving ?? selectedBlessingEngraving;
    const isSkinEngraved = finalEngraving === 'skin';

    useEffect(() => {
        if (!isSkinEngraved && isFallenPeaceMagicianApplied) {
            disableFallenPeaceMagician();
        }
    }, [isSkinEngraved, isFallenPeaceMagicianApplied, disableFallenPeaceMagician]);

    const isFallenPeacePowerDisabled = (power: FallenPeacePower, type: 'telepathy' | 'mental_manipulation'): boolean => {
        const selectedSet = type === 'telepathy' ? ctx.selectedTelepathy : ctx.selectedMentalManipulation;
        const availablePicks = type === 'telepathy' ? ctx.availableTelepathyPicks : ctx.availableMentalManipulationPicks;

        if (!selectedSet.has(power.id) && selectedSet.size >= availablePicks) return true;
        if (power.requires) {
            const allSelectedPowersAndSigils = new Set([...ctx.selectedTelepathy, ...ctx.selectedMentalManipulation, ...ctx.selectedFallenPeaceSigils]);
            if (!power.requires.every(req => allSelectedPowersAndSigils.has(req))) return true;
        }
        return false;
    };

    const isFallenPeaceSigilDisabled = (sigil: FallenPeaceSigil): boolean => {
        if (ctx.selectedFallenPeaceSigils.has(sigil.id)) return false; // Can always deselect
        if (!sigil.prerequisites.every(p => ctx.selectedFallenPeaceSigils.has(p))) return true;

        // KP check
        if (kpPaidNodes.has(String(sigil.id))) return false;
        
        const sigilType = getSigilTypeFromImage(sigil.imageSrc);
        const sigilCost = sigilType ? 1 : 0;
        if (sigilType && ctx.availableSigilCounts[sigilType] < sigilCost) return true;

        return false;
    };

    const getFallenPeaceSigil = (id: string) => FALLEN_PEACE_SIGIL_TREE_DATA.find(s => s.id === id)!;
    
    const getSigilDisplayInfo = (sigil: FallenPeaceSigil): { color: SigilColor, benefits: React.ReactNode } => {
        const colorMap: Record<string, SigilColor> = {
            'Left Brained': 'orange', 'Lobe': 'gray', 'Frontal Lobe': 'lime', 'Right Brained': 'red',
        };
        const color = colorMap[sigil.type] || 'gray';
        const benefits = (
            <>
                {sigil.benefits.telepathy ? <p className="text-blue-300">+ {sigil.benefits.telepathy} Telepathy</p> : null}
                {sigil.benefits.mentalManipulation ? <p className="text-purple-300">+ {sigil.benefits.mentalManipulation} Mental Manipulation</p> : null}
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

    const boostDescriptions: { [key: string]: string } = {
        thoughtseer: "Can simultaneously sense thoughts and feelings of entire crowds. Manipulation ability boosted.",
        lucid_dreamer: "Can invade dreams spiritually even while you’re still awake. Time seems to slow down within dreams, and emotions are more intense.",
        memory_lane: "Can see memories from much farther back. Better at breaking mental blocks.",
        mental_block: "Doubled either intensity of protection, or amount of memories that can be blocked.",
        perfect_stranger: "Halves the time to forget you.",
        masquerade: "Your disguise cant be seen through regardless of anyone’s level of willpower or psychic resistance.",
        psychic_vampire: "Always passively absorbing emotions within a miles radius.",
        master_telepath: "Significantly boosts intensity of illusions and difficulty of resistance.",
        crowd_control: "Doubles range and number of civilians that can be possessed.",
        hypnotist: "Significantly boosts length and intensity of control.",
        breaker_of_minds: "Max 20 agents."
    };

    const isTelepathyBoostDisabled = !ctx.isTelepathyBoosted && ctx.availableSigilCounts.kaarn <= 0;
    const isMentalManipulationBoostDisabled = !ctx.isMentalManipulationBoosted && ctx.availableSigilCounts.purth <= 0;

    const isMagicianSelected = selectedTrueSelfTraits.has('magician');
    const additionalCost = Math.floor(fallenPeaceSigilTreeCost * 0.25);

    // Style to counteract global zoom for specific sections
    // Global Large is 120%. 1 / 1.2 = 0.83333
    const staticScaleStyle: React.CSSProperties = fontSize === 'large' ? { zoom: 0.83333 } : {};

    return (
        <section>
            <BlessingIntro {...FALLEN_PEACE_DATA} />
            <div className="mt-8 mb-16 max-w-3xl mx-auto">
                <h4 className="font-cinzel text-xl text-center tracking-widest my-6 text-purple-300 uppercase">
                    Engrave this Blessing
                </h4>
                <div className="grid grid-cols-3 gap-4">
                    {BLESSING_ENGRAVINGS.map(engraving => {
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
                        handleFallenPeaceWeaponAssign(weaponName);
                        setIsWeaponModalOpen(false);
                    }}
                    currentWeaponName={fallenPeaceWeaponName}
                />
            )}
            <div className="my-16 bg-black/20 p-8 rounded-lg border border-gray-800 overflow-x-auto">
                <SectionHeader>SIGIL TREE</SectionHeader>
                <div className="flex items-center min-w-max pb-8 px-4 justify-center">
                    
                    {/* Column 1: Root */}
                    <div className="flex flex-col justify-center h-[28rem]">
                        {renderSigilNode('left_brained')}
                    </div>

                    {/* Connector 1: Split */}
                    <svg className="w-16 h-[28rem] flex-shrink-0 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M 0 224 H 20" /> {/* Center Out */}
                        <path d="M 20 224 V 100 H 64" /> {/* Up to Top */}
                        <path d="M 20 224 V 348 H 64" /> {/* Down to Bottom */}
                    </svg>

                    {/* Column 2: Lobes 1 */}
                    <div className="flex flex-col justify-between h-[28rem]">
                        <div className="h-44 flex items-center justify-center">
                            {renderSigilNode('parietal_lobe')}
                        </div>
                        <div className="h-44 flex items-center justify-center">
                            {renderSigilNode('brocas_area')}
                        </div>
                    </div>

                    {/* Connector 2: Merge */}
                    <svg className="w-16 h-[28rem] flex-shrink-0 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M 0 100 H 44 V 224 H 64" /> {/* From Top to Center */}
                        <path d="M 0 348 H 44 V 224" />      {/* From Bottom to Center */}
                    </svg>

                    {/* Column 3: Frontal Lobe */}
                    <div className="flex flex-col justify-center h-[28rem]">
                        {renderSigilNode('frontal_lobe')}
                    </div>

                    {/* Connector 3: Split */}
                    <svg className="w-16 h-[28rem] flex-shrink-0 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M 0 224 H 20" /> {/* Center Out */}
                        <path d="M 20 224 V 100 H 64" /> {/* Up to Top */}
                        <path d="M 20 224 V 348 H 64" /> {/* Down to Bottom */}
                    </svg>

                    {/* Column 4: Lobes 2 */}
                    <div className="flex flex-col justify-between h-[28rem]">
                        <div className="h-44 flex items-center justify-center">
                            {renderSigilNode('cerebellum')}
                        </div>
                        <div className="h-44 flex items-center justify-center">
                            {renderSigilNode('temporal_lobe')}
                        </div>
                    </div>

                    {/* Connector 4: Merge */}
                    <svg className="w-16 h-[28rem] flex-shrink-0 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M 0 100 H 44 V 224 H 64" /> {/* From Top to Center */}
                        <path d="M 0 348 H 44 V 224" />      {/* From Bottom to Center */}
                    </svg>

                    {/* Column 5: Right Brained */}
                    <div className="flex flex-col justify-center h-[28rem]">
                        {renderSigilNode('right_brained')}
                    </div>

                </div>
            </div>
            <div className="mt-16">
                <SectionHeader>Telepathy</SectionHeader>
                <div className={`my-4 max-w-sm mx-auto p-4 border rounded-lg transition-all bg-black/20 ${ ctx.isTelepathyBoosted ? 'border-amber-400 ring-2 ring-amber-400/50 cursor-pointer hover:border-amber-300' : isTelepathyBoostDisabled ? 'border-gray-700 opacity-50 cursor-not-allowed' : 'border-gray-700 hover:border-amber-400/50 cursor-pointer'}`} onClick={!isTelepathyBoostDisabled ? () => ctx.handleFallenPeaceBoostToggle('telepathy') : undefined}>
                    <div className="flex items-center justify-center gap-4">
                        <img src="/images/zTm8fcLb-kaarn.png" alt="Kaarn Sigil" className="w-16 h-16"/>
                        <div className="text-left">
                            <h4 className="font-cinzel text-lg font-bold text-amber-300 tracking-widest">{ctx.isTelepathyBoosted ? 'BOOSTED' : 'BOOST'}</h4>
                            {!ctx.isTelepathyBoosted && <p className="text-xs text-gray-400 mt-1">Activating this will consume one Kaarn sigil.</p>}
                        </div>
                    </div>
                </div>
                <SectionSubHeader>Picks Available: {ctx.availableTelepathyPicks - ctx.selectedTelepathy.size} / {ctx.availableTelepathyPicks}</SectionSubHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" style={staticScaleStyle}>
                    {TELEPATHY_DATA.map(power => {
                        const boostedText = ctx.isTelepathyBoosted && boostDescriptions[power.id];
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
            <div className="mt-16">
                <SectionHeader>Mental Manipulation</SectionHeader>
                <div className={`my-4 max-w-sm mx-auto p-4 border rounded-lg transition-all bg-black/20 ${ ctx.isMentalManipulationBoosted ? 'border-amber-400 ring-2 ring-amber-400/50 cursor-pointer hover:border-amber-300' : isMentalManipulationBoostDisabled ? 'border-gray-700 opacity-50 cursor-not-allowed' : 'border-gray-700 hover:border-amber-400/50 cursor-pointer'}`} onClick={!isMentalManipulationBoostDisabled ? () => ctx.handleFallenPeaceBoostToggle('mentalManipulation') : undefined}>
                    <div className="flex items-center justify-center gap-4">
                        <img src="/images/Dg6nz0R1-purth.png" alt="Purth Sigil" className="w-16 h-16"/>
                        <div className="text-left">
                            <h4 className="font-cinzel text-lg font-bold text-amber-300 tracking-widest">{ctx.isMentalManipulationBoosted ? 'BOOSTED' : 'BOOST'}</h4>
                            {!ctx.isMentalManipulationBoosted && <p className="text-xs text-gray-400 mt-1">Activating this will consume one Purth sigil.</p>}
                        </div>
                    </div>
                </div>
                <SectionSubHeader>Picks Available: {ctx.availableMentalManipulationPicks - ctx.selectedMentalManipulation.size} / {ctx.availableMentalManipulationPicks}</SectionSubHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" style={staticScaleStyle}>
                    {(() => {
                        const specialPower = MENTAL_MANIPULATION_DATA.find(p => p.id === 'breaker_of_minds');
                        const otherPowers = MENTAL_MANIPULATION_DATA.filter(p => p.id !== 'breaker_of_minds');
                        
                        const firstHalf = otherPowers.slice(0, 3);
                        const secondHalf = otherPowers.slice(3);

                        const renderPower = (power: FallenPeacePower) => {
                            const boostedText = ctx.isMentalManipulationBoosted && boostDescriptions[power.id];
                            return <PowerCard 
                                key={power.id} 
                                power={{...power, cost: ''}} 
                                isSelected={ctx.selectedMentalManipulation.has(power.id)} 
                                onToggle={ctx.handleMentalManipulationSelect} 
                                isDisabled={isFallenPeacePowerDisabled(power, 'mental_manipulation')} 
                                fontSize={fontSize}
                            >
                                {boostedText && <BoostedEffectBox text={boostedText} />}
                            </PowerCard>
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
        </section>
    );
};
