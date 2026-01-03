
import React from 'react';
import * as Constants from '../../constants';
import type { BuildType, AllBuilds } from '../../types';

interface ReferenceBuildSummaryProps {
    type: BuildType;
    name: string;
    selections: any;
    pointsSpent: number;
    discount?: number;
    isSunForgerActive: boolean;
    template?: 'default' | 'temple' | 'vortex' | 'terminal';
    onImageUpload?: (base64: string) => void;
}

const STORAGE_KEY = 'seinaru_magecraft_builds';

const BUILD_INTROS: Record<BuildType, { imageSrc: string; description: string }> = {
    companions: Constants.COMPANION_INTRO,
    weapons: Constants.WEAPON_INTRO,
    beasts: Constants.BEAST_INTRO,
    vehicles: Constants.VEHICLE_INTRO,
};

const ALL_SPELLS = [
    ...Constants.ESSENTIAL_BOONS_DATA, ...Constants.MINOR_BOONS_DATA, ...Constants.MAJOR_BOONS_DATA,
    ...Constants.TELEKINETICS_DATA, ...Constants.METATHERMICS_DATA,
    ...Constants.ELEANORS_TECHNIQUES_DATA, ...Constants.GENEVIEVES_TECHNIQUES_DATA,
    ...Constants.BREWING_DATA, ...Constants.SOUL_ALCHEMY_DATA, ...Constants.TRANSFORMATION_DATA,
    ...Constants.CHANNELLING_DATA, ...Constants.NECROMANCY_DATA, ...Constants.BLACK_MAGIC_DATA,
    ...Constants.TELEPATHY_DATA, ...Constants.MENTAL_MANIPULATION_DATA,
    ...Constants.ENTRANCE_DATA, ...Constants.FEATURES_DATA, ...Constants.INFLUENCE_DATA,
    ...Constants.NET_AVATAR_DATA, ...Constants.TECHNOMANCY_DATA, ...Constants.NANITE_CONTROL_DATA,
    ...Constants.RIGHTEOUS_CREATION_SPECIALTIES_DATA, ...Constants.RIGHTEOUS_CREATION_MAGITECH_DATA, 
    ...Constants.RIGHTEOUS_CREATION_ARCANE_CONSTRUCTS_DATA, ...Constants.RIGHTEOUS_CREATION_METAMAGIC_DATA,
    ...Constants.STAR_CROSSED_LOVE_PACTS_DATA
];

// --- STANDARD RENDER HELPERS ---
const renderItem = (id: string, pool: any[], label: string, theme: any) => {
    const item = pool.find(i => i.id === id);
    if (!item) return null;
    return (
        <div className={`flex items-center gap-4 ${theme.cardBg} border ${theme.cardBorder} p-3 rounded-lg`}>
            <div className={`w-12 h-12 flex-shrink-0 rounded bg-black/20 overflow-hidden`}>
                <div 
                    className={`w-full h-full bg-center bg-contain bg-no-repeat ${theme.imgFilter || ''}`}
                    style={{ backgroundImage: `url(${item.imageSrc})` }}
                    role="img"
                    aria-label={item.title}
                />
            </div>
            <div>
                <p className={`text-[10px] ${theme.textAccent} ${theme.fontBody} tracking-widest uppercase`}>{label}</p>
                <p className={`text-sm ${theme.fontHead} font-bold ${theme.textMain} uppercase`}>{item.title}</p>
            </div>
        </div>
    );
};

