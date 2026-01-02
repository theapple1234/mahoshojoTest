
import React from 'react';

interface PointCardProps {
  title: string;
  amount: number;
  pointName: string;
  description: string;
  color: 'purple' | 'green';
  backgroundImage?: string;
}

export const PointCard: React.FC<PointCardProps> = ({ title, amount, pointName, description, color, backgroundImage }) => {
  const colorClasses = {
    purple: {
      border: 'border-purple-500/50',
      text: 'text-purple-300',
      shadow: 'shadow-purple-900/30',
      glow: 'shadow-[0_0_20px_rgba(168,85,247,0.3)]',
    },
    green: {
      border: 'border-green-500/50',
      text: 'text-green-300',
      shadow: 'shadow-green-900/30',
      glow: 'shadow-[0_0_20px_rgba(34,197,94,0.3)]',
    }
  };

  const currentTheme = colorClasses[color];

  return (
    <div className={`relative w-full md:w-80 aspect-square rounded-xl overflow-hidden border-2 ${currentTheme.border} ${currentTheme.shadow} ${currentTheme.glow}`}>
      {/* Background Image */}
      {backgroundImage ? (
        <>
            <div className="absolute inset-0 bg-black z-0"></div>
            <img 
                src={backgroundImage} 
                alt={pointName} 
                className="absolute inset-0 w-full h-full object-cover opacity-60" 
            />
             <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black opacity-80 z-0`}></div>
        </>
      ) : (
          <div className={`absolute inset-0 bg-black/40`}></div>
      )}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full p-6 text-center">
        <p className="text-gray-300 font-cinzel text-xs tracking-[0.2em] uppercase mb-4 drop-shadow-md opacity-80">{title}</p>
        
        <div className="relative mb-2">
             <h3 className={`text-7xl font-bold ${currentTheme.text} drop-shadow-[0_0_15px_rgba(0,0,0,0.8)] relative z-10`}>{amount}</h3>
             <div className={`absolute inset-0 blur-xl opacity-30 ${color === 'purple' ? 'bg-purple-500' : 'bg-green-500'} -z-10`}></div>
        </div>
        
        <p className={`font-cinzel font-bold tracking-[0.2em] ${currentTheme.text} text-lg mb-6 drop-shadow-md`}>{pointName}</p>
        
        <div className={`w-12 h-0.5 ${color === 'purple' ? 'bg-purple-400' : 'bg-green-400'} mb-6 shadow-[0_0_8px_currentColor]`}></div>
        
        <p className="text-xs text-gray-200 font-medium leading-relaxed max-w-[90%] drop-shadow-md opacity-90">{description}</p>
      </div>
    </div>
  );
};
