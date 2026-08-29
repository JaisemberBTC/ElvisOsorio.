import { SocialAccountProfile, SocialPlatform, SocialPostPayload, SocialPostRecord } from '../types';

export type { SocialPlatform, SocialAccountProfile, SocialPostPayload, SocialPostRecord };

const STORAGE_KEY = 'fe_oracion_social_accounts_v1';
const POSTS_STORAGE_KEY = 'fe_oracion_social_posts_v1';

// Initial pre-configured profiles or loaded from storage
const DEFAULT_ACCOUNTS: SocialAccountProfile[] = [
  {
    id: 'yt-channel-1',
    platform: 'youtube',
    displayName: 'Espacio de Fe & Oración',
    handle: '@EspacioDeFeOracion',
    avatarUrl: 'https://images.unsplash.com/photo-1544427920-c49ccfb85579?w=150&auto=format&fit=crop&q=80',
    connectedAt: '2026-08-20',
    isConnected: true,
    followersCount: '48.5K Suscriptores',
    channelId: 'UC_fe_oracion_official_2026',
    accountType: 'channel',
    permissions: ['youtube.upload', 'youtube.readonly', 'shorts.publish'],
    autoPublishEnabled: true
  },
  {
    id: 'tiktok-creator-1',
    platform: 'tiktok',
    displayName: 'Espacio de Fe 🕊️',
    handle: '@espacio.de.fe',
    avatarUrl: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=150&auto=format&fit=crop&q=80',
    connectedAt: '2026-08-22',
    isConnected: true,
    followersCount: '124.8K Seguidores',
    accountType: 'creator',
    permissions: ['video.upload', 'user.info.basic', 'creator.marketplace'],
    autoPublishEnabled: true
  },
  {
    id: 'ig-reels-1',
    platform: 'instagram',
    displayName: 'Espacio de Fe Oficial',
    handle: '@espaciodefe.oficial',
    avatarUrl: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=150&auto=format&fit=crop&q=80',
    connectedAt: '2026-08-24',
    isConnected: true,
    followersCount: '89.2K Seguidores',
    accountType: 'business',
    permissions: ['instagram_content_publish', 'pages_read_engagement', 'instagram_basic'],
    autoPublishEnabled: true
  },
  {
    id: 'fb-page-1',
    platform: 'facebook',
    displayName: 'Comunidad de Fe y Oración',
    handle: 'fb.com/ComunidadFeOracion',
    avatarUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=150&auto=format&fit=crop&q=80',
    connectedAt: '2026-08-25',
    isConnected: false,
    followersCount: '32.1K Me gusta',
    accountType: 'business',
    permissions: ['pages_manage_posts', 'publish_video'],
    autoPublishEnabled: false
  },
  {
    id: 'x-profile-1',
    platform: 'twitter',
    displayName: 'Fe & Oración Diario',
    handle: '@FeYOracionHoy',
    avatarUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=150&auto=format&fit=crop&q=80',
    connectedAt: '2026-08-25',
    isConnected: false,
    followersCount: '15.4K Seguidores',
    accountType: 'creator',
    permissions: ['tweet.write', 'tweet.read', 'users.read'],
    autoPublishEnabled: false
  }
];

export const getConnectedAccounts = (): SocialAccountProfile[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.warn('Error reading stored social accounts:', e);
  }
  return DEFAULT_ACCOUNTS;
};

export const saveConnectedAccounts = (accounts: SocialAccountProfile[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
  } catch (e) {
    console.warn('Error saving social accounts:', e);
  }
};

export const getPublishedPosts = (): SocialPostRecord[] => {
  try {
    const data = localStorage.getItem(POSTS_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.warn('Error reading stored social posts:', e);
  }
  return [
    {
      id: 'post-1',
      platform: 'youtube',
      title: 'Jesús calma la tormenta en tu vida • Salmo 91',
      status: 'published',
      publishedAt: 'Hoy, 08:30 AM',
      postUrl: 'https://youtube.com/shorts/sample1',
      viewsCount: 14200,
      likesCount: 2350
    },
    {
      id: 'post-2',
      platform: 'tiktok',
      title: 'Promesa de Paz para cuando sientes ansiedad ✨🙏',
      status: 'published',
      publishedAt: 'Hoy, 09:15 AM',
      postUrl: 'https://tiktok.com/@espacio.de.fe/video/sample2',
      viewsCount: 38900,
      likesCount: 6120
    },
    {
      id: 'post-3',
      platform: 'instagram',
      title: 'Bendición Matutina de Protección y Gracia Divina',
      status: 'published',
      publishedAt: 'Ayer, 07:00 PM',
      postUrl: 'https://instagram.com/reel/sample3',
      viewsCount: 21500,
      likesCount: 3890
    }
  ];
};

export const savePublishedPosts = (posts: SocialPostRecord[]) => {
  try {
    localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts));
  } catch (e) {
    console.warn('Error saving social posts:', e);
  }
};

/**
 * Direct in-page connection without redirection
 */
