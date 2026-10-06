import React, { useState } from 'react';
import { X, Sparkles, BookOpen, Check } from 'lucide-react';

export interface SrCanuteScriptPackage {
  title: string;
  hook: string;
  verse: {
    reference: string;
    text: string;
  };
  scenes: {
    sceneNumber: number;
    narrationText: string;
    visualPrompt: string;
    cameraMovement: string;
    onScreenText: string;
  }[];
  callToAction: string;
}

interface SrCanuteHistoriasModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyToStudio: (pkg: SrCanuteScriptPackage) => void;
}

export const SrCanuteHistoriasModal: React.FC<SrCanuteHistoriasModalProps> = ({
  isOpen,
  onClose,
  onApplyToStudio
}) => {
  if (!isOpen) return null;

  const samplePackage: SrCanuteScriptPackage = {
    title: "La Respuesta en el Desierto",
    hook: "Cuando sientas que Dios guarda silencio, recuerda esto.",
    verse: {
      reference: "Isaías 41:10",
      text: "No temas, porque yo estoy contigo; no desmayes, porque yo soy tu Dios que te esfuerzo."
    },
    scenes: [
      {
        sceneNumber: 1,
        narrationText: "Hay momentos en la vida donde las fuerzas se agotan y las respuestas tardan en llegar.",
        visualPrompt: "Solitary wanderer in golden Judean desert at sunset, warm cinematic lighting, 9:16 vertical.",
        cameraMovement: "slow_zoom_in",
        onScreenText: "CUANDO DIOS GUARDA SILENCIO..."
      },
      {
        sceneNumber: 2,
        narrationText: "Pero el silencio de Dios nunca significa Su ausencia; significa que Su mano está obrando en lo invisible.",
        visualPrompt: "Jesus extending radiant hand of comfort with warm celestial glow, soft atmospheric mist.",
        cameraMovement: "pan_up_reverent",
        onScreenText: "ÉL ESTÁ OBRANDO POR TI"
      },
      {
        sceneNumber: 3,
        narrationText: "No temas a lo que viene mañana, porque Aquel que te sostuvo ayer sigue cuidando de ti hoy.",
        visualPrompt: "Peaceful sunrise breaking through stormy clouds, warm 5500K golden divine rays.",
        cameraMovement: "orbit_suave",
        onScreenText: "NO TEMAS, ÉL ESTÁ CONTIGO"
      }
    ],
    callToAction: "Escribe Amén y comparte esta palabra con alguien que hoy necesite paz."
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-xl bg-slate-900 border border-white/10 rounded-3xl p-6 shadow-2xl relative space-y-4">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 font-bold">
            📜
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Historias Serializadas de Fe</h2>
            <p className="text-xs text-slate-400">Guiones cinematográficos de alta retención para TikTok y Shorts</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-white/5 space-y-3 text-xs">
          <div className="font-bold text-amber-300">{samplePackage.title}</div>
          <div className="italic text-slate-300">"{samplePackage.hook}"</div>
          <div className="text-[11px] text-slate-400 font-mono">{samplePackage.verse.reference}: "{samplePackage.verse.text}"</div>
        </div>

        <button
          type="button"
          onClick={() => {
            onApplyToStudio(samplePackage);
            onClose();
          }}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-purple-600/30"
        >
          <Sparkles className="w-4 h-4" />
          <span>Cargar Esta Historia en el Estudio</span>
        </button>
      </div>
    </div>
  );
};
