
import React, { useEffect } from 'react';
import { COLLEAGUES_DATA, COLLEAGUES_DATA_KO, CUSTOM_COLLEAGUE_CHOICES_DATA, CUSTOM_COLLEAGUE_CHOICES_DATA_KO } from '../constants';
import type { CustomColleagueInstance, Mentor } from '../types';
import { useCharacterContext } from '../context/CharacterContext';

interface MentorSelectionModalProps {
    onClose: () => void;
    onSelect: (mentor: Mentor) => void;
    onRemove: (mentorId: string) => void;
    selectedMentors: Mentor[];
    customColleagues: CustomColleagueInstance[];
}

export const MentorSelectionModal: React.FC<MentorSelectionModalProps> = ({
    onClose,
    onSelect,
    onRemove,
    selectedMentors,
    customColleagues
}) => {
    const { language } = useCharacterContext();
    const activeColleagues = language === 'ko' ? COLLEAGUES_DATA_KO : COLLEAGUES_DATA;
    const activeCustomChoices = language === 'ko' ? CUSTOM_COLLEAGUE_CHOICES_DATA_KO : CUSTOM_COLLEAGUE_CHOICES_DATA;

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    const isMentorSelected = (id: string) => selectedMentors.some(m => m.id === id);
    const limitReached = selectedMentors.length >= 3;

    const parseCost = (costStr: string) => {
        if (language === 'ko') {
            const match = costStr.match(/(\d+)/);
            return match ? Math.abs(parseInt(match[1], 10)) : 0;
        }
        const match = costStr.match(/(\d+)\s*FP/i);
        return match ? parseInt(match[1], 10) : 0;
    };

    const handleToggle = (id: string, type: 'premade' | 'custom', name: string, cost: number) => {
        if (isMentorSelected(id)) {
            onRemove(id);
        } else {
            if (!limitReached) {
                onSelect({ id, type, name, cost });
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[101] flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-[#100c14] border-2 border-brown-700/80 rounded-xl shadow-lg w-full max-w-4xl max-h-[85vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                <header className="flex items-center justify-between p-4 border-b border-gray-700">
                    <h2 className="font-cinzel text-2xl text-amber-200">
                        {language === 'ko' ? `멘토 선택 (${selectedMentors.length}/3)` : `Select Mentors (${selectedMentors.length}/3)`}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl">&times;</button>
                </header>
                <main className="p-6 overflow-y-auto space-y-8">
                    {/* Custom Colleagues Section */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-4 border-b border-gray-700 pb-2">
                            {language === 'ko' ? "커스텀 동료" : "Your Custom Colleagues"}
                        </h3>
                        {customColleagues.length === 0 ? (
                            <p className="text-gray-500 italic text-sm">
                                {language === 'ko' 
                                    ? "생성된 커스텀 동료가 없습니다. 5페이지에서 생성하세요." 
                                    : "No custom colleagues created yet. Go to Page 5 to create one."}
                            </p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {customColleagues.map(cc => {
                                    const option = activeCustomChoices.find(o => o.id === cc.optionId);
                                    const cost = parseCost(option?.cost || '');
                                    const name = cc.companionName || (language === 'ko' ? '이름 없음' : 'Unnamed Custom');
                                    const isSelected = isMentorSelected(cc.id.toString());
                                    
                                    return (
                                        <div 
                                            key={cc.id}
                                            onClick={() => handleToggle(cc.id.toString(), 'custom', name, cost)}
                                            className={`p-3 rounded-lg border cursor-pointer transition-all ${isSelected ? 'bg-amber-900/40 border-amber-400 ring-1 ring-amber-400' : 'bg-gray-900/50 border-gray-700 hover:border-amber-500/50'} ${!isSelected && limitReached ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-bold text-white truncate">{name}</h4>
                                                {isSelected && <span className="text-green-400 text-xs">{language === 'ko' ? '선택됨' : 'SELECTED'}</span>}
                                            </div>
                                            <p className="text-xs text-gray-400 mt-1">{option?.description}</p>
                                            <p className="text-xs font-bold mt-1">
                                                <span className="text-green-400">-{cost * 2} FP</span>
                                                <span className="text-white mx-1">,</span>
                                                <span className="text-purple-400">+{cost} BP</span>
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Premade Colleagues Section */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-4 border-b border-gray-700 pb-2">
                            {language === 'ko' ? "기존 동료" : "Existing Colleagues"}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {activeColleagues.map(colleague => {
                                const cost = parseCost(colleague.cost);
                                const isSelected = isMentorSelected(colleague.id);

                                return (
                                    <div 
                                        key={colleague.id}
                                        onClick={() => handleToggle(colleague.id, 'premade', colleague.name, cost)}
                                        className={`p-2 rounded-lg border cursor-pointer transition-all flex flex-col items-center text-center ${isSelected ? 'bg-amber-900/40 border-amber-400 ring-1 ring-amber-400' : 'bg-gray-900/50 border-gray-700 hover:border-amber-500/50'} ${!isSelected && limitReached ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <img src={colleague.imageSrc} alt={colleague.name} className="w-16 h-16 rounded-full object-cover mb-2" />
                                        <h4 className="font-bold text-white text-sm">{colleague.name}</h4>
                                        <p className="text-xs font-bold mt-1">
                                            <span className="text-green-400">-{cost * 2} FP</span>
                                            <span className="text-white mx-1">,</span>
                                            <span className="text-purple-400">+{cost} BP</span>
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </main>
                <footer className="p-4 border-t border-gray-700 bg-black/20 text-center text-xs text-gray-400">
                    {language === 'ko' 
                        ? "멘토를 선택하면 기본 행운 점수 비용이 두 배가 되지만, 기본 비용만큼의 축복 점수를 얻습니다."
                        : "Selecting a mentor costs double their base Fortune Points, but grants Blessing Points equal to their base cost."}
                </footer>
            </div>
        </div>
    );
};