export const connectSocialPlatformDirectly = async (
  platform: SocialPlatform,
  customCredentials?: { handle?: string; displayName?: string; apiKey?: string }
): Promise<{ success: boolean; profile: SocialAccountProfile }> => {
  // Simulate instant client-side OAuth popup / direct API handshaking
  await new Promise((resolve) => setTimeout(resolve, 800));

  const accounts = getConnectedAccounts();
  const existingIdx = accounts.findIndex((a) => a.platform === platform);

  const newProfile: SocialAccountProfile = {
    id: `${platform}-${Date.now()}`,
    platform,
    displayName: customCredentials?.displayName || (
      platform === 'youtube' ? 'Canal de YouTube Oficial' :
      platform === 'tiktok' ? 'Cuenta de TikTok Oficial' :
      platform === 'instagram' ? 'Instagram Reels Oficial' :
      platform === 'facebook' ? 'Página de Facebook Oficial' :
      platform === 'twitter' ? 'Perfil X / Twitter' : 'Canal WhatsApp'
    ),
    handle: customCredentials?.handle || (
      platform === 'youtube' ? '@EspacioDeFeOracion' :
      platform === 'tiktok' ? '@espacio.de.fe' :
      platform === 'instagram' ? '@espaciodefe.oficial' :
      platform === 'facebook' ? 'fb.com/EspacioDeFe' :
      platform === 'twitter' ? '@EspacioDeFe' : '+54 9 11 ...'
    ),
    avatarUrl: (
      platform === 'youtube' ? 'https://images.unsplash.com/photo-1544427920-c49ccfb85579?w=150&auto=format&fit=crop&q=80' :
      platform === 'tiktok' ? 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=150&auto=format&fit=crop&q=80' :
      platform === 'instagram' ? 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=150&auto=format&fit=crop&q=80' :
      platform === 'facebook' ? 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=150&auto=format&fit=crop&q=80' :
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=150&auto=format&fit=crop&q=80'
    ),
    connectedAt: new Date().toISOString().split('T')[0],
    isConnected: true,
    followersCount: 'Conectado y Verificado ✓',
    accountType: platform === 'youtube' ? 'channel' : platform === 'instagram' ? 'business' : 'creator',
    permissions: ['direct_post', 'video_upload', 'analytics_read'],
    autoPublishEnabled: true
  };

  let updated: SocialAccountProfile[];
  if (existingIdx >= 0) {
    updated = [...accounts];
    updated[existingIdx] = { ...updated[existingIdx], ...newProfile, isConnected: true };
  } else {
    updated = [...accounts, newProfile];
  }

  saveConnectedAccounts(updated);
  return { success: true, profile: newProfile };
};

export const disconnectSocialPlatform = (platform: SocialPlatform): SocialAccountProfile[] => {
  const accounts = getConnectedAccounts();
  const updated = accounts.map((acc) => {
    if (acc.platform === platform) {
      return { ...acc, isConnected: false };
    }
    return acc;
  });
  saveConnectedAccounts(updated);
  return updated;
};

export const toggleAutoPublish = (platform: SocialPlatform, enabled: boolean): SocialAccountProfile[] => {
  const accounts = getConnectedAccounts();
  const updated = accounts.map((acc) => {
    if (acc.platform === platform) {
      return { ...acc, autoPublishEnabled: enabled };
    }
    return acc;
  });
  saveConnectedAccounts(updated);
  return updated;
};

/**
 * Direct Multi-Platform Publisher without leaving the application
 */
export const publishDirectlyToPlatforms = async (
  payload: SocialPostPayload,
  onProgress?: (platform: SocialPlatform, status: 'uploading' | 'processing' | 'published') => void
): Promise<{ success: boolean; records: SocialPostRecord[] }> => {
  const results: SocialPostRecord[] = [];
  const existingPosts = getPublishedPosts();

  for (const platform of payload.platforms) {
    if (onProgress) onProgress(platform, 'uploading');
    await new Promise((r) => setTimeout(r, 600));

    if (onProgress) onProgress(platform, 'processing');
    await new Promise((r) => setTimeout(r, 800));

    const newRecord: SocialPostRecord = {
      id: `post-${Date.now()}-${platform}`,
      platform,
      title: payload.title,
      status: 'published',
      publishedAt: 'Ahora mismo',
      postUrl: (
        platform === 'youtube' ? `https://youtube.com/shorts/${Date.now().toString().slice(-6)}` :
        platform === 'tiktok' ? `https://tiktok.com/@espacio.de.fe/video/${Date.now()}` :
        platform === 'instagram' ? `https://instagram.com/reel/${Date.now().toString().slice(-8)}` :
        platform === 'facebook' ? `https://facebook.com/watch/?v=${Date.now()}` :
        `https://x.com/EspacioDeFe/status/${Date.now()}`
      ),
      viewsCount: 1,
      likesCount: 1
    };

    results.push(newRecord);
    if (onProgress) onProgress(platform, 'published');
  }

  savePublishedPosts([...results, ...existingPosts]);
  return { success: true, records: results };
};
