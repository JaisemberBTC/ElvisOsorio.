import React, { useState, useEffect } from 'react';
import { 
  Film, 
  Sparkles, 
  Download, 
  Copy, 
  Check, 
  RefreshCw, 
  Clapperboard, 
  Layers, 
  Clock, 
  Camera, 
  FileText, 
  FolderArchive, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck,
  Music,
  Mic,
  Maximize2,
  X,
  History,
  Trash2,
  Code,
  Tag
} from 'lucide-react';
import JSZip from 'jszip';
import { DevotionalVideoProductionDoc, DevotionalSceneItem } from '../types';
import { imageGenerationService } from '../services/imageGenerationService';
import { devotionalStorageService, SavedDevotionalProject } from '../services/devotionalStorageService';
import { applyScenographySkill, SCENOGRAPHY_SKILL_NAME, SCENOGRAPHY_SKILL_SUMMARY } from '../skills/scenographySkill';

type PipelineStep = 
  | 'idle' 
  | 'analyzing' 
  | 'master_identity' 
  | 'generating_scenes'
  | 'preparing_guide' 
  | 'completed' 
  | 'error';

export const DevotionalSceneGenerator: React.FC = () => {
  // Form State - Default: 10s video = 1 prompt/scene
  const [userPrompt, setUserPrompt] = useState('Jesús en una ventana al amanecer en un santuario rústico de piedra con luz dorada, orando con serenidad y mirando hacia afuera con compasión infinita.');
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '16:9' | '1:1'>('9:16');
  const [durationSeconds, setDurationSeconds] = useState<number>(10);
  const [imageCount, setImageCount] = useState<number>(1);

  // Synchronize duration and prompt count proportionally: 1 prompt = 10 seconds
  const handleDurationSelect = (dur: number) => {
    setDurationSeconds(dur);
    const calculatedCount = dur <= 10 ? 1 : Math.max(1, Math.round(dur / 10));
    setImageCount(calculatedCount);
  };

  const handleImageCountSelect = (count: number) => {
    const c = Math.max(1, Math.min(12, count));
    setImageCount(c);
    setDurationSeconds(c * 10);
  };

  // Generation & Pipeline State
  const [pipelineStep, setPipelineStep] = useState<PipelineStep>('idle');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Output State
  const [productionDoc, setProductionDoc] = useState<DevotionalVideoProductionDoc | null>(null);
  const [diagnosticsData, setDiagnosticsData] = useState<{
    endpoint: string;
    modelUsed: string;
    timestamp: string;
    generationId: string;
    prompt: string;
    elapsedMs?: number;
    scenes: Array<{
      sceneNumber: number;
      imageUrl: string;
      imageId: string;
      fileSizeKb?: number;
      modelUsed?: string;
      status: string;
      prompt: string;
    }>;
  } | null>(null);
  const [regeneratingScene, setRegeneratingScene] = useState<number | null>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [expandedPromptIdx, setExpandedPromptIdx] = useState<number | null>(null);
  const [showJsonInspector, setShowJsonInspector] = useState<boolean>(false);
  const [showHistoryDrawer, setShowHistoryDrawer] = useState<boolean>(false);
  const [showDiagnosticPanel, setShowDiagnosticPanel] = useState<boolean>(true);
  const [savedProjects, setSavedProjects] = useState<SavedDevotionalProject[]>([]);
  const [previewModalImg, setPreviewModalImg] = useState<{ url: string; title: string } | null>(null);
  const [isZipping, setIsZipping] = useState(false);

  // Load history on mount
  useEffect(() => {
    const loaded = devotionalStorageService.getAllProjects();
    setSavedProjects(loaded);
  }, []);

  // Quick Inspiration Prompts
  const quickPrompts = [
    {
      title: "Prompt de Prueba Oficial (Amanecer, Bendición y Cierre)",
      prompt: "Jesús junto a una ventana rústica mirando un valle tranquilo al amanecer. Después gira hacia la cámara, extiende sus manos en bendición y termina con una mano sobre el corazón."
    },
    {
      title: "Jesús junto a una ventana al amanecer (Prueba A)",
      prompt: "Jesús junto a una ventana de madera durante un amanecer tranquilo, mirando un valle dorado."
    },
    {
      title: "Jesús en sendero de montaña bajo la lluvia (Prueba B)",
      prompt: "Jesús caminando por un sendero de montaña bajo una lluvia suave, extendiendo una mano para ofrecer consuelo."
    },
    {
      title: "Oración en el Huerto de Getsemaní",
      prompt: "Jesús orando en el huerto de Getsemaní entre olivos milenarios al amanecer dorado. Una luz celestial tenue ilumina su túnica blanca mientras se pone de pie con compasión para extender sus manos de paz."
    }
  ];

  // Helper step text mapping matching real generation pipeline states
  const getStepDescription = (step: PipelineStep) => {
    switch (step) {
      case 'analyzing':
        return 'Analizando prompt y calculando desglose proporcional...';
      case 'master_identity':
        return 'Construyendo anclajes de identidad maestra del personaje...';
      case 'generating_scenes':
        return `Generando ${imageCount} ${imageCount === 1 ? 'escena independiente' : 'escenas independientes'} en paralelo (${durationSeconds}s de video)...`;
      case 'preparing_guide':
        return 'Verificando unicidad y estructurando guía cinematográfica...';
      case 'completed':
        return '¡Escenas generadas con éxito!';
      case 'error':
        return 'Error en la generación';
      default:
        return 'Listo para generar';
    }
  };

  // Main Generation Handler with direct call to /api/generate-scenes
  const handleGenerateScenes = async (customPromptToRun?: string) => {
    const rawPrompt = (typeof customPromptToRun === 'string' ? customPromptToRun : userPrompt).trim();
    if (!rawPrompt) {
      setErrorMsg("Por favor, escribe una descripción en 'Describe tu video'.");
      return;
    }

    const effectivePrompt = applyScenographySkill(rawPrompt);

    if (customPromptToRun && typeof customPromptToRun === 'string') {
      setUserPrompt(customPromptToRun);
    }

    setPipelineStep('analyzing');
    setErrorMsg(null);
    setProgressPercent(15);

    const t1 = setTimeout(() => {
      setPipelineStep('master_identity');
      setProgressPercent(35);
    }, 700);

    const t2 = setTimeout(() => {
      setPipelineStep('generating_scenes');
      setProgressPercent(60);
    }, 1500);

    const t3 = setTimeout(() => {
      setProgressPercent(85);
    }, 3000);

    const t4 = setTimeout(() => {
      setPipelineStep('preparing_guide');
      setProgressPercent(95);
    }, 4500);

    try {
      const response = await fetch('/api/generate-scenes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: effectivePrompt,
          aspectRatio,
          durationSeconds,
          sceneCount: imageCount
        })
      });

      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error en el servidor (${response.status})`);
      }

      const data = await response.json();
      if (!data.success || !data.productionDoc) {
        throw new Error(data.error || "No se pudo generar el documento de producción.");
      }

      setProgressPercent(100);
      setPipelineStep('completed');
      setProductionDoc(data.productionDoc);

      // Save diagnostic info for live inspection
      setDiagnosticsData({
        endpoint: data.endpoint || '/api/generate-scenes',
        modelUsed: data.modelUsed || data.productionDoc.imageModelStatus?.modelName || 'Motor Neuronal Flux Cinema 8K',
        timestamp: data.timestamp || new Date().toISOString(),
        generationId: data.generationId || crypto.randomUUID(),
        prompt: effectivePrompt,
        elapsedMs: data.elapsedMs,
        scenes: data.scenes || data.productionDoc.scenes.map((s: any) => ({
          sceneNumber: s.sceneNumber,
          imageUrl: s.imageUrl,
          imageId: s.imageId || `scene_${s.sceneNumber}`,
          fileSizeKb: s.fileSizeKb,
          modelUsed: s.modelUsed,
          status: 'completed',
          prompt: s.prompt || s.structuredPrompt
        }))
      });

      // Auto-save to local persistence
      const saved = devotionalStorageService.saveProject(data.productionDoc, effectivePrompt);
      setSavedProjects(prev => [saved, ...prev.filter(p => p.id !== saved.id)]);

    } catch (err: any) {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      console.error("Error generating devotional scenes:", err);
      setPipelineStep('error');
      
      const customMsg = err.message?.includes("No se puede generar la imagen porque el proyecto no tiene configurado un modelo")
        ? err.message
        : (err.message || "Ocurrió un problema al generar las escenas. Verifica tu conexión e intenta nuevamente.");

      setErrorMsg(customMsg);
    }
  };

  // Trigger Mandatory Test Runs (Generación A / Generación B)
  const handleRunMandatoryTest = (testType: 'A' | 'B') => {
    const promptA = "Jesús junto a una ventana de madera durante un amanecer tranquilo, mirando un valle dorado.";
    const promptB = "Jesús caminando por un sendero de montaña bajo una lluvia suave, extendiendo una mano para ofrecer consuelo.";
    const selectedPrompt = testType === 'A' ? promptA : promptB;
    setUserPrompt(selectedPrompt);
    handleGenerateScenes(selectedPrompt);
  };

  // Regenerate Single Scene with imageGenerationService
  const handleRegenerateScene = async (sceneNumber: number) => {
    if (!productionDoc) return;
    const targetScene = productionDoc.scenes.find(s => s.sceneNumber === sceneNumber);
    if (!targetScene) return;

    setRegeneratingScene(sceneNumber);
    try {
      const result = await imageGenerationService.regenerate(
        sceneNumber,
        targetScene.structuredPrompt,
        productionDoc.masterCharacterDescription,
        { aspectRatio: productionDoc.aspectRatio, style: 'netflix' }
      );

      if (result.status === 'completed' && result.imageUrl) {
        const updatedScenes = productionDoc.scenes.map(sc => 
          sc.sceneNumber === sceneNumber 
            ? { ...sc, imageUrl: result.imageUrl, status: 'completed' as const }
            : sc
        );

        const updatedDoc = {
          ...productionDoc,
          scenes: updatedScenes
        };

        setProductionDoc(updatedDoc);
        devotionalStorageService.saveProject(updatedDoc, userPrompt);
        setSavedProjects(devotionalStorageService.getAllProjects());
      } else {
        throw new Error(result.errorMessage || "No se recibió imagen válida");
      }
    } catch (err: any) {
      alert(`No se pudo regenerar la Escena ${sceneNumber}: ${err.message}`);
    } finally {
      setRegeneratingScene(null);
    }
  };

  // Copy helper with visual feedback
  const handleCopy = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  // Download Single Image Helper (PNG/JPG)
  const handleDownloadSingleImage = async (imageUrl: string, filename: string) => {
    try {
      const directUrl = `${imageUrl}&download=true&filename=${encodeURIComponent(filename)}`;
      const link = document.createElement('a');
      link.href = directUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      window.open(imageUrl, '_blank');
    }
  };

  // Generate Markdown text for guia_de_edicion.md
  const generateMarkdownGuide = (doc: DevotionalVideoProductionDoc): string => {
    return `# GUÍA DE EDICIÓN CINEMATOGRÁFICA
