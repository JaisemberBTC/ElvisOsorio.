import jesusBlessingImg from '../assets/images/jesus_divine_blessing_1787716123982.jpg';
import jesusPeaceImg from '../assets/images/jesus_peace_in_storm_1787716138284.jpg';
import jesusHealingImg from '../assets/images/jesus_healing_light_1787716152719.jpg';
import jesusNightImg from '../assets/images/jesus_night_sanctuary_1787716164249.jpg';
import jesusShepherdImg from '../assets/images/jesus_shepherd_love_1787717500827.jpg';
import jesusPrayerImg from '../assets/images/jesus_sacred_prayer_1787717512349.jpg';
import jesusTeachingImg from '../assets/images/jesus_teaching_wisdom_1787717523974.jpg';
import jesusResurrectedImg from '../assets/images/jesus_resurrected_king_1787717534726.jpg';

export interface JesusArtwork {
  id: string;
  name: string;
  category: 'blessing' | 'peace' | 'healing' | 'night' | 'shepherd' | 'prayer' | 'teaching' | 'glory';
  src: string;
  lightAuraColor: string;
  atmosphere: string;
  expression: string;
  narrativeRole: 'intro' | 'comfort' | 'word' | 'climax' | 'prayer' | 'blessing';
  themeRole?: string;
}

export const JESUS_ARTWORKS: JesusArtwork[] = [
  {
    id: 'jesus-blessing',
    name: 'Jesús Extendiendo Manos de Bendición',
    category: 'blessing',
    src: jesusBlessingImg,
    lightAuraColor: 'rgba(245, 158, 11, 0.45)',
    atmosphere: 'Rayos dorados de gloria y majestad paternal',
    expression: 'Manos extendidas confiriendo paz sobre tu vida',
    narrativeRole: 'blessing'
  },
  {
    id: 'jesus-peace',
    name: 'Jesús Trayendo Paz en la Tormenta',
    category: 'peace',
    src: jesusPeaceImg,
    lightAuraColor: 'rgba(56, 189, 248, 0.45)',
    atmosphere: 'Manto celestial y calma sobrenatural en medio de la prueba',
    expression: 'Mirada serena disipando todo temor y ansiedad',
    narrativeRole: 'comfort'
  },
  {
    id: 'jesus-shepherd',
    name: 'El Buen Pastor Cuidando de Ti',
    category: 'shepherd',
    src: jesusShepherdImg,
    lightAuraColor: 'rgba(251, 191, 36, 0.4)',
    atmosphere: 'Prados de reposo bajo el resplandor cálido del atardecer',
    expression: 'Amor incondicional y protección constante',
    narrativeRole: 'intro'
  },
  {
    id: 'jesus-teaching',
    name: 'Jesús Revelando Sabiduría y Verdad',
    category: 'teaching',
    src: jesusTeachingImg,
    lightAuraColor: 'rgba(234, 179, 8, 0.45)',
    atmosphere: 'Palabras de vida eterna y autoridad celestial',
    expression: 'Hablando directamente a tu corazón con discernimiento',
    narrativeRole: 'word'
  },
  {
    id: 'jesus-healing',
    name: 'Jesús Sanador con Luz de Restauración',
    category: 'healing',
    src: jesusHealingImg,
    lightAuraColor: 'rgba(251, 191, 36, 0.5)',
    atmosphere: 'Luz radiante de sanidad física y renovación espiritual',
    expression: 'Compasión infinita que sana toda herida',
    narrativeRole: 'comfort'
  },
  {
    id: 'jesus-prayer',
    name: 'Jesús en Oración e Intercesión Santa',
    category: 'prayer',
    src: jesusPrayerImg,
    lightAuraColor: 'rgba(147, 51, 234, 0.4)',
    atmosphere: 'Comunión íntima y fuego del Espíritu Santo',
    expression: 'Intercediendo activamente ante el Padre por ti',
    narrativeRole: 'prayer'
  },
  {
    id: 'jesus-glory',
    name: 'Cristo Resucitado en Majestad Triumfante',
    category: 'glory',
    src: jesusResurrectedImg,
    lightAuraColor: 'rgba(255, 255, 255, 0.6)',
    atmosphere: 'Victoria total, luz inextinguible y esperanza eterna',
    expression: 'Rey de reyes trayendo redención y gozo celestial',
    narrativeRole: 'climax'
  },
  {
    id: 'jesus-night',
    name: 'Jesús Guardando tu Noche y Descanso',
    category: 'night',
    src: jesusNightImg,
    lightAuraColor: 'rgba(168, 85, 247, 0.35)',
    atmosphere: 'Paz nocturna celestial y descanso dulce bajo Sus alas',
    expression: 'Guardián fiel de tus sueños y de tu hogar',
    narrativeRole: 'blessing'
  }
];

