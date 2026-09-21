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
import { Aprende30SeriesTemplate, Aprende30SeriesEpisode, Aprende30Package } from '../types';

// Helper to create a styled section title
function createHeading(text: string, level: (typeof HeadingLevel)[keyof typeof HeadingLevel] = HeadingLevel.HEADING_1, color: string = 'DC2626') {
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

// Helper for callout boxes (prompts or warnings)
function createPromptBox(title: string, content: string, borderColor: string = 'DC2626') {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 8, color: 'CBD5E1' },
      bottom: { style: BorderStyle.SINGLE, size: 8, color: 'CBD5E1' },
      left: { style: BorderStyle.SINGLE, size: 24, color: borderColor },
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
                    color: '991B1B',
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

export function buildAprende30WordDocument(series: Aprende30SeriesTemplate | Aprende30Package): Document {
  // Normalize either single package or multi-part series
  const isSeries = 'episodes' in series && Array.isArray((series as Aprende30SeriesTemplate).episodes);
  const seriesTitle = isSeries 
    ? (series as Aprende30SeriesTemplate).seriesTitle 
    : (series as Aprende30Package).titulo;
  const episodes: Aprende30SeriesEpisode[] = isSeries
    ? (series as Aprende30SeriesTemplate).episodes
    : [
        {
          episodeNumber: 1,
          episodeTitle: (series as Aprende30Package).titulo,
          durationSec: 30,
          banner_hook_superior: (series as Aprende30Package).banner_hook_superior,
          hook: (series as Aprende30Package).gancho_inicial,
          conflict: (series as Aprende30Package).escenas[0]?.narration || '',
          secretRevealed: (series as Aprende30Package).escenas[1]?.narration || '',
          cliffhanger: (series as Aprende30Package).llamado_accion,
          scenes: (series as Aprende30Package).escenas,
          socialPackage: {
            youtubeTitle: (series as Aprende30Package).titulo,
            tiktokTitle: (series as Aprende30Package).banner_hook_superior,
            facebookTitle: (series as Aprende30Package).titulo,
            caption: (series as Aprende30Package).descripcion_youtube,
            hashtags: (series as Aprende30Package).hashtags,
            pinnedComment: (series as Aprende30Package).llamado_accion
          },
          tarjeta_flash: (series as Aprende30Package).tarjeta_flash
        }
      ];

  const logline = isSeries 
    ? (series as Aprende30SeriesTemplate).logline 
    : (series as Aprende30Package).gancho_inicial;
  const categoryLabel = isSeries 
    ? (series as Aprende30SeriesTemplate).categoryLabel 
    : (series as Aprende30Package).categoria;

  const doc = new Document({
    creator: '@Aprendeen30segundos Flow Studio',
    title: seriesTitle,
    description: `Guion Maestro, Planos Calibrados de 10s, Prompts en Inglés y Kit SEO para @Aprendeen30segundos`,
    sections: [
      {
        properties: {},
        children: [
          // PORTADA PRINCIPAL
          new Paragraph({
            text: 'BIBLIA DE PRODUCCIÓN & GUION MAESTRO EN 30 SEGUNDOS',
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 100 },
            run: {
              color: 'DC2626',
              bold: true,
              font: 'Calibri',
              size: 28
            }
          }),
          new Paragraph({
            text: seriesTitle.toUpperCase(),
            alignment: AlignmentType.CENTER,
            spacing: { after: 150 },
            run: {
              color: '0F172A',
              bold: true,
              font: 'Calibri',
              size: 36
            }
          }),
          new Paragraph({
            text: `Canal Oficial: @Aprendeen30segundos • Formato Vertical 9:16 (Shorts, Reels, TikTok)\n${episodes.length} Parte(s) / Capítulo(s) de 30 Segundos • Entrega Completa Dividida`,
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
          createHeading('1. FICHA TÉCNICA Y AUDITORÍA DE RETENCIÓN', HeadingLevel.HEADING_1, 'DC2626'),
          createKeyValueP('Canal Oficial', '@Aprendeen30segundos (https://www.youtube.com/@Aprendeen30segundos)'),
          createKeyValueP('Categoría', categoryLabel),
          createKeyValueP('Sinopsis / Logline', logline),
          createKeyValueP('Estructura', `${episodes.length} Parte(s) de 30 segundos cada una (${episodes.length * 3} planos de 10s en total)`),
          createKeyValueP('Fórmula de Retención', 'Gancho brutal 0-3s + Caja Roja Superior 🔴 + Clips de 10s + Cero Silencios + Subtítulos CapCut + SFX cada 2s'),
          createKeyValueP('Motores de Video Compatibles', 'Kling AI 10s, Runway Gen-3 10s, Luma Dream Machine 10s, Google Veo 10s'),

          // CAPÍTULOS / PARTES DIVIDIDAS
          createHeading('2. DESGLOSE COMPLETO POR CAPÍTULOS / PARTES', HeadingLevel.HEADING_1, 'DC2626'),

          ...episodes.flatMap((ep, epIdx) => [
            new Paragraph({
              text: `PARTE ${ep.episodeNumber}: ${ep.episodeTitle.toUpperCase()}`,
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 260, after: 100 },
              run: {
                color: '991B1B',
                bold: true,
                font: 'Calibri',
                size: 26
              }
            }),

            createKeyValueP('Cartel Fijo Superior (Caja Roja 🔴)', ep.banner_hook_superior || '🔴 APRENDE EN 30 SEGUNDOS', 'DC2626'),
            createKeyValueP('Gancho Disruptivo (0 a 3s)', ep.hook, 'D97706'),
            createKeyValueP('Conflicto / Mito Común', ep.conflict || 'El error que el 95% de las personas comete sin darse cuenta.'),
            createKeyValueP('Secreto / Técnica Revelada', ep.secretRevealed || 'El truco o principio psicológico clave.'),
            createKeyValueP('Cierre Viral / Llamado a la Acción', ep.cliffhanger, '2563EB'),

            new Paragraph({
              text: `Planos Calibrados de 10 Segundos con Diálogo en Español y Prompts en Inglés:`,
              spacing: { before: 140, after: 80 },
              run: { bold: true, color: '1E293B', font: 'Calibri', size: 22 }
            }),

            ...(ep.scenes || []).flatMap((sc, scIdx) => {
              const narrationDialogue = (sc.narration || '').trim();
              let fullVideoPrompt = sc.visualPrompt || sc.masterVideoPrompt || 'High quality cinematic 9:16 vertical video with dramatic lighting';
              if (narrationDialogue && !fullVideoPrompt.includes(narrationDialogue)) {
                const speechClause = ` The character looks directly into camera speaking clearly and expressively in Spanish: "${narrationDialogue}" with realistic mouth lip sync, natural facial articulation and steady eye contact.`;
                fullVideoPrompt = fullVideoPrompt.endsWith('.') ? `${fullVideoPrompt}${speechClause}` : `${fullVideoPrompt}.${speechClause}`;
              }

              return [
                new Paragraph({
                  text: `Plano ${sc.sceneNumber || (scIdx + 1)} [${sc.inicio_segundo ?? scIdx * 10}s - ${sc.fin_segundo ?? (scIdx + 1) * 10}s] • Duración: ${sc.durationSec || 10}s`,
                  spacing: { before: 120, after: 60 },
                  run: { bold: true, color: '4338CA', font: 'Calibri', size: 20 }
                }),
                createKeyValueP('Texto en Pantalla', sc.onScreenText || 'CONCEPTO CLAVE', '475569'),
                createKeyValueP('Locución en Español (Cero Silencios)', sc.narration, '0F172A'),
                createKeyValueP('Cámara / Movimiento', sc.cameraMovement || 'Zoom In dinámico', '64748B'),
                createKeyValueP('SFX & Audio', sc.sfx || 'Whoosh digital cada 2 segundos', '059669'),
                createPromptBox(
                  `Prompt para Motor de Video (Kling / Runway / Luma / Veo con Diálogo en Español para Lip-Sync) - Plano ${sc.sceneNumber || (scIdx + 1)}`,
                  fullVideoPrompt
                )
              ];
            }),

            // KIT SEO Y REDES DEL CAPÍTULO
            new Paragraph({
              text: `Kit de Redes Sociales & SEO - Parte ${ep.episodeNumber}:`,
              spacing: { before: 160, after: 80 },
              run: { bold: true, color: '1E293B', font: 'Calibri', size: 22 }
            }),
            createKeyValueP('Título YouTube Shorts', ep.socialPackage?.youtubeTitle || ep.episodeTitle),
            createKeyValueP('Título TikTok', ep.socialPackage?.tiktokTitle || ep.banner_hook_superior),
            createKeyValueP('Hashtags', (ep.socialPackage?.hashtags || []).join(' ')),
            createKeyValueP('Comentario Fijado (Retención & Suscripción)', ep.socialPackage?.pinnedComment || ep.cliffhanger),

            // TARJETA FLASH INFOGRÁFICA SI EXISTE
            ...(ep.tarjeta_flash ? [
              new Paragraph({
                text: `Tarjeta Flash Infográfica para Comunidad / Instagram:`,
                spacing: { before: 140, after: 60 },
                run: { bold: true, color: 'B45309', font: 'Calibri', size: 20 }
              }),
              createKeyValueP('Título Tarjeta', ep.tarjeta_flash.titulo),
              createKeyValueP('Subtítulo', ep.tarjeta_flash.subtitulo),
              createKeyValueP('Error Común', ep.tarjeta_flash.errorComun),
              createKeyValueP('Puntos Clave', (ep.tarjeta_flash.puntosClave || []).join(' | ')),
              createKeyValueP('Acción Inmediata', ep.tarjeta_flash.accionInmediata),
              createKeyValueP('Axioma / Cita Maestra', ep.tarjeta_flash.quoteDestacada)
            ] : []),

            new Paragraph({
              text: '------------------------------------------------------------------------------------------------------------------------',
              spacing: { before: 160, after: 160 },
              run: { color: 'CBD5E1' }
            })
          ]),

          // GUÍA DE MONTAJE Y MEZCLA CAPCUT
          createHeading('3. GUÍA DE EDICIÓN Y MEZCLA CAPCUT', HeadingLevel.HEADING_1, 'DC2626'),
          createP('1. Aspect Ratio: 9:16 Vertical estricto (1080x1920).'),
          createP('2. Pacing: 0 cortes en negro. Cada transición entre clips de 10s debe usar Match Cut, Whip Pan o Zoom In acelerado.'),
          createP('3. Subtítulos: Tipografía The Bold Font / Montserrat Black en color amarillo vibrante (#FFE500) o blanco puro con borde negro de 4px.'),
          createP('4. Efectos de Sonido: Agregar un sonido suave cada 2 a 3 segundos (whoosh, click, pop, camera shutter) para reiniciar el patrón de atención.'),
          createP('5. Caja Roja Superior: Mantener el cartel "🔴 [TÍTULO EN 30s]" fijo durante todo el video en la parte superior para maximizar el CTR y el scroll-stop.'),
          createP('6. Suscripción: Animar el botón de campana y @Aprendeen30segundos en los segundos 26 a 30.')
        ]
      }
    ]
  });

  return doc;
}

export async function downloadAprende30WordDoc(series: Aprende30SeriesTemplate | Aprende30Package): Promise<void> {
  const doc = buildAprende30WordDocument(series);
  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const isSeries = 'episodes' in series && Array.isArray((series as Aprende30SeriesTemplate).episodes);
  const title = isSeries 
    ? (series as Aprende30SeriesTemplate).seriesTitle 
    : (series as Aprende30Package).titulo;
  const cleanTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 40);
  a.download = `aprende30s_${cleanTitle}_guion_maestro.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
