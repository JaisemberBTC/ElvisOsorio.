export interface StoryboardScene {
  sceneNumber: number;
  durationSec: number;
  visualPrompt: string;
  cameraMovement: string;
  narrationText: string;
  onScreenText: string;
  audioTone?: string;
  atmosphere?: string;
  imageUrl?: string;
}

export type SceneScript = StoryboardScene;

export interface FaithScriptData {
  title: string;
  hook: string;
  mainTheme: string;
  primaryBibleVerse: {
    reference: string;
    text: string;
  };
  closingPrayer: string;
  callToAction: string;
  musicMood: string;
  scenes: StoryboardScene[];
  socialMetadata: {
    hashtags: string[];
    caption: string;
    pinnedComment: string;
  };
}

export interface PrayerData {
  title: string;
  scriptureAnchor: {
    verse: string;
    text: string;
    application: string;
  };
  prayerBody: {
    invocation: string;
    surrender: string;
    proclamation: string;
    gratitudeAndAmen: string;
  };
  fullText: string;
  dailyAffirmation: string;
  meditationPrompt: string;
  category?: string;
  createdDate?: string;
}

export interface PrayerCandle {
  id: string;
  personName: string;
  intention: string;
  category: 'sanidad' | 'familia' | 'finanzas' | 'paz' | 'perdon' | 'matrimonio' | 'general';
  litAt: string;
  amenCount: number;
  userAmened?: boolean;
}

export interface DailyDevotional {
  date: string;
  devotionalTitle: string;
  verseReference: string;
  verseText: string;
  biblicalContext: string;
  reflectionText: string;
  keyTakeaways: string[];
  guidedPrayer: string;
  thoughtOfTheDay: string;
  lastUpdated?: string;
}

export interface DevotionalSongVerse {
  section: string;
  lyrics: string;
  chordsHint?: string;
}