/**
 * Returns an intelligent ordered sequence of distinct Jesus artworks for a multi-scene video.
 * Ensures that each scene has a unique, narratively matching depiction of Jesus.
 */
export function getSequenceOfJesusArtworks(sceneCount: number, videoTheme?: string): JesusArtwork[] {
  const theme = (videoTheme || '').toLowerCase();
  
  // Custom narrative storylines based on the theme
  let orderedPool: JesusArtwork[] = [];

  if (theme.includes('sanidad') || theme.includes('salud') || theme.includes('enfermedad')) {
    orderedPool = [
      JESUS_ARTWORKS.find(a => a.id === 'jesus-shepherd')!,
      JESUS_ARTWORKS.find(a => a.id === 'jesus-healing')!,
      JESUS_ARTWORKS.find(a => a.id === 'jesus-prayer')!,
      JESUS_ARTWORKS.find(a => a.id === 'jesus-glory')!,
      JESUS_ARTWORKS.find(a => a.id === 'jesus-blessing')!
    ];
  } else if (theme.includes('paz') || theme.includes('ansiedad') || theme.includes('miedo') || theme.includes('tormenta')) {
    orderedPool = [
      JESUS_ARTWORKS.find(a => a.id === 'jesus-peace')!,
      JESUS_ARTWORKS.find(a => a.id === 'jesus-teaching')!,
      JESUS_ARTWORKS.find(a => a.id === 'jesus-prayer')!,
      JESUS_ARTWORKS.find(a => a.id === 'jesus-shepherd')!,
      JESUS_ARTWORKS.find(a => a.id === 'jesus-blessing')!
    ];
  } else if (theme.includes('noche') || theme.includes('dormir') || theme.includes('descanso')) {
    orderedPool = [
      JESUS_ARTWORKS.find(a => a.id === 'jesus-peace')!,
      JESUS_ARTWORKS.find(a => a.id === 'jesus-shepherd')!,
      JESUS_ARTWORKS.find(a => a.id === 'jesus-night')!,
      JESUS_ARTWORKS.find(a => a.id === 'jesus-prayer')!,
      JESUS_ARTWORKS.find(a => a.id === 'jesus-blessing')!
    ];
  } else {
    // Default progressive narrative journey:
    // Scene 1: Good Shepherd / Invitation
    // Scene 2: Peace / Teaching
    // Scene 3: Healing / Prayer
    // Scene 4: Resurrected Glory
    // Scene 5+: Divine Final Blessing
    orderedPool = [
      JESUS_ARTWORKS.find(a => a.id === 'jesus-shepherd')!,
      JESUS_ARTWORKS.find(a => a.id === 'jesus-peace')!,
      JESUS_ARTWORKS.find(a => a.id === 'jesus-teaching')!,
      JESUS_ARTWORKS.find(a => a.id === 'jesus-healing')!,
      JESUS_ARTWORKS.find(a => a.id === 'jesus-prayer')!,
      JESUS_ARTWORKS.find(a => a.id === 'jesus-glory')!,
      JESUS_ARTWORKS.find(a => a.id === 'jesus-blessing')!,
      JESUS_ARTWORKS.find(a => a.id === 'jesus-night')!
    ].filter(Boolean) as JesusArtwork[];
  }

  // Ensure exact sequence length matching sceneCount without repeating back-to-back
  const result: JesusArtwork[] = [];
  for (let i = 0; i < sceneCount; i++) {
    result.push(orderedPool[i % orderedPool.length]);
  }
  return result;
}
