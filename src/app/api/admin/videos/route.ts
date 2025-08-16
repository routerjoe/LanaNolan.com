import { promises as fs } from 'fs';
import path from 'path';

export const runtime = 'nodejs';
const VIDEOS_FILE = path.join(process.cwd(), 'src/data/videos.json');

interface VideoClip {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  category: 'hitting' | 'fielding' | 'game' | 'skills';
  duration: number;
  date: string;
  featured: boolean;
  source: 'upload' | 'youtube' | 'gamechanger' | 'hudl';
  teamProfileHubUrl?: string | null;
}

interface VideosData {
  videos: VideoClip[];
}

// Helper function to extract Team Profile Hub video ID from URL
function extractTeamProfileHubVideoId(url: string): string | null {
  const patterns = [
    /teamprofilehub\.com\/.*\/video\/([a-zA-Z0-9-]+)/,
    /tph\.com\/.*\/video\/([a-zA-Z0-9-]+)/,
    /gamechanger\.io\/.*\/video\/([a-zA-Z0-9-]+)/,
    /gc\.com\/.*\/video\/([a-zA-Z0-9-]+)/,
    /gamechanger\.com\/.*\/video\/([a-zA-Z0-9-]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// Helper function to generate thumbnail URL for Team Profile Hub
function generateTeamProfileHubThumbnail(videoId: string): string {
  return `https://media.teamprofilehub.com/video/${videoId}/thumbnail.jpg`;
}

// Helper function to detect video source from URL
function detectVideoSource(url: string): 'youtube' | 'gamechanger' | 'upload' {
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return 'youtube';
  } else if (url.includes('teamprofilehub.com') || url.includes('tph.com') || url.includes('gamechanger.io') || url.includes('gc.com') || url.includes('gamechanger.com')) {
    return 'gamechanger';
  }
  return 'upload';
}

export async function GET() {
  try {
    const data = await fs.readFile(VIDEOS_FILE, 'utf8');
    const videosData: VideosData = JSON.parse(data);
    return new Response(JSON.stringify(videosData), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (error) {
    console.error('Error reading videos:', error);
    return new Response(JSON.stringify({ videos: [] }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const action = formData.get('action') as string;

    // Read current videos data
    let videosData: VideosData;
    try {
      const data = await fs.readFile(VIDEOS_FILE, 'utf8');
      videosData = JSON.parse(data);
    } catch {
      videosData = { videos: [] };
    }

    if (action === 'upload') {
      const file = formData.get('video') as File;
      const title = formData.get('title') as string;
      const description = formData.get('description') as string;
      const category = formData.get('category') as VideoClip['category'];
      const featured = formData.get('featured') === 'true';

      if (!file || !title || !description || !category) {
        return new Response(JSON.stringify({ error: 'Missing required fields' }), {
          status: 400,
          headers: { 'content-type': 'application/json' },
        });
      }

      // Create uploads directory if it doesn't exist
      const uploadsDir = path.join(process.cwd(), 'public/uploads/videos');
      try {
        await fs.mkdir(uploadsDir, { recursive: true });
      } catch {
        // Directory might already exist
      }

      // Generate unique filename
      const timestamp = Date.now();
      const fileExtension = path.extname(file.name);
      const filename = `video_${timestamp}${fileExtension}`;
      const filepath = path.join(uploadsDir, filename);

      // Save file
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await fs.writeFile(filepath, buffer);

      // Create new video entry
      const newVideo: VideoClip = {
        id: `video_${timestamp}`,
        title,
        description,
        url: `/uploads/videos/${filename}`,
        thumbnail: `/uploads/videos/${filename}`, // For uploaded videos, use the video file as thumbnail
        category,
        duration: 0, // Would need video processing to get actual duration
        date: new Date().toISOString().split('T')[0],
        featured,
        source: 'upload'
      };

      videosData.videos.push(newVideo);

    } else if (action === 'add_url') {
      const url = formData.get('url') as string;
      const title = formData.get('title') as string;
      const description = formData.get('description') as string;
      const category = formData.get('category') as VideoClip['category'];
      const featured = formData.get('featured') === 'true';

      if (!url || !title || !description || !category) {
        return new Response(JSON.stringify({ error: 'Missing required fields' }), {
          status: 400,
          headers: { 'content-type': 'application/json' },
        });
      }

      const source = detectVideoSource(url);
      let thumbnail = '/images/video-placeholder.jpg';
      let processedUrl = url;

      // Handle Team Profile Hub URLs
      if (source === 'gamechanger') {
        const videoId = extractTeamProfileHubVideoId(url);
        if (videoId) {
          thumbnail = generateTeamProfileHubThumbnail(videoId);
          // Store original Team Profile Hub URL
          processedUrl = url;
        }
      }

      // Create new video entry
      const newVideo: VideoClip = {
        id: `video_${Date.now()}`,
        title,
        description,
        url: processedUrl,
        thumbnail,
        category,
        duration: 0, // Would need API calls to get actual duration
        date: new Date().toISOString().split('T')[0],
        featured,
        source,
        teamProfileHubUrl: source === 'gamechanger' ? url : null
      };

      videosData.videos.push(newVideo);

    } else if (action === 'update') {
      const videoId = formData.get('videoId') as string;
      const title = formData.get('title') as string;
      const description = formData.get('description') as string;
      const category = formData.get('category') as VideoClip['category'];
      const featured = formData.get('featured') === 'true';

      const videoIndex = videosData.videos.findIndex(v => v.id === videoId);
      if (videoIndex === -1) {
        return new Response(JSON.stringify({ error: 'Video not found' }), {
          status: 404,
          headers: { 'content-type': 'application/json' },
        });
      }

      // Update video
      videosData.videos[videoIndex] = {
        ...videosData.videos[videoIndex],
        title,
        description,
        category,
        featured
      };

    } else if (action === 'delete') {
      const videoId = formData.get('videoId') as string;
      
      const videoIndex = videosData.videos.findIndex(v => v.id === videoId);
      if (videoIndex === -1) {
        return new Response(JSON.stringify({ error: 'Video not found' }), {
          status: 404,
          headers: { 'content-type': 'application/json' },
        });
      }

      const video = videosData.videos[videoIndex];
      
      // Delete file if it's an uploaded video
      if (video.source === 'upload' && video.url.startsWith('/uploads/')) {
        try {
          const filepath = path.join(process.cwd(), 'public', video.url);
          await fs.unlink(filepath);
        } catch (error) {
          console.error('Error deleting video file:', error);
        }
      }

      // Remove from array
      videosData.videos.splice(videoIndex, 1);

    } else {
      return new Response(JSON.stringify({ error: 'Invalid action' }), { status: 400, headers: { 'content-type': 'application/json' } });
    }

    // Atomic save: write to temp then rename
    const tmpPath = `${VIDEOS_FILE}.tmp`;
    await fs.writeFile(tmpPath, JSON.stringify(videosData, null, 2), 'utf8');
    await fs.rename(tmpPath, VIDEOS_FILE);

    return new Response(JSON.stringify({ success: true, videos: videosData.videos }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (error) {
    console.error('Error managing videos:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
}