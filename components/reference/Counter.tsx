
import React from 'react';

interface CounterProps {
    label: string;
    count: number;
    onCountChange: (newCount: number) => void;
    unit?: string;
    cost?: string;
    displayMultiplier?: number;
    max?: number;
    layout?: 'default' | 'small';
}

export const Counter: React.FC<CounterProps> = ({ label, count, onCountChange, unit = '', cost, displayMultiplier = 1, max = Infinity, layout = 'default' }) => (
    <div className={`w-full flex flex-col items-center ${layout === 'default' ? 'mt-3' : 'mt-1'}`} onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-end w-full px-1 mb-1.5">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{label}</span>
            {cost && <span className="text-[9px] text-cyan-400 font-mono bg-cyan-950/30 px-1.5 rounded border border-cyan-900/50">{cost}</span>}
        </div>
        
        <div className="flex items-stretch bg-black/60 rounded-md border border-gray-700 shadow-inner w-full h-8 overflow-hidden group/counter">
            <button 
                onClick={(e) => { e.stopPropagation(); onCountChange(count - 1); }} 
                disabled={count === 0} 
                className="w-8 flex-shrink-0 flex items-center justify-center bg-gray-800 hover:bg-red-900 text-gray-400 hover:text-red-100 transition-all disabled:opacity-30 disabled:hover:bg-gray-800 border-r border-gray-700 active:bg-red-800 focus:outline-none"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
            </button>
            
            <div className="flex-grow flex items-center justify-center bg-transparent relative">
                <span className="font-cinzel font-bold text-white text-sm relative z-10 drop-shadow-md">{count * displayMultiplier} {unit}</span>
                <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent opacity-0 group-hover/counter:opacity-100 transition-opacity pointer-events-none"></div>
            </div>
            
            <button 
                onClick={(e) => { e.stopPropagation(); onCountChange(count + 1); }} 
                disabled={count >= max} 
                className="w-8 flex-shrink-0 flex items-center justify-center bg-gray-800 hover:bg-green-900 text-gray-400 hover:text-green-100 transition-all disabled:opacity-30 disabled:hover:bg-gray-800 border-l border-gray-700 active:bg-green-800 focus:outline-none"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
            </button>
        </div>
    </div>
);
