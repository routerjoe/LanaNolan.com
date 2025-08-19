import { readFile } from 'fs/promises';
import path from 'path';

export const runtime = 'nodejs';

const dataPath = path.join(process.cwd(), 'src/data/player-profile.json');

export async function GET() {
  try {
    const data = await readFile(dataPath, 'utf8');
    const json = JSON.parse(data);
    return new Response(JSON.stringify(json), {
      headers: {
        'Cache-Control': 'no-store',
        'content-type': 'application/json',
      },
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