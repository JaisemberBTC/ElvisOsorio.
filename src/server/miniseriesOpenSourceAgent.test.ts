import test from 'node:test';
import assert from 'node:assert/strict';
import JSZip from 'jszip';
import {
  buildLocalMiniseriesForTest,
  createConfiguredMiniseriesProvider,
  generateOpenSourceMiniseries
} from './miniseriesOpenSourceAgent.ts';
import { downloadMiniseriesWordDoc } from '../utils/docxMiniseriesExport.ts';
import { BIBLICAL_VIDEO_CREATION_RULE, buildQualityChecklist, SHAREABILITY_RULE } from '../skills/verticalMicrofictionSkill.ts';
import { buildCharacterIdentityPrompt, buildFlowPrompt } from '../utils/flowPromptBuilder.ts';
import { imageGenerationService } from '../services/imageGenerationService.ts';

for (const totalParts of [2, 3, 4, 5]) {
  test(`fallback entrega ${totalParts} capítulos de 50s con cinco prompts Flow`, () => {
    const series = buildLocalMiniseriesForTest({
      topic: 'Una familia aprende a decir la verdad mientras atraviesa una crisis',
      totalParts,
      bibleReference: 'Salmo 34:18'
    });

    assert.equal(series.episodes.length, totalParts);
    assert.equal(series.totalPartsPlanned, totalParts);
    assert.equal(series.characters.length, 2);
    assert.equal(series.seriesBible.continuityLock, true);
    assert.equal(series.seriesBible.biblicalVideoCreationRule, BIBLICAL_VIDEO_CREATION_RULE);
    assert.equal(series.seriesBible.audienceShareabilityRule, SHAREABILITY_RULE);
    assert.equal(series.seriesBible.prePublishChecklist.length, 2);
    assert.equal(new Set(series.episodes.map((episode: any) => episode.hook)).size, totalParts);

    for (const episode of series.episodes) {
      assert.equal(episode.scenes.length, 5);
      assert.ok(episode.contentHash);
      for (const [index, scene] of episode.scenes.entries()) {
        assert.equal(scene.durationSec, 10);
        assert.equal(scene.sceneNumber, index + 1);
        assert.equal(scene.timeframe, `00:${String(index * 10).padStart(2, '0')}–00:${String((index + 1) * 10).padStart(2, '0')}`);
        assert.equal(scene.dialogueExchange.length, 2);
        assert.equal(new Set(scene.dialogueExchange.map((turn: any) => turn.speakerId)).size, 2);
        const wordsPerTurn = scene.dialogueExchange.map((turn: any) => turn.dialogueSpanish.trim().split(/\s+/).filter(Boolean).length);
        const dialogueWords = wordsPerTurn.reduce((count: number, words: number) => count + words, 0);
        assert.ok(dialogueWords >= 19 && dialogueWords <= 20, `El segmento ${scene.sceneNumber} debe tener 19–20 palabras habladas; tiene ${dialogueWords}.`);
        assert.ok(wordsPerTurn.every((words: number) => words >= 9 && words <= 11), `El segmento ${scene.sceneNumber} debe repartir el diálogo en turnos de 9–11 palabras.`);
        assert.equal(Number(scene.dialogueExchange.reduce((seconds: number, turn: any) => seconds + turn.allocatedSeconds, 0).toFixed(1)), 9.2);
        assert.ok(scene.englishPromptWithSpanishDialogue.includes('DURATION & FORMAT'));
        assert.ok(scene.englishPromptWithSpanishDialogue.includes('MASTER CONTINUITY'));
        assert.ok(scene.englishPromptWithSpanishDialogue.includes('EXACT SPOKEN DIALOGUE — LATIN AMERICAN SPANISH ONLY'));
        assert.ok(scene.englishPromptWithSpanishDialogue.includes('ORIGINAL INTEGRATED MUSIC'));
        assert.ok(scene.englishPromptWithSpanishDialogue.includes('exactly 10 seconds'));
        assert.ok(scene.englishPromptWithSpanishDialogue.includes('LOCKED TEXT IDENTITY — VISIBLE CAST'));
        assert.ok(scene.englishPromptWithSpanishDialogue.includes('No external reference image is required'));
        assert.ok(scene.englishPromptWithSpanishDialogue.includes(series.characters[0].name));
        assert.ok(scene.englishPromptWithSpanishDialogue.includes('Never recast'));
        assert.ok(scene.englishPromptWithSpanishDialogue.includes('first spoken word must begin within 0.3 seconds'));
        assert.ok(!scene.englishPromptWithSpanishDialogue.includes('Pixar'));
      }
      assert.ok(episode.socialPackage.tiktokTitle);
      assert.ok(episode.socialPackage.facebookTitle);
      assert.ok(episode.socialPackage.youtubeTitle);
      assert.ok(episode.socialPackage.seoKeywords.length > 0);
      assert.ok(episode.shareabilityPlan.audienceProblemOrDesire);
      assert.ok(episode.shareabilityPlan.rapidTransformation);
      assert.ok(episode.shareabilityPlan.reasonToShare.includes('compañía'));
      assert.ok(episode.shareabilityPlan.metricsToReview.includes('compartidos/envíos'));
      assert.ok(episode.socialPackage.caption.includes('?'));
      assert.ok(episode.socialPackage.pinnedComment.includes('?'));
      assert.ok(episode.hook.trim().split(/\s+/).length <= 8);
      assert.ok(episode.scenes[0].action.includes('At frame 0'));
      assert.ok(episode.scenes[0].dialogueExchange[0].dialogueSpanish.startsWith(episode.hook));
    }
    assert.equal(new Set(series.episodes.map((episode: any) => episode.scenes[0].action)).size, totalParts);
  });
}

