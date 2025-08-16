import { writeFile, readFile, rename, mkdir, unlink } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export const runtime = 'nodejs';

const PLAYER_FILE = path.join(process.cwd(), 'src/data/player-profile.json');
const UPLOADS_DIR = path.join(process.cwd(), 'public/uploads/pdfs');

function isObject(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === 'object' && !Array.isArray(v);
}

async function ensureUploadsDir() {
  if (!existsSync(UPLOADS_DIR)) {
    await mkdir(UPLOADS_DIR, { recursive: true });
  }
}

export async function GET() {
  try {
    const raw = await readFile(PLAYER_FILE, 'utf8');
    const data = JSON.parse(raw);
    const url = data?.personalInfo?.recruitingPacketUrl || null;
    return new Response(JSON.stringify({ url }), {
      headers: { 'Cache-Control': 'no-store', 'content-type': 'application/json' },
      status: 200,
    });
  } catch {
    // If player file missing/corrupt, return null
    return new Response(JSON.stringify({ url: null }), {
      headers: { 'Cache-Control': 'no-store', 'content-type': 'application/json' },
      status: 200,
    });
  }
}

export async function POST(request: Request) {
  try {
    await ensureUploadsDir();

    const form = await request.formData();
    const file = form.get('file') as File | null;

    if (!file) {
      return new Response(JSON.stringify({ error: 'No file provided' }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      });
    }

    const originalName = file.name || 'recruiting_packet.pdf';
    const ext = path.extname(originalName).toLowerCase() || '.pdf';
    if (!ext.endsWith('.pdf')) {
      return new Response(JSON.stringify({ error: 'Only PDF files are allowed' }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      });
    }

    const timestamp = Date.now();
    const filename = `recruiting_packet_${timestamp}${ext}`;
    const filepath = path.join(UPLOADS_DIR, filename);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Update player-profile.json with public URL
    let player: Record<string, unknown> = {};
    try {
      const raw = await readFile(PLAYER_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      player = (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) ? parsed : {};
    } catch {
      // initialize minimal structure if missing
      player = {};
    }

    const p = player as { personalInfo?: Record<string, unknown> };
    if (!isObject(p.personalInfo)) {
      p.personalInfo = {};
    }
    (p.personalInfo as Record<string, unknown>)['recruitingPacketUrl'] = `/uploads/pdfs/${filename}`;
    const url = (p.personalInfo as { recruitingPacketUrl?: string })?.recruitingPacketUrl || `/uploads/pdfs/${filename}`;

    const tmpPath = `${PLAYER_FILE}.tmp`;
    await writeFile(tmpPath, JSON.stringify(player, null, 2), 'utf8');
    await rename(tmpPath, PLAYER_FILE);

    return new Response(JSON.stringify({ success: true, url }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (error) {
    console.error('Error uploading recruiting packet:', error);
    return new Response(JSON.stringify({ error: 'Failed to upload recruiting packet' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
}

export async function DELETE(request: Request) {
try {
  let body: unknown = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }
  const urlToRemove: string | undefined =
    body && typeof body === 'object' && 'url' in body ? (body as { url?: string }).url : undefined;

  // Load current player data
  const raw = await readFile(PLAYER_FILE, 'utf8');
  let player: Record<string, unknown> = {};
  try {
    const parsed = JSON.parse(raw);
    player = (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) ? parsed : {};
  } catch {
    player = {};
  }

  const p = player as { personalInfo?: { recruitingPacketUrl?: string } };
  const currentUrl: string | undefined = p.personalInfo?.recruitingPacketUrl;

  // If a url was provided and matches current, attempt to delete local file (only if under /uploads/pdfs)
  if (currentUrl && (!urlToRemove || urlToRemove === currentUrl)) {
    if (currentUrl.startsWith('/uploads/pdfs/')) {
      const localPath = path.join(process.cwd(), 'public', currentUrl);
      try {
        await unlink(localPath);
      } catch {
        // ignore unlink errors (file may not exist)
      }
    }
    p.personalInfo = { ...(p.personalInfo || {}), recruitingPacketUrl: undefined };
  }

  // Atomic save
  const tmpPath = `${PLAYER_FILE}.tmp`;
  await writeFile(tmpPath, JSON.stringify(player, null, 2), 'utf8');
  await rename(tmpPath, PLAYER_FILE);

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
} catch (error) {
  console.error('Error deleting recruiting packet link:', error);
  return new Response(JSON.stringify({ error: 'Failed to delete recruiting packet link' }), {
    status: 500,
    headers: { 'content-type': 'application/json' },
  });
}
}