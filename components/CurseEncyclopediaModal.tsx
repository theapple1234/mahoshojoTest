
import React, { useEffect, useMemo, useRef } from 'react';
import { useCharacterContext } from '../context/CharacterContext';
import * as Constants from '../constants';

interface CurseEncyclopediaModalProps {
    onClose: () => void;
}

const CURSE_DATA = [
    {
        blessing: "The Blessing of Good Tidings",
        curses: [
            { id: "quick_twitch", name: "Quick Twitch", effect: "Reaction time is made incredibly slow." },
            { id: "incredible_will", name: "Incredible Will", effect: "Sensation of pain doubled." },
            { id: "sensory_master", name: "Sensory Master", effect: "Range and acuity of senses are halved." },
            { id: "cowards_boon", name: "Coward’s Boon", effect: "Slowed down slightly while fleeing." },
            { id: "charisma_plus", name: "Charisma +", effect: "Charisma reduced significantly." },
            { id: "strength_plus", name: "Strength +", effect: "Strength reduced significantly." },
            { id: "speed_plus", name: "Speed +", effect: "Speed reduced significantly." },
            { id: "smarts_plus", name: "Smarts +", effect: "Intelligence reduced significantly." },
            { id: "hokuto_senjukai_ken", name: "Hokuto Senjukai Ken", effect: "Reduced to mundane levels of strength." },
            { id: "dont_blink", name: "Don’t Blink", effect: "Reduced to mundane levels of speed." },
            { id: "superpowered_mind", name: "Super-Powered Mind", effect: "Reduced to mundane levels of intellect." },
        ]
    },
    {
        blessing: "The Blessing of Compelling Will",
        curses: [
            { id: "psychic_force_i", name: "Psychic Force", effect: "Feelings of a constant crushing psychic force." },
            { id: "pyromaniac_i", name: "Pyromaniac", effect: "Constantly feelings of pain from a burning sensation." },
            { id: "ice_cold_i", name: "Ice Cold", effect: "Constantly feelings of pain from frostbite." },
            { id: "plasma_strike", name: "Plasma Strike", effect: "Constantly feelings of pain from static electricity." },
        ]
    },
    {
        blessing: "The Blessing of Worldly Wisdom",
        curses: [
            { id: "healing_bliss", name: "Healing Bliss", effect: "Healing spells worsen damage instead of healing." },
            { id: "chloromancy", name: "Chloromancy", effect: "Plants mutate around victim and attack." },
            { id: "the_reinmans_curse", name: "The Reinman’s Curse", effect: "Ages twice as quickly." },
        ]
    },
    {
        blessing: "The Blessing of Bitter Dissatisfaction",
        curses: [
            { id: "mages_familiar_i", name: "Mage’s Familiar", effect: "Any mythological creatures become more hostile towards victim." },
            { id: "self_duplication", name: "Self Duplication", effect: "Tormented by cruel “evil twin” doppelgangers." },
            { id: "personification", name: "Personification", effect: "Objects come to life around victim and begin attacking them." },
            { id: "material_transmutation", name: "Material Transmutation", effect: "Mundane inanimate objects they touch turn to useless junk." },
            { id: "internal_manipulation", name: "Internal Manipulation", effect: "Extreme sickness and internal pain." },
            { id: "supersize_me", name: "Supersize Me", effect: "Shrunken to half height." },
        ]
    },
    {
        blessing: "The Blessing of Lost Hope",
        curses: [
            { id: "spirit_medium", name: "Spirit Medium", effect: "Can conjure spirits physically to manifest and aid you." },
            { id: "spectral_form", name: "Spectral Form", effect: "Phases through objects they try to interact with." },
            { id: "life_drain", name: "Life Drain", effect: "Slowly loses life force." },
            { id: "rise_from_your_graves", name: "Rise From Your Graves", effect: "All corpses in range reanimate and attack the victim." },
            { id: "vampirism", name: "Vampirism", effect: "Becomes a vampire but with none of the upsides." },
        ]
    },
    {
        blessing: "The Blessing of Fallen Peace",
        curses: [
            { id: "thoughtseer", name: "Thoughtseer", effect: "Broadcasts thoughts and feelings telepathically to all those around them." },
            { id: "lucid_dreamer", name: "Lucid Dreamer", effect: "Tormented by nightmares." },
            { id: "memory_lane", name: "Memory Lane", effect: "Become incredibly forgetful." },
            { id: "perfect_stranger", name: "Perfect Stranger", effect: "Has extreme difficulty detecting anyone sneaking." },
            { id: "masquerade", name: "Masquerade", effect: "Destroys ability to recognize people." },
            { id: "psychic_vampire", name: "Psychic Vampire", effect: "Experiences the negative emotions of those around them." },
            { id: "master_telepath", name: "Master Telepath", effect: "Experiences schizophrenic hallucinations." },
            { id: "crowd_control", name: "Crowd Control", effect: "Mundanes nearby may become enraged and attack." },
            { id: "hypnotist", name: "Hypnotist", effect: "Much more open to suggestion." },
        ]
    },
    {
        blessing: "The Blessing of Closed Circuits",
        curses: [
            { id: "weapon_sabotage", name: "Weapon Sabotage", effect: "Weapon prone to breaking and hacks." },
            { id: "vehicle_sabotage", name: "Vehicle Sabotage", effect: "Vehicle prone to breaking and hacks." },
            { id: "digital_infiltrator", name: "Digital Infiltrator", effect: "Electronic devices prone to breaking and hacks." },
            { id: "counter_hacker", name: "Counter Hacker", effect: "Halved effectiveness against other avatars." },
            { id: "verse_hijack", name: "Verse Hijack", effect: "Destabilizes and damages verses they enter." },
            { id: "grey_goo", name: "Grey Goo", effect: "Constant feeling of pain from nanite decomposition." },
        ]
    }
];

