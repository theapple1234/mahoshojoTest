
import React, { useState, useEffect, Suspense } from 'react';
import { CharacterProvider, useCharacterContext } from './context/CharacterContext';
import { StatsFooter } from './components/StatsFooter';
import { SectionHeader } from './components/ui';
import { SplashScreen } from './components/SplashScreen';
import { BackgroundMusic } from './components/BackgroundMusic';
import { ScrollButtons } from './components/ScrollButtons';
import { SecretTransition } from './components/SecretTransition';
import { SigilCounter } from './components/SigilCounter';
import { SettingsModal } from './components/SettingsModal';

// Lazy load page components
const PageOne = React.lazy(() => import('./components/PageOne').then(module => ({ default: module.PageOne })));
const PageTwo = React.lazy(() => import('./components/PageTwo').then(module => ({ default: module.PageTwo })));
const PageThree = React.lazy(() => import('./components/PageThree').then(module => ({ default: module.PageThree })));
const PageFour = React.lazy(() => import('./components/PageFour').then(module => ({ default: module.PageFour })));
const PageFive = React.lazy(() => import('./components/PageFive').then(module => ({ default: module.PageFive })));
const PageSix = React.lazy(() => import('./components/PageSix').then(module => ({ default: module.PageSix })));
const ReferencePage = React.lazy(() => import('./components/ReferencePage').then(module => ({ default: module.ReferencePage })));
const BuildSummaryPage = React.lazy(() => import('./components/BuildSummaryPage').then(module => ({ default: module.BuildSummaryPage })));
const LostBlessingPage = React.lazy(() => import('./components/LostBlessingPage').then(module => ({ default: module.LostBlessingPage })));

const PAGE_TITLES = ['YOUR BIRTH', 'YOUR SCHOOLING', 'SIGILS & BLESSINGS', 'DESIGN YOUR MAGIC', 'YOUR CAREER', 'YOUR RETIREMENT'];
const PAGE_BACKGROUNDS = ['bg-[#0a101f]', 'bg-[#2a201c]', 'bg-[#100c14]', 'bg-[#1a1412]', 'bg-[#09110e]', 'bg-[#0c0c0e]'];
const PAGE_HEADERS = [
    "/images/0pnyNKFq-main1.jpg", 
    "/images/4nrwRMyD-main1.png", 
    "/images/JRGRMRFH-main1.png", 
    "/images/sJFF0vY2-page4main.jpg", 
    "/images/RGRMNF8H-main1.jpg", 
    "/images/Jw995hSG-endmain.jpg"
];

