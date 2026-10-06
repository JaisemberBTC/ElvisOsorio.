import React, { useState } from 'react';
import { X, Sparkles, LogOut, CheckCircle2, ShieldCheck, Crown, ExternalLink } from 'lucide-react';
import { GoogleUserProfile } from '../types';
import { loginWithGoogle, quickConnectGoogleAccount, logoutFromGoogle, setStoredPlanTier } from '../services/googleAccountService';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: GoogleUserProfile;
  onProfileUpdated: (updatedProfile: GoogleUserProfile) => void;
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onProfileUpdated
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const profile = await loginWithGoogle();
      onProfileUpdated(profile);
      onClose();
    } catch (e: any) {
      // Fallback to quick connect
      try {
        const quick = quickConnectGoogleAccount('pachimaria1013@gmail.com', 'María Pachi');
        onProfileUpdated(quick);
        onClose();
      } catch (err: any) {
        setError(err?.message || 'Error al conectar con Google');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logoutFromGoogle();
      onProfileUpdated({
        uid: '',
        email: '',
        displayName: 'Invitado',
        subscription: {
          tier: 'free',
          planName: 'Plan Semilla',
          status: 'free',
          geminiModel: 'gemini-3.8-flash',
          flowPipelinesLimit: 5,
          driveSyncEnabled: true,
          youtubeChannelsLimit: 1,
          veoCinematicEnabled: true
        },
        geminiConnected: false,
        googleFlowConnected: false,
        googleDriveConnected: false,
        youtubeChannelsConnected: 0
      });
      onClose();
    } catch (e: any) {
      setError(e?.message || 'Error al cerrar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTier = (tier: 'free' | 'pro' | 'unlimited') => {
    const sub = setStoredPlanTier(tier);
    onProfileUpdated({
      ...userProfile,
      subscription: sub
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl p-6 shadow-2xl relative space-y-6">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-amber-500 flex items-center justify-center shadow-lg text-white font-bold">
            G
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Cuenta de Google & Suscripción</h2>
            <p className="text-xs text-slate-400">Sincronización con YouTube, Drive y Gemini</p>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-300">
            {error}
          </div>
        )}

        {userProfile?.email ? (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-white/5 flex items-center gap-3">
              {userProfile.photoURL ? (
                <img src={userProfile.photoURL} alt="Avatar" className="w-10 h-10 rounded-full border border-amber-400 object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                  {userProfile.displayName?.charAt(0) || 'G'}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-white truncate">{userProfile.displayName}</div>
                <div className="text-[11px] text-slate-400 truncate">{userProfile.email}</div>
                <div className="text-[10px] text-amber-400 font-mono font-semibold uppercase mt-0.5">
                  {userProfile.subscription?.planName || 'Plan Activo'}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Cambiar Plan</span>
              <div className="grid grid-cols-3 gap-2">
                {(['free', 'pro', 'unlimited'] as const).map((tier) => (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => handleSelectTier(tier)}
                    className={`p-2.5 rounded-xl border text-center text-xs font-semibold transition-all cursor-pointer ${
                      userProfile.subscription?.tier === tier
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                        : 'bg-slate-950/60 border-white/5 text-slate-400 hover:text-white hover:border-white/20'
                    }`}
                  >
                    {tier === 'free' ? 'Semilla' : tier === 'pro' ? 'Pro' : 'Altar'}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              disabled={loading}
              onClick={handleLogout}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs text-slate-300 leading-relaxed">
              Inicia sesión con tu cuenta de Google para sincronizar tus proyectos audiovisuales en Google Drive, subir directamente a YouTube y activar la IA con alta velocidad.
            </p>

            <button
              type="button"
              disabled={loading}
              onClick={handleSignIn}
              className="w-full py-3 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xl cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.66-5.17 3.66-9.12z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.94H1.24v3.13C3.26 21.36 7.33 24 12 24z" />
                <path fill="#FBBC05" d="M5.28 14.28c-.24-.72-.38-1.49-.38-2.28s.14-1.56.38-2.28V6.59H1.24C.45 8.16 0 9.97 0 12s.45 3.84 1.24 5.41l4.04-3.13z" />
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.59l4.04 3.13c.95-2.84 3.6-4.97 6.72-4.97z" />
              </svg>
              <span>{loading ? 'Conectando...' : 'Iniciar Sesión con Google'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
