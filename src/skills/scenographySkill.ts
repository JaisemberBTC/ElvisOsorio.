export const SCENOGRAPHY_SKILL_NAME = 'Dirección de Escenografía Cinematográfica';

/**
 * Converts a creator's story prompt into a production-safe brief that keeps
 * locations, props, lighting and continuity aligned across generated scenes.
 */
export function applyScenographySkill(scriptPrompt: string): string {
  const prompt = scriptPrompt.trim();

  return `${prompt}

[HABILIDAD ACTIVA: ${SCENOGRAPHY_SKILL_NAME}]
Trata el texto anterior como un guion y conviértelo en una biblia de escenografía cinematográfica. Antes de generar, identifica el conflicto y la evolución emocional. Para cada escena define una ubicación física concreta (interior/exterior, habitación, hora y clima), arquitectura y materiales, posición de personajes frente a muebles y cámara, objetos narrativos activos, vestuario, luz, color, atmósfera, acción física y transición visual hacia la siguiente escena.

Mantén una identidad maestra constante entre todas las escenas: misma época, arquitectura, personajes, vestuario, escala y dirección de luz, salvo cambios justificados por la historia. Usa objetos que cuenten la historia —Biblia, cruz, carta, fotografía, lámpara u objeto equivalente— y haz que su estado evolucione con el conflicto. Diseña una progresión visual clara desde la incertidumbre o penumbra hacia la esperanza, la luz cálida y el orden restaurado. Los prompts deben ser ejecutables por una cámara, evitar decoraciones genéricas, reservar el tercio central en formato 9:16 para rostros y acción, y no introducir texto dentro de las imágenes.`;
}

export const SCENOGRAPHY_SKILL_SUMMARY = [
  'Ubicación y distribución física',
  'Objetos narrativos activos',
  'Continuidad de personajes y arquitectura',
  'Luz, color y evolución emocional',
  'Acción de cámara y transición entre escenas'
];
