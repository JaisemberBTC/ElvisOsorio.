import React, { useState } from 'react';
import { 
  Workflow, 
  Sparkles, 
  Play, 
  Layers, 
  Download, 
  Volume2, 
  Video, 
  CheckCircle2, 
  RefreshCw,
  Eye,
  Sliders
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const GoogleFlowVideoCreator: React.FC = () => {
  const [topic, setTopic] = useState('La Paz de Jesús en Medio de la Tormenta');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    '1. Guion Teológico y Gancho Disruptivo',
    '2. Storyboard Visual y Movimientos Veo 3',
    '3. Síntesis de Voz y Pad Celestial 432 Hz',
    '4. Empaquetado y Exportación Multiplataforma'
  ];

  const handleGenerateFlow = async () => {
    setIsProcessing(true);
    setCurrentStep(0);

    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i);
      await new Promise(r => setTimeout(r, 600));
    }

    setIsProcessing(false);
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-amber-500/30 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950 uppercase tracking-wider flex items-center gap-1">
                <Workflow className="w-3.5 h-3.5" />
                Google Flow Pipeline
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/10 text-slate-300">
                Automatización de Video Extremo a Extremo
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-cinzel">
              Flujo Automatizado de Creación Audiovisual
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              Genera guiones inspirados, storyboard cinematográfico con Veo 3, narración con voz de Jesús y sincronización de música sacra en un solo pipeline.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Tema o pasaje bíblico..."
              className="px-4 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-amber-400 flex-1 md:w-80"
            />
            <button
              type="button"
              onClick={handleGenerateFlow}
              disabled={isProcessing}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 font-cinzel shadow-lg transition-all cursor-pointer disabled:opacity-50 shrink-0"
            >
              <Sparkles className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
              <span>{isProcessing ? 'Procesando Flujo...' : 'Ejecutar Flow'}</span>
            </button>
          </div>
        </div>

        {/* Pipeline Visual Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-6 mt-6 border-t border-white/10">
          {steps.map((step, idx) => {
            const isDone = !isProcessing || currentStep > idx;
            const isCurrent = isProcessing && currentStep === idx;

            return (
              <div
                key={idx}
                className={`p-3 rounded-2xl border transition-all ${
                  isCurrent
                    ? 'bg-amber-500/20 border-amber-400 ring-1 ring-amber-400/50'
                    : isDone
                    ? 'bg-slate-950/60 border-white/10'
                    : 'bg-slate-950/30 border-white/5 opacity-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono font-bold text-amber-400">FASE 0{idx + 1}</span>
                  {isDone ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : isCurrent ? (
                    <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                  ) : null}
                </div>
                <p className="text-xs font-semibold text-slate-200">{step.substring(3)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
