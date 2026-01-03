
import React, { useState, useEffect } from 'react';
import { useCharacterContext } from '../../context/CharacterContext';
import { WORLDLY_WISDOM_DATA, WORLDLY_WISDOM_SIGIL_TREE_DATA, ELEANORS_TECHNIQUES_DATA, GENEVIEVES_TECHNIQUES_DATA, BLESSING_ENGRAVINGS } from '../../constants';
import type { WorldlyWisdomPower, WorldlyWisdomSigil, ChoiceItem, MagicGrade } from '../../types';
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
        fontSize
    } = useCharacterContext();

    const finalEngraving = worldlyWisdomEngraving ?? selectedBlessingEngraving;
    const isSkinEngraved = finalEngraving === 'skin';

    useEffect(() => {
        if (!isSkinEngraved && isWorldlyWisdomMagicianApplied) {
            disableWorldlyWisdomMagician();
        }
    }, [isSkinEngraved, isWorldlyWisdomMagicianApplied, disableWorldlyWisdomMagician]);

    const isWorldlyWisdomPowerDisabled = (power: WorldlyWisdomPower, type: 'eleanors' | 'genevieves'): boolean => {
        const selectedSet = type === 'eleanors' ? ctx.selectedEleanorsTechniques : ctx.selectedGenevievesTechniques;
        const availablePicks = type === 'eleanors' ? ctx.availableEleanorsPicks : ctx.availableGenevievesPicks;

        if (!selectedSet.has(power.id) && selectedSet.size >= availablePicks) return true;
        
        if (power.requires) {
            const allSelectedPowersAndSigils = new Set([...ctx.selectedEleanorsTechniques, ...ctx.selectedGenevievesTechniques, ...ctx.selectedWorldlyWisdomSigils]);
            if (!power.requires.every(req => allSelectedPowersAndSigils.has(req))) return true;
        }
        
        if (power.specialRequirement === 'requires_3_eleanor') {
             if (ctx.selectedEleanorsTechniques.size < 3 && !selectedSet.has(power.id)) return true;
        }

        return false;
    };

    const isWorldlyWisdomSigilDisabled = (sigil: WorldlyWisdomSigil): boolean => {
        if (ctx.selectedWorldlyWisdomSigils.has(sigil.id)) return false; // Can always deselect
        if (!sigil.prerequisites.every(p => ctx.selectedWorldlyWisdomSigils.has(p))) return true;
        
        // KP check
        if (kpPaidNodes.has(String(sigil.id))) return false;

        const sigilType = getSigilTypeFromImage(sigil.imageSrc);
        const sigilCost = sigilType ? 1 : 0;
        if (sigilType && ctx.availableSigilCounts[sigilType] < sigilCost) return true;

        return false;
    };

    const getWorldlyWisdomSigil = (id: string) => WORLDLY_WISDOM_SIGIL_TREE_DATA.find(s => s.id === id)!;

    const getSigilDisplayInfo = (sigil: WorldlyWisdomSigil): { color: SigilColor, benefits: React.ReactNode } => {
        const colorMap: Record<string, SigilColor> = {
            'Arborealist': 'orange', 
            'Sanctified': 'green', 
            'Healer': 'gray', 
            'Dark Art': 'purple',
        };
        const color = colorMap[sigil.type] || 'gray';
        const benefits = (
            <>
                {sigil.benefits.eleanors ? <p className="text-green-300">+ {sigil.benefits.eleanors} Eleanor's Techniques</p> : null}
                {sigil.benefits.genevieves ? <p className="text-purple-300">+ {sigil.benefits.genevieves} Genevieve's Techniques</p> : null}
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

    const boostDescriptions: { [key: string]: string } = {
        healing_bliss: "Heals slightly faster generally; once per day, can heal twice as fast.",
        defensive_circle: "Can be cast instantly and is mobile, following you.",
        rejuvenating_bolt: "Charge time is halved.",
        guardian_angels: "Can create up to 6 angels.",
        psychic_surgery: "Can perform surgeries on oneself, albeit painfully.",
        chloromancy: "Doubles range and speed of plant growth.",
        botanic_mistresses: "Dryads last for a full day.",
        maneaters: "Plants are much more durable and resistant to damage.",
        flashback: "Can revert time on a target by up to 24 hours.",
        sustaining_bond: "Can bond with up to 3 people.",
        tree_of_life: "Revival ability can be used twice.",
        the_reinmans_curse: "Curse takes effect much faster."
    };

    const isEleanorsBoostDisabled = !ctx.isEleanorsTechniquesBoosted && ctx.availableSigilCounts.kaarn <= 0;
    const isGenevievesBoostDisabled = !ctx.isGenevievesTechniquesBoosted && ctx.availableSigilCounts.purth <= 0;

    const isMagicianSelected = selectedTrueSelfTraits.has('magician');
    const additionalCost = Math.floor(worldlyWisdomSigilTreeCost * 0.25);

    // Style to counteract global zoom for specific sections
    // Global Large is 120%. 1 / 1.2 = 0.83333
    const staticScaleStyle: React.CSSProperties = fontSize === 'large' ? { zoom: 0.83333 } : {};

    return (
        <section>
            <BlessingIntro {...WORLDLY_WISDOM_DATA} />
            <div className="mt-8 mb-16 max-w-3xl mx-auto">
                <h4 className="font-cinzel text-xl text-center tracking-widest my-6 text-purple-300 uppercase">
                    Engrave this Blessing
                </h4>
                <div className="grid grid-cols-3 gap-4">
                    {BLESSING_ENGRAVINGS.map(engraving => {
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
                        handleWorldlyWisdomWeaponAssign(weaponName);
                        setIsWeaponModalOpen(false);
                    }}
                    currentWeaponName={worldlyWisdomWeaponName}
                />
            )}

            <div className="my-16 bg-black/20 p-8 rounded-lg border border-gray-800 overflow-x-auto">
                <SectionHeader>SIGIL TREE</SectionHeader>
                <div className="flex items-center min-w-max pb-8 px-4 justify-center">
                    
                    {/* Column 1: Root */}
                    <div className="flex flex-col justify-center h-[32rem]">
                        {renderSigilNode('arborealist')}
                    </div>

                    {/* SVG Connector 1 (Split) */}
                    <svg className="w-16 h-[32rem] flex-shrink-0 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M 0 228 H 32" /> {/* Center Out */}
                        <path d="M 32 100 V 356" /> {/* Vertical Line */}
                        <path d="M 32 100 H 64" /> {/* Top Out */}
                        <path d="M 32 356 H 64" /> {/* Bottom Out */}
                    </svg>

                    {/* Column 2 */}
                    <div className="flex flex-col justify-between h-[32rem]">
                        <div className="h-64 flex items-center justify-center">
                            {renderSigilNode('sanctified_i')}
                        </div>
                        <div className="h-64 flex items-center justify-center">
                            {renderSigilNode('healer_i')}
                        </div>
                    </div>

                    {/* SVG Connector 2 (Branch Up from Bottom) */}
                    <svg className="w-12 h-[32rem] flex-shrink-0 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M 0 356 H 24" /> {/* Healer I Out */}
                        <path d="M 24 356 V 100 H 48" /> {/* Branch Up to Healer II */}
                        <path d="M 24 356 H 48" /> {/* Continue Straight to Healer III */}
                    </svg>

                    {/* Column 3 */}
                    <div className="flex flex-col justify-between h-[32rem]">
                        <div className="h-64 flex items-center justify-center">
                            {renderSigilNode('healer_ii')}
                        </div>
                        <div className="h-64 flex items-center justify-center">
                            {renderSigilNode('healer_iii')}
                        </div>
                    </div>

                    {/* SVG Connector 3 (Straight) */}
                    <svg className="w-12 h-[32rem] flex-shrink-0 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M 0 100 H 48" /> {/* Lifted */}
                        <path d="M 0 356 H 48" /> {/* Lifted */}
                    </svg>

                    {/* Column 4 */}
                    <div className="flex flex-col justify-between h-[32rem]">
                        <div className="h-64 flex items-center justify-center">
                             {renderSigilNode('sanctified_ii')}
                        </div>
                        <div className="h-64 flex items-center justify-center">
                            {renderSigilNode('healer_iv')}
                        </div>
                    </div>

                    {/* SVG Connector 4 (Branch Up from Bottom) */}
                    <svg className="w-12 h-[32rem] flex-shrink-0 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M 0 356 H 24" /> {/* Healer IV In */}
                        <path d="M 24 356 V 100 H 48" /> {/* Branch Up to Dark Art */}
                        <path d="M 24 356 H 48" /> {/* Branch Straight to Sanctified III */}
                    </svg>

                    {/* Column 5 */}
                    <div className="flex flex-col justify-between h-[32rem]">
                        <div className="h-64 flex items-center justify-center">
                            {renderSigilNode('dark_art')}
                        </div>
                        <div className="h-64 flex items-center justify-center">
                            {renderSigilNode('sanctified_iii')}
                        </div>
                    </div>

                </div>
            </div>

            <div className="mt-16 px-4 lg:px-8">
                <SectionHeader>Eleanor's Techniques</SectionHeader>
                <div className={`my-4 max-w-sm mx-auto p-4 border rounded-lg transition-all bg-black/20 ${ ctx.isEleanorsTechniquesBoosted ? 'border-amber-400 ring-2 ring-amber-400/50 cursor-pointer hover:border-amber-300' : isEleanorsBoostDisabled ? 'border-gray-700 opacity-50 cursor-not-allowed' : 'border-gray-700 hover:border-amber-400/50 cursor-pointer'}`} onClick={!isEleanorsBoostDisabled ? () => ctx.handleWorldlyWisdomBoostToggle('eleanorsTechniques') : undefined}>
                    <div className="flex items-center justify-center gap-4">
                        <img src="https://i.ibb.co/zTm8fcLb/kaarn.png" alt="Kaarn Sigil" className="w-16 h-16"/>
                        <div className="text-left">
                            <h4 className="font-cinzel text-lg font-bold text-amber-300 tracking-widest">{ctx.isEleanorsTechniquesBoosted ? 'BOOSTED' : 'BOOST'}</h4>
                            {!ctx.isEleanorsTechniquesBoosted && <p className="text-xs text-gray-400 mt-1">Activating this will consume one Kaarn sigil.</p>}
                        </div>
                    </div>
                </div>
                <SectionSubHeader>Picks Available: {ctx.availableEleanorsPicks - ctx.selectedEleanorsTechniques.size} / {ctx.availableEleanorsPicks}</SectionSubHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" style={staticScaleStyle}>
                    {ELEANORS_TECHNIQUES_DATA.map(power => {
                        const boostedText = ctx.isEleanorsTechniquesBoosted && boostDescriptions[power.id];
                        return (
                            <PowerCard 
                                key={power.id} 
                                power={{...power, cost: ''}} 
                                isSelected={ctx.selectedEleanorsTechniques.has(power.id)} 
                                onToggle={ctx.handleEleanorsTechniqueSelect} 
                                isDisabled={isWorldlyWisdomPowerDisabled(power, 'eleanors')} 
                                fontSize={fontSize}
                            >
                                {boostedText && <BoostedEffectBox text={boostedText} />}
                            </PowerCard>
                        )
                    })}
                </div>
            </div>
            <div className="mt-16 px-4 lg:px-8">
                <SectionHeader>Genevieve's Techniques</SectionHeader>
                <div className={`my-4 max-w-sm mx-auto p-4 border rounded-lg transition-all bg-black/20 ${ ctx.isGenevievesTechniquesBoosted ? 'border-amber-400 ring-2 ring-amber-400/50 cursor-pointer hover:border-amber-300' : isGenevievesBoostDisabled ? 'border-gray-700 opacity-50 cursor-not-allowed' : 'border-gray-700 hover:border-amber-400/50 cursor-pointer'}`} onClick={!isGenevievesBoostDisabled ? () => ctx.handleWorldlyWisdomBoostToggle('genevievesTechniques') : undefined}>
                    <div className="flex items-center justify-center gap-4">
                        <img src="https://i.ibb.co/Dg6nz0R1/purth.png" alt="Purth Sigil" className="w-16 h-16"/>
                        <div className="text-left">
                            <h4 className="font-cinzel text-lg font-bold text-amber-300 tracking-widest">{ctx.isGenevievesTechniquesBoosted ? 'BOOSTED' : 'BOOST'}</h4>
                            {!ctx.isGenevievesTechniquesBoosted && <p className="text-xs text-gray-400 mt-1">Activating this will consume one Purth sigil.</p>}
                        </div>
                    </div>
                </div>
                <SectionSubHeader>Picks Available: {ctx.availableGenevievesPicks - ctx.selectedGenevievesTechniques.size} / {ctx.availableGenevievesPicks}</SectionSubHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" style={staticScaleStyle}>
                    {GENEVIEVES_TECHNIQUES_DATA.map(power => {
                        const boostedText = ctx.isGenevievesTechniquesBoosted && boostDescriptions[power.id];
                        return (
                            <PowerCard 
                                key={power.id} 
                                power={{...power, cost: ''}} 
                                isSelected={ctx.selectedGenevievesTechniques.has(power.id)} 
                                onToggle={ctx.handleGenevievesTechniqueSelect} 
                                isDisabled={isWorldlyWisdomPowerDisabled(power, 'genevieves')} 
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
