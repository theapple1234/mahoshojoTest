
import React, { useState } from 'react';
import { useCharacterContext } from '../context/CharacterContext';

export const DebugPanel: React.FC = () => {
  const { 
      isDebugOpen, toggleDebug, debugLog, debugFileContent,
      selectedDominionId, blessingPoints, fortunePoints,
      serializeState
  } = useCharacterContext();
  const [activeTab, setActiveTab] = useState<'log' | 'file'>('log');

  if (!isDebugOpen) return null;

  // Function to peek at current state snapshot
  const currentStateSnapshot = JSON.stringify({
      selectedDominionId,
      blessingPoints,
      fortunePoints
  }, null, 2);

  return (
    <div className="fixed top-0 right-0 w-full sm:w-1/3 h-screen bg-[#0d1117] border-l-2 border-green-500/50 z-[9999] shadow-2xl font-mono text-xs flex flex-col animate-slide-in-right">
      <div className="flex justify-between items-center p-2 bg-green-900/20 border-b border-green-500/30">
        <h3 className="text-green-400 font-bold uppercase tracking-wider">Debug Console</h3>
        <button 
          onClick={toggleDebug}
          className="text-green-500 hover:text-white font-bold px-2"
        >
          [CLOSE]
        </button>
      </div>
      
      <div className="flex border-b border-green-500/20">
        <button 
          onClick={() => setActiveTab('log')}
          className={`flex-1 py-2 text-center transition-colors ${activeTab === 'log' ? 'bg-green-500/20 text-green-300' : 'text-gray-500 hover:text-green-400'}`}
        >
          Process Log
        </button>
        <button 
          onClick={() => setActiveTab('file')}
          className={`flex-1 py-2 text-center transition-colors ${activeTab === 'file' ? 'bg-green-500/20 text-green-300' : 'text-gray-500 hover:text-green-400'}`}
        >
          Raw File Content
        </button>
      </div>

      <div className="flex-grow overflow-auto p-4 scrollbar-thin scrollbar-thumb-green-700 scrollbar-track-[#0d1117]">
        {activeTab === 'log' ? (
          <div className="space-y-1">
            {debugLog.length === 0 && <p className="text-gray-600 italic">Waiting for events...</p>}
            {debugLog.map((log, i) => (
              <div key={i} className="border-b border-green-900/30 pb-1 mb-1 last:border-0 text-green-100/80 break-words">
                {log}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-black p-2 rounded border border-gray-800 h-full overflow-auto">
            {debugFileContent ? (
               <pre className="text-green-400 whitespace-pre-wrap break-all">{debugFileContent}</pre>
            ) : (
               <p className="text-gray-600 italic">No file loaded yet.</p>
            )}
          </div>
        )}
      </div>

      {/* Real-time State Monitor */}
      <div className="p-3 bg-[#050910] border-t-2 border-green-500/30">
          <h4 className="text-green-500 font-bold mb-2 uppercase border-b border-green-800 pb-1">Current State Monitor</h4>
          <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div>
                  <span className="text-gray-500">Dominion ID:</span>
                  <span className="block text-green-300 font-bold text-sm">
                      {selectedDominionId || 'NULL'}
                  </span>
              </div>
              <div>
                  <span className="text-gray-500">Points (BP/FP):</span>
                  <span className="block text-green-300 font-bold">
                      {blessingPoints} / {fortunePoints}
                  </span>
              </div>
          </div>
          <div className="mt-2 text-[9px] text-gray-600">
              Last Render: {new Date().toLocaleTimeString()}
          </div>
      </div>
    </div>
  );
};
