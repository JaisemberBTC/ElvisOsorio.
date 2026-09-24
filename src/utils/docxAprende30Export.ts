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
import { Aprende30SeriesTemplate } from '../types';

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
        size: 22
      })
    ]
  });
}

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

export function buildAprende30WordDocument(series: Aprende30SeriesTemplate): Document {
  const episodes = series.episodes || [];

  const doc = new Document({
    creator: 'Aprende en 30 Segundos Studio',
    title: series.seriesTitle || 'Serie Aprende en 30 Segundos',
    description: series.logline || 'Micro-cápsulas educativas de alto impacto',
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: 'APRENDE EN 30 SEGUNDOS — DOSSIER DE PRODUCCIÓN',
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            run: { bold: true, color: 'D97706', size: 36, font: 'Calibri' }
          }),

          createHeading('1. FICHA TÉCNICA DE LA SERIE', HeadingLevel.HEADING_1, 'D97706'),
          createKeyValueP('Título de la Serie', series.seriesTitle || 'Aprende en 30 Segundos'),
          createKeyValueP('Categoría', series.categoryLabel || series.category || 'General'),
          createKeyValueP('Total de Episodios', `${episodes.length} episodios planificados`),
          createKeyValueP('Hook / Gancho Superior', series.bannerHook || '🔴 APRENDE EN 30s'),
          createKeyValueP('Audiencia Objetivo', series.targetAudience || 'Emprendedores y creadores'),
          createKeyValueP('Logline', series.logline || 'Contenido viral ultra-retentivo'),

          createHeading('2. GUIONES Y PROMPTS POR EPISODIO', HeadingLevel.HEADING_1, 'D97706'),

          ...episodes.flatMap((ep, epIdx) => [
            createHeading(`EPISODIO ${ep.episodeNumber || epIdx + 1}: ${ep.episodeTitle || 'Sin título'}`, HeadingLevel.HEADING_2, 'B45309'),
            createKeyValueP('Gancho Superior (Top Banner)', ep.banner_hook_superior || series.bannerHook || ''),
            createKeyValueP('Gancho Inicial (0-3s)', ep.hook || ''),
            createKeyValueP('Conflicto / Problema (3-12s)', ep.conflict || ''),
            createKeyValueP('Secreto Revelado / Valor (12-25s)', ep.secretRevealed || ''),
            createKeyValueP('Cierre Viral / Cliffhanger (25-30s)', ep.cliffhanger || ''),

            createP('Escenas de 10 segundos:', { bold: true, color: '0F172A', spacingAfter: 80 }),
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [createP('Escena / Tiempo', { bold: true, color: 'FFFFFF' })],
                      shading: { fill: 'D97706', type: ShadingType.CLEAR, color: 'auto' }
                    }),
                    new TableCell({
                      children: [createP('Narración / Diálogo (Cadencia Oral)', { bold: true, color: 'FFFFFF' })],
                      shading: { fill: 'D97706', type: ShadingType.CLEAR, color: 'auto' }
                    }),
                    new TableCell({
                      children: [createP('Prompt Visual IA (Kling / Runway)', { bold: true, color: 'FFFFFF' })],
                      shading: { fill: 'D97706', type: ShadingType.CLEAR, color: 'auto' }
                    })
                  ]
                }),
                ...(ep.scenes || []).map((sc, scIdx) =>
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [createP(`Escena ${sc.sceneNumber || scIdx + 1}\n[00:${String(sc.inicio_segundo ?? scIdx * 10).padStart(2, '0')}-00:${String(sc.fin_segundo ?? (scIdx + 1) * 10).padStart(2, '0')}]`)]
                      }),
                      new TableCell({
                        children: [createP(sc.narration || '')]
                      }),
                      new TableCell({
                        children: [createP(sc.visualPrompt || '')]
                      })
                    ]
                  })
                )
              ]
            }),

            createP('Social Media & SEO:', { bold: true, color: '0F172A', spacingAfter: 60 }),
            createKeyValueP('Título YouTube Shorts', ep.socialPackage?.youtubeTitle || ''),
            createKeyValueP('Título TikTok', ep.socialPackage?.tiktokTitle || ''),
            createKeyValueP('Hashtags', (ep.socialPackage?.hashtags || []).join(' ')),
            createKeyValueP('Comentario Fijado', ep.socialPackage?.pinnedComment || ''),
            new Paragraph({ spacing: { after: 200 } })
          ])
        ]
      }
    ]
  });

  return doc;
}

export async function downloadAprende30WordDoc(series: Aprende30SeriesTemplate): Promise<{ success: boolean; fileName: string }> {
  try {
    const doc = buildAprende30WordDocument(series);
    const blob = await Packer.toBlob(doc);
    const cleanTitle = (series.seriesTitle || 'Aprende30')
      .replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ_-]/g, '_')
      .slice(0, 40);
    const fileName = `${cleanTitle}_Aprende30_Guion_y_Prompts.docx`;

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
  } catch (err) {
    console.error('Error generating Aprende30 Word document:', err);
    throw err;
  }
}
