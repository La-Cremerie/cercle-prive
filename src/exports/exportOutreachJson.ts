import { writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import type { OutreachOutput } from '../types/Outreach.js';

export async function exportOutreachJson(
  outputs: OutreachOutput[],
  filePath: string,
): Promise<void> {
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(outputs, null, 2), 'utf8');
}
