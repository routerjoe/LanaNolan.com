import { readFile, access } from 'fs/promises';
import path from 'path';

export const runtime = 'nodejs';

const VIDEOS_FILE = path.join(process.cwd(), 'src/data/videos.json');

export async function GET() {
  try {
    try {
      await access(VIDEOS_FILE);
    } catch {
      return new Response(JSON.stringify({ videos: [] }), {
        status: 200,
        headers: { 'Cache-Control': 'no-store', 'content-type': 'application/json' },
      });
    }
    const data = await readFile(VIDEOS_FILE, 'utf8');
    const json = JSON.parse(data);
    // Ensure shape
    const safe = Array.isArray(json?.videos) ? json : { videos: [] };
    return new Response(JSON.stringify(safe), {
      status: 200,
      headers: { 'Cache-Control': 'no-store', 'content-type': 'application/json' },
    });
  } catch (error) {
    console.error('Error reading videos data:', error);
    return new Response(JSON.stringify({ videos: [] }), {
      status: 200,
      headers: { 'Cache-Control': 'no-store', 'content-type': 'application/json' },
    });
  }
}