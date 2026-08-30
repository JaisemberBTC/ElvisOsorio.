import React, { useState } from 'react';
import { ActiveTab } from './types';
import { Header } from './components/Header';
import { SpaceStudio } from './components/SpaceStudio';
import { DailyDevotionalView } from './components/DailyDevotionalView';
import { BiblicalCounselor } from './components/BiblicalCounselor';
import { GoogleFlowVideoCreator } from './components/GoogleFlowVideoCreator';
import { BlessingCardStudio } from './components/BlessingCardStudio';
import { SocialMediaManager } from './components/SocialMediaManager';
import { Flame, Heart, Sparkles, Radio } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('studio');

  return (
    <div className="min-h-screen bg-[#02040a] text-slate-200 font-sans relative overflow-x-hidden flex flex-col justify-between selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Immersive UI Ambient Glowing Spheres */}
      <div className="fixed top-[-120px] left-[-120px] w-[500px] h-[500px] bg-indigo-950/30 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed bottom-[-80px] right-[-80px] w-[600px] h-[600px] bg-amber-950/20 rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-950/15 rounded-full blur-[180px] pointer-events-none z-0" />

      {/* Main App Container */}
      <div className="relative z-10 flex flex-col min-h-screen justify-between">
        
        {/* Top Header & Navigation */}
        <div>
          <Header activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Main Content Area */}
          <main className="pb-16 pt-2">
            {activeTab === 'studio' && <SpaceStudio />}
            {activeTab === 'social-connect' && (
              <SocialMediaManager 
                onOpenVeoStudio={() => setActiveTab('studio')}
              />
            )}
            {activeTab === 'devotional' && (
              <DailyDevotionalView 
                onNavigateToCardStudio={() => setActiveTab('card-creator')}
                onNavigateToVideoStudio={() => setActiveTab('studio')}
              />
            )}
            {(activeTab === 'flow-video' || activeTab === 'counselor') && (
              <GoogleFlowVideoCreator />
            )}
            {activeTab === 'card-creator' && <BlessingCardStudio />}
          </main>
        </div>

        {/* Immersive UI Footer */}
        <footer className="relative z-10 px-6 sm:px-12 py-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-950/50 backdrop-blur-md text-xs text-slate-500">
          <div className="flex items-center gap-2 text-slate-400">
            <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-amber-300 to-amber-500 flex items-center justify-center text-slate-950 font-bold text-xs shadow-[0_0_10px_rgba(245,158,11,0.3)]">
              🕊️
            </div>
            <span>© 2026 Espacio de Fe & Oración • Impulsado por Gemini AI</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Altar & Agentes en Vivo</span>
            </div>
            <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />
            <div className="text-xs text-slate-400 italic font-scripture hidden sm:block">
              "Clama a mí, y yo te responderé" — Jeremías 33:3
            </div>
          </div>
        </footer>

      </div>

    </div>
  );
}

