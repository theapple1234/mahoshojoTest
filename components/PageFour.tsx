
import React, { useRef, useState } from 'react';
import { useCharacterContext } from '../context/CharacterContext';
import { DRYADEA_DATA, LIMITLESS_POTENTIAL_DATA, CUSTOM_SPELL_RULES_DATA, LIMITLESS_POTENTIAL_RUNES_DATA } from '../constants';
import { BlessingIntro, SectionHeader, SectionSubHeader, CompanionIcon, WeaponIcon, VehicleIcon, renderFormattedText } from './ui';
import type { CustomSpell, ChoiceItem } from '../types';
import { CompanionSelectionModal } from './SigilTreeOptionCard';
import { BeastSelectionModal } from './BeastSelectionModal';
import { VehicleSelectionModal } from './VehicleSelectionModal';
import { WeaponSelectionModal } from './WeaponSelectionModal';

interface RuneCounterProps {
  ruhaiCount: number;
  availableMialgrathCount: number;
  onAction: (runeId: 'ruhai' | 'mialgrath', action: 'buy' | 'sell') => void;
}

const RuneCounter: React.FC<RuneCounterProps> = ({ ruhaiCount, availableMialgrathCount, onAction }) => {
  const ruhaiMeta = LIMITLESS_POTENTIAL_RUNES_DATA.find(r => r.id === 'ruhai')!;
  const mialgrathMeta = LIMITLESS_POTENTIAL_RUNES_DATA.find(r => r.id === 'mialgrath')!;

  const handleScroll = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only scroll if clicked on the container background, not the items
    if (e.target === e.currentTarget) {
        e.preventDefault();
        document.getElementById('rune-purchase-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleInteraction = (e: React.MouseEvent, id: 'ruhai' | 'mialgrath', type: 'buy' | 'sell') => {
      e.stopPropagation();
      e.preventDefault();
      onAction(id, type);
  };

  return (
    <div
      className="fixed top-1/2 right-0 -translate-y-1/2 bg-black/80 backdrop-blur-md p-4 rounded-l-xl border-l border-t border-b border-amber-900/50 z-50 group cursor-pointer transition-all hover:border-amber-500/70 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)] select-none"
      onClick={handleScroll}
      role="button"
      tabIndex={0}
      aria-label="Scroll to Rune purchase section"
      title="Scroll to Rune purchase section"
    >
      <h4 className="font-cinzel text-xs text-amber-500 mb-4 text-center tracking-[0.2em] border-b border-amber-900/30 pb-2">RUNES</h4>
      <div className="flex flex-col gap-4">
        <div 
            className="flex items-center justify-between gap-4 group/item cursor-pointer hover:bg-white/5 rounded p-1"
            onClick={(e) => handleInteraction(e, 'ruhai', 'buy')}
            onContextMenu={(e) => handleInteraction(e, 'ruhai', 'sell')}
            title="L-Click: Buy | R-Click: Sell"
        >
          <img src={ruhaiMeta.imageSrc} alt={ruhaiMeta.title} className="w-8 h-8 object-contain opacity-80 group-hover/item:opacity-100 transition-opacity" />
          <span className="font-mono text-xl font-bold text-amber-100 w-8 text-center">{ruhaiCount}</span>
        </div>
        <div 
            className="flex items-center justify-between gap-4 group/item cursor-pointer hover:bg-white/5 rounded p-1"
            onClick={(e) => handleInteraction(e, 'mialgrath', 'buy')}
            onContextMenu={(e) => handleInteraction(e, 'mialgrath', 'sell')}
            title="L-Click: Buy | R-Click: Sell"
        >
          <img src={mialgrathMeta.imageSrc} alt={mialgrathMeta.title} className="w-8 h-8 object-contain opacity-80 group-hover/item:opacity-100 transition-opacity" />
          <span className="font-mono text-xl font-bold text-amber-100 w-8 text-center">{availableMialgrathCount}</span>
        </div>
      </div>
      <p className="text-[9px] text-gray-500 text-center mt-2 italic">L-Click: Buy<br/>R-Click: Sell</p>
    </div>
  );
};


interface RuneCardProps {
  rune: ChoiceItem;
  count: number;
  onAction: (action: 'buy' | 'sell') => void;
  onAnimate: (rect: DOMRect) => void;
  fontSize?: 'regular' | 'large';
}

const RuneCard: React.FC<RuneCardProps> = ({ rune, count, onAction, onAnimate, fontSize }) => {
  const { cost, description, imageSrc, title } = rune;
  const imgRef = useRef<HTMLImageElement>(null);

  const handleBuy = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAction('buy');
    if (imgRef.current) {
      onAnimate(imgRef.current.getBoundingClientRect());
    }
  };

  const handleSell = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (count > 0) {
          onAction('sell');
      }
  };

  const isMialgrath = rune.id === 'mialgrath';
  const glowColor = isMialgrath ? 'rgba(34, 211, 238, 0.4)' : 'rgba(245, 158, 11, 0.4)';
  const borderColor = isMialgrath ? 'border-cyan-900/60' : 'border-amber-900/60';
  const hoverBorderColor = isMialgrath ? 'hover:border-cyan-500/60' : 'hover:border-amber-500/60';
  const costClasses = isMialgrath ? 'text-cyan-300 border-cyan-900/50 bg-cyan-950/30' : 'text-amber-300 border-amber-900/50 bg-amber-950/30';
  const ringColor = isMialgrath ? 'group-hover:border-cyan-500/40' : 'group-hover:border-amber-500/40';

  // Scale text classes based on fontSize prop
  const descriptionClass = fontSize === 'large' ? 'text-base' : 'text-sm';
  const costTextClass = fontSize === 'large' ? 'text-sm' : 'text-xs';

  return (
    <div 
      className={`group relative flex flex-col items-center text-center p-6 transition-all duration-500 ease-in-out bg-black/60 rounded-xl h-full border backdrop-blur-sm ${borderColor} ${hoverBorderColor} cursor-pointer select-none`}
      onClick={handleBuy}
      onContextMenu={handleSell}
      role="button"
      aria-label={`Buy ${title} (Right click to sell). Current count: ${count}`}
    >
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-gray-600 group-hover:border-white transition-colors rounded-tl-lg"></div>
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-gray-600 group-hover:border-white transition-colors rounded-tr-lg"></div>
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-gray-600 group-hover:border-white transition-colors rounded-bl-lg"></div>
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-gray-600 group-hover:border-white transition-colors rounded-br-lg"></div>

      {/* Centered Circular Image Container */}
      <div className={`relative w-40 h-40 mb-6 rounded-full border-2 border-dashed border-gray-800 bg-black/40 flex items-center justify-center transition-colors duration-500 ${ringColor}`}>
        <div className="absolute inset-0 bg-white/5 rounded-full blur-xl scale-75 group-hover:scale-100 transition-transform duration-700 opacity-0 group-hover:opacity-20"></div>
        <img 
            ref={imgRef} 
            src={imageSrc} 
            alt={title} 
            className="w-24 h-24 object-contain relative z-10 transform transition-transform duration-500 group-hover:scale-110" 
            style={{ filter: `drop-shadow(0 0 10px ${glowColor})` }}
        />
      </div>
      
      <h3 className="font-cinzel text-3xl font-bold mb-3 text-white tracking-[0.2em] group-hover:text-amber-100 transition-colors">{title}</h3>
      <p className={`${costTextClass} font-mono mb-6 px-4 py-1.5 rounded border ${costClasses}`}>
          {cost}
      </p>
      
      <div className="border-t border-gray-700/50 pt-4 flex-grow w-full">
        <p className={`text-gray-400 ${descriptionClass} leading-relaxed whitespace-pre-wrap text-justify font-light`}>{renderFormattedText(description)}</p>
      </div>
      
       <div className="mt-4 w-full pt-4 border-t border-gray-800">
         <p className="text-[10px] text-gray-600 uppercase tracking-widest font-mono">
            Left Click: Acquire • Right Click: Sell
         </p>
      </div>
    </div>
  );
};

