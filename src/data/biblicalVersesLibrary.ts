export interface BibleVerseItem {
  id: string;
  reference: string;
  book: string;
  category: 'salmos-proteccion' | 'salmos-manana' | 'salmos-noche' | 'sanidad' | 'fortaleza' | 'paz' | 'familia' | 'alabanza' | 'sabiduria' | 'promesas' | 'amor';
  categoryLabel: string;
  text: string;
  headerTitle: string;
  blessingQuote: string;
  prayer: string;
  recommendedTheme: 'dawn' | 'night' | 'jesus' | 'cross' | 'peace' | 'healing' | 'olive' | 'worship';
  accentColor: string;
  keywords: string[];
}

export const BIBLICAL_VERSES_COLLECTION: BibleVerseItem[] = [
  // --- SALMOS DE PROTECCIÓN Y AMPARO ---
  {
    id: 'salmo-91-1',
    reference: 'Salmos 91:1-2',
    book: 'Salmos',
    category: 'salmos-proteccion',
    categoryLabel: '🛡️ Salmos de Protección',
    text: 'El que habita al abrigo del Altísimo morará bajo la sombra del Omnipotente. Diré yo a Jehová: Esperanza mía, y castillo mío; mi Dios, en quien confiaré.',
    headerTitle: '¡BAJO LA SOMBRA DEL OMNIPOTENTE!',
    blessingQuote: 'Ninguna plaga tocará tu morada ni mal alguno prevalecerá. Dios es tu escudo inexpugnable.',
    prayer: 'Padre Amado, me refugio bajo la sombra de tus alas. Protege a mi familia y guarda mi entrar y salir. Amén.',
    recommendedTheme: 'night',
    accentColor: '#38bdf8',
    keywords: ['salmo 91', 'proteccion', 'refugio', 'abrigo', 'castillo', 'omnipotente', 'escudo']
  },
  {
    id: 'salmo-91-11',
    reference: 'Salmos 91:11-12',
    book: 'Salmos',
    category: 'salmos-proteccion',
    categoryLabel: '🛡️ Salmos de Protección',
    text: 'Pues a sus ángeles mandará acerca de ti, que te guarden en todos tus caminos. En las manos te llevarán, para que tu pie no tropiece en piedra.',
    headerTitle: '¡ÁNGELES ACAMPAN A TU ALREDEDOR!',
    blessingQuote: 'El ejército celestial tiene orden directa de cuidarte en cada paso que des hoy.',
    prayer: 'Señor Jesús, gracias por el cerco divino de protección sobre mis hijos y mi hogar. Amén.',
    recommendedTheme: 'jesus',
    accentColor: '#fbbf24',
    keywords: ['angeles', 'salmo 91', 'cuidado', 'caminos', 'guardar', 'proteccion']
  },
  {
    id: 'salmo-121-1',
    reference: 'Salmos 121:1-2',
    book: 'Salmos',
    category: 'salmos-proteccion',
    categoryLabel: '🛡️ Salmos de Protección',
    text: 'Alzaré mis ojos a los montes; ¿de dónde vendrá mi socorro? Mi socorro viene de Jehová, que hizo los cielos y la tierra.',
    headerTitle: '¡MI SOCORRO VIENE DEL SEÑOR!',
    blessingQuote: 'No mires la altura del monte ni el tamaño del obstáculo; mira al Creador del cielo y de la tierra que te sostiene.',
    prayer: 'Dios de los cielos, pongo mi mirada en tu fidelidad. Tú eres mi ayuda oportuna en toda necesidad. Amén.',
    recommendedTheme: 'dawn',
    accentColor: '#f59e0b',
    keywords: ['salmo 121', 'socorro', 'montes', 'ayuda', 'creador', 'tierra', 'cielos']
  },
  {
    id: 'salmo-121-7',
    reference: 'Salmos 121:7-8',
    book: 'Salmos',
    category: 'salmos-proteccion',
    categoryLabel: '🛡️ Salmos de Protección',
    text: 'Jehová te guardará de todo mal; él guardará tu alma. Jehová guardará tu salida y tu entrada desde ahora y para siempre.',
    headerTitle: '¡EL SEÑOR GUARDA TU SALIDA Y TU ENTRADA!',
    blessingQuote: 'Camina en completa paz. La mano eterna de Dios te acompaña al salir y te recibe con bendición al volver.',
    prayer: 'Padre Santo, bendice mis pasos hoy. Que tu presencia llene de luz cada lugar donde pise. Amén.',
    recommendedTheme: 'peace',
    accentColor: '#34d399',
    keywords: ['salmo 121', 'guardar', 'salida', 'entrada', 'alma', 'paz', 'siempre']
  },
  {
    id: 'salmo-27-1',
    reference: 'Salmos 27:1',
    book: 'Salmos',
    category: 'salmos-proteccion',
    categoryLabel: '🛡️ Salmos de Protección',
    text: 'Jehová es mi luz y mi salvación; ¿de quién temeré? Jehová es la fortaleza de mi vida; ¿de quién he de atemorizarme?',
    headerTitle: '¡EL SEÑOR ES MI LUZ Y SALVACIÓN!',
    blessingQuote: 'Toda tiniebla retrocede ante la gloria de Dios. No hay temor que pueda apagar tu fe.',
    prayer: 'Señor Jesús, tú eres mi luz resplandeciente. Echo fuera todo miedo y me afirmo en tu victoria. Amén.',
    recommendedTheme: 'cross',
    accentColor: '#f43f5e',
    keywords: ['salmo 27', 'luz', 'salvacion', 'temor', 'miedo', 'fortaleza', 'victoria']
  },
  {
    id: 'salmo-46-1',
    reference: 'Salmos 46:1-2',
    book: 'Salmos',
    category: 'salmos-proteccion',
    categoryLabel: '🛡️ Salmos de Protección',
    text: 'Dios es nuestro amparo y fortaleza, nuestro pronto auxilio en las tribulaciones. Por tanto, no temeremos, aunque la tierra sea removida.',
    headerTitle: '¡NUESTRO PRONTO AUXILIO EN LA TRIBULACIÓN!',
    blessingQuote: 'Aunque el mundo se mueva, la roca inmovible de Cristo sostiene firmemente tu vida.',
    prayer: 'Dios Todopoderoso, en ti descanso seguro. Sé mi refugio y renueva mi fe en medio de cualquier tormenta. Amén.',
    recommendedTheme: 'peace',
    accentColor: '#60a5fa',
    keywords: ['salmo 46', 'amparo', 'fortaleza', 'auxilio', 'tribulacion', 'tormenta']
  },
  {
    id: 'salmo-34-7',
    reference: 'Salmos 34:7',
    book: 'Salmos',
    category: 'salmos-proteccion',
    categoryLabel: '🛡️ Salmos de Protección',
    text: 'El ángel de Jehová acampa alrededor de los que le temen, y los defiende.',
    headerTitle: '¡DEFENDIDO POR EL PODER DE DIOS!',
    blessingQuote: 'Estás rodeado por la gracia y el poder de lo alto. El enemigo no tiene autoridad sobre tu vida.',
    prayer: 'Gracias Padre por defender mi causa y enviar tu ángel protector sobre mi familia. Amén.',
    recommendedTheme: 'jesus',
    accentColor: '#fbbf24',
    keywords: ['salmo 34', 'angel', 'acampa', 'defiende', 'temor de dios', 'cuidado']
  },

  // --- SALMOS DE LA MAÑANA & NUEVO DÍA ---
  {
    id: 'salmo-143-8',
    reference: 'Salmos 143:8',
    book: 'Salmos',
    category: 'salmos-manana',
    categoryLabel: '☀️ Salmos de la Mañana',
    text: 'Hazme oír por la mañana tu misericordia, porque en ti he confiado; hazme saber el camino por donde ande, porque a ti he elevado mi alma.',
    headerTitle: '¡BUENOS DÍAS! HAZME OÍR TU MISERICORDIA',
    blessingQuote: 'Que la voz dulce de Dios guíe tus decisiones y te abra puertas que nadie puede cerrar.',
    prayer: 'Señor Jesús, te entrego mi amanecer. Enséñame tu voluntad y endereza mis sendas hoy. Amén.',
    recommendedTheme: 'dawn',
    accentColor: '#f59e0b',
    keywords: ['salmo 143', 'mañana', 'misericordia', 'camino', 'confianza', 'buenos dias', 'amanecer']
  },
  {
    id: 'salmo-5-3',
    reference: 'Salmos 5:3',
    book: 'Salmos',
    category: 'salmos-manana',
    categoryLabel: '☀️ Salmos de la Mañana',
    text: 'Oh Jehová, de mañana oirás mi voz; de mañana me presentaré delante de ti, y esperaré.',
    headerTitle: '¡BUENOS DÍAS! DE MAÑANA OIRÁS MI VOZ',
    blessingQuote: 'Comienza tu jornada en la presencia del Rey. Tu oración de hoy desatará bendiciones para toda la semana.',
    prayer: 'Padre Amado, a ti presento mis planes, anhelos y proyectos. Espero con gozo tus milagros. Amén.',
    recommendedTheme: 'dawn',
    accentColor: '#fbbf24',
    keywords: ['salmo 5', 'mañana', 'voz', 'oracion', 'esperanza', 'comienzo']
  },
  {
    id: 'salmo-118-24',
    reference: 'Salmos 118:24',
    book: 'Salmos',
    category: 'salmos-manana',
    categoryLabel: '☀️ Salmos de la Mañana',
    text: 'Este es el día que hizo Jehová; nos gozaremos y alegraremos en él.',
    headerTitle: '¡ESTE ES EL DÍA QUE HIZO EL SEÑOR!',
    blessingQuote: 'Despierta con alegría en el corazón. Hoy es un día de bendición, gracia y victoria.',
    prayer: 'Gracias Dios por un nuevo día con aliento de vida. Lléname de tu gozo inefable. Amén.',
    recommendedTheme: 'dawn',
    accentColor: '#fcd34d',
    keywords: ['salmo 118', 'dia', 'gozo', 'alegria', 'amanecer', 'gracia']
  },
  {
    id: 'salmo-90-14',
    reference: 'Salmos 90:14',
    book: 'Salmos',
    category: 'salmos-manana',
    categoryLabel: '☀️ Salmos de la Mañana',
    text: 'De mañana sácianos de tu misericordia, y cantaremos y nos alegraremos todos nuestros días.',
    headerTitle: '¡SÁCIANOS DE TU MISERICORDIA!',
    blessingQuote: 'Que el favor de Dios inunde tu vida y te dé satisfacción plena en todo lo que realices.',
    prayer: 'Señor, sacia mi sed espiritual y que mi corazón cante alabanzas por tus bondades. Amén.',
    recommendedTheme: 'dawn',
    accentColor: '#f59e0b',
    keywords: ['salmo 90', 'misericordia', 'cantar', 'alegria', 'manana']
  },
  {
    id: 'salmo-59-16',
    reference: 'Salmos 59:16',
    book: 'Salmos',
    category: 'salmos-manana',
    categoryLabel: '☀️ Salmos de la Mañana',
    text: 'Pero yo cantaré de tu poder, y alabaré de mañana tu misericordia; porque has sido mi amparo y refugio en el día de mi angustia.',
    headerTitle: '¡CANTARÉ DE TU PODER EN ESTA MAÑANA!',
    blessingQuote: 'Declara la grandeza de Dios sobre tu hogar. Él ha sido y seguirá siendo tu refugio inquebrantable.',
    prayer: 'Padre Celestial, alabo tu poder y agradezco cómo me libraste de toda angustia. Hoy camino en victoria. Amén.',
    recommendedTheme: 'worship',
    accentColor: '#fbbf24',
    keywords: ['salmo 59', 'poder', 'alabanza', 'refugio', 'angustia', 'manana']
  },

  // --- SALMOS DE LA NOCHE, PAZ Y DESCANSO ---
  {
    id: 'salmo-4-8',
    reference: 'Salmos 4:8',
    book: 'Salmos',
    category: 'salmos-noche',
    categoryLabel: '🌙 Salmos de la Noche y Descanso',
    text: 'En paz me acostaré, y asimismo dormiré; porque solo tú, Jehová, me haces vivir confiado.',
    headerTitle: '¡BUENAS NOCHES! EN PAZ ME ACOSTARÉ Y DORMIRÉ',
    blessingQuote: 'Entrega tus cargas antes de cerrar los ojos. Dios velará por tu reposo y renovará tu espíritu.',
    prayer: 'Señor Jesús, pongo mi mente, mi hogar y mis sueños en tus manos benditas. Descanso en tu paz. Amén.',
    recommendedTheme: 'night',
    accentColor: '#38bdf8',
    keywords: ['salmo 4', 'paz', 'dormir', 'acostar', 'descanso', 'noche', 'buenas noches']
  },
  {
    id: 'salmo-127-2',
    reference: 'Salmos 127:2',
    book: 'Salmos',
    category: 'salmos-noche',
    categoryLabel: '🌙 Salmos de la Noche y Descanso',
    text: 'Por demás es que os levantéis de madrugada, y vayáis tarde a reposar, y que comáis pan de dolores; pues que a su amado dará Dios el sueño.',
    headerTitle: '¡DIOS DA EL SUEÑO A SU AMADO!',
    blessingQuote: 'Tú eres el amado de Dios. Suelta la ansiedad del trabajo y recibe el descanso dulce que Él preparó para ti.',
    prayer: 'Padre Dios, confío en que tú provees aun mientras duermo. Bendice mi noche con un sueño reparador. Amén.',
    recommendedTheme: 'night',
    accentColor: '#818cf8',
    keywords: ['salmo 127', 'sueño', 'amado', 'descanso', 'ansiedad', 'reposo', 'noche']
  },
  {
    id: 'salmo-63-6',
    reference: 'Salmos 63:6-7',
    book: 'Salmos',
    category: 'salmos-noche',
    categoryLabel: '🌙 Salmos de la Noche y Descanso',
    text: 'Cuando me acuerde de ti en mi lecho, cuando medite en ti en las vigilias de la noche. Porque has sido mi socorro, y así en la sombra de tus alas me regocijaré.',
    headerTitle: '¡MEDITANDO EN TU AMOR EN LA NOCHE!',
    blessingQuote: 'En la quietud de tu habitación, recuerda las victorias que Dios te ha dado. Duerme bajo la sombra de Sus alas.',
    prayer: 'Amado Jesús, en medio del silencio te alabo. Gracias por ser mi guardián de día y de noche. Amén.',
    recommendedTheme: 'night',
    accentColor: '#c084fc',
    keywords: ['salmo 63', 'lecho', 'vigilias', 'noche', 'alas', 'socorro', 'meditar']
  },
  {
    id: 'salmo-134-1',
    reference: 'Salmos 134:1-2',
    book: 'Salmos',
    category: 'salmos-noche',
    categoryLabel: '🌙 Salmos de la Noche y Descanso',
    text: 'Mirad, bendecid a Jehová, vosotros todos los siervos de Jehová, los que en la casa de Jehová estáis por las noches. Alzad vuestras manos al santuario, y bendecid a Jehová.',
    headerTitle: '¡BENDICIÓN NOCTURNA EN EL SANTUARIO!',
    blessingQuote: 'Que la adoración en tu corazón despida este día y prepare un amanecer de milagros.',
    prayer: 'Señor, alzo mis manos agradecidas al concluir el día. Bendice mi casa y guarda a mis seres queridos. Amén.',
    recommendedTheme: 'night',
    accentColor: '#a78bfa',
    keywords: ['salmo 134', 'noches', 'santuario', 'manos', 'bendecid', 'adoracion']
  },

  // --- SALMOS DE PASTORADO & RESTAURACIÓN (SALMO 23 Y AFINES) ---
  {
    id: 'salmo-23-1',
    reference: 'Salmos 23:1-3',
    book: 'Salmos',
    category: 'paz',
    categoryLabel: '🏞️ Salmo 23 y Pastos de Reposo',
    text: 'Jehová es mi pastor; nada me faltará. En lugares de delicados pastos me hará descansar; junto a aguas de reposo me pastoreará. Confortará mi alma.',
    headerTitle: '¡EL SEÑOR ES MI PASTOR, NADA ME FALTARÁ!',
    blessingQuote: 'Descansa en la provisión inagotable de tu Buen Pastor. Él cuida cada detalle de tu vida.',
    prayer: 'Jesús, Pastor mío, guíame junto a tus aguas de reposo y restaura las fuerzas de mi alma hoy. Amén.',
    recommendedTheme: 'peace',
    accentColor: '#34d399',
    keywords: ['salmo 23', 'pastor', 'pastos', 'reposo', 'aguas', 'confortara', 'provision']
  },
  {
    id: 'salmo-23-4',
    reference: 'Salmos 23:4',
    book: 'Salmos',
    category: 'paz',
    categoryLabel: '🏞️ Salmo 23 y Pastos de Reposo',
    text: 'Aunque ande en valle de sombra de muerte, no temeré mal alguno, porque tú estarás conmigo; tu vara y tu cayado me infundirán aliento.',
    headerTitle: '¡NO TEMERÉ, PORQUE TÚ ESTÁS CONMIGO!',
    blessingQuote: 'Ningún valle oscuro puede apagar la luz de Cristo a tu lado. Su vara y cayado te defienden.',
    prayer: 'Señor, cuando el camino parezca difícil, recuérdame que tú vas a mi lado sosteniéndome con amor. Amén.',
    recommendedTheme: 'cross',
    accentColor: '#fbbf24',
    keywords: ['salmo 23', 'valle', 'sombra', 'vara', 'cayado', 'aliento', 'conmigo']
  },
  {
    id: 'salmo-23-5',
    reference: 'Salmos 23:5-6',
    book: 'Salmos',
    category: 'paz',
    categoryLabel: '🏞️ Salmo 23 y Pastos de Reposo',
    text: 'Aderezas mesa delante de mí en presencia de mis angustiadores; unges mi cabeza con aceite; mi copa está rebosando. Ciertamente el bien y la misericordia me seguirán todos los días de mi vida.',
    headerTitle: '¡MI COPA REBOSA DE GRACIA Y MISERICORDIA!',
    blessingQuote: 'Dios prepara un banquete de bendición para ti. La unción y el favor divino te perseguirán siempre.',
    prayer: 'Padre Bueno, gracias por ungir mi vida y colmarme de tu bondad. Habitaré en tu casa para siempre. Amén.',
    recommendedTheme: 'jesus',
    accentColor: '#f59e0b',
    keywords: ['salmo 23', 'mesa', 'copa', 'aceite', 'misericordia', 'bien', 'rebosar']
  },

  // --- SANIDAD DIVINA & RESTAURACIÓN ---
  {
    id: 'isaias-53-5',
    reference: 'Isaías 53:4-5',
    book: 'Isaías',
    category: 'sanidad',
    categoryLabel: '🌿 Sanidad y Salud Divina',
    text: 'Ciertamente llevó él nuestras enfermedades, y sufrió nuestros dolores... y por su llaga fuimos nosotros curados.',
    headerTitle: '¡POR SUS LLAGAS HEMOS SIDO CURADOS!',
    blessingQuote: 'Jesús pagó el precio de tu redención y salud en la cruz. Declara sanidad sobre tu cuerpo y tu mente.',
    prayer: 'Señor Jesús, reclamo el poder sanador de tus llagas. Restaura la salud de mi cuerpo y la paz de mi espíritu. Amén.',
    recommendedTheme: 'healing',
    accentColor: '#f59e0b',
    keywords: ['isaias 53', 'sanidad', 'llagas', 'enfermedad', 'dolores', 'curacion', 'salud']
  },
  {
    id: 'jeremias-30-17',
    reference: 'Jeremías 30:17',
    book: 'Jeremías',
    category: 'sanidad',
    categoryLabel: '🌿 Sanidad y Salud Divina',
    text: 'Mas yo haré venir sanidad para ti, y sanaré tus heridas, dice Jehová.',
    headerTitle: '¡DIOS HARÁ VENIR SANIDAD PARA TI!',
    blessingQuote: 'Las heridas del pasado y la aflicción de hoy son sanadas por el bálsamo del amor divino.',
    prayer: 'Padre Celestial, confío en tu promesa de sanidad integral para mí y para mis seres queridos. Amén.',
    recommendedTheme: 'healing',
    accentColor: '#a7f3d0',
    keywords: ['jeremias 30', 'sanidad', 'heridas', 'sanare', 'restauracion', 'medico']
  },
  {
    id: 'salmo-103-2',
    reference: 'Salmos 103:2-3',
    book: 'Salmos',
    category: 'sanidad',
    categoryLabel: '🌿 Sanidad y Salud Divina',
    text: 'Bendice, alma mía, a Jehová, y no olvides ninguno de sus beneficios. Él es quien perdona todas tus iniquidades, el que sana todas tus dolencias.',
    headerTitle: '¡EL QUE SANA TODAS TUS DOLENCIAS!',
    blessingQuote: 'No olvides los milagros del Señor. Él renueva tu vigor como el del águila y sana tu ser.',
    prayer: 'Dios bendito, te alabo porque perdonas mis faltas y sanas mis enfermedades con tu mano poderosa. Amén.',
    recommendedTheme: 'healing',
    accentColor: '#34d399',
    keywords: ['salmo 103', 'beneficios', 'dolencias', 'sana', 'perdona', 'alma']
  },
  {
    id: 'exodo-15-26',
    reference: 'Éxodo 15:26',
    book: 'Éxodo',
    category: 'sanidad',
    categoryLabel: '🌿 Sanidad y Salud Divina',
    text: 'Porque yo soy Jehová tu sanador.',
    headerTitle: '¡JEHOVÁ RAFA: TU DIOS SANADOR!',
    blessingQuote: 'El Gran Médico celestial está obrando en tu vida en este instante.',
    prayer: 'Señor Jehová Rafa, me entrego a tu cuidado sanador. Fluye con poder en cada célula de mi cuerpo. Amén.',
    recommendedTheme: 'jesus',
    accentColor: '#fbbf24',
    keywords: ['exodo 15', 'sanador', 'rafa', 'salud', 'medico', 'milagro']
  },

  // --- FORTALEZA, VICTORIA Y FE INQUEBRANTABLE ---
  {
    id: 'filipenses-4-13',
    reference: 'Filipenses 4:13',
    book: 'Filipenses',
    category: 'fortaleza',
    categoryLabel: '🛡️ Fortaleza y Victoria en Cristo',
    text: 'Todo lo puedo en Cristo que me fortalece.',
    headerTitle: '¡TODO LO PUEDO EN CRISTO QUE ME FORTALECE!',
    blessingQuote: 'No estás limitado por tus fuerzas humanas; el poder ilimitado de Jesús habita en ti.',
    prayer: 'Señor Jesús, tomo de tu fortaleza hoy para vencer todo reto y avanzar con valentía. Amén.',
    recommendedTheme: 'cross',
    accentColor: '#fbbf24',
    keywords: ['filipenses 4', 'todo lo puedo', 'fortaleza', 'cristo', 'victoria', 'poder']
  },
  {
    id: 'isaias-40-29',
    reference: 'Isaías 40:29-31',
    book: 'Isaías',
    category: 'fortaleza',
    categoryLabel: '🛡️ Fortaleza y Victoria en Cristo',
    text: 'Él da esfuerzo al cansado, y multiplica las fuerzas al que no tiene ningunas... los que esperan a Jehová tendrán nuevas fuerzas; levantarán alas como las águilas.',
    headerTitle: '¡NUEVAS FUERZAS COMO LAS DEL ÁGUILA!',
    blessingQuote: 'Aunque te sientas sin vigor, Dios multiplica tus fuerzas para que te eleves por encima de la dificultad.',
    prayer: 'Padre Dios, renueva mi espíritu y dame alas de fe para remontarme sobre toda circunstancia. Amén.',
    recommendedTheme: 'dawn',
    accentColor: '#f59e0b',
    keywords: ['isaias 40', 'fuerzas', 'aguilas', 'cansado', 'esperanza', 'renovacion']
  },
  {
    id: 'josue-1-9',
    reference: 'Josué 1:9',
    book: 'Josué',
    category: 'fortaleza',
    categoryLabel: '🛡️ Fortaleza y Victoria en Cristo',
    text: 'Mira que te mando que te esfuerces y seas valiente; no temas ni desmayes, porque Jehová tu Dios estará contigo en dondequiera que vayas.',
    headerTitle: '¡ESFUÉRZATE Y SÉ VALIENTE!',
    blessingQuote: 'Avanza sin miedo. El Dios de las batallas marcha al frente abriendo caminos de triunfo.',
    prayer: 'Señor mi Dios, me visto de tu valentía. Confío en que tú estás a mi lado en cada paso. Amén.',
    recommendedTheme: 'cross',
    accentColor: '#fcd34d',
    keywords: ['josue 1', 'esfuerzate', 'valiente', 'no temas', 'victoria', 'conquista']
  },
  {
    id: 'isaias-41-10',
    reference: 'Isaías 41:10',
    book: 'Isaías',
    category: 'fortaleza',
    categoryLabel: '🛡️ Fortaleza y Victoria en Cristo',
    text: 'No temas, porque yo estoy contigo; no desmayes, porque yo soy tu Dios que te esfuerzo; siempre te ayudaré, siempre te sustentaré con la diestra de mi justicia.',
    headerTitle: '¡SUSTENTADO POR LA DIESTRA DE DIOS!',
    blessingQuote: 'La mano de Dios es más fuerte que cualquier problema. Nunca te soltará ni te dejará caer.',
    prayer: 'Amado Dios, descanso en tu diestra poderosa. Gracias por sustentarme en los momentos de prueba. Amén.',
    recommendedTheme: 'jesus',
    accentColor: '#fbbf24',
    keywords: ['isaias 41', 'no temas', 'diestra', 'justicia', 'sustento', 'ayuda']
  },
  {
    id: 'romanos-8-31',
    reference: 'Romanos 8:31',
    book: 'Romanos',
    category: 'fortaleza',
    categoryLabel: '🛡️ Fortaleza y Victoria en Cristo',
    text: '¿Qué, pues, diremos a esto? Si Dios es por nosotros, ¿quién contra nosotros?',
    headerTitle: '¡SI DIOS ES POR NOSOTROS, ¿QUIÉN CONTRA NOSOTROS?!',
    blessingQuote: 'Tienes de tu lado al Soberano del universo. Ninguna oposición puede derrotar Su propósito en ti.',
    prayer: 'Padre Celestial, declaro que contigo soy más que vencedor. Nada podrá separarme de tu amor. Amén.',
    recommendedTheme: 'cross',
    accentColor: '#f43f5e',
    keywords: ['romanos 8', 'si dios es por nosotros', 'victoria', 'vencedor', 'oposicion']
  },

  // --- PROMESAS DE PAZ, PROSPERIDAD Y ESPERANZA ---
  {
    id: 'jeremias-29-11',
    reference: 'Jeremías 29:11',
    book: 'Jeremías',
    category: 'promesas',
    categoryLabel: '📖 Promesas y Planes de Bendición',
    text: 'Porque yo sé los pensamientos que tengo acerca de vosotros, dice Jehová, pensamientos de paz, y no de mal, para daros el fin que esperáis.',
    headerTitle: '¡PLANES DE PAZ, BIENESTAR Y FUTURO!',
    blessingQuote: 'Dios no ha terminado contigo. Los mejores días de tu vida están por delante en Su voluntad perfecta.',
    prayer: 'Señor Jesús, me rindo a tus planes de paz. Gracias por el futuro bendito que preparas para mí. Amén.',
    recommendedTheme: 'dawn',
    accentColor: '#fcd34d',
    keywords: ['jeremias 29', 'pensamientos de paz', 'futuro', 'esperanza', 'planes', 'promesa']
  },
  {
    id: 'juan-14-27',
    reference: 'Juan 14:27',
    book: 'Juan',
    category: 'paz',
    categoryLabel: '🕊️ Paz Sobrenatural de Cristo',
    text: 'La paz os dejo, mi paz os doy; yo no os la doy como el mundo la da. No se turbe vuestro corazón, ni tenga miedo.',
    headerTitle: '¡LA PAZ DE CRISTO QUE SOBREPASA EL MUNDO!',
    blessingQuote: 'La paz de Jesús no depende de las circunstancias terrenales; es un río inagotable en tu corazón.',
    prayer: 'Príncipe de Paz, calma toda turbación en mi mente y llena mi espíritu de serenidad celestial. Amén.',
    recommendedTheme: 'peace',
    accentColor: '#38bdf8',
    keywords: ['juan 14', 'paz os dejo', 'mi paz os doy', 'no se turbe', 'miedo', 'calma']
  },
  {
    id: 'filipenses-4-6',
    reference: 'Filipenses 4:6-7',
    book: 'Filipenses',
    category: 'paz',
    categoryLabel: '🕊️ Paz Sobrenatural de Cristo',
    text: 'Por nada estéis afanosos, sino sean conocidas vuestras peticiones delante de Dios en toda oración y ruego... Y la paz de Dios guardará vuestros corazones.',
    headerTitle: '¡LA PAZ DE DIOS CUSTODIA TU CORAZÓN!',
    blessingQuote: 'Convierte cada preocupación en oración. Dios responderá con una paz que sobrepasa todo entendimiento.',
    prayer: 'Dios Santo, entrego mis afanes a tus pies. Recibo tu descanso y tu paz sobre mi familia. Amén.',
    recommendedTheme: 'worship',
    accentColor: '#818cf8',
    keywords: ['filipenses 4', 'afan', 'oracion', 'paz de dios', 'peticiones', 'corazon']
  },
  {
    id: 'mateo-11-28',
    reference: 'Mateo 11:28',
    book: 'Mateo',
    category: 'paz',
    categoryLabel: '🕊️ Paz Sobrenatural de Cristo',
    text: 'Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar.',
    headerTitle: '¡VENID A MÍ Y YO OS HARÉ DESCANSAR!',
    blessingQuote: 'Jesús tiene Sus brazos abiertos para aliviar tu carga y renovar tu alma.',
    prayer: 'Señor Jesús, acudo a ti con mis cargas. Recibo tu yugo fácil y descanso en tu amor entrañable. Amén.',
    recommendedTheme: 'jesus',
    accentColor: '#fbbf24',
    keywords: ['mateo 11', 'trabajados', 'cargados', 'descansar', 'alivio', 'yugo']
  },

  // --- BENDICIÓN PARA EL HOGAR Y LA FAMILIA ---
  {
    id: 'josue-24-15',
    reference: 'Josué 24:15',
    book: 'Josué',
    category: 'familia',
    categoryLabel: '🏡 Hogar, Matrimonio y Familia',
    text: 'Pero yo y mi casa serviremos a Jehová.',
    headerTitle: '¡YO Y MI CASA SERVIREMOS AL SEÑOR!',
    blessingQuote: 'Que el altar de Dios se mantenga encendido en tu hogar. Tus generaciones serán bendecidas en la fe.',
    prayer: 'Padre Dios, consagro mi casa, mi cónyuge y mis hijos a tu santo servicio. Reine tu amor en nosotros. Amén.',
    recommendedTheme: 'olive',
    accentColor: '#f59e0b',
    keywords: ['josue 24', 'yo y mi casa', 'familia', 'hogar', 'hijos', 'matrimonio', 'servir']
  },
  {
    id: 'salmo-128-1',
    reference: 'Salmos 128:1-3',
    book: 'Salmos',
    category: 'familia',
    categoryLabel: '🏡 Hogar, Matrimonio y Familia',
    text: 'Bienaventurado todo aquel que teme a Jehová, que anda en sus caminos. Cuando comieres el trabajo de tus manos, bienaventurado serás, y te irá bien.',
    headerTitle: '¡BENDICIÓN Y PROSPERIDAD EN TU HOGAR!',
    blessingQuote: 'El trabajo de tus manos dará fruto abundante y la paz de Dios reinará alrededor de tu mesa.',
    prayer: 'Señor, bendice la labor de mi familia. Multiplica el pan en nuestra mesa y danos armonía. Amén.',
    recommendedTheme: 'olive',
    accentColor: '#34d399',
    keywords: ['salmo 128', 'bienaventurado', 'trabajo de manos', 'familia', 'mesa', 'hijos']
  },
  {
    id: 'proverbios-3-5',
    reference: 'Proverbios 3:5-6',
    book: 'Proverbios',
    category: 'sabiduria',
    categoryLabel: '📖 Sabiduría y Proverbios',
    text: 'Fíate de Jehová de todo tu corazón, y no te apoyes en tu propia prudencia. Reconócelo en todos tus caminos, y él enderezará tus veredas.',
    headerTitle: '¡FÍATE DE JEHOVÁ DE TODO TU CORAZÓN!',
    blessingQuote: 'Cuando consultas a Dios antes de tomar decisiones, Él despeja el camino y abre puertas de bendición.',
    prayer: 'Señor Omnisciente, renuncio a mi autosuficiencia y busco tu dirección sabia para cada proyecto. Amén.',
    recommendedTheme: 'olive',
    accentColor: '#f59e0b',
    keywords: ['proverbios 3', 'fiaté', 'prudencia', 'caminos', 'veredas', 'sabiduria']
  },
  {
    id: 'santiago-1-5',
    reference: 'Santiago 1:5',
    book: 'Santiago',
    category: 'sabiduria',
    categoryLabel: '📖 Sabiduría y Proverbios',
    text: 'Y si alguno de vosotros tiene falta de sabiduría, pídala a Dios, el cual da a todos abundantemente y sin reproche, y le será dada.',
    headerTitle: '¡SABIDURÍA DIVINA EN ABUNDANCIA!',
    blessingQuote: 'Dios derrama luz sobre tus dudas y te concede discernimiento claro para vencer.',
    prayer: 'Padre Celestial, concédeme sabiduría de lo alto para liderar con amor y actuar con rectitud. Amén.',
    recommendedTheme: 'worship',
    accentColor: '#c084fc',
    keywords: ['santiago 1', 'sabiduria', 'abundancia', 'discernimiento', 'pedir']
  },

  // --- ALABANZA, ADORACIÓN Y AGRADECIMIENTO ---
  {
    id: 'salmo-100-1',
    reference: 'Salmos 100:1-3',
    book: 'Salmos',
    category: 'alabanza',
    categoryLabel: '👑 Alabanza y Adoración al Rey',
    text: 'Cantad alegres a Dios, habitantes de toda la tierra. Servid a Jehová con alegría; venid ante su presencia con regocijo. Reconoced que Jehová es Dios; él nos hizo, y no nosotros a nosotros mismos.',
    headerTitle: '¡CANTAD ALEGRES ANTE LA PRESENCIA DE DIOS!',
    blessingQuote: 'Tu gratitud abre los cielos. Alaba a Dios en todo tiempo y verás Su gloria descender.',
    prayer: '¡Aleluya! Dios bendito, me gozo en tu majestad. Eres bueno y para siempre es tu misericordia. Amén.',
    recommendedTheme: 'worship',
    accentColor: '#fbbf24',
    keywords: ['salmo 100', 'cantad alegres', 'alegria', 'regocijo', 'alabanza', 'gratitud']
  },
  {
    id: 'salmo-150-6',
    reference: 'Salmos 150:6',
    book: 'Salmos',
    category: 'alabanza',
    categoryLabel: '👑 Alabanza y Adoración al Rey',
    text: 'Todo lo que respira alabe a JAH. ¡Aleluya!',
    headerTitle: '¡TODO LO QUE RESPIRA ALABE AL SEÑOR!',
    blessingQuote: 'Mientras haya aliento en ti, que haya alabanza en tus labios para el Rey de reyes.',
    prayer: 'Señor Jesús, te entrego mi respiración en adoración sincera. Eres digno de toda gloria. Amén.',
    recommendedTheme: 'worship',
    accentColor: '#fcd34d',
    keywords: ['salmo 150', 'todo lo que respira', 'aleluya', 'alabanza', 'adoracion']
  },
  {
    id: 'salmo-34-1',
    reference: 'Salmos 34:1-3',
    book: 'Salmos',
    category: 'alabanza',
    categoryLabel: '👑 Alabanza y Adoración al Rey',
    text: 'Bendeciré a Jehová en todo tiempo; su alabanza estará de continuo en mi boca. En Jehová se gloriará mi alma; lo oirán los mansos, y se alegrarán. Engrandeced a Jehová conmigo.',
    headerTitle: '¡SU ALABANZA DE CONTINUO EN MI BOCA!',
    blessingQuote: 'Ni la prueba ni el desierto silenciarán tu canto. Dios cambia tu lamento en gozo.',
    prayer: 'Padre Amado, te bendigo en las buenas y en las difíciles. Eres fiel y digno de suprema alabanza. Amén.',
    recommendedTheme: 'worship',
    accentColor: '#f59e0b',
    keywords: ['salmo 34', 'bendecire en todo tiempo', 'alabanza', 'engrandeced', 'gozo']
  },
  {
    id: 'romanos-8-28',
    reference: 'Romanos 8:28',
    book: 'Romanos',
    category: 'promesas',
    categoryLabel: '📖 Promesas y Planes de Bendición',
    text: 'Y sabemos que a los que aman a Dios, todas las cosas les ayudan a bien, esto es, a los que conforme a su propósito son llamados.',
    headerTitle: '¡TODAS LAS COSAS AYUDAN A BIEN!',
    blessingQuote: 'Aun lo que parecía adverso, Dios lo transformará en victoria para bendecir tu vida.',
    prayer: 'Señor, descanso en tu soberanía. Sé que estás orquestando cada detalle para mi bendición. Amén.',
    recommendedTheme: 'cross',
    accentColor: '#fbbf24',
    keywords: ['romanos 8', 'todas las cosas ayudan a bien', 'proposito', 'victoria', 'fe']
  },
  {
    id: 'juan-3-16',
    reference: 'Juan 3:16',
    book: 'Juan',
    category: 'amor',
    categoryLabel: '💖 Amor Incondicional y Salvación',
    text: 'Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna.',
    headerTitle: '¡EL AMOR INCONDICIONAL DE DIOS!',
    blessingQuote: 'Eres infinitamente amado y valorado por el Padre. En Jesús tienes vida eterna y esperanza.',
    prayer: 'Jesús, gracias por dar tu vida por mí en la cruz. Recibo tu amor, tu perdón y tu gracia salvadora. Amén.',
    recommendedTheme: 'cross',
    accentColor: '#f43f5e',
    keywords: ['juan 3', 'de tal manera amo dios', 'hijo unigenito', 'vida eterna', 'salvacion', 'amor']
  }
];

/**
 * Filter library by search query (book, chapter, topic, words)
 */
export function searchBibleVerses(query: string, categoryFilter?: string): BibleVerseItem[] {
  let list = BIBLICAL_VERSES_COLLECTION;

  if (categoryFilter && categoryFilter !== 'all') {
    list = list.filter(item => item.category === categoryFilter);
  }

  if (!query || !query.trim()) {
    return list;
  }

  const q = query.toLowerCase().trim();
  return list.filter(item => {
    return (
      item.reference.toLowerCase().includes(q) ||
      item.book.toLowerCase().includes(q) ||
      item.text.toLowerCase().includes(q) ||
      item.headerTitle.toLowerCase().includes(q) ||
      item.blessingQuote.toLowerCase().includes(q) ||
      item.keywords.some(k => k.toLowerCase().includes(q))
    );
  });
}

/**
 * Returns a random selection of Bible verses from the collection
 */
export function getRandomBibleVerses(count: number = 4): BibleVerseItem[] {
  const shuffled = [...BIBLICAL_VERSES_COLLECTION].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
