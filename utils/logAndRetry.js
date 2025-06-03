// utils/logAndRetry.js
import { debugLog } from './logger.js';

export async function withRetry(fn, options = {}) {
  const {
    maxAttempts = 3,
    delayMs = 1000,
    name = 'operation'
  } = options;

  let attempt = 0;
  while (attempt < maxAttempts) {
    try {
      attempt++;
      debugLog(`➡️ Attempt ${attempt} for ${name}...`);
      const result = await fn();
      debugLog(`✅ Success on attempt ${attempt} for ${name}`);
      return result;
    } catch (err) {
      console.warn(`⚠️ Failed attempt ${attempt} for ${name}: ${err.message}`);
      if (attempt >= maxAttempts) {
        console.error(`❌ All ${maxAttempts} attempts failed for ${name}`);
        throw err;
      }
      await new Promise((res) => setTimeout(res, delayMs));
    }
  }
}
