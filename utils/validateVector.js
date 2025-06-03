// utils/validateVector.js
import { z } from 'zod';
import { debugLog } from './logger.js';

export const vectorSchema = z.object({
  id: z.string(),
  values: z.array(z.number()),
  metadata: z.object({
    source: z.string()
  })
});

export function validateVectorSchema(vector) {
  const result = vectorSchema.safeParse(vector);
  if (!result.success) {
    const errors = result.error.issues.map(issue => `${issue.path.join('.')} - ${issue.message}`).join('; ');
    debugLog(`📄 ::: validateVector.js ::: Invalid vector schema: ${errors}`);
    return false;
  }
  return true;
}
