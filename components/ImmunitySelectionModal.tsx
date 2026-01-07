
import React, { useEffect } from 'react';
import { useCharacterContext } from '../context/CharacterContext';

interface ImmunitySelectionModalProps {
    onClose: () => void;
    onSelect: (immunity: string) => void;
    currentSelection: string | null;
}

const IMMUNITY_GROUPS_EN = [
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

const IMMUNITY_GROUPS_KO = [
    {
        blessing: '강렬한 의지',
        options: [
            { id: 'telekinetics', label: '염력' },
            { id: 'metathermics', label: '메타열역학' },
        ]
    },
    {
        blessing: '경험과 지혜',
        options: [
            { id: 'eleanors_techniques', label: "엘레노어의 기술" },
            { id: 'genevieves_techniques', label: "제네비브의 기술" },
        ]
    },
    {
        blessing: '씁쓸한 불만족',
        options: [
            { id: 'brewing', label: '양조' },
            { id: 'soul_alchemy', label: '영혼 연금술' },
            { id: 'transformation', label: '변신술' },
        ]
    },
    {
        blessing: '잃어버린 희망',
        options: [
            { id: 'channelling', label: '혼령술' },
            { id: 'necromancy', label: '강령술' },
            { id: 'black_magic', label: '흑마법' },
        ]
    },
    {
        blessing: '무너진 평화',
        options: [
            { id: 'telepathy', label: '텔레파시' },
            { id: 'mental_manipulation', label: '정신 조작' },
        ]
    },
    {
        blessing: '품위있는 패배',
        options: [
            { id: 'features', label: '특성' },
            { id: 'influence', label: '영향' },
        ]
    },
    {
        blessing: '폐쇄회로',
        options: [
            { id: 'technomancy', label: '기계마법' },
            { id: 'nanite_control', label: '나나이트 조종' },
        ]
    },
    {
        blessing: '정당한 창조',
        options: [
            { id: 'magitech', label: '마법공학' },
            { id: 'arcane_constructs', label: '비전 구조체' },
            { id: 'metamagic', label: '메타마법' },
        ]
    },
];

export const ImmunitySelectionModal: React.FC<ImmunitySelectionModalProps> = ({ onClose, onSelect, currentSelection }) => {
    const { language } = useCharacterContext();
    const activeGroups = language === 'ko' ? IMMUNITY_GROUPS_KO : IMMUNITY_GROUPS_EN;

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
                    <h2 className="font-cinzel text-2xl text-purple-200">
                        {language === 'ko' ? "면역 선택" : "Select Immunity"}
                    </h2>
                    <button onClick={onClose} className="text-purple-400 hover:text-white text-3xl font-bold transition-colors">&times;</button>
                </header>
                <main className="p-6 overflow-y-auto space-y-6 custom-scrollbar">
                     <p className="text-gray-400 text-sm italic text-center mb-6">
                        {language === 'ko' ? "완전한 면역을 얻을 마법 카테고리를 하나 선택하세요." : "Choose one category of magic to be completely immune to."}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {activeGroups.map((group) => (
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