const ALL_POWERS = [
    ...Constants.ESSENTIAL_BOONS_DATA, ...Constants.MINOR_BOONS_DATA, ...Constants.MAJOR_BOONS_DATA,
    ...Constants.TELEKINETICS_DATA, ...Constants.METATHERMICS_DATA,
    ...Constants.ELEANORS_TECHNIQUES_DATA, ...Constants.GENEVIEVES_TECHNIQUES_DATA,
    ...Constants.BREWING_DATA, ...Constants.SOUL_ALCHEMY_DATA, ...Constants.TRANSFORMATION_DATA,
    ...Constants.CHANNELLING_DATA, ...Constants.NECROMANCY_DATA, ...Constants.BLACK_MAGIC_DATA,
    ...Constants.TELEPATHY_DATA, ...Constants.MENTAL_MANIPULATION_DATA,
    ...Constants.NET_AVATAR_DATA, ...Constants.TECHNOMANCY_DATA, ...Constants.NANITE_CONTROL_DATA,
];

export const CurseEncyclopediaModal: React.FC<CurseEncyclopediaModalProps> = ({ onClose }) => {
    const ctx = useCharacterContext();
    const rightPanelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    // Create a Set of all selected power IDs
    const selectedPowerIds = useMemo(() => {
        const ids = new Set<string>();
        const sets = [
            ctx.selectedEssentialBoons, ctx.selectedMinorBoons, ctx.selectedMajorBoons,
            ctx.selectedTelekinetics, ctx.selectedMetathermics,
            ctx.selectedEleanorsTechniques, ctx.selectedGenevievesTechniques,
            ctx.selectedBrewing, ctx.selectedSoulAlchemy, ctx.selectedTransformation,
            ctx.selectedChannelling, ctx.selectedNecromancy, ctx.selectedBlackMagic,
            ctx.selectedTelepathy, ctx.selectedMentalManipulation,
            ctx.selectedNetAvatars, ctx.selectedTechnomancies, ctx.selectedNaniteControls
        ];
        sets.forEach(s => s.forEach(id => ids.add(id)));
        return ids;
    }, [ctx]);

    const scrollToId = (id: string) => {
        const element = document.getElementById(`curse-${id}`);
        if (element && rightPanelRef.current) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[150] flex items-center justify-center p-4" onClick={onClose}>
            <div 
                className="bg-[#120b18] border-2 border-purple-500/50 rounded-xl shadow-[0_0_50px_rgba(168,85,247,0.2)] w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 p-4 opacity-20 pointer-events-none">
                    <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="50" cy="50" r="48" stroke="#a855f7" strokeWidth="1" />
                        <path d="M50 20 L50 80 M20 50 L80 50" stroke="#a855f7" strokeWidth="1" />
                    </svg>
                </div>

                <header className="flex items-center justify-between p-6 border-b border-purple-900/50 bg-[#0a050e]">
                    <div className="flex items-center gap-3">
                        <span className="text-3xl">📖</span>
                        <div>
                            <h2 className="font-cinzel text-3xl text-purple-200 tracking-widest text-shadow-purple">
                                CURSE ENCYCLOPEDIA
                            </h2>
                            <p className="text-xs text-purple-400/60 font-mono tracking-wider mt-1">
                                /// FORBIDDEN KNOWLEDGE ARCHIVE ///
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="text-purple-400/50 hover:text-purple-200 text-4xl transition-colors leading-none"
                    >
                        &times;
                    </button>
                </header>

                <div className="flex flex-grow overflow-hidden">
                    {/* Left Sidebar (Map/Grid) */}
                    <div className="w-1/3 md:w-1/4 bg-[#0a050e]/80 border-r border-purple-900/30 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-purple-900 hidden md:block">
                        {CURSE_DATA.map((group) => (
                            <div key={group.blessing} className="mb-6">
                                <h4 className="font-cinzel text-[10px] text-purple-400/70 mb-2 uppercase tracking-wider text-center">{group.blessing.replace("The Blessing of ", "")}</h4>
                                <div className="grid grid-cols-3 gap-2">
                                    {group.curses.map((curse) => {
                                        const powerItem = ALL_POWERS.find(p => p.id === curse.id);
                                        const isSelected = selectedPowerIds.has(curse.id);
                                        const imageSrc = powerItem?.imageSrc || '';

                                        return (
                                            <div 
                                                key={curse.id}
                                                onClick={() => scrollToId(curse.id)}
                                                className={`
                                                    aspect-square rounded border cursor-pointer transition-all relative overflow-hidden group
                                                    ${isSelected 
                                                        ? 'border-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.3)]' 
                                                        : 'border-gray-800 opacity-60 hover:opacity-100 hover:border-purple-500/50'
                                                    }
                                                `}
                                                title={curse.name}
                                            >
                                                <img 
                                                    src={imageSrc} 
                                                    alt={curse.name} 
                                                    className={`w-full h-full object-cover transition-all ${isSelected ? '' : 'grayscale'}`}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right Content Panel */}
                    <main ref={rightPanelRef} className="w-full md:w-3/4 p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-900 scrollbar-track-transparent bg-black/20">
                        <div className="max-w-4xl mx-auto">
                            <div className="bg-purple-900/10 border border-purple-500/30 p-3 rounded mb-8 text-center">
                                <p className="text-sm text-purple-200/80 italic font-serif">
                                    * Any spells not listed are not applicable.
                                </p>
                            </div>

                            <div className="space-y-8 pb-8">
                                {CURSE_DATA.map((group) => (
                                    <div 
                                        key={group.blessing} 
                                        className="bg-black/40 border border-purple-800/30 rounded-lg overflow-hidden flex flex-col"
                                    >
                                        <div className="bg-purple-950/30 p-3 border-b border-purple-900/30">
                                            <h3 className="font-cinzel text-lg text-amber-100/90 text-center tracking-wide">
                                                {group.blessing}
                                            </h3>
                                        </div>
                                        <div className="p-4">
                                            <ul className="space-y-4">
                                                {group.curses.map((curse) => {
                                                    const powerItem = ALL_POWERS.find(p => p.id === curse.id);
                                                    const isSelected = selectedPowerIds.has(curse.id);
                                                    const imageSrc = powerItem?.imageSrc || '';

                                                    return (
                                                        <li 
                                                            id={`curse-${curse.id}`}
                                                            key={curse.id} 
                                                            className={`
                                                                flex flex-col sm:flex-row items-start gap-4 p-3 rounded-lg border transition-all
                                                                ${isSelected 
                                                                    ? 'border-purple-400 bg-purple-900/20' 
                                                                    : 'border-gray-800/50 bg-black/20 text-gray-500'
                                                                }
                                                            `}
                                                        >
                                                            {/* Image next to text */}
                                                            <div className={`flex-shrink-0 w-24 h-24 sm:w-20 sm:h-20 rounded overflow-hidden border ${isSelected ? 'border-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.3)]' : 'border-gray-700 opacity-60'}`}>
                                                                <img 
                                                                    src={imageSrc} 
                                                                    alt={curse.name} 
                                                                    className={`w-full h-full object-cover transition-all ${isSelected ? '' : 'grayscale'}`} 
                                                                />
                                                            </div>

                                                            <div className="flex-grow">
                                                                <span className={`font-bold block text-lg mb-1 ${isSelected ? 'text-purple-300' : 'text-gray-400'}`}>
                                                                    {curse.name}
                                                                </span>
                                                                <span className={`text-sm leading-relaxed ${isSelected ? 'text-gray-300' : 'text-gray-600'}`}>
                                                                    {curse.effect}
                                                                </span>
                                                            </div>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
            
            <style>{`
                .text-shadow-purple {
                    text-shadow: 0 0 10px rgba(168, 85, 247, 0.5);
                }
            `}</style>
        </div>
    );
};
