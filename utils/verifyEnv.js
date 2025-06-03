// utils/verifyEnv.js
import { debugLog } from './logger.js';

export function verifyEnv(requiredKeys = []) {
  const missing = requiredKeys.filter((key) => !process.env[key]);

  if (missing.length) {
    console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  } else {
    debugLog(`✅ All required environment variables are set: ${requiredKeys.join(', ')}`);
  }
}
