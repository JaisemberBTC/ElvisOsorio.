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

export type ActiveTab = 'studio' | 'veo-video' | 'social-connect' | 'sanctuary' | 'devotional' | 'counselor' | 'card-creator';

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
  error?: string;
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
