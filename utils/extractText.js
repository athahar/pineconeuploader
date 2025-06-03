// utils/extractText.js
import fs from 'fs/promises';
import pdfParse from 'pdf-parse';
import { debugLog } from './logger.js';

export async function extractTextFromPDF(filePath) {
    debugLog(`📄 ::: extractText.js::: Extracting text from: ${filePath}`);
    try {
        const buffer = await fs.readFile(filePath);
        const data = await pdfParse(buffer);
        debugLog(`✅ Extracted text (${data.text.length} characters)`);
        debugLog(`📝📝📝 Text Preview:\n${data.text.slice(0, 1000)}\n...`);
        return data.text;
    } catch (err) {
        console.error(`❌ Error reading ${filePath}:`, err.message);
        throw err;
    }
}
