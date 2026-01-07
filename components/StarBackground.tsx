
import React, { useMemo } from 'react';

export const StarBackground: React.FC = () => {
  // Generate random stars for the background
  // Memoized to prevent re-generation on re-renders
  const stars = useMemo(() => {
    return Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: `${Math.random() * 2 + 1}px`,
      duration: `${Math.random() * 5 + 3}s`,
      delay: `${Math.random() * 2}s`,
      opacity: Math.random() * 0.7 + 0.3
    }));
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Dynamic Gradient Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0f172a] via-[#050810] to-black opacity-100"></div>
      
      {/* Stars Animation */}
      <div className="stars-container">
        {stars.map((star) => (
          <div 
            key={star.id} 
            className="star" 
            style={{
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              '--duration': star.duration,
              '--delay': star.delay,
              '--opacity': star.opacity
            } as React.CSSProperties}
          />
        ))}
      </div>
      
      {/* Overlay to darken slightly for readability when content is on top */}
      <div className="absolute inset-0 bg-black/20"></div>
    </div>
  );
};
