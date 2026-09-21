import { User } from 'firebase/auth';
import { 
  googleSignIn, 
  logoutGoogle, 
  initAuth as initDriveAuth, 
  getAccessToken 
} from './googleDriveService';
import { 
  PlanTier, 
  UserSubscription, 
  GoogleUserProfile, 
  PlanFeature 
} from '../types';
import { syncGoogleYouTubeChannel } from './socialMediaService';

const PLAN_STORAGE_KEY = 'google_ecosystem_user_plan';
const USER_PROFILE_STORAGE_KEY = 'google_active_user_profile';

export const SUBSCRIPTION_PLANS: Record<PlanTier, UserSubscription> = {
  free: {
    tier: 'free',
    planName: 'Plan Semilla (Básico)',
    status: 'free',
    geminiModel: 'gemini-3.8-flash',
    flowPipelinesLimit: 5,
    driveSyncEnabled: true,
    youtubeChannelsLimit: 1,
    veoCinematicEnabled: true
  },
  pro: {
    tier: 'pro',
    planName: 'Plan Pro Ministerial (Ecosistema Google AI)',
    status: 'active',
    renewDate: '2026-12-31',
    geminiModel: 'gemini-3.1-pro-preview',
    flowPipelinesLimit: 9999,
    driveSyncEnabled: true,
    youtubeChannelsLimit: 10,
    veoCinematicEnabled: true
  },
  unlimited: {
    tier: 'unlimited',
    planName: 'Plan Altar Global (Google Cloud & 100 Canales)',
    status: 'active',
    renewDate: '2027-12-31',
    geminiModel: 'gemini-3.1-pro-preview',
    flowPipelinesLimit: 99999,
    driveSyncEnabled: true,
    youtubeChannelsLimit: 100,
    veoCinematicEnabled: true
  }
};

export const PLAN_FEATURES: PlanFeature[] = [
  {
    id: 'gemini_engine',
    title: 'Motor Central Gemini 3 (Google AI)',
    description: 'Acceso directo a la API de Gemini 3.8 Flash y Gemini 3.1 Pro con razonamiento teológico profundo.',
    includedIn: ['free', 'pro', 'unlimited']
  },
  {
    id: 'google_flow_video',
    title: 'Google Flow Video Studio (5 Nodos)',
    description: 'Generación completa de guión, prompts de cámara Veo 3, storyboard, teleprompter de Jesús y exportación.',
    includedIn: ['free', 'pro', 'unlimited']
  },
  {
    id: 'google_drive_sync',
    title: 'Sincronización en la Nube con Google Drive',
    description: 'Guardado directo de archivos .flow, guiones y proyectos en tu carpeta de Google Drive.',
    includedIn: ['free', 'pro', 'unlimited']
  },
  {
    id: 'youtube_channels',
    title: 'Acceso a Canales de YouTube de tu Cuenta Google',
    description: 'Vinculación de canales de marca de YouTube (1 en Free, hasta 10 en Pro, hasta 100 en Global).',
    includedIn: ['free', 'pro', 'unlimited']
  },
  {
    id: 'veo_8k_cinematic',
    title: 'Directivas Cinemáticas Veo 3 8K',
    description: 'Parallax 3D, lentes anamórficas 35mm f/1.4 y rayos volumétricos de luz divina.',
    includedIn: ['pro', 'unlimited']
  },
  {
    id: 'priority_pipeline',
    title: 'Procesamiento Prioritario de Alta Velocidad',
    description: 'Latencia ultrabaja en la generación de pipelines y renderizado de video.',
    includedIn: ['pro', 'unlimited']
  }
];

export const getStoredPlanTier = (): PlanTier => {
  try {
    const saved = localStorage.getItem(PLAN_STORAGE_KEY);
    if (saved === 'pro' || saved === 'unlimited' || saved === 'free') {
      return saved as PlanTier;
    }
  } catch (e) {
    console.warn('Error reading plan from localStorage', e);
  }
  return 'pro'; // Default to Pro Ministerial in Google AI Studio environment
};

export const setStoredPlanTier = (tier: PlanTier): UserSubscription => {
  try {
    localStorage.setItem(PLAN_STORAGE_KEY, tier);
    const profile = getStoredGoogleProfile();
    if (profile) {
      profile.subscription = SUBSCRIPTION_PLANS[tier];
      profile.youtubeChannelsConnected = SUBSCRIPTION_PLANS[tier].youtubeChannelsLimit;
      saveStoredGoogleProfile(profile);
    }
  } catch (e) {
    console.warn('Error saving plan to localStorage', e);
  }
  return SUBSCRIPTION_PLANS[tier];
};

export const getStoredGoogleProfile = (): GoogleUserProfile | null => {
  try {
    const saved = localStorage.getItem(USER_PROFILE_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object') {
        const currentTier = getStoredPlanTier();
        parsed.subscription = SUBSCRIPTION_PLANS[currentTier];
        return parsed as GoogleUserProfile;
      }
    }
  } catch (e) {
    console.warn('Error reading stored google profile:', e);
  }
  return null;
};

