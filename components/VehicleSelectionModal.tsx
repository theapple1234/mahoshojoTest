
import React, { useState, useEffect } from 'react';
import { VEHICLE_CATEGORIES, VEHICLE_PERKS } from '../constants';
import type { AllBuilds, VehicleSelections } from '../types';
import { useCharacterContext } from '../context/CharacterContext';

const STORAGE_KEY = 'seinaru_magecraft_builds';

const calculateVehiclePoints = (selections: VehicleSelections): number => {
    let total = 0;
    // Iterate over all selected categories for cost
    if (selections.category) {
        selections.category.forEach(catId => {
            total += VEHICLE_CATEGORIES.find(c => c.id === catId)?.cost ?? 0;
        });
    }
    selections.perks.forEach((count, perkId) => {
        const perk = VEHICLE_PERKS.find(p => p.id === perkId);
        if (perk) {
            let cost = perk.cost ?? 0;
            if (perkId === 'chatterbox_vehicle' && selections.category.includes('car')) cost = 0;
            if (perkId === 'hellfire_volley' && (selections.category.includes('tank') || selections.category.includes('mecha'))) cost = 0;
            total += cost * count;
        }
    });
    return total;
};

const hydrateVehicleData = (data: any): VehicleSelections => {
    if (data) {
        return { 
            ...data,
            category: Array.isArray(data.category) ? data.category : (data.category ? [data.category] : []),
            perks: data.perks instanceof Map ? data.perks : new Map(Array.isArray(data.perks) ? data.perks : []) 
        };
    }
    return data;
};

interface VehicleSelectionModalProps {
    currentVehicleName: string | null;
    onClose: () => void;
    onSelect: (vehicleName: string | null) => void;
    pointLimit?: number;
    title?: string;
    colorTheme?: 'cyan' | 'purple' | 'green';
}

