import { GoogleGenAI } from "@google/genai";

/**
 * geminiResilience.ts
 * Enterprise-grade circuit breaker, smart model ordering, and fast-failover
 * mechanism for Google Gemini API models. Prevents 503 high-demand spike hangs
 * and suppresses unhandled console error spam that triggers platform alerts.
 */

// In-memory circuit breaker: tracks models experiencing high demand (503 / overloaded)
const temporarilyDemotedModels = new Map<string, number>();

// Global project-wide quota cooldown tracker (e.g. for free tier 5 req/min limits)
let globalQuotaCooldownUntil: number = 0;

export class GeminiUnavailableError extends Error {
  public isQuota: boolean;
  public retryAfterSeconds: number;
  constructor(message: string, isQuota: boolean = false, retryAfterSeconds: number = 15) {
    super(message);
    this.name = "GeminiUnavailableError";
    this.isQuota = isQuota;
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

export function isModelDemoted(model: string): boolean {
  const expiresAt = temporarilyDemotedModels.get(model);
  if (!expiresAt) return false;
  if (Date.now() > expiresAt) {
    temporarilyDemotedModels.delete(model);
    return false;
  }
  return true;
}

export function demoteModel(model: string, durationMs: number = 60000): void {
  temporarilyDemotedModels.set(model, Date.now() + durationMs);
  console.info(`[Gemini Resilience] Model '${model}' placed in cooldown (${Math.round(durationMs / 1000)}s). Alternative models prioritized.`);
}

export function normalizeModelName(modelName?: string): string {
  if (!modelName) return "gemini-3.8-flash";
  const m = modelName.trim().toLowerCase();
  // Map deprecated or discontinued model references to current supported standard
  if (m.includes("2.5") || m.includes("2.0") || m.includes("1.5") || m.includes("3.7")) {
    return "gemini-3.8-flash";
  }
  return modelName.trim();
}

/**
 * Returns prioritized list of Gemini models, automatically putting healthy models
 * ahead of any models currently undergoing temporary high-demand spikes (503).
 */
export function getPrioritizedModels(preferredModel: string = "gemini-3.8-flash"): string[] {
  const normalized = normalizeModelName(preferredModel);

  // High-availability cascade covering only valid, active Gemini models
  const basePool = [
    normalized,
    "gemini-3.8-flash",
    "gemini-3.5-flash-lite",
    "gemini-3.1-flash-lite",
    "gemini-flash-latest"
  ].filter((m, i, arr) => arr.indexOf(m) === i);

  // Place non-demoted models first
  return [...basePool].sort((a, b) => {
    const aDemoted = isModelDemoted(a) ? 1 : 0;
    const bDemoted = isModelDemoted(b) ? 1 : 0;
    return aDemoted - bDemoted;
  });
}

export interface GenerateOptions {
  contents: any;
  config?: any;
  preferredModel?: string;
}

/**
 * Executes a Gemini content generation with smart fast-failover.
 * If a model returns 503 ("high demand"), it avoids stalling with repeated retries
 * on the same overloaded model and immediately pivots to the next candidate model.
 */
export async function generateWithResilience(
  ai: GoogleGenAI,
  options: GenerateOptions
): Promise<any> {
  // Check if project is in a global quota cooldown
  if (Date.now() < globalQuotaCooldownUntil) {
    const remainingSec = Math.ceil((globalQuotaCooldownUntil - Date.now()) / 1000);
    throw new GeminiUnavailableError(
      `Gemini free tier quota in cooldown (${remainingSec}s remaining). Serving immediate fallback.`,
      true,
      remainingSec
    );
  }

  const modelsToTry = getPrioritizedModels(options.preferredModel);
  let lastError: any = null;

  // Normalize contents to prevent invalid argument error if wrapper object was passed
  let normalizedContents = options.contents;
  if (
    normalizedContents &&
    typeof normalizedContents === "object" &&
    !Array.isArray(normalizedContents) &&
    "contents" in normalizedContents
  ) {
    normalizedContents = (normalizedContents as any).contents;
  }

  for (let i = 0; i < modelsToTry.length; i++) {
    const model = modelsToTry[i];

    try {
      const response = await ai.models.generateContent({
        model,
        contents: normalizedContents,
        config: options.config
      });
      return response;
    } catch (err: any) {
      lastError = err;
      const errMsg = String(err?.message || err);

      const isAuthError = errMsg.includes("API_KEY_INVALID") || errMsg.includes("API key not valid");
      if (isAuthError) {
        throw err;
      }

      // Check for discontinued or 404 models
      const isNotFound = errMsg.includes("NOT_FOUND") || errMsg.includes("404") || errMsg.includes("no longer available");
      if (isNotFound) {
        demoteModel(model, 24 * 60 * 60 * 1000); // 24h permanent demote
        continue;
      }

      // Check for hard quota limit
      const isQuota = errMsg.includes("exceeded your current quota") || errMsg.includes("RESOURCE_EXHAUSTED");
      if (isQuota) {
        const match = errMsg.match(/retry in ([0-9.]+)s/i);
        const retrySec = match ? Math.ceil(parseFloat(match[1])) : 18;
        
        // If it's a project-wide free tier quota limit, set global cooldown
        if (errMsg.includes("generate_content_free_tier_requests") || errMsg.includes("limit: 5")) {
          globalQuotaCooldownUntil = Date.now() + (retrySec * 1000);
          console.info(`[Gemini Resilience] Project free tier quota reached. Activated ${retrySec}s cooldown.`);
          throw new GeminiUnavailableError(`Free tier quota limit reached (${retrySec}s cooldown)`, true, retrySec);
        }

        demoteModel(model, retrySec * 1000);
        continue;
      }

      // Check for temporary high demand (503 / UNAVAILABLE / overloaded)
      const isHighDemand =
        errMsg.includes("503") ||
        errMsg.includes("UNAVAILABLE") ||
        errMsg.includes("high demand") ||
        errMsg.includes("temporarily unavailable") ||
        errMsg.includes("overloaded");

      if (isHighDemand) {
        demoteModel(model, 60000); // 1 minute cooldown
        // If more models remain in pool, do NOT retry the same overloaded model; immediately switch!
        if (i < modelsToTry.length - 1) {
          console.info(`[Gemini Resilience] '${model}' busy (503 spike). Instantly failing over to '${modelsToTry[i + 1]}'`);
          continue;
        }
      }

      // Check for transient network socket error
      const isNetworkTransient =
        errMsg.includes("FetchError") ||
        errMsg.includes("ETIMEDOUT") ||
        errMsg.includes("ECONNRESET");

      if (isNetworkTransient && i < modelsToTry.length - 1) {
        console.info(`[Gemini Resilience] Transient network glitch on '${model}'. Trying next model pool.`);
        continue;
      }

      // If on the last model, wait briefly before giving up
      if (i < modelsToTry.length - 1) {
        await new Promise((r) => setTimeout(r, 200));
      }
    }
  }

  throw lastError;
}