// Icons
const BookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const GlobalNotification: React.FC = () => {
    const { globalNotification } = useCharacterContext();

    if (!globalNotification) return null;

    let bgClass = "bg-blue-900/90 border-blue-500 text-blue-100 shadow-blue-900/20";
    if (globalNotification.type === 'success') bgClass = "bg-green-900/90 border-green-500 text-green-100 shadow-green-900/20";
    if (globalNotification.type === 'error') bgClass = "bg-red-900/90 border-red-500 text-red-100 shadow-red-900/20";
    if (globalNotification.type === 'info') bgClass = "bg-purple-900/90 border-purple-500 text-purple-100 shadow-purple-900/20";

    return (
        <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-4 rounded-lg shadow-2xl backdrop-blur-md border z-[200] flex items-center gap-3 animate-fade-in-up-toast ${bgClass}`}>
            <span className="font-cinzel font-bold text-sm tracking-wide">{globalNotification.message}</span>
        </div>
    );
};

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  // State to control if the fade-in animation should show (only right after video)
  const [showSecretIntro, setShowSecretIntro] = useState(false);
  // Control UI visibility separately to fade them in after the black fade-out
  const [areSecretOverlaysVisible, setAreSecretOverlaysVisible] = useState(false);
  
  const { 
      isReferencePageOpen, 
      openReferencePage, 
      closeReferencePage,
      isBuildSummaryOpen,
      openBuildSummary,
      closeBuildSummary,
      hasSeenSecretTransition, 
      markSecretTransitionSeen, 
      availableSigilCounts, 
      handleCommonSigilAction, 
      toggleSettings,
      isSecretTransitionActive,
      setSecretTransitionActive,
      setIsSecretMusicMode,
      // Special Sigil Handlers for global counter
      selectedSpecialSigilChoices,
      handleSpecialSigilChoice,
      acquiredLekoluJobs,
      handleLekoluJobAction
  } = useCharacterContext();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  // Global ESC handler for settings
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            toggleSettings();
        }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
    };
  }, [toggleSettings]);

  useEffect(() => {
    const handleSecretNavigation = () => {
        if (hasSeenSecretTransition) {
            // If already seen, skip video AND entrance animation
            setShowSecretIntro(false);
            setAreSecretOverlaysVisible(true);
            setCurrentPage(7);
            setIsSecretMusicMode(true); // Ensure music switches even if seen before
        } else {
            setSecretTransitionActive(true);
            setIsSecretMusicMode(true); // Start scary music during transition
        }
    };
    const handleReturnFromSecret = () => {
        setCurrentPage(6);
        // Do NOT change music back automatically
    };
    
    window.addEventListener('navigate-to-secret-page', handleSecretNavigation);
    window.addEventListener('navigate-from-secret-page', handleReturnFromSecret);
    
    return () => {
        window.removeEventListener('navigate-to-secret-page', handleSecretNavigation);
        window.removeEventListener('navigate-from-secret-page', handleReturnFromSecret);
    };
  }, [hasSeenSecretTransition, setSecretTransitionActive, setIsSecretMusicMode]);

  const handleTransitionComplete = () => {
      markSecretTransitionSeen();
      setSecretTransitionActive(false);
      // Enable entrance animation right after video finishes
      setShowSecretIntro(true);
      setAreSecretOverlaysVisible(false);
      
      // Delay showing the UI overlays until the black fade-out (3s) is mostly complete
      setTimeout(() => {
          setAreSecretOverlaysVisible(true);
      }, 2500); // Start fading in slightly before the black is fully gone for smoothness

      setCurrentPage(7);
  };

  const PageNavigation = () => (
    <div className="flex justify-between items-center mt-16 max-w-7xl mx-auto">
      {currentPage > 1 && currentPage < 7 ? (
        <button 
          onClick={() => setCurrentPage(p => p - 1)}
          className="px-6 py-2 font-cinzel text-lg bg-gray-800/50 border border-gray-700 rounded-md hover:bg-gray-700 transition-colors"
        >
          ← BACK TO {PAGE_TITLES[currentPage - 2]}
        </button>
      ) : <div />}
      
      <div className="flex-grow" />

      {currentPage < 6 ? (
        <button 
          onClick={() => setCurrentPage(p => p + 1)}
          className="px-6 py-2 font-cinzel text-lg bg-gray-800/50 border border-gray-700 rounded-md hover:bg-gray-700 transition-colors"
        >
          GO TO {PAGE_TITLES[currentPage]} →
        </button>
      ) : currentPage === 6 ? (
        <button
          onClick={openBuildSummary}
          className="group relative px-8 py-3 rounded-lg overflow-hidden border border-cyan-500/30 bg-black/60 shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] hover:border-cyan-400"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/40 via-blue-900/40 to-cyan-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent translate-x-[100%] group-hover:translate-x-[-100%] transition-transform duration-1000"></div>
            
            <div className="relative flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span className="font-cinzel text-xl font-bold text-cyan-100 tracking-widest group-hover:text-white transition-colors">
                    DOWNLOAD BUILD
                </span>
            </div>
        </button>
      ) : <div />}
    </div>
  );

  // If transitioning to secret page
  if (isSecretTransitionActive) {
      return <SecretTransition onComplete={handleTransitionComplete} />;
  }

  // Button Themes
  const referenceButtonClass = "fixed bottom-12 right-8 z-[51] group";
  const innerButtonClass = "relative px-5 py-3 font-cinzel text-lg font-bold tracking-wider rounded-xl transition-all duration-300 flex items-center gap-3 border-2 overflow-hidden shadow-2xl";
  
  // High contrast colors (Solid backgrounds, bright text)
  const normalTheme = "bg-slate-900 text-white border-cyan-500 hover:bg-slate-800 hover:border-cyan-400 hover:shadow-cyan-500/20";
  const secretTheme = "bg-red-950 text-white border-red-500 hover:bg-red-900 hover:border-red-400 hover:shadow-red-500/20";
  const currentTheme = currentPage === 7 ? secretTheme : normalTheme;

  const ReferenceButton = () => (
      <button
        onClick={openReferencePage}
        className={`${referenceButtonClass}`}
        title="Open Reference Page"
      >
          <div className={`${innerButtonClass} ${currentTheme}`}>
              {/* Background shine effect */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-r from-transparent via-white to-transparent -translate-x-full group-hover:translate-x-full transition-all duration-700 ease-in-out z-0`}></div>
              
              {/* Icon Container */}
              <div className={`relative z-10 p-2 rounded-lg bg-black/40 border border-white/20`}>
                <BookIcon />
              </div>

              {/* Text */}
              <div className="relative z-10 flex flex-col items-start">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-white/80 leading-none mb-1">The</span>
                  <span className="leading-none font-bold text-white text-lg">Reference</span>
              </div>
          </div>
      </button>
  );

  // If secret page is active, render only that
  if (currentPage === 7) {
      return (
          <>
              {/* Separate suspense for the main page content to keep it mounted while modals load */}
              <Suspense fallback={<div className="fixed inset-0 bg-[#000000] z-[100]"></div>}>
                  <LostBlessingPage enableEntranceAnimation={showSecretIntro} />
              </Suspense>

              {/* Separate suspense for modals with a transparent fallback to avoid flashing black */}
              <Suspense fallback={<div className="fixed inset-0 z-[150] flex items-center justify-center pointer-events-none"><div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div></div>}>
                  {isReferencePageOpen && <ReferencePage onClose={closeReferencePage} />}
                  {isBuildSummaryOpen && <BuildSummaryPage onClose={closeBuildSummary} />}
              </Suspense>

              <SettingsModal />
              <GlobalNotification />
              
              {/* Overlays for Secret Page - Fade in control */}
              <div className={`transition-opacity duration-1000 ease-in-out ${areSecretOverlaysVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                  <ScrollButtons />
                  <SigilCounter 
                    counts={availableSigilCounts} 
                    onAction={handleCommonSigilAction} 
                    selectedSpecialSigilChoices={selectedSpecialSigilChoices}
                    onSpecialSigilChoice={handleSpecialSigilChoice}
                    acquiredLekoluJobs={acquiredLekoluJobs}
                    onLekoluJobAction={handleLekoluJobAction}
                  />
                  <StatsFooter />
                  <ReferenceButton />
              </div>
          </>
      );
  }

  return (
    <>
      <Suspense fallback={null}>
        {isReferencePageOpen && <ReferencePage onClose={closeReferencePage} />}
        {isBuildSummaryOpen && <BuildSummaryPage onClose={closeBuildSummary} />}
        <SettingsModal />
      </Suspense>
      <GlobalNotification />
      <div className={`min-h-screen text-white font-sans transition-colors duration-500 ${PAGE_BACKGROUNDS[currentPage - 1]}`}>
        <div className="container mx-auto px-4 py-8 relative pb-20">
          <header className="mb-12">
            <img src={PAGE_HEADERS[currentPage - 1]} alt={PAGE_TITLES[currentPage - 1]} className="mx-auto w-full max-w-4xl no-glow" />
          </header>

          <Suspense fallback={<div className="flex items-center justify-center h-64 font-cinzel text-xl text-gray-400 animate-pulse">Loading...</div>}>
            {currentPage === 1 && <PageOne />}
            {currentPage === 2 && <PageTwo />}
            {currentPage === 3 && <PageThree />}
            {currentPage === 4 && <PageFour />}
            {currentPage === 5 && <PageFive />}
            {currentPage === 6 && <PageSix />}
          </Suspense>
          
          <PageNavigation />
        </div>
        <StatsFooter />
      </div>
      
      <ReferenceButton />
      <ScrollButtons />
    </>
  );
};

const MainApp: React.FC = () => {
  const [isAppStarted, setIsAppStarted] = useState(false);
  const [isExitingSplash, setIsExitingSplash] = useState(false);

  // Navigation Guard: Prevent accidental exit
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isAppStarted) {
        // Standard browsers require preventDefault and setting returnValue to a string (empty or otherwise)
        e.preventDefault();
        e.returnValue = ''; 
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isAppStarted]);

  const handleStartApp = () => {
    setIsExitingSplash(true);
    window.dispatchEvent(new Event('play-background-music'));
    setTimeout(() => {
      setIsAppStarted(true);
    }, 1000); // Animation duration
  };

  return (
    <>
      {!isAppStarted && <SplashScreen onStart={handleStartApp} isExiting={isExitingSplash} />}
      <BackgroundMusic />
      <div className={`transition-opacity duration-1000 ${isAppStarted ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {isAppStarted && <AppContent />}
      </div>
    </>
  );
};

const App: React.FC = () => {
  return (
    <CharacterProvider>
      <MainApp />
    </CharacterProvider>
  );
};

export default App;
