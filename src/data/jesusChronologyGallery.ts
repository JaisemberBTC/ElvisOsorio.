import { JESUS_ARTWORKS } from './jesusVisuals';

export interface JesusSceneItem {
  id: string;
  title: string;
  era: string;
  eraLabel: string;
  cloudImageUrl?: string;
  localFallbackImage: string;
  bibleVerse: {
    reference: string;
    text: string;
  };
  jesusPresence: string;
  emotionalResonance: string;
  tags: string[];
}

const USED_SCENES_STORAGE_KEY = 'jesus_chronology_used_scene_ids_v1';

export function getUsedSceneIds(): string[] {
  try {
    const raw = localStorage.getItem(USED_SCENES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function markSceneIdAsUsed(id: string): void {
  try {
    const current = getUsedSceneIds();
    const updated = [id, ...current.filter(item => item !== id)].slice(0, 50);
    localStorage.setItem(USED_SCENES_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to mark scene as used:', e);
  }
}

// Canonical curated chronological scenes of Jesus Christ
export const JESUS_CHRONOLOGY_GALLERY: JesusSceneItem[] = [
  {
    id: 'jesus_tormenta_calmada',
    title: 'Jesús Calma la Tempestad en el Mar de Galilea',
    era: 'soberania_creacion',
    eraLabel: '🌊 Paz en la Tormenta',
    localFallbackImage: JESUS_ARTWORKS[1]?.src || JESUS_ARTWORKS[0]?.src || '',
    bibleVerse: {
      reference: 'Marcos 4:39',
      text: 'Y levantándose, reprendió al viento, y dijo al mar: Calla, enmudece. Y cesó el viento, y se hizo grande bonanza.'
    },
    jesusPresence: 'De pie sobre la barca con túnica ondeando por el viento, extendiendo Su mano soberana hacia las olas encrespadas.',
    emotionalResonance: 'Paz sobrenatural que disipa la angustia, el miedo al futuro y la desesperación.',
    tags: ['tormenta', 'mar', 'paz', 'fe', 'milagro', 'calma']
  },
  {
    id: 'jesus_bendicion_soberana',
    title: 'Jesús en Bendición y Gracia Infinita',
    era: 'milagros_sanidades',
    eraLabel: '🌿 Milagros & Sanidad',
    localFallbackImage: JESUS_ARTWORKS[0]?.src || '',
    bibleVerse: {
      reference: 'Números 6:24-25',
      text: 'Jehová te bendiga, y te guarde; Jehová haga resplandecer su rostro sobre ti, y tenga de ti misericordia.'
    },
    jesusPresence: 'Jesús en un plano medio luminoso mirando fijamente al creyente con ojos llenos de misericordia y manos extendidas derramando gracia.',
    emotionalResonance: 'Certeza inquebrantable de ser amado, cuidado y respaldado por Dios.',
    tags: ['bendicion', 'gracia', 'manos', 'luz', 'amor']
  },
  {
    id: 'jesus_sanidad_manos',
    title: 'Jesús Fuente de Sanidad Divina y Restauración',
    era: 'milagros_sanidades',
    eraLabel: '🌿 Milagros & Sanidad',
    localFallbackImage: JESUS_ARTWORKS[2]?.src || JESUS_ARTWORKS[0]?.src || '',
    bibleVerse: {
      reference: 'Jeremías 30:17',
      text: 'Mas yo haré venir sanidad para ti, y sanaré tus heridas, dice Jehová.'
    },
    jesusPresence: 'Cristo tocando con compasión infinita a quien sufre, rayos dorados de sanidad emanando de Su presencia viva.',
    emotionalResonance: 'Alivio instantáneo del dolor físico, mental y espiritual.',
    tags: ['sanidad', 'salud', 'milagro', 'restauracion', 'manos']
  },
  {
    id: 'jesus_oracion_getsemani',
    title: 'Jesús en Oración Profunda en Getsemaní',
    era: 'pasion_getsemani',
    eraLabel: '🫒 Getsemaní & Amor Fiel',
    localFallbackImage: JESUS_ARTWORKS[3]?.src || JESUS_ARTWORKS[0]?.src || '',
    bibleVerse: {
      reference: 'Lucas 22:42',
      text: 'Padre, si quieres, pasa de mí esta copa; pero no se haga mi voluntad, sino la tuya.'
    },
    jesusPresence: 'De rodillas sobre la roca en el huerto de los olivos bajo un cielo estrellado y luz de luna, orando con entrega total.',
    emotionalResonance: 'Consuelo en la prueba más difícil, fortaleza para obedecer y descansar en Dios.',
    tags: ['getsemani', 'oracion', 'olivos', 'noche', 'entrega']
  },
  {
    id: 'jesus_resurreccion_victoria',
    title: 'La Tumba Vacía y la Victoria de la Resurrección',
    era: 'resurreccion_victoria',
    eraLabel: '👑 Resurrección & Pascua',
    localFallbackImage: JESUS_ARTWORKS[4]?.src || JESUS_ARTWORKS[0]?.src || '',
    bibleVerse: {
      reference: 'Juan 11:25',
      text: 'Yo soy la resurrección y la vida; el que cree en mí, aunque esté muerto, vivirá.'
    },
    jesusPresence: 'Jesús resplandeciente saliendo de la tumba abierta al amanecer, manto blanco glorioso y luz celestial.',
    emotionalResonance: 'Esperanza victoriosa, triunfo total sobre la muerte, el fracaso y la enfermedad.',
    tags: ['resurreccion', 'victoria', 'amanecer', 'tumba vacia', 'gloria']
  },
  {
    id: 'jesus_cruz_redencion',
    title: 'La Cruz del Calvario y el Amor que Vence al Mundo',
    era: 'cruz_calvario',
    eraLabel: '✝️ La Cruz & Redención',
    localFallbackImage: JESUS_ARTWORKS[5]?.src || JESUS_ARTWORKS[0]?.src || '',
    bibleVerse: {
      reference: 'Isaías 53:5',
      text: 'Mas él herido fue por nuestras rebeliones, molido por nuestros pecados; el castigo de nuestra paz fue sobre él.'
    },
    jesusPresence: 'Jesús en el monte Calvario mirando al cielo con amor eterno, perdonando a la humanidad y sellando la salvación.',
    emotionalResonance: 'Gratitud reverente, perdón de pecados y redención completa.',
    tags: ['cruz', 'calvario', 'amor', 'perdon', 'redencion']
  },
  {
    id: 'jesus_buen_pastor',
    title: 'Jesús el Buen Pastor que Busca a la Oveja Perdida',
    era: 'parabolas_vivas',
    eraLabel: '🐑 El Buen Pastor',
    localFallbackImage: JESUS_ARTWORKS[6]?.src || JESUS_ARTWORKS[0]?.src || '',
    bibleVerse: {
      reference: 'Juan 10:11',
      text: 'Yo soy el buen pastor; el buen pastor su vida da por las ovejas.'
    },
    jesusPresence: 'Jesús caminando por colinas verdes llevando una oveja herida en sus hombros con dulzura paterna.',
    emotionalResonance: 'Protección absoluta, nunca te sentirás abandonado ni extraviado.',
    tags: ['buen pastor', 'oveja', 'cuidado', 'proteccion', 'campo']
  },
  {
    id: 'jesus_sermon_monte',
    title: 'El Sermón del Monte y las Bienaventuranzas',
    era: 'sermon_monte',
    eraLabel: '🏔️ Sermón del Monte',
    localFallbackImage: JESUS_ARTWORKS[7]?.src || JESUS_ARTWORKS[0]?.src || '',
    bibleVerse: {
      reference: 'Mateo 5:3-4',
      text: 'Bienaventurados los pobres en espíritu, porque de ellos es el reino de los cielos. Bienaventurados los que lloran, porque ellos recibirán consolación.'
    },
    jesusPresence: 'Jesús sentado sobre la ladera de la colina enseñando a una multitud atenta con calidez y sabiduría del cielo.',
    emotionalResonance: 'Sabiduría divina, bendición a los afligidos y renuevo espiritual.',
    tags: ['sermon', 'monte', 'sabiduria', 'bienaventurados', 'multitud']
  },
  {
    id: 'jesus_multiplicacion_panes',
    title: 'La Multiplicación de los Panes y Peces',
    era: 'multiplicacion_provision',
    eraLabel: '🍞 Provisión & Panes',
    localFallbackImage: JESUS_ARTWORKS[8]?.src || JESUS_ARTWORKS[0]?.src || '',
    bibleVerse: {
      reference: 'Filipenses 4:19',
      text: 'Mi Dios, pues, suplirá todo lo que os falta conforme a sus riquezas en gloria en Cristo Jesús.'
    },
    jesusPresence: 'Jesús levantando el canasto al cielo dando gracias, multiplicando la provisión sobrenaturalmente ante miles.',
    emotionalResonance: 'Confianza en la provisión divina; Dios nunca deja con hambre a sus hijos.',
    tags: ['provision', 'panes', 'milagro', 'abundancia', 'peces']
  },
  {
    id: 'jesus_intercesion_trono',
    title: 'Jesús Intercesor en el Trono Celestial',
    era: 'ascension_intercesion',
    eraLabel: '🌌 Trono & Intercesión',
    localFallbackImage: JESUS_ARTWORKS[9]?.src || JESUS_ARTWORKS[0]?.src || '',
    bibleVerse: {
      reference: 'Hebreos 7:25',
      text: 'Por lo cual puede también salvar perpetuamente a los que por él se acercan a Dios, viviendo siempre para interceder por ellos.'
    },
    jesusPresence: 'Cristo en gloria celestial sentado a la diestra del Padre intercediendo activamente por cada creyente en la tierra.',
    emotionalResonance: 'Seguridad inquebrantable; hay un abogado supremo cuidando tu causa día y noche.',
    tags: ['trono', 'intercesion', 'gloria', 'victoria', 'cielo']
  }
];

export function searchJesusChronology(query: string = '', eraId: string = 'all'): JesusSceneItem[] {
  const q = (query || '').toLowerCase().trim();
  return JESUS_CHRONOLOGY_GALLERY.filter(item => {
    const matchesEra = eraId === 'all' || item.era === eraId;
    if (!matchesEra) return false;
    if (!q) return true;
    return (
      item.title.toLowerCase().includes(q) ||
      item.jesusPresence.toLowerCase().includes(q) ||
      item.emotionalResonance.toLowerCase().includes(q) ||
      item.bibleVerse.text.toLowerCase().includes(q) ||
      item.bibleVerse.reference.toLowerCase().includes(q) ||
      item.tags.some(t => t.toLowerCase().includes(q))
    );
  });
}

export function getSequenceOfConsecutiveJesusScenes(
  totalScenes: number = 4,
  contextQuery?: string
): JesusSceneItem[] {
  const filtered = contextQuery ? searchJesusChronology(contextQuery) : JESUS_CHRONOLOGY_GALLERY;
  const pool = filtered.length >= totalScenes ? filtered : JESUS_CHRONOLOGY_GALLERY;
  const used = new Set(getUsedSceneIds());

  // Prioritize scenes not recently used
  const prioritized = [...pool].sort((a, b) => {
    const aUsed = used.has(a.id) ? 1 : 0;
    const bUsed = used.has(b.id) ? 1 : 0;
    return aUsed - bUsed;
  });

  const result = prioritized.slice(0, totalScenes);
  result.forEach(sc => markSceneIdAsUsed(sc.id));
  return result;
}

export function assignNonRepeatingJesusScene(themeOrQuery?: string): JesusSceneItem {
  const scenes = searchJesusChronology(themeOrQuery || '');
  const pool = scenes.length > 0 ? scenes : JESUS_CHRONOLOGY_GALLERY;
  const used = new Set(getUsedSceneIds());

  const unused = pool.filter(s => !used.has(s.id));
  const chosen = unused.length > 0 ? unused[0] : pool[Math.floor(Math.random() * pool.length)];

  markSceneIdAsUsed(chosen.id);
  return chosen;
}