export interface DevotionalSong {
  songTitle: string;
  musicalStyle: string;
  keyAndTempo: string;
  chordsProgression: string;
  sections: DevotionalSongVerse[];
  fullLyrics: string;
  spiritualMessage: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface BlessingCard {
  cardHeader: string;
  blessingQuote: string;
  verseReference: string;
  verseText: string;
  shortPrayer: string;
  suggestedRecipient?: string;
  suggestedOccasion?: string;
  suggestedColors: {
    gradientStart: string;
    gradientEnd: string;
    accentColor: string;
  };
  backgroundImageId?: string;
  imagePrompt?: string;
  generatedImageUrl?: string;
  themeCategory?: 'dawn' | 'jesus' | 'cross' | 'dove' | 'olive' | 'healing' | 'night' | 'peace';
}

export type ActiveTab = 'studio' | 'scene-generator' | 'veo-video' | 'social-connect' | 'sanctuary' | 'devotional' | 'flow-video' | 'counselor' | 'card-creator';

// Devotional Scene Generator Types
export interface StructuredPromptAnalysis {
  title: string;
  main_character: string;
  identity_anchors: string[];
  environment: string;
  time_of_day: string;
  visual_style: string;
  lighting: string;
  camera_style: string;
  voiceover: string;
  sound_design: string;
  duration_seconds: number;
  aspect_ratio: '9:16' | '16:9' | '1:1';
  scenes: {
    scene_number: number;
    action: string;
    camera_movement: string;
    emotion: string;
    duration_start: number;
    duration_end: number;
  }[];
}

export interface DevotionalSceneItem {
  sceneNumber: number; // 1, 2, 3, 4
  title: string;
  role: 'presentacion' | 'acercamiento' | 'accion_emocional' | 'cierre';
  durationSec: number;
  durationStart?: number;
  durationEnd?: number;
  timeRange: string; // e.g. "0:00 - 0:02" or "0:00 - 0:10"
  cameraMovement: string;
  action: string;
  emotion?: string;
  environment: string;
  composition: string;
  lighting: string;
  style: string;
  structuredPrompt: string; // The exact prompt template
  narrationSnippet: string;
  onScreenText: string;
  imageUrl?: string;
  imageId?: string;
  imageData?: string;
  modelUsed?: string;
  isVerifiedUnique?: boolean;
  fileSizeKb?: number;
  status?: 'pending' | 'generating' | 'completed' | 'error';
  errorMessage?: string;
}

export interface DevotionalVideoProductionDoc {
  videoTitle: string;
  masterCharacterDescription: string;
  identityAnchors?: string[];
  timeOfDay?: string;
  cameraStyle?: string;
  aspectRatio: '9:16' | '16:9' | '1:1';
  totalDurationSec: number;
  environmentOverview: string;
  cinematicStyleOverview: string;
  scenes: DevotionalSceneItem[];
  imageModelStatus?: {
    hasPaidKey: boolean;
    modelName: string;
    note: string;
    engineType: 'gemini' | 'neural' | 'direct';
  };
  timelineTable: {
    timeframe: string;
    sceneNumber: number;
    visualAction: string;
    cameraCut: string;
    voiceSync: string;
    audioCue: string;
  }[];
  voiceOverScript: {
    text: string;
    speakerTone: string;
    pacingNotes: string;
    isUserProvided: boolean;
  };
  audioDesign: {
    ambientAtmosphere: string;
    naturalElements: string[];
    musicRecommendation: string;
    frequencyHz: string;
    voiceMusicBalance: string;
  };
  finalAnimationVideoPrompt: string;
  structuredAnalysis?: StructuredPromptAnalysis;
  createdAt: string;
}

// Google Flow Video Pipeline Architecture Types
export type GoogleFlowNodeStatus = 'idle' | 'running' | 'completed' | 'error';

export interface GoogleFlowScriptEngine {
  title: string;
  hook: string;
  biblicalAnchor: {
    verse: string;
    text: string;
  };
  emotionalArc: string;
  closingBlessing: string;
  cta: string;
}

export interface GoogleFlowStoryboardScene {
  id: string;
  sceneNumber: number;
  durationSec: number;
  visualPrompt: string;
  cameraMovement: string;
  narrationText: string;
  onScreenText: string;
  lightingEffect?: string;
  imageUrl?: string;
}

export interface GoogleFlowVoiceSynthesizer {
  speaker: string;
  tone: string;
  ambientPad: string;
  teleprompterPhrases: string[];
}

export interface GoogleFlowExportMetadata {
  caption: string;
  hashtags: string[];
  googleDrivePackageName: string;
}

export interface GoogleFlowPipelineData {
  flowId: string;
  status: string;
  createdAt: string;
  format: '9:16' | '16:9' | '1:1';
  targetDuration: number;
  scriptEngine: GoogleFlowScriptEngine;
  cinematicPrompts: string[];
  storyboardScenes: GoogleFlowStoryboardScene[];
  voiceSynthesizer: GoogleFlowVoiceSynthesizer;
  exportMetadata: GoogleFlowExportMetadata;
}

// Block Editor Types (Notion / Medium Style)
export type BlockType = 
  | 'paragraph'
  | 'heading-1'
  | 'heading-2'
  | 'heading-3'
  | 'bullet-list'
  | 'numbered-list'
  | 'todo-list'
  | 'quote'
  | 'scripture-callout'
  | 'code'
  | 'image'
  | 'callout'
  | 'divider';

export interface BlockItem {
  id: string;
  type: BlockType;
  content: string;
  checked?: boolean; // For todo-list
  language?: string; // For code blocks (typescript, javascript, html, python, json)
  imageUrl?: string; // For image blocks
  caption?: string; // For image or quote
  calloutIcon?: string; // For callout blocks (e.g. 🕊️, 💡, ⚡)
  calloutType?: 'info' | 'verse' | 'warning' | 'prayer';
  align?: 'left' | 'center' | 'right';
  metadata?: Record<string, any>;
}

export interface BlockEditorDocument {
  id: string;
  title: string;
  updatedAt: string;
  blocks: BlockItem[];
  theme?: 'dark' | 'light';
}

export type SocialPlatform = 'youtube' | 'tiktok' | 'instagram' | 'facebook' | 'twitter' | 'whatsapp';

export interface SocialAccountProfile {
  id: string;
  platform: SocialPlatform;
  displayName: string;
  handle: string;
  avatarUrl: string;
  connectedAt: string;
  isConnected: boolean;
  followersCount?: string;
  channelId?: string;
  accountType?: 'channel' | 'creator' | 'business' | 'personal';
  accessToken?: string;
  permissions: string[];
  autoPublishEnabled?: boolean;
}

export interface SocialPostPayload {
  platforms: SocialPlatform[];
  title: string;
  description: string;
  hashtags: string[];
  videoBlobUrl?: string;
  imageBlobUrl?: string;
  scheduledAt?: string;
  bibleVerseRef?: string;
}

export interface SocialPostRecord {
  id: string;
  platform: SocialPlatform;
  title: string;
  status: 'published' | 'scheduled' | 'uploading' | 'failed';
  publishedAt?: string;
  postUrl?: string;
  viewsCount?: number;
  likesCount?: number;
  sharesCount?: number;
  commentsCount?: number;
  retentionRate?: number; // e.g. 74.5%
  hookRetentionPct?: number; // 0-3s retention
  spiritualScore?: number; // 0-100
  error?: string;
}

export interface PlatformMetricsDetail {
  platform: SocialPlatform;
  totalViews: number;
  avgRetentionRate: number;
  avgEngagementRate: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  totalSaves: number;
  followersGrowth: number;
  spiritualResonanceScore: number; // 0-100
  bestTime: string;
  retentionCurve: { second: number; retentionPct: number; stage: string }[];
}

export interface SocialCreationImprovement {
  id: string;
  suggestedTitle: string;
  suggestedHookText: string;
  voiceToneRecommended: string;
  veoVisualPrompt: string;
  cameraMovement: string;
  biblicalAnchor: string;
  recommendedDurationSec: number;
  whyThisWorksBetter: string;
  projectedRetentionPct: number;
}

export interface SocialCompetitor {
  id: string;
  name: string;
  platform: SocialPlatform;
  handle: string;
  channelUrl: string;
  avatarUrl: string;
  followers: string;
  avgViewsPerVideo: string;
  uploadFrequency: string;
  bestPerformingHook: string;
  topTheme: string;
  retentionEstimatePct: number;
  isUserAdded?: boolean;
}

export interface SocialTrendItem {
  id: string;
  hashtag: string;
  topic: string;
  category: 'oracion' | 'salmos' | 'milagros' | 'paz' | 'fe' | 'madrugada';
  estimatedViews: string;
  viralityScore: number; // 0-100
  suggestedHook: string;
  recommendedVerses: string[];
  trendType: 'hashtag' | 'audio' | 'hook' | 'theme';
  growthBadge: string;
}

export interface SocialAnalyticsReport {
  timestamp: string;
  overallHealthScore: number; // 0-100
  executiveSummary: string;
  spiritualResonanceAnalysis: string;
  retentionDiagnosis: {
    hookRating: 'Excelente' | 'Bueno' | 'Necesita Mejora';
    hookRetentionPct: number;
    bodyRetentionPct: number;
    callToActionConversionPct: number;
    diagnosisComment: string;
  };
  keyStrengths: string[];
  criticalWeaknesses: string[];
  nextCreationImprovements: SocialCreationImprovement[];
  trendingSpiritualTopics: string[];
  bestPostingSchedule: { platform: string; bestTime: string; bestDay: string; reason: string }[];
}

export type AmbientTrack = 'off' | 'harp' | 'rain' | 'bells' | 'wind' | 'sanctuary';

export type CapcutTransition = 'crossfade' | 'zoom-burst' | 'white-flash' | 'ethereal-blur' | 'light-wipe' | 'none';
export type CapcutTextAnimation = 'karaoke' | 'pop-up' | 'typewriter' | 'fade-in' | 'slide-up' | 'glow-glint';
export type CapcutVfxFilter = 'god-rays' | 'holy-vignette' | 'film-grain-35mm' | 'golden-dust' | 'divine-lens-flare' | 'none';

export interface VeoMotionConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  cameraMovement: 'parallax-3d' | 'orbital-arc' | 'crane-ascent' | 'living-breath' | 'glory-pulse' | 'anamorphic-drift';
  intensity: 'gentle' | 'cinematic' | 'dramatic';
  durationSec: number;
  aspectRatio: '9:16' | '16:9' | '1:1';
  fps: 25 | 30 | 60;
  lightingEffect: 'celestial-sun-rays' | 'ethereal-glow' | 'divine-shimmer' | 'golden-particles' | 'none';
  audioTrack: '432hz-solfeggio' | 'celestial-harp' | 'mountain-wind' | 'temple-bells' | 'none';
}

