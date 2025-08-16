import { readFile, writeFile, rename } from 'fs/promises';
import path from 'path';

export const runtime = 'nodejs';

const dataPath = path.join(process.cwd(), 'src/data/player-profile.json');

function isObject(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === 'object' && !Array.isArray(v);
}

// Very light validation to avoid writing malformed data
type PlayerPayload = {
  personalInfo: { name: string; graduationYear: number; [k: string]: unknown };
  athletics: Record<string, unknown>;
  measurables: unknown[];
  [k: string]: unknown;
};

function validatePlayerPayload(payload: unknown): payload is PlayerPayload {
  if (!isObject(payload)) return false;

  const root = payload as Record<string, unknown>;
  const personalInfo = root.personalInfo as unknown;
  const athletics = root.athletics as unknown;
  const measurables = root.measurables as unknown;

  if (!isObject(personalInfo)) return false;
  if (!isObject(athletics)) return false;
  if (!Array.isArray(measurables)) return false;

  const pi = personalInfo as Record<string, unknown>;
  if (typeof pi.name !== 'string') return false;
  if (typeof pi.graduationYear !== 'number') return false;

  return true;
}

export async function GET() {
  try {
    const data = await readFile(dataPath, 'utf8');
    return new Response(data, {
      headers: { 'Cache-Control': 'no-store', 'content-type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error reading player data:', error);
    return new Response(JSON.stringify({ error: 'Failed to load player data' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!validatePlayerPayload(body)) {
      return new Response(JSON.stringify({ error: 'Invalid player payload' }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      });
    }

    // Atomic write
    const tmpPath = `${dataPath}.tmp`;
    await writeFile(tmpPath, JSON.stringify(body, null, 2), 'utf8');
    await rename(tmpPath, dataPath);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (error) {
    console.error('Error saving player data:', error);
    return new Response(JSON.stringify({ error: 'Failed to save player data' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
}