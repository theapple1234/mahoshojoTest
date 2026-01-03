
import React, { useState, useEffect, useRef } from 'react';
import { useCharacterContext } from '../context/CharacterContext';

interface SecretTransitionProps {
    onComplete: () => void;
}

// Internal component for Typewriter effect
const TypewriterText: React.FC<{ 
    text: string; 
    className?: string; 
    speed?: number; 
    nervous?: boolean;
    html?: boolean; // For the Error line that uses spans/styles inside
}> = ({ text, className, speed = 50, nervous = false, html = false }) => {
    const [displayed, setDisplayed] = useState('');

    useEffect(() => {
        setDisplayed('');
        let i = 0;
        // If html is true, we just show it immediately for now to avoid breaking tags, 
        // or we can just skip typewriter for complex HTML structures.
        if (html) {
            setDisplayed(text);
            return;
        }

        const timer = setInterval(() => {
            if (i < text.length) {
                // Use functional update to ensure we append correctly based on current state
                // However, we need to access the specific character at index i from the prop
                const char = text.charAt(i);
                setDisplayed(prev => prev + char);
                i++;
            } else {
                clearInterval(timer);
            }
        }, speed);
        return () => clearInterval(timer);
    }, [text, speed, html]);

    if (html) {
        return <div className={`${className} ${nervous ? 'nervous-text' : ''}`} dangerouslySetInnerHTML={{ __html: text }} />;
    }

    return <p className={`${className} ${nervous ? 'nervous-text' : ''}`}>{displayed}<span className="animate-pulse">|</span></p>;
};

