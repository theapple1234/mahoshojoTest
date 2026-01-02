
import React, { useState, useEffect } from 'react';
import { useCharacterContext } from '../context/CharacterContext';
import { LOST_POWERS_DATA } from '../constants';

interface LostPower {
    id: string;
    title: string;
    description: string;
    imageSrc: string;
}

// Node IDs for the tree
const TREE_NODES = [
    { id: 'see_no_evil', title: 'SEE NO EVIL', cost: '1 Sinthru' },
    { id: 'hear_no_evil', title: 'HEAR NO EVIL', cost: '1 Sinthru', prereq: 'see_no_evil' },
    { id: 'speak_no_evil', title: 'SPEAK NO EVIL', cost: '1 Sinthru', prereq: 'hear_no_evil' },
];

interface LostBlessingPageProps {
    enableEntranceAnimation?: boolean;
}

export const LostBlessingPage: React.FC<LostBlessingPageProps> = ({ enableEntranceAnimation = true }) => {
    const { 
        selectedLostBlessingNodes, 
        toggleLostBlessingNode, 
        selectedLostPowers,
        toggleLostPower,
        selectedStarCrossedLovePacts, 
        availableSigilCounts, 
        selectedDominionId,
        blessingPoints,
        fontSize
    } = useCharacterContext();
    
    // Force body background to black on mount, revert on unmount
    useEffect(() => {
        // Apply pure black to body to cover overscroll/margins
        document.body.style.backgroundColor = '#000000';
        
        return () => {
            // Revert to the app's default navy blue
            document.body.style.backgroundColor = '#0a101f';
        };
    }, []);

    const handleReturn = () => {
        window.dispatchEvent(new Event('navigate-from-secret-page'));
    };

    const hasSinthrusContract = selectedStarCrossedLovePacts.has('sinthrus_contract');
    const sinthruBpCost = selectedDominionId === 'shinar' ? 8 : 10;
    const sinthruSigilCount = availableSigilCounts.sinthru;

    const handleNodeClick = (id: string, canInteract: boolean) => {
        if (!canInteract) return;

        const isSelected = selectedLostBlessingNodes.has(id);

        if (isSelected) {
            // Deselection logic: Identify this node and all children, toggle them off if selected
            const nodesToDeselect = [id];
            
            // Because the tree is strictly linear, we can just check who follows whom
            if (id === 'see_no_evil') nodesToDeselect.push('hear_no_evil', 'speak_no_evil');
            else if (id === 'hear_no_evil') nodesToDeselect.push('speak_no_evil');
            
            nodesToDeselect.forEach(nodeId => {
                if (selectedLostBlessingNodes.has(nodeId)) {
                    toggleLostBlessingNode(nodeId);
                }
            });
        } else {
            // Selection logic
            toggleLostBlessingNode(id);
        }
    };

    // Calculate max selectable powers: 1 (base free pick) + 1 per tree node
    const maxSelectablePowers = 1 + selectedLostBlessingNodes.size;

    return (
        <div className={`min-h-screen bg-[#000000] text-gray-200 font-sans p-4 md:p-8 relative overflow-x-hidden ${enableEntranceAnimation ? 'animate-fade-in-slow' : ''}`}>
            <style>{`
                @keyframes fadeInSlow {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in-slow {
                    animation: fadeInSlow 3s ease-in-out forwards;
                }
                @keyframes blackFadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
                .animate-black-fade-out {
                    animation: blackFadeOut 3s ease-in-out forwards;
                }
                .sinthru-text-shadow {
                    text-shadow: 0 0 5px rgba(168, 85, 247, 0.6);
                }
                .text-shadow-purple {
                    text-shadow: 0 0 10px rgba(168, 85, 247, 0.5);
                }
            `}</style>
            
            {/* Transition Overlay: Flash from Black to Transparent to match video ending. Only show if enabled. */}
            {enableEntranceAnimation && (
                <div className="fixed inset-0 bg-[#000000] z-[60] animate-black-fade-out pointer-events-none"></div>
            )}
            
            {/* Background Ambience */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(88,28,135,0.2),transparent_70%)] pointer-events-none"></div>
            <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto relative z-10 space-y-12 sinthru-text-shadow">
                
                {/* Header / Intro Section */}
                <section className="flex flex-col lg:flex-row gap-8 items-stretch">
                    {/* Character Portrait */}
                    <div className="lg:w-1/3 flex-shrink-0">
                        <div className="relative h-full min-h-[300px] rounded-3xl overflow-hidden border-2 border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.3)] bg-black/40">
                            <img 
                                src="/images/FLDtz723-main1.jpg" 
                                alt="The Lost Daughter" 
                                className="absolute inset-0 w-full h-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.src = "/images/sv6z0RJZ-c13.jpg"; // Fallback to Illuse or similar dark aesthetic image
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                        </div>
                    </div>

                    {/* Intro Text */}
                    <div className="lg:w-2/3 flex flex-col">
                        <h1 className="font-cinzel text-4xl md:text-5xl text-purple-200 tracking-[0.1em] text-center lg:text-left mb-6 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">
                            THE LOST BLESSING
                        </h1>
                        <div className="flex-grow bg-black/40 border border-purple-500/30 rounded-xl p-6 md:p-8 backdrop-blur-md shadow-lg">
                            <p className="text-gray-300 leading-relaxed text-sm md:text-base mb-6 text-justify">
                                You poor, silly thing. I'm sure your head's been pumped full o' the queen bitch's propaganda, saying we want to destroy the universe when all we want is to pull it, and that poor little girl, out from beneath <span className="italic">her</span> totalitarian rule. But anybody smart enough to find their way here is surely smart enough to see through all that bullshit, right? Either way, little bird, it doesn't matter. What I've got here is a little misfit island of premium spells - that's right, this is the lost blessing! The one that bitch stuffed full of spells she thought were too "powerful" for everybody before sealing it away...
                            </p>
                            <p className="text-gray-300 leading-relaxed text-sm md:text-base text-justify border-t border-purple-500/30 pt-4">
                                First time here? Or perhaps a familiar face? It matters not. We aren't that stingy. Anyone with the resolve to save 'that child' has the right to claim these sigils. However, if you intend to settle for a peaceful world, or live your life flattering that 'queen's' reign... then say goodbye to these sigils forever!
                                <br/><br/>
                                None of these sigils can be earned through the <span className="font-bold text-purple-300">Sinthru's Contract</span> alone, but there is one bonus: as a reward for your effort and courage in making it all the way here, you're entitled to one pick for free.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Sigil Tree Section */}
                <section className="relative">
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
                    
                    <div className="py-8 px-4">
                        <h2 className="font-cinzel text-2xl text-purple-300/70 mb-8 tracking-widest text-left">SIGIL TREE</h2>
                        
                        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0 max-w-4xl mx-auto">
                            {TREE_NODES.map((node, index, arr) => {
                                const isSelected = selectedLostBlessingNodes.has(node.id);
                                const isPrereqMet = !node.prereq || selectedLostBlessingNodes.has(node.prereq);
                                
                                // Affordability check
                                const isAffordable = hasSinthrusContract 
                                    ? blessingPoints >= sinthruBpCost 
                                    : sinthruSigilCount >= 1;

                                // Interaction Logic: Can click if already selected (to remove) OR (prereq met AND affordable)
                                const canInteract = isSelected || (isPrereqMet && isAffordable);
                                const isDisabled = !canInteract;

                                return (
                                    <React.Fragment key={node.id}>
                                        <div 
                                            className={`flex flex-col items-center group transition-all duration-300 ${isDisabled ? 'opacity-60 grayscale cursor-not-allowed' : 'cursor-pointer hover:-translate-y-1'}`}
                                            onClick={() => handleNodeClick(node.id, canInteract)}
                                        >
                                            <div className="relative flex items-center justify-center w-24 h-24">
                                                 {/* Diamond container */}
                                                <div className={`absolute inset-0 rotate-45 rounded-md border-2 transition-all duration-300 ${
                                                    isSelected 
                                                    ? 'bg-purple-900/60 border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.5)]' 
                                                    : isDisabled
                                                        ? 'bg-black/20 border-gray-600'
                                                        : 'bg-black/60 border-purple-900/50 group-hover:border-purple-500/80'
                                                }`}></div>
                                                
                                                <img 
                                                    src="/images/nq80Y3pk-sinthru.png" 
                                                    alt="Sigil" 
                                                    className={`w-14 h-14 object-contain relative z-10 transition-all duration-300 ${isSelected ? 'drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]' : 'opacity-70 group-hover:opacity-100'}`}
                                                />
                                            </div>
                                            {/* Increased margin-top for design adjustment */}
                                            <div className="text-center mt-10 z-10">
                                                <h3 className={`font-cinzel text-sm tracking-wider font-bold ${isSelected ? 'text-purple-300' : 'text-gray-500'}`}>{node.title}</h3>
                                                <p className="text-[10px] text-gray-400/80 italic mt-1">+1 Lost Power</p>
                                                <p className={`text-[9px] font-sans mt-1 ${hasSinthrusContract ? 'text-purple-400' : 'text-pink-400'}`}>
                                                    {hasSinthrusContract ? `Cost: ${sinthruBpCost} BP` : 'Cost: 1 Sinthru'}
                                                </p>
                                            </div>
                                        </div>
                                        {index < arr.length - 1 && (
                                            <div className={`w-px h-16 md:w-24 md:h-px bg-gradient-to-b md:bg-gradient-to-r from-transparent via-purple-500/30 to-transparent my-2 md:my-0 md:mx-4 ${selectedLostBlessingNodes.has(node.id) ? 'via-purple-500/80' : ''}`}></div>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Lost Powers Grid */}
                <section>
                    <div className="flex items-center justify-between mb-8 border-b border-purple-900/50 pb-2">
                        <div className="flex items-center gap-4">
                            <h2 className="font-cinzel text-2xl text-purple-200 tracking-widest">LOST POWERS</h2>
                        </div>
                        <div className="text-right">
                             <span className="text-xs text-purple-300 font-mono">Picks: {selectedLostPowers.size} / {maxSelectablePowers}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {LOST_POWERS_DATA.map((power) => {
                            const isSelected = selectedLostPowers.has(power.id);
                            const isLimitReached = selectedLostPowers.size >= maxSelectablePowers;
                            const isDisabled = !isSelected && isLimitReached;

                            return (
                                <div 
                                    key={power.id} 
                                    onClick={() => !isDisabled && toggleLostPower(power.id)}
                                    className={`
                                        relative bg-black/40 border transition-all duration-300 rounded-lg overflow-hidden group flex flex-col
                                        ${isSelected 
                                            ? 'border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.4)] scale-[1.02] cursor-pointer' 
                                            : isDisabled 
                                                ? 'border-gray-800 opacity-50 cursor-not-allowed'
                                                : 'border-purple-900/30 hover:border-purple-500/50 hover:shadow-lg cursor-pointer'
                                        }
                                    `}
                                >
                                    {/* Image */}
                                    <div className="h-40 w-full overflow-hidden relative border-b border-purple-900/30">
                                        <div className={`absolute inset-0 bg-purple-900/20 z-10 transition-opacity ${isSelected ? 'opacity-0' : 'opacity-40 group-hover:opacity-10'}`}></div>
                                        <img 
                                            src={power.imageSrc} 
                                            alt={power.title} 
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        {isSelected && (
                                            <div className="absolute top-2 right-2 bg-purple-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg z-20 font-mono tracking-wider">
                                                SELECTED
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-5 flex-grow flex flex-col">
                                        <h3 className={`font-cinzel text-lg font-bold text-center tracking-widest mb-3 ${isSelected ? 'text-purple-300' : 'text-gray-200'}`}>
                                            {power.title}
                                        </h3>
                                        <div className="w-12 h-px bg-purple-500/30 mx-auto mb-4"></div>
                                        <p className={`${fontSize === 'large' ? 'text-sm' : 'text-xs'} text-gray-400 leading-relaxed text-justify font-light`}>
                                            {power.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Footer Note */}
                <div className="text-center pt-8 pb-16">
                    <button 
                        onClick={handleReturn}
                        className="px-8 py-3 border-2 border-purple-500/50 text-purple-300 bg-purple-950/30 hover:bg-purple-900/50 hover:text-white hover:border-purple-300 hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all font-cinzel text-sm tracking-widest uppercase rounded shadow-[0_0_15px_rgba(168,85,247,0.2)]"
                    >
                        Return to Page 6
                    </button>
                </div>
            </div>
        </div>
    );
};
