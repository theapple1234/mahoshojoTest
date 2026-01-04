
import { usePageOneState } from '../hooks/usePageOneState';
import { usePageTwoState } from '../hooks/usePageTwoState';
import { usePageThreeState } from '../hooks/usePageThreeState';
import { usePageFourState } from '../hooks/usePageFourState';
import { usePageFiveState } from '../hooks/usePageFiveState';
import { usePageSixState } from '../hooks/usePageSixState';
import type { SigilCounts, BuildType } from '../types';

export type PageOneState = ReturnType<typeof usePageOneState>;
export type PageTwoState = ReturnType<typeof usePageTwoState>;
export type PageThreeState = ReturnType<typeof usePageThreeState>;
export type PageFourState = ReturnType<typeof usePageFourState>;
export type PageFiveState = ReturnType<typeof usePageFiveState>;
export type PageSixState = ReturnType<typeof usePageSixState>;

export interface GlobalNotification {
    message: string;
    type: 'success' | 'error' | 'info';
}

export interface ICharacterContext extends 
    PageOneState, PageTwoState, PageThreeState, PageFourState, PageFiveState, PageSixState 
{
  selectedDominionId: string | null;
  handleSelectDominion: (id: string) => void;
  blessingPoints: number;
  fortunePoints: number;
  kuriPoints: number;
  
  // Point Breakdown
  bpGained: number;
  bpSpent: number;
  fpGained: number;
  fpSpent: number;
  kpGained: number;
  kpSpent: number;

  kpPaidNodes: Map<string, string>; // nodeId -> sigilType
  toggleKpNode: (nodeId: string, sigilType: string) => void;
  availableSigilCounts: SigilCounts;
  totalSigilCounts: SigilCounts;
  isReferencePageOpen: boolean;
  openReferencePage: () => void;
  closeReferencePage: () => void;
  addMiscFpCost: (amount: number) => void;
  miscFpCosts: number;
  refreshBuildCosts: () => void;
  buildsRefreshTrigger: number;
  updateReferenceName: (type: BuildType, oldName: string, newName: string) => void;
  
  // Secret Transition
  hasSeenSecretTransition: boolean;
  markSecretTransitionSeen: () => void;
  isSecretTransitionActive: boolean;
  setSecretTransitionActive: (active: boolean) => void;
  isSecretMusicMode: boolean; 
  setIsSecretMusicMode: (active: boolean) => void; 

  isPhotosensitivityDisabled: boolean;
  setPhotosensitivityDisabled: (disabled: boolean) => void;
  // Lost Blessing
  selectedLostBlessingNodes: Set<string>;
  toggleLostBlessingNode: (id: string) => void;
  selectedLostPowers: Set<string>;
  toggleLostPower: (id: string) => void;
  // Backups for logic handling
  backupLostBlessingNodes: Set<string>;
  backupLostPowers: Set<string>;
  
  // Global Notification
  globalNotification: GlobalNotification | null;
  setGlobalNotification: (notification: GlobalNotification | null) => void;

  // Settings
  isSettingsOpen: boolean;
  toggleSettings: () => void;
  language: 'en' | 'ko';
  setLanguage: (lang: 'en' | 'ko') => void;
  fontSize: 'regular' | 'large';
  setFontSize: (size: 'regular' | 'large') => void;
  volume: number;
  setVolume: (vol: number) => void;
  bgmVideoId: string;
  setBgmVideoId: (id: string) => void;
  serializeState: () => any;
  loadState: (data: any) => void; 
  loadFullBuild: (data: any) => void; // New robust loader

  // Build Summary
  isBuildSummaryOpen: boolean;
  openBuildSummary: () => void;
  closeBuildSummary: () => void;

  // Debugging
  isDebugOpen: boolean;
  toggleDebug: () => void;
  debugLog: string[];
  addDebugLog: (msg: string) => void;
  debugFileContent: string;
  setDebugFileContent: (content: string) => void;
}
