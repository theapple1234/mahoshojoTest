
import React, { useEffect } from 'react';

interface ImmunitySelectionModalProps {
    onClose: () => void;
    onSelect: (immunity: string) => void;
    currentSelection: string | null;
}

const IMMUNITY_GROUPS = [
    {
        blessing: 'Compelling Will',
        options: [
            { id: 'telekinetics', label: 'Telekinetics' },
            { id: 'metathermics', label: 'Metathermics' },
        ]
    },
    {
        blessing: 'Worldly Wisdom',
        options: [
            { id: 'eleanors_techniques', label: "Eleanor's Techniques" },
            { id: 'genevieves_techniques', label: "Genevieve's Techniques" },
        ]
    },
    {
        blessing: 'Bitter Dissatisfaction',
        options: [
            { id: 'brewing', label: 'Brewing' },
            { id: 'soul_alchemy', label: 'Soul Alchemy' },
            { id: 'transformation', label: 'Transformation' },
        ]
    },
    {
        blessing: 'Lost Hope',
        options: [
            { id: 'channelling', label: 'Channelling' },
            { id: 'necromancy', label: 'Necromancy' },
            { id: 'black_magic', label: 'Black Magic' },
        ]
    },
    {
        blessing: 'Fallen Peace',
        options: [
            { id: 'telepathy', label: 'Telepathy' },
            { id: 'mental_manipulation', label: 'Mental Manipulation' },
        ]
    },
    {
        blessing: 'Gracious Defeat',
        options: [
            { id: 'features', label: 'Features' },
            { id: 'influence', label: 'Influence' },
        ]
    },
    {
        blessing: 'Closed Circuits',
        options: [
            { id: 'technomancy', label: 'Technomancy' },
            { id: 'nanite_control', label: 'Nanite Control' },
        ]
    },
    {
        blessing: 'Righteous Creation',
        options: [
            { id: 'magitech', label: 'Magitech' },
            { id: 'arcane_constructs', label: 'Arcane Constructs' },
            { id: 'metamagic', label: 'Metamagic' },
        ]
    },
];

export const ImmunitySelectionModal: React.FC<ImmunitySelectionModalProps> = ({ onClose, onSelect, currentSelection }) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[101] flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-[#100c14] border-2 border-purple-700/80 rounded-xl shadow-lg w-full max-w-4xl max-h-[85vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                <header className="flex items-center justify-between p-4 border-b border-purple-900/50">
                    <h2 className="font-cinzel text-2xl text-purple-200">Select Immunity</h2>
                    <button onClick={onClose} className="text-purple-400 hover:text-white text-3xl font-bold transition-colors">&times;</button>
                </header>
                <main className="p-6 overflow-y-auto space-y-6 custom-scrollbar">
                     <p className="text-gray-400 text-sm italic text-center mb-6">
                        Choose one category of magic to be completely immune to.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {IMMUNITY_GROUPS.map((group) => (
                            <div key={group.blessing} className="bg-white/5 border border-white/10 rounded-lg p-4">
                                <h3 className="text-purple-300 font-cinzel text-xs font-bold mb-3 uppercase tracking-wider border-b border-white/10 pb-2">
                                    {group.blessing}
                                </h3>
                                <div className="space-y-2">
                                    {group.options.map(opt => {
                                        const isSelected = currentSelection === opt.id;
                                        return (
                                            <button
                                                key={opt.id}
                                                onClick={() => onSelect(opt.id)}
                                                className={`w-full text-left px-3 py-2 rounded text-xs transition-all border font-medium ${
                                                    isSelected 
                                                    ? 'bg-purple-600 border-purple-400 text-white shadow-[0_0_10px_rgba(168,85,247,0.5)]' 
                                                    : 'bg-black/40 border-gray-700 text-gray-300 hover:border-purple-500/50 hover:text-purple-200 hover:bg-white/5'
                                                }`}
                                            >
                                                {opt.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
};
