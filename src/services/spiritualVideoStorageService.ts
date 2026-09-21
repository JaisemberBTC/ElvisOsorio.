import { 
  SpiritualVideoPackage, 
  PublicationQueueItem, 
  PublicationScheduleConfig,
  SpiritualVideoDuration
} from '../types';

const VIDEOS_STORAGE_KEY = 'fe_oracion_spiritual_videos_v1';
const QUEUE_STORAGE_KEY = 'fe_oracion_publication_calendar_v1';
const CONFIG_STORAGE_KEY = 'fe_oracion_schedule_config_v1';

// Default configuration with user timezone
const DEFAULT_CONFIG: PublicationScheduleConfig = {
  timezone: typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'America/Mexico_City',
  frecuencia: 'diario',
  horariosSugeridos: ['06:30', '12:30', '20:30'],
  diasSugeridos: [0, 1, 2, 3, 4, 5, 6]
};

// Seed samples for immediate demonstration and testing
const SEED_VIDEOS: SpiritualVideoPackage[] = [
  {
    id: 'sp-seed-1',
    titulo: 'Paz para Iniciar tu Día en Victoria',
    tipo: 'oracion',
    duracion_segundos: 20,
    tema: 'comenzar el día con paz',
    gancho: 'Si despertaste con preocupación hoy, detén tus pensamientos por un momento y escucha esto: el Señor va delante de ti abriendo caminos donde no los hay y cuidando tu corazón.',
    guion_narrado: 'Si despertaste con preocupación hoy, detén tus pensamientos por un momento y escucha esto: el Señor va delante de ti abriendo caminos donde no los hay y cuidando tu corazón. Recibe hoy su paz sobrenatural, suelta toda angustia en sus manos y camina con la certeza de que su amor nunca te dejará caer.',
    versiculo: {
      referencia: 'Isaías 45:2',
      texto_o_parafrasis: 'Yo iré delante de ti, y enderezaré los lugares torcidos.',
      traduccion: 'RVR1960'
    },
    escenas: [
      {
        inicio_segundo: 0,
        fin_segundo: 10,
        visual: 'Amanecer dorado resplandeciente sobre colinas serenas con Jesucristo mirando con compasión y ternura infinita',
        narracion: 'Si despertaste con preocupación hoy, detén tus pensamientos por un momento y escucha esto: el Señor va delante de ti abriendo caminos donde no los hay y cuidando tu corazón.',
        texto_pantalla: 'NO TEMAS ESTA MAÑANA',
        palabras_resaltadas: ['NO TEMAS', 'MAÑANA'],
        transicion: 'corte'
      },
      {
        inicio_segundo: 10,
        fin_segundo: 20,
        visual: 'Jesús extendiendo sus manos protectoras con luz celestial de gracia y consuelo sobre tu vida',
        narracion: 'Recibe hoy su paz sobrenatural, suelta toda angustia en sus manos y camina con la certeza de que su amor nunca te dejará caer.',
        texto_pantalla: 'DIOS ABRE CAMINOS',
        palabras_resaltadas: ['DIOS ABRE', 'CAMINOS'],
        transicion: 'zoom_suave'
      }
    ],
    direccion_de_voz: 'Voz cálida de Jesús, serena y pastoral, con cadencia pausada cubriendo mínimo 9 segundos por escena.',
    musica_sugerida: 'Piano suave de adoración con acordes envolventes en Do Mayor.',
    texto_portada: 'Paz para tu mañana',
    descripcion_publicacion: 'Empieza tu día recordando que Dios ya fue delante de ti para pelear tus batallas. Guarda esta oración y compártela con quien necesite paz hoy.',
    hashtags: ['#oracionmatutina', '#pazdedios', '#versiculodeldia', '#fe', '#devocional'],
    llamado_a_la_accion: 'Guarda esta oración para escucharla cada mañana',
    fecha_sugerida: new Date(Date.now() + 86400000).toISOString(),
    estado: 'programado',
    targetAudience: 'general',
    tono: 'esperanzador',
    estiloVisual: 'amanecer',
    vozSeleccionada: 'femenina_calida',
    musicaSeleccionada: 'piano_suave',
    plataforma_destino: 'tiktok',
    created_at: new Date().toISOString()
  },
  {
    id: 'sp-seed-2',
    titulo: 'Vence la Ansiedad en 10 Segundos',
    tipo: 'ansiedad',
    duracion_segundos: 10,
    tema: 'entregar las cargas a Dios',
    gancho: 'Suelta esa pesada carga que te quita el sueño ahora mismo: el Señor cuida de ti con amor eterno, descansa plenamente en sus brazos y recibe su paz viva.',
    guion_narrado: 'Suelta esa pesada carga que te quita el sueño ahora mismo: el Señor cuida de ti con amor eterno, descansa plenamente en sus brazos y recibe su paz viva.',
    versiculo: {
      referencia: '1 Pedro 5:7',
      texto_o_parafrasis: 'Echando toda vuestra ansiedad sobre él, porque él tiene cuidado de vosotros.',
      traduccion: 'RVR1960'
    },
    escenas: [
      {
        inicio_segundo: 0,
        fin_segundo: 10,
        visual: 'Jesucristo caminando junto a un lago en calma al atardecer extendiendo su mano para disipar toda angustia',
        narracion: 'Suelta esa pesada carga que te quita el sueño ahora mismo: el Señor cuida de ti con amor eterno, descansa plenamente en sus brazos y recibe su paz viva.',
        texto_pantalla: 'SUELTA TU CARGA AHORA',
        palabras_resaltadas: ['SUELTA', 'CARGA'],
        transicion: 'corte'
      }
    ],
    direccion_de_voz: 'Voz de Jesús reconfortante, solemne y tierna, durando mínimo 9 segundos reales.',
    musica_sugerida: 'Instrumental de adoración meditativo con cuerdas sutiles.',
    texto_portada: 'Adiós a la ansiedad',
    descripcion_publicacion: 'No cargues solo con lo que Dios prometió llevar en la cruz. Entrega tu noche a Él.',
    hashtags: ['#oracionnocturna', '#ansiedad', '#pazinterior', '#fe', '#jesusteama'],
    llamado_a_la_accion: 'Amén, descansa en Dios',
    fecha_sugerida: new Date(Date.now() + 172800000).toISOString(),
    estado: 'listo',
    targetAudience: 'general',
    tono: 'reconfortante',
    estiloVisual: 'cinematografico',
    vozSeleccionada: 'masculina_pausada',
    musicaSeleccionada: 'adoracion_instrumental',
    plataforma_destino: 'instagram',
    created_at: new Date().toISOString()
  }
];

