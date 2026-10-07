import test from 'node:test';
import assert from 'node:assert/strict';
import JSZip from 'jszip';
import {
  buildLocalMiniseriesForTest,
  createConfiguredMiniseriesProvider
} from './miniseriesOpenSourceAgent.ts';
import { downloadMiniseriesWordDoc } from '../utils/docxMiniseriesExport.ts';
import { buildQualityChecklist } from '../skills/verticalMicrofictionSkill.ts';
import { buildCharacterIdentityPrompt, buildFlowPrompt } from '../utils/flowPromptBuilder.ts';

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
        assert.ok(scene.englishPromptWithSpanishDialogue.includes('CONTINUIDAD MAESTRA'));
        assert.ok(scene.englishPromptWithSpanishDialogue.includes('DIÁLOGO EXACTO EN ESPAÑOL LATINOAMERICANO'));
        assert.ok(scene.englishPromptWithSpanishDialogue.includes('9,2 de los 10 segundos'));
        assert.ok(scene.englishPromptWithSpanishDialogue.includes('MÚSICA ORIGINAL'));
        assert.ok(scene.englishPromptWithSpanishDialogue.includes('10 segundos'));
        assert.ok(scene.englishPromptWithSpanishDialogue.includes('IDENTIDAD BLOQUEADA POR TEXTO'));
        assert.ok(scene.englishPromptWithSpanishDialogue.includes('No se requiere una imagen externa'));
        assert.ok(scene.englishPromptWithSpanishDialogue.includes(series.characters[0].name));
        assert.ok(scene.englishPromptWithSpanishDialogue.toLocaleLowerCase('es').includes('sin cambio de actor'));
        assert.ok(!scene.englishPromptWithSpanishDialogue.includes('Pixar'));
      }
      assert.ok(episode.socialPackage.tiktokTitle);
      assert.ok(episode.socialPackage.facebookTitle);
      assert.ok(episode.socialPackage.youtubeTitle);
      assert.ok(episode.socialPackage.seoKeywords.length > 0);
    }
  });
}

test('cada prompt de Flow limita el reparto a quienes aparecen en el segmento', () => {
  const series = buildLocalMiniseriesForTest({ topic: 'Una conversación familiar', totalParts: 2 });
  const episode = series.episodes[0];
  const scene = { ...episode.scenes[0], charactersInShot: [series.characters[0].id, series.characters[1].id] };
  series.characters.push({ ...series.characters[0], id: 'extra-no-visible', name: 'Extra que no aparece' });

  const prompt = buildFlowPrompt(series, episode, scene);
  assert.ok(prompt.includes(series.characters[0].name));
  assert.ok(prompt.includes(series.characters[1].name));
  assert.ok(!prompt.includes('Extra que no aparece'));
});

test('el prompt maestro textual conserva las anclas de identidad sin exigir imágenes externas', () => {
  const series = buildLocalMiniseriesForTest({ topic: 'Una conversación familiar', totalParts: 2 });
  const character = series.characters[0];
  const prompt = buildCharacterIdentityPrompt(series, character);

  assert.ok(prompt.includes(character.name));
  assert.ok(prompt.includes(character.exactModelSheetLockEn));
  assert.ok(prompt.includes('BIBLIA TEXTUAL DE IDENTIDAD'));
  assert.ok(prompt.includes('recastees'));
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

test('el checklist advierte si el diálogo no alcanza el objetivo de voz continua', () => {
  const shortScene = [{ dialogueExchange: [{ dialogueSpanish: 'Tengo miedo.' }, { dialogueSpanish: 'Estoy aquí.' }] }];
  const completeScene = [{ dialogueExchange: [{ dialogueSpanish: 'Le pedí a Dios claridad, no que todo cambiara hoy.' }, { dialogueSpanish: 'La fecha de esta foto cambia todo lo que sabíamos.' }] }];
  assert.equal(buildQualityChecklist(shortScene, 'Hook', 'Cierre').presupuestoFonetico.status, 'warning');
  assert.equal(buildQualityChecklist(completeScene, 'Hook', 'Cierre').presupuestoFonetico.status, 'passed');
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
    assert.ok(documentXml && /SEO/i.test(documentXml));
    assert.ok(documentXml?.includes('TikTok'));
    assert.ok(documentXml?.includes('DIÁLOGO EXACTO EN ESPAÑOL LATINOAMERICANO'));
  } finally {
    (globalThis as any).document = originalDocument;
    (globalThis as any).window = originalWindow;
    (URL as any).createObjectURL = originalCreateObjectURL;
    (URL as any).revokeObjectURL = originalRevokeObjectURL;
  }
});