export const VehicleSelectionModal: React.FC<VehicleSelectionModalProps> = ({
    currentVehicleName,
    onClose,
    onSelect,
    pointLimit = 30,
    title = 'Assign Signature Vehicle',
    colorTheme = 'cyan'
}) => {
    const { language } = useCharacterContext();
    const [vehicleBuilds, setVehicleBuilds] = useState<Record<string, { points: number }>>({});

    useEffect(() => {
        const savedBuildsJSON = localStorage.getItem(STORAGE_KEY);
        if (savedBuildsJSON) {
            try {
                const parsedBuilds: AllBuilds = JSON.parse(savedBuildsJSON);
                const vehicles = parsedBuilds.vehicles || {};
                const buildsWithPoints: Record<string, { points: number }> = {};
                
                for (const name in vehicles) {
                    const build = vehicles[name];
                    if (build.version === 1) {
                        const hydratedData = hydrateVehicleData(build.data);
                        const points = calculateVehiclePoints(hydratedData);
                        buildsWithPoints[name] = { points };
                    }
                }
                setVehicleBuilds(buildsWithPoints);
            } catch (error) {
                console.error("Failed to parse vehicle builds from storage:", error);
            }
        }
    }, []);

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

    const themeClasses = {
        cyan: {
            border: 'border-cyan-700/80',
            headerBorder: 'border-cyan-900/50',
            titleText: 'text-cyan-200',
            closeBtn: 'text-cyan-200/70 hover:text-white',
            infoText: 'text-cyan-300/80',
            selectedItem: 'border-cyan-400 ring-2 ring-cyan-400/50',
            hoverItem: 'hover:border-cyan-400/50',
            footerBorder: 'border-cyan-900/50'
        },
        purple: { // Fallback for consistency if needed
            border: 'border-purple-700/80',
            headerBorder: 'border-purple-900/50',
            titleText: 'text-purple-200',
            closeBtn: 'text-purple-200/70 hover:text-white',
            infoText: 'text-purple-300/80',
            selectedItem: 'border-purple-400 ring-2 ring-purple-400/50',
            hoverItem: 'hover:border-purple-400/50',
            footerBorder: 'border-purple-900/50'
        },
        green: { // Fallback
            border: 'border-green-700/80',
            headerBorder: 'border-green-900/50',
            titleText: 'text-green-200',
            closeBtn: 'text-green-200/70 hover:text-white',
            infoText: 'text-green-300/80',
            selectedItem: 'border-green-400 ring-2 ring-green-400/50',
            hoverItem: 'hover:border-green-400/50',
            footerBorder: 'border-green-900/50'
        }
    };

    const currentTheme = themeClasses[colorTheme] || themeClasses.cyan;
    
    const msgSelect = language === 'ko' 
        ? `${pointLimit} 탈것 점수 이하인 탈것 빌드를 선택하세요.`
        : `Select a vehicle build that costs ${pointLimit} Vehicle Points or less.`;
    
    const msgNoBuilds = language === 'ko'
        ? "탈것 빌드가 없습니다. 참고 페이지에서 만들어 보세요!"
        : "No vehicle builds found. Go to the Reference Page to create one!";

    return (
        <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[101] flex items-center justify-center p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="vehicle-modal-title"
        >
            <div
                className={`bg-[#0a101f] border-2 ${currentTheme.border} rounded-xl shadow-lg w-full max-w-2xl max-h-[80vh] flex flex-col`}
                onClick={(e) => e.stopPropagation()}
            >
                <header className={`flex items-center justify-between p-4 border-b ${currentTheme.headerBorder}`}>
                    <h2 id="vehicle-modal-title" className={`font-cinzel text-2xl ${currentTheme.titleText}`}>
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className={`${currentTheme.closeBtn} text-3xl font-bold transition-colors`}
                        aria-label="Close"
                    >
                        &times;
                    </button>
                </header>
                <main className="p-6 overflow-y-auto">
                     <p className={`text-center text-sm ${currentTheme.infoText} mb-4 italic`}>
                        {msgSelect}
                    </p>
                    <div className="space-y-3">
                        {Object.keys(vehicleBuilds).length > 0 ? (
                            Object.keys(vehicleBuilds).map((name) => {
                                const { points } = vehicleBuilds[name];
                                const isSelected = name === currentVehicleName;
                                const isDisabled = points > pointLimit;
                                const costColor = isDisabled ? 'text-red-500' : 'text-green-400';
                                
                                return (
                                    <div
                                        key={name}
                                        onClick={() => !isDisabled && onSelect(name)}
                                        className={`p-3 bg-slate-900/70 border rounded-md flex justify-between items-center transition-colors ${
                                            isDisabled 
                                                ? 'border-gray-700 opacity-60 cursor-not-allowed'
                                                : isSelected
                                                    ? `${currentTheme.selectedItem} cursor-pointer`
                                                    : `border-gray-800 ${currentTheme.hoverItem} cursor-pointer`
                                        }`}
                                        role="button"
                                        aria-disabled={isDisabled}
                                        aria-pressed={isSelected}
                                    >
                                        <div>
                                            <h3 className="font-semibold text-white">{name}</h3>
                                            <p className="text-xs text-gray-400">
                                                {isDisabled 
                                                    ? (language === 'ko' ? `비용이 ${pointLimit}점을 초과합니다` : `Cost exceeds ${pointLimit} points`) 
                                                    : (language === 'ko' ? '클릭하여 할당' : 'Click to assign this vehicle')}
                                            </p>
                                        </div>
                                        <span className={`font-bold text-lg ${costColor}`}>
                                            {points} VP
                                        </span>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-center text-gray-500 italic py-8">
                                {msgNoBuilds}
                            </p>
                        )}
                    </div>
                </main>
                 <footer className={`p-3 border-t ${currentTheme.footerBorder} text-center`}>
                    <button
                        onClick={() => onSelect(null)}
                        className="px-4 py-2 text-sm font-cinzel bg-gray-800/50 border border-gray-700 rounded-md hover:bg-gray-700 transition-colors"
                    >
                        {language === 'ko' ? "할당 해제" : "Clear Assignment"}
                    </button>
                </footer>
            </div>
        </div>
    );
};
