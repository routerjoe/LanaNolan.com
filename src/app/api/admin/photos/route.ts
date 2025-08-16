import { writeFile, readFile, mkdir, rename } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
export const runtime = 'nodejs';

interface PhotoData {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  alt: string;
  category: 'hero' | 'profile' | 'action' | 'team' | 'blog';
  uploadDate: string;
  isActive: boolean;
}

interface PhotosConfig {
  photos: PhotoData[];
  activePhotos: {
    heroImage: string;
    profileImage: string;
    featuredAction: string;
  };
}

const PHOTOS_CONFIG_PATH = path.join(process.cwd(), 'src/data/photos-config.json');
const UPLOADS_DIR = path.join(process.cwd(), 'public/uploads');

// Ensure uploads directory exists
async function ensureUploadsDir() {
  if (!existsSync(UPLOADS_DIR)) {
    await mkdir(UPLOADS_DIR, { recursive: true });
  }
}

export async function GET() {
  try {
    // Create default config if it doesn't exist
    if (!existsSync(PHOTOS_CONFIG_PATH)) {
      const defaultConfig: PhotosConfig = {
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
      
      const tmpPath = `${PHOTOS_CONFIG_PATH}.tmp`;
      await writeFile(tmpPath, JSON.stringify(defaultConfig, null, 2), 'utf8');
      await rename(tmpPath, PHOTOS_CONFIG_PATH);
      return new Response(JSON.stringify(defaultConfig), {
        headers: { 'Cache-Control': 'no-store', 'content-type': 'application/json' },
        status: 200,
      });
    }

    const data = await readFile(PHOTOS_CONFIG_PATH, 'utf8');
    return new Response(data, {
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

export async function POST(request: Request) {
  try {
    await ensureUploadsDir();
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const category = formData.get('category') as string;
    const alt = formData.get('alt') as string;

    if (!file) {
      return new Response(JSON.stringify({ error: 'No file provided' }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const extension = path.extname(file.name);
    const filename = `${category}-${timestamp}${extension}`;
    const filepath = path.join(UPLOADS_DIR, filename);

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Update photos config
    const configData = await readFile(PHOTOS_CONFIG_PATH, 'utf8');
    const config: PhotosConfig = JSON.parse(configData);

    const newPhoto: PhotoData = {
      id: timestamp.toString(),
      filename,
      originalName: file.name,
      url: `/uploads/${filename}`,
      alt: alt || file.name,
      category: category as PhotoData['category'],
      uploadDate: new Date().toISOString(),
      isActive: false
    };

    config.photos.push(newPhoto);
    {
      const tmpPath = `${PHOTOS_CONFIG_PATH}.tmp`;
      await writeFile(tmpPath, JSON.stringify(config, null, 2), 'utf8');
      await rename(tmpPath, PHOTOS_CONFIG_PATH);
    }

    return new Response(JSON.stringify({ success: true, photo: newPhoto }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (error) {
    console.error('Error uploading photo:', error);
    return new Response(JSON.stringify({ error: 'Failed to upload photo' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
}

export async function PUT(request: Request) {
  try {
    const { activePhotos } = await request.json();
    
    const configData = await readFile(PHOTOS_CONFIG_PATH, 'utf8');
    const config: PhotosConfig = JSON.parse(configData);
    
    config.activePhotos = { ...config.activePhotos, ...activePhotos };
    
    {
      const tmpPath = `${PHOTOS_CONFIG_PATH}.tmp`;
      await writeFile(tmpPath, JSON.stringify(config, null, 2), 'utf8');
      await rename(tmpPath, PHOTOS_CONFIG_PATH);
    }
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating active photos:', error);
    return new Response(JSON.stringify({ error: 'Failed to update photos' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
}