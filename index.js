// index.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import { verifyEnv } from './utils/verifyEnv.js';
import { debugLog } from './utils/logger.js';
import { extractTextFromPDF } from './utils/extractText.js';
import { cleanText } from './utils/cleanText.js';
import { chunkText } from './utils/chunkText.js';
import { embedChunks } from './utils/embedText.js';
import { uploadToPinecone } from './utils/uploadToPinecone.js';

dotenv.config();
verifyEnv(['OPENAI_API_KEY', 'PINECONE_API_KEY', 'PINECONE_ENVIRONMENT', 'PINECONE_INDEX_NAME', 'DRY_RUN', 'DEBUG_LOGS']);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const INPUT_DIR = path.join(__dirname, 'data', 'input');

async function processAllPDFs() {
  const files = fs.readdirSync(INPUT_DIR).filter(f => f.endsWith('.pdf'));

  for (const file of files) {
    const filePath = path.join(INPUT_DIR, file);
    console.log(`📄 ::: index.js::: Processing: ${file}`);

    try {
      const start = Date.now();
      console.log(`📄 start time: ${start}`);
      const rawText = await extractTextFromPDF(filePath);
      const cleanedText = cleanText(rawText);
      const chunks = chunkText(cleanedText);

      const embeddings = await embedChunks(chunks);
      await uploadToPinecone(embeddings);

      debugLog(`✅ Finished uploading: ${file}`);
      debugLog(`⏱️ Took ${(Date.now() - start) / 1000}s`);

    } catch (err) {
      console.error(`❌ Failed to process ${file}: ${err.message}`);
    }
  }
}

processAllPDFs().catch((err) => {
  console.error('💥 Pipeline failed with error:', err.message);
});
