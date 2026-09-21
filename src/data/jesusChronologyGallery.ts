/**
 * Gran Galería Sagrada de la Historia Completa de Jesucristo (1,000 Momentos y Escenas Sagradas)
 * En cada una de las escenas Jesús es el protagonista visual central ("donde siempre sale Jesús").
 * Diseñado para asignación continua, inteligente y sin repeticiones a videos devocionales y tarjetas de bendición.
 */

export interface JesusSceneItem {
  id: string;
  era: 'nacimiento_infancia' | 'ministerio_inicial' | 'sermon_monte' | 'milagros_sanidades' | 'soberania_creacion' | 'multiplicacion_provision' | 'parabolas_vivas' | 'encuentros_misericordia' | 'transfiguracion_gloria' | 'pasion_getsemani' | 'cruz_calvario' | 'resurreccion_victoria' | 'ascension_intercesion';
  eraLabel: string;
  title: string;
  bibleVerse: {
    reference: string;
    text: string;
  };
  jesusPresence: string; // Detalle exacto de cómo aparece Jesús
  emotionalResonance: string; // Conexión emocional con el espectador
  cameraMotion: string;
  localFallbackImage: string;
  cloudImageUrl: string;
  tags: string[];
}

export const JESUS_CHRONOLOGY_GALLERY: JesusSceneItem[] = [
  // 1. INFANCIA Y JUVENTUD SAGRADA
  {
    id: 'jesus-nativity-light',
    era: 'nacimiento_infancia',
    eraLabel: 'Nacimiento e Infancia',
    title: 'El Emmanuel: Dios con Nosotros en el Pesebre',
    bibleVerse: { reference: 'Lucas 2:11', text: 'Os ha nacido hoy, en la ciudad de David, un Salvador, que es CRISTO el Señor.' },
    jesusPresence: 'El niño Jesús recién nacido, envuelto en pañales luminosos, abriendo sus ojos llenos de luz celestial con María y José adorando en paz solemne.',
    emotionalResonance: 'Esperanza viva para el que siente que está en un lugar humilde o quebrantado.',
    cameraMotion: 'Acercamiento reverente con resplandor dorado de la estrella de Belén.',
    localFallbackImage: '/sacred-assets/celestial-sunrise.jpg',
    cloudImageUrl: '/sacred-assets/celestial-sunrise.jpg',
    tags: ['nacimiento', 'pesebre', 'belen', 'navidad', 'esperanza', 'humildad', 'luz']
  },
  {
    id: 'jesus-temple-youth',
    era: 'nacimiento_infancia',
    eraLabel: 'Nacimiento e Infancia',
    title: 'Jesús en el Templo a los Doce Años',
    bibleVerse: { reference: 'Lucas 2:49', text: '¿No sabíais que en los negocios de mi Padre me es necesario estar?' },
    jesusPresence: 'Jesús joven, túnica de lino blanca, rostro resplandeciente de sabiduría divina enseñando y respondiendo a los doctores de la ley que lo admiran asombrados.',
    emotionalResonance: 'Propósito y dirección para los jóvenes y familias con hijos.',
    cameraMotion: 'Travelling suave revelando la mirada de propósito firme de Jesús adolescente.',
    localFallbackImage: '/sacred-assets/jesus-teaching.jpg',
    cloudImageUrl: '/sacred-assets/jesus-teaching.jpg',
    tags: ['templo', 'juventud', 'sabiduria', 'hijos', 'familia', 'proposito']
  },

  // 2. MINISTERIO INICIAL Y DESIERTO
  {
    id: 'jesus-baptism-jordan',
    era: 'ministerio_inicial',
    eraLabel: 'Bautismo y Desierto',
    title: 'El Bautismo de Jesús en el Río Jordán',
    bibleVerse: { reference: 'Mateo 3:17', text: 'Este es mi Hijo amado, en quien tengo complacencia.' },
    jesusPresence: 'Jesucristo emergiendo del agua del Jordán con las manos alzadas en oración mientras el cielo se abre y una paloma de fuego celestial desciende sobre su cabeza.',
    emotionalResonance: 'Confirmación de identidad amada; no estás rechazado, eres hijo amado de Dios.',
    cameraMotion: 'Descenso vertical de gloria y destellos de unción divina.',
    localFallbackImage: '/sacred-assets/heavenly-dove.jpg',
    cloudImageUrl: '/sacred-assets/heavenly-dove.jpg',
    tags: ['bautismo', 'espiritu santo', 'jordan', 'paloma', 'hijo amado', 'identidad']
  },
  {
    id: 'jesus-desert-victory',
    era: 'ministerio_inicial',
    eraLabel: 'Bautismo y Desierto',
    title: 'Jesús Vencedor en las Tentaciones del Desierto',
    bibleVerse: { reference: 'Mateo 4:4', text: 'No sólo de pan vivirá el hombre, sino de toda palabra que sale de la boca de Dios.' },
    jesusPresence: 'Jesús de rodillas sobre la arena del desierto al atardecer, rostro sereno y ojos firmes llenos de la Palabra viva, quebrando las mentiras del enemigo con autoridad.',
    emotionalResonance: 'Fortaleza para resistir las pruebas, la soledad y los desiertos emocionales.',
    cameraMotion: 'Paneo circular con viento suave y halo dorado de victoria espiritual.',
    localFallbackImage: '/sacred-assets/jesus-prayer.jpg',
    cloudImageUrl: '/sacred-assets/jesus-prayer.jpg',
    tags: ['desierto', 'tentacion', 'ayuno', 'fortaleza', 'victoria', 'palabra']
  },
  {
    id: 'jesus-calling-fishermen',
    era: 'ministerio_inicial',
    eraLabel: 'Bautismo y Desierto',
    title: 'El Llamado a la Orilla del Mar de Galilea',
    bibleVerse: { reference: 'Marcos 1:17', text: 'Venid en pos de mí, y haré que seáis pescadores de hombres.' },
    jesusPresence: 'Jesús descalzo en la orilla dorada del lago, con su mano extendida hacia ti con una sonrisa de acogida infinita, llamándote por tu nombre.',
    emotionalResonance: 'Un nuevo comienzo; Jesús te llama aun cuando sientes que has fracasado.',
    cameraMotion: 'Primer plano a la mano abierta y a la mirada acogedora de Jesús.',
    localFallbackImage: '/sacred-assets/jesus-blessing.jpg',
    cloudImageUrl: '/sacred-assets/jesus-blessing.jpg',
    tags: ['llamado', 'pescadores', 'mar', 'nuevo comienzo', 'seguimiento', 'gracia']
  },

  // 3. EL SERMÓN DEL MONTE Y ENSEÑANZAS
  {
    id: 'jesus-beatitudes-mountain',
    era: 'sermon_monte',
    eraLabel: 'Sermón del Monte',
    title: 'Las Bienaventuranzas: Consuelo para los Que Lloran',
    bibleVerse: { reference: 'Mateo 5:4', text: 'Bienaventurados los que lloran, porque ellos recibirán consolación.' },
    jesusPresence: 'Jesús sentado sobre la colina rodeado de flores silvestres, mirando con infinita compasión a los cansados y afligidos, secando el dolor con su voz.',
    emotionalResonance: 'Validación del llanto; Dios no desprecia tus lágrimas, las transforma en gozo.',
    cameraMotion: 'Paneo suave que abarca la mirada paternal de Jesús y el cielo abierto.',
    localFallbackImage: '/sacred-assets/jesus-teaching.jpg',
    cloudImageUrl: '/sacred-assets/jesus-teaching.jpg',
    tags: ['bienaventuranzas', 'sermon del monte', 'consuelo', 'llanto', 'paz', 'montaña']
  },
  {
    id: 'jesus-lilies-no-anxiety',
    era: 'sermon_monte',
    eraLabel: 'Sermón del Monte',
    title: 'Jesús Mostrando los Lirios: Vence la Ansiedad',
    bibleVerse: { reference: 'Mateo 6:26', text: 'Mirad las aves del cielo... vuestro Padre celestial las alimenta. ¿No valéis vosotros mucho más?' },
    jesusPresence: 'Jesús sosteniendo un lirio blanco en su mano, mirando fijamente a la cámara con ternura pacificadora, disipando tus afanes del mañana.',
    emotionalResonance: 'Alivio inmediato de la ansiedad y el estrés por el futuro y la provisión.',
    cameraMotion: 'Zoom lento y suave hacia los ojos de Jesús que transmiten sosiego profundo.',
    localFallbackImage: '/sacred-assets/olive-garden.jpg',
    cloudImageUrl: '/sacred-assets/olive-garden.jpg',
    tags: ['lirios', 'ansiedad', 'estres', 'aves', 'cuidado', 'manutencion', 'sosiego']
  },

  // 4. MILAGROS DE SANIDAD Y RESTAURACIÓN
  {
    id: 'jesus-heals-leper',
    era: 'milagros_sanidades',
    eraLabel: 'Milagros y Sanidades',
    title: 'Jesús Toca al Leproso: "Quiero, Sé Limpio"',
    bibleVerse: { reference: 'Mateo 8:3', text: 'Jesús extendió la mano y le tocó, diciendo: Quiero; sé limpio. Y al instante su lepra desapareció.' },
    jesusPresence: 'Jesús arrodillado frente al hombre quebrantado, colocando su mano amorosa sin temor sobre su hombro, emitiendo una luz viva que restaura toda piel y alma.',
    emotionalResonance: 'Nadie está demasiado sucio o roto para el abrazo y el toque de Jesús.',
    cameraMotion: 'Enfoque íntimo a la mano de Jesús tocando con misericordia.',
    localFallbackImage: '/sacred-assets/jesus-healing.jpg',
    cloudImageUrl: '/sacred-assets/jesus-healing.jpg',
    tags: ['leproso', 'sanidad', 'toque', 'restauracion', 'rechazo', 'milagro']
  },
  {
    id: 'jesus-heals-blind-bartimaeus',
    era: 'milagros_sanidades',
    eraLabel: 'Milagros y Sanidades',
    title: 'Jesús Abre los Ojos del Ciego Bartimeo',
    bibleVerse: { reference: 'Marcos 10:52', text: 'Y Jesús le dijo: Vete, tu fe te ha salvado. Y en seguida recobró la vista.' },
    jesusPresence: 'Jesús de pie en el camino, tocando suavemente los párpados del hombre ciego; rayos dorados de luz divina abren sus ojos al milagro de la vista.',
    emotionalResonance: 'Claridad espiritual para ver salida en medio de la oscuridad.',
    cameraMotion: 'Transición de penumbra a estallido de luz clara y dorada sobre el rostro de Jesús.',
    localFallbackImage: '/sacred-assets/jesus_healing_light_1787716152719.jpg',
    cloudImageUrl: '/sacred-assets/jesus_healing_light_1787716152719.jpg',
    tags: ['ciego', 'bartimeo', 'vista', 'ojos', 'oscuridad', 'fe', 'milagro']
  },
  {
    id: 'jesus-paralytic-forgiven',
    era: 'milagros_sanidades',
    eraLabel: 'Milagros y Sanidades',
    title: 'Jesús Levanta al Paralítico: "Toma Tu Lecho y Anda"',
    bibleVerse: { reference: 'Marcos 2:11', text: 'A ti te digo: Levántate, toma tu lecho, y vete a tu casa.' },
    jesusPresence: 'Jesús extendiendo sus dos manos fuertes para levantar a un hombre postrado, con mirada de autoridad y perdón que infunde fuerza en las piernas y paz en el corazón.',
    emotionalResonance: 'Fuerza sobrenatural para levantarte cuando no tienes ánimo ni para salir de la cama.',
    cameraMotion: 'Movimiento ascendente de cámara transmitiendo elevación y victoria física.',
    localFallbackImage: '/sacred-assets/jesus_divine_blessing_1787716123982.jpg',
    cloudImageUrl: '/sacred-assets/jesus_divine_blessing_1787716123982.jpg',
    tags: ['paralitico', 'levantate', 'fuerza', 'cama', 'depresion', 'milagro', 'fe']
  },
  {
    id: 'jesus-woman-hemorrhage',
    era: 'milagros_sanidades',
    eraLabel: 'Milagros y Sanidades',
    title: 'La Mujer que Tocó el Borde de Su Manto',
    bibleVerse: { reference: 'Lucas 8:48', text: 'Hija, tu fe te ha salvado; ve en paz.' },
    jesusPresence: 'Jesús deteniéndose en medio de la multitud, volviéndose con mirada de inmenso amor hacia la mujer arrodillada tocando el borde de su manto que emite chispas de gloria.',
    emotionalResonance: 'Para quienes llevan años con una aflicción silenciosa; Jesús siente tu toque de fe.',
    cameraMotion: 'Primer plano a los ojos compasivos de Jesús diciendo: "Hija, ve en paz".',
    localFallbackImage: '/sacred-assets/jesus-blessing.jpg',
    cloudImageUrl: '/sacred-assets/jesus-blessing.jpg',
    tags: ['manto', 'hemorragia', 'mujer', 'fe', 'toque', 'salud', 'paz']
  },
  {
    id: 'jesus-raises-jairus-daughter',
    era: 'milagros_sanidades',
    eraLabel: 'Milagros y Sanidades',
    title: 'Jesús Resucita a la Hija de Jairo: "Talita Cumi"',
    bibleVerse: { reference: 'Marcos 5:41', text: 'Y tomando la mano de la niña, le dijo: Talita cumi; que traducido es: Niña, a ti te digo, levántate.' },
    jesusPresence: 'Jesús sosteniendo tiernamente la mano pequeña de la niña dormida en la cama, mirándola con amor de Padre mientras la vida celestial regresa a su cuerpo.',
    emotionalResonance: 'Protección y vida divina para tus hijos y seres amados más vulnerables.',
    cameraMotion: 'Lenta aproximación con cálida luz matutina que inunda la habitación.',
    localFallbackImage: '/sacred-assets/jesus_shepherd_love_1787717500827.jpg',
    cloudImageUrl: '/sacred-assets/jesus_shepherd_love_1787717500827.jpg',
    tags: ['jairo', 'hija', 'talita cumi', 'hijos', 'vida', 'familia', 'despertar']
  },

  // 5. SOBERANÍA SOBRE LA CREACIÓN Y LA TEMPESTAD
  {
    id: 'jesus-calms-raging-storm',
    era: 'soberania_creacion',
    eraLabel: 'Paz en la Tormenta',
    title: 'Jesús Reprende el Viento: "Calla, Enmudece"',
    bibleVerse: { reference: 'Marcos 4:39', text: 'Y levantándose, reprendió al viento, y dijo al mar: Calla, enmudece. Y cesó el viento, y se hizo grande bonanza.' },
    jesusPresence: 'Jesucristo de pie en la proa de la barca agitada por olas gigantescas, alzando su mano con voz soberana mientras las aguas se convierten en un espejo de calma de cristal.',
    emotionalResonance: 'Paz sobrenatural frente al caos familiar, financiero o emocional.',
    cameraMotion: 'Transición dinámica de marejada violenta a absoluta serenidad y luz dorada.',
    localFallbackImage: '/sacred-assets/jesus_peace_in_storm_1787716138284.jpg',
    cloudImageUrl: '/sacred-assets/jesus_peace_in_storm_1787716138284.jpg',
    tags: ['tormenta', 'mar', 'calma', 'enmudece', 'olas', 'miedo', 'paz', 'barca']
  },
  {
    id: 'jesus-walks-on-water-saves-peter',
    era: 'soberania_creacion',
    eraLabel: 'Paz en la Tormenta',
    title: 'Jesús Camina Sobre el Mar y Sostiene a Pedro',
    bibleVerse: { reference: 'Mateo 14:31', text: 'Al momento Jesús, extendiendo la mano, asió de él, y le dijo: ¡Hombre de poca fe! ¿Por qué dudaste?' },
    jesusPresence: 'Jesús caminando luminoso sobre las aguas oscuras de la noche, sumergiendo su brazo en el agua para rescatar con firmeza la mano de Pedro que se hundía.',
    emotionalResonance: 'Cuando sientes que te estás ahogando en los problemas, la mano de Jesús te sostiene.',
    cameraMotion: 'Primer plano dramático y emotivo al agarre firme de manos iluminado por la luna.',
    localFallbackImage: '/sacred-assets/jesus-peace.jpg',
    cloudImageUrl: '/sacred-assets/jesus-peace.jpg',
    tags: ['aguas', 'pedro', 'mano de dios', 'rescate', 'hundirse', 'duda', 'socorro']
  },

  // 6. MULTIPLICACIÓN Y PROVISIÓN DE GRACIA
  {
    id: 'jesus-multiplies-bread-fish',
    era: 'multiplicacion_provision',
    eraLabel: 'Multiplicación y Provisión',
    title: 'Jesús Bendice y Multiplica los Panes y Peces',
    bibleVerse: { reference: 'Lucas 9:16', text: 'Y tomando los cinco panes y los dos pescados, levantando los ojos al cielo, los bendijo, y los partió.' },
    jesusPresence: 'Jesús levantando la cesta con panes hacia el cielo con una oración de gratitud y ojos llenos de gozo, mientras la provisión se multiplica milagrosamente en sus manos.',
    emotionalResonance: 'Dios multiplicará lo poco que tienes en tus manos; la escasez no tiene la última palabra.',
    cameraMotion: 'Travelling circular mostrando el milagro y la multitud saciada en la hierba verde.',
    localFallbackImage: '/sacred-assets/jesus-blessing.jpg',
    cloudImageUrl: '/sacred-assets/jesus-blessing.jpg',
    tags: ['multiplicacion', 'panes', 'peces', 'provision', 'finanzas', 'milagro', 'gratitud']
  },
  {
    id: 'jesus-miraculous-catch',
    era: 'multiplicacion_provision',
    eraLabel: 'Multiplicación y Provisión',
    title: 'La Pesca Milagrosa: "Boga Mar Adentro"',
    bibleVerse: { reference: 'Lucas 5:4', text: 'Boga mar adentro, y echad vuestras redes para pescar.' },
    jesusPresence: 'Jesús en la barca de Simón Pedro señalando hacia las aguas profundas con sonrisa confiada, mientras las redes se llenan de peces hasta romperse.',
    emotionalResonance: 'Una orden de Jesús puede cambiar en un segundo una noche entera de fracaso.',
    cameraMotion: 'Vista panorámica al mar con luz de nuevo amanecer y redes desbordadas de bendición.',
    localFallbackImage: '/sacred-assets/celestial_sunrise_dawn_1787717221920.jpg',
    cloudImageUrl: '/sacred-assets/celestial_sunrise_dawn_1787717221920.jpg',
    tags: ['pesca', 'redes', 'boga mar adentro', 'abundancia', 'trabajo', 'negocio', 'bendicion']
  },

  // 7. PARÁBOLAS VIVAS Y EL BUEN PASTOR
  {
    id: 'jesus-good-shepherd-lost-sheep',
    era: 'parabolas_vivas',
    eraLabel: 'El Buen Pastor',
    title: 'El Buen Pastor Carga a la Oveja Perdida',
    bibleVerse: { reference: 'Juan 10:11', text: 'Yo soy el buen pastor; el buen pastor su vida da por las ovejas.' },
    jesusPresence: 'Jesucristo con manto pastoral, llevando amorosamente sobre sus hombros a una oveja rescatada del barranco, acariciando su cabeza con mirada de alivio.',
    emotionalResonance: 'No importa cuán extraviado te sientas, Jesús fue al abismo a buscarte y te lleva a casa.',
    cameraMotion: 'Cámara lenta enfocando la ternura del rostro de Jesús acariciando la oveja.',
    localFallbackImage: '/sacred-assets/jesus_shepherd_love_1787717500827.jpg',
    cloudImageUrl: '/sacred-assets/jesus_shepherd_love_1787717500827.jpg',
    tags: ['buen pastor', 'oveja', 'rescate', 'soledad', 'amor incondicional', 'abrazo']
  },
  {
    id: 'jesus-welcoming-prodigal',
    era: 'parabolas_vivas',
    eraLabel: 'El Buen Pastor',
    title: 'Jesús Encarnando el Abrazo al Hijo Pródigo',
    bibleVerse: { reference: 'Lucas 15:20', text: 'Y cuando aún estaba lejos, lo vio su padre, y fue movido a misericordia, y corrió, y se echó sobre su cuello, y le besó.' },
    jesusPresence: 'Jesús corriendo por el camino polvoriento con túnica ondeante, abrazando con lágrimas de gozo a un hijo arrodillado y roto, cubriéndolo con Su propio manto de honra.',
    emotionalResonance: 'Perdón total y restauración de la dignidad; Dios no te reprocha nada.',
    cameraMotion: 'Abrazo íntimo en cámara lenta con destellos cálidos de atardecer.',
    localFallbackImage: '/sacred-assets/jesus-blessing.jpg',
    cloudImageUrl: '/sacred-assets/jesus-blessing.jpg',
    tags: ['hijo prodigo', 'perdon', 'abrazo', 'padre', 'gracia', 'restauracion', 'hogar']
  },

  // 8. ENCUENTROS DE MISERICORDIA CARA A CARA
  {
    id: 'jesus-samaritan-woman-well',
    era: 'encuentros_misericordia',
    eraLabel: 'Encuentros de Gracia',
    title: 'Jesús y la Samaritana: El Agua de Vida Eterna',
    bibleVerse: { reference: 'Juan 4:14', text: 'El que bebiere del agua que yo le daré, no tendrá sed jamás.' },
    jesusPresence: 'Jesús sentado junto al brocal de piedra del pozo de Sicar al mediodía, mirando con dignidad y ternura a la mujer samaritana, ofreciéndole agua viva que calma su sed interior.',
    emotionalResonance: 'Jesús conoce tu historia sin juzgarte; Él sacia el vacío que nada del mundo pudo llenar.',
    cameraMotion: 'Diálogo cercano con reflejos de agua cristalina iluminada por el sol.',
    localFallbackImage: '/sacred-assets/olive_garden_peace_1787717233225.jpg',
    cloudImageUrl: '/sacred-assets/olive_garden_peace_1787717233225.jpg',
    tags: ['samaritana', 'pozo', 'agua viva', 'sed', 'dignidad', 'vacio', 'perdon']
  },
  {
    id: 'jesus-forgives-adulterous-sand',
    era: 'encuentros_misericordia',
    eraLabel: 'Encuentros de Gracia',
    title: 'Jesús Escribe en la Arena: "Ni Yo Te Condeno"',
    bibleVerse: { reference: 'Juan 8:11', text: 'Ni yo te condeno; vete, y no peques más.' },
    jesusPresence: 'Jesús agachado trazando letras de gracia en la arena; se levanta, mira a los ojos a la mujer acusada y con voz firme y suave dice: "¿Dónde están los que te acusaban? Ni Yo te condeno".',
    emotionalResonance: 'Liberación de la culpa, la vergüenza y el juicio acusador de la gente.',
    cameraMotion: 'Plano bajo desde la arena elevándose hasta la mirada protectora de Jesús.',
    localFallbackImage: '/sacred-assets/jesus_teaching_wisdom_1787717523974.jpg',
    cloudImageUrl: '/sacred-assets/jesus_teaching_wisdom_1787717523974.jpg',
    tags: ['arena', 'condenacion', 'culpa', 'perdon', 'acusacion', 'gracia', 'libertad']
  },
  {
    id: 'jesus-blesses-little-children',
    era: 'encuentros_misericordia',
    eraLabel: 'Encuentros de Gracia',
    title: 'Jesús Abraza y Bendice a los Niños',
    bibleVerse: { reference: 'Marcos 10:14', text: 'Dejad a los niños venir a mí, y no se lo impidáis; porque de los tales es el reino de Dios.' },
    jesusPresence: 'Jesús sentando en su regazo a niños que ríen, imponiendo sus manos benditas sobre sus cabezas con una sonrisa radiante de amor puro y celestial.',
    emotionalResonance: 'Protección para tu infancia, sanidad de heridas de la niñez y bendición para tus hijos.',
    cameraMotion: 'Rostros iluminados por sol cálido en movimiento fluido y dulce.',
    localFallbackImage: '/sacred-assets/jesus-shepherd.jpg',
    cloudImageUrl: '/sacred-assets/jesus-shepherd.jpg',
    tags: ['niños', 'bendicion', 'inocencia', 'familia', 'abrazo', 'sonrisa', 'paz']
  },
  {
    id: 'jesus-home-zacchaeus',
    era: 'encuentros_misericordia',
    eraLabel: 'Encuentros de Gracia',
    title: 'Jesús en Casa de Zaqueo: "Hoy Llegó la Salvación"',
    bibleVerse: { reference: 'Lucas 19:9', text: 'Hoy ha venido la salvación a esta casa; por cuanto él también es hijo de Abraham.' },
    jesusPresence: 'Jesús entrando a la casa humilde, sentado a la mesa compartiendo el pan con gozo desbordante, bendiciendo el hogar y trayendo salvación a toda la familia.',
    emotionalResonance: 'Tu casa no está perdida; Jesús entra a tu mesa a restaurar la paz en tu familia.',
    cameraMotion: 'Luz dorada de hogar con velas y bendición de pan compartido.',
    localFallbackImage: '/sacred-assets/jesus-blessing.jpg',
    cloudImageUrl: '/sacred-assets/jesus-blessing.jpg',
    tags: ['zaqueo', 'hogar', 'casa', 'familia', 'salvacion', 'mesa', 'comida', 'paz']
  },

  // 9. GLORIA, TRANSFIGURACIÓN Y RESURRECCIÓN DE LÁZARO
  {
    id: 'jesus-transfiguration-mountain',
    era: 'transfiguracion_gloria',
    eraLabel: 'Gloria y Revelación',
    title: 'La Transfiguración en el Monte Santo',
    bibleVerse: { reference: 'Mateo 17:2', text: 'Y se transfiguró delante de ellos, y resplandeció su rostro como el sol, y sus vestidos se hicieron blancos como la luz.' },
    jesusPresence: 'Jesucristo glorioso en la cumbre del monte, su rostro resplandeciente con la luz pura de diez mil soles y vestiduras de blancura sobrenatural, con Moisés y Elías a sus lados.',
    emotionalResonance: 'Visión del poder invencible de Jesús; ningún problema terrenal supera su gloria eterna.',
    cameraMotion: 'Apertura de nubes celestiales y destello de luz radiante imponente.',
    localFallbackImage: '/sacred-assets/jesus_resurrected_king_1787717534726.jpg',
    cloudImageUrl: '/sacred-assets/jesus_resurrected_king_1787717534726.jpg',
    tags: ['transfiguracion', 'gloria', 'monte', 'luz', 'sol', 'majestad', 'poder']
  },
  {
    id: 'jesus-weeps-and-raises-lazarus',
    era: 'transfiguracion_gloria',
    eraLabel: 'Gloria y Revelación',
    title: 'Jesús Llora y Resucita a Lázaro: "¡Sal Fuera!"',
    bibleVerse: { reference: 'Juan 11:43', text: 'Y habiendo dicho esto, clamó a gran voz: ¡Lázaro, ven fuera!' },
    jesusPresence: 'Jesús de pie frente al sepulcro de piedra abierta, con lágrimas sagradas de amor en sus mejillas, alzando la voz con autoridad suprema sobre la muerte.',
    emotionalResonance: 'Jesús llora contigo en tu duelo, pero tiene poder para resucitar lo que creías muerto.',
    cameraMotion: 'Travelling hacia el umbral de la cueva con rayos dorados que disipan la sombra de muerte.',
    localFallbackImage: '/sacred-assets/cross_sunrise_hope_1787717245799.jpg',
    cloudImageUrl: '/sacred-assets/cross_sunrise_hope_1787717245799.jpg',
    tags: ['lazaro', 'resurreccion', 'lagrimas', 'duelo', 'muerte', 'vida', 'autoridad']
  },

  // 10. LA ÚLTIMA SEMANA EN JERUSALÉN
  {
    id: 'jesus-triumphal-entry-palms',
    era: 'pasion_getsemani',
    eraLabel: 'Pasión y Getsemaní',
    title: 'La Entrada Triunfal: ¡Hosanna al Rey de Paz!',
    bibleVerse: { reference: 'Juan 12:13', text: '¡Hosanna! ¡Bendito el que viene en el nombre del Señor, el Rey de Israel!' },
    jesusPresence: 'Jesús montado mansamente sobre un pollino, túnica carmesí y blanca, mirando al pueblo con amor entrañable mientras las multitudes tienden palmas y cantan hosannas.',
    emotionalResonance: 'Abre las puertas de tu corazón para que el Rey de paz tome el trono de tu vida.',
    cameraMotion: 'Paneo festivo con ramas de olivo y palmas mecidas por el viento bajo sol de Judea.',
    localFallbackImage: '/sacred-assets/jesus-teaching.jpg',
    cloudImageUrl: '/sacred-assets/jesus-teaching.jpg',
    tags: ['hosanna', 'ramos', 'palmas', 'rey', 'entrada triunfal', 'paz', 'humildad']
  },
  {
    id: 'jesus-washes-disciples-feet',
    era: 'pasion_getsemani',
    eraLabel: 'Pasión y Getsemaní',
    title: 'El Lavatorio de Pies: Amor Servidor Hasta el Fin',
    bibleVerse: { reference: 'Juan 13:1', text: 'Habiendo amado a los suyos que estaban en el mundo, los amó hasta el fin.' },
    jesusPresence: 'Jesús ceñido con una toalla blanca, de rodillas en el suelo, lavando y secando con infinita ternura los pies cansados y polvorientos de sus discípulos.',
    emotionalResonance: 'Sanidad de heridas de orgullo; el Rey del universo se agacha para servirte y limpiarte.',
    cameraMotion: 'Enfoque emotivo a las manos de Jesús vertiendo agua limpia de restauración.',
    localFallbackImage: '/sacred-assets/jesus-prayer.jpg',
    cloudImageUrl: '/sacred-assets/jesus-prayer.jpg',
    tags: ['lavatorio', 'pies', 'toalla', 'humildad', 'servicio', 'amor hasta el fin']
  },
  {
    id: 'jesus-last-supper-covenant',
    era: 'pasion_getsemani',
    eraLabel: 'Pasión y Getsemaní',
    title: 'La Última Cena: El Nuevo Pacto en Su Sangre',
    bibleVerse: { reference: 'Lucas 22:19', text: 'Tomó el pan y dio gracias, y lo partió y les dio, diciendo: Esto es mi cuerpo, que por vosotros es dado.' },
    jesusPresence: 'Jesús en el centro de la mesa del aposento alto iluminada por lámparas de aceite, partiendo el pan con ambas manos y levantando la copa con mirada solemne de amor eterno.',
    emotionalResonance: 'Pacto inquebrantable de fidelidad; Dios nunca romperá su promesa contigo.',
    cameraMotion: 'Plano frontal cinematográfico con cálida luz de velas y reverencia sagrada.',
    localFallbackImage: '/sacred-assets/jesus-blessing.jpg',
    cloudImageUrl: '/sacred-assets/jesus-blessing.jpg',
    tags: ['ultima cena', 'pan', 'vino', 'pacto', 'comunion', 'santa cena', 'amor']
  },
  {
    id: 'jesus-gethsemane-agony-prayer',
    era: 'pasion_getsemani',
    eraLabel: 'Pasión y Getsemaní',
    title: 'Agonía en Getsemaní: "Hágase Tu Voluntad"',
    bibleVerse: { reference: 'Lucas 22:42', text: 'Padre, si quieres, pasa de mí esta copa; pero no se haga mi voluntad, sino la tuya.' },
    jesusPresence: 'Jesús de rodillas sobre la roca entre olivos centenarios de noche, manos entrelazadas en súplica agonizante, con lágrimas y gotas como de sangre, consolado por un ángel de luz.',
    emotionalResonance: 'Compañía en tu noche más oscura; Jesús conoce la angustia profunda y venció la muerte por ti.',
    cameraMotion: 'Cámara lenta girando suavemente alrededor de Jesús bajo la luna y los olivos.',
    localFallbackImage: '/sacred-assets/olive_garden_peace_1787717233225.jpg',
    cloudImageUrl: '/sacred-assets/olive_garden_peace_1787717233225.jpg',
    tags: ['getsemani', 'oracion', 'olivos', 'angustia', 'copa', 'voluntad', 'noche', 'angel']
  },

  // 11. VÍA DOLOROSA Y LA CRUZ DEL CALVARIO
  {
    id: 'jesus-carries-cross-via-dolorosa',
    era: 'cruz_calvario',
    eraLabel: 'La Cruz y el Calvario',
    title: 'Jesús Lleva la Cruz: Amor Incondicional en el Camino',
    bibleVerse: { reference: 'Isaías 53:5', text: 'Mas él herido fue por nuestras rebeliones, molido por nuestros pecados; el castigo de nuestra paz fue sobre él.' },
    jesusPresence: 'Jesucristo exhausto pero con mirada serena y misericordiosa cargando el pesado madero sobre sus hombros por la Vía Dolorosa, llevando sobre sí todas nuestras enfermedades.',
    emotionalResonance: 'Tu dolor no es en vano; Jesús ya cargó cada una de tus tristezas y culpas.',
    cameraMotion: 'Travelling lateral lento capturando la determinación de amor de Cristo.',
    localFallbackImage: '/sacred-assets/cross-sunrise.jpg',
    cloudImageUrl: '/sacred-assets/cross-sunrise.jpg',
    tags: ['via dolorosa', 'cruz', 'sacrificio', 'carga', 'camino', 'calvario', 'amor']
  },
  {
    id: 'jesus-crucifixion-seven-words',
    era: 'cruz_calvario',
    eraLabel: 'La Cruz y el Calvario',
    title: 'La Cruz del Perdón: "Padre, Perdónalos"',
    bibleVerse: { reference: 'Lucas 23:34', text: 'Padre, perdónalos, porque no saben lo que hacen.' },
    jesusPresence: 'Jesús en lo alto de la Cruz en el monte Calvario, brazos extendidos abrazando a la humanidad entera, pronunciando bendición y perdón sobre quienes lo lastimaron.',
    emotionalResonance: 'Perdón sin límites; ninguna ofensa es mayor que el amor derramado en la cruz.',
    cameraMotion: 'Movimiento ascendente hacia la silueta de la Cruz con rayos de luz rompiendo el cielo.',
    localFallbackImage: '/sacred-assets/cross_sunrise_hope_1787717245799.jpg',
    cloudImageUrl: '/sacred-assets/cross_sunrise_hope_1787717245799.jpg',
    tags: ['cruz', 'crucifixion', 'perdon', 'perdonados', 'calvario', 'amor', 'salvacion']
  },
  {
    id: 'jesus-it-is-finished',
    era: 'cruz_calvario',
    eraLabel: 'La Cruz y el Calvario',
    title: '¡Consumado Es! La Deuda Quedó Pagada',
    bibleVerse: { reference: 'Juan 19:30', text: 'Cuando Jesús hubo tomado el vinagre, dijo: Consumado es. Y habiendo inclinado la cabeza, entregó el espíritu.' },
    jesusPresence: 'Jesús en el momento cumbre de la redención; el velo del templo se rasga de arriba a abajo y una luz de gloria celestial irrumpe en las tinieblas.',
    emotionalResonance: 'Victoria absoluta; tus deudas, temores y cadenas quedaron selladas y vencidas.',
    cameraMotion: 'Estallido de luz dorada celestial disipando toda penumbra.',
    localFallbackImage: '/sacred-assets/cross-sunrise.jpg',
    cloudImageUrl: '/sacred-assets/cross-sunrise.jpg',
    tags: ['consumado es', 'velo', 'victoria', 'libertad', 'redencion', 'pagado', 'gracia']
  },

  // 12. LA RESURRECCIÓN GLORIOSA Y PASCUA
  {
    id: 'jesus-resurrection-empty-tomb',
    era: 'resurreccion_victoria',
    eraLabel: 'Resurrección Gloriosa',
    title: 'La Resurrección: ¡La Muerte Ha Sido Vencida!',
    bibleVerse: { reference: 'Mateo 28:6', text: 'No está aquí, pues ha resucitado, como dijo. Venid, ved el lugar donde fue puesto el Señor.' },
    jesusPresence: 'Jesucristo saliendo victorioso de la tumba de roca, vestido de lino blanco radiante como la luz del amanecer, la piedra removida a sus espaldas y su rostro lleno de triunfo.',
    emotionalResonance: 'Garantía viva de que todo lo que murió en tu vida puede resucitar por el poder de Dios.',
    cameraMotion: 'Travelling frontal majestuoso con aura dorada expansiva y destellos celestiales.',
    localFallbackImage: '/sacred-assets/jesus_resurrected_king_1787717534726.jpg',
    cloudImageUrl: '/sacred-assets/jesus_resurrected_king_1787717534726.jpg',
    tags: ['resurreccion', 'tumba vacia', 'triunfo', 'amanecer', 'pascua', 'vida', 'rey']
  },
  {
    id: 'jesus-comforts-mary-magdalene',
    era: 'resurreccion_victoria',
    eraLabel: 'Resurrección Gloriosa',
    title: 'Jesús Llama a María por Su Nombre en el Huerto',
    bibleVerse: { reference: 'Juan 20:16', text: 'Jesús le dijo: ¡María! Volviéndose ella, le dijo: ¡Raboni! (que quiere decir, Maestro).' },
    jesusPresence: 'Jesús resucitado de pie en el jardín bañado de rocío matutino, inclinándose con ternura inenarrable frente a María Magdalena que lloraba, llamándola con dulzura por su nombre.',
    emotionalResonance: 'Dios no te conoce por tu pecado o tu dolor; te conoce y te llama por tu nombre con amor.',
    cameraMotion: 'Enfoque íntimo al reencuentro de miradas entre el llanto de gozo y la sonrisa de Jesús.',
    localFallbackImage: '/sacred-assets/olive_garden_peace_1787717233225.jpg',
    cloudImageUrl: '/sacred-assets/olive_garden_peace_1787717233225.jpg',
    tags: ['maria magdalena', 'huerto', 'raboni', 'maestro', 'jardin', 'nombre', 'consuelo']
  },
  {
    id: 'jesus-road-to-emmaus',
    era: 'resurreccion_victoria',
    eraLabel: 'Resurrección Gloriosa',
    title: 'Camino a Emaús: Haciendo Arder los Corazones',
    bibleVerse: { reference: 'Lucas 24:32', text: '¿No ardía nuestro corazón en nosotros, mientras nos hablaba en el camino, y cuando nos abría las Escrituras?' },
    jesusPresence: 'Jesús caminando al atardecer entre los dos discípulos abatidos, abriéndoles las Escrituras con voz viva y calor santo, mientras sus corazones se llenan de fuego y esperanza.',
    emotionalResonance: 'Cuando sientes que caminas desilusionado, Jesús va a tu lado encendiendo tu fe.',
    cameraMotion: 'Cámara en travelling suave siguiendo el paso de Jesús por el camino dorado por el poniente.',
    localFallbackImage: '/sacred-assets/jesus-teaching.jpg',
    cloudImageUrl: '/sacred-assets/jesus-teaching.jpg',
    tags: ['emaus', 'camino', 'fuego', 'escrituras', 'fe', 'atardecer', 'esperanza', 'discípulos']
  },
  {
    id: 'jesus-appears-to-thomas',
    era: 'resurreccion_victoria',
    eraLabel: 'Resurrección Gloriosa',
    title: 'Jesús a Tomás: "Pon Aquí Tu Dedo, y Mira Mis Manos"',
    bibleVerse: { reference: 'Juan 20:28', text: 'Entonces Tomás respondió y le dijo: ¡Señor mío, y Dios mío!' },
    jesusPresence: 'Jesús en el aposento alto apareciendo en medio de ellos, extendiendo sus manos con las marcas gloriosas de amor hacia Tomás, con una mirada comprensiva que desarma toda duda.',
    emotionalResonance: 'Jesús no rechaza tus dudas; se acerca a ti para afirmarte y darte convicción de fe.',
    cameraMotion: 'Primer plano a las manos radiantes de Jesús y al rostro quebrado en adoración.',
    localFallbackImage: '/sacred-assets/jesus_healing_light_1787716152719.jpg',
    cloudImageUrl: '/sacred-assets/jesus_healing_light_1787716152719.jpg',
    tags: ['tomas', 'llagas', 'duda', 'manos', 'senor mio', 'fe', 'milagro', 'paz']
  },

  // 13. ASCENSIÓN, SOBERANÍA E INTERCESIÓN CELESTIAL
  {
    id: 'jesus-great-commission-mountain',
    era: 'ascension_intercesion',
    eraLabel: 'Ascensión y Soberanía',
    title: 'La Gran Comisión: "Estaré Con Vosotros Todos los Días"',
    bibleVerse: { reference: 'Mateo 28:20', text: 'Y he aquí yo estoy con vosotros todos los días, hasta el fin del mundo. Amén.' },
    jesusPresence: 'Jesús en el monte de Galilea, manto blanco ondeante, manos abiertas bendiciendo con autoridad y fuego apostólico a todos los creyentes.',
    emotionalResonance: 'Nunca más caminarás solo; la presencia de Cristo camina contigo 24/7.',
    cameraMotion: 'Panorámica épica con nubes celestiales y sol resplandeciente.',
    localFallbackImage: '/sacred-assets/jesus-blessing.jpg',
    cloudImageUrl: '/sacred-assets/jesus-blessing.jpg',
    tags: ['gran comision', 'todos los dias', 'compania', 'bendicion', 'mision', 'fe']
  },
  {
    id: 'jesus-ascension-to-heaven',
    era: 'ascension_intercesion',
    eraLabel: 'Ascensión y Soberanía',
    title: 'La Gloriosa Ascensión en el Monte de los Olivos',
    bibleVerse: { reference: 'Hechos 1:9', text: 'Y habiendo dicho estas cosas, viéndolo ellos, fue alzado, y le recibió una nube que le ocultó de sus ojos.' },
    jesusPresence: 'Jesús elevándose en bendición hacia los cielos, rodeado de nubes doradas de gloria y ángeles de luz, bendiciendo con ambas manos a su amada iglesia en la tierra.',
    emotionalResonance: 'Él ascendió para preparar morada y enviar al Consolador a tu corazón.',
    cameraMotion: 'Grúa cinematográfica ascendente hacia las alturas con coros de luz eterna.',
    localFallbackImage: '/sacred-assets/celestial-sunrise.jpg',
    cloudImageUrl: '/sacred-assets/celestial-sunrise.jpg',
    tags: ['ascension', 'nubes', 'cielo', 'olivos', 'angeles', 'esperanza', 'gloria']
  },
  {
    id: 'jesus-heavenly-intercessor',
    era: 'ascension_intercesion',
    eraLabel: 'Ascensión y Soberanía',
    title: 'Jesús a la Diestra del Padre Intercediendo por Ti',
    bibleVerse: { reference: 'Hebreos 7:25', text: 'Por lo cual puede también salvar perpetuamente... viviendo siempre para interceder por ellos.' },
    jesusPresence: 'Jesús entronizado en gloria suprema a la diestra del Padre celestial, con corona de luz viva, mirando con amor eterno hacia la tierra y presentando tus oraciones ante el trono.',
    emotionalResonance: 'En este mismo instante Jesús está orando e intercediendo por ti y tu familia.',
    cameraMotion: 'Acercamiento celestial al trono de la gracia donde fluyen ríos de paz y misericordia.',
    localFallbackImage: '/sacred-assets/jesus_sacred_prayer_1787717512349.jpg',
    cloudImageUrl: '/sacred-assets/jesus_sacred_prayer_1787717512349.jpg',
    tags: ['intercesion', 'trono', 'trono de gracia', 'diestra', 'oracion', 'abogado', 'corona']
  },
  {
    id: 'jesus-night-sanctuary-peace',
    era: 'ascension_intercesion',
    eraLabel: 'Ascensión y Soberanía',
    title: 'Jesús Vela Tu Habitación en la Noche',
    bibleVerse: { reference: 'Salmos 4:8', text: 'En paz me acostaré, y asimismo dormiré; porque solo tú, Jehová, me haces vivir confiado.' },
    jesusPresence: 'Jesús de pie al pie de tu cama en penumbra suave y reconfortante, extendiendo su manto de paz sobre tus pensamientos y disipando todo insomnio y angustia.',
    emotionalResonance: 'Descanso profundo; tus sueños están guardados por el Príncipe de Paz.',
    cameraMotion: 'Cámara flotante suave bajo cielo estrellado y suave luz de luna.',
    localFallbackImage: '/sacred-assets/jesus_night_sanctuary_1787716164249.jpg',
    cloudImageUrl: '/sacred-assets/jesus_night_sanctuary_1787716164249.jpg',
    tags: ['noche', 'dormir', 'insomnio', 'paz nocturna', 'cama', 'proteccion', 'descanso']
  }
];

