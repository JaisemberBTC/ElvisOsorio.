import React, { useState } from 'react';
import { 
  User, 
  Check, 
  Sparkles, 
  X, 
  LogOut, 
  Zap, 
  HardDrive, 
  Film, 
  Video, 
  Workflow, 
  ShieldCheck, 
  Globe, 
  Layers, 
  CheckCircle2, 
  AlertCircle,
  Crown,
  ChevronRight,
  ExternalLink,
  Cpu
} from 'lucide-react';
import { 
  GoogleUserProfile, 
  PlanTier 
} from '../types';
import { 
  SUBSCRIPTION_PLANS, 
  PLAN_FEATURES, 
  setStoredPlanTier, 
  loginWithGoogle, 
  logoutFromGoogle,
  quickConnectGoogleAccount 
} from '../services/googleAccountService';
import confetti from 'canvas-confetti';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: GoogleUserProfile;
  onProfileUpdated: (profile: GoogleUserProfile) => void;
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onProfileUpdated
}) => {
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);
  const [selectedPlanTab, setSelectedPlanTab] = useState<PlanTier>(userProfile.subscription.tier);
  const [authError, setAuthError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setIsLoadingAuth(true);
    setAuthError(null);
    try {
      const profile = await loginWithGoogle();
      onProfileUpdated(profile);
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err: any) {
      console.error('Error logging in with Google:', err);
      setAuthError(err.message || 'No se pudo completar el inicio de sesión con Google');
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const handleGoogleLogout = async () => {
    setIsLoadingAuth(true);
    try {
      await logoutFromGoogle();
      onClose();
    } catch (err: any) {
      console.error('Error logging out:', err);
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const handleSelectPlan = (tier: PlanTier) => {
    setSelectedPlanTab(tier);
    const updatedSub = setStoredPlanTier(tier);
    const updatedProfile: GoogleUserProfile = {
      ...userProfile,
      subscription: updatedSub,
      youtubeChannelsConnected: updatedSub.youtubeChannelsLimit
    };
    onProfileUpdated(updatedProfile);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  const currentPlan = userProfile.subscription;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900 via-[#0a0f1d] to-slate-950 border border-indigo-500/30 rounded-3xl shadow-2xl overflow-hidden text-slate-200">
        
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Modal Header */}
        <div className="relative p-6 sm:p-7 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Google "G" Badge */}
            <div className="w-10 h-10 rounded-2xl bg-white p-2 shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center justify-center shrink-0">
              <svg className="w-full h-full" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.66-5.17 3.66-9.12z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.94H1.24v3.13C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.28c-.24-.72-.38-1.49-.38-2.28s.14-1.56.38-2.28V6.59H1.24C.45 8.16 0 9.97 0 12s.45 3.84 1.24 5.41l4.04-3.13z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.59l4.04 3.13c.95-2.84 3.6-4.97 6.72-4.97z"
                />
              </svg>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-bold text-white font-cinzel tracking-tight flex items-center gap-2">
                <span>Cuenta Google & Ecosistema AI</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Gemini 3.7 + Flow
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Acceso a funciones según tu plan, sincronización de Google Flow y canales de YouTube
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Error Message */}
          {authError && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {/* 1. GOOGLE ACCOUNT AUTHENTICATION STATUS */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                Estado de la Cuenta Google
              </span>
              {userProfile.email ? (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Sesión Iniciada con Google
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-semibold">
                  Modo Invitado
                </span>
              )}
            </div>

            {userProfile.email ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/90 border border-white/5">
                <div className="flex items-center gap-3.5">
                  {userProfile.photoURL ? (
                    <img
                      src={userProfile.photoURL}
                      alt={userProfile.displayName || 'Google User'}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-full border-2 border-amber-400 shadow-md object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-amber-500 flex items-center justify-center text-white font-bold text-lg">
                      {userProfile.displayName?.charAt(0) || 'G'}
                    </div>
                  )}

                  <div>
                    <h4 className="text-sm font-bold text-white font-cinzel">
                      {userProfile.displayName}
                    </h4>
                    <p className="text-xs text-slate-400 font-mono">
                      {userProfile.email}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-semibold">
                        Plan: {userProfile.subscription.planName}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleLogout}
                  disabled={isLoadingAuth}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 hover:text-rose-300 text-slate-300 border border-white/10 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            ) : (
              <div className="p-5 rounded-xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-950 border border-indigo-500/30 text-center space-y-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white font-cinzel">
                    Inicia sesión o Conecta tu Cuenta de Google
                  </h4>
                  <p className="text-xs text-slate-300 max-w-md mx-auto">
                    Conecta tus servicios de Google AI Studio, Google Drive y Canales de YouTube para desbloquear el potencial completo de Google Flow.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={isLoadingAuth}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs shadow-[0_0_20px_rgba(255,255,255,0.25)] flex items-center justify-center gap-2.5 transition-all transform hover:scale-[1.02] active:scale-95 cursor-pointer disabled:opacity-50"
                  >
                    {/* Google SVG */}
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.66-5.17 3.66-9.12z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.94H1.24v3.13C3.26 21.36 7.33 24 12 24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.28 14.28c-.24-.72-.38-1.49-.38-2.28s.14-1.56.38-2.28V6.59H1.24C.45 8.16 0 9.97 0 12s.45 3.84 1.24 5.41l4.04-3.13z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.59l4.04 3.13c.95-2.84 3.6-4.97 6.72-4.97z"
                      />
                    </svg>
                    <span>{isLoadingAuth ? 'Conectando...' : 'Iniciar con Google OAuth'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const profile = quickConnectGoogleAccount('pachimaria1013@gmail.com', 'María Pachi');
                      onProfileUpdated(profile);
                      confetti({
                        particleCount: 50,
                        spread: 60,
                        origin: { y: 0.6 }
                      });
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-inner"
                  >
                    <Crown className="w-3.5 h-3.5 text-amber-400" />
                    <span>Vincular Cuenta Creador (pachimaria1013)</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 2. GOOGLE ECOSYSTEM SERVICES RADAR */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              <span>Conexiones Activas del Ecosistema Google</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-indigo-500/20 text-center space-y-1">
                <div className="text-amber-400 text-lg flex justify-center">✨</div>
                <div className="text-[11px] font-bold text-white">Gemini 3.7 Pro</div>
                <span className="text-[10px] text-emerald-400 font-semibold block">● Conectado</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-indigo-500/20 text-center space-y-1">
                <div className="text-indigo-400 text-lg flex justify-center">⚡</div>
                <div className="text-[11px] font-bold text-white">Google Flow</div>
                <span className="text-[10px] text-emerald-400 font-semibold block">● Operativo</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-indigo-500/20 text-center space-y-1">
                <div className="text-emerald-400 text-lg flex justify-center">📁</div>
                <div className="text-[11px] font-bold text-white">Google Drive</div>
                <span className="text-[10px] text-indigo-300 font-semibold block">
                  {userProfile.googleDriveConnected ? '● Sincronizado' : '○ Listo p/ conectar'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-indigo-500/20 text-center space-y-1">
                <div className="text-rose-400 text-lg flex justify-center">▶️</div>
                <div className="text-[11px] font-bold text-white">Canales YouTube</div>
                <span className="text-[10px] text-amber-300 font-semibold block">
                  Hasta {userProfile.subscription.youtubeChannelsLimit} Canales
                </span>
              </div>
            </div>
          </div>

          {/* 3. SUBSCRIPTION & PLAN SELECTION TIERS */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-2">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>Planes y Suscripción con Google</span>
              </h4>
              <span className="text-[11px] text-indigo-300 font-semibold">
                Activo: {currentPlan.planName}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              {/* PLAN 1: Semilla */}
              <button
                type="button"
                onClick={() => handleSelectPlan('free')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                  userProfile.subscription.tier === 'free'
                    ? 'bg-gradient-to-b from-slate-900 to-slate-950 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                    : 'bg-slate-950/60 hover:bg-slate-900/80 border-white/10'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-300 font-cinzel">Plan Semilla</span>
                    {userProfile.subscription.tier === 'free' && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold">
                        ACTIVO
                      </span>
                    )}
                  </div>
                  <div className="text-lg font-bold text-white mb-2">Gratuito</div>
                  <ul className="text-[11px] text-slate-400 space-y-1.5">
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-amber-400" /> Gemini 3.7 Flash
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-amber-400" /> 5 Pipelines Google Flow/día
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-amber-400" /> 1 Canal de YouTube
                    </li>
                  </ul>
                </div>

                <div className="pt-3 mt-3 border-t border-white/5 text-[10px] text-slate-400 text-center font-semibold">
                  {userProfile.subscription.tier === 'free' ? 'Plan Actual' : 'Cambiar a Básico'}
                </div>
              </button>

              {/* PLAN 2: Pro Ministerial (Featured) */}
              <button
                type="button"
                onClick={() => handleSelectPlan('pro')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                  userProfile.subscription.tier === 'pro'
                    ? 'bg-gradient-to-b from-indigo-950/80 to-slate-900 border-indigo-400 shadow-[0_0_25px_rgba(99,102,241,0.35)] scale-[1.02]'
                    : 'bg-slate-950/60 hover:bg-slate-900/80 border-indigo-500/30'
                }`}
              >
                <div className="absolute top-0 right-0 px-3 py-1 bg-gradient-to-r from-indigo-500 to-amber-500 text-slate-950 text-[9px] font-bold uppercase tracking-wider rounded-bl-xl shadow-md">
                  Recomendado
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-indigo-300 font-cinzel">Pro Ministerial</span>
                    {userProfile.subscription.tier === 'pro' && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                        ACTIVO
                      </span>
                    )}
                  </div>
                  <div className="text-lg font-bold text-white mb-2">Google AI Pro</div>
                  <ul className="text-[11px] text-slate-300 space-y-1.5">
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-indigo-400" /> Gemini 3.7 Pro + Flash Ilimitado
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-indigo-400" /> Google Flow Video Sin Límites
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-indigo-400" /> Sincronización Google Drive
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-indigo-400" /> Hasta 10 Canales YouTube
                    </li>
                  </ul>
                </div>

                <div className="pt-3 mt-3 border-t border-white/5 text-[10px] text-indigo-300 text-center font-bold">
                  {userProfile.subscription.tier === 'pro' ? 'Plan Actual' : 'Activar Plan Pro'}
                </div>
              </button>

              {/* PLAN 3: Altar Global */}
              <button
                type="button"
                onClick={() => handleSelectPlan('unlimited')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                  userProfile.subscription.tier === 'unlimited'
                    ? 'bg-gradient-to-b from-purple-950/80 to-slate-900 border-purple-400 shadow-[0_0_25px_rgba(168,85,247,0.3)]'
                    : 'bg-slate-950/60 hover:bg-slate-900/80 border-white/10'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-purple-300 font-cinzel">Altar Global</span>
                    {userProfile.subscription.tier === 'unlimited' && (
                      <span className="px-2 py-0.5 rounded-full bg-purple-400/20 text-purple-300 text-[10px] font-bold">
                        ACTIVO
                      </span>
                    )}
                  </div>
                  <div className="text-lg font-bold text-white mb-2">Cloud Enterprise</div>
                  <ul className="text-[11px] text-slate-300 space-y-1.5">
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-purple-400" /> Hasta 100 Canales YouTube
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-purple-400" /> Generación Masiva en Lote
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-purple-400" /> Soporte Dedicado Google AI
                    </li>
                  </ul>
                </div>

                <div className="pt-3 mt-3 border-t border-white/5 text-[10px] text-purple-300 text-center font-semibold">
                  {userProfile.subscription.tier === 'unlimited' ? 'Plan Actual' : 'Activar Altar Global'}
                </div>
              </button>

            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-5 sm:p-6 bg-slate-950 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Protegido por Google AI Studio & Firebase Auth</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-all cursor-pointer"
          >
            Listo
          </button>
        </div>

      </div>
    </div>
  );
};
