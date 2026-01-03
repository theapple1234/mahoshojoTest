
import React from 'react';
import { useCharacterContext } from '../context/CharacterContext';
import { RETIREMENT_INTRO_DATA, RETIREMENT_CHOICES_DATA, CHILD_OF_GOD_DATA } from '../constants';
import type { ChoiceItem } from '../types';
import { renderFormattedText } from './ui';

const RetirementCard: React.FC<{
    item: ChoiceItem;
    isSelected: boolean;
    onSelect: (id: string) => void;
}> = ({ item, isSelected, onSelect }) => {
    return (
        <div 
            onClick={() => onSelect(item.id)}
            className={`
                group relative flex flex-col h-full overflow-hidden rounded-xl transition-all duration-500 cursor-pointer
                ${isSelected 
                    ? 'ring-2 ring-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.3)] bg-slate-900 scale-[1.02]' 
                    : 'border border-slate-700 bg-black/40 hover:border-slate-500 hover:shadow-xl hover:-translate-y-2'
                }
            `}
        >
            {/* Image Container with Overlay */}
            <div className="relative h-64 w-full overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10 opacity-80 transition-opacity duration-500 ${isSelected ? 'opacity-40' : 'group-hover:opacity-60'}`}></div>
                <img 
                    src={item.imageSrc} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
            </div>

            {/* Content */}
            <div className="relative z-20 flex flex-col flex-grow p-6 -mt-12">
                <h3 className={`
                    font-cinzel text-xl font-bold tracking-widest text-center mb-4 transition-colors duration-300
                    ${isSelected ? 'text-cyan-300 text-shadow-glow' : 'text-gray-200 group-hover:text-white'}
                `}>
                    {item.title}
                </h3>
                
                <div className="flex-grow">
                    <div className={`h-px w-16 mx-auto mb-4 transition-all duration-500 ${isSelected ? 'bg-cyan-500 w-32 shadow-[0_0_10px_cyan]' : 'bg-slate-600 group-hover:bg-slate-400'}`}></div>
                    <p className="text-sm text-gray-400 leading-relaxed text-justify group-hover:text-gray-300 transition-colors">
                        {renderFormattedText(item.description)}
                    </p>
                </div>

                {isSelected && (
                    <div className="mt-6 text-center">
                        <span className="inline-block px-4 py-1 border border-cyan-500/50 rounded-full text-xs text-cyan-300 tracking-widest uppercase bg-cyan-950/30 shadow-[0_0_10px_rgba(34,211,238,0.2)]">
                            Path Selected
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

const TheHiddenOption: React.FC<{
    item: ChoiceItem;
    isSelected: boolean;
    onSelect: (id: string) => void;
}> = ({ item, isSelected, onSelect }) => {
    return (
        <div 
            onClick={() => onSelect(item.id)}
            className={`
                relative w-full max-w-5xl mx-auto overflow-hidden rounded-2xl border transition-all duration-700 cursor-pointer group
                ${isSelected 
                    ? 'border-red-500 bg-red-950/30 shadow-[0_0_50px_rgba(239,68,68,0.25)]' 
                    : 'border-red-900/30 bg-black/60 hover:border-red-700/50 hover:shadow-[0_0_30px_rgba(220,38,38,0.1)]'
                }
            `}
        >
            <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>
            
            <div className="flex flex-col md:flex-row">
                {/* Image Section */}
                <div className="relative md:w-2/5 h-64 md:h-auto overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/80 z-10 md:bg-gradient-to-l md:from-black/90 md:to-transparent"></div>
                    <img 
                        src={item.imageSrc} 
                        alt="The Child" 
                        className={`w-full h-full object-cover transition-transform duration-1000 ${isSelected ? 'scale-110 saturate-100' : 'scale-100 saturate-0 group-hover:saturate-50 group-hover:scale-105'}`}
                    />
                </div>

                {/* Content Section */}
                <div className="relative z-20 flex flex-col justify-center p-8 md:w-3/5">
                    <div className="mb-2">
                        <span className={`text-[10px] uppercase tracking-[0.3em] font-bold ${isSelected ? 'text-red-500' : 'text-red-900 group-hover:text-red-700'}`}>
                            /// WARNING: CRITICAL DECISION ///
                        </span>
                    </div>
                    <h3 className={`
                        font-cinzel text-3xl md:text-4xl font-bold mb-6 tracking-wide transition-colors duration-500
                        ${isSelected ? 'text-red-100 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 'text-gray-500 group-hover:text-red-200'}
                    `}>
                        {item.title}
                    </h3>
                    
                    <div className="space-y-4 text-sm leading-relaxed">
                        {item.description.split('\n\n').map((para, idx) => (
                            <p key={idx} className={`transition-colors duration-500 ${isSelected ? 'text-gray-300' : 'text-gray-600 group-hover:text-gray-400'}`}>
                                {renderFormattedText(para)}
                            </p>
                        ))}
                    </div>

                    <div className={`mt-8 transition-all duration-500 ${isSelected ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-2 group-hover:opacity-80 group-hover:translate-y-0'}`}>
                        <button className={`
                            px-8 py-3 rounded border font-cinzel text-sm tracking-widest uppercase transition-all
                            ${isSelected 
                                ? 'bg-red-600 text-white border-red-500 shadow-[0_0_20px_rgba(220,38,38,0.6)]' 
                                : 'bg-transparent text-red-800 border-red-900 group-hover:text-red-400 group-hover:border-red-500'}
                        `}>
                            {isSelected ? 'Destiny Sealed' : 'Save the Child'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const PageSix: React.FC = () => {
    const { 
        selectedRetirementChoiceId, 
        handleRetirementChoiceSelect,
        selectedChildOfGodChoiceId,
        handleChildOfGodChoiceSelect,
        isPhotosensitivityDisabled
    } = useCharacterContext();

    const childOfGodChoice = CHILD_OF_GOD_DATA[0];
    const isChildFree = selectedChildOfGodChoiceId === childOfGodChoice.id;

    const handleSecretClick = () => {
        window.dispatchEvent(new Event('navigate-to-secret-page'));
    };

    return (
        <>
            <style>{`
                .text-shadow-glow {
                    text-shadow: 0 0 10px rgba(34, 211, 238, 0.6), 0 0 20px rgba(34, 211, 238, 0.4);
                }
                @keyframes glitch {
                    0% { transform: translate(0); }
                    20% { transform: translate(-2px, 2px); }
                    40% { transform: translate(-2px, -2px); }
                    60% { transform: translate(2px, 2px); }
                    80% { transform: translate(2px, -2px); }
                    100% { transform: translate(0); }
                }
                .glitch-text:hover {
                    animation: glitch 0.3s infinite;
                    color: #ef4444;
                    text-shadow: 2px 2px #500;
                }
                /* Safe hover effect for non-photosensitive mode */
                .safe-hover:hover {
                    color: #ef4444;
                    text-shadow: 0 0 8px rgba(239, 68, 68, 0.5);
                }
            `}</style>

            {/* Intro Section */}
            <section className="relative py-12 mb-20">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-900/10 blur-[100px] rounded-full pointer-events-none"></div>
                <div className="relative max-w-4xl mx-auto bg-black/40 backdrop-blur-md border border-slate-700/50 p-10 rounded-2xl shadow-2xl">
                    <div className="flex justify-center mb-6">
                        <div className="h-px w-24 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
                    </div>
                    <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap text-center font-light">
                        {renderFormattedText(RETIREMENT_INTRO_DATA.description)}
                    </p>
                    <div className="flex justify-center mt-6">
                        <div className="h-px w-24 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
                    </div>
                </div>
            </section>

            {/* Standard Endings */}
            <section className="mb-32">
                <div className="flex items-center justify-center gap-4 mb-12">
                    <div className="h-px w-12 bg-slate-700"></div>
                    <h2 className="font-cinzel text-2xl text-slate-300 tracking-[0.2em]">CHOOSE YOUR PATH</h2>
                    <div className="h-px w-12 bg-slate-700"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 max-w-[1600px] mx-auto px-4">
                    {RETIREMENT_CHOICES_DATA.map(choice => (
                        <div key={choice.id} className="h-full">
                            <RetirementCard
                                item={choice}
                                isSelected={selectedRetirementChoiceId === choice.id}
                                onSelect={handleRetirementChoiceSelect}
                            />
                        </div>
                    ))}
                </div>
            </section>

            {/* The Hidden/Final Choice */}
            <section className="mb-32 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-900/5 to-transparent pointer-events-none"></div>
                <div className="relative px-4">
                    <TheHiddenOption 
                        item={childOfGodChoice}
                        isSelected={selectedChildOfGodChoiceId === childOfGodChoice.id}
                        onSelect={handleChildOfGodChoiceSelect}
                    />
                </div>
            </section>
            
            <footer className="text-center pb-12">
                <div className="inline-flex flex-col items-center">
                    {isChildFree ? (
                        <div 
                            className={`text-xs text-slate-500 font-sans tracking-wider mb-2 cursor-pointer select-none transition-colors ${
                                isPhotosensitivityDisabled ? 'safe-hover' : 'glitch-text'
                            }`}
                            onClick={handleSecretClick}
                        >
                            IT HURTS, IT HURTS, IT HURTS
                        </div>
                    ) : (
                        <div className="text-xs text-slate-500 font-sans tracking-wider mb-2">
                            THANKS FOR PLAYING | SEINARU MAGECRAFT GIRLS V1.0
                        </div>
                    )}
                    
                    <div className="text-[10px] text-slate-600 font-sans tracking-wider">
                        CYOA BY NXTUB, INTERACTIVE VERSION BY SAVIAPPLE
                    </div>
                </div>
            </footer>
        </>
    );
};
