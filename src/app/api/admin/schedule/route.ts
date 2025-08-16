import { writeFile, rename, readFile } from 'fs/promises';
import path from 'path';

export const runtime = 'nodejs';

const dataPath = path.join(process.cwd(), 'src/data/schedule.json');

function isValidEvent(e: unknown): boolean {
  if (!e || typeof e !== 'object' || Array.isArray(e)) return false;
  const ev = e as Record<string, unknown>;
  if (typeof ev.id !== 'string' || !ev.id.trim()) return false;
  if (typeof ev.title !== 'string' || !ev.title.trim()) return false;
  if (typeof ev.date !== 'string' || isNaN(Date.parse(ev.date))) return false;
  // Optional fields: endDate, location, type, description, coachAttendance, status
  if (ev.endDate && (typeof ev.endDate !== 'string' || isNaN(Date.parse(ev.endDate)))) return false;
  if (ev.coachAttendance != null && typeof ev.coachAttendance !== 'boolean') return false;
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
    console.error('Error reading schedule data:', error);
    return new Response(JSON.stringify({ error: 'Failed to load schedule data' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body || !Array.isArray((body as any).events)) {
      return new Response(JSON.stringify({ error: 'Invalid payload: expected { events: [] }' }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      });
    }

    const cleaned = (body as any).events.filter(isValidEvent);
    if (cleaned.length !== (body as any).events.length) {
      console.warn('Some schedule events failed validation and were dropped');
    }

    const payload = { events: cleaned };

    // Atomic write: write to temp then rename
    const tmpPath = `${dataPath}.tmp`;
    await writeFile(tmpPath, JSON.stringify(payload, null, 2), 'utf8');
    await rename(tmpPath, dataPath);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (error) {
    console.error('Error saving schedule data:', error);
    return new Response(JSON.stringify({ error: 'Failed to save schedule data' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
}