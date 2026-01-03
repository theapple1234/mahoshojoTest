
import React, { useState, useEffect } from 'react';
import { useCharacterContext } from '../context/CharacterContext';
import { 
  DOMINIONS, TRAITS_DATA, HOUSES_DATA, HOUSE_UPGRADES_DATA,
  TRUE_SELF_TRAITS, ALTER_EGO_TRAITS, UNIFORMS_DATA, MAGICAL_STYLES_DATA,
  BUILD_TYPES_DATA
} from '../constants';
import type { Dominion } from '../types';
import { DominionCard } from './DominionCard';
import { PointCard } from './PointCard';
import { ChoiceCard } from './TraitCard';
import { SectionHeader, SectionSubHeader, VehicleIcon, CompanionIcon, HouseIcon } from './ui';
import { VehicleSelectionModal } from './VehicleSelectionModal';
import { CompanionSelectionModal } from './SigilTreeOptionCard';
import { BeastSelectionModal } from './BeastSelectionModal';
import { VacationHomeModal } from './VacationHomeModal';

interface CounterProps {
    label: string;
    count: number;
    onCountChange: (newCount: number) => void;
    unit: string;
    cost: string;
    displayMultiplier?: number;
}

const Counter: React.FC<CounterProps> = ({ label, count, onCountChange, unit, cost, displayMultiplier = 1 }) => (
    <div className="text-center">
        <label className="text-xs text-gray-300 font-semibold">{label} <span className={cost && cost.includes('FP') ? "text-green-400 font-bold" : "text-red-400 font-normal"}>({cost})</span></label>
        <div className="flex items-center justify-center gap-2 mt-1">
            <button onClick={(e) => { e.stopPropagation(); onCountChange(count - 1); }} disabled={count === 0} className="px-3 py-1 text-lg leading-none rounded bg-gray-800/50 border border-gray-700 hover:bg-gray-700 disabled:opacity-50">-</button>
            <span className="font-semibold text-white w-24 text-center">{count * displayMultiplier} {unit}</span>
            <button onClick={(e) => { e.stopPropagation(); onCountChange(count + 1); }} className="px-3 py-1 text-lg leading-none rounded bg-gray-800/50 border border-gray-700 hover:bg-gray-700 disabled:opacity-50">+</button>
        </div>
    </div>
);

const PARENT_IMAGES = [
    'https://i.ibb.co/PZJmzncs/parent1.png',
    'https://i.ibb.co/DPffzsyr/parent2.png'
];

const SIBLING_IMAGES = [
    'https://i.ibb.co/m58qFCRf/sib1.png',
    'https://i.ibb.co/99DpjRKC/sib2.png',
    'https://i.ibb.co/7JSPLK9W/sib3.png',
    'https://i.ibb.co/Fk5N4YbF/sib4.png'
];

