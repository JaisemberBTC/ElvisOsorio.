export const SCENOGRAPHY_SKILL_NAME = "Habilidad de Escenografía Sagrada & Continuidad Visual 3D";
export const SCENOGRAPHY_SKILL_SUMMARY = "Optimiza los prompts de escenografía para asegurar iluminación divina 3400K-5000K, texturas realistas y reverencia sin distorsiones.";

export function applyScenographySkill(rawPrompt: string): string {
  const clean = (rawPrompt || '').trim();
  if (!clean) return "Atmospheric sacred setting with warm candlelight and celestial glow.";
  return `${clean} -- Cinematographic lighting, 3D Pixar spiritual aesthetics, warm golden rim light 3400K, volumetric dust motes, 9:16 vertical framing.`;
}
