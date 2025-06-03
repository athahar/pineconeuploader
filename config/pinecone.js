// config/pinecone.js
import { Pinecone } from '@pinecone-database/pinecone';
import dotenv from 'dotenv';
import { debugLog } from '../utils/logger.js';

dotenv.config();

debugLog(`🔢 PINECONE_API_KEY: ${process.env.PINECONE_API_KEY}`);
debugLog(`🔢 PINECONE_ENVIRONMENT: ${process.env.PINECONE_ENVIRONMENT}`);
debugLog(`🔢 PINECONE_INDEX_NAME: ${process.env.PINECONE_INDEX_NAME}`);

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY
});

const index = pinecone.index(process.env.PINECONE_INDEX_NAME);

export default index;
