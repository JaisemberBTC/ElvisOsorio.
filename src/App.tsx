import React, { useState, useEffect } from 'react';
import { ActiveTab } from './types';
import { Header } from './components/Header';
import { DailyDevotionalView } from './components/DailyDevotionalView';
import { DevotionalSceneGenerator } from './components/DevotionalSceneGenerator';
import { BiblicalCounselor } from './components/BiblicalCounselor';
import { GoogleFlowVideoCreator } from './components/GoogleFlowVideoCreator';
import { BlessingCardStudio } from './components/BlessingCardStudio';
import { SpiritualVideoCreator } from './components/SpiritualVideoCreator';
import { Aprende30SegundosStudio } from './components/Aprende30SegundosStudio';
import { SocialMediaManager } from './components/SocialMediaManager';
import { Flame, Heart, Sparkles, Radio } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('aprende-30s');

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
            {activeTab === 'scene-generator' && <DevotionalSceneGenerator />}
            {activeTab === 'spiritual-video-creator' && (
              <SpiritualVideoCreator 
                onSendToStudio={(pkg) => {
                  if (pkg) {
                    try {
                      const videoScript = {
                        title: pkg.titulo,
                        hook: pkg.gancho,
                        mainTheme: pkg.tema || pkg.titulo,
                        primaryBibleVerse: {
                          reference: pkg.versiculo?.referencia || "Salmos 23:1",
                          text: pkg.versiculo?.texto_o_parafrasis || "El Señor es mi pastor; nada me faltará."
                        },
                        closingPrayer: pkg.guion_narrado || "Señor Jesús, bendice y guarda a quien ve este video. Amén.",
                        callToAction: pkg.llamado_a_la_accion || "Escribe Amén si lo crees",
                        musicMood: pkg.musica_sugerida,
                        scenes: (pkg.escenas || []).map((sc: any, idx: number) => ({
                          sceneNumber: idx + 1,
                          durationSec: Math.max(2, (sc.fin_segundo || 0) - (sc.inicio_segundo || 0)),
                          visualPrompt: sc.visual,
                          cameraMovement: sc.transicion,
                          narrationText: sc.narracion,
                          onScreenText: sc.texto_pantalla,
                          atmosphere: sc.palabras_resaltadas?.join(', ') || ''
                        })),
                        socialMetadata: {
                          caption: pkg.descripcion_publicacion,
                          hashtags: pkg.hashtags,
                          pinnedComment: `Amén 🙏 Que la paz y la gracia del Señor Jesús bendigan tu vida hoy.`
                        }
                      };
                      sessionStorage.setItem('devotional_to_video_transfer', JSON.stringify(videoScript));
                    } catch (e) {
                      console.error('Error saving video transfer:', e);
                    }
                  }
                  setActiveTab('spiritual-video-creator');
                }}
                onSendToCardStudio={(pkg) => {
                  if (pkg) {
                    try {
                      const cardData = {
                        cardHeader: (pkg.titulo || 'BENDICIÓN DE DIOS').toUpperCase(),
                        blessingQuote: pkg.gancho || pkg.guion_narrado,
                        verseReference: pkg.versiculo?.referencia || "Salmos 23:1",
                        verseText: pkg.versiculo?.texto_o_parafrasis || "El Señor es mi pastor; nada me faltará.",
                        shortPrayer: pkg.guion_narrado || "Señor, llena este día de tu bendición y de tu paz. Amén.",
                        suggestedColors: {
                          gradientStart: "#020617",
                          gradientEnd: "#1e1b4b",
                          accentColor: "#fbbf24"
                        },
                        themeCategory: "dawn",
                        imagePrompt: pkg.escenas?.[0]?.visual || "Amanecer celestial glorioso con luz divina viva",
                        suggestedRecipient: "Para mi amada familia y hermanos en la fe",
                        suggestedOccasion: pkg.tema || "Palabra de Esperanza y Bendición"
                      };
                      sessionStorage.setItem('devotional_to_card_transfer', JSON.stringify(cardData));
                    } catch (e) {
                      console.error('Error saving card transfer:', e);
                    }
                  }
                  setActiveTab('card-creator');
                }}
              />
            )}
            {activeTab === 'devotional' && (
              <DailyDevotionalView 
                onNavigateToCardStudio={() => setActiveTab('card-creator')}
                onNavigateToVideoStudio={() => setActiveTab('spiritual-video-creator')}
              />
            )}
            {activeTab === 'card-creator' && <BlessingCardStudio />}
            {activeTab === 'aprende-30s' && (
              <Aprende30SegundosStudio
                onSendToStudio={(pkg) => {
                  if (pkg) {
                    try {
                      const videoScript = {
                        title: pkg.titulo,
                        hook: pkg.gancho_inicial,
                        mainTheme: pkg.titulo,
                        primaryBibleVerse: {
                          reference: "@Aprendeen30segundos",
                          text: pkg.banner_hook_superior || "Aprende en 30 Segundos"
                        },
                        closingPrayer: pkg.llamado_accion || "Suscríbete a @Aprendeen30segundos para más trucos diarios.",
                        callToAction: pkg.llamado_accion || "Guarda este video",
                        musicMood: pkg.musica_sugerida || "Lo-Fi Focus Beat 124 BPM",
                        scenes: (pkg.escenas || []).map((sc: any, idx: number) => ({
                          sceneNumber: idx + 1,
                          durationSec: sc.durationSec || 10,
                          visualPrompt: sc.visualPrompt,
                          cameraMovement: sc.cameraMovement || 'zoom_in_suave',
                          narrationText: sc.narration,
                          onScreenText: sc.onScreenText,
                          secondaryTitle: sc.secondaryTitle,
                          imageUrl: sc.imageUrl || sc.mediaUrl,
                          mediaUrl: sc.mediaUrl || sc.imageUrl,
                          mediaType: sc.mediaType || 'image',
                          subtitleSlots: sc.subtitleSlots
                        }))
                      };
                      sessionStorage.setItem('devotional_to_video_transfer', JSON.stringify(videoScript));
                      setActiveTab('spiritual-video-creator');
                    } catch (e) {
                      console.error('Error saving transfer to studio:', e);
                    }
                  }
                }}
              />
            )}
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

