import index from '../config/pinecone.js';
import { debugLog } from './logger.js';
import { validateVectorSchema } from './validateVector.js';

const DRY_RUN = process.env.DRY_RUN === 'true';
const namespace = process.env.PINECONE_NAMESPACE || 'default';

debugLog(`🚀 ::: uploadToPinecone.js ::: DRY_RUN: ${DRY_RUN}`);

export async function uploadToPinecone(vectors) {
  debugLog(`🚀 ::: uploadToPinecone.js ::: Received ${vectors.length} vectors`);

  if (!Array.isArray(vectors)) {
    console.error('❌ Pinecone upload failed: vectors is not an array');
    return;
  }

  const validVectors = vectors.filter(validateVectorSchema);
  if (validVectors.length === 0) {
    console.warn('⚠️ No valid vectors to upload');
    return;
  }

  if (DRY_RUN) {
    debugLog('💤 DRY_RUN enabled — skipping upload. Vector preview:');
    validVectors.slice(0, 3).forEach((v, i) => {
      debugLog(`Vector ${i + 1}: id=${v.id}, dim=${v.values.length}`);
    });
    return;
  }

  try {
    debugLog(`📤 Uploading ${validVectors.length} vectors to Pinecone...`);

    // Log a sample
    validVectors.slice(0, 3).forEach((vector, i) => {
      debugLog(`\nVector ${i + 1}:`);
      debugLog(`  ID: ${vector.id}`);
      debugLog(`  Text: ${vector.metadata.text}`);
      debugLog(`  Dimensions: ${vector.values.length}`);
      debugLog(`  First 5 values: ${vector.values.slice(0, 5).join(', ')}...`);
    });

    const batchSize = 100;
    for (let i = 0; i < validVectors.length; i += batchSize) {
      const batch = validVectors.slice(i, i + batchSize);
      debugLog(`📦 Uploading batch ${Math.floor(i/batchSize) + 1} of ${Math.ceil(validVectors.length/batchSize)}`);
      await index.namespace(namespace).upsert(batch);  // <-- ✅ FIXED
    }

    console.log('✅ Upload complete');
  } catch (err) {
    console.error('❌ Pinecone upload failed:', err.message);
    throw err;
  }
}
