import { mkdirSync, writeFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { specs } from '../src/swagger';

const outputPath = resolve(__dirname, '../../docs/api/openapi.json');
const outputDir = dirname(outputPath);

mkdirSync(outputDir, { recursive: true });
writeFileSync(outputPath, JSON.stringify(specs, null, 2));

console.log(`OpenAPI spec exported to ${outputPath}`);
