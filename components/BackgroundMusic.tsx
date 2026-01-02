
import React, { useState, useEffect, useRef } from 'react';
import { useCharacterContext } from '../context/CharacterContext';

const MuteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
  </svg>
);

const UnmuteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2 2m2-2l2 2" />
  </svg>
);

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

const SECRET_BGM_ID = 'xvvY9vA9X78';
const SECRET_START_TIME = 22;

export const BackgroundMusic: React.FC = () => {
  const { volume, setVolume, isSecretTransitionActive, isSecretMusicMode, bgmVideoId } = useCharacterContext();
  const [isMuted, setIsMuted] = useState(false);
  const playerRef = useRef<any>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const currentVideoIdRef = useRef(bgmVideoId);

  // Helper to smooth fade volume
  const fadeAudio = (startVol: number, endVol: number, duration: number, onComplete?: () => void) => {
      if (!playerRef.current) {
          if (onComplete) onComplete();
          return;
      }
      
      const steps = 20;
      const stepTime = duration / steps;
      const volStep = (endVol - startVol) / steps;
      let currentStep = 0;

      const fadeInterval = setInterval(() => {
          currentStep++;
          const newVol = startVol + (volStep * currentStep);
          // Clamp volume between 0 and 100
          const clampedVol = Math.max(0, Math.min(100, newVol));
          
          if (playerRef.current && typeof playerRef.current.setVolume === 'function') {
            playerRef.current.setVolume(clampedVol);
          }

          if (currentStep >= steps) {
              clearInterval(fadeInterval);
              if (onComplete) onComplete();
          }
      }, stepTime);
  };

  const switchTrack = (newId: string, startSeconds: number = 0) => {
      // 1. Fade Out
      fadeAudio(volume, 0, 1500, () => {
          if (playerRef.current && typeof playerRef.current.loadVideoById === 'function') {
              // 2. Switch Track
              playerRef.current.loadVideoById({
                  videoId: newId,
                  startSeconds: startSeconds,
                  suggestedQuality: 'small'
              });
              
              // 3. Fade In
              // Wait a tiny bit for buffering
              setTimeout(() => {
                  fadeAudio(0, volume, 1500);
              }, 500);
          }
      });
  };

  // Determine which track should be playing
  const activeVideoId = isSecretMusicMode ? SECRET_BGM_ID : bgmVideoId;
  const activeStartSeconds = isSecretMusicMode ? SECRET_START_TIME : 0;

  // Initialize Player
  useEffect(() => {
    const initPlayer = () => {
      if (document.getElementById('yt-player') && !playerRef.current) {
        playerRef.current = new window.YT.Player('yt-player', {
          height: '0',
          width: '0',
          videoId: activeVideoId, // Use calculated active ID
          playerVars: {
            autoplay: 0,
            controls: 0,
            loop: 1, // Playlist trick works best for native loop, but manual loop is safer
            playlist: activeVideoId, 
            start: activeStartSeconds
          },
          events: {
            onReady: (event: any) => {
                event.target.setVolume(volume);
                event.target.playVideo();
            },
            onStateChange: (event: any) => {
                // YT.PlayerState.ENDED is 0
                if (event.data === 0) {
                    event.target.playVideo();
                }
            }
          }
        });
      }
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    const handlePlayMusic = () => {
      if (playerRef.current && typeof playerRef.current.playVideo === 'function') {
        playerRef.current.playVideo();
        playerRef.current.unMute();
        playerRef.current.setVolume(volume);
        setIsMuted(false);
      }
    };
    
    window.addEventListener('play-background-music', handlePlayMusic);

    return () => {
      window.removeEventListener('play-background-music', handlePlayMusic);
    };
  }, []); // Run once on mount

  // Watch for Active Track changes (User setting or Secret Mode trigger)
  useEffect(() => {
    if (currentVideoIdRef.current !== activeVideoId) {
        // Trigger smooth transition
        switchTrack(activeVideoId, activeStartSeconds);
        currentVideoIdRef.current = activeVideoId;
    }
  }, [activeVideoId, activeStartSeconds]);

  // Sync volume changes (only if not actively fading ideally, but for simplicity we allow overrides)
  useEffect(() => {
      if (playerRef.current && typeof playerRef.current.setVolume === 'function') {
          playerRef.current.setVolume(volume);
      }
  }, [volume]);

  const toggleMute = () => {
    setIsMuted(currentMutedState => {
      const newMutedState = !currentMutedState;
      if (playerRef.current && typeof playerRef.current.mute === 'function') {
        if (newMutedState) {
          playerRef.current.mute();
        } else {
          playerRef.current.unMute();
        }
      }
      return newMutedState;
    });
  };

  return (
    <>
      <div id="yt-player" style={{ position: 'absolute', top: -9999, left: -9999 }}></div>
      
      <div 
        className={`fixed bottom-4 left-4 z-[90] flex items-end gap-2 transition-opacity duration-500 ${isSecretTransitionActive ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <button
            onClick={toggleMute}
            className="bg-black/50 text-white p-2 rounded-full hover:bg-black/80 transition-colors border border-white/10"
            aria-label={isMuted ? "Unmute" : "Mute"}
        >
            {isMuted ? <UnmuteIcon /> : <MuteIcon />}
        </button>

        {/* Volume Slider - Visible on hover */}
        <div className={`transition-all duration-300 overflow-hidden ${isHovered ? 'w-24 opacity-100' : 'w-0 opacity-0'}`}>
            <div className="bg-black/60 p-2 rounded-full border border-white/10 flex items-center h-10 mb-0.5">
                <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={volume}
                    onChange={(e) => setVolume(parseInt(e.target.value))}
                    className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-white"
                />
            </div>
        </div>
      </div>
    </>
  );
};