const renderGrid = (ids: string[] | Set<string> | Map<string, any>, pool: any[], label: string, theme: any) => {
    const array = ids instanceof Set ? Array.from(ids) : (ids instanceof Map ? Array.from(ids.keys()) : ids);
    if (!array || array.length === 0) return null;
    
    return (
        <div className="space-y-2">
            <h5 className={`font-mono text-[10px] ${theme.textDim} uppercase tracking-[0.3em] mb-2`}>{label}</h5>
            <div className="grid grid-cols-2 gap-2">
                {array.map(id => {
                    const item = pool.find(i => i.id === id);
                    if (!item) return null;
                    const count = ids instanceof Map ? ids.get(id) : null;
                    return (
                        <div key={id} className={`flex items-center gap-3 ${theme.cardBg} border ${theme.cardBorder} p-2 rounded`}>
                            <div className={`w-8 h-8 flex-shrink-0 rounded overflow-hidden`}>
                                <div 
                                    className={`w-full h-full bg-center bg-contain bg-no-repeat ${theme.imgFilter || ''}`}
                                    style={{ backgroundImage: `url(${item.imageSrc})` }}
                                    role="img"
                                    aria-label={item.title}
                                />
                            </div>
                            <div className="min-w-0">
                                <p className={`text-[11px] font-bold ${theme.textMain} truncate ${theme.fontBody}`}>{item.title}</p>
                                {count && count > 1 && <p className={`text-[9px] ${theme.textAccent} font-mono`}>x{count}</p>}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const renderSpells = (spellIds: Set<string> | string[], label: string, color: string, theme: any, limit: number = Infinity) => {
    const arr = Array.from(spellIds).slice(0, limit);
    if (arr.length === 0) return null;
    
    let displayColor = color;
    let indicatorColor = color.replace('text-', 'bg-');
    
    // Override colors for specific themes
    if (theme.isTerminal) {
        displayColor = 'text-green-400';
        indicatorColor = 'bg-green-500';
    }

    return (
        <div className="space-y-2">
            <h5 className={`font-mono text-[10px] ${theme.textDim} uppercase tracking-[0.3em] mb-2`}>{label}</h5>
            <div className="grid grid-cols-2 gap-2">
                {arr.map(id => {
                    const spell = ALL_SPELLS.find(s => s.id === id);
                    if (!spell) return null;
                    return (
                        <div key={id} className={`flex items-center gap-2 ${theme.cardBg} border ${theme.cardBorder} p-2 rounded`}>
                            <div className={`w-1 h-full rounded-full ${indicatorColor}`}></div>
                            <p className={`text-[10px] font-bold uppercase truncate ${displayColor} ${theme.fontBody}`}>{spell.title}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export const ReferenceBuildSummary: React.FC<ReferenceBuildSummaryProps> = ({ 
    type, name, selections, pointsSpent, discount = 0, isSunForgerActive, template = 'default', onImageUpload
}) => {
    if (!selections) return null;

    const visualSrc = selections.customImage || BUILD_INTROS[type].imageSrc;
    const hasDiscount = discount > 0 || isSunForgerActive;
    
    // Generate unique ID suffix based on type and sanitized name
    const uniqueIdSuffix = `${type}-${name.replace(/[^a-z0-9]/gi, '-')}`;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !onImageUpload) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                onImageUpload(reader.result);
            }
        };
        reader.readAsDataURL(file);
    };

    // --- VORTEX LAYOUT LOGIC ---
    if (template === 'vortex') {
        const isWeaponMultiCat = type === 'weapons' && (selections.category?.length >= 2);
        const isVehicleMultiCat = type === 'vehicles' && (selections.category?.length >= 2);

        // Ring 1: Inner (Category, Relationship, Power Level, Size)
        const orbit1Items: any[] = [];
        if (type === 'companions') {
            if (selections.category) orbit1Items.push(Constants.COMPANION_CATEGORIES.find(c => c.id === selections.category));
            if (selections.relationship) orbit1Items.push(Constants.COMPANION_RELATIONSHIPS.find(c => c.id === selections.relationship));
            if (selections.powerLevel) orbit1Items.push(Constants.COMPANION_POWER_LEVELS.find(c => c.id === selections.powerLevel));
        } else if (type === 'weapons' || type === 'vehicles' || type === 'beasts') {
            // Add Categories
            selections.category?.forEach((c: string) => {
                const pool = type === 'weapons' ? Constants.WEAPON_CATEGORIES : type === 'vehicles' ? Constants.VEHICLE_CATEGORIES : Constants.BEAST_CATEGORIES;
                orbit1Items.push(pool.find(cat => cat.id === c));
            });
            // Add Size (Beasts)
            if (type === 'beasts' && selections.size) orbit1Items.push(Constants.BEAST_SIZES.find(s => s.id === selections.size));
        }

        // Ring 2: Middle (Perks)
        const orbit2Items: any[] = [];
        const perksPool = type === 'companions' ? Constants.COMPANION_PERKS : 
                          type === 'weapons' ? Constants.WEAPON_PERKS : 
                          type === 'beasts' ? Constants.BEAST_PERKS : Constants.VEHICLE_PERKS;

        if (selections.perks instanceof Map) {
            selections.perks.forEach((count: number, perkId: string) => {
                const perk = perksPool.find(p => p.id === perkId);
                if (!perk) return;
                
                // Construct base item
                const item = { ...perk, count } as any;

                // Assign names instead of creating duplicate items
                if (perkId === 'inhuman_form' && selections.inhumanFormBeastName) {
                    item.assignedName = selections.inhumanFormBeastName;
                    item.isDerived = true; // Optional: Keep for styling if needed, though mostly used for border color
                }
                if (perkId === 'special_weapon' && selections.specialWeaponName) {
                    item.assignedName = selections.specialWeaponName;
                    item.isDerived = true;
                }
                
                orbit2Items.push(item);
            });
        }

        // Ring 3: Outer (Personality Traits & Spells)
        const orbit3Items: any[] = [];
        if (selections.traits instanceof Set) {
            Array.from(selections.traits).forEach(key => {
                const item = Constants.COMPANION_PERSONALITY_TRAITS.find(t => t.id === key);
                if (item) orbit3Items.push({ ...item, noBorder: true });
            });
        }
        // Add spells with slicing logic
        const addSpells = (map: Set<string> | undefined, count: number) => {
            if (map instanceof Set) {
                Array.from(map).slice(0, count).forEach(id => {
                    const spell = ALL_SPELLS.find(s => s.id === id);
                    if (spell) orbit3Items.push(spell);
                });
            }
        };

        addSpells(selections.powerLevelMap, Infinity); // Default
        addSpells(selections.signaturePowerMap, selections.perks.get('signature_power') || 0);
        addSpells(selections.specialWeaponMap, Infinity); // Fixed limit
        addSpells(selections.darkMagicianMap, selections.perks.get('dark_magician') || 0);
        addSpells(selections.attunedSpellMap, selections.perks.get('attuned_spell') || 0);
        addSpells(selections.magicalBeastMap, selections.magicalBeastCount || 0);

        return (
            <div className="flex flex-col items-center bg-black p-8 rounded-xl shadow-2xl border-4 border-double border-purple-900/30">
                {/* Header */}
                <div className="text-center mb-6">
                    <p className="font-mono text-[10px] text-purple-400/60 uppercase tracking-[0.5em] mb-2">Seinaru Magecraft Girls</p>
                    <h1 className="font-cinzel text-3xl font-bold text-white tracking-[0.1em] mb-1 uppercase">{name}</h1>
                    <p className="font-cinzel text-sm text-purple-400 tracking-widest">{type.toUpperCase()} BUILD</p>
                </div>

                <div className="relative w-full aspect-square flex items-center justify-center p-10 font-cinzel text-white">
                    {/* Background Circle - Clipped for Gradient */}
                    <div className="absolute inset-0 rounded-full bg-black overflow-hidden pointer-events-none">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(76,29,149,0.3),transparent_70%)]"></div>
                    </div>
                    
                    {/* Ring 3 (Outer) - Traits & Spells - Not clipped, allowing overflow */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="relative w-[90%] h-[90%] rounded-full border border-purple-500/20">
                            {orbit3Items.map((item, idx, arr) => {
                                const angle = (360 / arr.length) * idx;
                                return (
                                    <div 
                                        key={idx} 
                                        className="absolute w-28 flex flex-col items-center -ml-14 -mt-7" 
                                        style={{ 
                                            left: `${50 + 50 * Math.cos(angle * Math.PI / 180)}%`, 
                                            top: `${50 + 50 * Math.sin(angle * Math.PI / 180)}%` 
                                        }}
                                    >
                                        <div className={`w-14 h-14 rounded-full overflow-hidden bg-black shrink-0 ${item.noBorder ? '' : 'border border-purple-500/50'}`}>
                                            <div 
                                                className="w-full h-full bg-center bg-cover bg-no-repeat"
                                                style={{ backgroundImage: `url(${item.imageSrc})` }}
                                            />
                                        </div>
                                        <span className="text-[9px] text-purple-200 text-center font-cinzel mt-1 leading-tight bg-black/70 px-1 rounded backdrop-blur-sm max-w-full z-20">
                                            {item.title}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Ring 2 (Middle) - Perks */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="relative w-[65%] h-[65%] rounded-full border border-purple-500/40">
                            {orbit2Items.map((item, idx, arr) => {
                                let angle = (360 / arr.length) * idx;
                                // If 4 items, shift by 45 degrees to form an X shape instead of +
                                if (arr.length === 4) {
                                    angle += 45;
                                }
                                
                                return (
                                    <div key={idx} className="absolute w-24 flex flex-col items-center -ml-12 -mt-8" style={{ left: `${50 + 50 * Math.cos(angle * Math.PI / 180)}%`, top: `${50 + 50 * Math.sin(angle * Math.PI / 180)}%` }}>
                                        <div className={`w-16 h-16 rounded-full border-2 ${item.isDerived ? 'border-cyan-400' : 'border-purple-400'} bg-black overflow-hidden z-10`}>
                                            <div 
                                                className="w-full h-full bg-center bg-cover bg-no-repeat"
                                                style={{ backgroundImage: `url(${item.imageSrc})` }}
                                            />
                                        </div>
                                        {item.count && item.count > 1 && (
                                            <span className="absolute top-0 right-0 bg-purple-600 text-white text-[10px] font-bold px-1.5 rounded-full border border-black z-20">
                                                x{item.count}
                                            </span>
                                        )}
                                        <div className="text-center mt-1 leading-tight bg-black/70 px-2 py-0.5 rounded backdrop-blur-sm max-w-full z-20 flex flex-col items-center">
                                            <span className="text-[10px] text-purple-100 font-cinzel">{item.title}</span>
                                            {item.assignedName && (
                                                <span className="text-[9px] text-cyan-300 font-bold block mt-0.5 w-full whitespace-normal">[{item.assignedName}]</span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Ring 1 (Inner) - Base Stats */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="relative w-[40%] h-[40%] rounded-full border border-purple-500/60">
                            {orbit1Items.filter(Boolean).map((item, idx, arr) => {
                                const angle = (360 / arr.length) * idx - 90;
                                return (
                                    <div key={idx} className="absolute w-20 flex flex-col items-center -ml-10 -mt-8" style={{ left: `${50 + 50 * Math.cos(angle * Math.PI / 180)}%`, top: `${50 + 50 * Math.sin(angle * Math.PI / 180)}%` }}>
                                        <div className="w-16 h-16 rounded-full border-2 border-fuchsia-400 bg-black overflow-hidden shadow-[0_0_15px_#d946ef]">
                                             <div 
                                                className="w-full h-full bg-center bg-cover bg-no-repeat"
                                                style={{ backgroundImage: `url(${item.imageSrc})` }}
                                            />
                                        </div>
                                        <span className="text-[10px] text-fuchsia-200 text-center font-cinzel mt-1 leading-tight bg-black/70 px-2 py-0.5 rounded backdrop-blur-sm max-w-full z-20">
                                            {item.title}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Center */}
                    <div className="relative z-10 w-[25%] h-[25%] rounded-full border-4 border-purple-500 shadow-[0_0_50px_rgba(168,85,247,0.5)] bg-black overflow-hidden flex items-center justify-center group">
                        <div 
                            className="absolute inset-0 w-full h-full bg-center bg-cover bg-no-repeat"
                            style={{ backgroundImage: `url(${visualSrc})` }}
                        />
                        
                        {/* Points Overlay - Kept here for Reference Page as requested */}
                        <div className="absolute bottom-2 px-3 py-1 bg-black/60 rounded-full border border-purple-500/30 backdrop-blur-sm z-20 pointer-events-none">
                            <span className="text-purple-100 font-cinzel font-bold text-xs tracking-widest">{pointsSpent} Points</span>
                        </div>

                        {onImageUpload && (
                            <label htmlFor={`vortex-img-upload-${uniqueIdSuffix}`} className="absolute inset-0 w-full h-full z-50 cursor-pointer">
                                <input 
                                    id={`vortex-img-upload-${uniqueIdSuffix}`}
                                    name={`vortex-img-upload-${uniqueIdSuffix}`}
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleFileChange} 
                                    className="hidden"
                                    title="Change Image"
                                />
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-40">
                                    <span className="text-[10px] text-white font-bold uppercase tracking-widest text-center">Change<br/>Image</span>
                                </div>
                            </label>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // --- STANDARD THEMES CONFIGURATION ---
    const themes = {
        default: {
            bg: "bg-[#0a101f]",
            border: "border-4 border-double border-cyan-900/30",
            textMain: "text-white",
            textDim: "text-gray-400",
            textAccent: "text-cyan-400",
            fontHead: "font-cinzel",
            fontBody: "font-sans",
            cardBg: "bg-black/40",
            cardBorder: "border-white/5",
            statBox: "bg-black/60 border-cyan-500/30",
            divider: "border-cyan-500/20",
            imgFilter: "",
            isTerminal: false
        },
        temple: {
            bg: "bg-[#f4f1ea]",
            border: "border-4 border-double border-amber-700/40",
            textMain: "text-slate-900",
            textDim: "text-slate-600",
            textAccent: "text-amber-700",
            fontHead: "font-cinzel",
            fontBody: "font-serif",
            cardBg: "bg-white/60",
            cardBorder: "border-amber-900/10",
            statBox: "bg-white border-amber-700/20 shadow-sm",
            divider: "border-amber-700/20",
            imgFilter: "sepia-[0.3]",
            isTerminal: false
        },
        terminal: {
            bg: "bg-black",
            border: "border-2 border-green-500/80",
            textMain: "text-green-500",
            textDim: "text-green-700",
            textAccent: "text-green-400",
            fontHead: "font-mono",
            fontBody: "font-mono",
            cardBg: "bg-green-900/10",
            cardBorder: "border-green-500/30",
            statBox: "bg-black border-green-500",
            divider: "border-green-500/50",
            imgFilter: "grayscale contrast-125",
            isTerminal: true
        }
    };

    const theme = themes[template as keyof typeof themes] || themes.default;
    const isTerminal = template === 'terminal';

    return (
        <div className={`p-8 flex flex-col ${theme.bg} ${theme.border} rounded-xl shadow-2xl`}>
            {/* Header */}
            <div className={`text-center mb-8 border-b-2 ${theme.divider} pb-6`}>
                <p className={`font-mono text-[10px] ${theme.textDim} uppercase tracking-[0.5em] mb-2`}>
                    {isTerminal ? 'Seinaru Magecraft Girls' : 'Seinaru Magecraft Girls'}
                </p>
                <h1 className={`${theme.fontHead} text-3xl font-bold ${theme.textMain} tracking-[0.1em] mb-1 uppercase`}>{name}</h1>
                <p className={`${theme.fontHead} text-sm ${theme.textAccent} tracking-widest`}>{type.toUpperCase()} BUILD</p>
            </div>

            {/* Main Stats Bar */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                <div className={`${theme.statBox} border rounded-lg p-2 text-center`}>
                    <p className={`text-[9px] ${theme.textDim} uppercase font-mono tracking-widest`}>Points</p>
                    <p className={`text-xl ${theme.fontHead} font-bold ${theme.textMain}`}>{pointsSpent}</p>
                </div>
                <div className={`${theme.statBox} border rounded-lg p-2 text-center`}>
                    <p className={`text-[9px] ${theme.textDim} uppercase font-mono tracking-widest`}>Type</p>
                    <p className={`text-lg ${theme.fontHead} font-bold ${theme.textAccent} uppercase`}>{type.slice(0, -1)}</p>
                </div>
                <div className={`${theme.statBox} border rounded-lg p-2 text-center`}>
                    <p className={`text-[9px] ${theme.textDim} uppercase font-mono tracking-widest`}>Discounted Points</p>
                    <p className={`text-xl ${theme.fontHead} font-bold text-yellow-500`}>
                        {isSunForgerActive ? `${selections.bpSpent || 0} BP` : (discount > 0 ? `${discount} pts` : "N/A")}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6 flex-grow">
                {/* Visual Column */}
                <div className="col-span-12 md:col-span-4 space-y-6">
                    <div className={`aspect-[9/16] ${theme.cardBg} border-2 ${theme.cardBorder} rounded-lg overflow-hidden relative shadow-lg group`}>
                         {/* Replace img with div background for better html2canvas support */}
                        <div 
                            className={`w-full h-full bg-center bg-cover bg-no-repeat ${theme.imgFilter}`}
                            style={{ backgroundImage: `url(${visualSrc})` }}
                            role="img"
                            aria-label="Character Visual"
                        />
                         {onImageUpload && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                <label htmlFor={`arcane-img-upload-${uniqueIdSuffix}`} className="cursor-pointer px-3 py-1.5 bg-black/60 border border-white/30 rounded text-xs text-white uppercase tracking-widest font-bold hover:bg-black/80 hover:border-white/60 transition-all">
                                    Change Image
                                    <input 
                                        id={`arcane-img-upload-${uniqueIdSuffix}`}
                                        name={`arcane-img-upload-${uniqueIdSuffix}`}
                                        type="file" 
                                        accept="image/*" 
                                        onChange={handleFileChange} 
                                        className="hidden" 
                                    />
                                </label>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
                    </div>
                    
                    {/* Common categories/status */}
                    <div className="space-y-3">
                        {type === 'companions' && (
                            <>
                                {renderItem(selections.category, Constants.COMPANION_CATEGORIES, 'Category', theme)}
                                {renderItem(selections.relationship, Constants.COMPANION_RELATIONSHIPS, 'Relationship', theme)}
                                {renderItem(selections.powerLevel, Constants.COMPANION_POWER_LEVELS, 'Power Level', theme)}
                            </>
                        )}
                        {type === 'beasts' && (
                            <>
                                {selections.category.map((c: string) => renderItem(c, Constants.BEAST_CATEGORIES, 'Classification', theme))}
                                {renderItem(selections.size, Constants.BEAST_SIZES, 'Physical Scale', theme)}
                            </>
                        )}
                        {type === 'weapons' && (
                            <div className="space-y-2">
                                <h5 className={`font-mono text-[10px] ${theme.textDim} uppercase tracking-[0.3em]`}>Categories</h5>
                                {selections.category.map((c: string) => renderItem(c, Constants.WEAPON_CATEGORIES, 'Form', theme))}
                            </div>
                        )}
                        {type === 'vehicles' && (
                            <div className="space-y-2">
                                <h5 className={`font-mono text-[10px] ${theme.textDim} uppercase tracking-[0.3em]`}>Categories</h5>
                                {selections.category.map((c: string) => renderItem(c, Constants.VEHICLE_CATEGORIES, 'Model', theme))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Details Column */}
                <div className="col-span-12 md:col-span-8 space-y-8">
                    {/* Perks Section */}
                    {type === 'companions' && renderGrid(selections.perks, Constants.COMPANION_PERKS, 'Active Perks', theme)}
                    {type === 'weapons' && renderGrid(selections.perks, Constants.WEAPON_PERKS, 'System Upgrades', theme)}
                    {type === 'beasts' && renderGrid(selections.perks, Constants.BEAST_PERKS, 'Mutations & Perks', theme)}
                    {type === 'vehicles' && renderGrid(selections.perks, Constants.VEHICLE_PERKS, 'Integrated Systems', theme)}

                    {/* Personality Section */}
                    {(type === 'companions' || (type === 'weapons' && selections.perks.has('chatterbox')) || (type === 'beasts' && selections.perks.has('chatterbox_beast')) || (type === 'vehicles' && selections.perks.has('chatterbox_vehicle'))) && (
                        renderGrid(selections.traits, Constants.COMPANION_PERSONALITY_TRAITS, 'Personality Matrix', theme)
                    )}

                    {/* Spells & Map Selections */}
                    <div className="grid grid-cols-1 gap-4">
                        {type === 'companions' && (
                            <>
                                {selections.powerLevelMap?.size > 0 && renderSpells(selections.powerLevelMap, 'Standard Mage Spells', 'text-cyan-400', theme)}
                                {selections.signaturePowerMap?.size > 0 && renderSpells(selections.signaturePowerMap, 'Signature Empowerments', 'text-yellow-400', theme, selections.perks.get('signature_power'))}
                                {selections.specialWeaponMap?.size > 0 && renderSpells(selections.specialWeaponMap, 'Weaponized Enchantments', 'text-orange-400', theme)}
                                {selections.darkMagicianMap?.size > 0 && renderSpells(selections.darkMagicianMap, 'Dark Arts & Forbidden Magic', 'text-purple-400', theme, selections.perks.get('dark_magician'))}
                            </>
                        )}
                        {type === 'weapons' && selections.attunedSpellMap?.size > 0 && (
                            renderSpells(selections.attunedSpellMap, 'Attuned Spell Matrix', 'text-cyan-400', theme, selections.perks.get('attuned_spell'))
                        )}
                        {type === 'beasts' && selections.magicalBeastMap?.size > 0 && (
                            renderSpells(selections.magicalBeastMap, 'Magical Instincts', 'text-green-400', theme, selections.magicalBeastCount)
                        )}
                    </div>

                    {/* Assigned Entities (Companions Only) */}
                    {type === 'companions' && (
                        <div className="grid grid-cols-2 gap-4">
                            {selections.inhumanFormBeastName && (
                                <div className={`${theme.cardBg} border ${theme.cardBorder} p-3 rounded-lg text-center`}>
                                    <p className={`text-[9px] ${theme.textDim} uppercase font-mono tracking-widest mb-1`}>Inhuman Core</p>
                                    <p className={`text-xs font-bold ${theme.textAccent}`}>{selections.inhumanFormBeastName}</p>
                                </div>
                            )}
                            {selections.specialWeaponName && (
                                <div className={`${theme.cardBg} border ${theme.cardBorder} p-3 rounded-lg text-center`}>
                                    <p className={`text-[9px] ${theme.textDim} uppercase font-mono tracking-widest mb-1`}>Signature Armament</p>
                                    <p className={`text-xs font-bold ${theme.textAccent}`}>{selections.specialWeaponName}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            
        </div>
    );
};