interface CustomSpellInputProps {
    spell: CustomSpell;
    index: number;
    onDescriptionChange: (id: number, text: string) => void;
    onMialgrathToggle: (id: number) => void;
    onMialgrathDescriptionChange: (id: number, text: string) => void;
    canApplyMialgrath: boolean;
    onOpenAssignment: (spellId: number, type: 'companion' | 'beast' | 'vehicle' | 'weapon') => void;
    onClearAssignment: (spellId: number) => void;
    showKpButton?: boolean;
    onToggleKp?: (id: number, type: 'ruhai' | 'milgrath') => void;
}

const CustomSpellInput: React.FC<CustomSpellInputProps> = ({ 
    spell, index, onDescriptionChange, onMialgrathToggle, onMialgrathDescriptionChange, canApplyMialgrath, onOpenAssignment, onClearAssignment,
    showKpButton, onToggleKp
}) => {
    
    const isMialgrathToggleDisabled = !spell.mialgrathApplied && !canApplyMialgrath;
    const mialgrathMeta = LIMITLESS_POTENTIAL_RUNES_DATA.find(r => r.id === 'mialgrath')!;

    return (
        <div className={`
            relative overflow-hidden rounded-lg border-2 transition-all duration-500 group
            ${spell.mialgrathApplied 
                ? 'border-cyan-500/50 bg-[#0a151a] shadow-[0_0_20px_rgba(34,211,238,0.1)]' 
                : 'border-amber-900/20 bg-black/60 hover:border-amber-700/40'
            }
        `}>
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>

            {/* Header / Status Bar */}
            <div className={`
                flex justify-between items-center px-4 py-2 border-b transition-colors duration-500
                ${spell.mialgrathApplied ? 'bg-cyan-950/60 border-cyan-500/30' : 'bg-gray-900/60 border-amber-900/20'}
            `}>
                <div className="flex items-center gap-3">
                    <span className={`font-mono text-[10px] tracking-widest uppercase border px-2 py-0.5 rounded ${spell.mialgrathApplied ? 'text-cyan-300 border-cyan-700/50 bg-cyan-900/20' : 'text-amber-600 border-amber-900/30 bg-amber-950/10'}`}>
                        {spell.mialgrathApplied ? 'MILGRATH_OVERRIDE' : 'RUHAI_STANDARD'}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    {/* Ruhai KP Button */}
                    {showKpButton && onToggleKp && (
                        <button
                            onClick={() => onToggleKp(spell.id, 'ruhai')}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-all ${
                                spell.isRuhaiKpPaid 
                                ? 'bg-pink-600 border-pink-400 text-white shadow-[0_0_8px_rgba(236,72,153,0.5)]' 
                                : 'bg-transparent border-gray-600 text-gray-500 hover:border-pink-500/50 hover:text-pink-400'
                            }`}
                            title="Pay Ruhai cost with Kuri-Odan Points"
                        >
                            KP
                        </button>
                    )}
                    <span className={`font-cinzel text-xl font-bold ${spell.mialgrathApplied ? 'text-cyan-500/30' : 'text-amber-500/20'}`}>
                        NO. {String(index + 1).padStart(2, '0')}
                    </span>
                </div>
            </div>

            <div className="p-6 relative z-10">
                {/* Main Description */}
                <div className="mb-6">
                    <textarea
                        id={`ruhai-${spell.id}`}
                        value={spell.description}
                        onChange={(e) => onDescriptionChange(spell.id, e.target.value)}
                        className={`
                            w-full bg-black/50 border rounded-md p-4 text-gray-300 placeholder-gray-700 
                            focus:outline-none focus:ring-1 transition-all font-sans leading-relaxed resize-none text-sm
                            ${spell.mialgrathApplied 
                                ? 'border-cyan-900/30 focus:border-cyan-500/50 focus:ring-cyan-500/30' 
                                : 'border-amber-900/30 focus:border-amber-500/50 focus:ring-amber-500/30'
                            }
                        `}
                        placeholder="Define spell parameters, manifestations, and limitations..."
                        rows={5}
                    />
                </div>
                
                {/* Mialgrath Section */}
                <div className={`
                    rounded-lg border transition-all duration-500 overflow-hidden
                    ${spell.mialgrathApplied ? 'border-cyan-500/30 bg-cyan-950/20' : 'border-gray-800/50 bg-black/20'}
                `}>
                    <div className="flex items-center gap-5 p-4 relative">
                        {/* Socket Button */}
                        <button 
                            onClick={() => onMialgrathToggle(spell.id)}
                            disabled={isMialgrathToggleDisabled}
                            className={`
                                relative w-12 h-12 rounded-lg flex items-center justify-center border transition-all duration-300 flex-shrink-0
                                ${spell.mialgrathApplied 
                                    ? 'border-cyan-400 bg-cyan-900/40 shadow-[0_0_15px_rgba(34,211,238,0.3)]' 
                                    : isMialgrathToggleDisabled 
                                        ? 'border-gray-800 bg-gray-900/30 cursor-not-allowed opacity-50' 
                                        : 'border-amber-900/30 bg-black hover:border-amber-500/50 hover:bg-amber-950/20 cursor-pointer'
                                }
                            `}
                            title={spell.mialgrathApplied ? "Remove Milgrath Rune" : "Socket Milgrath Rune"}
                        >
                            {spell.mialgrathApplied ? (
                                <img src={mialgrathMeta.imageSrc} alt="Active" className="w-8 h-8 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]" />
                            ) : (
                                <div className="w-3 h-3 rounded-full bg-gray-800 shadow-inner"></div>
                            )}
                        </button>

                        <div className="flex-grow">
                            <h5 className={`font-cinzel font-bold text-xs tracking-widest mb-1 ${spell.mialgrathApplied ? 'text-cyan-300' : 'text-gray-500'}`}>
                                MILGRATH SOCKET
                            </h5>
                            <p className="text-[10px] text-gray-500 leading-tight">
                                {spell.mialgrathApplied 
                                    ? "Reality constraints bypassed." 
                                    : "Socket rune to defy standard restrictions."}
                            </p>
                        </div>

                         {/* Milgrath KP Button */}
                         {showKpButton && spell.mialgrathApplied && onToggleKp && (
                            <button
                                onClick={() => onToggleKp(spell.id, 'milgrath')}
                                className={`absolute right-4 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded text-[10px] font-bold border transition-all ${
                                    spell.isMilgrathKpPaid 
                                    ? 'bg-pink-600 border-pink-400 text-white shadow-[0_0_8px_rgba(236,72,153,0.5)]' 
                                    : 'bg-transparent border-gray-600 text-gray-500 hover:border-pink-500/50 hover:text-pink-400'
                                }`}
                                title="Pay Milgrath cost with Kuri-Odan Points"
                            >
                                KP
                            </button>
                        )}
                    </div>

                    {/* Mialgrath Content */}
                    {spell.mialgrathApplied && (
                        <div className="px-4 pb-4 animate-fade-in space-y-4 border-t border-cyan-900/30 pt-4">
                            <div>
                                <label className="block mb-2 text-xs font-bold text-cyan-500 font-cinzel uppercase tracking-widest flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></span>
                                    Override Protocol
                                </label>
                                <textarea
                                    value={spell.mialgrathDescription}
                                    onChange={(e) => onMialgrathDescriptionChange(spell.id, e.target.value)}
                                    className="w-full bg-black/40 border border-cyan-900/30 rounded p-3 text-cyan-100/90 placeholder-cyan-900/40 focus:outline-none focus:border-cyan-500/40 text-sm transition-colors resize-none font-sans leading-relaxed"
                                    placeholder="Describe rule-breaking effects..."
                                    rows={5}
                                />
                            </div>
                            
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></span>
                                        Construct Binding
                                    </label>
                                    <span className="text-[9px] text-cyan-500/60 font-mono border border-cyan-900/50 px-1.5 py-0.5 rounded bg-cyan-950/30">100 PTS MAX</span>
                                </div>

                                {spell.assignedEntityName ? (
                                    <div className="flex items-center justify-between bg-cyan-900/10 border border-cyan-500/30 rounded p-2 group hover:border-cyan-400/50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 flex items-center justify-center bg-cyan-950/50 rounded text-cyan-400 border border-cyan-800">
                                                {spell.assignedEntityType === 'companion' && <CompanionIcon />}
                                                {spell.assignedEntityType === 'beast' && <CompanionIcon />}
                                                {spell.assignedEntityType === 'vehicle' && <VehicleIcon />}
                                                {spell.assignedEntityType === 'weapon' && <WeaponIcon />}
                                            </div>
                                            <div>
                                                <p className="text-[9px] text-cyan-600 uppercase tracking-wider font-bold">{spell.assignedEntityType}</p>
                                                <p className="text-xs text-cyan-200 font-bold">{spell.assignedEntityName}</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => onClearAssignment(spell.id)}
                                            className="text-cyan-500 hover:text-cyan-200 text-[10px] px-2 py-1 rounded hover:bg-cyan-900/30 transition-colors border border-transparent hover:border-cyan-800"
                                        >
                                            UNBIND
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-4 gap-2">
                                        {[
                                            { type: 'companion', icon: <CompanionIcon />, label: 'Comp' },
                                            { type: 'beast', icon: <CompanionIcon />, label: 'Beast' },
                                            { type: 'vehicle', icon: <VehicleIcon />, label: 'Vehicle' },
                                            { type: 'weapon', icon: <WeaponIcon />, label: 'Weapon' },
                                        ].map((item) => (
                                            <button
                                                key={item.type}
                                                onClick={() => onOpenAssignment(spell.id, item.type as any)}
                                                className="flex flex-col items-center gap-1.5 p-2 rounded border border-gray-800 bg-gray-900/40 hover:bg-cyan-950/40 hover:border-cyan-700/50 hover:text-cyan-300 text-gray-600 transition-all group"
                                            >
                                                <div className="scale-75 group-hover:scale-90 transition-transform">{item.icon}</div>
                                                <span className="text-[9px] uppercase font-bold tracking-tight">{item.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


export const PageFour: React.FC = () => {
    const { 
        acquiredRunes,
        customSpells,
        handleRuneAction,
        handleSpellDescriptionChange,
        handleMialgrathDescriptionChange,
        handleToggleMialgrath,
        mialgrathRunesApplied,
        mialgrathRunesPurchased,
        handleAssignEntityToSpell,
        fontSize,
        selectedStarCrossedLovePacts,
        handleToggleKp
    } = useCharacterContext();

    const [fallingRunes, setFallingRunes] = React.useState<Array<{
        id: number;
        src: string;
        top: number;
        left: number;
        width: number;
        height: number;
        xOffsetEnd: number;
        rotation: number;
    }>>([]);

    const [modalState, setModalState] = useState<{
        spellId: number;
        type: 'companion' | 'beast' | 'vehicle' | 'weapon';
    } | null>(null);

    const handleRuneAnimation = (rect: DOMRect, src: string) => {
        const xOffsetEnd = (Math.random() - 0.5) * 200;
        const rotation = (Math.random() - 0.5) * 60;
        const newRune = {
            id: Date.now() + Math.random(),
            src,
            top: rect.top,
            left: rect.left,
            width: rect.width, // Use captured visual width (including scale)
            height: rect.height, // Use captured visual height (including scale)
            xOffsetEnd,
            rotation,
        };
        setFallingRunes(prev => [...prev, newRune]);
    };

    const handleOpenAssignment = (spellId: number, type: 'companion' | 'beast' | 'vehicle' | 'weapon') => {
        setModalState({ spellId, type });
    };

    const handleClearAssignment = (spellId: number) => {
        handleAssignEntityToSpell(spellId, null, null);
    };

    const handleSelection = (name: string | null) => {
        if (modalState && name) {
            handleAssignEntityToSpell(modalState.spellId, modalState.type, name);
        }
        setModalState(null);
    };

    const getCurrentName = () => {
        if (!modalState) return null;
        const spell = customSpells.find(s => s.id === modalState.spellId);
        return spell?.assignedEntityName || null;
    };

    const totalRuhaiCount = acquiredRunes.get('ruhai') ?? 0;
    const usedRuhaiCount = customSpells.filter(s => s.description.trim().length > 0).length;
    const availableRuhaiCount = Math.max(0, totalRuhaiCount - usedRuhaiCount);

    const availableMialgrathCount = mialgrathRunesPurchased - mialgrathRunesApplied;

    const hasKuriOdanCharm = selectedStarCrossedLovePacts.has('kuri_odans_charm');

    return (
        <>
            {fallingRunes.map(rune => (
                <img
                    key={rune.id}
                    src={rune.src}
                    className="sigil-fall-animation"
                    style={{ 
                        top: rune.top, 
                        left: rune.left,
                        width: `${rune.width}px`,
                        height: `${rune.height}px`,
                        '--x-offset-end': `${rune.xOffsetEnd}px`,
                        '--rotation': `${rune.rotation}deg`,
                    } as React.CSSProperties}
                    onAnimationEnd={() => {
                        setFallingRunes(prev => prev.filter(s => s.id !== rune.id));
                    }}
                />
            ))}
            <RuneCounter ruhaiCount={availableRuhaiCount} availableMialgrathCount={availableMialgrathCount} onAction={handleRuneAction} />

            <BlessingIntro {...DRYADEA_DATA} />
            <BlessingIntro {...LIMITLESS_POTENTIAL_DATA} reverse />
            
            <section className="my-16 max-w-4xl mx-auto bg-black/40 backdrop-blur-md p-8 border border-gray-700/50 rounded-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50"></div>
                <h3 className="text-center font-cinzel text-2xl text-amber-100 mb-6 tracking-wide drop-shadow-md">{renderFormattedText(CUSTOM_SPELL_RULES_DATA.title)}</h3>
                <ol className="space-y-4 text-gray-300 text-sm leading-relaxed">
                    {CUSTOM_SPELL_RULES_DATA.rules.map((rule, index) => (
                        <li key={index} className="flex gap-4 items-start">
                            <span className="font-mono text-amber-500 font-bold">0{index + 1}.</span>
                            <span>{renderFormattedText(rule)}</span>
                        </li>
                    ))}
                </ol>
            </section>

            <section className="my-16" id="rune-purchase-section">
                <SectionHeader>ACQUIRE RUNES</SectionHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto px-4">
                    <RuneCard 
                        rune={LIMITLESS_POTENTIAL_RUNES_DATA[0]} 
                        count={totalRuhaiCount}
                        onAction={(action) => handleRuneAction('ruhai', action)}
                        onAnimate={(rect) => handleRuneAnimation(rect, LIMITLESS_POTENTIAL_RUNES_DATA[0].imageSrc)}
                        fontSize={fontSize}
                    />
                    <RuneCard 
                        rune={LIMITLESS_POTENTIAL_RUNES_DATA[1]}
                        count={mialgrathRunesPurchased}
                        onAction={(action) => handleRuneAction('mialgrath', action)}
                        onAnimate={(rect) => handleRuneAnimation(rect, LIMITLESS_POTENTIAL_RUNES_DATA[1].imageSrc)}
                        fontSize={fontSize}
                    />
                </div>
            </section>
            
            {totalRuhaiCount > 0 && (
                 <section className="my-24 max-w-6xl mx-auto px-4">
                    <div className="flex items-center justify-center gap-4 mb-12">
                        <div className="h-px w-16 bg-amber-800"></div>
                        <h2 className="font-cinzel text-3xl text-amber-100 tracking-[0.2em] text-center">SPELL CONFIGURATION</h2>
                        <div className="h-px w-16 bg-amber-800"></div>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {customSpells.map((spell, index) => (
                            <CustomSpellInput
                                key={spell.id}
                                spell={spell}
                                index={index}
                                onDescriptionChange={handleSpellDescriptionChange}
                                onMialgrathToggle={handleToggleMialgrath}
                                onMialgrathDescriptionChange={handleMialgrathDescriptionChange}
                                canApplyMialgrath={availableMialgrathCount > 0 || spell.mialgrathApplied}
                                onOpenAssignment={handleOpenAssignment}
                                onClearAssignment={handleClearAssignment}
                                showKpButton={hasKuriOdanCharm}
                                onToggleKp={handleToggleKp}
                            />
                        ))}
                    </div>
                </section>
            )}
             <div className="flex justify-center my-24 px-4">
                 <div className="relative w-full max-w-7xl rounded-xl overflow-hidden shadow-2xl border border-gray-800">
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-50"></div>
                    <img src="/images/4RLbmnFv-travler.jpg" alt="Cityscape" className="w-full object-cover no-glow" />
                 </div>
            </div>

            {/* Selection Modals */}
            {modalState && modalState.type === 'companion' && (
                <CompanionSelectionModal 
                    onClose={() => setModalState(null)}
                    onSelect={handleSelection}
                    currentCompanionName={getCurrentName()}
                    pointLimit={100}
                    title="Assign Milgrath Companion"
                    colorTheme="cyan"
                />
            )}
            {modalState && modalState.type === 'beast' && (
                <BeastSelectionModal 
                    onClose={() => setModalState(null)}
                    onSelect={handleSelection}
                    currentBeastName={getCurrentName()}
                    pointLimit={100}
                    title="Assign Milgrath Beast"
                    colorTheme="cyan"
                />
            )}
            {modalState && modalState.type === 'vehicle' && (
                <VehicleSelectionModal 
                    onClose={() => setModalState(null)}
                    onSelect={handleSelection}
                    currentVehicleName={getCurrentName()}
                    pointLimit={100}
                    title="Assign Milgrath Vehicle"
                    colorTheme="cyan"
                />
            )}
            {modalState && modalState.type === 'weapon' && (
                <WeaponSelectionModal 
                    onClose={() => setModalState(null)}
                    onSelect={handleSelection}
                    currentWeaponName={getCurrentName()}
                    pointLimit={100}
                    title="Assign Milgrath Weapon"
                    colorTheme="cyan"
                />
            )}
        </>
    );
};