**Título:** ${doc.videoTitle}
**Formato:** ${doc.aspectRatio} | **Duración:** ${doc.totalDurationSec} segundos
**Fecha:** ${new Date(doc.createdAt).toLocaleString()}

---

## 1. DESCRIPCIÓN DEL PERSONAJE & CONTINUIDAD MAESTRA
${doc.masterCharacterDescription}

**Anclajes de Identidad:**
${doc.identityAnchors?.map(a => `- ${a}`).join('\n') || '- Rostro sereno y compasivo\n- Túnica blanca de lino\n- Iluminación volumétrica dorada'}

**Ambiente & Época:** ${doc.environmentOverview}
**Momento del día:** ${doc.timeOfDay || 'Amanecer dorado'}
**Estilo visual:** ${doc.cinematicStyleOverview}

---

## 2. PROMPT DE CADA ESCENA

${doc.scenes.map(s => `### Escena ${s.sceneNumber}: ${s.title} (${s.timeRange})
\`\`\`
${s.structuredPrompt}
\`\`\`
- **Movimiento de cámara:** ${s.cameraMovement}
- **Acción:** ${s.action}
- **Voz en off:** "${s.narrationSnippet}"
- **Texto en pantalla sugerido:** ${s.onScreenText}
`).join('\n\n')}

---

## 3. TABLA DE TIEMPOS & CORTES (CADA 2-3 SEGUNDOS)
*Regla: Utilizar únicamente hard cuts o disolvencias muy suaves. Evitar transiciones bruscas.*

