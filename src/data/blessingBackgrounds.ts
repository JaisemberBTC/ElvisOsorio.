import sunriseImg from '../assets/images/celestial_sunrise_dawn_1787717221920.jpg';
import oliveImg from '../assets/images/olive_garden_peace_1787717233225.jpg';
import crossImg from '../assets/images/cross_sunrise_hope_1787717245799.jpg';
import doveImg from '../assets/images/heavenly_dove_light_1787717258852.jpg';
import jesusBlessingImg from '../assets/images/jesus_divine_blessing_1787716123982.jpg';
import jesusPeaceImg from '../assets/images/jesus_peace_in_storm_1787716138284.jpg';
import jesusHealingImg from '../assets/images/jesus_healing_light_1787716152719.jpg';
import jesusNightImg from '../assets/images/jesus_night_sanctuary_1787716164249.jpg';

export interface BlessingBackground {
  id: string;
  name: string;
  category: 'dawn' | 'jesus' | 'cross' | 'dove' | 'olive' | 'healing' | 'night' | 'peace';
  src: string;
  description: string;
  accentColor: string;
  overlayGradient: string;
  keywords: string[];
}

export const BLESSING_BACKGROUNDS: BlessingBackground[] = [
  {
    id: 'celestial-sunrise',
    name: 'Amanecer Celestial & Nuevas Misericordias',
    category: 'dawn',
    src: sunriseImg,
    description: 'Rayos dorados de la mañana sobre aguas de reposo y montañas de paz',
    accentColor: '#f59e0b',
    overlayGradient: 'linear-gradient(180deg, rgba(2, 6, 23, 0.45) 0%, rgba(2, 6, 23, 0.75) 60%, rgba(2, 6, 23, 0.92) 100%)',
    keywords: ['mañana', 'amanecer', 'día', 'nuevo', 'despertar', 'luz', 'misericordia', 'sol', 'comienzo']
  },
  {
    id: 'jesus-blessing-arms',
    name: 'Jesús Extendiendo Bendición y Gracia',
    category: 'jesus',
    src: jesusBlessingImg,
    description: 'La presencia de Cristo con manto de gloria y manos abiertas de bendición',
    accentColor: '#fbbf24',
    overlayGradient: 'linear-gradient(180deg, rgba(15, 23, 42, 0.4) 0%, rgba(15, 23, 42, 0.72) 55%, rgba(2, 6, 23, 0.92) 100%)',
    keywords: ['jesus', 'cristo', 'bendicion', 'manos', 'salvador', 'hijo', 'gracia', 'presencia', 'maestro']
  },
  {
    id: 'heavenly-dove',
    name: 'Paloma de la Paz & Espíritu Santo',
    category: 'dove',
    src: doveImg,
    description: 'Paloma radiante surcando cielos dorados con luz divina y serenidad',
    accentColor: '#38bdf8',
    overlayGradient: 'linear-gradient(180deg, rgba(12, 74, 110, 0.35) 0%, rgba(15, 23, 42, 0.75) 55%, rgba(2, 6, 23, 0.92) 100%)',
    keywords: ['espiritu', 'paloma', 'paz', 'consuelo', 'sanidad', 'amor', 'tranquilidad', 'alma', 'viento']
  },
  {
    id: 'cross-sunrise',
    name: 'Cruz de Victoria y Esperanza Eterna',
    category: 'cross',
    src: crossImg,
    description: 'La cruz santa en la colina al romper el alba con resplandor dorado',
    accentColor: '#f43f5e',
    overlayGradient: 'linear-gradient(180deg, rgba(88, 28, 135, 0.35) 0%, rgba(15, 23, 42, 0.78) 55%, rgba(2, 6, 23, 0.94) 100%)',
    keywords: ['cruz', 'victoria', 'fe', 'esperanza', 'salvacion', 'sangre', 'redencion', 'fortaleza']
  },
  {
    id: 'olive-garden',
    name: 'Jardín de Olivos & Sabiduría de Dios',
    category: 'olive',
    src: oliveImg,
    description: 'Jardín sagrado con cálidos rayos filtrados entre hojas de olivo y vida',
    accentColor: '#34d399',
    overlayGradient: 'linear-gradient(180deg, rgba(6, 78, 59, 0.35) 0%, rgba(15, 23, 42, 0.75) 55%, rgba(2, 6, 23, 0.92) 100%)',
    keywords: ['olivo', 'arbol', 'fruto', 'vida', 'sabiduria', 'prosperidad', 'trabajo', 'familia', 'hogar']
  },
  {
    id: 'jesus-healing',
    name: 'Jesús Sanador & Fortaleza en la Prueba',
    category: 'healing',
    src: jesusHealingImg,
    description: 'Cristo emitiendo rayos de compasión, sanidad y restauración interior',
    accentColor: '#f59e0b',
    overlayGradient: 'linear-gradient(180deg, rgba(120, 53, 15, 0.35) 0%, rgba(15, 23, 42, 0.78) 55%, rgba(2, 6, 23, 0.94) 100%)',
    keywords: ['sanidad', 'enfermedad', 'medico', 'dolor', 'fortaleza', 'restauracion', 'milagro', 'cuerpo']
  },
  {
    id: 'jesus-peace-storm',
    name: 'Paz Sobrenatural en la Tempestad',
    category: 'peace',
    src: jesusPeaceImg,
    description: 'Jesús calmando las aguas y guardando tu corazón de toda ansiedad',
    accentColor: '#60a5fa',
    overlayGradient: 'linear-gradient(180deg, rgba(30, 58, 138, 0.4) 0%, rgba(15, 23, 42, 0.78) 55%, rgba(2, 6, 23, 0.94) 100%)',
    keywords: ['tormenta', 'tempestad', 'mar', 'olas', 'miedo', 'temor', 'ansiedad', 'calma', 'refugio']
  },
  {
    id: 'jesus-night-sanctuary',
    name: 'Amparo Nocturno & Dulce Sueño',
    category: 'night',
    src: jesusNightImg,
    description: 'Noche serena y estrellada bajo la cobertura y protección divina',
    accentColor: '#c084fc',
    overlayGradient: 'linear-gradient(180deg, rgba(76, 29, 149, 0.35) 0%, rgba(15, 23, 42, 0.8) 55%, rgba(2, 6, 23, 0.95) 100%)',
    keywords: ['noche', 'dormir', 'descanso', 'sueño', 'estrellas', 'cama', 'oscuridad', 'guardar', 'salmo 91']
  }
];

/**
 * Automatically chooses the best thematic background based on message text, occasion, and verse
 */
export function findBestMatchingBackground(text: string, occasion?: string): BlessingBackground {
  const query = `${text} ${occasion || ''}`.toLowerCase();
  
  for (const bg of BLESSING_BACKGROUNDS) {
    if (bg.keywords.some((k) => query.includes(k))) {
      return bg;
    }
  }

  // Default to celestial sunrise for general blessings
  return BLESSING_BACKGROUNDS[0];
}
