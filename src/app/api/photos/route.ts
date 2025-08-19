import { readFile, access } from 'fs/promises';
import path from 'path';

export const runtime = 'nodejs';

const PHOTOS_CONFIG_PATH = path.join(process.cwd(), 'src/data/photos-config.json');

export async function GET() {
  try {
    try {
      await access(PHOTOS_CONFIG_PATH);
    } catch {
      // Return a sane default without writing to disk
      const defaultConfig = {
        photos: [
          {
            id: '1',
            filename: 'hero-default.jpg',
            originalName: 'hero-background.jpg',
            url: '/images/hero-bg.jpg',
            alt: 'Lana Nolan softball action shot',
            category: 'hero',
            uploadDate: new Date().toISOString(),
            isActive: true
          },
          {
            id: '2',
            filename: 'profile-default.jpg',
            originalName: 'profile-photo.jpg',
            url: '/images/profile.jpg',
            alt: 'Lana Nolan profile photo',
            category: 'profile',
            uploadDate: new Date().toISOString(),
            isActive: true
          }
        ],
        activePhotos: {
          heroImage: '1',
          profileImage: '2',
          featuredAction: '1'
        }
      };
      return new Response(JSON.stringify(defaultConfig), {
        headers: { 'Cache-Control': 'no-store', 'content-type': 'application/json' },
        status: 200,
      });
    }

    const data = await readFile(PHOTOS_CONFIG_PATH, 'utf8');
    const json = JSON.parse(data);
    return new Response(JSON.stringify(json), {
      headers: { 'Cache-Control': 'no-store', 'content-type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error reading photos config:', error);
    return new Response(JSON.stringify({ error: 'Failed to load photos' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
}