export const PageOne: React.FC = () => {
    const {
        selectedDominionId,
        numParents, numSiblings, assignedTraits, selectedHouseId,
        selectedUpgrades, selectedTrueSelfTraits, selectedAlterEgoTraits,
        selectedUniforms, selectedMagicalStyles, selectedBuildTypeId,
        selectedFamilyMemberId, handleSelectFamilyMember,
        familyMemberNotes, handleFamilyMemberNoteChange,
        familyMemberImages, handleSetFamilyMemberImage,
        handleSelectDominion, handleNumParentsChange, handleNumSiblingsChange,
        handleTraitSelect, handleHouseSelect, handleUpgradeSelect,
        handleTrueSelfTraitSelect, handleAlterEgoTraitSelect,
        handleUniformSelect, handleMagicalStyleSelect, handleBuildTypeSelect,
        vacationHomes, // New state
        mansionExtraSqFt, handleMansionSqFtChange,
        islandExtraMiles, handleIslandMilesChange,
        vrChamberCostType, handleVrChamberCostSelect,
        assignedVehicleName, handleAssignVehicle,
        blessedCompanions, handleAssignBlessedCompanion,
        mythicalPetBeastName, handleAssignMythicalPet,
        inhumanAppearanceBeastName, handleAssignInhumanAppearance,
        fontSize
    } = useCharacterContext();

    const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
    const [isBlessedModalOpen, setIsBlessedModalOpen] = useState(false);
    const [isMythicalPetModalOpen, setIsMythicalPetModalOpen] = useState(false);
    const [isInhumanAppearanceModalOpen, setIsInhumanAppearanceModalOpen] = useState(false);
    const [isVacationHomeModalOpen, setIsVacationHomeModalOpen] = useState(false);


    const getFamilyMemberColor = (index: number): string => {
        const colors = [
            '#ef4444', // Red
            '#f97316', // Orange
            '#eab308', // Yellow
            '#22c55e', // Green
            '#0ea5e9', // Sky Blue
            '#3b82f6', // Blue
            '#a855f7', // Purple
        ];
        const rainbowColor = '#d946ef'; // Magenta as "rainbow"
        return index < colors.length ? colors[index] : rainbowColor;
    };
    
    const cycleImage = (id: string, pool: string[], defaultImage: string) => {
        const current = familyMemberImages.get(id) || defaultImage;
        const currentIndex = pool.indexOf(current);
        const nextIndex = (currentIndex + 1) % pool.length;
        handleSetFamilyMemberImage(id, pool[nextIndex]);
    };

    // Constant scale down to make base size small, but allow it to grow with settings.
    const smallBaseScaleStyle: React.CSSProperties = { zoom: 0.83333 };

    // Enforce Ragamuffin Logic
    useEffect(() => {
        if (numParents === 0 && numSiblings === 0) {
            // Must force Ragamuffin if no parents/siblings
            if (selectedHouseId !== 'ragamuffin') {
                handleHouseSelect('ragamuffin');
            }
        } else if (numParents > 0) {
            // If parents exist, cannot have Ragamuffin
            if (selectedHouseId === 'ragamuffin') {
                handleHouseSelect('ragamuffin'); // This toggles it off (sets to null)
            }
        }
    }, [numParents, numSiblings, selectedHouseId, handleHouseSelect]);

    return (
        <>
        {/* Stage I: Your Birth Section */}
        <section className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 mb-16">
            <div className="flex-shrink-0 relative">
            <img 
                src="https://i.ibb.co/DDHNTZDF/main2.png" 
                alt="Yasmin, the guide" 
                className="w-96 md:w-[36rem]"
            />
            </div>
            <div className="max-w-2xl text-center lg:text-left">
            <h2 className="text-2xl font-cinzel tracking-widest text-gray-400">STAGE I</h2>
            <h1 className="text-5xl font-bold font-cinzel my-2 text-white">YOUR BIRTH</h1>
            <hr className="border-gray-600 my-4" />
            <div className="text-gray-300 leading-relaxed mb-6 space-y-4">
                <p>Today, the Theosis Festival parades through the streets, celebrating the 500th anniversary of the day mankind finally ascended the Tower of Babel, and killed God.</p>
                <p>
                    Everyone knows what that means; the eagerly awaited annual birth of more mages, a few for every Dominion in the land! Millions of people travel miles to their respective capitals to witness these historic events. Leading the crowd is a strange, small girl with a cloak that glows with all the stars of the night sky. She is Yasmin, one of the countless mages that make up all the movers and shakers of this fractured verse. <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-300 to-purple-400 drop-shadow-[0_0_2px_rgba(192,38,211,0.5)]">“Come one, come all! The ceremony is about to begin — and this is one you won’t want to miss! The Mother tells me a few special mages are going to be born this year. That’s right; in her infinite generosity, the Mother is bequeathing unto us a few mages far more powerful than the standard this year. All part of her grand plan for all mankind, I’m sure,”</span> Yasmin cheers. Most of the crowd simply oos and aas. A few, the wiser among them, grimace nervously, knowing such drastic measures imply the Mother must be becoming truly desperate. <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-300 to-purple-400 drop-shadow-[0_0_2px_rgba(192,38,211,0.5)]">“I wonder if one of them will be born right here? There’s only one way to find out. Oooo, look, it’s starting!”</span>
                </p>
                <p>The crowd gathers closely around that swirling blue vortex, beholding in awe as the Mother of Azure guides the universe’s hand in the miraculous creation of life…</p>
            </div>
            <img 
                src="https://i.ibb.co/5gP1n3vK/main3.jpg" 
                alt="Swirling blue vortex" 
                className="rounded-lg shadow-lg shadow-blue-500/20 w-full max-w-lg mx-auto lg:mx-0" 
            />
            </div>
        </section>

        {/* Dominion Choice Section */}
        <section className="my-16">
            <SectionHeader>Choose the Dominion in which you shall be reborn</SectionHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {DOMINIONS.map((dominion: Dominion) => (
                <DominionCard
                key={dominion.id}
                dominion={dominion}
                isSelected={selectedDominionId === dominion.id}
                onSelect={handleSelectDominion}
                />
            ))}
            </div>
        </section>
        
        {/* Points & Intro Section */}
        <section className="mt-24 text-center max-w-7xl mx-auto">
            <hr className="border-gray-700 mb-8" />
            <p className="text-gray-400 italic leading-relaxed mb-12 max-w-4xl mx-auto text-sm">
            Earth, as it's been since the end of the Forsaken Age, is an utopia. Problems that once plagued mankind — poverty, starvation, disease, old age — have been all but eliminated. Even the lowest classes in this society live lives of incredible ease and comfort; but even the most aristocratic of mundanes burn with envy at the power and good fortune you shall enjoy, for your life has been blessed by the Mother herself...
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                <PointCard 
                    amount={100} 
                    pointName="BLESSING POINTS (BP)" 
                    description="for use on Stolen Blessings, enchantments, and other magical boons" 
                    color="purple" 
                    title="You start with" 
                    backgroundImage="https://i.ibb.co/Q3X6rTbD/BP.png"
                />
                <PointCard 
                    amount={100} 
                    pointName="FORTUNE POINTS (FP)" 
                    description="for use on friends, opportunities, strokes of luck, and other material comforts" 
                    color="green" 
                    title="You start with" 
                    backgroundImage="https://i.ibb.co/fYwqrgdr/FP.png"
                />
            </div>
            <div className="mt-6">
                <p className="text-white italic text-sm">
                Try not to spend too many of them on just one page! You will need them for future pages.
                </p>
                <p className="text-gray-400 text-xs mt-4">
                You can change the background music in the settings menu.
                </p>
            </div>
        </section>

        {/* Foster Family Section */}
        <section className="my-16 max-w-7xl mx-auto">
            <SectionHeader>Design the foster family that has been selected to raise you</SectionHeader>
            <div className="flex flex-col md:flex-row justify-center items-start gap-12 lg:gap-24 mb-12">
            {/* Parents Selector */}
            <div className="flex flex-col items-center flex-1">
                <img src="https://i.ibb.co/PZJmzncs/parent1.png" className="w-40 h-40 rounded-full mb-4" alt="Parent icon" />
                <h3 className="font-cinzel text-xl font-bold tracking-wider">PARENTS</h3>
                <div className="flex items-center justify-center gap-4 my-2 text-white">
                <button onClick={() => handleNumParentsChange(numParents - 1)} disabled={numParents === 0} className="px-3 py-1 rounded-md bg-gray-800/50 border border-gray-700 hover:bg-gray-700 disabled:opacity-50 transition-colors text-lg">-</button>
                <span className="text-xl font-semibold w-10 text-center">{numParents}</span>
                <button onClick={() => handleNumParentsChange(numParents + 1)} disabled={numParents === 6} className="px-3 py-1 rounded-md bg-gray-800/50 border border-gray-700 hover:bg-gray-700 disabled:opacity-50 transition-colors text-lg">+</button>
                </div>
                <div className="text-sm text-gray-400 text-center mt-2 max-w-xs bg-black/20 p-4 rounded-lg border border-gray-800">
                <p>Having 0 parents grants <span className="text-green-400 font-semibold">+20 FP</span>.</p>
                <p>Having 1 parent grants <span className="text-green-400 font-semibold">+10 FP</span>.</p>
                <p>Having 2 parents costs <span className="text-green-400 font-bold">0 FP</span>.</p>
                <p>Having 3 parents costs <span className="text-green-400 font-bold">-3 FP</span>.</p>
                <p>Having 4 parents costs <span className="text-green-400 font-bold">-6 FP</span>.</p>
                <p>And so on...</p>
                <hr className="border-gray-700 my-2" />
                <p className="italic text-xs">With each you purchased, you decide if they're a mother or father.</p>
                </div>
            </div>
            {/* Siblings Selector */}
            <div className="flex flex-col items-center flex-1">
                <img src="https://i.ibb.co/m58qFCRf/sib1.png" className="w-40 h-40 rounded-full mb-4" alt="Sibling icon" />
                <h3 className="font-cinzel text-xl font-bold tracking-wider">SIBLINGS</h3>
                <div className="flex items-center justify-center gap-4 my-2 text-white">
                <button onClick={() => handleNumSiblingsChange(numSiblings - 1)} disabled={numSiblings === 0} className="px-3 py-1 rounded-md bg-gray-800/50 border border-gray-700 hover:bg-gray-700 disabled:opacity-50 transition-colors text-lg">-</button>
                <span className="text-xl font-semibold w-10 text-center">{numSiblings}</span>
                <button onClick={() => handleNumSiblingsChange(numSiblings + 1)} disabled={numSiblings === 8} className="px-3 py-1 rounded-md bg-gray-800/50 border border-gray-700 hover:bg-gray-700 disabled:opacity-50 transition-colors text-lg">+</button>
                </div>
                <div className="text-sm text-gray-400 text-center mt-2 max-w-xs bg-black/20 p-4 rounded-lg border border-gray-800">
                <p>Having 0 siblings costs <span className="text-green-400 font-bold">0 FP</span>.</p>
                <p>Having 1 sibling costs <span className="text-green-400 font-bold">-3 FP</span>.</p>
                <p>Having 2 siblings costs <span className="text-green-400 font-bold">-6 FP</span>.</p>
                <p>Having 3 siblings costs <span className="text-green-400 font-bold">-9 FP</span>.</p>
                <p>And so on...</p>
                <hr className="border-gray-700 my-2" />
                <p className="italic text-xs">With each you purchased, you decide if they're a brother or sister, and if you're older, younger, or twins.</p>
                </div>
            </div>
            </div>
            <SectionSubHeader>Select a family member below to assign <span className="text-white font-bold">Traits</span> to them. Each member has a unique color. Each person can only have one negative trait. Click the circular refresh icon to change their portrait.</SectionSubHeader>
            
            <div className="flex justify-center items-center gap-4 mb-12 flex-wrap bg-black/20 p-4 rounded-lg border border-gray-800 min-h-[104px]">
                {numParents === 0 && numSiblings === 0 && (
                    <p className="text-gray-500 italic">No family members have been added.</p>
                )}
                {Array.from({ length: numParents }).map((_, i) => {
                    const memberId = `parent-${i}`;
                    const color = getFamilyMemberColor(i);
                    const isSelected = selectedFamilyMemberId === memberId;
                    
                    // Logic for default image: Parent 2 gets the second image
                    const defaultImage = i === 1 ? PARENT_IMAGES[1] : PARENT_IMAGES[0];
                    const imageSrc = familyMemberImages.get(memberId) || defaultImage;

                    return (
                        <div key={memberId} onClick={() => handleSelectFamilyMember(memberId)} className="cursor-pointer flex flex-col items-center gap-2 group/avatar relative" title={`Parent ${i + 1}`}>
                            <div className="relative">
                                <div className={`w-16 h-16 rounded-full p-1 transition-all ring-offset-2 ring-offset-[#0a101f] ${isSelected ? 'ring-2' : ''}`} style={{ '--tw-ring-color': color } as React.CSSProperties}>
                                    <img src={imageSrc} className="w-full h-full object-cover rounded-full" alt={`Parent ${i+1}`} />
                                </div>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); cycleImage(memberId, PARENT_IMAGES, defaultImage); }}
                                    className="absolute -top-1 -right-1 p-1 bg-black/80 rounded-full text-white/70 hover:text-white border border-gray-600 hover:border-white transition-all opacity-0 group-hover/avatar:opacity-100 shadow-md z-10"
                                    title="Change Portrait"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                </button>
                            </div>
                            <span className="text-xs text-gray-400">Parent {i+1}</span>
                            <input 
                                type="text" 
                                placeholder="Details..." 
                                value={familyMemberNotes.get(memberId) || ''}
                                onChange={(e) => handleFamilyMemberNoteChange(memberId, e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                className="w-24 px-1 py-0.5 text-[0.625rem] bg-gray-900 border border-gray-700 rounded text-gray-300 placeholder-gray-600 focus:outline-none focus:border-cyan-500 text-center"
                            />
                        </div>
                    )
                })}
                {Array.from({ length: numSiblings }).map((_, i) => {
                    const memberId = `sibling-${i}`;
                    const color = getFamilyMemberColor(numParents + i);
                    const isSelected = selectedFamilyMemberId === memberId;
                    const defaultImage = SIBLING_IMAGES[0];
                    const imageSrc = familyMemberImages.get(memberId) || defaultImage;

                    return (
                        <div key={memberId} onClick={() => handleSelectFamilyMember(memberId)} className="cursor-pointer flex flex-col items-center gap-2 group/avatar relative" title={`Sibling ${i + 1}`}>
                             <div className="relative">
                                <div className={`w-16 h-16 rounded-full p-1 transition-all ring-offset-2 ring-offset-[#0a101f] ${isSelected ? 'ring-2' : ''}`} style={{ '--tw-ring-color': color } as React.CSSProperties}>
                                    <img src={imageSrc} className="w-full h-full object-cover rounded-full" alt={`Sibling ${i+1}`} />
                                </div>
                                 <button 
                                    onClick={(e) => { e.stopPropagation(); cycleImage(memberId, SIBLING_IMAGES, defaultImage); }}
                                    className="absolute -top-1 -right-1 p-1 bg-black/80 rounded-full text-white/70 hover:text-white border border-gray-600 hover:border-white transition-all opacity-0 group-hover/avatar:opacity-100 shadow-md z-10"
                                    title="Change Portrait"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                </button>
                            </div>
                            <span className="text-xs text-gray-400">Sibling {i+1}</span>
                            <input 
                                type="text" 
                                placeholder="Details..." 
                                value={familyMemberNotes.get(memberId) || ''}
                                onChange={(e) => handleFamilyMemberNoteChange(memberId, e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                className="w-24 px-1 py-0.5 text-[0.625rem] bg-gray-900 border border-gray-700 rounded text-gray-300 placeholder-gray-600 focus:outline-none focus:border-cyan-500 text-center"
                            />
                        </div>
                    )
                })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...TRAITS_DATA.positive, ...TRAITS_DATA.negative].map(trait => {
                const [memberType] = selectedFamilyMemberId ? selectedFamilyMemberId.split('-') : [null];
                let isTraitDisabled = false;

                // Rule 1: Family-member specific traits
                const memberSpecificTraits: { [key: string]: string[] } = {
                    'loaded': ['parent'],
                    'abusive': ['parent'],
                    'disobedient': ['sibling'],
                    'strict': ['parent', 'sibling'],
                    'forgiving': ['parent', 'sibling'],
                };

                if (memberSpecificTraits[trait.id]) {
                    if (!memberType || !memberSpecificTraits[trait.id].includes(memberType)) {
                        isTraitDisabled = true;
                    }
                }

                // Rule 2: Negative trait limit (only one per person)
                const isCurrentTraitNegative = TRAITS_DATA.negative.some(t => t.id === trait.id);
                if (selectedFamilyMemberId && isCurrentTraitNegative && !isTraitDisabled) {
                    const memberTraits = assignedTraits.get(selectedFamilyMemberId) || new Set<string>();
                    const memberHasNegativeTrait = [...memberTraits].some(tId => TRAITS_DATA.negative.some(nt => nt.id === tId));

                    if (memberHasNegativeTrait && !memberTraits.has(trait.id)) {
                        isTraitDisabled = true;
                    }
                }
                
                // Rule 3: Incompatibility between 'Strict' and 'Forgiving'
                if (selectedFamilyMemberId && !isTraitDisabled) {
                    const memberTraits = assignedTraits.get(selectedFamilyMemberId) || new Set<string>();
                    if (trait.id === 'strict' && memberTraits.has('forgiving')) {
                        isTraitDisabled = true;
                    }
                    if (trait.id === 'forgiving' && memberTraits.has('strict')) {
                        isTraitDisabled = true;
                    }
                }

                const allAssignmentsForTrait = Array.from(assignedTraits.entries())
                    .filter(entry => entry[1].has(trait.id));
                
                let isSelectedForCard = false;
                let displayedColors: string[] = [];

                if (selectedFamilyMemberId) {
                    const selectedMemberAssignment = allAssignmentsForTrait.find(entry => entry[0] === selectedFamilyMemberId);
                    if (selectedMemberAssignment) {
                        isSelectedForCard = true;
                        const memberId = selectedMemberAssignment[0];
                        const [type, indexStr] = memberId.split('-');
                        const index = parseInt(indexStr, 10);
                        const colorIndex = type === 'parent' ? index : numParents + index;
                        displayedColors.push(getFamilyMemberColor(colorIndex));
                    }
                } else {
                    isSelectedForCard = allAssignmentsForTrait.length > 0;
                    displayedColors = allAssignmentsForTrait.map(entry => {
                        const memberId = entry[0];
                        const [type, indexStr] = memberId.split('-');
                        const index = parseInt(indexStr, 10);
                        const colorIndex = type === 'parent' ? index : numParents + index;
                        return getFamilyMemberColor(colorIndex);
                    });
                }

                const isBlessedTrait = trait.id === 'blessed';
                const selectedMemberHasBlessed = selectedFamilyMemberId ? (assignedTraits.get(selectedFamilyMemberId)?.has('blessed') ?? false) : false;
                
                return (
                    <ChoiceCard 
                        key={trait.id} 
                        item={trait} 
                        isSelected={isSelectedForCard} 
                        assignedColors={displayedColors} 
                        onSelect={handleTraitSelect} 
                        disabled={!selectedFamilyMemberId || isTraitDisabled}
                        layout="horizontal" 
                        imageShape="rect" 
                        aspect="square"
                        iconButton={isBlessedTrait && selectedMemberHasBlessed ? <CompanionIcon /> : undefined}
                        onIconButtonClick={isBlessedTrait && selectedMemberHasBlessed ? () => setIsBlessedModalOpen(true) : undefined}
                    >
                         {isBlessedTrait && selectedMemberHasBlessed && blessedCompanions.get(selectedFamilyMemberId) && (
                            <div className="text-center mt-2">
                                <p className="text-xs text-gray-400">Assigned:</p>
                                <p className="text-sm font-bold text-cyan-300">{blessedCompanions.get(selectedFamilyMemberId)}</p>
                            </div>
                        )}
                    </ChoiceCard>
                );
            })}
            </div>
        </section>

        {/* House Section */}
        <section className="my-16">
            <SectionSubHeader>What kind of house does your family own? Your default house will be in your Dominion of birth, but you can also buy extra <span className="text-white font-bold">Vacation Homes</span> in any dominion you choose, for <span className="text-green-400 font-bold">-3 FP</span> each.</SectionSubHeader>
            <div className="flex justify-center mb-8">
                <button 
                    onClick={() => setIsVacationHomeModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-2 bg-black/40 border border-gray-700 hover:border-cyan-500 rounded-lg text-gray-300 hover:text-white transition-all group"
                >
                    <HouseIcon />
                    <span>Manage Vacation Homes</span>
                    <span className="bg-cyan-900/40 text-cyan-200 px-2 py-0.5 rounded text-xs font-bold border border-cyan-700/50 group-hover:bg-cyan-800/60">
                        {vacationHomes.length} Configured
                    </span>
                </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {HOUSES_DATA.map(house => {
                    const isRagamuffin = house.id === 'ragamuffin';
                    const isForcedRagamuffin = numParents === 0 && numSiblings === 0;
                    
                    let isDisabled = false;
                    if (isRagamuffin) {
                        if (numParents > 0) isDisabled = true;
                    } else {
                        if (isForcedRagamuffin) isDisabled = true;
                    }

                    return (
                        <ChoiceCard 
                            key={house.id} 
                            item={house} 
                            isSelected={selectedHouseId === house.id} 
                            onSelect={(id) => {
                                if (isForcedRagamuffin && id === 'ragamuffin') return;
                                handleHouseSelect(id);
                            }}
                            disabled={isDisabled}
                        >
                            {house.id === 'mansion' && (
                                <Counter label="Additional Space" count={mansionExtraSqFt} onCountChange={handleMansionSqFtChange} unit="sq ft" cost="-1 FP per 1,000" displayMultiplier={1000} />
                            )}
                        </ChoiceCard>
                    );
                })}
            </div>
        </section>

        {/* House Upgrades Section */}
        <section className="my-16">
            <SectionSubHeader>And just like buying traits for your family, you can buy <span className="text-white font-bold">Upgrades</span> for your houses! The same rules apply.</SectionSubHeader>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {HOUSE_UPGRADES_DATA.map(upgrade => {
                    const isVrChamber = upgrade.id === 'virtual_reality';
                    const isMythicalPet = upgrade.id === 'mythical_pet';
                    const isMythicalPetSelected = selectedUpgrades.has('mythical_pet');

                    // Negative Upgrade Mutual Exclusivity Logic
                    const negativeUpgrades = ['creepy_crawlies', 'terrible_neighbors', 'haunted'];
                    const isCurrentNegative = negativeUpgrades.includes(upgrade.id);
                    // Check if *any* other negative upgrade is selected
                    const otherNegativeSelected = negativeUpgrades.some(id => id !== upgrade.id && selectedUpgrades.has(id));

                    let isDisabled = false;
                    if (isCurrentNegative && otherNegativeSelected) {
                        isDisabled = true;
                    }

                    // Existing Neighbors Logic (Specific check for Great vs Terrible)
                    if (upgrade.id === 'great_neighbors' && selectedUpgrades.has('terrible_neighbors')) {
                        isDisabled = true;
                    }
                    if (upgrade.id === 'terrible_neighbors' && selectedUpgrades.has('great_neighbors')) {
                        isDisabled = true;
                    }

                    return (
                        <ChoiceCard
                            key={upgrade.id}
                            item={upgrade}
                            isSelected={isVrChamber ? vrChamberCostType !== null : selectedUpgrades.has(upgrade.id)}
                            alwaysShowChildren={isVrChamber ? selectedUpgrades.has(upgrade.id) : false}
                            onSelect={handleUpgradeSelect}
                            disabled={isDisabled}
                            iconButton={isMythicalPet && isMythicalPetSelected ? <CompanionIcon /> : undefined}
                            onIconButtonClick={isMythicalPet && isMythicalPetSelected ? () => setIsMythicalPetModalOpen(true) : undefined}
                            imageAspectRatio="aspect-square" // Added prop
                        >
                        {upgrade.id === 'private_island' && (
                            <Counter label="Additional Space" count={islandExtraMiles} onCountChange={handleIslandMilesChange} unit="sq miles" cost="-1 FP each" displayMultiplier={1} />
                        )}
                        {upgrade.id === 'virtual_reality' && (
                            <div className="flex justify-center gap-2">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleVrChamberCostSelect('fp'); }}
                                        className={`px-3 py-1 text-xs rounded border transition-colors ${vrChamberCostType === 'fp' ? 'bg-green-800/50 border-green-500' : 'bg-gray-800/50 border-gray-700 hover:border-green-500/50'}`}
                                    >
                                        <span className="text-green-400 font-bold">-5 FP</span>
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleVrChamberCostSelect('bp'); }}
                                        className={`px-3 py-1 text-xs rounded border transition-colors ${vrChamberCostType === 'bp' ? 'bg-purple-800/50 border-purple-500' : 'bg-gray-800/50 border-gray-700 hover:border-purple-500/50'}`}
                                    >
                                        <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-300 to-purple-400 drop-shadow-[0_0_2px_rgba(192,38,211,0.5)]">-2 BP</span>
                                    </button>
                            </div>
                        )}
                        {isMythicalPet && isMythicalPetSelected && mythicalPetBeastName && (
                            <div className="text-center mt-2">
                                <p className="text-xs text-gray-400">Assigned:</p>
                                <p className="text-sm font-bold text-cyan-300">{mythicalPetBeastName}</p>
                            </div>
                        )}
                        </ChoiceCard>
                    );
                })}
            </div>
        </section>

        {/* True Self Section */}
        <section className="my-16">
            <SectionHeader>DESIGN YOURSELF AND YOUR ALTER EGO</SectionHeader>
            <div className="flex flex-col md:flex-row items-center gap-8 mb-12 max-w-6xl mx-auto px-4">
                 <div className="hidden md:block w-96 h-96 flex-shrink-0 rounded-full overflow-hidden border-4 border-gray-700 shadow-xl shadow-purple-900/20">
                    <img src="https://i.ibb.co/hxkBp4M6/main4.jpg" alt="Alter Ego" className="w-full h-full object-cover" />
                 </div>
                 <div className="flex-grow border-l-2 border-gray-600 pl-6 py-2">
                    <p className="text-gray-300 leading-relaxed text-justify text-sm">
                        In around the 3000's, the Magus councils and secret societies began to rethink the raising of Mages. It was found being a celebrity from early childhood often had a harmful effect on their psychological development; worse, their enemies would often force them into acquiescing by threatening to go after their family members and other loved ones. Thus, the Dominions agreed on the establishment of the <strong className="text-white">Alter Ego</strong> system. You will have two forms: your alter ego, who will be known by all, and your secret identity, whose location and nature will be kept confidential. Memory wiping cantrips can easily be used in the case someone accidentally finds out about your identity. Most people support mages, and will thus happily submit to this process: however, some may want to use their knowledge to sabotage you, so be careful! You will be able to transform between your real self and your alter ego at will, though this will take a few seconds.
                    </p>
                 </div>
            </div>
            
            <SectionSubHeader>Here, you can purchase traits for your <span className="text-white font-bold">True Self</span>.</SectionSubHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {TRUE_SELF_TRAITS.map(trait => (
                    <ChoiceCard 
                        key={trait.id} 
                        item={trait} 
                        isSelected={selectedTrueSelfTraits.has(trait.id)} 
                        onSelect={handleTrueSelfTraitSelect} 
                    />
                ))}
            </div>
        </section>

        {/* Alter Ego Section */}
        <section className="my-16">
            <SectionSubHeader>Here, you can purchase traits for your <span className="text-white font-bold">Alter Ego</span>.</SectionSubHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {ALTER_EGO_TRAITS.map(trait => {
                    const isInhumanAppearance = trait.id === 'inhuman_appearance';
                    const isSignatureVehicle = trait.id === 'signature_vehicle';
                    const isSelected = selectedAlterEgoTraits.has(trait.id);
                    
                    let isDisabled = false;
                    if (trait.id === 'inhuman_appearance' && !selectedAlterEgoTraits.has('exotic_appearance')) isDisabled = true;
                    if (trait.id === 'exotic_appearance' && !selectedAlterEgoTraits.has('unique_appearance')) isDisabled = true;

                    return (
                        <ChoiceCard 
                            key={trait.id} 
                            item={trait} 
                            isSelected={isSelected} 
                            onSelect={handleAlterEgoTraitSelect} 
                            disabled={isDisabled}
                            iconButton={
                                (isInhumanAppearance && isSelected) ? <CompanionIcon /> :
                                (isSignatureVehicle && isSelected) ? <VehicleIcon /> : undefined
                            }
                            onIconButtonClick={
                                (isInhumanAppearance && isSelected) ? () => setIsInhumanAppearanceModalOpen(true) :
                                (isSignatureVehicle && isSelected) ? () => setIsVehicleModalOpen(true) : undefined
                            }
                        >
                            {/* FIX: Fixed typo in variable name 'inhhumanAppearanceBeastName' to 'inhumanAppearanceBeastName' */}
                            {isInhumanAppearance && isSelected && inhumanAppearanceBeastName && (
                                <div className="text-center mt-2">
                                    <p className="text-xs text-gray-400">Assigned:</p>
                                    <p className="text-sm font-bold text-cyan-300">{inhumanAppearanceBeastName}</p>
                                </div>
                            )}
                            {isSignatureVehicle && isSelected && assignedVehicleName && (
                                <div className="text-center mt-2">
                                    <p className="text-xs text-gray-400">Assigned:</p>
                                    <p className="text-sm font-bold text-cyan-300">{assignedVehicleName}</p>
                                </div>
                            )}
                        </ChoiceCard>
                    );
                })}
            </div>
        </section>

        {/* Uniform Section */}
        <section className="my-16">
            <SectionSubHeader>Your Alter Ego will also need a distinctive uniform! Choose one for free. You can also buy extras for <span className="text-green-400 font-bold">-1 FP</span> each.</SectionSubHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6" style={smallBaseScaleStyle}>
                {UNIFORMS_DATA.map(uniform => {
                    const isSelected = selectedUniforms.includes(uniform.id);
                    const isFirstSelection = selectedUniforms.length > 0 && selectedUniforms[0] === uniform.id;
                    const isFree = selectedUniforms.length === 0 || isFirstSelection;

                    const displayItem = {
                        ...uniform,
                        cost: isSelected && isFree ? 'Free' : (isSelected && !isFree ? uniform.cost : (selectedUniforms.length > 0 ? uniform.cost : 'Free'))
                    };
                    
                    return (
                        <ChoiceCard 
                            key={uniform.id} 
                            item={displayItem} 
                            isSelected={isSelected} 
                            onSelect={handleUniformSelect}
                            layout="horizontal-tall"
                        />
                    );
                })}
            </div>
        </section>

        {/* Magical Styles Section */}
        <section className="my-16">
            <SectionHeader className="mb-2">Choose Your Magical Style</SectionHeader>
            <p className="text-center italic max-w-5xl mx-auto text-sm mb-8 text-gray-400">
                You can also choose your <b className="text-white">Magical Style</b>! This is a purely visual upgrade applied to your spells; for example, if you choose <b className="text-white">Fire</b>, you can have a gust of flame bellowing behind you whenever you fly around. This helps distinguish you from the other mages! You can even buy multiple styles, and either mix & match them, or apply different styles to different Blessings.<br /><br />
                <b className="text-white">Note</b>: this is not the same thing as having control over an element. It's purely visual.
            </p>
            <div className="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-10 gap-4">
                {MAGICAL_STYLES_DATA.map(style => {
                    const title = style.title.replace('/', '/\n');
                    return (
                        <ChoiceCard 
                            key={style.id} 
                            item={{...style, title}} 
                            isSelected={selectedMagicalStyles.has(style.id)} 
                            onSelect={handleMagicalStyleSelect}
                            disabled={false}
                            layout="vertical"
                            imageAspectRatio="aspect-square" // Changed from aspect="square"
                            objectFit="cover" // Added for clarity, though default is cover if aspect is not square
                            textScale={0.9}
                        />
                    );
                })}
            </div>
        </section>
        
        {/* Build Type Section */}
        <section className="my-16">
            <SectionHeader>SELECT THE KIND OF BUILD YOU DESIRE</SectionHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                {BUILD_TYPES_DATA.map(buildType => (
                    <ChoiceCard 
                        key={buildType.id} 
                        item={buildType} 
                        isSelected={selectedBuildTypeId === buildType.id} 
                        onSelect={handleBuildTypeSelect}
                        textScale={fontSize === 'large' ? 1.25 : 1}
                        descriptionSizeClass={fontSize === 'large' ? 'text-sm' : undefined}
                    />
                ))}
            </div>
        </section>
        {isVehicleModalOpen && (
            <VehicleSelectionModal 
                currentVehicleName={assignedVehicleName} 
                onClose={() => setIsVehicleModalOpen(false)} 
                onSelect={(name) => {
                    handleAssignVehicle(name);
                    setIsVehicleModalOpen(false);
                }}
            />
        )}
        {isBlessedModalOpen && selectedFamilyMemberId && (
            <CompanionSelectionModal
                currentCompanionName={blessedCompanions.get(selectedFamilyMemberId) || null}
                onClose={() => setIsBlessedModalOpen(false)}
                onSelect={(name) => {
                    handleAssignBlessedCompanion(selectedFamilyMemberId, name);
                    setIsBlessedModalOpen(false);
                }}
                pointLimit={35}
                title={`Assign a Blessed Companion for ${selectedFamilyMemberId.split('-')[0].charAt(0).toUpperCase() + selectedFamilyMemberId.split('-')[0].slice(1)} ${parseInt(selectedFamilyMemberId.split('-')[1]) + 1}`}
                categoryFilter="mage"
            />
        )}
        {isMythicalPetModalOpen && (
             <BeastSelectionModal
                currentBeastName={mythicalPetBeastName}
                onClose={() => setIsMythicalPetModalOpen(false)}
                onSelect={(name) => {
                    handleAssignMythicalPet(name);
                    setIsMythicalPetModalOpen(false);
                }}
                pointLimit={30}
                title="Assign Mythical Pet"
            />
        )}
        {isInhumanAppearanceModalOpen && (
             <BeastSelectionModal
                currentBeastName={inhumanAppearanceBeastName}
                onClose={() => setIsInhumanAppearanceModalOpen(false)}
                onSelect={(name) => {
                    handleAssignInhumanAppearance(name);
                    setIsInhumanAppearanceModalOpen(false);
                }}
                pointLimit={40}
                title="Assign Inhuman Appearance"
                excludedPerkIds={['chatterbox_beast', 'magical_beast']}
            />
        )}
        {isVacationHomeModalOpen && (
            <VacationHomeModal onClose={() => setIsVacationHomeModalOpen(false)} />
        )}
        </>
    );
};