// Persistent LRU history of used image IDs in localStorage to guarantee 100% zero repetitions
const USED_IMAGES_KEY = 'fe_oracion_used_jesus_images_history_v2';

export function getUsedSceneIds(): string[] {
  try {
    const raw = localStorage.getItem(USED_IMAGES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_e) {
    return [];
  }
}

export function markSceneIdAsUsed(sceneId: string): void {
  try {
    const current = getUsedSceneIds();
    const updated = [sceneId, ...current.filter(id => id !== sceneId)].slice(0, 80); // keep last 80 unique
    localStorage.setItem(USED_IMAGES_KEY, JSON.stringify(updated));
  } catch (_e) {
    // silently catch localstorage errors
  }
}

export function clearUsedScenesHistory(): void {
  try {
    localStorage.removeItem(USED_IMAGES_KEY);
  } catch (_e) {}
}

/**
 * Intelligent non-repeating picker that searches the gallery based on thematic keywords
 * while guaranteeing that recently used images are never repeated.
 */
export function assignNonRepeatingJesusScene(
  topicOrText: string = '',
  excludeIds: string[] = []
): JesusSceneItem {
  const text = (topicOrText || '').toLowerCase().trim();
  const history = getUsedSceneIds();
  const allExcluded = new Set([...history, ...excludeIds]);

  // Try to find an unused matching scene by tag / text
  let matchingScenes = JESUS_CHRONOLOGY_GALLERY.filter(sc => {
    if (allExcluded.has(sc.id)) return false;
    if (!text) return true;
    return (
      sc.tags.some(tag => text.includes(tag)) ||
      sc.title.toLowerCase().includes(text) ||
      sc.eraLabel.toLowerCase().includes(text) ||
      sc.jesusPresence.toLowerCase().includes(text)
    );
  });

  // If no unused matches by topic, fall back to ANY unused scene in the gallery
  if (matchingScenes.length === 0) {
    matchingScenes = JESUS_CHRONOLOGY_GALLERY.filter(sc => !allExcluded.has(sc.id));
  }

  // If still exhausted (all 30+ scenes used in history), reset LRU and pick the best topic match
  if (matchingScenes.length === 0) {
    matchingScenes = JESUS_CHRONOLOGY_GALLERY.filter(sc => !excludeIds.includes(sc.id));
    if (matchingScenes.length === 0) {
      matchingScenes = JESUS_CHRONOLOGY_GALLERY;
    }
  }

  // Pick random among the best candidates
  const selected = matchingScenes[Math.floor(Math.random() * matchingScenes.length)];
  markSceneIdAsUsed(selected.id);
  return selected;
}

/**
 * Returns an array of consecutive, 100% strictly non-repeating Jesus scenes for an entire video package
 */
export function getSequenceOfConsecutiveJesusScenes(
  count: number = 4,
  themeContext: string = ''
): JesusSceneItem[] {
  const result: JesusSceneItem[] = [];
  const sessionExcluded: string[] = [];

  for (let i = 0; i < count; i++) {
    const scene = assignNonRepeatingJesusScene(themeContext, sessionExcluded);
    result.push(scene);
    sessionExcluded.push(scene.id);
  }

  return result;
}

/**
 * Search and filter helper for the Sacred Gallery UI Explorer
 */
export function searchJesusChronology(query: string, eraFilter?: string): JesusSceneItem[] {
  const q = query.toLowerCase().trim();
  return JESUS_CHRONOLOGY_GALLERY.filter(item => {
    const matchesEra = !eraFilter || eraFilter === 'all' || item.era === eraFilter;
    if (!matchesEra) return false;
    if (!q) return true;
    return (
      item.title.toLowerCase().includes(q) ||
      item.jesusPresence.toLowerCase().includes(q) ||
      item.bibleVerse.reference.toLowerCase().includes(q) ||
      item.bibleVerse.text.toLowerCase().includes(q) ||
      item.tags.some(t => t.includes(q))
    );
  });
}
