import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

import { debugLog } from '../utils/logger.js';

debugLog(`🔢🔢🔢 OpenAI API Key: ${process.env.OPENAI_API_KEY}`);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default openai;