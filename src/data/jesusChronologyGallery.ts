export interface JesusSceneItem {
  id: string;
  title: string;
  description: string;
  visualPrompt: string;
  chronologyOrder: number;
  scriptureRef: string;
  imageUrl?: string;
  isUsed?: boolean;
}

export const JESUS_CHRONOLOGY_SCENES: JesusSceneItem[] = [
  {
    id: 'jc_1',
    title: 'El Nacimiento en Belén',
    description: 'La luz de la estrella celestial sobre el pesebre.',
    visualPrompt: 'Nativity in Bethlehem, radiant celestial light shining down upon baby Jesus in manger.',
    chronologyOrder: 1,
    scriptureRef: 'Lucas 2:7',
    imageUrl: '/sacred-assets/celestial-sunrise.jpg'
  },
  {
    id: 'jc_2',
    title: 'El Bautismo en el Jordán',
    description: 'El Espíritu Santo descendiendo como paloma de luz.',
    visualPrompt: 'Jesus baptized in Jordan river, dove of divine light descending from heavenly skies.',
    chronologyOrder: 2,
    scriptureRef: 'Mateo 3:16',
    imageUrl: '/sacred-assets/heavenly-dove.jpg'
  },
  {
    id: 'jc_3',
    title: 'Sanando a los Quebrantados',
    description: 'Manos de compasión restaurando al enfermo.',
    visualPrompt: 'Jesus gently extending healing hands with divine warm golden aura, restoring sight and health.',
    chronologyOrder: 3,
    scriptureRef: 'Marcos 1:41',
    imageUrl: '/sacred-assets/jesus-healing.jpg'
  },
  {
    id: 'jc_4',
    title: 'La Calma de la Tempestad',
    description: 'Paz en medio de las olas violentas.',
    visualPrompt: 'Jesus standing on Galilean boat rebuking winds and stormy sea, divine calm spreading.',
    chronologyOrder: 4,
    scriptureRef: 'Marcos 4:39',
    imageUrl: '/sacred-assets/jesus-peace.jpg'
  },
  {
    id: 'jc_5',
    title: 'La Resurrección Victoriosa',
    description: 'La tumba vacía y la gloria de la vida eterna.',
    visualPrompt: 'The empty tomb bathed in brilliant sunrise glory, radiant cross silhouette in dawn.',
    chronologyOrder: 5,
    scriptureRef: 'Lucas 24:6',
    imageUrl: '/sacred-assets/jesus-cross.jpg'
  }
];

export const JESUS_CHRONOLOGY_GALLERY = JESUS_CHRONOLOGY_SCENES.map(s => ({
  ...s,
  localFallbackImage: s.imageUrl || '/sacred-assets/celestial-sunrise.jpg',
  cloudImageUrl: s.imageUrl || '/sacred-assets/celestial-sunrise.jpg'
}));

export function assignNonRepeatingJesusScene(text?: string): any {
  const clean = (text || '').toLowerCase();
  const matched = JESUS_CHRONOLOGY_GALLERY.find(s => clean.includes(s.title.toLowerCase()) || clean.includes(s.scriptureRef.toLowerCase()));
  if (matched) return matched;
  return JESUS_CHRONOLOGY_GALLERY[Math.floor(Math.random() * JESUS_CHRONOLOGY_GALLERY.length)];
}

export function getSequenceOfConsecutiveJesusScenes(count: number = 3): JesusSceneItem[] {
  return JESUS_CHRONOLOGY_SCENES.slice(0, count);
}

export function markSceneIdAsUsed(id: string): void {
  const sc = JESUS_CHRONOLOGY_SCENES.find(s => s.id === id);
  if (sc) sc.isUsed = true;
}
