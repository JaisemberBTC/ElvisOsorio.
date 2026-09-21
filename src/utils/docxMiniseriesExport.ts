import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  ShadingType
} from 'docx';
import { MiniserieTemplate, CARTOON_CHARACTERS_FE } from '../data/cartoonCharactersFe';
import { GeneratedMiniseriesPackage } from '../server/miniseriesGenerator';

// Helper to create a styled section title
function createHeading(text: string, level: (typeof HeadingLevel)[keyof typeof HeadingLevel] = HeadingLevel.HEADING_1, color: string = '1E293B') {
  return new Paragraph({
    text,
    heading: level,
    spacing: { before: 240, after: 120 },
    run: {
      color,
      bold: true,
      font: 'Calibri'
    }
  });
}

// Helper to create regular paragraph
function createP(text: string, options?: { bold?: boolean; italic?: boolean; color?: string; spacingAfter?: number }) {
  return new Paragraph({
    spacing: { after: options?.spacingAfter ?? 100 },
    children: [
      new TextRun({
        text,
        bold: options?.bold ?? false,
        italics: options?.italic ?? false,
        color: options?.color ?? '334155',
        font: 'Calibri',
        size: 22 // 11pt
      })
    ]
  });
}

// Helper for key-value labels
function createKeyValueP(label: string, value: string, labelColor: string = '0F172A') {
  return new Paragraph({
    spacing: { after: 80 },
    children: [
      new TextRun({
        text: `${label}: `,
        bold: true,
        color: labelColor,
        font: 'Calibri',
        size: 22
      }),
      new TextRun({
        text: value,
        color: '334155',
        font: 'Calibri',
        size: 22
      })
    ]
  });
}

// Helper for code / prompt callout box
function createPromptBox(title: string, content: string) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 8, color: 'CBD5E1' },
      bottom: { style: BorderStyle.SINGLE, size: 8, color: 'CBD5E1' },
      left: { style: BorderStyle.SINGLE, size: 24, color: 'D97706' }, // Amber accent
      right: { style: BorderStyle.SINGLE, size: 8, color: 'CBD5E1' }
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            shading: { type: ShadingType.CLEAR, fill: 'F8FAFC' },
            margins: { top: 120, bottom: 120, left: 160, right: 160 },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `📌 ${title}`,
                    bold: true,
                    color: 'B45309',
                    font: 'Calibri',
                    size: 20
                  })
                ]
              }),
              new Paragraph({
                spacing: { before: 60 },
                children: [
                  new TextRun({
                    text: content,
                    font: 'Consolas',
                    size: 18,
                    color: '1E293B'
                  })
                ]
              })
            ]
          })
        ]
      })
    ]
  });
}

