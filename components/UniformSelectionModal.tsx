
import React, { useEffect } from 'react';
import { UNIFORMS_DATA, UNIFORMS_DATA_KO } from '../constants';
import { useCharacterContext } from '../context/CharacterContext';

interface UniformSelectionModalProps {
    classmateName: string;
    currentUniformId: string | undefined;
    onClose: () => void;
    onSelect: (uniformId: string) => void;
    mode?: 'uniform' | 'costume';
    theme?: 'amber' | 'green';
}

const UNIFORM_SQUARE_IMAGES: Record<string, string> = {
    'idol': '/images/WvchRHJJ-uni1square.webp',
    'witchy': '/images/dJX4K5L4-uni2square.webp',
    'boyish': '/images/4ZXPyyZb-uni3square.webp',
    'high_tech': '/images/YB1tLH4f-uni4square.webp',
    'animal_themed': '/images/XxZ5Sspd-uni5square.webp',
    'old_timey': '/images/r2hDt27q-uni6square.webp',
    'oriental': '/images/3mdhV9G2-uni7square.webp',
    'custom': '/images/vC5G31jM-uni8square.webp',
};

export const UniformSelectionModal: React.FC<UniformSelectionModalProps> = ({
    classmateName,
    currentUniformId,
    onClose,
    onSelect,
    mode = 'uniform',
    theme = 'amber'
}) => {
    const { language } = useCharacterContext();
    const activeUniforms = language === 'ko' ? UNIFORMS_DATA_KO : UNIFORMS_DATA;

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    const titleText = mode === 'costume' 
        ? (language === 'ko' ? '의복' : 'Costume') 
        : (language === 'ko' ? '제복' : 'Uniform');
    
    const selectForText = language === 'ko' 
        ? `${classmateName}의 ${titleText} 선택` 
        : `Select ${titleText} for ${classmateName}`;

    const isGreen = theme === 'green';

    const themeClasses = {
        bg: isGreen ? 'bg-[#0a1510]' : 'bg-[#1f1612]',
        border: isGreen ? 'border-green-800/80' : 'border-yellow-800/80',
        headerBorder: isGreen ? 'border-green-900/50' : 'border-yellow-900/50',
        title: isGreen ? 'text-green-300' : 'text-amber-200',
        close: isGreen ? 'text-green-300/70 hover:text-white' : 'text-amber-200/70 hover:text-white',
        cardBorder: isGreen ? 'border-green-500 ring-green-500' : 'border-amber-400 ring-2 ring-amber-400',
        cardHover: isGreen ? 'border-gray-800 hover:border-green-500/70' : 'border-gray-800 hover:border-amber-300/70',
        cardTitle: isGreen ? 'text-green-100' : 'text-amber-100'
    };

    return (
        <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="uniform-modal-title"
        >
            <div
                className={`${themeClasses.bg} border-2 ${themeClasses.border} rounded-xl shadow-lg w-full max-w-4xl max-h-[80vh] flex flex-col`}
                onClick={(e) => e.stopPropagation()}
            >
                <header className={`flex items-center justify-between p-4 border-b ${themeClasses.headerBorder}`}>
                    <h2 id="uniform-modal-title" className={`font-cinzel text-2xl ${themeClasses.title}`}>
                        {selectForText}
                    </h2>
                    <button
                        onClick={onClose}
                        className={`${themeClasses.close} text-3xl font-bold transition-colors`}
                        aria-label="Close"
                    >
                        &times;
                    </button>
                </header>
                <main className="p-6 overflow-y-auto">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {activeUniforms.map((uniform) => {
                            const isSelected = uniform.id === currentUniformId;
                            const borderClass = isSelected
                                ? themeClasses.cardBorder
                                : themeClasses.cardHover;
                            
                            const imageSrc = UNIFORM_SQUARE_IMAGES[uniform.id] || uniform.imageSrc;

                            return (
                                <div
                                    key={uniform.id}
                                    onClick={() => onSelect(uniform.id)}
                                    className={`p-3 bg-black/30 border rounded-lg cursor-pointer transition-colors ${borderClass}`}
                                    role="button"
                                    tabIndex={0}
                                    aria-pressed={isSelected}
                                >
                                    <img
                                        src={imageSrc}
                                        alt={uniform.title}
                                        className="w-full object-cover rounded-md mb-3"
                                        style={{ aspectRatio: '1/1' }}
                                    />
                                    <h3 className={`font-cinzel text-center ${themeClasses.cardTitle}`}>{uniform.title}</h3>
                                </div>
                            );
                        })}
                    </div>
                </main>
            </div>
        </div>
    );
};