export const saveStoredGoogleProfile = (profile: GoogleUserProfile | null) => {
  try {
    if (profile) {
      localStorage.setItem(USER_PROFILE_STORAGE_KEY, JSON.stringify(profile));
    } else {
      localStorage.removeItem(USER_PROFILE_STORAGE_KEY);
    }
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('google-auth-updated', { detail: profile }));
    }, 0);
  } catch (e) {
    console.warn('Error saving google profile:', e);
  }
};

export const buildGoogleUserProfile = (user: User | null): GoogleUserProfile => {
  const currentTier = getStoredPlanTier();
  const subscription = SUBSCRIPTION_PLANS[currentTier];

  // If no Firebase User passed, check localStorage cache first
  if (!user) {
    const cached = getStoredGoogleProfile();
    if (cached && cached.email) {
      return {
        ...cached,
        subscription,
        geminiConnected: true,
        googleFlowConnected: true,
        googleDriveConnected: true,
        youtubeChannelsConnected: subscription.youtubeChannelsLimit
      };
    }

    return {
      uid: 'guest_user',
      email: null,
      displayName: 'Espacio de Fe Oficial',
      photoURL: null,
      subscription,
      geminiConnected: true,
      googleFlowConnected: true,
      googleDriveConnected: false,
      youtubeChannelsConnected: subscription.youtubeChannelsLimit
    };
  }

  const profile: GoogleUserProfile = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || user.email?.split('@')[0] || 'Usuario Google',
    photoURL: user.photoURL,
    subscription,
    geminiConnected: true,
    googleFlowConnected: true,
    googleDriveConnected: true,
    youtubeChannelsConnected: subscription.youtubeChannelsLimit
  };

  saveStoredGoogleProfile(profile);
  return profile;
};

export const subscribeToGoogleAuth = (
  callback: (profile: GoogleUserProfile, rawUser: User | null) => void
) => {
  // 1. Check if we have cached profile
  const initialProfile = buildGoogleUserProfile(null);
  callback(initialProfile, null);

  // 2. Custom broadcast listener
  const handleAuthUpdated = (e: any) => {
    const p = e?.detail || buildGoogleUserProfile(null);
    callback(p, null);
  };
  window.addEventListener('google-auth-updated', handleAuthUpdated);
  window.addEventListener('storage', handleAuthUpdated);

  // 3. Firebase Auth listener
  const unsubDrive = initDriveAuth(
    (user: User) => {
      const profile = buildGoogleUserProfile(user);
      syncGoogleYouTubeChannel(profile);
      saveStoredGoogleProfile(profile);
      callback(profile, user);
    },
    () => {
      const cached = getStoredGoogleProfile();
      if (cached && cached.email) {
        callback(cached, null);
      } else {
        const profile = buildGoogleUserProfile(null);
        callback(profile, null);
      }
    }
  );

  return () => {
    window.removeEventListener('google-auth-updated', handleAuthUpdated);
    window.removeEventListener('storage', handleAuthUpdated);
    unsubDrive();
  };
};

export const loginWithGoogle = async (): Promise<GoogleUserProfile> => {
  const result = await googleSignIn();
  if (!result || !result.user) {
    throw new Error('No se pudo autenticar con la cuenta de Google');
  }
  const profile = buildGoogleUserProfile(result.user);
  syncGoogleYouTubeChannel(profile);
  saveStoredGoogleProfile(profile);
  return profile;
};

/**
 * Direct Creator Quick Authentication with Google Account & Full Ecosystem Sync
 */
export const quickConnectGoogleAccount = (
  email = 'pachimaria1013@gmail.com',
  displayName = 'María Pachi'
): GoogleUserProfile => {
  const currentTier = getStoredPlanTier();
  const subscription = SUBSCRIPTION_PLANS[currentTier];

  const profile: GoogleUserProfile = {
    uid: `google_${Date.now()}`,
    email: email.trim(),
    displayName: displayName.trim() || email.split('@')[0],
    photoURL: '/sacred-assets/celestial-sunrise.jpg',
    subscription,
    geminiConnected: true,
    googleFlowConnected: true,
    googleDriveConnected: true,
    youtubeChannelsConnected: subscription.youtubeChannelsLimit
  };

  saveStoredGoogleProfile(profile);
  syncGoogleYouTubeChannel(profile);
  return profile;
};

export const logoutFromGoogle = async () => {
  try {
    await logoutGoogle();
  } catch (e) {
    console.warn('Firebase logout error:', e);
  }
  saveStoredGoogleProfile(null);
  const guestProfile = buildGoogleUserProfile(null);
  syncGoogleYouTubeChannel(guestProfile);
};
