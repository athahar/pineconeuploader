// utils/embedText.js
import openai from '../config/openai.js';
import { generateUUID } from './helpers.js';
import { withRetry } from './logAndRetry.js';
import { debugLog } from './logger.js';
import { validateVectorSchema } from './validateVector.js';

export async function embedChunks(chunks) {
  const embeddings = [];
  debugLog(`🚀 ::: embedText.js ::: Sending ${chunks.length} chunks for embedding`);

  for (let i = 0; i < chunks.length; i++) {
    const text = chunks[i];
    debugLog(`🔢 Embedding chunk ${i + 1}/${chunks.length} (${text.length} chars)`);
    debugLog(`🧾 Chunk Preview:\n${text.slice(0, 300)}\n...`);

    try {
      const result = await withRetry(() =>
        openai.embeddings.create({
          model: 'text-embedding-3-small',
          input: text
        }),
        {
          name: `OpenAI Embedding chunk ${i + 1}`,
          maxAttempts: 3,
          delayMs: 1000
        }
      );

      const embedding = result.data[0].embedding;
      const vector = {
        id: generateUUID(),
        values: embedding,
        metadata: { 
          source: 'lulu lemon terms',
          text: text.slice(0, 500) // Store first 500 chars of text for reference
        }
      };

      if (!validateVectorSchema(vector)) {
        console.warn(`⚠️ Invalid vector schema for chunk ${i + 1}`);
        continue;
      }

      embeddings.push(vector);
      debugLog(`✅ Received embedding [${embedding.length} dimensions]`);
      debugLog(`📝 Vector Preview for chunk ${i + 1}:`);
      debugLog(`   ID: ${vector.id}`);
      debugLog(`   Text Preview: ${vector.metadata.text}`);
      debugLog(`   First 5 dimensions: ${vector.values.slice(0, 5).join(', ')}...`);
    } catch (err) {
      console.error(`❌ Embedding failed for chunk ${i + 1}:`, err.message);
    }
  }

  debugLog(`📦 Total valid embeddings created: ${embeddings.length}`);
  return embeddings;
}
