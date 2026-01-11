

import React, { useState, useEffect } from 'react';
import { useCharacterContext } from '../../context/CharacterContext';
import { 
    RIGHTEOUS_CREATION_DATA, RIGHTEOUS_CREATION_DATA_KO, 
    RIGHTEOUS_CREATION_SIGIL_TREE_DATA, RIGHTEOUS_CREATION_SIGIL_TREE_DATA_KO, 
    RIGHTEOUS_CREATION_SPECIALTIES_DATA, RIGHTEOUS_CREATION_SPECIALTIES_DATA_KO, 
    RIGHTEOUS_CREATION_MAGITECH_DATA, RIGHTEOUS_CREATION_MAGITECH_DATA_KO, 
    RIGHTEOUS_CREATION_ARCANE_CONSTRUCTS_DATA, RIGHTEOUS_CREATION_ARCANE_CONSTRUCTS_DATA_KO, 
    RIGHTEOUS_CREATION_METAMAGIC_DATA, RIGHTEOUS_CREATION_METAMAGIC_DATA_KO, 
    BLESSING_ENGRAVINGS, BLESSING_ENGRAVINGS_KO
} from '../../constants';
import type { RighteousCreationPower, RighteousCreationSigil, ChoiceItem, MagicGrade, SigilCounts } from '../../types';
import { BlessingIntro, SectionHeader, SectionSubHeader, WeaponIcon, CompanionIcon, VehicleIcon, BoostedEffectBox, renderFormattedText } from '../ui';
import { CompellingWillSigilCard, SigilColor } from '../CompellingWillSigilCard';
import { WeaponSelectionModal } from '../WeaponSelectionModal';
import { CompanionSelectionModal } from '../SigilTreeOptionCard';
import { BeastSelectionModal } from '../BeastSelectionModal';
import { VehicleSelectionModal } from '../VehicleSelectionModal';

const sigilImageMap: {[key: string]: string} = { 
    'kaarn.webp': 'kaarn', 
    'purth.webp': 'purth', 
    'juathas.webp': 'juathas', 
    'xuth.webp': 'xuth', 
    'sinthru.webp': 'sinthru', 
    'lekolu.webp': 'lekolu' 
};
const getSigilTypeFromImage = (imageSrc: string): keyof SigilCounts | null => {
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
    aspectRatio?: string;
    className?: string;
    fontSize?: 'regular' | 'large';
    hideSeparator?: boolean;
}> = ({ power, isSelected, isDisabled, onToggle, children, iconButton, onIconButtonClick, aspectRatio = "aspect-[3/2]", className = "", fontSize = 'regular', hideSeparator = false }) => {
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
            <img src={power.imageSrc} alt={power.title} className={`w-full ${aspectRatio} rounded-md mb-4 object-cover`} />
            <h4 className="font-cinzel font-bold tracking-wider text-xl" style={{ textShadow, color: titleColor }}>{power.title}</h4>
            {power.cost && <p className="text-xs text-yellow-300/70 italic mt-1">{power.cost}</p>}
            {power.description && !hideSeparator && <div className="w-16 h-px bg-white/10 mx-auto my-2"></div>}
            <p className={`${descriptionClass} text-gray-400 font-medium leading-relaxed flex-grow text-left whitespace-pre-wrap`} style={{ textShadow }}>{renderFormattedText(power.description)}</p>
            {hasChildren && (
                 <div className="mt-4 pt-4 border-t border-gray-700/50 w-full">
                    {children}
                 </div>
            )}
        </div>
    );
};

