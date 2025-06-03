// test.js
import fs from 'fs/promises';
import pdfParse from 'pdf-parse';

const file = './data/input/terms.pdf'; // replace with actual path

const buffer = await fs.readFile(file);
const data = await pdfParse(buffer);
console.log(`Extracted ${data.text.length} characters`);
console.log(data.text.slice(0, 500));