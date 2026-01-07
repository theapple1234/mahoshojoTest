
import React, { useEffect } from 'react';
import { SCHOOLS_DATA, SCHOOLS_DATA_KO } from '../constants';
import { useCharacterContext } from '../context/CharacterContext';
import { renderFormattedText } from './ui';

interface SchoolDirectoryModalProps {
    onClose: () => void;
}

export const SchoolDirectoryModal: React.FC<SchoolDirectoryModalProps> = ({ onClose }) => {
    const { language } = useCharacterContext();
    const activeSchools = language === 'ko' ? SCHOOLS_DATA_KO : SCHOOLS_DATA;
    const schoolsList = Object.values(activeSchools);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    return (
        <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[101] flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div 
                className="bg-[#1f1612] border-2 border-yellow-700/80 rounded-xl shadow-lg w-full max-w-6xl max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex items-center justify-between p-4 border-b border-yellow-900/50 bg-[#150f0c]">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">🎓</span>
                        <h2 className="font-cinzel text-2xl text-amber-200 tracking-wider">
                            {language === 'ko' ? "마법학교 명부" : "Academy Directory"}
                        </h2>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="text-amber-200/70 hover:text-white text-3xl font-bold transition-colors leading-none"
                    >
                        &times;
                    </button>
                </header>

                <main className="p-6 overflow-y-auto flex-grow scrollbar-thin scrollbar-thumb-amber-900/50 scrollbar-track-[#150f0c]">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {schoolsList.map((school) => (
                            <div key={school.id} className="bg-black/30 border border-amber-900/40 rounded-lg overflow-hidden flex flex-col sm:flex-row shadow-lg">
                                <div className="sm:w-1/3 h-48 sm:h-auto relative">
                                    <img 
                                        src={school.imageSrc} 
                                        alt={school.title} 
                                        className="w-full h-full object-cover opacity-90"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/60 sm:bg-gradient-to-l sm:from-transparent sm:to-black/30"></div>
                                </div>
                                <div className="p-4 sm:w-2/3 flex flex-col">
                                    <h3 className="font-cinzel text-xl font-bold text-amber-100 mb-2 border-b border-amber-900/30 pb-1">
                                        {school.title}
                                    </h3>
                                    <div className="text-xs text-gray-300 leading-relaxed mb-4 flex-grow text-justify pr-2 custom-scrollbar overflow-y-auto max-h-[150px]">
                                        {renderFormattedText(school.description)}
                                    </div>
                                    <div className="bg-amber-900/20 border border-amber-900/30 p-2 rounded mt-auto">
                                        <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-0.5">
                                            {language === 'ko' ? "지역 특전" : "Dominion Perk"}
                                        </p>
                                        <p className="text-xs text-amber-200/90 italic">
                                            {renderFormattedText(school.costBlurb)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
                
                <footer className="p-4 border-t border-yellow-900/50 bg-[#150f0c] text-center">
                    <button 
                        onClick={onClose}
                        className="px-6 py-2 border border-amber-600 text-amber-200 hover:bg-amber-900/40 hover:text-white transition-colors rounded font-cinzel text-sm"
                    >
                        {language === 'ko' ? "닫기" : "Close"}
                    </button>
                </footer>
            </div>
        </div>
    );
};
