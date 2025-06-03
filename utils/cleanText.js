import { debugLog } from './logger.js';

export function cleanText(text) {
    debugLog(`📄 ::: cleanText.js::: Cleaning text`);
    const cleaned = text
        .replace(/\s+/g, ' ')
        .replace(/[\x00-\x1F\x7F]/g, '') // remove control characters
        .trim();

    debugLog('\n🧹🧹🧹 Cleaned Text Preview:\n', cleaned.slice(0, 1000), '\n...');

    return cleaned;
}
