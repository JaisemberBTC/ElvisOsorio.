import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { buildFlowPrompt } from './flowPromptBuilder';

const text = (value: unknown, fallback = '—') => typeof value === 'string' && value.trim() ? value.trim() : fallback;

function field(label: string, value: unknown): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({ text: `${label}: `, bold: true }),
      new TextRun(text(value))
    ]
  });
}

function plain(value: string): Paragraph {
  return new Paragraph({ text: value });
}

export async function downloadMiniseriesWordDoc(series: any): Promise<void> {
  const title = text(series?.seriesTitle, 'Miniserie de Fe');
  const logline = text(series?.logline, '');
  const episodes = Array.isArray(series?.episodes) ? series.episodes : [];
  const bible = series?.seriesBible || {};
  const world = bible.worldBible || {};
  const audio = bible.audioBible || {};
  const children: Paragraph[] = [
    new Paragraph({ text: title, heading: HeadingLevel.TITLE }),
    field('Sinopsis', logline),
    field('Tema', text(bible.theme, series?.categoryLabel || 'Fe, oración y esperanza')),
    field('Referencia bíblica', text(bible.bibleReference || series?.bibleReference, 'Definir con el usuario')),
    field('Nota bíblica', text(bible.bibleUseNote, 'No atribuir paráfrasis como cita textual.')),
    field('Formato', `${episodes.length} capítulos · 50 segundos por capítulo · cinco prompts de 10 segundos · vertical 9:16`),
    plain('Cada prompt de la sección FLOW_PROMPTS es autónomo: copia un segmento completo y pégalo en Flow. El agente entrega instrucciones para imagen, actuación y audio; el resultado audiovisual depende del generador de destino.'),
    new Paragraph({ text: 'BIBLIA DE CONTINUIDAD', heading: HeadingLevel.HEADING_1 }),
    field('Entorno', text(world.location || series?.lockedEnvironmentName)),
    field('Época y arquitectura', text(world.eraAndArchitecture || world.architecture)),
    field('Paleta e iluminación', text(world.palette || world.lighting)),
    field('Regla de continuidad', text(world.continuityRule, 'Mantener identidad, vestuario, voces, entorno y utilería entre segmentos.')),
    field('Música original de la serie', text(audio.originalScore || audio.genre)),
    field('Mezcla de audio', text(audio.mixNotes)),
    new Paragraph({ text: 'PERSONAJES', heading: HeadingLevel.HEADING_2 })
  ];

  (Array.isArray(series?.characters) ? series.characters : []).forEach((character: any) => {
    children.push(
      field(text(character.name, 'Personaje'), character.role),
      field('Identidad visual fija', character.visualIdentity || character.shortDescription || character.exactModelSheetLockEn),
      field('Vestuario y accesorios', `${text(character.wardrobe || character.clothingStyle)}; ${text(character.accessories)}`),
      field('Voz', character.voice || character.voiceProfile?.tone)
    );
  });

  episodes.forEach((episode: any, episodeIndex: number) => {
    const seo = episode?.socialPackage || {};
    children.push(
      new Paragraph({ text: `CAPÍTULO ${episode.episodeNumber || episodeIndex + 1}: ${text(episode.episodeTitle, 'Sin título')}`, heading: HeadingLevel.HEADING_1 }),
      field('Duración', '50 segundos'),
      field('Hook de apertura', episode.hook),
      field('Objetivo', episode.objective),
      field('Conflicto', episode.conflict),
      field('Giro', episode.twist),
      field('Cierre / cliffhanger', episode.cliffhanger),
      new Paragraph({ text: 'SEO Y PUBLICACIÓN', heading: HeadingLevel.HEADING_2 }),
      field('Título para TikTok', seo.tiktokTitle),
      field('Título para Facebook', seo.facebookTitle),
      field('Título para YouTube Shorts', seo.youtubeTitle),
      field('Descripción / caption', seo.caption),
      field('Palabras clave', Array.isArray(seo.seoKeywords) ? seo.seoKeywords.join(', ') : seo.seoKeywords),
      field('Consultas de búsqueda', Array.isArray(seo.searchQueries) ? seo.searchQueries.join(' · ') : seo.searchQueries),
      field('Hashtags', Array.isArray(seo.hashtags) ? seo.hashtags.join(' ') : seo.hashtags),
      field('Hook de portada', seo.thumbnailHook),
      field('Comentario fijado', seo.pinnedComment),
      field('Dirección de audio sugerida', seo.suggestedAudio),
      new Paragraph({ text: 'PROMPTS LISTOS PARA FLOW', heading: HeadingLevel.HEADING_2 })
    );

    const scenes = Array.isArray(episode?.scenes) ? episode.scenes : [];
    scenes.forEach((scene: any, sceneIndex: number) => {
      const prompt = text(
        scene?.flowPrompt || scene?.englishPromptWithSpanishDialogue || scene?.imageToVideoPrompt,
        buildFlowPrompt(series, episode, scene)
      );
      children.push(
        new Paragraph({
          text: `C${String(episode.episodeNumber || episodeIndex + 1).padStart(2, '0')}-S${String(scene.sceneNumber || sceneIndex + 1).padStart(2, '0')} · 00:${String(sceneIndex * 10).padStart(2, '0')}–00:${String((sceneIndex + 1) * 10).padStart(2, '0')} · 10 segundos`,
          heading: HeadingLevel.HEADING_3
        })
      );
      prompt.split(/\n\s*\n/).forEach((section: string) => {
        if (section.trim()) children.push(plain(section.trim()));
      });
      children.push(plain(''));
    });
  });

  const doc = new Document({ sections: [{ children }] });
  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  const safeTitle = title.replace(/[^A-Za-z0-9áéíóúñÁÉÍÓÚÑ\s-]/g, '').trim().replace(/\s+/g, '_') || 'Miniserie_de_Fe';
  anchor.href = url;
  anchor.download = `${safeTitle}_Prompts_Flow_SEO.docx`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