class SpiritualVideoStorageService {
  // Video packages persistence
  public getAllVideos(): SpiritualVideoPackage[] {
    try {
      const raw = localStorage.getItem(VIDEOS_STORAGE_KEY);
      if (!raw) {
        localStorage.setItem(VIDEOS_STORAGE_KEY, JSON.stringify(SEED_VIDEOS));
        return SEED_VIDEOS;
      }
      return JSON.parse(raw);
    } catch (err) {
      console.warn('Error reading spiritual videos from localStorage', err);
      return SEED_VIDEOS;
    }
  }

  public saveVideo(video: SpiritualVideoPackage): SpiritualVideoPackage {
    const list = this.getAllVideos();
    const existingIndex = list.findIndex(v => v.id === video.id);
    let updatedList: SpiritualVideoPackage[];

    const now = new Date().toISOString();
    const toSave: SpiritualVideoPackage = {
      ...video,
      id: video.id || `spiritual-vid-${Date.now()}`,
      created_at: video.created_at || now,
      updated_at: now
    };

    if (existingIndex >= 0) {
      updatedList = [...list];
      updatedList[existingIndex] = toSave;
    } else {
      updatedList = [toSave, ...list];
    }

    try {
      localStorage.setItem(VIDEOS_STORAGE_KEY, JSON.stringify(updatedList));
      window.dispatchEvent(new CustomEvent('spiritual-videos-updated', { detail: toSave }));
    } catch (err) {
      console.warn('Error saving spiritual video to localStorage', err);
    }

    return toSave;
  }

  public deleteVideo(id: string): void {
    const list = this.getAllVideos();
    const filtered = list.filter(v => v.id !== id);
    try {
      localStorage.setItem(VIDEOS_STORAGE_KEY, JSON.stringify(filtered));
      this.deleteFromQueueByVideoId(id);
      window.dispatchEvent(new CustomEvent('spiritual-videos-updated'));
    } catch (err) {
      console.warn('Error deleting video', err);
    }
  }