test('el agente exige problema intenso, transformación, intención de envío y aprendizaje con datos reales', async () => {
  let capturedSystemPrompt = '';
  const provider = {
    id: 'prompt-capture',
    async completeJSON(systemPrompt: string) {
      capturedSystemPrompt = systemPrompt;
      return {};
    }
  };

  await generateOpenSourceMiniseries({ topic: 'Salmo 27: encontrar valor en medio del miedo', totalParts: 2 }, provider);

  assert.ok(capturedSystemPrompt.includes('problema o deseo intenso'));
  assert.ok(capturedSystemPrompt.includes('hook debe ser fiel al contenido y tener como máximo ocho palabras'));
  assert.ok(capturedSystemPrompt.includes('0–1 s acción y frase gancho'));
  assert.ok(capturedSystemPrompt.includes('primera palabra audible debe ocurrir antes de 0,3 s'));
  assert.ok(capturedSystemPrompt.includes('instrucciones de producción que se incorporan a prompts Flow'));
  assert.ok(capturedSystemPrompt.includes('antigüedad semejante'));
  assert.ok(capturedSystemPrompt.includes('30–40 s significado bíblico'));
  assert.ok(capturedSystemPrompt.includes('40–50 s transformación'));
  assert.ok(capturedSystemPrompt.includes('cambio visual perceptible cada 2–4 s'));
  assert.ok(capturedSystemPrompt.includes('FIDELIDAD BÍBLICA'));
  assert.ok(capturedSystemPrompt.includes('marcar “contenido creado para niños”'));
  assert.ok(capturedSystemPrompt.includes('imposible de ignorar'));
  assert.ok(capturedSystemPrompt.includes('transformación rápida'));
  assert.ok(capturedSystemPrompt.includes('enviarle inmediatamente a otra'));
  assert.ok(capturedSystemPrompt.includes('retención en 0–1 s y 0–3 s'));
  assert.ok(capturedSystemPrompt.includes('nunca inventes analíticas'));
});

