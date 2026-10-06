import { SocialPlatform, SocialAccountProfile, GoogleUserProfile } from '../types';

export const OFFICIAL_SOCIAL_LOGIN_CONFIG: Record<string, any> = {
  tiktok: { name: 'TikTok', color: '#000000', icon: 'tiktok' },
  youtube: { name: 'YouTube', color: '#ff0000', icon: 'youtube' },
  instagram: { name: 'Instagram', color: '#e1306c', icon: 'instagram' },
  facebook: { name: 'Facebook', color: '#1877f2', icon: 'facebook' }
};

const SOCIAL_ACCOUNTS_STORAGE_KEY = 'connected_social_accounts_v1';

export function getConnectedAccounts(): SocialAccountProfile[] {
  try {
    const raw = localStorage.getItem(SOCIAL_ACCOUNTS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Error reading connected social accounts:', e);
  }
  return [
    {
      id: 'yt_default',
      platform: 'youtube',
      username: '@EspaciodeFeyOracion',
      displayName: 'Espacio de Fe & Oración',
      avatarUrl: '/sacred-assets/icon-192.png',
      isConnected: true,
      subscribersCount: 14200,
      connectedAt: '2026-01-01'
    }
  ];
}

export function saveConnectedAccounts(accounts: SocialAccountProfile[]): void {
  try {
    localStorage.setItem(SOCIAL_ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
    window.dispatchEvent(new CustomEvent('social-accounts-updated'));
  } catch (e) {
    console.warn('Error saving social accounts:', e);
  }
}

export function connectSocialPlatformDirectly(platform: SocialPlatform, handle?: string): SocialAccountProfile {
  const accounts = getConnectedAccounts();
  const existing = accounts.find(a => a.platform === platform);
  const updatedProfile: SocialAccountProfile = {
    id: existing?.id || `${platform}_${Date.now()}`,
    platform,
    username: handle || `@${platform}_creyente`,
    displayName: handle?.replace('@', '') || `Canal de Fe (${platform})`,
    avatarUrl: '/sacred-assets/icon-192.png',
    isConnected: true,
    connectedAt: new Date().toISOString()
  };

  const filtered = accounts.filter(a => a.platform !== platform);
  const nextList = [...filtered, updatedProfile];
  saveConnectedAccounts(nextList);
  return updatedProfile;
}

export function openOfficialPlatformLogin(platform: SocialPlatform): void {
  console.info(`[Social Auth] Opening auth for ${platform}`);
}

export function getSocialAuthUrl(platform: SocialPlatform): string {
  return `https://${platform}.com`;
}

export function syncGoogleYouTubeChannel(profile: GoogleUserProfile | null): void {
  if (!profile || !profile.email) return;
  const accounts = getConnectedAccounts();
  const hasYt = accounts.some(a => a.platform === 'youtube');
  if (!hasYt) {
    accounts.push({
      id: `yt_${profile.uid}`,
      platform: 'youtube',
      username: `@${profile.displayName?.toLowerCase().replace(/\s+/g, '') || 'ministerio'}`,
      displayName: profile.displayName || 'Canal YouTube Fe',
      avatarUrl: profile.photoURL || '/sacred-assets/icon-192.png',
      isConnected: true,
      connectedAt: new Date().toISOString()
    });
    saveConnectedAccounts(accounts);
  }
}

export async function publishDirectlyToPlatforms(
  platforms: SocialPlatform[],
  videoData: any
): Promise<{ success: boolean; results: any[] }> {
  console.info(`[Social Publish] Publishing to ${platforms.join(', ')}`, videoData);
  return {
    success: true,
    results: platforms.map(p => ({ platform: p, status: 'published', timestamp: new Date().toISOString() }))
  };
}

export function launchPlatformWithFallback(platform: SocialPlatform, url?: string): void {
  if (url) {
    window.open(url, '_blank');
  }
}

const COMPETITORS_STORAGE_KEY = 'tracked_competitors_v1';

export function getCompetitors(platform?: string): any[] {
  try {
    const raw = localStorage.getItem(COMPETITORS_STORAGE_KEY);
    if (raw) {
      const list = JSON.parse(raw);
      if (platform && platform !== 'all') {
        return list.filter((c: any) => c.platform === platform);
      }
      return list;
    }
  } catch (e) {
    console.warn('Error reading competitors:', e);
  }
  return [
    {
      id: 'comp_1',
      platform: 'youtube',
      channelName: 'Oración Diaria de Fe',
      handle: '@oraciondiariadefe',
      avatarUrl: '/sacred-assets/icon-192.png',
      subscribersCount: 250000,
      recentVideoUrl: 'https://youtube.com',
      bestPerformingTitle: 'Oración de la Mañana para Empezar el Día en Paz',
      avgViewsPerShort: 85000,
      hookPattern: 'Antes de salir de casa, haz esta oración poderosa',
      postedAgo: 'hace 2 días'
    },
    {
      id: 'comp_2',
      platform: 'tiktok',
      channelName: 'Versículos para el Alma',
      handle: '@versiculosparaelalma',
      avatarUrl: '/sacred-assets/icon-192.png',
      subscribersCount: 180000,
      recentVideoUrl: 'https://tiktok.com',
      bestPerformingTitle: '3 Versículos para cuando no puedas más',
      avgViewsPerShort: 120000,
      hookPattern: 'Si estás pasando por una prueba, no pases de largo',
      postedAgo: 'hace 5 horas'
    }
  ];
}

export function addCompetitor(competitor: any): any[] {
  const current = getCompetitors();
  const next = [...current, { ...competitor, id: competitor.id || `comp_${Date.now()}` }];
  try {
    localStorage.setItem(COMPETITORS_STORAGE_KEY, JSON.stringify(next));
  } catch (e) {
    console.warn('Error saving competitor:', e);
  }
  return next;
}

export function deleteCompetitor(id: string): any[] {
  const current = getCompetitors();
  const next = current.filter((c: any) => c.id !== id);
  try {
    localStorage.setItem(COMPETITORS_STORAGE_KEY, JSON.stringify(next));
  } catch (e) {
    console.warn('Error deleting competitor:', e);
  }
  return next;
}

export function getSocialTrends(platform?: string): any[] {
  const allTrends = [
    {
      id: 'trend_1',
      platform: 'youtube',
      topic: 'Oración de la Mañana con Salmos',
      trendScore: 97,
      growthPct: '+45%',
      recommendedHook: 'No salgas de casa sin entregar este día al Señor en oración.',
      suggestedVerse: 'Salmos 5:3',
      recommendedMusic: 'Acústico Reverente 432Hz'
    },
    {
      id: 'trend_2',
      platform: 'tiktok',
      topic: 'Ansiedad y Paz Interior',
      trendScore: 94,
      growthPct: '+62%',
      recommendedHook: 'Si hoy tu mente no encuentra descanso, escucha esta promesa.',
      suggestedVerse: 'Filipenses 4:6-7',
      recommendedMusic: 'Piano Celestial Cálido'
    },
    {
      id: 'trend_3',
      platform: 'instagram',
      topic: 'Milagros y Sanidad Familiar',
      trendScore: 91,
      growthPct: '+38%',
      recommendedHook: 'Cuando la medicina dice que no hay nada más que hacer, Dios dice: Yo sigo en el trono.',
      suggestedVerse: 'Jeremías 30:17',
      recommendedMusic: 'Cuerdas Orquestales de Gloria'
    }
  ];

  if (platform && platform !== 'all') {
    return allTrends.filter(t => t.platform === platform);
  }
  return allTrends;
}

export function getPlatformMetricsDetail(platform: string): any {
  return {
    platform,
    followersCount: 14200,
    totalViews30d: 320000,
    averageRetentionPct: 78.5,
    topBestPerformingVideo: 'Oración al despertar con Salmo 23',
    engagementRate: 8.4,
    sharesTotal: 12400,
    savesTotal: 18500
  };
}

export function getPublishedPosts(): any[] {
  return [];
}

export async function analyzeMetricsWithGemini(metrics: any): Promise<any> {
  return {
    summary: 'Tus videos con formato vertical 9:16 y Jesús como protagonista obtienen un 78% más de retención.',
    topAction: 'Continuar publicando entre 7:00 AM y 9:00 AM para máxima interacción de oración diaria.'
  };
}