export interface VeoGeneratedClip {
  id: string;
  title: string;
  prompt: string;
  enhancedVeoPrompt: string;
  sourceImageUrl: string;
  sourceImageName: string;
  motionConfig: VeoMotionConfig;
  videoBlobUrl?: string;
  createdAt: string;
  durationSec: number;
}

// Google Ecosystem & Subscription Plan Types
export type PlanTier = 'free' | 'pro' | 'unlimited';

export interface PlanFeature {
  id: string;
  title: string;
  description: string;
  includedIn: PlanTier[];
}

export interface UserSubscription {
  tier: PlanTier;
  planName: string;
  status: 'active' | 'trial' | 'free';
  renewDate?: string;
  geminiModel: 'gemini-3.7-flash' | 'gemini-3.7-pro';
  flowPipelinesLimit: number;
  driveSyncEnabled: boolean;
  youtubeChannelsLimit: number;
  veoCinematicEnabled: boolean;
}

export interface GoogleUserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  subscription: UserSubscription;
  geminiConnected: boolean;
  googleFlowConnected: boolean;
  googleDriveConnected: boolean;
  youtubeChannelsConnected: number;
}

// Innovative Scroll-Stopping Hooks (Retention >70%)
export type HookPsychologicalCategory = 
  | 'urgencia_amor' 
  | 'oracion_silenciosa' 
  | 'confirmacion_profetica' 
  | 'rompe_ansiedad' 
  | 'proteccion_salmo91' 
  | 'sanidad_milagro' 
  | 'puertas_abiertas' 
  | 'nocturno_paz';

export interface InnovativeHookItem {
  id: string;
  category: HookPsychologicalCategory;
  categoryLabel: string;
  hookText: string;
  onScreenText: string;
  projectedScrollStopPct: number; // e.g. 78% to 94%
  psychologicalTrigger: string;
  recommendedVisual: string;
}

