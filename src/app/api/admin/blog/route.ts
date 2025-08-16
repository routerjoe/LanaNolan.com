import { readFile, writeFile, rename } from 'fs/promises';
import path from 'path';

export const runtime = 'nodejs';
const dataPath = path.join(process.cwd(), 'src/data/blog-posts.json');
const socialPath = path.join(process.cwd(), 'src/data/social-media-config.json');

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  date: string;
  category: string;
  published: boolean;
  image?: string;
  autoPostToX?: boolean;
  xPostScheduled?: boolean;
}

interface BlogData {
  posts: BlogPost[];
}

interface SocialMediaPost {
  id: string;
  platform: 'twitter' | 'instagram' | 'facebook';
  content: string;
  scheduledDate?: string;
  status: 'draft' | 'scheduled' | 'posted' | 'failed';
  blogPostId?: string;
  createdAt: string;
  postedAt?: string;
  mediaUrls?: string[];
  hashtags: string[];
}

interface SocialMediaConfig {
  posts: SocialMediaPost[];
  settings: {
    twitter: {
      enabled: boolean;
      autoPost: boolean;
      defaultHashtags: string[];
    };
  };
}

// Helper function to create automatic X post for scheduled blog post
async function createAutoXPost(blogPost: BlogPost): Promise<void> {
  try {
    // Read current social media config
    let socialConfig: SocialMediaConfig;
    try {
      const socialData = await readFile(socialPath, 'utf8');
      socialConfig = JSON.parse(socialData);
    } catch {
      // Initialize if file doesn't exist
      socialConfig = {
        posts: [],
        settings: {
          twitter: {
            enabled: true,
            autoPost: true,
            defaultHashtags: ['#SoftballRecruit', '#Class2027', '#SouthCarolina', '#SoftballLife']
          }
        }
      };
    }

    // Check if auto-posting is enabled
    if (!socialConfig.settings.twitter.enabled || !socialConfig.settings.twitter.autoPost) {
      return;
    }

    // Create X post content
    const postContent = `${blogPost.title}\n\n${blogPost.excerpt}`;
    
    // Create new social media post
    const newXPost: SocialMediaPost = {
      id: `auto_x_${blogPost.id}_${Date.now()}`,
      platform: 'twitter',
      content: postContent,
      scheduledDate: blogPost.date, // Schedule for same date as blog post
      status: 'scheduled',
      blogPostId: blogPost.id,
      createdAt: new Date().toISOString(),
      hashtags: socialConfig.settings.twitter.defaultHashtags
    };

    // Add to social media posts
    socialConfig.posts.push(newXPost);

    // Save updated social config (atomic)
    {
      const tmpPath = `${socialPath}.tmp`;
      await writeFile(tmpPath, JSON.stringify(socialConfig, null, 2), 'utf8');
      await rename(tmpPath, socialPath);
    }
    
    console.log(`Auto X post created for blog post: ${blogPost.title}`);
  } catch (error) {
    console.error('Error creating auto X post:', error);
  }
}

// Helper function to check and process scheduled posts
async function processScheduledPosts(blogData: BlogData): Promise<BlogData> {
  const currentDate = new Date().toISOString().split('T')[0];

  for (const post of blogData.posts) {
    // Check if post should be published today and auto-post is enabled
    if (post.date <= currentDate && !post.published && post.autoPostToX && !post.xPostScheduled) {
      // Mark as published
      post.published = true;
      post.xPostScheduled = true;

      // Create automatic X post
      await createAutoXPost(post);
      
      console.log(`Auto-published blog post and created X post: ${post.title}`);
    }
  }

  return blogData;
}

export async function GET() {
  try {
    const data = await readFile(dataPath, 'utf8');
    let blogData: BlogData = JSON.parse(data);

    // Process any scheduled posts that should be published
    blogData = await processScheduledPosts(blogData);

    // Save if there were changes (basic heuristic retained)
    if (blogData.posts.some(post => post.published && post.xPostScheduled)) {
      const tmpPath = `${dataPath}.tmp`;
      await writeFile(tmpPath, JSON.stringify(blogData, null, 2), 'utf8');
      await rename(tmpPath, dataPath);
    }

    return new Response(JSON.stringify(blogData), {
      headers: { 'Cache-Control': 'no-store', 'content-type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error reading blog data:', error);
    return new Response(JSON.stringify({ error: 'Failed to load blog data' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
}

export async function POST(request: Request) {
  try {
    const blogData: BlogData = await request.json();

    if (!blogData || !Array.isArray(blogData.posts)) {
      return new Response(JSON.stringify({ error: 'Invalid payload: expected { posts: [] }' }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      });
    }

    // Process each post to check for auto-posting requirements
    for (const post of blogData.posts) {
      if (post && typeof post === 'object') {
        // If this is a new scheduled post with auto-post enabled
        if ((post as any).autoPostToX && !(post as any).xPostScheduled && !(post as any).published) {
          const postDate = new Date((post as any).date);
          const currentDate = new Date();

          // If the post is scheduled for today or in the past, create X post immediately
          if (!isNaN(postDate.getTime()) && postDate <= currentDate) {
            (post as any).published = true;
            (post as any).xPostScheduled = true;
            await createAutoXPost(post as any);
          } else {
            // Mark that X post should be created when the date arrives
            (post as any).xPostScheduled = false;
          }
        }
      }
    }

    // Atomic save
    const tmpPath = `${dataPath}.tmp`;
    await writeFile(tmpPath, JSON.stringify(blogData, null, 2), 'utf8');
    await rename(tmpPath, dataPath);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (error) {
    console.error('Error saving blog data:', error);
    return new Response(JSON.stringify({ error: 'Failed to save blog data' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
}