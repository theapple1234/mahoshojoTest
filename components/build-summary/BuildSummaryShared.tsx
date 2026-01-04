
import React from 'react';
import * as Constants from '../../constants';
import { renderFormattedText } from '../ui';

// Icons
export const SaveDiskIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M17 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
  </svg>
);

export const FileExportIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

export const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
  </svg>
);

export const TemplateIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
    </svg>
);

export const SummaryHeader: React.FC<{ theme: 'dark' | 'light' | 'cyber' }> = ({ theme }) => {
    if (theme === 'cyber') {
         return (
            <div className="border-b border-green-500/50 pb-4 mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold tracking-tighter text-green-500 font-galmuri">SEINARU_MAGECRAFT_GIRLS</h1>
                    <p className="text-[10px] text-green-700 font-galmuri mt-1 uppercase tracking-widest">Original by NXTUB | Interactive by SAVIAPPLE</p>
                </div>
            </div>
        );
    }
    if (theme === 'light') {
        return (
            <div className="flex flex-col items-center mb-10 border-b-2 border-amber-200 pb-6">
                <h1 className="font-cinzel text-5xl font-bold text-slate-900 tracking-wider">Seinaru Magecraft Girls</h1>
                <p className="font-serif text-[10px] text-slate-500 uppercase tracking-[0.2em] mt-3">Original by NXTUB | Interactive by SAVIAPPLE</p>
            </div>
        );
    }
    // Dark/Default
    return (
        <div className="flex flex-col items-center mb-10 border-b border-cyan-900/30 pb-6">
             <h1 className="font-cinzel text-4xl font-bold text-white tracking-[0.1em] text-shadow-glow">SEINARU MAGECRAFT GIRLS</h1>
             <p className="font-cinzel text-[10px] text-gray-500 mt-3 tracking-[0.3em] uppercase">Original by NXTUB | Interactive by SAVIAPPLE</p>
        </div>
    );
};