test('cada prompt de Flow limita el reparto a quienes aparecen en el segmento', () => {
  const series = buildLocalMiniseriesForTest({ topic: 'Una conversación familiar', totalParts: 2 });
  const episode = series.episodes[0];
  const scene = { ...episode.scenes[0], charactersInShot: [series.characters[0].id, series.characters[1].id] };
  series.characters.push({ ...series.characters[0], id: 'extra-no-visible', name: 'Extra que no aparece' });

  const prompt = buildFlowPrompt(series, episode, scene);
  assert.ok(prompt.includes(series.characters[0].name));
  assert.ok(prompt.includes(series.characters[1].name));
  assert.ok(prompt.includes('Reveal new visual information every 2–4 seconds'));
  assert.ok(prompt.includes('Add complete, large, legible, proofread Spanish subtitles in editing'));
  assert.ok(prompt.includes('first spoken word must begin within 0.3 seconds'));
  assert.ok(!prompt.includes('Extra que no aparece'));
});

test('el prompt maestro textual conserva las anclas de identidad sin exigir imágenes externas', () => {
  const series = buildLocalMiniseriesForTest({ topic: 'Una conversación familiar', totalParts: 2 });
  const character = series.characters[0];
  const prompt = buildCharacterIdentityPrompt(series, character);

  assert.ok(prompt.includes(character.name));
  assert.ok(prompt.includes(character.exactModelSheetLockEn));
  assert.ok(prompt.includes('TEXT IDENTITY BIBLE'));
  assert.ok(prompt.includes('Never recast'));
  assert.ok(prompt.includes('Text-based continuity is sufficient'));
  assert.ok(!prompt.includes('adjuntar una imagen'));
});

test('el proveedor se configura como Ollama o compatible y admite fallback local', () => {
  assert.equal(createConfiguredMiniseriesProvider({ MINISERIES_LLM_PROVIDER: 'local' } as NodeJS.ProcessEnv), null);
  assert.equal(
    createConfiguredMiniseriesProvider({ MINISERIES_LLM_PROVIDER: 'ollama', OLLAMA_BASE_URL: 'http://127.0.0.1:11434' } as NodeJS.ProcessEnv)?.id,
    'ollama'
  );
  assert.equal(
    createConfiguredMiniseriesProvider({ MINISERIES_LLM_PROVIDER: 'openai-compatible', MINISERIES_LLM_BASE_URL: 'http://127.0.0.1:1234/v1' } as NodeJS.ProcessEnv)?.id,
    'openai-compatible'
  );
});

test('el checklist advierte sobre diálogo, evalúa la apertura inmediata y valida la compartibilidad con datos', () => {
  const shortScene = [{ dialogueExchange: [{ dialogueSpanish: 'Tengo miedo.' }, { dialogueSpanish: 'Estoy aquí.' }] }];
  const completeScene = [{
    action: 'At frame 0, a letter falls onto the table.',
    environment: 'A family kitchen',
    camera: 'Close shot',
    dialogueExchange: [
      { dialogueSpanish: 'Le pedí a Dios claridad, no que todo cambiara hoy.', timeWindow: '00:00.0–00:04.6' },
      { dialogueSpanish: 'La fecha de esta foto cambia todo lo que sabíamos.', timeWindow: '00:04.6–00:09.2' }
    ]
  }];
  assert.equal(buildQualityChecklist(shortScene, 'Hook', 'Cierre').presupuestoFonetico.status, 'warning');
  assert.equal(buildQualityChecklist(completeScene, 'Hook', 'Cierre').presupuestoFonetico.status, 'passed');
  assert.equal(buildQualityChecklist(completeScene, 'Hook', 'Cierre').ganchoPrimeros3s.status, 'passed');
  const shareability = buildQualityChecklist(completeScene, 'Hook', 'Cierre').potencialCompartir;
  assert.equal(shareability.status, 'info');
  assert.ok(shareability.detail.includes('compartidos/envíos'));
  assert.ok(shareability.detail.includes('no inventar resultados'));
});

