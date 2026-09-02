import celestialDawn from '../assets/images/celestial_sunrise_dawn_1787717221920.jpg';
import crossHope from '../assets/images/cross_sunrise_hope_1787717245799.jpg';
import heavenlyDove from '../assets/images/heavenly_dove_light_1787717258852.jpg';
import jesusBlessing from '../assets/images/jesus_divine_blessing_1787716123982.jpg';
import jesusHealing from '../assets/images/jesus_healing_light_1787716152719.jpg';
import jesusNight from '../assets/images/jesus_night_sanctuary_1787716164249.jpg';
import jesusPeace from '../assets/images/jesus_peace_in_storm_1787716138284.jpg';
import jesusPrayer from '../assets/images/jesus_sacred_prayer_1787717512349.jpg';
import jesusTeaching from '../assets/images/jesus_teaching_wisdom_1787717523974.jpg';
import oliveGarden from '../assets/images/olive_garden_peace_1787717233225.jpg';

export interface JesusArtwork {
  id: string;
  title: string;
  name: string;
  imageUrl: string;
  src: string;
  category: 'blessing' | 'healing' | 'peace' | 'prayer' | 'teaching' | 'nature';
  cameraMovement: string;
  atmosphere: string;
  description: string;
}

export const JESUS_ARTWORKS: JesusArtwork[] = [
  {
    id: 'jesus-blessing-divine',
    title: 'Jesús en Bendición Soberana',
    name: 'Jesús en Bendición Soberana',
    imageUrl: jesusBlessing,
    src: jesusBlessing,
    category: 'blessing',
    cameraMovement: 'Zoom lento frontal hacia el rostro compasivo de Jesús',
    atmosphere: 'Luz dorada resplandeciente y gloria celestial',
    description: 'Jesucristo con manto glorioso y manos extendidas derramando paz sobre el creyente.'
  },
  {
    id: 'jesus-peace-storm',
    title: 'Jesús Calma la Tormenta',
    name: 'Jesús Calma la Tormenta',
    imageUrl: jesusPeace,
    src: jesusPeace,
    category: 'peace',
    cameraMovement: 'Paneo suave sobre el mar en calma con luz amaneciendo',
    atmosphere: 'Serenidad absoluta y disipación de nubes oscuras',
    description: 'Jesús de pie sobre las aguas trayendo calma sobrenatural al corazón afligido.'
  },
  {
    id: 'jesus-healing-light',
    title: 'Jesús Fuente de Sanidad',
    name: 'Jesús Fuente de Sanidad',
    imageUrl: jesusHealing,
    src: jesusHealing,
    category: 'healing',
    cameraMovement: 'Travelling suave con destellos de luz pura de milagros',
    atmosphere: 'Rayos de sanidad divina y calor restaurador',
    description: 'Manos de Cristo emitiendo luz viva de sanidad física y espiritual.'
  },
  {
    id: 'jesus-night-sanctuary',
    title: 'Santuario de Oración Nocturna',
    name: 'Santuario de Oración Nocturna',
    imageUrl: jesusNight,
    src: jesusNight,
    category: 'prayer',
    cameraMovement: 'Cámara lenta elevándose bajo un cielo estrellado',
    atmosphere: 'Paz nocturna, luna llena y sosiego para el insomnio',
    description: 'Jesús acompañando la soledad de la noche y guardando tus sueños.'
  },
  {
    id: 'jesus-sacred-prayer',
    title: 'Jesús Intercediendo en Oración',
    name: 'Jesús Intercediendo en Oración',
    imageUrl: jesusPrayer,
    src: jesusPrayer,
    category: 'prayer',
    cameraMovement: 'Acercamiento reverente con partículas doradas de incienso',
    atmosphere: 'Comunión íntima y fuego santo de intercesión',
    description: 'Cristo orando por tu familia y presentando tus peticiones ante el Padre.'
  },
  {
    id: 'jesus-teaching-wisdom',
    title: 'Jesús Maestro de Sabiduría',
    name: 'Jesús Maestro de Sabiduría',
    imageUrl: jesusTeaching,
    src: jesusTeaching,
    category: 'teaching',
    cameraMovement: 'Paneo circular suave revelando la mirada de compasión',
    atmosphere: 'Claridad divina, verdad y dirección para el camino',
    description: 'Jesús instruyendo con amor y disipando toda duda.'
  },
  {
    id: 'celestial-sunrise-dawn',
    title: 'Amanecer Celestial de Esperanza',
    name: 'Amanecer Celestial de Esperanza',
    imageUrl: celestialDawn,
    src: celestialDawn,
    category: 'nature',
    cameraMovement: 'Apertura panorámica con destellos del nuevo día',
    atmosphere: 'Nuevas misericordias cada mañana y gozo renovado',
    description: 'Luz radiante de un nuevo amanecer bajo la promesa de Dios.'
  },
  {
    id: 'heavenly-dove-light',
    title: 'Paloma Celestial de Paz',
    name: 'Paloma Celestial de Paz',
    imageUrl: heavenlyDove,
    src: heavenlyDove,
    category: 'peace',
    cameraMovement: 'Descenso suave con destellos de gloria',
    atmosphere: 'Presencia del Espíritu Santo y unción fresca',
    description: 'Paz que sobrepasa todo entendimiento descendiendo sobre tu vida.'
  },
  {
    id: 'cross-sunrise-hope',
    title: 'La Cruz del Triunfo y Victoria',
    name: 'La Cruz del Triunfo y Victoria',
    imageUrl: crossHope,
    src: crossHope,
    category: 'blessing',
    cameraMovement: 'Travelling hacia el resplandor de la cruz al amanecer',
    atmosphere: 'Victoria eterna sobre toda enfermedad y temor',
    description: 'La cruz vacía iluminada por el sol de justicia.'
  },
  {
    id: 'olive-garden-peace',
    title: 'Jardín de Paz y Descanso',
    name: 'Jardín de Paz y Descanso',
    imageUrl: oliveGarden,
    src: oliveGarden,
    category: 'nature',
    cameraMovement: 'Cámara flotante entre olivos dorados por el sol',
    atmosphere: 'Tranquilidad, sosiego y reposo junto a aguas de reposo',
    description: 'Lugar de quietud espiritual donde el alma es restaurada.'
  }
];

export function getSequenceOfJesusArtworks(count: number = 4, theme?: string): JesusArtwork[] {
  const shuffled = [...JESUS_ARTWORKS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, JESUS_ARTWORKS.length));
}