  public duplicateVideo(id: string): SpiritualVideoPackage | null {
    const video = this.getAllVideos().find(v => v.id === id);
    if (!video) return null;

    const copy: SpiritualVideoPackage = {
      ...JSON.parse(JSON.stringify(video)),
      id: `spiritual-vid-${Date.now()}`,
      titulo: `${video.titulo} (Copia)`,
      estado: 'borrador',
      created_at: new Date().toISOString()
    };

    return this.saveVideo(copy);
  }

  // Publication Queue (Calendar) methods
  public getPublicationQueue(): PublicationQueueItem[] {
    try {
      const raw = localStorage.getItem(QUEUE_STORAGE_KEY);
      if (!raw) {
        // Initialize default seed queue from seed videos
        const defaultQueue: PublicationQueueItem[] = SEED_VIDEOS.map((vid, idx) => ({
          id: `queue-item-${idx + 1}`,
          videoId: vid.id,
          titulo: vid.titulo,
          tema: vid.tema,
          duracion_segundos: vid.duracion_segundos,
          plataforma: (vid.plataforma_destino || (idx === 0 ? 'tiktok' : 'instagram')) as any,
          fecha_programada: new Date(Date.now() + (idx + 1) * 86400000).toISOString().split('T')[0],
          hora_programada: idx === 0 ? '06:30' : '20:30',
          estado: 'programado',
          videoPackage: vid,
          created_at: new Date().toISOString()
        }));
        localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(defaultQueue));
        return defaultQueue;
      }
      return JSON.parse(raw);
    } catch (err) {
      console.warn('Error reading publication queue from localStorage', err);
      return [];
    }
  }

  public saveQueueItem(item: Partial<PublicationQueueItem> & { videoPackage: SpiritualVideoPackage }): PublicationQueueItem {
    const queue = this.getPublicationQueue();
    const now = new Date().toISOString();
    
    const newItem: PublicationQueueItem = {
      id: item.id || `queue-${Date.now()}`,
      videoId: item.videoPackage.id,
      titulo: item.titulo || item.videoPackage.titulo,
      tema: item.tema || item.videoPackage.tema,
      duracion_segundos: item.duracion_segundos || item.videoPackage.duracion_segundos,
      plataforma: item.plataforma || item.videoPackage.plataforma_destino || 'tiktok',
      fecha_programada: item.fecha_programada || new Date(Date.now() + 86400000).toISOString().split('T')[0],
      hora_programada: item.hora_programada || '06:30',
      estado: item.estado || 'programado',
      videoPackage: item.videoPackage,
      notas: item.notas || '',
      created_at: item.created_at || now
    };

    const existingIdx = queue.findIndex(q => q.id === newItem.id);
    let updatedQueue: PublicationQueueItem[];

    if (existingIdx >= 0) {
      updatedQueue = [...queue];
      updatedQueue[existingIdx] = newItem;
    } else {
      updatedQueue = [newItem, ...queue];
    }

    try {
      localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(updatedQueue));
      window.dispatchEvent(new CustomEvent('publication-queue-updated', { detail: newItem }));
    } catch (err) {
      console.warn('Error saving to publication queue', err);
    }

    return newItem;
  }

  public deleteQueueItem(id: string): void {
    const queue = this.getPublicationQueue();
    const filtered = queue.filter(q => q.id !== id);
    try {
      localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(filtered));
      window.dispatchEvent(new CustomEvent('publication-queue-updated'));
    } catch (err) {
      console.warn('Error deleting queue item', err);
    }
  }

  public deleteFromQueueByVideoId(videoId: string): void {
    const queue = this.getPublicationQueue();
    const filtered = queue.filter(q => q.videoId !== videoId);
    try {
      localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(filtered));
    } catch (err) {
      console.warn('Error deleting from queue by video id', err);
    }
  }

  public duplicateQueueItem(id: string): PublicationQueueItem | null {
    const item = this.getPublicationQueue().find(q => q.id === id);
    if (!item) return null;

    const copy: PublicationQueueItem = {
      ...JSON.parse(JSON.stringify(item)),
      id: `queue-${Date.now()}`,
      titulo: `${item.titulo} (Copia)`,
      estado: 'borrador',
      created_at: new Date().toISOString()
    };

    return this.saveQueueItem(copy);
  }

  public toggleQueueItemPause(id: string): PublicationQueueItem | null {
    const queue = this.getPublicationQueue();
    const target = queue.find(q => q.id === id);
    if (!target) return null;

    target.estado = target.estado === 'pausado' ? 'programado' : 'pausado';
    try {
      localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue));
      window.dispatchEvent(new CustomEvent('publication-queue-updated', { detail: target }));
      return target;
    } catch (err) {
      console.warn('Error updating queue item state', err);
      return null;
    }
  }

  public rescheduleQueueItem(id: string, newDate: string, newTime: string): PublicationQueueItem | null {
    const queue = this.getPublicationQueue();
    const target = queue.find(q => q.id === id);
    if (!target) return null;

    target.fecha_programada = newDate;
    target.hora_programada = newTime;
    target.estado = 'programado';

    try {
      localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue));
      window.dispatchEvent(new CustomEvent('publication-queue-updated', { detail: target }));
      return target;
    } catch (err) {
      console.warn('Error rescheduling queue item', err);
      return null;
    }
  }

  // Schedule Configuration
  public getScheduleConfig(): PublicationScheduleConfig {
    try {
      const raw = localStorage.getItem(CONFIG_STORAGE_KEY);
      if (!raw) return DEFAULT_CONFIG;
      return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
    } catch (err) {
      return DEFAULT_CONFIG;
    }
  }

  public saveScheduleConfig(config: Partial<PublicationScheduleConfig>): PublicationScheduleConfig {
    const current = this.getScheduleConfig();
    const updated = { ...current, ...config };
    try {
      localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.warn('Error saving schedule config', err);
    }
    return updated;
  }

  // Export helpers
  public exportAsJson(video: SpiritualVideoPackage): string {
    return JSON.stringify(video, null, 2);
  }

  public exportAsPlainText(video: SpiritualVideoPackage): string {
    const scenesText = video.escenas.map((sc, i) => (
      `[ESCENA ${i + 1} · ${sc.inicio_segundo}s - ${sc.fin_segundo}s · Transición: ${sc.transicion}]\n` +
      `Visual: ${sc.visual}\n` +
      `Narración: "${sc.narracion}"\n` +
      `Texto en pantalla: ${sc.texto_pantalla} (Palabras resaltadas: ${sc.palabras_resaltadas.join(', ')})\n`
    )).join('\n');

    return `========================================================
TÍTULO: ${video.titulo}
TEMA: ${video.tema}
DURACIÓN: ${video.duracion_segundos} segundos (${video.tipo.toUpperCase()})
ESTADO: ${video.estado.toUpperCase()}
========================================================

GANCHO (0-2s):
"${video.gancho}"

GUION NARRADO COMPLETO:
"${video.guion_narrado}"

VERSÍCULO BÍBLICO (${video.versiculo.traduccion}):
${video.versiculo.referencia} — "${video.versiculo.texto_o_parafrasis}"

DIRECCIÓN DE VOZ:
${video.direccion_de_voz}

MÚSICA SUGERIDA:
${video.musica_sugerida}

PORTADA:
${video.texto_portada}

DESCRIPCIÓN Y REDES:
${video.descripcion_publicacion}

HASHTAGS:
${video.hashtags.join(' ')}

LLAMADO A LA ACCIÓN:
${video.llamado_a_la_accion}

FECHA SUGERIDA DE PUBLICACIÓN:
${video.fecha_sugerida}

--------------------------------------------------------
DESGLOSE DE ESCENAS VERTICALES 9:16:
--------------------------------------------------------
${scenesText}
========================================================`;
  }

  // Duration word count validator according to prompt rules (guarantees >=9s voice)
  public validateDurationRules(durationSec: SpiritualVideoDuration, narratedText: string): {
    isValid: boolean;
    wordCount: number;
    expectedRange: [number, number];
    message: string;
  } {
    const words = narratedText.trim().split(/\s+/).filter(Boolean);
    const count = words.length;

    // Minimum 22 words per 10-second scene covers at least 9 seconds of spoken voice
    const ranges: Record<SpiritualVideoDuration, [number, number]> = {
      10: [22, 28],
      15: [22, 35],
      20: [44, 56],
      30: [66, 84],
      40: [88, 112],
      60: [132, 168]
    };

    const range = ranges[durationSec] || [22, 28];
    const isValid = count >= range[0] && count <= range[1];

    let message = `Duración ${durationSec}s: ${count} palabras (Objetivo: ${range[0]}–${range[1]} palabras · Voz mín. 9s).`;
    if (count < range[0]) {
      message += ` Faltan aprox. ${range[0] - count} palabras para asegurar los 9s mínimos de voz.`;
    } else if (count > range[1]) {
      message += ` Excede por ${count - range[1]} palabras. Se recomienda mantener pausas compasivas.`;
    } else {
      message += ` ¡Perfectamente calibrado para cubrir mínimo 9 segundos con unción y cadencia solemne!`;
    }

    return { isValid, wordCount: count, expectedRange: range, message };
  }

  // Basic Self-Tests Suite as required by Acceptance Criteria #10
  public runSelfTests(): {
    testName: string;
    passed: boolean;
    details: string;
  }[] {
    const results = [];

    // Test 1: Duration Ranges (min 9s voice requires 22-28 words)
    try {
      const v10 = this.validateDurationRules(10, 'Uno dos tres cuatro cinco seis siete ocho nueve diez once doce trece catorce quince dieciséis diecisiete dieciocho diecinueve veinte veintiuno veintidós');
      results.push({
        testName: '1. Validación de Regla de Duración 10s (22-28 palabras para voz mín. 9s)',
        passed: v10.isValid && v10.wordCount === 22,
        details: `Conteo: ${v10.wordCount} palabras. Rango esperado: 22-28. Resultado: ${v10.isValid ? 'Correcto' : 'Fallo'}`
      });
    } catch (e: any) {
      results.push({ testName: '1. Validación de Regla de Duración 10s', passed: false, details: e.message });
    }

    // Test 2: Scene timing continuity (10s continuous blocks)
    try {
      const seed = SEED_VIDEOS[0];
      const scenes = seed.escenas;
      let continuous = true;
      for (let i = 0; i < scenes.length; i++) {
        const sc = scenes[i];
        const sceneDuration = sc.fin_segundo - sc.inicio_segundo;
        if (sceneDuration < 10) continuous = false;
        if (i > 0 && sc.inicio_segundo !== scenes[i - 1].fin_segundo) continuous = false;
      }
      results.push({
        testName: '2. Escenas Temporizadas en Bloques de 10 Segundos y Continuidad',
        passed: continuous,
        details: `Todas las escenas divididas en bloques continuos de 10s sin huecos ni solapamientos.`
      });
    } catch (e: any) {
      results.push({ testName: '2. Escenas Temporizadas', passed: false, details: e.message });
    }

    // Test 3: Local Storage Persistence & Retrieval
    try {
      const testVid: SpiritualVideoPackage = {
        ...SEED_VIDEOS[0],
        id: 'test-self-check-vid',
        titulo: 'Test Self Check'
      };
      this.saveVideo(testVid);
      const retrieved = this.getAllVideos().find(v => v.id === 'test-self-check-vid');
      const pass = !!retrieved && retrieved.titulo === 'Test Self Check';
      this.deleteVideo('test-self-check-vid');
      results.push({
        testName: '3. Persistencia de Borradores y Proyectos en Almacenamiento Local',
        passed: pass,
        details: `Guardado, lectura y limpieza completados satisfactoriamente.`
      });
    } catch (e: any) {
      results.push({ testName: '3. Persistencia en Almacenamiento', passed: false, details: e.message });
    }

    // Test 4: Programación y Calendario
    try {
      const queueItem = this.saveQueueItem({
        id: 'test-queue-item',
        titulo: 'Test Queue',
        tema: 'Paz',
        duracion_segundos: 15,
        videoPackage: SEED_VIDEOS[0],
        plataforma: 'tiktok',
        fecha_programada: '2026-09-10',
        hora_programada: '06:30',
        estado: 'programado'
      });
      const found = this.getPublicationQueue().some(q => q.id === 'test-queue-item');
      this.deleteQueueItem('test-queue-item');
      results.push({
        testName: '4. Creación y Manejo de Cola de Programación del Calendario',
        passed: found,
        details: `Elemento de cola programado registrado con fecha, hora y plataforma.`
      });
    } catch (e: any) {
      results.push({ testName: '4. Cola de Programación', passed: false, details: e.message });
    }

    return results;
  }
}

export const spiritualVideoStorage = new SpiritualVideoStorageService();
