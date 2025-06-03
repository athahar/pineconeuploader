import { debugLog } from './logger.js';

export function chunkText(text, maxTokens = 500, overlap = 50) {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text]; // crude sentence splitter fallback
    const chunks = [];
    let currentChunk = [];

    for (const sentence of sentences) {
        currentChunk.push(sentence);
        const joined = currentChunk.join(' ');
        if (joined.split(' ').length >= maxTokens) {
            chunks.push(joined);
            currentChunk = currentChunk.slice(-overlap); // keep overlap
        }
    }

    if (currentChunk.length > 0) {
        chunks.push(currentChunk.join(' '));
    }

    debugLog(`🧩 Created ${chunks.length} chunks`);

    chunks.forEach((chunk, i) => {
        debugLog(` 🧩🧩🧩 Chunk ${i + 1} (${chunk.split(' ').length} words):\n`, chunk.slice(0, 300), '\n...');
    });

    return chunks;
}
