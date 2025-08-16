import { writeFile, readFile, rename } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
export const runtime = 'nodejs';

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
      credentials?: {
        apiKey?: string;
        apiSecret?: string;
        accessToken?: string;
        accessSecret?: string;
      };
    };
    instagram: {
      enabled: boolean;
      autoPost: boolean;
      defaultHashtags: string[];
    };
    facebook: {
      enabled: boolean;
      autoPost: boolean;
    };
  };
}

const SOCIAL_CONFIG_PATH = path.join(process.cwd(), 'src/data/social-media-config.json');

export async function GET() {
  try {
    // Create default config if it doesn't exist
    if (!existsSync(SOCIAL_CONFIG_PATH)) {
      const defaultConfig: SocialMediaConfig = {
        posts: [],
        settings: {
          twitter: {
            enabled: true,
            autoPost: false,
            defaultHashtags: ['#SoftballRecruit', '#Class2027', '#SouthCarolina', '#SoftballLife'],
            credentials: {
              apiKey: '',
              apiSecret: '',
              accessToken: '',
              accessSecret: ''
            }
          },
          instagram: {
            enabled: false,
            autoPost: false,
            defaultHashtags: ['#SoftballRecruit', '#Class2027', '#SouthCarolina']
          },
          facebook: {
            enabled: false,
            autoPost: false
          }
        }
      };
      
      const tmpPath = `${SOCIAL_CONFIG_PATH}.tmp`;
      await writeFile(tmpPath, JSON.stringify(defaultConfig, null, 2), 'utf8');
      await rename(tmpPath, SOCIAL_CONFIG_PATH);
      return new Response(JSON.stringify(defaultConfig), {
        status: 200,
        headers: { 'content-type': 'application/json' }
      });
    }

    const data = await readFile(SOCIAL_CONFIG_PATH, 'utf8');
    return new Response(data, {
      status: 200,
      headers: { 'content-type': 'application/json' }
    });
  } catch (error) {
    console.error('Error reading social media config:', error);
    return new Response(JSON.stringify({ error: 'Failed to load social media config' }), {
      status: 500,
      headers: { 'content-type': 'application/json' }
    });
  }
}

export async function POST(request: Request) {
  try {
    const { action, ...data } = await request.json();
    
    const configData = await readFile(SOCIAL_CONFIG_PATH, 'utf8');
    const config: SocialMediaConfig = JSON.parse(configData);

    switch (action) {
      case 'createPost': {
        const newPost: SocialMediaPost = {
          id: Date.now().toString(),
          platform: (data as any).platform || 'twitter',
          content: (data as any).content,
          scheduledDate: (data as any).scheduledDate,
          status: (data as any).scheduledDate ? 'scheduled' : 'draft',
          blogPostId: (data as any).blogPostId,
          createdAt: new Date().toISOString(),
          hashtags: (data as any).hashtags || config.settings.twitter.defaultHashtags,
          mediaUrls: (data as any).mediaUrls || []
        };
        config.posts.push(newPost);
        break;
      }

      case 'updatePost': {
        const postIndex = config.posts.findIndex(p => p.id === (data as any).id);
        if (postIndex !== -1) {
          config.posts[postIndex] = { ...config.posts[postIndex], ...(data as any) };
        }
        break;
      }

      case 'deletePost': {
        config.posts = config.posts.filter(p => p.id !== (data as any).id);
        break;
      }

      case 'postNow': {
        // Simulate posting to X (Twitter)
        const postToUpdate = config.posts.find(p => p.id === (data as any).id);
        if (postToUpdate) {
          postToUpdate.status = 'posted';
          postToUpdate.postedAt = new Date().toISOString();
          
          // In a real implementation, you would integrate with Twitter API here
          console.log('Posting to Twitter:', {
            content: postToUpdate.content,
            hashtags: postToUpdate.hashtags,
            media: postToUpdate.mediaUrls
          });
        }
        break;
      }

      case 'updateSettings': {
        const incoming = ((data as any).settings || {}) as Partial<SocialMediaConfig['settings']>;
        const incomingTwitter = incoming.twitter as Partial<SocialMediaConfig['settings']['twitter']> | undefined;
        const incomingCreds = incomingTwitter?.credentials as Partial<NonNullable<SocialMediaConfig['settings']['twitter']['credentials']>> | undefined;

        config.settings = {
          ...config.settings,
          twitter: {
            ...config.settings.twitter,
            ...(incomingTwitter || {}),
            credentials: {
              ...config.settings.twitter.credentials,
              ...(incomingCreds || {})
            }
          },
          instagram: {
            ...config.settings.instagram,
            ...(incoming.instagram || {})
          },
          facebook: {
            ...config.settings.facebook,
            ...(incoming.facebook || {})
          }
        };
        break;
      }

      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { 'content-type': 'application/json' },
        });
    }

    {
      const tmpPath = `${SOCIAL_CONFIG_PATH}.tmp`;
      await writeFile(tmpPath, JSON.stringify(config, null, 2), 'utf8');
      await rename(tmpPath, SOCIAL_CONFIG_PATH);
    }
    return new Response(JSON.stringify({ success: true, config }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating social media config:', error);
    return new Response(JSON.stringify({ error: 'Failed to update social media config' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
}

// Simulate Twitter API integration (placeholder for real implementation)
async function postToTwitter(post: SocialMediaPost): Promise<boolean> {
  try {
    // In a real implementation, you would use the Twitter API v2
    // This requires Twitter API credentials and proper OAuth setup
    
    console.log('Simulating Twitter post:', {
      text: `${post.content} ${post.hashtags.join(' ')}`,
      media: post.mediaUrls
    });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate success (90% success rate for demo)
    return Math.random() > 0.1;
  } catch {
    console.error('Error posting to Twitter');
    return false;
  }
}