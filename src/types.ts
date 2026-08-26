export interface StoryboardScene {
  sceneNumber: number;
  durationSec: number;
  visualPrompt: string;
  cameraMovement: string;
  narrationText: string;
  onScreenText: string;
  atmosphere?: string;
  imageUrl?: string;
}

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
}

export type ActiveTab = 'studio' | 'sanctuary' | 'devotional' | 'counselor' | 'card-creator';

export type AmbientTrack = 'off' | 'harp' | 'rain' | 'bells' | 'wind' | 'sanctuary';