test('el documento Word reúne prompts Flow y metadatos SEO', async () => {
  const series = buildLocalMiniseriesForTest({ topic: 'Miniserie de prueba', totalParts: 2 });
  const originalDocument = (globalThis as any).document;
  const originalWindow = (globalThis as any).window;
  const originalCreateObjectURL = URL.createObjectURL;
  const originalRevokeObjectURL = URL.revokeObjectURL;
  let exportedBlob: Blob | null = null;
  const anchor: any = { click() {}, remove() {} };
  (globalThis as any).document = {
    createElement: () => anchor,
    body: { appendChild() {}, removeChild() {} }
  };
  (globalThis as any).window = { setTimeout() { return 0; } };
  (URL as any).createObjectURL = (blob: Blob) => {
    exportedBlob = blob;
    return 'blob:fe-flow-test';
  };
  (URL as any).revokeObjectURL = () => {};

  try {
    await downloadMiniseriesWordDoc(series);
    assert.ok(exportedBlob, 'Debe crearse el archivo DOCX.');
    const zip = await JSZip.loadAsync(Buffer.from(await exportedBlob!.arrayBuffer()));
    const documentXml = await zip.file('word/document.xml')?.async('text');
    assert.ok(documentXml?.includes('PROMPTS LISTOS PARA FLOW'));
    assert.ok(documentXml?.includes('REGLA EDITORIAL DE COMPARTIBILIDAD'));
    assert.ok(documentXml?.includes('PARÁMETROS DE VIDEO BÍBLICO CORTO'));
    assert.ok(documentXml?.includes('CHECKLIST MANUAL DE PUBLICACIÓN'));
    assert.ok(documentXml?.includes('PLAN DE COMPARTIBILIDAD Y APRENDIZAJE'));
    assert.ok(documentXml?.includes('Motivo para enviarlo'));
    assert.ok(documentXml && /SEO/i.test(documentXml));
    assert.ok(documentXml?.includes('TikTok'));
    assert.ok(documentXml?.includes('EXACT SPOKEN DIALOGUE'));
  } finally {
    (globalThis as any).document = originalDocument;
    (globalThis as any).window = originalWindow;
    (URL as any).createObjectURL = originalCreateObjectURL;
    (URL as any).revokeObjectURL = originalRevokeObjectURL;
  }
});

test('el servicio de imágenes respeta el contrato del catálogo y no informa falsamente que generó una imagen', async () => {
  const originalFetch = (globalThis as any).fetch;
  try {
    (globalThis as any).fetch = async (_url: string, init: any) => {
      const body = JSON.parse(init.body);
      assert.equal(body.scenes[0].sceneNumber, 2);
      assert.equal(body.scenes[0].visualPrompt, 'same character. A quiet scene');
      assert.equal(body.scenes[0].excludeImageUrl, '/sacred-assets/jesus-shepherd.jpg');
      return new Response(JSON.stringify({ success: true, source: 'curated-catalog', images: ['/sacred-assets/jesus-peace.jpg'] }), { status: 200 });
    };
    const success = await imageGenerationService.regenerate('A quiet scene', {
      sceneNumber: 2,
      masterCharacterDescription: 'same character',
      excludeImageUrl: '/sacred-assets/jesus-shepherd.jpg'
    });
    assert.equal(success.success, true);
    assert.equal(success.source, 'curated-catalog');
    assert.equal(success.imageUrl, '/sacred-assets/jesus-peace.jpg');

    (globalThis as any).fetch = async () => new Response(JSON.stringify({ success: false, error: 'catalog unavailable' }), { status: 500 });
    const failure = await imageGenerationService.generate('A retry');
    assert.equal(failure.success, false);
    assert.equal(failure.status, 'error');
    assert.match(failure.errorMessage || '', /catalog unavailable/);
  } finally {
    (globalThis as any).fetch = originalFetch;
  }
});