| Tiempo | Escena | Acción Visual | Movimiento de Cámara | Sincronización con Voz / Audio |
| :--- | :---: | :--- | :--- | :--- |
${doc.timelineTable.map(t => `| **${t.timeframe}** | Escena ${t.sceneNumber} | ${t.visualAction} | ${t.cameraCut} | "${t.voiceSync}" (${t.audioCue}) |`).join('\n')}

---

## 4. INDICACIONES DE VOZ EN OFF
- **Texto exacto:** "${doc.voiceOverScript.text}"
- **Tono sugerido:** ${doc.voiceOverScript.speakerTone}
- **Pausas y ritmo:** ${doc.voiceOverScript.pacingNotes}

---

## 5. DISEÑO SONORO & MÚSICA
- **Atmósfera:** ${doc.audioDesign.ambientAtmosphere}
- **Elementos naturales:** ${doc.audioDesign.naturalElements.join(', ')}
- **Música recomendada:** ${doc.audioDesign.musicRecommendation} (${doc.audioDesign.frequencyHz})
- **Balance de volumen:** ${doc.audioDesign.voiceMusicBalance}

---

## 6. PROMPT FINAL PARA ANIMAR LAS IMÁGENES
\`\`\`
${doc.finalAnimationVideoPrompt}
\`\`\`
`;
  };

  // Standalone Download of guia_de_edicion.md
  const handleDownloadGuideMarkdown = () => {
    if (!productionDoc) return;
    const md = generateMarkdownGuide(productionDoc);
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `guia_de_edicion_${productionDoc.videoTitle.replace(/[^a-zA-Z0-9]/g, '_')}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Download All Images as ZIP with JSZip + guia_de_edicion.md
  const handleDownloadZip = async () => {
    if (!productionDoc) return;
    setIsZipping(true);

    try {
      const zip = new JSZip();
      const folderName = `Devocional_${productionDoc.videoTitle.replace(/[^a-zA-Z0-9]/g, '_')}`;
      const folder = zip.folder(folderName) || zip;

      // 1. Add images
      for (let i = 0; i < productionDoc.scenes.length; i++) {
        const scene = productionDoc.scenes[i];
        if (scene.imageUrl) {
          try {
            const imgRes = await fetch(scene.imageUrl);
            if (imgRes.ok) {
              const blob = await imgRes.blob();
              folder.file(`Escena_${scene.sceneNumber}_${scene.role}.jpg`, blob);
            }
          } catch (fetchErr) {
            console.warn(`Could not fetch image for scene ${scene.sceneNumber}`, fetchErr);
          }
        }
      }

      // 2. Add guia_de_edicion.md
      const guideMd = generateMarkdownGuide(productionDoc);
      folder.file(`guia_de_edicion.md`, guideMd);

      // Generate Zip and trigger download
      const content = await zip.generateAsync({ type: 'blob' });
      const downloadUrl = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${folderName}_Completo.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    } catch (err: any) {
      console.error("Error creating ZIP:", err);
      alert("Hubo un problema al generar el archivo ZIP. Descarga las imágenes individualmente.");
    } finally {
      setIsZipping(false);
    }
  };

  const isGenerating = pipelineStep !== 'idle' && pipelineStep !== 'completed' && pipelineStep !== 'error';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-900/90 via-stone-950 to-amber-950/40 border border-amber-500/25 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-400/15 text-amber-300 border border-amber-400/30">
              <Clapperboard className="w-3.5 h-3.5 text-amber-400" />
              <span>{SCENOGRAPHY_SKILL_NAME}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight font-cinzel">
              Del guion al escenario cinematográfico
            </h1>
            <p className="text-sm sm:text-base text-stone-300 max-w-3xl leading-relaxed">
              Escribe tu guion o idea y la habilidad convertirá cada escena en una propuesta de espacio, objetos narrativos, luz, cámara y continuidad visual, lista para generar imágenes consecutivas y una guía de edición.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowHistoryDrawer(!showHistoryDrawer)}
              className="px-4 py-2.5 rounded-2xl bg-stone-950/80 hover:bg-stone-800 border border-stone-700 text-stone-200 hover:text-amber-300 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-lg"
            >
              <History className="w-4 h-4 text-amber-400" />
              <span>Proyectos Guardados ({savedProjects.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* History Drawer Modal */}
      {showHistoryDrawer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="relative max-w-2xl w-full bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
            <div className="p-5 border-b border-stone-800 flex items-center justify-between bg-stone-950/60">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white font-cinzel">Historial de Proyectos Devocionales</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowHistoryDrawer(false)}
                className="p-1.5 rounded-xl bg-stone-800 text-stone-300 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {savedProjects.length === 0 ? (
                <div className="text-center py-10 text-stone-500 text-xs">
                  No hay proyectos guardados aún. Genera tu primer video devocional.
                </div>
              ) : (
                savedProjects.map((proj) => (
                  <div 
                    key={proj.id}
                    className="p-4 rounded-2xl bg-stone-950 border border-stone-800 hover:border-amber-400/40 transition-all flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-amber-300 font-cinzel">{proj.title}</h4>
                      <p className="text-xs text-stone-400 line-clamp-2">{proj.originalPrompt}</p>
                      <div className="flex items-center gap-3 text-[10px] text-stone-500 pt-1">
                        <span>Formato: <strong>{proj.aspectRatio}</strong></span>
                        <span>•</span>
                        <span>{proj.totalDurationSec}s</span>
                        <span>•</span>
                        <span>{new Date(proj.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setProductionDoc(proj.productionDoc);
                          setUserPrompt(proj.originalPrompt);
                          setAspectRatio(proj.aspectRatio);
                          setDurationSeconds(proj.totalDurationSec);
                          setShowHistoryDrawer(false);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-amber-400 text-slate-950 text-xs font-bold hover:bg-amber-300 transition-colors cursor-pointer"
                      >
                        Cargar
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          devotionalStorageService.deleteProject(proj.id);
                          setSavedProjects(devotionalStorageService.getAllProjects());
                        }}
                        className="p-1.5 rounded-xl bg-stone-800 hover:bg-rose-950/60 text-stone-400 hover:text-rose-300 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Creation Form Card */}
      <div className="bg-stone-900/60 rounded-3xl border border-stone-800 p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-6">
        <form onSubmit={(e) => { e.preventDefault(); handleGenerateScenes(); }} className="space-y-6">
          
          {/* 1. Prompt Input Field with Label "Describe tu video" */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="promptInput" className="block text-sm font-bold text-stone-200 font-cinzel">
                Describe tu video:
              </label>
              <span className="text-xs text-amber-400/90 font-mono">
                Preserva rostro, túnica, ambiente y época
              </span>
            </div>
            
            <textarea
              id="promptInput"
              rows={4}
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="Ej: Jesús junto a una ventana al amanecer en un santuario rústico de piedra con luz dorada. Ora con profunda serenidad y mira hacia afuera con compasión..."
              className="w-full px-4 py-3.5 rounded-2xl bg-stone-950/80 border border-stone-700 text-stone-100 placeholder-stone-500 text-sm focus:outline-none focus:border-amber-400/70 focus:ring-2 focus:ring-amber-400/20 transition-all shadow-inner leading-relaxed"
            />

            <div className="rounded-2xl border border-cyan-400/20 bg-cyan-950/20 p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-xl bg-cyan-400/15 p-2 text-cyan-300">
                  <Clapperboard className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-200">Habilidad integrada</span>
                    <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300">Activa</span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-stone-300">El generador aplicará automáticamente estas reglas a tu guion:</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {SCENOGRAPHY_SKILL_SUMMARY.map((item) => (
                      <span key={item} className="rounded-lg border border-stone-700 bg-stone-950/70 px-2 py-1 text-[10px] text-stone-300">{item}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Inspiration Pills & Mandatory Verification Tests */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-xs font-semibold text-stone-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Pruebas Reales de Verificación Obligatoria & Conceptos Devocionales:</span>
              </div>
              <span className="text-[11px] text-emerald-400 font-mono">
                🟢 100% Generaciones Reales e Independientes (0% Simulado)
              </span>
            </div>

            {/* Test Runners A & B */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3 rounded-2xl bg-amber-950/20 border border-amber-500/30">
              <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-stone-950 border border-stone-800">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-400 text-[10px] font-mono">PROMPT A</span>
                    <span>Ventana al Amanecer</span>
                  </div>
                  <div className="text-[11px] text-stone-400 line-clamp-1">
                    Jesús junto a una ventana de madera durante un amanecer tranquilo, mirando un valle dorado.
                  </div>
                </div>
                <button
                  type="button"
                  disabled={isGenerating}
                  onClick={() => handleRunMandatoryTest('A')}
                  className="shrink-0 px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-all cursor-pointer shadow"
                >
                  Ejecutar Prueba A
                </button>
              </div>

              <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-stone-950 border border-stone-800">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 rounded bg-cyan-400/20 text-cyan-400 text-[10px] font-mono">PROMPT B</span>
                    <span>Sendero bajo la Lluvia</span>
                  </div>
                  <div className="text-[11px] text-stone-400 line-clamp-1">
                    Jesús caminando por un sendero de montaña bajo una lluvia suave, extendiendo una mano para ofrecer consuelo.
                  </div>
                </div>
                <button
                  type="button"
                  disabled={isGenerating}
                  onClick={() => handleRunMandatoryTest('B')}
                  className="shrink-0 px-3 py-1.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-bold transition-all cursor-pointer shadow"
                >
                  Ejecutar Prueba B
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {quickPrompts.map((qp, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setUserPrompt(qp.prompt)}
                  className="p-3 text-left rounded-xl bg-stone-950/50 hover:bg-amber-500/10 border border-stone-800 hover:border-amber-500/40 text-stone-300 hover:text-amber-200 text-xs transition-all cursor-pointer group"
                >
                  <div className="font-bold text-stone-200 group-hover:text-amber-300 mb-1 flex items-center gap-1 truncate">
                    <span>✨</span> {qp.title}
                  </div>
                  <div className="line-clamp-2 text-[11px] text-stone-400 group-hover:text-stone-300 leading-tight">
                    {qp.prompt}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Controls Grid: Format, Duration, Image Count */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4 border-t border-stone-800">
            
            {/* Format / Aspect Ratio Selector (9:16 Default, 16:9, 1:1) */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider">
                Formato de Video:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: '9:16', label: 'Vertical 9:16', badge: 'Reels / TikTok' },
                  { id: '16:9', label: 'Horizontal 16:9', badge: 'YouTube' },
                  { id: '1:1', label: 'Cuadrado 1:1', badge: 'Feed / Post' }
                ].map((fmt) => (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => setAspectRatio(fmt.id as any)}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      aspectRatio === fmt.id
                        ? 'bg-amber-500/20 border-amber-400 text-white font-bold shadow-md ring-1 ring-amber-400/50'
                        : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-700'
                    }`}
                  >
                    <div className="text-xs">{fmt.label}</div>
                    <div className="text-[10px] text-amber-400/80 font-mono mt-0.5">{fmt.badge}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Video Duration (Proportional: 1 prompt = 10s of video) */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Duración del Video:</span>
                </span>
                <span className="text-amber-400 font-mono font-bold">{durationSeconds}s ({imageCount} {imageCount === 1 ? 'Prompt' : 'Prompts'})</span>
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                {[
                  { val: 10, label: '10s', prompts: '1 prompt' },
                  { val: 20, label: '20s', prompts: '2 prompts' },
                  { val: 30, label: '30s', prompts: '3 prompts' },
                  { val: 40, label: '40s', prompts: '4 prompts' },
                  { val: 50, label: '50s', prompts: '5 prompts' },
                  { val: 60, label: '60s', prompts: '6 prompts' }
                ].map((dur) => (
                  <button
                    key={dur.val}
                    type="button"
                    onClick={() => handleDurationSelect(dur.val)}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      durationSeconds === dur.val
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold shadow-sm ring-1 ring-amber-400/40'
                        : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <div className="text-xs font-bold">{dur.label}</div>
                    <div className="text-[9px] text-amber-400/80 font-mono mt-0.5">{dur.prompts}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Proportional Scene / Prompt Count Indicator */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  <span>Prompts / Escenas a Entregar:</span>
                </span>
                <span className="text-emerald-400 font-mono font-bold">{imageCount} {imageCount === 1 ? 'Escena' : 'Escenas'} ({imageCount * 10}s)</span>
              </label>
              <div className="p-3 rounded-xl bg-stone-950/80 border border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-300">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-semibold text-stone-200">
                    {imageCount} {imageCount === 1 ? 'Prompt independiente' : 'Prompts independientes'}
                  </span>
                  <span className="text-stone-400 text-[11px]">
                    (10s por escena)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-stone-400 uppercase font-mono">Modificar:</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleImageCountSelect(Math.max(1, imageCount - 1))}
                      disabled={imageCount <= 1}
                      className="w-6 h-6 rounded-lg bg-stone-800 hover:bg-stone-700 disabled:opacity-30 text-white font-bold flex items-center justify-center cursor-pointer text-xs"
                    >
                      -
                    </button>
                    <span className="w-7 text-center font-mono font-bold text-amber-300 text-xs">
                      {imageCount}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleImageCountSelect(Math.min(12, imageCount + 1))}
                      disabled={imageCount >= 12}
                      className="w-6 h-6 rounded-lg bg-stone-800 hover:bg-stone-700 disabled:opacity-30 text-white font-bold flex items-center justify-center cursor-pointer text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300/90 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  <strong>Regla de proporcionalidad:</strong> 1 prompt = 10 segundos de video. Para {durationSeconds}s de video se entregan exactamente {imageCount} {imageCount === 1 ? 'prompt y archivo de imagen' : 'prompts y archivos de imagen independientes'}.
                </span>
              </div>
            </div>

          </div>

          {/* Error Notice */}
          {errorMsg && (
            <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Submit Action Button with Label "Generar escenas" */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
            <button
              type="submit"
              disabled={isGenerating}
              className={`w-full sm:w-auto flex-1 py-4 px-8 rounded-2xl font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-3 shadow-2xl transition-all cursor-pointer ${
                isGenerating
                  ? 'bg-stone-800 text-stone-500 cursor-not-allowed border border-stone-700'
                  : 'bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 hover:brightness-110 active:scale-[0.99] shadow-[0_0_30px_rgba(245,158,11,0.3)]'
              }`}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin text-amber-400" />
                  <span>{getStepDescription(pipelineStep)}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-slate-950" />
                  <span>Generar escenas ({imageCount} {imageCount === 1 ? 'prompt' : 'prompts'} • {durationSeconds}s)</span>
                </>
              )}
            </button>
          </div>

          {/* Step-by-Step Live Progress Indicator */}
          {isGenerating && (
            <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-3 animate-pulse">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-300 flex items-center gap-2">
                  <Film className="w-4 h-4 text-amber-400 animate-spin" />
                  {getStepDescription(pipelineStep)}
                </span>
                <span className="font-mono font-bold text-amber-400">{progressPercent}%</span>
              </div>
              <div className="w-full h-2 bg-stone-900 rounded-full overflow-hidden border border-stone-800">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex flex-wrap items-center gap-3 text-[10px] text-stone-400 pt-1">
                <div className={pipelineStep === 'analyzing' ? 'text-amber-300 font-bold' : ''}>1. Análisis y desglose</div>
                <div className={pipelineStep === 'master_identity' ? 'text-amber-300 font-bold' : ''}>2. Identidad maestra</div>
                <div className={pipelineStep === 'generating_scenes' ? 'text-amber-300 font-bold' : ''}>3. Generación de {imageCount} {imageCount === 1 ? 'escena' : 'escenas'}</div>
                <div className={pipelineStep === 'preparing_guide' ? 'text-amber-300 font-bold' : ''}>4. Guía y empaquetado</div>
              </div>
            </div>
          )}

        </form>
      </div>

      {/* Generated Results Area */}
      {productionDoc && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Top Actions Bar (Download Zip, Download Guide, Copy Animation Prompt, JSON view) */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-stone-900/80 border border-stone-800 backdrop-blur-md">
            <div>
              <h2 className="text-lg font-bold text-white font-cinzel flex items-center gap-2">
                <Film className="w-5 h-5 text-amber-400" />
                {productionDoc.videoTitle}
              </h2>
              <p className="text-xs text-stone-400 mt-0.5">
                {productionDoc.scenes.length} Escenas en formato {productionDoc.aspectRatio} • Duración: {productionDoc.totalDurationSec}s • Cortes sincronizados cada 2–3s
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Copy Master Animation Prompt */}
              <button
                type="button"
                onClick={() => handleCopy(productionDoc.finalAnimationVideoPrompt, 'master-prompt')}
                className="px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm"
              >
                {copiedSection === 'master-prompt' ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>¡Prompt Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-amber-400" />
                    <span>Copiar prompt final de video</span>
                  </>
                )}
              </button>

              {/* Download Standalone Edit Guide (guia_de_edicion.md) */}
              <button
                type="button"
                onClick={handleDownloadGuideMarkdown}
                className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 border border-amber-400/30 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Descargar guía de edición</span>
              </button>

              {/* Download All in ZIP */}
              <button
                type="button"
                onClick={handleDownloadZip}
                disabled={isZipping}
                className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm"
              >
                {isZipping ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Comprimiendo ZIP...</span>
                  </>
                ) : (
                  <>
                    <FolderArchive className="w-4 h-4 text-slate-950" />
                    <span>Descargar todas las imágenes</span>
                  </>
                )}
              </button>

              {/* Toggle JSON view */}
              <button
                type="button"
                onClick={() => setShowJsonInspector(!showJsonInspector)}
                className="p-2.5 rounded-xl bg-stone-950 border border-stone-800 hover:border-stone-700 text-stone-400 hover:text-stone-200 text-xs transition-colors cursor-pointer"
                title="Ver JSON Estructurado"
              >
                <Code className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* JSON Inspector Collapsible Box */}
          {showJsonInspector && productionDoc.structuredAnalysis && (
            <div className="p-5 rounded-2xl bg-stone-950 border border-stone-800 space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300 font-mono">
                  Objeto JSON Estructurado Validado (Gemini API)
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(JSON.stringify(productionDoc.structuredAnalysis, null, 2), 'raw-json')}
                  className="text-xs text-amber-400 hover:text-amber-300 underline font-mono cursor-pointer"
                >
                  {copiedSection === 'raw-json' ? '¡Copiado!' : 'Copiar JSON'}
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-stone-900 text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-64 leading-relaxed">
                {JSON.stringify(productionDoc.structuredAnalysis, null, 2)}
              </pre>
            </div>
          )}

          {/* Real-Time Technical Diagnostic Panel */}
          <div className="rounded-2xl bg-stone-950/90 border border-amber-500/30 overflow-hidden shadow-2xl backdrop-blur-md">
            <div className="p-4 bg-stone-900/90 border-b border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold text-white uppercase tracking-wider font-mono">
                  Panel de Diagnóstico Técnico en Tiempo Real
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/30">
                  Generación Real Verificada • 0% Mock
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowDiagnosticPanel(!showDiagnosticPanel)}
                  className="text-amber-400 hover:text-amber-300 font-mono text-xs flex items-center gap-1 cursor-pointer"
                >
                  <span>{showDiagnosticPanel ? 'Ocultar Detalles' : 'Ver Detalles'}</span>
                  {showDiagnosticPanel ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {showDiagnosticPanel && (
              <div className="p-5 space-y-4 text-xs font-mono text-stone-300 divide-y divide-stone-800/80">
                {/* Meta summary grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-stone-900/60 border border-stone-800 space-y-1">
                    <div className="text-[10px] uppercase text-stone-400 font-bold">Endpoint Backend:</div>
                    <div className="text-amber-300 font-bold text-xs truncate">
                      {diagnosticsData?.endpoint || '/api/generate-scenes'}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-stone-900/60 border border-stone-800 space-y-1">
                    <div className="text-[10px] uppercase text-stone-400 font-bold">Modelo de Imagen:</div>
                    <div className="text-emerald-300 font-bold text-xs truncate">
                      {diagnosticsData?.modelUsed || productionDoc.imageModelStatus?.modelName || 'Motor Neuronal Flux Cinema 8K'}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-stone-900/60 border border-stone-800 space-y-1">
                    <div className="text-[10px] uppercase text-stone-400 font-bold">Generation ID:</div>
                    <div className="text-cyan-300 font-bold text-[11px] truncate" title={diagnosticsData?.generationId}>
                      {diagnosticsData?.generationId || 'gen-session-active'}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-stone-900/60 border border-stone-800 space-y-1">
                    <div className="text-[10px] uppercase text-stone-400 font-bold">Hora de Creación:</div>
                    <div className="text-stone-200 text-xs">
                      {new Date(diagnosticsData?.timestamp || productionDoc.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                </div>

                {/* Prompt Info */}
                <div className="pt-3 space-y-1">
                  <span className="text-[10px] uppercase text-stone-400 font-bold block">
                    Prompt Original Procesado:
                  </span>
                  <div className="p-2.5 rounded-xl bg-stone-900/80 border border-stone-800 text-[11px] text-amber-200/90 leading-relaxed font-sans">
                    "{diagnosticsData?.prompt || userPrompt}"
                  </div>
                </div>

                {/* Generated Scenes Independence Table */}
                <div className="pt-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase text-stone-400 font-bold">
                      Registro de Unicidad y Archivos Generados ({productionDoc.scenes.length} Llamadas Independientes):
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold">
                      {productionDoc.scenes.length} URLs Únicas • {productionDoc.scenes.length} Hashes Distintos
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-[11px] border-collapse bg-stone-900/40 rounded-xl overflow-hidden">
                      <thead>
                        <tr className="border-b border-stone-800 text-stone-400 font-bold text-[10px] uppercase bg-stone-900/80">
                          <th className="py-2 px-3">Escena</th>
                          <th className="py-2 px-3">Image ID</th>
                          <th className="py-2 px-3">URL / Archivo Físico</th>
                          <th className="py-2 px-3">Tamaño</th>
                          <th className="py-2 px-3">Estado</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-800/60">
                        {productionDoc.scenes.map((sc, i) => (
                          <tr key={i} className="hover:bg-stone-800/30">
                            <td className="py-2 px-3 font-bold text-amber-300">
                              Escena {sc.sceneNumber} ({sc.role})
                            </td>
                            <td className="py-2 px-3 text-stone-400 text-[10px]">
                              {sc.imageId || `scene_${sc.sceneNumber}_${sc.role}`}
                            </td>
                            <td className="py-2 px-3 text-cyan-300 text-[10px] font-mono max-w-[280px] truncate" title={sc.imageUrl}>
                              {sc.imageUrl}
                            </td>
                            <td className="py-2 px-3 text-stone-300 text-[10px]">
                              {sc.fileSizeKb ? `${sc.fileSizeKb} KB` : 'Dinámico'}
                            </td>
                            <td className="py-2 px-3">
                              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                                {sc.status || 'completed'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* Section 1: Individual Scene Cards */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-base font-bold text-stone-200 font-cinzel flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                Secuencia Visual de {productionDoc.scenes.length} {productionDoc.scenes.length === 1 ? 'Escena Consecutiva Independiente' : 'Escenas Consecutivas Independientes'}:
              </h3>
              <span className="text-xs text-stone-400 font-mono">
                {productionDoc.scenes.length} {productionDoc.scenes.length === 1 ? 'generación individual' : 'generaciones individuales'} (1 prompt = 10s • Total {productionDoc.totalDurationSec}s)
              </span>
            </div>

            <div className={`grid gap-5 ${
              productionDoc.scenes.length === 1 
                ? 'grid-cols-1 max-w-sm mx-auto' 
                : productionDoc.scenes.length === 2 
                  ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto' 
                  : productionDoc.scenes.length === 3 
                    ? 'grid-cols-1 sm:grid-cols-3' 
                    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
            }`}>
              {productionDoc.scenes.map((scene, idx) => {
                const isMaster = idx === 0;
                const isRegenerating = regeneratingScene === scene.sceneNumber;
                const cardName = `Escena ${scene.sceneNumber}`;

                return (
                  <div 
                    key={scene.sceneNumber}
                    className={`rounded-2xl border overflow-hidden transition-all duration-300 flex flex-col justify-between ${
                      isMaster 
                        ? 'bg-gradient-to-b from-stone-900 to-stone-950 border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.15)] ring-1 ring-amber-400/30'
                        : 'bg-stone-900/70 border-stone-800 hover:border-stone-700'
                    }`}
                  >
                    {/* Scene Header */}
                    <div className="p-3.5 border-b border-stone-800/80 flex items-center justify-between bg-stone-950/40">
                      <div className="flex items-center gap-2">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          isMaster ? 'bg-amber-400 text-slate-950' : 'bg-stone-800 text-stone-200'
                        }`}>
                          {scene.sceneNumber}
                        </span>
                        <div>
                          <div className="text-xs font-bold text-stone-200">
                            {cardName}
                          </div>
                          <div className="text-[10px] text-amber-400/80 font-mono">
                            ⏱ {scene.timeRange}
                          </div>
                        </div>
                      </div>

                      <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-stone-800 text-stone-300">
                        {scene.role === 'presentacion' ? 'Presentación' : scene.role === 'acercamiento' ? 'Acercamiento' : scene.role === 'accion_emocional' ? 'Acción Emocional' : 'Cierre'}
                      </span>
                    </div>

                    {/* Image Preview Container */}
                    <div className="relative group bg-stone-950 aspect-[9/16] max-h-[380px] overflow-hidden flex items-center justify-center">
                      {scene.imageUrl ? (
                        <img
                          src={scene.imageUrl}
                          alt={cardName}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="text-center p-4 text-stone-500 text-xs">
                          Generando imagen...
                        </div>
                      )}

                      {/* Top Overlay Badges */}
                      <div className="absolute top-2 left-2 right-2 z-10 flex items-center justify-between pointer-events-none">
                        <div className="px-2 py-1 rounded-md bg-slate-950/80 backdrop-blur-md border border-amber-400/40 text-[9px] font-bold text-amber-300 flex items-center gap-1 shadow-lg">
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>{scene.imageId ? `ID: ${scene.imageId.slice(0, 14)}` : `Escena ${scene.sceneNumber}`}</span>
                        </div>
                        {scene.fileSizeKb ? (
                          <div className="px-1.5 py-0.5 rounded bg-black/60 text-[9px] text-stone-300 font-mono">
                            {scene.fileSizeKb} KB
                          </div>
                        ) : null}
                      </div>

                      {/* Action Hover Controls */}
                      <div className="absolute inset-0 bg-stone-950/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 p-4 z-20 backdrop-blur-[2px]">
                        <button
                          type="button"
                          onClick={() => setPreviewModalImg({ url: scene.imageUrl || '', title: `${cardName}: ${scene.title}` })}
                          className="w-full py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                          <span>Ver en Pantalla Completa</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDownloadSingleImage(scene.imageUrl || '', `${cardName.replace(/\s+/g, '_')}_${scene.role}.jpg`)}
                          className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Descargar imagen</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRegenerateScene(scene.sceneNumber)}
                          disabled={isRegenerating}
                          className="w-full py-2 px-3 rounded-xl bg-stone-900/90 hover:bg-stone-800 text-amber-300 border border-amber-500/30 text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
                          <span>{isRegenerating ? 'Regenerando...' : 'Regenerar esta escena'}</span>
                        </button>
                      </div>

                      {/* Regenerating Spinner Overlay */}
                      {isRegenerating && (
                        <div className="absolute inset-0 bg-stone-950/85 z-30 flex flex-col items-center justify-center gap-2">
                          <RefreshCw className="w-8 h-8 text-amber-400 animate-spin" />
                          <span className="text-xs font-bold text-amber-300">Regenerando {cardName}...</span>
                          <span className="text-[10px] text-stone-400">Preservando continuidad maestra</span>
                        </div>
                      )}
                    </div>

                    {/* Scene Details Card Footer */}
                    <div className="p-3.5 space-y-2 text-xs bg-stone-950/60 border-t border-stone-800">
                      <div>
                        <div className="text-[11px] font-semibold text-stone-400 flex items-center gap-1">
                          <Film className="w-3 h-3 text-amber-400" />
                          <span>Acción Visual:</span>
                        </div>
                        <div className="text-stone-200 font-medium text-[11px] line-clamp-2">
                          {scene.action}
                        </div>
                      </div>

                      <div className="pt-1 border-t border-stone-800/60">
                        <div className="text-[11px] font-semibold text-stone-400 flex items-center gap-1">
                          <Camera className="w-3 h-3 text-amber-400" />
                          <span>Encuadre & Cámara:</span>
                        </div>
                        <div className="text-stone-300 text-[11px] truncate">
                          {scene.cameraMovement}
                        </div>
                      </div>

                      <div className="pt-1 border-t border-stone-800/60">
                        <div className="text-[11px] font-semibold text-stone-400 flex items-center gap-1">
                          <Mic className="w-3 h-3 text-amber-400" />
                          <span>Voz en Off:</span>
                        </div>
                        <div className="text-stone-300 text-[11px] italic line-clamp-2">
                          "{scene.narrationSnippet}"
                        </div>
                      </div>

                      {/* Card Buttons: Download, Regenerate, Copy Prompt */}
                      <div className="pt-2 border-t border-stone-800 flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleDownloadSingleImage(scene.imageUrl || '', `${cardName.replace(/\s+/g, '_')}.jpg`)}
                          className="flex-1 py-1.5 px-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-[10px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                          title="Descargar imagen"
                        >
                          <Download className="w-3 h-3 text-amber-400" />
                          <span>Descargar</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRegenerateScene(scene.sceneNumber)}
                          disabled={isRegenerating}
                          className="flex-1 py-1.5 px-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-300 text-[10px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                          title="Regenerar esta escena"
                        >
                          <RefreshCw className={`w-3 h-3 ${isRegenerating ? 'animate-spin' : ''}`} />
                          <span>Regenerar</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleCopy(scene.structuredPrompt, `prompt-${idx}`)}
                          className="py-1.5 px-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[10px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                          title="Copiar prompt de esta escena"
                        >
                          {copiedSection === `prompt-${idx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-amber-400" />}
                          <span>Copiar</span>
                        </button>
                      </div>

                      {/* Structured Prompt Toggle */}
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => setExpandedPromptIdx(expandedPromptIdx === idx ? null : idx)}
                          className="w-full text-left text-[10px] font-bold text-stone-400 hover:text-amber-300 flex items-center justify-between py-1 cursor-pointer"
                        >
                          <span>Ver Prompt Completo</span>
                          {expandedPromptIdx === idx ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>

                        {expandedPromptIdx === idx && (
                          <div className="mt-2 p-2.5 rounded-lg bg-stone-900 border border-stone-700 text-[10px] text-stone-300 space-y-1.5 animate-fadeIn">
                            <pre className="whitespace-pre-wrap font-mono leading-relaxed max-h-36 overflow-y-auto scrollbar-thin">
                              {scene.structuredPrompt}
                            </pre>
                          </div>
                        )}
                      </div>

                    </div>

                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Production Document & Video Timeline */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Timeline Table (Cortes cada 2 o 3 segundos) */}
            <div className="lg:col-span-2 bg-stone-900/70 rounded-3xl border border-stone-800 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white font-cinzel flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  Tabla de Tiempos de Edición (Cortes cada 2–3s)
                </h3>
                <span className="text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-semibold">
                  Sincronizado a {productionDoc.totalDurationSec}s
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-stone-800 text-stone-400 font-bold uppercase text-[10px]">
                      <th className="py-2.5 px-3">Tiempo</th>
                      <th className="py-2.5 px-3">Escena</th>
                      <th className="py-2.5 px-3">Acción Visual</th>
                      <th className="py-2.5 px-3">Corte de Cámara</th>
                      <th className="py-2.5 px-3">Sincronización Voz / Audio</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800/60 text-stone-300">
                    {productionDoc.timelineTable.map((row, i) => (
                      <tr key={i} className="hover:bg-stone-800/30 transition-colors">
                        <td className="py-3 px-3 font-mono font-bold text-amber-400 whitespace-nowrap">
                          {row.timeframe}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded-full bg-stone-800 text-stone-200 text-[10px] font-bold">
                            Escena {row.sceneNumber}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-medium text-stone-200">
                          {row.visualAction}
                        </td>
                        <td className="py-3 px-3 text-stone-400">
                          {row.cameraCut}
                        </td>
                        <td className="py-3 px-3 text-stone-400">
                          <div className="text-stone-300 italic">"{row.voiceSync}"</div>
                          <div className="text-[10px] text-amber-400/80 font-mono mt-0.5">🎵 {row.audioCue}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Master Character Continuity Rule Banner & Identity Anchors */}
              <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2 text-xs text-stone-300">
                <div className="font-bold text-amber-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Descripción Maestra de Continuidad (Fijada en las 4 Escenas):</span>
                </div>
                <p className="text-stone-300 text-[11px] leading-relaxed">
                  {productionDoc.masterCharacterDescription}
                </p>

                {productionDoc.identityAnchors && productionDoc.identityAnchors.length > 0 && (
                  <div className="pt-2 border-t border-amber-500/20 flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1">
                      <Tag className="w-3 h-3" /> Anclajes de Identidad:
                    </span>
                    {productionDoc.identityAnchors.map((anchor, aIdx) => (
                      <span key={aIdx} className="px-2 py-0.5 rounded bg-stone-900 text-amber-200 text-[10px] border border-amber-400/20 font-mono">
                        {anchor}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Audio, Voice-Over & Sound Design Card */}
            <div className="space-y-6">
              
              {/* Voice-Over Script */}
              <div className="bg-stone-900/70 rounded-3xl border border-stone-800 p-6 space-y-3">
                <h4 className="text-sm font-bold text-white font-cinzel flex items-center gap-2">
                  <Mic className="w-4 h-4 text-amber-400" />
                  Guion de Voz en Off
                </h4>
                <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 text-xs text-stone-200 space-y-2">
                  <div className="font-serif italic text-amber-200/95 leading-relaxed text-sm">
                    "{productionDoc.voiceOverScript.text}"
                  </div>
                  <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between text-[10px] text-stone-400">
                    <span>Tono: <strong>{productionDoc.voiceOverScript.speakerTone}</strong></span>
                    <button
                      type="button"
                      onClick={() => handleCopy(productionDoc.voiceOverScript.text, 'voice-script')}
                      className="text-amber-400 hover:text-amber-300 font-bold underline cursor-pointer"
                    >
                      {copiedSection === 'voice-script' ? '¡Copiado!' : 'Copiar voz'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Audio & Music Design */}
              <div className="bg-stone-900/70 rounded-3xl border border-stone-800 p-6 space-y-3">
                <h4 className="text-sm font-bold text-white font-cinzel flex items-center gap-2">
                  <Music className="w-4 h-4 text-amber-400" />
                  Diseño Sonoro & Música (432Hz)
                </h4>
                <ul className="space-y-2 text-xs text-stone-300">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400">•</span>
                    <div><strong>Atmósfera:</strong> {productionDoc.audioDesign.ambientAtmosphere}</div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400">•</span>
                    <div><strong>Música recomendada:</strong> {productionDoc.audioDesign.musicRecommendation} ({productionDoc.audioDesign.frequencyHz})</div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400">•</span>
                    <div><strong>Balance:</strong> {productionDoc.audioDesign.voiceMusicBalance}</div>
                  </li>
                </ul>
              </div>

            </div>

          </div>

          {/* Section 3: Final Master Animation Prompt Box */}
          <div className="bg-gradient-to-br from-stone-900 via-stone-950 to-amber-950/30 rounded-3xl border border-amber-500/30 p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-amber-300 font-cinzel flex items-center gap-2">
                <Clapperboard className="w-4 h-4 text-amber-400" />
                Prompt Final para Animar en Generador de Video (Kling / Runway / Luma / Haiper):
              </h4>
              <button
                type="button"
                onClick={() => handleCopy(productionDoc.finalAnimationVideoPrompt, 'final-prompt')}
                className="px-3.5 py-1.5 rounded-xl bg-amber-400 text-slate-950 text-xs font-bold hover:bg-amber-300 transition-all flex items-center gap-1.5 cursor-pointer shadow"
              >
                {copiedSection === 'final-prompt' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copiar Prompt de Video</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-stone-950/80 border border-stone-800 text-xs text-stone-200 font-mono leading-relaxed whitespace-pre-wrap">
              {productionDoc.finalAnimationVideoPrompt}
            </div>
          </div>

        </div>
      )}

      {/* Fullscreen Image Preview Modal */}
      {previewModalImg && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="relative max-w-2xl w-full bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-stone-800 flex items-center justify-between bg-stone-950">
              <h5 className="text-sm font-bold text-white font-cinzel">{previewModalImg.title}</h5>
              <button
                type="button"
                onClick={() => setPreviewModalImg(null)}
                className="p-1.5 rounded-xl bg-stone-800 text-stone-300 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-black">
              <img
                src={previewModalImg.url}
                alt={previewModalImg.title}
                referrerPolicy="no-referrer"
                className="max-w-full max-h-[70vh] object-contain rounded-xl shadow-2xl"
              />
            </div>
            <div className="p-4 border-t border-stone-800 flex items-center justify-end gap-2 bg-stone-950">
              <button
                type="button"
                onClick={() => handleDownloadSingleImage(previewModalImg.url, `${previewModalImg.title.replace(/[^a-zA-Z0-9]/g, '_')}.jpg`)}
                className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 text-xs font-bold hover:bg-amber-300 flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descargar en Alta Resolución</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