export const RighteousCreationSection: React.FC = () => {
    const ctx = useCharacterContext();
    const [isWeaponModalOpen, setIsWeaponModalOpen] = useState(false);
    const [isWeaponsmithModalOpen, setIsWeaponsmithModalOpen] = useState(false);
    const [isRoboticistIModalOpen, setIsRoboticistIModalOpen] = useState(false);
    const [isRoboticistIIModalOpen, setIsRoboticistIIModalOpen] = useState(false);
    const [isMasterMechanicModalOpen, setIsMasterMechanicModalOpen] = useState(false);

    const {
        selectedBlessingEngraving,
        righteousCreationEngraving,
        handleRighteousCreationEngravingSelect,
        righteousCreationWeaponName,
        handleRighteousCreationWeaponAssign,
        selectedTrueSelfTraits,
        isRighteousCreationMagicianApplied,
        handleToggleRighteousCreationMagician,
        disableRighteousCreationMagician,
        righteousCreationSigilTreeCost,
        
        // Assignments
        weaponsmithWeaponName, handleWeaponsmithWeaponAssign,
        roboticistIBeastName, handleRoboticistIBeastAssign,
        roboticistCompanionName, handleRoboticistCompanionAssign,
        masterMechanicVehicleName, handleMasterMechanicVehicleAssign,

        kpPaidNodes, toggleKpNode,
        fontSize,
        language
    } = useCharacterContext();

    const activeData = language === 'ko' ? RIGHTEOUS_CREATION_DATA_KO : RIGHTEOUS_CREATION_DATA;
    const activeTree = language === 'ko' ? RIGHTEOUS_CREATION_SIGIL_TREE_DATA_KO : RIGHTEOUS_CREATION_SIGIL_TREE_DATA;
    const activeSpecialties = language === 'ko' ? RIGHTEOUS_CREATION_SPECIALTIES_DATA_KO : RIGHTEOUS_CREATION_SPECIALTIES_DATA;
    const activeMagitech = language === 'ko' ? RIGHTEOUS_CREATION_MAGITECH_DATA_KO : RIGHTEOUS_CREATION_MAGITECH_DATA;
    const activeArcane = language === 'ko' ? RIGHTEOUS_CREATION_ARCANE_CONSTRUCTS_DATA_KO : RIGHTEOUS_CREATION_ARCANE_CONSTRUCTS_DATA;
    const activeMetamagic = language === 'ko' ? RIGHTEOUS_CREATION_METAMAGIC_DATA_KO : RIGHTEOUS_CREATION_METAMAGIC_DATA;
    const activeEngravings = language === 'ko' ? BLESSING_ENGRAVINGS_KO : BLESSING_ENGRAVINGS;

    const finalEngraving = righteousCreationEngraving ?? selectedBlessingEngraving;
    const isSkinEngraved = finalEngraving === 'skin';

    useEffect(() => {
        if (!isSkinEngraved && isRighteousCreationMagicianApplied) {
            disableRighteousCreationMagician();
        }
    }, [isSkinEngraved, isRighteousCreationMagicianApplied, disableRighteousCreationMagician]);

    const isRighteousCreationPowerDisabled = (power: RighteousCreationPower, type: 'specialty' | 'magitech' | 'arcaneConstructs' | 'metamagic'): boolean => {
        let selectedSet: Set<string>;
        let availablePicks: number;

        switch (type) {
            case 'specialty':
                selectedSet = ctx.selectedSpecialties;
                availablePicks = ctx.availableSpecialtyPicks;
                break;
            case 'magitech':
                selectedSet = ctx.selectedMagitechPowers;
                availablePicks = ctx.availableMagitechPicks;
                break;
            case 'arcaneConstructs':
                selectedSet = ctx.selectedArcaneConstructsPowers;
                availablePicks = ctx.availableArcaneConstructsPicks;
                break;
            case 'metamagic':
                selectedSet = ctx.selectedMetamagicPowers;
                availablePicks = ctx.availableMetamagicPicks;
                break;
        }

        if (!selectedSet.has(power.id) && selectedSet.size >= availablePicks) return true;
        
        // Specialty Prerequisite Check: Magitech, Arcane Constructs, and Metamagic powers require their respective Specialty
        if (type === 'magitech' && !ctx.selectedSpecialties.has('magitech_specialty')) return true;
        if (type === 'arcaneConstructs' && !ctx.selectedSpecialties.has('arcane_constructs_specialty')) return true;
        if (type === 'metamagic' && !ctx.selectedSpecialties.has('metamagic_specialty')) return true;

        if (power.requires) {
            const allSelected = new Set([
                ...ctx.selectedSpecialties, ...ctx.selectedMagitechPowers, 
                ...ctx.selectedArcaneConstructsPowers, ...ctx.selectedMetamagicPowers,
                ...ctx.selectedRighteousCreationSigils
            ]);
            if (!power.requires.every(req => allSelected.has(req))) return true;
        }
        
        return false;
    };

    const isRighteousCreationSigilDisabled = (sigil: RighteousCreationSigil): boolean => {
        if (ctx.selectedRighteousCreationSigils.has(sigil.id)) return false; 
        if (!sigil.prerequisites.every(p => ctx.selectedRighteousCreationSigils.has(p))) return true;
        
        // KP check
        if (kpPaidNodes.has(String(sigil.id))) return false;

        const sigilType = getSigilTypeFromImage(sigil.imageSrc);
        const sigilCost = sigilType ? 1 : 0;
        if (sigilType && ctx.availableSigilCounts[sigilType] < sigilCost) return true;

        return false;
    };

    const getRighteousCreationSigil = (id: string) => activeTree.find(s => s.id === id)!;
    
    const getSigilDisplayInfo = (sigil: RighteousCreationSigil): { color: SigilColor, benefits: React.ReactNode } => {
        // Use ID based mapping for colors as titles change
        let color: SigilColor = 'gray';
        switch(sigil.id) {
            case 'rookie_engineer': color = 'orange'; break;
            case 'polymat': color = 'yellow'; break;
            case 'technician': case 'magician': color = 'gray'; break;
            case 'magitechnician': case 'arcane_wizard': case 'metamagician': color = 'green'; break;
            case 'master_magitech': case 'master_arcana': case 'metamaster': color = 'red'; break;
        }

        const benefits = (
            <>
                {sigil.benefits.specialty ? <p className="text-orange-300">+ {sigil.benefits.specialty} {language === 'ko' ? "특기" : "Specialty"}</p> : null}
                {sigil.benefits.magitech ? <p className="text-blue-300">+ {sigil.benefits.magitech} {language === 'ko' ? "마법공학" : "Magitech"}</p> : null}
                {sigil.benefits.arcaneConstructs ? <p className="text-purple-300">+ {sigil.benefits.arcaneConstructs} {language === 'ko' ? "비전 구조체" : "Arcane Constructs"}</p> : null}
                {sigil.benefits.metamagic ? <p className="text-lime-300">+ {sigil.benefits.metamagic} {language === 'ko' ? "메타마법" : "Metamagic"}</p> : null}
            </>
        );
        return { color, benefits };
    };

    const handleKpToggle = (sigil: RighteousCreationSigil) => {
        const sigilType = getSigilTypeFromImage(sigil.imageSrc);
        if (sigilType) {
            toggleKpNode(String(sigil.id), sigilType);
        }
    };

    const renderSigilNode = (id: string) => {
        const sigil = getRighteousCreationSigil(id);
        const { color, benefits } = getSigilDisplayInfo(sigil);
        return (
            <CompellingWillSigilCard 
                sigil={sigil} 
                isSelected={ctx.selectedRighteousCreationSigils.has(id)} 
                isDisabled={isRighteousCreationSigilDisabled(sigil)} 
                onSelect={ctx.handleRighteousCreationSigilSelect} 
                benefitsContent={benefits} 
                color={color} 
                compact={true}
                onToggleKp={() => handleKpToggle(sigil)}
                isKpPaid={kpPaidNodes.has(String(id))}
            />
        );
    };

    const isMagicianSelected = selectedTrueSelfTraits.has('magician');
    const additionalCost = Math.floor(righteousCreationSigilTreeCost * 0.25);
    
    // Calculate Lekolu FP cost for Magician Trait
    const lekoluSigils = ['polymat']; 
    const selectedLekoluCount = Array.from(ctx.selectedRighteousCreationSigils).filter((id: string) => lekoluSigils.includes(id)).length;
    const additionalFpCost = Math.floor(selectedLekoluCount * 6 * 0.25);

    const costText = language === 'ko'
        ? `(축복 점수 -${additionalCost}${additionalFpCost > 0 ? `, 행운 점수 -${additionalFpCost}` : ''})`
        : `(-${additionalCost} BP${additionalFpCost > 0 ? `, -${additionalFpCost} FP` : ''})`;

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
                        const isOverridden = righteousCreationEngraving !== null;
                        const isWeapon = engraving.id === 'weapon';

                        return (
                             <div key={engraving.id} className="relative">
                                <button
                                    onClick={() => handleRighteousCreationEngravingSelect(engraving.id)}
                                    className={`w-full p-4 rounded-lg border-2 transition-colors flex flex-col items-center justify-center h-full text-center
                                        ${isSelected 
                                            ? (isOverridden ? 'border-purple-400 bg-purple-900/40' : 'border-purple-600/50 bg-purple-900/20') 
                                            : 'border-gray-700 bg-black/30 hover:border-purple-400/50'}
                                    `}
                                >
                                    <span className="font-cinzel tracking-wider uppercase">{engraving.title}</span>
                                    {isWeapon && isSelected && righteousCreationWeaponName && (
                                        <p className="text-xs text-purple-300 mt-2 truncate">({righteousCreationWeaponName})</p>
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
                            onClick={handleToggleRighteousCreationMagician}
                            className={`px-6 py-3 text-sm rounded-lg border transition-colors ${
                                isRighteousCreationMagicianApplied
                                    ? 'bg-purple-800/60 border-purple-500 text-white'
                                    : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:border-purple-500/70'
                            }`}
                        >
                            {isRighteousCreationMagicianApplied
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
                        handleRighteousCreationWeaponAssign(weaponName);
                        setIsWeaponModalOpen(false);
                    }}
                    currentWeaponName={righteousCreationWeaponName}
                />
            )}

            <div className="my-16 bg-black/20 p-8 rounded-lg border border-gray-800 overflow-x-auto">
                <SectionHeader>{language === 'ko' ? "표식 트리" : "SIGIL TREE"}</SectionHeader>
                <div className="flex items-center min-w-max pb-8 px-4 justify-center">
                    
                    {/* Column 1: Root */}
                    <div className="flex flex-col justify-center h-[40rem]">
                        <div style={{ marginTop: '-2rem' }}>
                            {renderSigilNode('rookie_engineer')}
                        </div>
                    </div>

                    {/* SVG Connector 1 (Split) */}
                    <svg className="w-16 h-[40rem] flex-shrink-0 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M 0 260 H 20" /> {/* Center Out */}
                        <path d="M 20 260 V 40 H 64" /> {/* Branch Top (Polymath) */}
                        <path d="M 20 260 H 64" /> {/* Branch Middle (Technician) - Straight Line */}
                        <path d="M 20 260 V 500 H 64" /> {/* Branch Bottom (Magician) - raised */}
                    </svg>

                    {/* Column 2: Polymath (Top), Technician (Mid), Magician (Bot) */}
                    <div className="flex flex-col justify-between h-[40rem]">
                        {/* Top: Polymath (y=40) */}
                        <div className="h-32 flex items-center justify-center mt-[1rem]">
                            {renderSigilNode('polymat')}
                        </div>
                        {/* Middle: Technician (y=260) */}
                        <div className="h-32 flex items-center justify-center" style={{marginTop: '-2rem'}}>
                            {renderSigilNode('technician')}
                        </div>
                        {/* Bottom: Magician (y=500) */}
                        <div className="h-32 flex items-center justify-center mb-[1rem]">
                            {renderSigilNode('magician')}
                        </div>
                    </div>

                    {/* SVG Connector 2 */}
                    <svg className="w-16 h-[40rem] flex-shrink-0 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2">
                        {/* Technician (Mid 260) -> Magitechnician (Top 40) */}
                        <path d="M 0 260 H 20 V 40 H 64" />
                         {/* Technician (Mid 260) -> Arcane Wizard (Mid 260) */}
                        <path d="M 0 260 H 64" />
                        
                        {/* Magician (Bot 500) -> Metamagician (Bot 500) */}
                        <path d="M 0 500 H 64" />
                    </svg>

                    {/* Column 3: Magitechnician (Top), Arcane Wizard (Mid), Metamagician (Bot) */}
                    <div className="flex flex-col justify-between h-[40rem]">
                         {/* Top: Magitechnician (y=40) */}
                        <div className="h-32 flex items-center justify-center mt-[1rem]">
                            {renderSigilNode('magitechnician')}
                        </div>
                        {/* Middle: Arcane Wizard (y=260) */}
                        <div className="h-32 flex items-center justify-center" style={{marginTop: '-2rem'}}>
                            {renderSigilNode('arcane_wizard')}
                        </div>
                         {/* Bottom: Metamagician (y=500) */}
                        <div className="h-32 flex items-center justify-center mb-[1rem]">
                            {renderSigilNode('metamagician')}
                        </div>
                    </div>

                    {/* SVG Connector 3 */}
                    <svg className="w-16 h-[40rem] flex-shrink-0 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M 0 40 H 64" /> {/* Magitechnician -> Master Magitech */}
                        <path d="M 0 260 H 64" /> {/* Arcane Wizard -> Master Arcana - adjusted to 260 */}
                        <path d="M 0 500 H 64" /> {/* Metamagician -> Metamaster - raised */}
                    </svg>

                    {/* Column 4: Master Magitech (Top), Master Arcana (Mid), Metamaster (Bot) */}
                    <div className="flex flex-col justify-between h-[40rem]">
                        {/* Top: Master Magitech (y=40) */}
                        <div className="h-32 flex items-center justify-center mt-[1rem]">
                            {renderSigilNode('master_magitech')}
                        </div>
                         {/* Middle: Master Arcana (y=260) */}
                        <div className="h-32 flex items-center justify-center" style={{marginTop: '-2rem'}}>
                            {renderSigilNode('master_arcana')}
                        </div>
                        {/* Bottom: Metamaster (y=500) */}
                        <div className="h-32 flex items-center justify-center mb-[1rem]">
                            {renderSigilNode('metamaster')}
                        </div>
                    </div>

                </div>
            </div>

            <div className="mt-16 px-4 lg:px-8">
                <SectionHeader>{language === 'ko' ? "특기" : "Specialties"}</SectionHeader>
                <SectionSubHeader>
                    {language === 'ko' ? `선택 가능: ${ctx.availableSpecialtyPicks - ctx.selectedSpecialties.size} / ${ctx.availableSpecialtyPicks}` : `Picks Available: ${ctx.availableSpecialtyPicks - ctx.selectedSpecialties.size} / ${ctx.availableSpecialtyPicks}`}
                </SectionSubHeader>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6" style={staticScaleStyle}>
                    {activeSpecialties.map(power => (
                        <PowerCard 
                            key={power.id} 
                            power={{...power, cost: ''}} 
                            isSelected={ctx.selectedSpecialties.has(power.id)} 
                            onToggle={ctx.handleSpecialtySelect} 
                            isDisabled={isRighteousCreationPowerDisabled(power, 'specialty')}
                            aspectRatio="aspect-[2/1]"
                            fontSize={fontSize}
                        />
                    ))}
                </div>
            </div>

            <div className="mt-16 px-4 lg:px-8">
                <SectionHeader>{language === 'ko' ? "마법공학" : "Magitech"}</SectionHeader>
                <SectionSubHeader>
                    {language === 'ko' ? `선택 가능: ${ctx.availableMagitechPicks - ctx.selectedMagitechPowers.size} / ${ctx.availableMagitechPicks}` : `Picks Available: ${ctx.availableMagitechPicks - ctx.selectedMagitechPowers.size} / ${ctx.availableMagitechPicks}`}
                </SectionSubHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" style={staticScaleStyle}>
                    {activeMagitech.map(power => {
                        const isWeaponsmith = power.id === 'weaponsmith';
                        const isMasterMechanic = power.id === 'master_mechanic_i';
                        const isSelected = ctx.selectedMagitechPowers.has(power.id);

                        return <PowerCard 
                            key={power.id} 
                            power={{...power, cost: ''}} 
                            isSelected={isSelected} 
                            onToggle={ctx.handleMagitechPowerSelect} 
                            isDisabled={isRighteousCreationPowerDisabled(power, 'magitech')}
                            iconButton={
                                (isWeaponsmith && isSelected) ? <WeaponIcon /> :
                                (isMasterMechanic && isSelected) ? <VehicleIcon /> : undefined
                            }
                            onIconButtonClick={
                                (isWeaponsmith && isSelected) ? () => setIsWeaponsmithModalOpen(true) :
                                (isMasterMechanic && isSelected) ? () => setIsMasterMechanicModalOpen(true) : undefined
                            }
                            fontSize={fontSize}
                        >
                            {isWeaponsmith && isSelected && weaponsmithWeaponName && (
                                <div className="text-center mt-2 border-t border-gray-700/50 pt-2">
                                    <p className="text-xs text-gray-400">{language === 'ko' ? "할당된 무기:" : "Assigned Weapon:"}</p>
                                    <p className="text-sm font-bold text-cyan-300 truncate">{weaponsmithWeaponName}</p>
                                </div>
                            )}
                            {isMasterMechanic && isSelected && masterMechanicVehicleName && (
                                <div className="text-center mt-2 border-t border-gray-700/50 pt-2">
                                    <p className="text-xs text-gray-400">{language === 'ko' ? "할당된 탈것:" : "Assigned Vehicle:"}</p>
                                    <p className="text-sm font-bold text-cyan-300 truncate">{masterMechanicVehicleName}</p>
                                </div>
                            )}
                        </PowerCard>
                    })}
                </div>
            </div>

            <div className="mt-16 px-4 lg:px-8">
                <SectionHeader>{language === 'ko' ? "비전 구조체" : "Arcane Constructs"}</SectionHeader>
                <SectionSubHeader>
                    {language === 'ko' ? `선택 가능: ${ctx.availableArcaneConstructsPicks - ctx.selectedArcaneConstructsPowers.size} / ${ctx.availableArcaneConstructsPicks}` : `Picks Available: ${ctx.availableArcaneConstructsPicks - ctx.selectedArcaneConstructsPowers.size} / ${ctx.availableArcaneConstructsPicks}`}
                </SectionSubHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" style={staticScaleStyle}>
                    {activeArcane.map(power => {
                        const isRoboticistI = power.id === 'roboticist_i';
                        const isRoboticistII = power.id === 'roboticist_ii';
                        const isDivineClay = power.id === 'divine_clay';
                        const isSelected = ctx.selectedArcaneConstructsPowers.has(power.id);

                        return (
                            <PowerCard 
                                key={power.id} 
                                power={{...power, cost: ''}} 
                                isSelected={isSelected} 
                                onToggle={ctx.handleArcaneConstructsPowerSelect} 
                                isDisabled={isRighteousCreationPowerDisabled(power, 'arcaneConstructs')}
                                className={isDivineClay ? "lg:col-span-1 lg:row-span-2" : ""}
                                iconButton={
                                    (isRoboticistI && isSelected) ? <CompanionIcon /> :
                                    (isRoboticistII && isSelected) ? <CompanionIcon /> : undefined
                                }
                                onIconButtonClick={
                                    (isRoboticistI && isSelected) ? () => setIsRoboticistIModalOpen(true) :
                                    (isRoboticistII && isSelected) ? () => setIsRoboticistIIModalOpen(true) : undefined
                                }
                                fontSize={fontSize}
                            >
                                {isRoboticistI && isSelected && roboticistIBeastName && (
                                    <div className="text-center mt-2 border-t border-gray-700/50 pt-2">
                                        <p className="text-xs text-gray-400">{language === 'ko' ? "할당된 로봇:" : "Assigned Automaton:"}</p>
                                        <p className="text-sm font-bold text-amber-300 truncate">{roboticistIBeastName}</p>
                                    </div>
                                )}
                                {isRoboticistII && isSelected && roboticistCompanionName && (
                                    <div className="text-center mt-2 border-t border-gray-700/50 pt-2">
                                        <p className="text-xs text-gray-400">{language === 'ko' ? "할당된 안드로이드:" : "Assigned Android:"}</p>
                                        <p className="text-sm font-bold text-cyan-300 truncate">{roboticistCompanionName}</p>
                                    </div>
                                )}
                            </PowerCard>
                        );
                    })}
                </div>
            </div>

            <div className="mt-16 px-4 lg:px-8">
                <SectionHeader>{language === 'ko' ? "메타마법" : "Metamagic"}</SectionHeader>
                <SectionSubHeader>
                    {language === 'ko' ? `선택 가능: ${ctx.availableMetamagicPicks - ctx.selectedMetamagicPowers.size} / ${ctx.availableMetamagicPicks}` : `Picks Available: ${ctx.availableMetamagicPicks - ctx.selectedMetamagicPowers.size} / ${ctx.availableMetamagicPicks}`}
                </SectionSubHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" style={staticScaleStyle}>
                    {activeMetamagic.map(power => {
                        const isMariasGift = power.id === 'marias_gift';
                        return (
                            <PowerCard 
                                key={power.id} 
                                power={{...power, cost: ''}} 
                                isSelected={ctx.selectedMetamagicPowers.has(power.id)} 
                                onToggle={ctx.handleMetamagicPowerSelect} 
                                isDisabled={isRighteousCreationPowerDisabled(power, 'metamagic')} 
                                className={isMariasGift ? "lg:col-span-1 lg:row-span-2" : ""}
                                fontSize={fontSize}
                            />
                        )
                    })}
                </div>
            </div>

            {/* Modals */}
            {isWeaponsmithModalOpen && (
                <WeaponSelectionModal
                    onClose={() => setIsWeaponsmithModalOpen(false)}
                    onSelect={(name) => {
                        handleWeaponsmithWeaponAssign(name);
                        setIsWeaponsmithModalOpen(false);
                    }}
                    currentWeaponName={weaponsmithWeaponName}
                    pointLimit={40}
                    title={language === 'ko' ? "역작 무기 할당 (40 WP)" : "Assign Masterpiece Weapon (40 WP)"}
                />
            )}
            {isRoboticistIModalOpen && (
                <BeastSelectionModal
                    onClose={() => setIsRoboticistIModalOpen(false)}
                    onSelect={(name) => {
                        handleRoboticistIBeastAssign(name);
                        setIsRoboticistIModalOpen(false);
                    }}
                    currentBeastName={roboticistIBeastName}
                    pointLimit={40}
                    title={language === 'ko' ? "로봇 할당 (40 BP)" : "Assign Automaton (40 BP)"}
                    requiredPerkId="automaton_perk"
                    excludedPerkIds={['chatterbox_beast', 'magical_beast']}
                />
            )}
            {isRoboticistIIModalOpen && (
                <CompanionSelectionModal
                    onClose={() => setIsRoboticistIIModalOpen(false)}
                    onSelect={(name) => {
                        handleRoboticistCompanionAssign(name);
                        setIsRoboticistIIModalOpen(false);
                    }}
                    currentCompanionName={roboticistCompanionName}
                    pointLimit={50}
                    title={language === 'ko' ? "안드로이드 할당 (50 CP)" : "Assign Android (50 CP)"}
                    categoryFilter="automaton"
                />
            )}
            {isMasterMechanicModalOpen && (
                <VehicleSelectionModal
                    onClose={() => setIsMasterMechanicModalOpen(false)}
                    onSelect={(name) => {
                        handleMasterMechanicVehicleAssign(name);
                        setIsMasterMechanicModalOpen(false);
                    }}
                    currentVehicleName={masterMechanicVehicleName}
                    pointLimit={50 + (ctx.selectedMagitechPowers.has('master_mechanic_ii') ? 50 : 0)}
                    title={language === 'ko' ? `꿈의 탈것 할당 (${50 + (ctx.selectedMagitechPowers.has('master_mechanic_ii') ? 50 : 0)} VP)` : `Assign Dream Ride (${50 + (ctx.selectedMagitechPowers.has('master_mechanic_ii') ? 50 : 0)} VP)`}
                />
            )}
        </section>
    );
};