export const SecretTransition: React.FC<SecretTransitionProps> = ({ onComplete }) => {
    const { isPhotosensitivityDisabled } = useCharacterContext();
    const [phase, setPhase] = useState(0);
    const [opacity, setOpacity] = useState(0); // For fading text in/out
    const [showFlash, setShowFlash] = useState(false);
    
    // Video transition states
    const [blackoutOpacity, setBlackoutOpacity] = useState(0);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Sequence configuration
    // Phase 0-5: Texts
    // Phase 6: Video (Duration set high to allow onEnded to trigger instead)
    
    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>;
        let flashInterval: ReturnType<typeof setInterval>;
        let fadeOutTimeout: ReturnType<typeof setTimeout>;

        const sequence = [
            { duration: 4500, fadeOutAt: 3500 }, // Daddy, who are these people?
            { duration: 4500, fadeOutAt: 3500 }, // Stop, where are you taking him?
            { duration: 4000, fadeOutAt: 3000 }, // Please stop, you're hurting me!
            { duration: 2500, fadeOutAt: 2000, flash: true }, // Error... (Flash red)
            { duration: 3500, fadeOutAt: 3000, intense: true }, // IT HURTS (Shake + Flash)
            { duration: 4500, fadeOutAt: 3500 }, // I just want to die
            { duration: 999999, fadeOutAt: 999999 }, // Video Phase - controlled by onEnded
        ];

        const runSequence = async () => {
            const currentStep = sequence[phase];
            
            if (!currentStep) {
                // Should not happen via normal flow if sequence aligns
                onComplete();
                return;
            }

            // Fade in
            setOpacity(1);

            // Handle flashing for specific phases
            if (currentStep.flash || currentStep.intense) {
                if (isPhotosensitivityDisabled) {
                    setShowFlash(true); // Steady red state for safe mode
                } else {
                    setShowFlash(true);
                    // Random flashing effect
                    flashInterval = setInterval(() => {
                        setShowFlash(prev => !prev);
                    }, currentStep.intense ? 50 : 150);
                }
            } else {
                setShowFlash(false);
            }

            // Schedule fade out (only if not the final video phase)
            if (phase < 6) {
                fadeOutTimeout = setTimeout(() => {
                    setOpacity(0);
                    if (flashInterval) clearInterval(flashInterval);
                    setShowFlash(false);
                }, currentStep.fadeOutAt);
            }

            // Schedule next phase (only if not the final video phase)
            if (phase < 6) {
                timeout = setTimeout(() => {
                    setPhase(p => p + 1);
                }, currentStep.duration);
            }
        };

        // Small delay on mount before starting
        const startDelay = setTimeout(() => {
            runSequence();
        }, 500);

        return () => {
            clearTimeout(startDelay);
            clearTimeout(timeout);
            clearTimeout(fadeOutTimeout);
            if (flashInterval) clearInterval(flashInterval);
        };
    }, [phase, onComplete, isPhotosensitivityDisabled]);

    // Handle video time updates to pre-fade to black
    const handleTimeUpdate = () => {
        if (videoRef.current) {
            const timeLeft = videoRef.current.duration - videoRef.current.currentTime;
            // Start fading to black in the last 0.8 seconds of the video
            if (timeLeft < 0.8) {
                setBlackoutOpacity(1); 
            }
        }
    };

    const handleVideoEnded = () => {
        // Force full blackout immediately just in case
        setBlackoutOpacity(1);
        // Small delay to ensure the blackout div is fully rendered over the video
        // before switching pages, preventing the gap.
        setTimeout(() => {
            onComplete();
        }, 100);
    };

    const renderContent = () => {
        switch (phase) {
            case 0:
                return <TypewriterText text='"Daddy, who are these people?"' className="text-gray-400 font-sans text-lg tracking-wide" nervous={true} />;
            case 1:
                return <TypewriterText text='"Stop, where are you taking him?"' className="text-gray-300 font-sans text-xl tracking-wide" nervous={true} />;
            case 2:
                return <TypewriterText text='"Please stop, you&apos;re hurting me!"' className="text-white font-sans text-2xl tracking-wide" nervous={true} speed={40} />;
            case 3:
                return (
                    <div className={isPhotosensitivityDisabled ? "nervous-text" : "shake-constant"}>
                        <p className="text-red-500 font-mono text-sm tracking-[0.2em] border border-red-500 p-2 bg-red-900/20">
                            /// ERROR: PROTOTYPE SAFETY OVERRIDDEN ///
                        </p>
                    </div>
                );
            case 4:
                return (
                    <div className={`flex flex-col items-center gap-2 ${isPhotosensitivityDisabled ? 'nervous-text' : 'shake-hard'}`}>
                        <p className={`text-red-600 font-cinzel text-4xl font-bold tracking-widest ${!isPhotosensitivityDisabled ? 'glitch-effect' : ''}`}>IT HURTS</p>
                        <p className={`text-red-500 font-cinzel text-5xl font-bold tracking-widest ${!isPhotosensitivityDisabled ? 'glitch-effect' : ''}`} style={{ transform: 'scale(1.2)' }}>IT HURTS</p>
                        <p className={`text-red-700 font-cinzel text-6xl font-bold tracking-widest ${!isPhotosensitivityDisabled ? 'glitch-effect' : ''}`} style={{ transform: 'scale(1.5)' }}>IT HURTS</p>
                    </div>
                );
            case 5:
                return <TypewriterText text="i just want to die." className="text-gray-600 font-sans text-xs lowercase tracking-widest italic" speed={100} />;
            case 6:
                return (
                    <div className="fixed inset-0 w-full h-full bg-black z-50 flex items-center justify-center overflow-hidden">
                        <div className="relative w-full h-full">
                            <video 
                                ref={videoRef}
                                src="https://i.imgur.com/Qr2mqe9.mp4" 
                                className="w-full h-full object-cover crt-video"
                                autoPlay 
                                playsInline
                                muted={false}
                                onTimeUpdate={handleTimeUpdate}
                                onEnded={handleVideoEnded}
                                onLoadedMetadata={(e) => {
                                    e.currentTarget.currentTime = 0.3;
                                }}
                            />
                            
                            {/* CRT Overlay Effects Container - Fades out as blackout fades in */}
                            <div 
                                className="absolute inset-0 pointer-events-none transition-opacity duration-700 ease-in"
                                style={{ opacity: 1 - blackoutOpacity }}
                            >
                                <div className="absolute inset-0 crt-scanlines"></div>
                                <div className="absolute inset-0 crt-vignette"></div>
                                <div className="absolute inset-0 crt-glow"></div>
                            </div>
                            
                            {/* Final Blackout Overlay - Z-index higher than CRT effects to ensure pure black transition */}
                            <div 
                                className="absolute inset-0 bg-black pointer-events-none z-[100] transition-opacity duration-700 ease-in"
                                style={{ opacity: blackoutOpacity }}
                            ></div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    const bgDuration = isPhotosensitivityDisabled ? 'duration-1000' : 'duration-100';

    return (
        <div className={`fixed inset-0 z-[200] flex flex-col items-center justify-center p-8 cursor-none transition-colors ease-in-out ${bgDuration} ${showFlash ? 'bg-red-900/30' : 'bg-black'}`}>
            <style>{`
                .glitch-effect {
                    text-shadow: 2px 2px #000, -2px -2px #000, 4px 0px #500;
                }
                @keyframes shake {
                    0% { transform: translate(1px, 1px) rotate(0deg); }
                    10% { transform: translate(-1px, -2px) rotate(-1deg); }
                    20% { transform: translate(-3px, 0px) rotate(1deg); }
                    30% { transform: translate(3px, 2px) rotate(0deg); }
                    40% { transform: translate(1px, -1px) rotate(1deg); }
                    50% { transform: translate(-1px, 2px) rotate(-1deg); }
                    60% { transform: translate(-3px, 1px) rotate(0deg); }
                    70% { transform: translate(3px, 1px) rotate(-1deg); }
                    80% { transform: translate(-1px, -1px) rotate(1deg); }
                    90% { transform: translate(1px, 2px) rotate(0deg); }
                    100% { transform: translate(1px, -2px) rotate(-1deg); }
                }
                @keyframes nervous {
                    0% { transform: translate(0, 0); }
                    25% { transform: translate(0.5px, 0.5px); }
                    50% { transform: translate(-0.5px, 0); }
                    75% { transform: translate(0, -0.5px); }
                    100% { transform: translate(0, 0); }
                }
                .shake-constant {
                    animation: shake 0.5s infinite;
                }
                .shake-hard {
                    animation: shake 0.1s infinite;
                }
                .nervous-text {
                    animation: nervous 0.15s infinite;
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fadeInUp 2s ease-out forwards;
                }

                /* CRT Effects */
                .crt-video {
                    filter: contrast(1.4) brightness(1.2) saturate(1.1) blur(0.5px);
                }
                .crt-scanlines {
                    background: linear-gradient(
                        to bottom,
                        rgba(255,255,255,0),
                        rgba(255,255,255,0) 50%,
                        rgba(0,0,0,0.3) 50%,
                        rgba(0,0,0,0.3)
                    );
                    background-size: 100% 4px;
                    opacity: 0.5;
                    animation: scanline 10s linear infinite;
                }
                .crt-vignette {
                    background: radial-gradient(circle, rgba(0,0,0,0) 55%, rgba(0,0,0,0.9) 100%);
                }
                .crt-glow {
                    background: radial-gradient(circle, rgba(168, 85, 247, 0.05) 0%, transparent 70%);
                    mix-blend-mode: overlay;
                    pointer-events: none;
                }
                @keyframes scanline {
                    0% { background-position: 0 0; }
                    100% { background-position: 0 100%; }
                }
            `}</style>
            <div 
                className="transition-opacity duration-1000 ease-in-out w-full h-full flex items-center justify-center"
                style={{ opacity: opacity }}
            >
                {renderContent()}
            </div>
        </div>
    );
};