export const FamilyDetailCard: React.FC<{ member: any, theme: any }> = ({ member, theme }) => {
    const badgeClass = theme.isLight 
        ? 'bg-amber-100/50 text-amber-900 border-amber-200' 
        : (theme.isTerminal ? 'bg-green-900/40 text-green-300 border-green-700' : 'bg-white/10 text-gray-300 border-white/10');

    return (
        <div className={`p-3 rounded-lg border flex items-start gap-4 ${theme.cardBg} ${theme.cardBorder}`}>
            <div className="w-16 h-16 flex-shrink-0 rounded-full overflow-hidden">
                <div 
                    className={`w-full h-full bg-center bg-cover bg-no-repeat ${theme.imgFilter}`}
                    style={{ backgroundImage: `url(${member.imageSrc})` }}
                    role="img"
                    aria-label={member.type}
                />
            </div>
            <div className="flex-grow min-w-0 flex flex-col justify-center">
                <p className={`text-sm font-bold ${theme.textMain} mb-1 uppercase tracking-wide ${theme.fontBody}`}>
                    {member.title} 
                </p>
                {member.note && <p className={`text-[11px] ${theme.textDim} font-normal mb-2 leading-tight ${theme.isTerminal ? 'font-galmuri' : ''}`}>"{member.note}"</p>}
                <div className="flex flex-wrap gap-1.5">
                    {member.traits.map((t: any, i: number) => (
                        <span key={i} className={`text-[9px] px-2 py-0.5 rounded border flex items-center gap-1 ${theme.fontBody} ${badgeClass}`}>
                            {t.title}
                            {t.assignedName && <span className={`${theme.textAccent} font-bold`}>[{t.assignedName}]</span>}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const HousingDetailCard: React.FC<{ home: any, theme: any }> = ({ home, theme }) => {
    const badgeClass = theme.isLight
        ? 'bg-amber-100/50 text-amber-900 border-amber-200'
        : (theme.isTerminal ? 'bg-green-900/40 text-green-300 border-green-700' : 'bg-black/30 text-gray-400 border-white/10');

    return (
        <div className={`p-3 rounded-lg border flex flex-col gap-2 ${theme.cardBg} ${theme.cardBorder}`}>
            <div className="flex items-center gap-3 border-b border-white/10 pb-2">
                <div className={`w-12 h-12 rounded overflow-hidden flex-shrink-0`}>
                     <div 
                        className={`w-full h-full bg-center bg-cover bg-no-repeat ${theme.imgFilter}`}
                        style={{ backgroundImage: `url(${home.imageSrc})` }}
                        role="img"
                        aria-label="Home Image"
                    />
                </div>
                <div>
                    <p className={`text-sm font-bold ${theme.textMain} mb-1 uppercase tracking-wide ${theme.fontBody}`}>{home.title}</p>
                    <p className={`text-[10px] ${theme.textDim} uppercase tracking-wider ${theme.fontBody}`}>{home.dominion} • {home.type}</p>
                    {home.stats && <p className={`text-[10px] ${theme.textAccent} font-mono mt-0.5 ${theme.fontBody}`}>{home.stats}</p>}
                    {home.mythicalPet && <p className={`text-[10px] text-pink-400 font-mono mt-0.5 ${theme.fontBody}`}>Pet: {home.mythicalPet}</p>}
                </div>
            </div>
            {home.upgrades.length > 0 && (
                 <div className="flex flex-wrap gap-1">
                    {home.upgrades.map((u: any, i: number) => (
                        <span key={i} className={`text-[9px] px-1.5 py-0.5 rounded border ${theme.fontBody} ${badgeClass}`}>
                            {u.title}
                            {u.extraInfo && <span className={theme.isLight ? "ml-1 text-amber-700" : "ml-1 text-gray-500"}>({u.extraInfo})</span>}
                            {u.assignedName && <span className={`ml-1 ${theme.textAccent}`}>[{u.assignedName}]</span>}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};

export const CustomSpellCard: React.FC<{ spell: any, index: number, theme: any }> = ({ spell, index, theme }) => {
    const isTerminal = theme.isTerminal;
    const isTemple = theme.cardBg.includes('white');
    const isMilgrath = spell.mialgrathApplied;

    const borderColor = isMilgrath 
        ? (isTerminal ? 'border-green-400' : isTemple ? 'border-amber-500' : 'border-cyan-400') 
        : (isTerminal ? 'border-green-800' : isTemple ? 'border-gray-300' : 'border-gray-700');
        
    const titleColor = isMilgrath
        ? (isTerminal ? 'text-green-300' : isTemple ? 'text-amber-700' : 'text-cyan-300')
        : (isTerminal ? 'text-green-600' : isTemple ? 'text-slate-700' : 'text-gray-400');
    
    const bgClass = isMilgrath
        ? (isTerminal ? 'bg-green-900/30' : isTemple ? 'bg-amber-50' : 'bg-cyan-900/20')
        : (isTerminal ? 'bg-black' : isTemple ? 'bg-white' : 'bg-black/40');

    return (
        <div className={`p-4 rounded-lg border-2 flex flex-col gap-2 relative overflow-hidden ${borderColor} ${bgClass}`}>
            {isMilgrath && (
                <div className={`absolute top-0 right-0 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest ${isTerminal ? 'bg-green-500 text-black font-galmuri' : isTemple ? 'bg-amber-200 text-amber-900' : 'bg-cyan-500 text-black'}`}>
                    MILGRATH
                </div>
            )}
            
            <div className="flex items-center gap-3 border-b border-gray-500/20 pb-2 mb-1">
                <div className={`w-8 h-8 flex items-center justify-center rounded-full border ${borderColor} ${isMilgrath ? 'bg-white/10' : 'bg-transparent'}`}>
                    <span className={`${theme.fontHead} font-bold text-lg ${titleColor}`}>{index + 1}</span>
                </div>
                <h4 className={`${theme.fontHead} font-bold text-sm tracking-wide ${titleColor}`}>
                    CUSTOM SPELL
                </h4>
            </div>

            <p className={`text-xs whitespace-pre-wrap leading-relaxed ${isTerminal ? 'font-galmuri text-green-400' : isTemple ? 'font-serif text-slate-800' : 'font-sans text-gray-300'}`}>
                {spell.description}
            </p>

            {isMilgrath && spell.mialgrathDescription && (
                <div className={`mt-2 pt-2 border-t border-dashed ${isTerminal ? 'border-green-800' : 'border-gray-500/30'}`}>
                    <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${isTerminal ? 'text-green-400 font-galmuri' : isTemple ? 'text-amber-600' : 'text-cyan-400'}`}>
                        Override Effect
                    </p>
                    <p className={`text-xs ${isTerminal ? 'font-galmuri text-green-600' : isTemple ? 'text-slate-600' : 'text-gray-400'}`}>
                        {spell.mialgrathDescription}
                    </p>
                </div>
            )}

            {spell.assignedEntityName && (
                 <div className={`mt-2 inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide border ${isTerminal ? 'border-green-700 bg-green-900/40 text-green-300 font-galmuri' : isTemple ? 'border-amber-200 bg-amber-100 text-amber-800' : 'border-gray-600 bg-gray-800 text-gray-300'}`}>
                    <span className="mr-2 opacity-70">{spell.assignedEntityType}:</span>
                    <span>{spell.assignedEntityName}</span>
                </div>
            )}
        </div>
    );
};