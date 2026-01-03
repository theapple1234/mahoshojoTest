
import React, { useState, useEffect } from 'react';
import { useCharacterContext } from '../../context/CharacterContext';
import { MARGRA_DATA, CLOSED_CIRCUITS_DATA, CLOSED_CIRCUITS_SIGIL_TREE_DATA, NET_AVATAR_DATA, TECHNOMANCY_DATA, NANITE_CONTROL_DATA, BLESSING_ENGRAVINGS } from '../../constants';
import type { ClosedCircuitsPower, ClosedCircuitsSigil, ChoiceItem, MagicGrade } from '../../types';
import { BlessingIntro, SectionHeader, SectionSubHeader, WeaponIcon, CompanionIcon, BoostedEffectBox, renderFormattedText } from '../ui';
import { CompellingWillSigilCard, SigilColor } from '../CompellingWillSigilCard';
import { WeaponSelectionModal } from '../WeaponSelectionModal';
import { BeastSelectionModal } from '../BeastSelectionModal';

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
    className?: string;
}> = ({ power, isSelected, isDisabled, onToggle, children, iconButton, onIconButtonClick, fontSize = 'regular', className = '' }) => {
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
        <div className={`${wrapperClass} relative ${className}`} onClick={() => !isDisabled && onToggle(power.id)}>
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

export const ClosedCircuitsSection: React.FC = () => {
    const ctx = useCharacterContext();
    const [isWeaponModalOpen, setIsWeaponModalOpen] = useState(false);
    const [isNaniteFormModalOpen, setIsNaniteFormModalOpen] = useState(false);
    const [isHeavilyArmedModalOpen, setIsHeavilyArmedModalOpen] = useState(false);

    const {
        selectedBlessingEngraving,
        closedCircuitsEngraving,
        handleClosedCircuitsEngravingSelect,
        closedCircuitsWeaponName,
        handleClosedCircuitsWeaponAssign,
        heavilyArmedWeaponName,
        handleHeavilyArmedWeaponAssign,
        naniteFormBeastName,
        handleNaniteFormBeastAssign,
        selectedTrueSelfTraits,
        isClosedCircuitsMagicianApplied,
        handleToggleClosedCircuitsMagician,
        disableClosedCircuitsMagician,
        closedCircuitsSigilTreeCost,
        
        kpPaidNodes, toggleKpNode,
        fontSize
    } = useCharacterContext();

    const finalEngraving = closedCircuitsEngraving ?? selectedBlessingEngraving;
    const isSkinEngraved = finalEngraving === 'skin';

    useEffect(() => {
        if (!isSkinEngraved && isClosedCircuitsMagicianApplied) {
            disableClosedCircuitsMagician();
        }
    }, [isSkinEngraved, isClosedCircuitsMagicianApplied, disableClosedCircuitsMagician]);

    const isClosedCircuitsPowerDisabled = (power: ClosedCircuitsPower, type: 'netAvatar' | 'technomancy' | 'naniteControl'): boolean => {
        const selectedSet = type === 'netAvatar' ? ctx.selectedNetAvatars : type === 'technomancy' ? ctx.selectedTechnomancies : ctx.selectedNaniteControls;
        const availablePicks = type === 'netAvatar' ? ctx.availableNetAvatarPicks : type === 'technomancy' ? ctx.availableTechnomancyPicks : ctx.availableNaniteControlPicks;

        if (!selectedSet.has(power.id) && selectedSet.size >= availablePicks) return true;
        if (power.requires) {
            const allSelected = new Set([...ctx.selectedNetAvatars, ...ctx.selectedTechnomancies, ...ctx.selectedNaniteControls, ...ctx.selectedClosedCircuitsSigils]);
            if (!power.requires.every(req => allSelected.has(req))) return true;
        }
        return false;
    };

    const isClosedCircuitsSigilDisabled = (sigil: ClosedCircuitsSigil): boolean => {
        if (ctx.selectedClosedCircuitsSigils.has(sigil.id)) return false; // Can always deselect
        if (!sigil.prerequisites.every(p => ctx.selectedClosedCircuitsSigils.has(p))) return true;
        
        // KP check
        if (kpPaidNodes.has(String(sigil.id))) return false;

        const sigilType = getSigilTypeFromImage(sigil.imageSrc);
        const sigilCost = sigilType ? 1 : 0;
        if (sigilType && ctx.availableSigilCounts[sigilType] < sigilCost) return true;

        return false;
    };

    const getClosedCircuitsSigil = (id: string) => CLOSED_CIRCUITS_SIGIL_TREE_DATA.find(s => s.id === id)!;
    
    const getSigilDisplayInfo = (sigil: ClosedCircuitsSigil): { color: SigilColor, benefits: React.ReactNode } => {
        const colorMap: Record<string, SigilColor> = {
            'SCRIPT KIDDY': 'orange', 'KYROTIK ARMOR™': 'yellow', 'EZ-HACK™': 'yellow',
            'HEAVY DUTY': 'green', 'L33T H4XXOR': 'green', 'HACKER I': 'gray',
            'HACKER 2': 'gray', 'NANITE MASTER': 'red', 'BLACK HAT': 'purple'
        };
        const color = colorMap[sigil.title] || 'gray';
        const benefits = (
            <>
                {sigil.benefits.netAvatar ? <p className="text-blue-300">+ {sigil.benefits.netAvatar} Avatar</p> : null}
                {sigil.benefits.technomancy ? <p className="text-green-300">+ {sigil.benefits.technomancy} Technomancy</p> : null}
                {sigil.benefits.naniteControl ? <p className="text-cyan-300">+ {sigil.benefits.naniteControl} Nanite Control</p> : null}
            </>
        );
        return { color, benefits };
    };

    const handleKpToggle = (sigil: ClosedCircuitsSigil) => {
        const type = getSigilTypeFromImage(sigil.imageSrc);
        if (type) {
            toggleKpNode(String(sigil.id), type);
        }
    };

    const renderSigilNode = (id: string) => {
        const sigil = getClosedCircuitsSigil(id);
        const { color, benefits } = getSigilDisplayInfo(sigil);
        return (
            <CompellingWillSigilCard 
                sigil={sigil} 
                isSelected={ctx.selectedClosedCircuitsSigils.has(id)} 
                isDisabled={isClosedCircuitsSigilDisabled(sigil)} 
                onSelect={ctx.handleClosedCircuitsSigilSelect} 
                benefitsContent={benefits} 
                color={color} 
                compact={true}
                onToggleKp={() => handleKpToggle(sigil)}
                isKpPaid={kpPaidNodes.has(String(id))}
            />
        );
    };

    const boostDescriptions: { [key: string]: string } = {
        domain_master_i: "Can control up to 5 devices simultaneously.",
        weapon_sabotage: "Can permanently disable mundane weaponry.",
        digital_infiltrator: "Bypass any non-magical firewall instantly.",
        domain_master_ii: "Can override military-grade automated systems.",
        vehicle_sabotage: "Can trigger critical engine failure instantly.",
        counter_hacker: "Feedback damage to enemy hackers is doubled.",
        verse_hijack: "Target verse suffers extreme latency and structural errors.",
        heavily_armed: "+10 Weapon Points.",
        nanite_armor_i: "Energy efficiency increased; lasts longer.",
        nanite_armor_ii: "Weak points in armor are halved in size.",
        nanite_armor_iii: "Passive damage redirection enhanced.",
        metal_skin: "Healing speed through nanites is tripled.",
        nanite_form: "+10 Beast Points.",
        grey_goo: "Decomposition spreads to nearby organic matter."
    };

    const isTechnomancyBoosted = ctx.isTechnomancyBoosted;
    const isNaniteControlBoosted = ctx.isNaniteControlBoosted;

    const isTechnomancyBoostDisabled = !isTechnomancyBoosted && ctx.availableSigilCounts.kaarn <= 0;
    const isNaniteControlBoostDisabled = !isNaniteControlBoosted && ctx.availableSigilCounts.purth <= 0;

    const isMagicianSelected = selectedTrueSelfTraits.has('magician');
    const additionalCost = Math.floor(ctx.closedCircuitsSigilTreeCost * 0.25);

    // Style to counteract global zoom for specific sections
    const staticScaleStyle: React.CSSProperties = fontSize === 'large' ? { zoom: 0.83333 } : {};

    return (
        <section>
            <BlessingIntro {...MARGRA_DATA} />
            <BlessingIntro {...CLOSED_CIRCUITS_DATA} reverse />
            
            <div className="mt-8 mb-16 max-w-3xl mx-auto">
                <h4 className="font-cinzel text-xl text-center tracking-widest my-6 text-purple-300 uppercase">
                    Engrave this Blessing
                </h4>
                <div className="grid grid-cols-3 gap-4">
                    {BLESSING_ENGRAVINGS.map(engraving => {
                        const isSelected = finalEngraving === engraving.id;
                        const isOverridden = closedCircuitsEngraving !== null;
                        const isWeapon = engraving.id === 'weapon';

                        return (
                             <div key={engraving.id} className="relative">
                                <button
                                    onClick={() => handleClosedCircuitsEngravingSelect(engraving.id)}
                                    className={`w-full p-4 rounded-lg border-2 transition-colors flex flex-col items-center justify-center h-full text-center
                                        ${isSelected 
                                            ? (isOverridden ? 'border-purple-400 bg-purple-900/40' : 'border-purple-600/50 bg-purple-900/20') 
                                            : 'border-gray-700 bg-black/30 hover:border-purple-400/50'}
                                    `}
                                >
                                    <span className="font-cinzel tracking-wider uppercase">{engraving.title}</span>
                                    {isWeapon && isSelected && closedCircuitsWeaponName && (
                                        <p className="text-xs text-purple-300 mt-2 truncate">({closedCircuitsWeaponName})</p>
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
                            onClick={handleToggleClosedCircuitsMagician}
                            className={`px-6 py-3 text-sm rounded-lg border transition-colors ${
                                isClosedCircuitsMagicianApplied
                                    ? 'bg-purple-800/60 border-purple-500 text-white'
                                    : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:border-purple-500/70'
                            }`}
                        >
                            {isClosedCircuitsMagicianApplied
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
                        handleClosedCircuitsWeaponAssign(weaponName);
                        setIsWeaponModalOpen(false);
                    }}
                    currentWeaponName={closedCircuitsWeaponName}
                />
            )}

            <div className="my-16 bg-black/20 p-8 rounded-lg border border-gray-800 overflow-x-auto">
                <SectionHeader>SIGIL TREE</SectionHeader>
                <div className="flex items-center min-w-max pb-8 px-4 justify-center">
                    
                    {/* Column 1: Root */}
                    <div className="flex flex-col justify-center h-[28rem]">
                        {renderSigilNode('script_kiddy')}
                    </div>

                    {/* Connector 1: Split */}
                    <svg className="w-16 h-[28rem] flex-shrink-0 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M 0 224 H 20" /> {/* Center Out */}
                        <path d="M 20 224 V 100 H 64" /> {/* Up to Nanites */}
                        <path d="M 20 224 V 348 H 64" /> {/* Down to Technomancy */}
                    </svg>

                    {/* Column 2 */}
                    <div className="flex flex-col justify-between h-[28rem]">
                        <div className="h-44 flex items-center justify-center">
                            {renderSigilNode('kyrotik_armor')}
                        </div>
                        <div className="h-44 flex items-center justify-center">
                            {renderSigilNode('ez_hack')}
                        </div>
                    </div>

                    {/* Connector 2 */}
                    <svg className="w-16 h-[28rem] flex-shrink-0 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M 0 100 H 64" /> {/* Nanite Path */}
                        <path d="M 0 348 H 64" /> {/* Technomancy Path */}
                    </svg>

                    {/* Column 3 */}
                    <div className="flex flex-col justify-between h-[28rem]">
                        <div className="h-44 flex items-center justify-center">
                            {renderSigilNode('heavy_duty')}
                        </div>
                        <div className="h-44 flex items-center justify-center">
                            {renderSigilNode('hacker_i')}
                        </div>
                    </div>

                    {/* Connector 3 */}
                    <svg className="w-16 h-[28rem] flex-shrink-0 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M 0 100 H 64" /> {/* Nanite Path */}
                        <path d="M 0 348 H 64" /> {/* Technomancy Path */}
                    </svg>

                    {/* Column 4 */}
                    <div className="flex flex-col justify-between h-[28rem]">
                        <div className="h-44 flex items-center justify-center">
                            {renderSigilNode('nanite_master')}
                        </div>
                        <div className="h-44 flex items-center justify-center">
                            {renderSigilNode('hacker_2')}
                        </div>
                    </div>

                    {/* Connector 4 */}
                    <svg className="w-16 h-[28rem] flex-shrink-0 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2">
                        {/* Hacker 2 (348) -> L33t H4xx0r (348) */}
                        <path d="M 0 348 H 64" />
                        {/* Hacker 2 (348) -> Black Hat (100) */}
                        <path d="M 32 348 V 100 H 64" />
                    </svg>

                    {/* Column 5 */}
                    <div className="flex flex-col justify-center gap-20 h-[28rem] relative">
                        <div className="h-44 flex items-center justify-center">
                            {renderSigilNode('black_hat')}
                        </div>
                        <div className="h-44 flex items-center justify-center">
                            {renderSigilNode('l33t_h4xx0r')}
                        </div>
                    </div>

                </div>
            </div>

            <div className="mt-16 px-4 lg:px-8">
                <SectionHeader>Net Avatar</SectionHeader>
                <SectionSubHeader>Picks Available: {ctx.availableNetAvatarPicks - ctx.selectedNetAvatars.size} / {ctx.availableNetAvatarPicks}</SectionSubHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" style={staticScaleStyle}>
                    {NET_AVATAR_DATA.map(power => {
                        const boostedText = isTechnomancyBoosted && boostDescriptions[power.id];
                        return (
                            <PowerCard 
                                key={power.id} 
                                power={{...power, cost: ''}} 
                                isSelected={ctx.selectedNetAvatars.has(power.id)} 
                                onToggle={ctx.handleNetAvatarSelect} 
                                isDisabled={isClosedCircuitsPowerDisabled(power, 'netAvatar')}
                                fontSize={fontSize}
                            >
                                {boostedText && <BoostedEffectBox text={boostedText} />}
                            </PowerCard>
                        )
                    })}
                </div>
            </div>

            <div className="mt-16 px-4 lg:px-8">
                <SectionHeader>Technomancy</SectionHeader>
                <div className={`my-4 max-w-sm mx-auto p-4 border rounded-lg transition-all bg-black/20 ${ isTechnomancyBoosted ? 'border-amber-400 ring-2 ring-amber-400/50 cursor-pointer hover:border-amber-300' : isTechnomancyBoostDisabled ? 'border-gray-700 opacity-50 cursor-not-allowed' : 'border-gray-700 hover:border-amber-400/50 cursor-pointer'}`} onClick={!isTechnomancyBoostDisabled ? () => ctx.handleClosedCircuitsBoostToggle('technomancy') : undefined}>
                    <div className="flex items-center justify-center gap-4">
                        <img src="https://i.ibb.co/zTm8fcLb/kaarn.png" alt="Kaarn Sigil" className="w-16 h-16"/>
                        <div className="text-left">
                            <h4 className="font-cinzel text-lg font-bold text-amber-300 tracking-widest">{isTechnomancyBoosted ? 'BOOSTED' : 'BOOST'}</h4>
                            {!isTechnomancyBoosted && <p className="text-xs text-gray-400 mt-1">Activating this will consume one Kaarn sigil.</p>}
                        </div>
                    </div>
                </div>
                <SectionSubHeader>Picks Available: {ctx.availableTechnomancyPicks - ctx.selectedTechnomancies.size} / {ctx.availableTechnomancyPicks}</SectionSubHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" style={staticScaleStyle}>
                    {TECHNOMANCY_DATA.map(power => {
                        const boostedText = isTechnomancyBoosted && boostDescriptions[power.id];
                        return (
                            <PowerCard 
                                key={power.id} 
                                power={{...power, cost: ''}} 
                                isSelected={ctx.selectedTechnomancies.has(power.id)} 
                                onToggle={ctx.handleTechnomancySelect} 
                                isDisabled={isClosedCircuitsPowerDisabled(power, 'technomancy')}
                                fontSize={fontSize}
                            >
                                {boostedText && <BoostedEffectBox text={boostedText} />}
                            </PowerCard>
                        )
                    })}
                </div>
            </div>

            <div className="mt-16 px-4 lg:px-8">
                <SectionHeader>Nanite Control</SectionHeader>
                <div className={`my-4 max-w-sm mx-auto p-4 border rounded-lg transition-all bg-black/20 ${ isNaniteControlBoosted ? 'border-amber-400 ring-2 ring-amber-400/50 cursor-pointer hover:border-amber-300' : isNaniteControlBoostDisabled ? 'border-gray-700 opacity-50 cursor-not-allowed' : 'border-gray-700 hover:border-amber-400/50 cursor-pointer'}`} onClick={!isNaniteControlBoostDisabled ? () => ctx.handleClosedCircuitsBoostToggle('naniteControl') : undefined}>
                    <div className="flex items-center justify-center gap-4">
                        <img src="https://i.ibb.co/Dg6nz0R1/purth.png" alt="Purth Sigil" className="w-16 h-16"/>
                        <div className="text-left">
                            <h4 className="font-cinzel text-lg font-bold text-amber-300 tracking-widest">{isNaniteControlBoosted ? 'BOOSTED' : 'BOOST'}</h4>
                            {!isNaniteControlBoosted && <p className="text-xs text-gray-400 mt-1">Activating this will consume one Purth sigil.</p>}
                        </div>
                    </div>
                </div>
                <SectionSubHeader>Picks Available: {ctx.availableNaniteControlPicks - ctx.selectedNaniteControls.size} / {ctx.availableNaniteControlPicks}</SectionSubHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" style={staticScaleStyle}>
                    {NANITE_CONTROL_DATA.map(power => {
                        const boostedText = isNaniteControlBoosted && boostDescriptions[power.id];
                        const isHeavilyArmed = power.id === 'heavily_armed';
                        const isNaniteForm = power.id === 'nanite_form';
                        const isNaniteArmorIII = power.id === 'nanite_armor_iii';
                        const isSelected = ctx.selectedNaniteControls.has(power.id);

                        return (
                            <PowerCard 
                                key={power.id} 
                                power={{...power, cost: ''}} 
                                isSelected={isSelected} 
                                onToggle={ctx.handleNaniteControlSelect} 
                                isDisabled={isClosedCircuitsPowerDisabled(power, 'naniteControl')}
                                iconButton={
                                    (isHeavilyArmed && isSelected) ? <WeaponIcon /> :
                                    (isNaniteForm && isSelected) ? <CompanionIcon /> : undefined
                                }
                                onIconButtonClick={
                                    (isHeavilyArmed && isSelected) ? () => setIsHeavilyArmedModalOpen(true) :
                                    (isNaniteForm && isSelected) ? () => setIsNaniteFormModalOpen(true) : undefined
                                }
                                fontSize={fontSize}
                                className={isNaniteArmorIII ? "lg:row-span-2" : ""}
                            >
                                {boostedText && <BoostedEffectBox text={boostedText} />}
                                {isHeavilyArmed && isSelected && heavilyArmedWeaponName && (
                                    <div className="text-center mt-2 border-t border-gray-700/50 pt-2">
                                        <p className="text-xs text-gray-400">Assigned Weapon:</p>
                                        <p className="text-sm font-bold text-amber-300">{heavilyArmedWeaponName}</p>
                                    </div>
                                )}
                                {isNaniteForm && isSelected && naniteFormBeastName && (
                                    <div className="text-center mt-2 border-t border-gray-700/50 pt-2">
                                        <p className="text-xs text-gray-400">Assigned Form:</p>
                                        <p className="text-sm font-bold text-amber-300">{naniteFormBeastName}</p>
                                    </div>
                                )}
                            </PowerCard>
                        )
                    })}
                </div>
            </div>

            {/* Modals */}
            {isHeavilyArmedModalOpen && (
                <WeaponSelectionModal
                    onClose={() => setIsHeavilyArmedModalOpen(false)}
                    onSelect={(name) => {
                        handleHeavilyArmedWeaponAssign(name);
                        setIsHeavilyArmedModalOpen(false);
                    }}
                    currentWeaponName={heavilyArmedWeaponName}
                    pointLimit={isNaniteControlBoosted ? 40 : 30}
                    title={`Assign Nanite Weapon (${isNaniteControlBoosted ? 40 : 30} WP)`}
                />
            )}
            {isNaniteFormModalOpen && (
                <BeastSelectionModal
                    onClose={() => setIsNaniteFormModalOpen(false)}
                    onSelect={(name) => {
                        handleNaniteFormBeastAssign(name);
                        setIsNaniteFormModalOpen(false);
                    }}
                    currentBeastName={naniteFormBeastName}
                    pointLimit={isNaniteControlBoosted ? 50 : 40}
                    title={`Assign Nanite Form (${isNaniteControlBoosted ? 50 : 40} BP)`}
                    categoryFilter="humanoid"
                    excludedPerkIds={['chatterbox_beast', 'magical_beast']}
                />
            )}
        </section>
    );
};