export function buildMiniseriesWordDocument(series: MiniserieTemplate | GeneratedMiniseriesPackage): Document {
  const episodes = series.episodes || [];
  const primaryChars = (series.primaryCharacterIds || []).map(id => {
    return CARTOON_CHARACTERS_FE.find(c => c.id === id) || {
      id,
      name: id === 'jesus_cartoon_3d' ? 'Maestro Jesús' : 'Personaje Principal',
      role: 'Protagonista',
      lockedWardrobeDesc: 'Vestuario animado 3D de fe',
      voiceProfile: { tone: 'Voz emotiva y clara' },
      exactModelSheetLockEn: 'High quality 3D animated character model'
    };
  });

  const scenography = (series as any).scenographyDirection;

  const doc = new Document({
    creator: 'Espacio de Fe & Oración - Miniseries Studio',
    title: series.seriesTitle || 'Miniserie de Fe',
    description: `Biblia de Producción, Dirección de Escenografía, Guion Completo, Prompts y Kit SEO para la miniserie: ${series.seriesTitle}`,
    sections: [
      {
        properties: {},
        children: [
          // PORTADA / HEADER PRINCIPAL
          new Paragraph({
            text: 'BIBLIA DE PRODUCCIÓN & GUION MAESTRO CINEMATOGRÁFICO',
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 100 },
            run: {
              color: 'B45309',
              bold: true,
              font: 'Calibri',
              size: 28
            }
          }),
          new Paragraph({
            text: (series.seriesTitle || 'Miniserie de Fe').toUpperCase(),
            alignment: AlignmentType.CENTER,
            spacing: { after: 150 },
            run: {
              color: '0F172A',
              bold: true,
              font: 'Calibri',
              size: 38
            }
          }),
          new Paragraph({
            text: `Formato: Serie Animada 3D Cinemática Vertical (9:16) • Estilo Pixar / DreamWorks de Alta Gama\n${episodes.length} Capítulos Divididos • Presencia Activa de Jesús de Nazaret`,
            alignment: AlignmentType.CENTER,
            spacing: { after: 240 },
            run: {
              italics: true,
              color: '475569',
              font: 'Calibri',
              size: 20
            }
          }),

          // RESUMEN EJECUTIVO
          createHeading('1. FICHA TÉCNICA Y RESUMEN DE LA SERIE', HeadingLevel.HEADING_1, '1E3A8A'),
          createKeyValueP('Logline / Sinopsis', series.logline || 'Miniserie de fe serializada donde Jesús interviene de forma sobrenatural.'),
          createKeyValueP('Categoría', series.categoryLabel || series.category || 'Milagro de Fe'),
          createKeyValueP('Gancho de Banner (CTR)', series.bannerHook || 'LO QUE JESÚS HIZO EN EL MOMENTO MÁS OSCURO'),
          createKeyValueP('Total de Capítulos', `${episodes.length} partes planificadas (5 escenas de 10s continuas cada una = ~50s por capítulo)`),
          createKeyValueP('Escenario Base Bloqueado', series.lockedEnvironmentName || 'Habitación / Entorno Familiar de Fe'),

          new Paragraph({ spacing: { after: 200 } }),

          // DIRECCIÓN DE ESCENOGRAFÍA Y NARRATIVA VISUAL (LOS 7 PRINCIPIOS)
          createHeading('2. DIRECCIÓN DE ESCENOGRAFÍA & NARRATIVA VISUAL (LOS 7 PRINCIPIOS DEL DIRECTOR)', HeadingLevel.HEADING_1, '92400E'),
          createP('En esta producción animada 3D, la escenografía no es un fondo decorativo: es un personaje vivo que cuenta la historia y traduce las emociones del alma a través de la arquitectura, los objetos simbólicos y la luz divina.'),

          // Principio 1: Análisis del Guion
          createHeading('2.1. Análisis del Guion y el Espacio', HeadingLevel.HEADING_2, '0F172A'),
          createKeyValueP('¿Dónde Ocurre?', scenography?.scriptAnalysis?.location || series.lockedEnvironmentName || 'Hogar humilde con detalles rústicos y elementos de fe familiar.'),
          createKeyValueP('¿En qué Época?', scenography?.scriptAnalysis?.historicalEra || 'Atemporal / Bíblica contemporánea con resonancia universal.'),
          createKeyValueP('¿Quién Habita el Lugar?', scenography?.scriptAnalysis?.whoInhabits || 'Una familia o creyente en profunda prueba que busca a Dios en oración.'),
          createKeyValueP('¿Qué Situación Ocurre?', scenography?.scriptAnalysis?.currentSituation || 'Una crisis humana que agota las fuerzas naturales y demanda un milagro de Jesús.'),
          createKeyValueP('¿Qué Emoción Transmite?', scenography?.scriptAnalysis?.conveyedEmotion || 'Inicia en dolor y aflicción desgarradora, evoluciona hacia asombro, reverencia y paz celestial.'),
          createKeyValueP('Objetos Clave Narrativos', (scenography?.scriptAnalysis?.keyNarrativeObjects || ['Biblia familiar', 'Lámpara de luz tenue', 'Mesa de madera rústica', 'Silla vacía de clamor']).join(', ')),

          // Principio 2: Visión del Director
          createHeading('2.2. Visión del Director y Estilo Animado', HeadingLevel.HEADING_2, '0F172A'),
          createKeyValueP('Tono Dramático', scenography?.directorsVision?.tone || 'Drama espiritual con clímax sobrenatural de consuelo y milagro divino.'),
          createKeyValueP('Estilo Visual Obligatorio', scenography?.directorsVision?.animationStyle || 'Animación 3D estilo Pixar / Disney de última generación con iluminación volumétrica Octane 8K, texturas orgánicas en madera y tela, y aura dorada para la manifestación de Jesús.'),
          createKeyValueP('Atmósfera', scenography?.directorsVision?.atmosphere || 'Cinematográfica, intimista, pasando de sombras frías de prueba al resplandor cálido de la presencia de Dios.'),

          // Principio 3: Identidad Visual
          createHeading('2.3. Identidad Visual Coherente', HeadingLevel.HEADING_2, '0F172A'),
          createKeyValueP('Paleta de Colores Primaria', (scenography?.visualIdentity?.dominantColors || ['Azul medianoche profundo (#0F172A)', 'Marrón roble añejo (#78350F)', 'Dorado celestial (#F59E0B)', 'Blanco marfil lino (#F8FAFC)']).join(' • ')),
          createKeyValueP('Mobiliario y Materiales', scenography?.visualIdentity?.furnitureTypes || 'Mesa rústica de madera maciza con vetas visibles, sillas sencillas de pino, vasijas de barro cocido, telas de lino crudo.'),
          createKeyValueP('Diseño de Iluminación', scenography?.visualIdentity?.lightingDesign || 'Contraluz dramático con claroscuro en el inicio. Luz de luna entrando por ventana en la aflicción; haz de luz divina cálida volumétrica a 3200K cuando Jesús entra en escena.'),

          // Principio 4: Espacio de Cada Personaje
          createHeading('2.4. El Espacio de Cada Personaje', HeadingLevel.HEADING_2, '0F172A'),
          createP('• Personaje en Aflicción: Se sitúa de rodillas junto a la mesa austera o al borde de la cama, en el punto de sombra de la habitación, simbolizando soledad y quebranto.'),
          createP('• Jesús de Nazaret: Aparece rompiendo la penumbra con un suave resplandor áureo; su posición en el cuadro eleva la mirada y baña el entorno con reflejos dorados en las paredes y el suelo.'),

          // Principio 5: Objetos Narrativos
          createHeading('2.5. Objetos que Cuentan la Historia (Elementos Narrativos)', HeadingLevel.HEADING_2, '0F172A'),
          createP('• La Biblia Familiar: Al inicio de la serie permanece cerrada sobre la mesa desgastada (mostrando la prueba y el silencio de Dios); durante el encuentro se abre y sus hojas reflejan la luz divina.'),
          createP('• La Vela o Lámpara de Aceite: Su mecha vacila en la escena de mayor conflicto y clamor; tras la palabra de Jesús, la llama se aviva firme y proyecta calor en todo el recinto.'),
          createP('• La Cruz Tallada de Madera: Visible en la pared de fondo en todos los ángulos, garantizando la continuidad espacial e indicando que el hogar pertenece a Cristo.'),

          // Principio 6: Evolución del Escenario a través de los Capítulos
          createHeading('2.6. Evolución del Escenario de la Aflicción a la Restauración', HeadingLevel.HEADING_2, '0F172A'),
          createP('• Capítulo 1 (El Clamor en la Aflicción): Espacio sombrío con tonos fríos y sombras largas. Desorden sutil que exterioriza el dolor interno. La luz es tenue y proviene solo de una vela o luna fría.'),
          createP('• Capítulo 2 (El Encuentro Sobrenatural): La luz dorada de Jesús irrumpe por el umbral o ventana, tiñendo las paredes de ámbar y contrastando poderosamente con la oscuridad previa.'),
          createP('• Capítulo 3 / Final (El Milagro Cumplido y Restauración): Luz plena de amanecer y gloria celestial; la mesa está ordenada, la atmósfera irradia paz y los colores se vuelven cálidos y vivientes.'),

          // Principio 7: Coordinación de Departamentos
          createHeading('2.7. Coordinación Escenografía, Vestuario e Iluminación', HeadingLevel.HEADING_2, '0F172A'),
          createP('Todo elemento visual está enlazado matemáticamente: el blanco marfil y azul cielo del vestuario de Jesús resalta sobre las maderas oscuras del fondo; la música de piano en 432Hz acompaña el ritmo del movimiento de cámara vertical lento y respetuoso.'),

          new Paragraph({ spacing: { after: 200 } }),

          // SECCIÓN 3: PERSONAJES Y MODEL SHEETS
          createHeading('3. PERSONAJES PRINCIPALES & MODEL SHEETS 3D BLOQUEADOS', HeadingLevel.HEADING_1, '1E3A8A'),
          ...primaryChars.map(char => [
            createHeading(`Personaje: ${char.name} (${char.role})`, HeadingLevel.HEADING_2, '0F172A'),
            createKeyValueP('Vestuario Bloqueado', char.lockedWardrobeDesc || 'Vestuario idéntico en todos los planos'),
            createKeyValueP('Perfil de Voz', (char.voiceProfile as any)?.tone || 'Voz cálida y expresiva'),
            createPromptBox(`Model Sheet DNA Bloqueado para IA (${char.name})`, char.exactModelSheetLockEn || '3D Pixar style character'),
            new Paragraph({ spacing: { after: 120 } })
          ]).flat(),

          // SECCIÓN 4: GUION CAPÍTULO POR CAPÍTULO
          createHeading('4. GUION TÉCNICO, PLANOS DE 10s Y PROMPTS CINEMATOGRÁFICOS', HeadingLevel.HEADING_1, '1E3A8A'),
          ...episodes.map(episode => [
            createHeading(`CAPÍTULO ${episode.episodeNumber}: ${episode.episodeTitle.toUpperCase()}`, HeadingLevel.HEADING_2, '92400E'),
            createKeyValueP('Gancho de Retención (00:00 - 00:02)', episode.hook),
            createKeyValueP('Conflicto Dramático', episode.conflict),
            createKeyValueP('Escalada Emocional', episode.escalation),
            createKeyValueP('Cliffhanger / Cierre de Retención', episode.cliffhanger),
            createKeyValueP('Escenografía en este Capítulo', episode.scenographyStage?.environmentState || series.lockedEnvironmentName || 'Entorno familiar de fe'),

            new Paragraph({ spacing: { before: 100, after: 80 } }),

            createP(`PLANOS SECUENCIALES DEL CAPÍTULO ${episode.episodeNumber} (5 Planos Continuos de 10s con Interacción):`, { bold: true, color: '1E293B' }),

            ...(episode.scenes || []).map(sc => [
              createHeading(`Plano ${sc.sceneNumber} (${sc.timeframe || '10s'}) • [${sc.onScreenText || 'MINISERIE'}]`, HeadingLevel.HEADING_3, '0F172A'),
              createKeyValueP('Personajes en Cuadro', (sc.charactersInShot || []).join(', ')),
              createKeyValueP('Tipo de Interacción', sc.interactionType || 'Interacción cara a cara'),
              createKeyValueP('Acción Dramática', sc.action || ''),
              createP('Diálogo Sincronizado en Español:', { bold: true, color: '475569' }),
              ...(sc.dialogueExchange || []).map(d => 
                createP(`   🗣️ ${d.speakerName} [${d.emotionalTone}]: "${d.dialogueSpanish}"`, { italic: true })
              ),
              createKeyValueP('Efectos de Sonido (SFX)', sc.sfx || 'SFX cinemáticos de fe'),
              createKeyValueP('Música de Fondo (Mood)', sc.bgMusicMood || 'Piano en 432Hz'),
              createPromptBox(`Prompt Cinemático en Inglés (Flow / Runway / Kling / Sora / Midjourney) - Plano ${sc.sceneNumber}`, sc.englishPromptWithSpanishDialogue || sc.imageToVideoPrompt || ''),
              new Paragraph({ spacing: { after: 120 } })
            ]).flat(),

            new Paragraph({ spacing: { after: 180 } })
          ]).flat(),

          // SECCIÓN 5: ESTRATEGIA SEO CAPÍTULO POR CAPÍTULO
          createHeading('5. ESTRATEGIA SEO Y REDES SOCIALES CAPÍTULO POR CAPÍTULO', HeadingLevel.HEADING_1, '1E3A8A'),
          ...episodes.map(episode => [
            createHeading(`KIT SEO Y ALGORITMO - PARTE ${episode.episodeNumber}`, HeadingLevel.HEADING_2, '92400E'),
            createKeyValueP('Título YouTube Shorts / Video (Alto CTR)', episode.socialPackage?.youtubeTitle || `🔴 Parte ${episode.episodeNumber}`),
            createKeyValueP('Título Facebook Reels & TikTok', episode.socialPackage?.facebookTitle || episode.socialPackage?.tiktokTitle || `Lo que Jesús hizo en la Parte ${episode.episodeNumber}`),
            createKeyValueP('Gancho de Miniatura / Portada', episode.socialPackage?.thumbnailHook || `LO QUE JESÚS HIZO CUANDO NO HABÍA ESPERANZA • CAPÍTULO ${episode.episodeNumber}`),
            createKeyValueP('Palabras Clave SEO (Search Queries)', (episode.socialPackage?.seoKeywords || episode.socialPackage?.searchQueries || ['Jesús milagros', 'serie cristiana animada', 'clamor en la noche', 'Dios responde oracion']).join(', ')),
            createKeyValueP('Hashtags Estratégicos', (episode.socialPackage?.hashtags || ['#MiniserieDeFe', `#Parte${episode.episodeNumber}`, '#Jesus', '#MilagroDeDios']).join(' ')),
            createP('Descripción / Caption Completa:', { bold: true, color: '0F172A' }),
            createP(episode.socialPackage?.caption || 'Mira lo que Jesús hizo en esta historia.', { italic: true }),
            createP('Comentario Fijado Estratégico (High Engagement):', { bold: true, color: '0F172A' }),
            createP(episode.socialPackage?.pinnedComment || 'Escribe tu clamor aquí abajo. Amén.', { italic: true }),
            new Paragraph({ spacing: { after: 200 } })
          ]).flat()
        ]
      }
    ]
  });

  return doc;
}

/**
 * Downloads the complete miniseries Word document (.docx) to the user's computer.
 */
export async function downloadMiniseriesWordDoc(series: MiniserieTemplate | GeneratedMiniseriesPackage) {
  try {
    const doc = buildMiniseriesWordDocument(series);
    const blob = await Packer.toBlob(doc);
    const cleanTitle = (series.seriesTitle || 'Miniserie_de_Fe')
      .replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ_-]/g, '_')
      .slice(0, 40);
    const fileName = `${cleanTitle}_Guion_Prompts_y_SEO.docx`;

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1500);

    return { success: true, fileName };
  } catch (err: any) {
    console.error('Error generating Word document:', err);
    throw err;
  }
}
