'use client';

import { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Image from 'next/image';
import '../admin-text-fixes.css';

// Import the actual types from our type definitions
interface PersonalInfo {
  firstName?: string;
  lastName?: string;
  name: string;
  graduationYear: number;
  dateOfBirth: string;
  email: string;
  phone: string;
  height?: string;
  recruitingPacketUrl?: string;
}

interface Athletics {
  primaryPosition: string;
  secondaryPositions: string[];
  battingStance: string;
  throwingHand: string;
  hometown: string;
  highSchool: {
    name: string;
    coach: string;
    coachEmail: string;
    coachPhone: string;
    teamProfileHubUrl?: string;
    socialMedia?: {
      twitter?: string;
      facebook?: string;
      instagram?: string;
      website?: string;
    };
    socialMediaAllowed?: string[];
  };
  travelTeam: {
    name: string;
    coach: string;
    coachEmail: string;
    coachPhone: string;
    teamProfileHubUrl?: string;
    socialMedia?: {
      twitter?: string;
      facebook?: string;
      instagram?: string;
      website?: string;
    };
    socialMediaAllowed?: string[];
  };
}

interface Measurable {
  metric: string;
  value: string;
  date: string;
  notes: string;
}

interface PlayerData {
  personalInfo: PersonalInfo;
  athletics: Athletics;
  measurables: Measurable[];
  academic?: {
    currentGPA?: number;
    cumulativeGPA?: number;
    satScore?: number;
    actScore?: number;
    classRank?: string;
    honors?: string[];
    intendedMajor?: string;
  };
  academics?: {
    currentGPA?: number;
    cumulativeGPA?: number;
    satScore?: number;
    actScore?: number;
    classRank?: string;
    honors?: string[];
    intendedMajor?: string;
  };
  latestAchievement?: {
    title: string;
    date: string;
  };
  scoutingReport?: {
    strengths: string[];
    development: string[];
    intangibles: string[];
  };
}

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

interface ScheduleEvent {
  id: string;
  title: string;
  date: string;
  endDate?: string;
  location: string;
  type: string;
  coachAttendance: boolean;
  description: string;
  status: string;
}

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
    instagram?: {
      enabled: boolean;
      autoPost: boolean;
      defaultHashtags?: string[];
    };
    facebook?: {
      enabled: boolean;
      autoPost: boolean;
    };
  };
}

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
  source: 'upload' | 'youtube' | 'gamechanger';
  gameChangerUrl?: string | null;
}

interface VideosData {
  videos: VideoClip[];
}

const VIDEO_CATEGORIES = ['hitting', 'fielding', 'game', 'skills'] as const;
type VideoCategory = typeof VIDEO_CATEGORIES[number];
function isVideoCategory(value: string): value is VideoCategory {
  return (VIDEO_CATEGORIES as readonly string[]).includes(value);
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('player');
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [scheduleEvents, setScheduleEvents] = useState<ScheduleEvent[]>([]);
  const [photosConfig, setPhotosConfig] = useState<PhotosConfig | null>(null);
  const [socialConfig, setSocialConfig] = useState<SocialMediaConfig | null>(null);
  const [videosData, setVideosData] = useState<VideosData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<{ [key: string]: boolean }>({});
  const [showPasswordManager, setShowPasswordManager] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Admin API token for server-side middleware auth. Set NEXT_PUBLIC_ADMIN_TOKEN in env for production.
  const ADMIN_TOKEN = process.env.NEXT_PUBLIC_ADMIN_TOKEN || 'dev-admin-token';

  // Helper to add Authorization header for admin API calls
  const fetchWithAuth = (input: RequestInfo, init: RequestInit = {}) => {
    const headers = new Headers((init as RequestInit).headers || {});
    headers.set('Authorization', `Bearer ${ADMIN_TOKEN}`);
    return fetch(input as RequestInfo, { ...(init as RequestInit), headers });
  };

  // Load admin credentials from localStorage or use defaults
  const getStoredCredentials = () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('adminCredentials');
      if (stored) {
        return JSON.parse(stored);
      }
    }
    return { username: 'admin', password: 'lananolan2027' };
  };

  // Save admin credentials to localStorage
  const saveCredentials = (username: string, password: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('adminCredentials', JSON.stringify({ username, password }));
    }
  };

  // Authentication handler
  const handleLogin = () => {
    const credentials = getStoredCredentials();
    if (username === credentials.username && password === credentials.password) {
      // Set admin token cookie for middleware-protected API routes
      try {
        const secure = window.location.protocol === 'https:' ? '; Secure' : '';
        document.cookie = `admin_token=${ADMIN_TOKEN}; Path=/; Max-Age=${60 * 60 * 24 * 30}; SameSite=Lax${secure}`;
      } catch (e) {
        console.warn('Unable to set admin token cookie', e);
      }
      setIsAuthenticated(true);
      loadData();
    } else {
      alert('Incorrect username or password');
    }
  };

  // Change password handler
  const handleChangePassword = () => {
    if (!newUsername.trim()) {
      alert('Username is required');
      return;
    }
    if (newPassword.length < 8) {
      alert('Password must be at least 8 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    saveCredentials(newUsername.trim(), newPassword);
    alert('Admin credentials updated successfully!');
    setShowPasswordManager(false);
    setNewUsername('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const loadData = async () => {
    setLoading(true);
    try {
      // Load existing data from JSON files
      const [playerResponse, blogResponse, scheduleResponse, photosResponse, socialResponse, videosResponse] = await Promise.all([
        fetchWithAuth('/api/admin/player'),
        fetchWithAuth('/api/admin/blog'),
        fetchWithAuth('/api/admin/schedule'),
        fetchWithAuth('/api/admin/photos'),
        fetchWithAuth('/api/admin/social'),
        fetchWithAuth('/api/admin/videos')
      ]);

      if (playerResponse.ok) {
        const data = await playerResponse.json();
        setPlayerData(data);
      }
      
      if (blogResponse.ok) {
        const blogData = await blogResponse.json();
        setBlogPosts(blogData.posts || []);
      }
      
      if (scheduleResponse.ok) {
        const scheduleData = await scheduleResponse.json();
        setScheduleEvents(scheduleData.events || []);
      }

      if (photosResponse.ok) {
        const photosData = await photosResponse.json();
        setPhotosConfig(photosData);
      }

      if (socialResponse.ok) {
        const socialData = await socialResponse.json();
        setSocialConfig(socialData);
      }

      if (videosResponse.ok) {
        const videosData = await videosResponse.json();
        setVideosData(videosData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Error loading data. Please check the console for details.');
    } finally {
      setLoading(false);
    }
  };

  const savePlayerData = async () => {
    if (!playerData) return;
    
    setLoading(true);
    try {
      const response = await fetchWithAuth('/api/admin/player', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(playerData),
      });
      if (response.ok) {
        // Re-fetch to ensure local state matches persisted data (and public page reflects after reload)
        try {
          const refreshed = await fetchWithAuth('/api/admin/player');
          if (refreshed.ok) {
            const data = await refreshed.json();
            setPlayerData(data);
          }
        } catch (e) {
          console.warn('Saved, but failed to refresh player data', e);
        }
        alert('Player data saved successfully!');
      } else {
        throw new Error('Failed to save player data');
      }
    } catch (error) {
      console.error('Error saving player data:', error);
      alert('Error saving player data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addBlogPost = () => {
    const newPost: BlogPost = {
      id: Date.now().toString(),
      title: 'New Blog Post',
      content: '',
      excerpt: '',
      date: new Date().toISOString().split('T')[0],
      category: 'Tournament',
      published: false,
      autoPostToX: true, // Default to auto-post enabled
      xPostScheduled: false,
    };
    // Show newest at the top
    setBlogPosts([newPost, ...blogPosts]);
  };

  const saveBlogPosts = async () => {
    setLoading(true);
    try {
      const response = await fetchWithAuth('/api/admin/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ posts: blogPosts }),
      });
      if (response.ok) {
        alert('Blog posts saved successfully!');
      } else {
        throw new Error('Failed to save blog posts');
      }
    } catch (error) {
      console.error('Error saving blog posts:', error);
      alert('Error saving blog posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const togglePreview = (postId: string) => {
    setPreviewMode(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const toggleEditMode = (postId: string) => {
    setEditingPost(editingPost === postId ? null : postId);
  };

  const deleteBlogPost = (postId: string) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      setBlogPosts(blogPosts.filter(post => post.id !== postId));
    }
  };

  const duplicateBlogPost = (post: BlogPost) => {
    const newPost: BlogPost = {
      ...post,
      id: Date.now().toString(),
      title: `${post.title} (Copy)`,
      published: false,
      date: new Date().toISOString().split('T')[0],
      autoPostToX: true,
      xPostScheduled: false,
    };
    setBlogPosts([newPost, ...blogPosts]);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (post: BlogPost) => {
    if (post.published) {
      return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">✅ Published</span>;
    } else if (new Date(post.date) > new Date()) {
      return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">📅 Scheduled</span>;
    } else {
      return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">📝 Draft</span>;
    }
  };

  const addScheduleEvent = () => {
    const newEvent: ScheduleEvent = {
      id: Date.now().toString(),
      title: 'New Tournament',
      date: new Date().toISOString().split('T')[0],
      location: '',
      type: 'Tournament',
      coachAttendance: false,
      description: '',
      status: 'Upcoming',
    };
    // Show newly created event at the top
    setScheduleEvents([newEvent, ...scheduleEvents]);
  };

  const saveSchedule = async () => {
    setLoading(true);
    try {
      const response = await fetchWithAuth('/api/admin/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events: scheduleEvents }),
      });
      if (response.ok) {
        alert('Schedule saved successfully!');
      } else {
        throw new Error('Failed to save schedule');
      }
    } catch (error) {
      console.error('Error saving schedule:', error);
      alert('Error saving schedule. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addMeasurable = () => {
    if (!playerData) return;
    
    const newMeasurable: Measurable = {
      metric: 'New Metric',
      value: '',
      date: new Date().toISOString().split('T')[0],
      notes: '',
    };
    
    setPlayerData({
      ...playerData,
      measurables: [...playerData.measurables, newMeasurable],
    });
  };

  const removeMeasurable = (index: number) => {
    if (!playerData) return;
    
    const updatedMeasurables = playerData.measurables.filter((_, i) => i !== index);
    setPlayerData({
      ...playerData,
      measurables: updatedMeasurables,
    });
  };

  // Photo management functions
  const handlePhotoUpload = async (file: File, category: string, alt: string) => {
    setUploadingPhoto(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', category);
      formData.append('alt', alt);

      const response = await fetchWithAuth('/api/admin/photos', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        await response.json();
        // Reload photos config
        const photosResponse = await fetchWithAuth('/api/admin/photos');
        if (photosResponse.ok) {
          const photosData = await photosResponse.json();
          setPhotosConfig(photosData);
        }
        alert('Photo uploaded successfully!');
      } else {
        throw new Error('Failed to upload photo');
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Error uploading photo. Please try again.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const setActivePhoto = async (photoType: string, photoId: string) => {
    try {
      const response = await fetchWithAuth('/api/admin/photos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activePhotos: { [photoType]: photoId }
        }),
      });

      if (response.ok) {
        // Reload photos config
        const photosResponse = await fetchWithAuth('/api/admin/photos');
        if (photosResponse.ok) {
          const photosData = await photosResponse.json();
          setPhotosConfig(photosData);
        }
        alert('Active photo updated successfully!');
      }
    } catch (error) {
      console.error('Error updating active photo:', error);
      alert('Error updating photo. Please try again.');
    }
  };

  // Recruiting packet (PDF) functions
  const uploadRecruitingPacket = async (file: File) => {
    if (!file) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const resp = await fetchWithAuth('/api/admin/recruiting-packet', {
        method: 'POST',
        body: formData,
      });

      if (!resp.ok) {
        throw new Error('Failed to upload recruiting packet');
      }

      // Refresh player data to pick up recruitingPacketUrl
      const playerResponse = await fetchWithAuth('/api/admin/player');
      if (playerResponse.ok) {
        const data = await playerResponse.json();
        setPlayerData(data);
      }

      alert('Recruiting packet uploaded successfully!');
    } catch (e) {
      console.error('Error uploading recruiting packet:', e);
      alert('Error uploading recruiting packet. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const deleteRecruitingPacket = async () => {
    if (!playerData?.personalInfo?.recruitingPacketUrl) return;
    if (!confirm('Remove the recruiting packet link?')) return;

    setLoading(true);
    try {
      const resp = await fetchWithAuth('/api/admin/recruiting-packet', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: playerData.personalInfo.recruitingPacketUrl }),
      });

      if (!resp.ok) {
        throw new Error('Failed to delete recruiting packet');
      }

      // Refresh player data
      const playerResponse = await fetchWithAuth('/api/admin/player');
      if (playerResponse.ok) {
        const data = await playerResponse.json();
        setPlayerData(data);
      }

      alert('Recruiting packet removed');
    } catch (e) {
      console.error('Error deleting recruiting packet:', e);
      alert('Error deleting recruiting packet. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Social media functions
  const createSocialPost = async (content: string, platform: string, scheduledDate?: string, blogPostId?: string) => {
    try {
      const response = await fetchWithAuth('/api/admin/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'createPost',
          content,
          platform,
          scheduledDate,
          blogPostId,
        }),
      });

      if (response.ok) {
        // Reload social config
        const socialResponse = await fetchWithAuth('/api/admin/social');
        if (socialResponse.ok) {
          const socialData = await socialResponse.json();
          setSocialConfig(socialData);
        }
        alert('Social media post created successfully!');
      }
    } catch (error) {
      console.error('Error creating social post:', error);
      alert('Error creating social post. Please try again.');
    }
  };

  const postToSocialNow = async (postId: string) => {
    try {
      const response = await fetchWithAuth('/api/admin/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'postNow',
          id: postId,
        }),
      });

      if (response.ok) {
        // Reload social config
        const socialResponse = await fetchWithAuth('/api/admin/social');
        if (socialResponse.ok) {
          const socialData = await socialResponse.json();
          setSocialConfig(socialData);
        }
        alert('Posted to social media successfully!');
      }
    } catch (error) {
      console.error('Error posting to social media:', error);
      alert('Error posting to social media. Please try again.');
    }
  };

  // Video management functions
  const handleVideoUpload = async (file: File, title: string, description: string, category: VideoCategory, featured: boolean) => {
    setUploadingVideo(true);
    try {
      const formData = new FormData();
      formData.append('action', 'upload');
      formData.append('video', file);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('featured', featured.toString());

      const response = await fetchWithAuth('/api/admin/videos', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        // Reload videos data
        const videosResponse = await fetchWithAuth('/api/admin/videos');
        if (videosResponse.ok) {
          const videosData = await videosResponse.json();
          setVideosData(videosData);
        }
        alert('Video uploaded successfully!');
      } else {
        throw new Error('Failed to upload video');
      }
    } catch (error) {
      console.error('Error uploading video:', error);
      alert('Error uploading video. Please try again.');
    } finally {
      setUploadingVideo(false);
    }
  };

  const addVideoUrl = async (url: string, title: string, description: string, category: VideoCategory, featured: boolean) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('action', 'add_url');
      formData.append('url', url);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('featured', featured.toString());

      const response = await fetchWithAuth('/api/admin/videos', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        // Reload videos data
        const videosResponse = await fetchWithAuth('/api/admin/videos');
        if (videosResponse.ok) {
          const videosData = await videosResponse.json();
          setVideosData(videosData);
        }
        alert('Video added successfully!');
      } else {
        throw new Error('Failed to add video');
      }
    } catch (error) {
      console.error('Error adding video:', error);
      alert('Error adding video. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateVideo = async (videoId: string, title: string, description: string, category: VideoCategory, featured: boolean) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('action', 'update');
      formData.append('videoId', videoId);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('featured', featured.toString());

      const response = await fetchWithAuth('/api/admin/videos', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        // Reload videos data
        const videosResponse = await fetchWithAuth('/api/admin/videos');
        if (videosResponse.ok) {
          const videosData = await videosResponse.json();
          setVideosData(videosData);
        }
        alert('Video updated successfully!');
      } else {
        throw new Error('Failed to update video');
      }
    } catch (error) {
      console.error('Error updating video:', error);
      alert('Error updating video. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const deleteVideo = async (videoId: string) => {
    if (!confirm('Are you sure you want to delete this video?')) return;
    
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('action', 'delete');
      formData.append('videoId', videoId);

      const response = await fetchWithAuth('/api/admin/videos', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        // Reload videos data
        const videosResponse = await fetchWithAuth('/api/admin/videos');
        if (videosResponse.ok) {
          const videosData = await videosResponse.json();
          setVideosData(videosData);
        }
        alert('Video deleted successfully!');
      } else {
        throw new Error('Failed to delete video');
      }
    } catch (error) {
      console.error('Error deleting video:', error);
      alert('Error deleting video. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md p-8">
          <h1 className="text-2xl font-bold text-center mb-6 text-gray-900">Player Dashboard Login</h1>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Username
              </label>
              <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
            <Button onClick={handleLogin} className="w-full bg-green-600 hover:bg-green-700">
              Login
            </Button>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-600 text-center">
              Default: admin / lananolan2027
            </p>
          </div>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 admin-dashboard">
      {/* Mobile-Optimized Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 sm:py-4">
            <div>
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900">Player Dashboard</h1>
              <p className="text-xs sm:text-sm text-gray-700 hidden sm:block">Manage your recruiting website</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setShowPasswordManager(true)}
                variant="outline"
                size="sm"
                className="text-xs sm:text-sm text-gray-700 hover:text-gray-900"
              >
                <span className="hidden sm:inline">⚙️ Settings</span>
                <span className="sm:hidden">⚙️</span>
              </Button>
              <Button
                onClick={() => setIsAuthenticated(false)}
                variant="outline"
                size="sm"
                className="text-xs sm:text-sm text-gray-700 hover:text-gray-900"
              >
                <span className="hidden sm:inline">Logout</span>
                <span className="sm:hidden">🚪</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Password Manager Modal */}
      {showPasswordManager && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Player Dashboard Settings</h2>
              <Button
                onClick={() => setShowPasswordManager(false)}
                variant="outline"
                size="sm"
                className="text-gray-600 hover:text-gray-800"
              >
                ✕
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  New Username
                </label>
                <input
                  type="text"
                  placeholder="Enter new username"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="Enter new password (min 8 characters)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <Button
                  onClick={handleChangePassword}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Update Credentials
                </Button>
                <Button
                  onClick={() => setShowPasswordManager(false)}
                  variant="outline"
                  className="flex-1 text-gray-700 hover:text-gray-900"
                >
                  Cancel
                </Button>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-600">
                  <strong>Security Note:</strong> Credentials are stored locally in your browser.
                  Clear browser data will reset to defaults.
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Mobile-Optimized Navigation Tabs */}
        <div className="border-b border-gray-200 mb-6 sm:mb-8">
          <nav className="-mb-px flex overflow-x-auto scrollbar-hide">
            {[
              { id: 'player', name: 'Player', icon: '👤' },
              { id: 'blog', name: 'Blog', icon: '📝' },
              { id: 'schedule', name: 'Schedule', icon: '📅' },
              { id: 'photos', name: 'Photos', icon: '📸' },
              { id: 'social', name: 'Social', icon: '📱' },
              { id: 'videos', name: 'Videos', icon: '🎥' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 py-2 px-3 sm:px-4 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600 bg-green-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="sm:hidden mr-1">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.name === 'Player' ? 'Player Profile' : tab.name === 'Social' ? 'Social Media' : tab.name}</span>
                <span className="sm:hidden">{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Player Profile Tab */}
        {activeTab === 'player' && playerData && (
          <div className="space-y-8">
            {/* Personal Information */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={playerData.personalInfo?.name || ''}
                    onChange={(e) =>
                      setPlayerData({
                        ...playerData,
                        personalInfo: { ...(playerData.personalInfo || {}), name: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={playerData.personalInfo?.firstName || ''}
                    onChange={(e) =>
                      setPlayerData({
                        ...playerData,
                        personalInfo: { ...(playerData.personalInfo || {}), firstName: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={playerData.personalInfo?.lastName || ''}
                    onChange={(e) =>
                      setPlayerData({
                        ...playerData,
                        personalInfo: { ...(playerData.personalInfo || {}), lastName: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Graduation Year
                  </label>
                  <input
                    type="number"
                    value={playerData.personalInfo?.graduationYear || ''}
                    onChange={(e) =>
                      setPlayerData({
                        ...playerData,
                        personalInfo: { ...(playerData.personalInfo || {}), graduationYear: parseInt(e.target.value) || 0 },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={playerData.personalInfo?.email || ''}
                    onChange={(e) =>
                      setPlayerData({
                        ...playerData,
                        personalInfo: { ...(playerData.personalInfo || {}), email: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={playerData.personalInfo?.phone || ''}
                    onChange={(e) =>
                      setPlayerData({
                        ...playerData,
                        personalInfo: { ...(playerData.personalInfo || {}), phone: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Height
                  </label>
                  <input
                    type="text"
                    placeholder={'e.g., 5\'6"'}
                    value={playerData.personalInfo?.height || ''}
                    onChange={(e) =>
                      setPlayerData({
                        ...playerData,
                        personalInfo: { ...(playerData.personalInfo || {}), height: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Recruiting Packet (PDF)
                  </label>
                  {playerData.personalInfo?.recruitingPacketUrl ? (
                    <div className="flex items-center gap-3">
                      <a
                        href={playerData.personalInfo.recruitingPacketUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        View current PDF
                      </a>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={deleteRecruitingPacket}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <input
                        id="recruiting-packet-upload"
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) uploadRecruitingPacket(file);
                        }}
                      />
                      <label
                        htmlFor="recruiting-packet-upload"
                        className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors text-sm"
                      >
                        Upload PDF
                      </label>
                      <span className="text-xs text-gray-500">Max size depends on hosting limits</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Athletics Information */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Athletics Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Primary Position
                  </label>
                  <input
                    type="text"
                    value={playerData.athletics?.primaryPosition || ''}
                    onChange={(e) =>
                      setPlayerData({
                        ...playerData,
                        athletics: { ...(playerData.athletics || {}), primaryPosition: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Batting Stance
                  </label>
                  <select
                    value={playerData.athletics?.battingStance || ''}
                    onChange={(e) =>
                      setPlayerData({
                        ...playerData,
                        athletics: { ...(playerData.athletics || {}), battingStance: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Stance</option>
                    <option value="Right">Right</option>
                    <option value="Left">Left</option>
                    <option value="Switch">Switch</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Throwing Hand
                  </label>
                  <select
                    value={playerData.athletics?.throwingHand || ''}
                    onChange={(e) =>
                      setPlayerData({
                        ...playerData,
                        athletics: { ...(playerData.athletics || {}), throwingHand: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Hand</option>
                    <option value="Right">Right</option>
                    <option value="Left">Left</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hometown
                  </label>
                  <input
                    type="text"
                    value={playerData.athletics?.hometown || ''}
                    onChange={(e) =>
                      setPlayerData({
                        ...playerData,
                        athletics: { ...(playerData.athletics || {}), hometown: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    High School
                  </label>
                  <input
                    type="text"
                    value={playerData.athletics?.highSchool?.name || ''}
                    onChange={(e) =>
                      setPlayerData({
                        ...playerData,
                        athletics: { ...(playerData.athletics || {}), 
                          highSchool: { ...(playerData.athletics?.highSchool || {}), name: e.target.value }
                        },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Travel Team
                  </label>
                  <input
                    type="text"
                    value={playerData.athletics?.travelTeam?.name || ''}
                    onChange={(e) =>
                      setPlayerData({
                        ...playerData,
                        athletics: { ...(playerData.athletics || {}), 
                          travelTeam: { ...(playerData.athletics?.travelTeam || {}), name: e.target.value }
                        },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </Card>

            {/* Academic Information */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Academic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current GPA
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="4.0"
                    value={playerData.academics?.currentGPA || ''}
                    onChange={(e) =>
                      setPlayerData({
                        ...playerData,
                        academics: {
                          ...playerData.academics,
                          currentGPA: parseFloat(e.target.value) || 0
                        },
                      })
                    }
                    placeholder="e.g., 3.85"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cumulative GPA
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="4.0"
                    value={playerData.academics?.cumulativeGPA || ''}
                    onChange={(e) =>
                      setPlayerData({
                        ...playerData,
                        academics: {
                          ...playerData.academics,
                          cumulativeGPA: parseFloat(e.target.value) || 0
                        },
                      })
                    }
                    placeholder="e.g., 3.75"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SAT Score
                  </label>
                  <input
                    type="number"
                    min="400"
                    max="1600"
                    value={playerData.academics?.satScore || ''}
                    onChange={(e) =>
                      setPlayerData({
                        ...playerData,
                        academics: {
                          ...playerData.academics,
                          satScore: parseInt(e.target.value) || 0
                        },
                      })
                    }
                    placeholder="e.g., 1250"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ACT Score
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="36"
                    value={playerData.academics?.actScore || ''}
                    onChange={(e) =>
                      setPlayerData({
                        ...playerData,
                        academics: {
                          ...playerData.academics,
                          actScore: parseInt(e.target.value) || 0
                        },
                      })
                    }
                    placeholder="e.g., 28"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </Card>

            {/* Coach Contact Information */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Coach Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">High School Coach</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Coach Name
                      </label>
                      <input
                        type="text"
                        value={playerData.athletics?.highSchool?.coach || ''}
                        onChange={(e) =>
                          setPlayerData({
                            ...playerData,
                            athletics: { ...(playerData.athletics || {}),
                              highSchool: {
                                ...(playerData.athletics?.highSchool || {}),
                                coach: e.target.value
                              }
                            },
                          })
                        }
                        placeholder="Coach Name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Coach Email
                      </label>
                      <input
                        type="email"
                        value={playerData.athletics?.highSchool?.coachEmail || ''}
                        onChange={(e) =>
                          setPlayerData({
                            ...playerData,
                            athletics: { ...(playerData.athletics || {}),
                              highSchool: {
                                ...(playerData.athletics?.highSchool || {}),
                                coachEmail: e.target.value
                              }
                            },
                          })
                        }
                        placeholder="coach@school.edu"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Coach Phone
                      </label>
                      <input
                        type="tel"
                        value={playerData.athletics?.highSchool?.coachPhone || ''}
                        onChange={(e) =>
                          setPlayerData({
                            ...playerData,
                            athletics: { ...(playerData.athletics || {}),
                              highSchool: {
                                ...(playerData.athletics?.highSchool || {}),
                                coachPhone: e.target.value
                              }
                            },
                          })
                        }
                        placeholder="(555) 123-4567"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Team Profile Hub URL
                      </label>
                      <input
                        type="url"
                        value={playerData.athletics?.highSchool?.teamProfileHubUrl || ''}
                        onChange={(e) =>
                          setPlayerData({
                            ...playerData,
                            athletics: { ...(playerData.athletics || {}),
                              highSchool: {
                                ...(playerData.athletics?.highSchool || {}),
                                teamProfileHubUrl: e.target.value
                              }
                            },
                          })
                        }
                        placeholder="https://teamprofilehub.com/team/..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
<div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Facebook URL
                      </label>
                      <input
                        type="url"
                        value={playerData.athletics?.highSchool?.socialMedia?.facebook || ''}
                        onChange={(e) =>
                          setPlayerData({
                            ...playerData,
                            athletics: { ...(playerData.athletics || {}),
                              highSchool: {
                                ...(playerData.athletics?.highSchool || {}),
                                socialMedia: {
                                  ...(playerData.athletics?.highSchool?.socialMedia || {}),
                                  facebook: e.target.value
                                }
                              }
                            },
                          })
                        }
                        placeholder="https://facebook.com/highschool"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Twitter/X URL
                      </label>
                      <input
                        type="url"
                        value={playerData.athletics?.highSchool?.socialMedia?.twitter || ''}
                        onChange={(e) =>
                          setPlayerData({
                            ...playerData,
                            athletics: { ...(playerData.athletics || {}),
                              highSchool: {
                                ...(playerData.athletics?.highSchool || {}),
                                socialMedia: {
                                  ...(playerData.athletics?.highSchool?.socialMedia || {}),
                                  twitter: e.target.value
                                }
                              }
                            },
                          })
                        }
                        placeholder="https://x.com/highschool"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Instagram URL
                      </label>
                      <input
                        type="url"
                        value={playerData.athletics?.highSchool?.socialMedia?.instagram || ''}
                        onChange={(e) =>
                          setPlayerData({
                            ...playerData,
                            athletics: { ...(playerData.athletics || {}),
                              highSchool: {
                                ...(playerData.athletics?.highSchool || {}),
                                socialMedia: {
                                  ...(playerData.athletics?.highSchool?.socialMedia || {}),
                                  instagram: e.target.value
                                }
                              }
                            },
                          })
                        }
                        placeholder="https://instagram.com/highschool"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Website URL
                      </label>
                      <input
                        type="url"
                        value={playerData.athletics?.highSchool?.socialMedia?.website || ''}
                        onChange={(e) =>
                          setPlayerData({
                            ...playerData,
                            athletics: { ...(playerData.athletics || {}),
                              highSchool: {
                                ...(playerData.athletics?.highSchool || {}),
                                socialMedia: {
                                  ...(playerData.athletics?.highSchool?.socialMedia || {}),
                                  website: e.target.value
                                }
                              }
                            },
                          })
                        }
                        placeholder="https://highschool.example.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Show these High School links
  </label>
  <div className="flex flex-wrap gap-3 text-sm">
    {['facebook','twitter','instagram','website'].map((p) => {
      const allowed = playerData.athletics?.highSchool?.socialMediaAllowed || [];
      const checked = allowed.length === 0 ? true : allowed.includes(p);
      return (
        <label key={p} className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => {
              const prev = playerData.athletics?.highSchool?.socialMediaAllowed || [];
              let next: string[] = [];
              if (e.target.checked) {
                next = Array.from(new Set([...prev, p]));
              } else {
                next = prev.filter((x: string) => x !== p);
              }
              setPlayerData({
                ...playerData,
                athletics: { ...(playerData.athletics || {}),
                  highSchool: {
                    ...(playerData.athletics?.highSchool || {}),
                    socialMediaAllowed: next
                  }
                }
              });
            }}
          />
          <span className="capitalize">{p}</span>
        </label>
      );
    })}
  </div>
</div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-3">Travel Team Coach</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Coach Name
                      </label>
                      <input
                        type="text"
                        value={playerData.athletics?.travelTeam?.coach || ''}
                        onChange={(e) =>
                          setPlayerData({
                            ...playerData,
                            athletics: { ...(playerData.athletics || {}),
                              travelTeam: {
                                ...(playerData.athletics?.travelTeam || {}),
                                coach: e.target.value
                              }
                            },
                          })
                        }
                        placeholder="Coach Name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Coach Email
                      </label>
                      <input
                        type="email"
                        value={playerData.athletics?.travelTeam?.coachEmail || ''}
                        onChange={(e) =>
                          setPlayerData({
                            ...playerData,
                            athletics: { ...(playerData.athletics || {}),
                              travelTeam: {
                                ...(playerData.athletics?.travelTeam || {}),
                                coachEmail: e.target.value
                              }
                            },
                          })
                        }
                        placeholder="coach@travelteam.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Coach Phone
                      </label>
                      <input
                        type="tel"
                        value={playerData.athletics?.travelTeam?.coachPhone || ''}
                        onChange={(e) =>
                          setPlayerData({
                            ...playerData,
                            athletics: { ...(playerData.athletics || {}),
                              travelTeam: {
                                ...(playerData.athletics?.travelTeam || {}),
                                coachPhone: e.target.value
                              }
                            },
                          })
                        }
                        placeholder="(555) 123-4567"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Team Profile Hub URL
                      </label>
                      <input
                        type="url"
                        value={playerData.athletics?.travelTeam?.teamProfileHubUrl || ''}
                        onChange={(e) =>
                          setPlayerData({
                            ...playerData,
                            athletics: { ...(playerData.athletics || {}),
                              travelTeam: {
                                ...(playerData.athletics?.travelTeam || {}),
                                teamProfileHubUrl: e.target.value
                              }
                            },
                          })
                        }
                        placeholder="https://teamprofilehub.com/team/..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Facebook URL
                      </label>
                      <input
                        type="url"
                        value={playerData.athletics?.travelTeam?.socialMedia?.facebook || ''}
                        onChange={(e) =>
                          setPlayerData({
                            ...playerData,
                            athletics: { ...(playerData.athletics || {}),
                              travelTeam: {
                                ...(playerData.athletics?.travelTeam || {}),
                                socialMedia: {
                                  ...(playerData.athletics?.travelTeam?.socialMedia || {}),
                                  facebook: e.target.value
                                }
                              }
                            },
                          })
                        }
                        placeholder="https://facebook.com/teamname"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Twitter URL
                      </label>
                      <input
                        type="url"
                        value={playerData.athletics?.travelTeam?.socialMedia?.twitter || ''}
                        onChange={(e) =>
                          setPlayerData({
                            ...playerData,
                            athletics: { ...(playerData.athletics || {}),
                              travelTeam: {
                                ...(playerData.athletics?.travelTeam || {}),
                                socialMedia: {
                                  ...(playerData.athletics?.travelTeam?.socialMedia || {}),
                                  twitter: e.target.value
                                }
                              }
                            },
                          })
                        }
                        placeholder="https://twitter.com/teamname"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
<div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Instagram URL
                      </label>
                      <input
                        type="url"
                        value={playerData.athletics?.travelTeam?.socialMedia?.instagram || ''}
                        onChange={(e) =>
                          setPlayerData({
                            ...playerData,
                            athletics: { ...(playerData.athletics || {}),
                              travelTeam: {
                                ...(playerData.athletics?.travelTeam || {}),
                                socialMedia: {
                                  ...(playerData.athletics?.travelTeam?.socialMedia || {}),
                                  instagram: e.target.value
                                }
                              }
                            },
                          })
                        }
                        placeholder="https://instagram.com/teamname"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Website URL
                      </label>
                      <input
                        type="url"
                        value={playerData.athletics?.travelTeam?.socialMedia?.website || ''}
                        onChange={(e) =>
                          setPlayerData({
                            ...playerData,
                            athletics: { ...(playerData.athletics || {}),
                              travelTeam: {
                                ...(playerData.athletics?.travelTeam || {}),
                                socialMedia: {
                                  ...(playerData.athletics?.travelTeam?.socialMedia || {}),
                                  website: e.target.value
                                }
                              }
                            },
                          })
                        }
                        placeholder="https://travelteam.example.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> The &quot;Contact Coach&quot; button on the homepage will use the travel team coach email if available, otherwise the high school coach email.
                </p>
              </div>
            </Card>

            {/* Latest Achievement */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Latest Achievement</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Achievement Title
                  </label>
                  <input
                    type="text"
                    value={playerData.latestAchievement?.title || ''}
                    onChange={(e) =>
                      setPlayerData({
                        ...playerData,
                        latestAchievement: {
                          ...playerData.latestAchievement,
                          title: e.target.value,
                          date: playerData.latestAchievement?.date || ''
                        },
                      })
                    }
                    placeholder="e.g., Tournament MVP, All-Star Selection"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Achievement Date/Period
                  </label>
                  <input
                    type="text"
                    value={playerData.latestAchievement?.date || ''}
                    onChange={(e) =>
                      setPlayerData({
                        ...playerData,
                        latestAchievement: {
                          ...playerData.latestAchievement,
                          title: playerData.latestAchievement?.title || '',
                          date: e.target.value
                        },
                      })
                    }
                    placeholder="e.g., Spring 2024, Summer 2024"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> This achievement will be displayed prominently on the homepage hero section.
                </p>
              </div>
            </Card>

            {/* Measurables */}
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Measurables</h2>
                <Button onClick={addMeasurable} size="sm">
                  Add Measurable
                </Button>
              </div>
              <div className="space-y-4">
                {playerData.measurables?.map((measurable, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Metric
                      </label>
                      <input
                        type="text"
                        value={measurable.metric}
                        onChange={(e) => {
                          const updatedMeasurables = [...playerData.measurables];
                          updatedMeasurables[index].metric = e.target.value;
                          setPlayerData({
                            ...playerData,
                            measurables: updatedMeasurables,
                          });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Value
                      </label>
                      <input
                        type="text"
                        value={measurable.value}
                        onChange={(e) => {
                          const updatedMeasurables = [...playerData.measurables];
                          updatedMeasurables[index].value = e.target.value;
                          setPlayerData({
                            ...playerData,
                            measurables: updatedMeasurables,
                          });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date
                      </label>
                      <input
                        type="date"
                        value={measurable.date}
                        onChange={(e) => {
                          const updatedMeasurables = [...playerData.measurables];
                          updatedMeasurables[index].date = e.target.value;
                          setPlayerData({
                            ...playerData,
                            measurables: updatedMeasurables,
                          });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        onClick={() => removeMeasurable(index)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Scouting Report - Strengths */}
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Strengths</h2>
                <Button
                  onClick={() => {
                    if (!playerData.scoutingReport) {
                      setPlayerData({
                        ...playerData,
                        scoutingReport: { strengths: [''], development: [], intangibles: [] }
                      });
                    } else {
                      setPlayerData({
                        ...playerData,
                        scoutingReport: {
                          ...playerData.scoutingReport,
                          strengths: [...playerData.scoutingReport.strengths, '']
                        }
                      });
                    }
                  }}
                  size="sm"
                >
                  Add Strength
                </Button>
              </div>
              <div className="space-y-3">
                <p className="text-sm text-gray-600 mb-4">Current skill highlights and areas of excellence</p>
                {playerData.scoutingReport?.strengths?.map((strength, index) => (
                  <div key={index} className="flex gap-3 items-center">
                    <input
                      type="text"
                      value={strength}
                      onChange={(e) => {
                        const updatedStrengths = [...(playerData.scoutingReport?.strengths || [])];
                        updatedStrengths[index] = e.target.value;
                        setPlayerData({
                          ...playerData,
                          scoutingReport: {
                            ...playerData.scoutingReport,
                            strengths: updatedStrengths,
                            development: playerData.scoutingReport?.development || [],
                            intangibles: playerData.scoutingReport?.intangibles || []
                          }
                        });
                      }}
                      placeholder="e.g., Athleticism and first step quickness"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <Button
                      onClick={() => {
                        const updatedStrengths = playerData.scoutingReport?.strengths?.filter((_, i) => i !== index) || [];
                        setPlayerData({
                          ...playerData,
                          scoutingReport: {
                            ...playerData.scoutingReport,
                            strengths: updatedStrengths,
                            development: playerData.scoutingReport?.development || [],
                            intangibles: playerData.scoutingReport?.intangibles || []
                          }
                        });
                      }}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                {(!playerData.scoutingReport?.strengths || playerData.scoutingReport.strengths.length === 0) && (
                  <div className="text-center py-4 text-gray-500">
                    <p>No strengths added yet. Click &quot;Add Strength&quot; to get started.</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Scouting Report - Development Focus */}
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Development Focus</h2>
                <Button
                  onClick={() => {
                    if (!playerData.scoutingReport) {
                      setPlayerData({
                        ...playerData,
                        scoutingReport: { strengths: [], development: [''], intangibles: [] }
                      });
                    } else {
                      setPlayerData({
                        ...playerData,
                        scoutingReport: {
                          ...playerData.scoutingReport,
                          development: [...playerData.scoutingReport.development, '']
                        }
                      });
                    }
                  }}
                  size="sm"
                >
                  Add Development Area
                </Button>
              </div>
              <div className="space-y-3">
                <p className="text-sm text-gray-600 mb-4">Areas of continued improvement and growth</p>
                {playerData.scoutingReport?.development?.map((area, index) => (
                  <div key={index} className="flex gap-3 items-center">
                    <input
                      type="text"
                      value={area}
                      onChange={(e) => {
                        const updatedDevelopment = [...(playerData.scoutingReport?.development || [])];
                        updatedDevelopment[index] = e.target.value;
                        setPlayerData({
                          ...playerData,
                          scoutingReport: {
                            ...playerData.scoutingReport,
                            strengths: playerData.scoutingReport?.strengths || [],
                            development: updatedDevelopment,
                            intangibles: playerData.scoutingReport?.intangibles || []
                          }
                        });
                      }}
                      placeholder="e.g., Continued strength gains in the weight room"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <Button
                      onClick={() => {
                        const updatedDevelopment = playerData.scoutingReport?.development?.filter((_, i) => i !== index) || [];
                        setPlayerData({
                          ...playerData,
                          scoutingReport: {
                            ...playerData.scoutingReport,
                            strengths: playerData.scoutingReport?.strengths || [],
                            development: updatedDevelopment,
                            intangibles: playerData.scoutingReport?.intangibles || []
                          }
                        });
                      }}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                {(!playerData.scoutingReport?.development || playerData.scoutingReport.development.length === 0) && (
                  <div className="text-center py-4 text-gray-500">
                    <p>No development areas added yet. Click &quot;Add Development Area&quot; to get started.</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Scouting Report - Intangibles */}
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Intangibles</h2>
                <Button
                  onClick={() => {
                    if (!playerData.scoutingReport) {
                      setPlayerData({
                        ...playerData,
                        scoutingReport: { strengths: [], development: [], intangibles: [''] }
                      });
                    } else {
                      setPlayerData({
                        ...playerData,
                        scoutingReport: {
                          ...playerData.scoutingReport,
                          intangibles: [...playerData.scoutingReport.intangibles, '']
                        }
                      });
                    }
                  }}
                  size="sm"
                >
                  Add Intangible
                </Button>
              </div>
              <div className="space-y-3">
                <p className="text-sm text-gray-600 mb-4">Character and leadership qualities</p>
                {playerData.scoutingReport?.intangibles?.map((quality, index) => (
                  <div key={index} className="flex gap-3 items-center">
                    <input
                      type="text"
                      value={quality}
                      onChange={(e) => {
                        const updatedIntangibles = [...(playerData.scoutingReport?.intangibles || [])];
                        updatedIntangibles[index] = e.target.value;
                        setPlayerData({
                          ...playerData,
                          scoutingReport: {
                            ...playerData.scoutingReport,
                            strengths: playerData.scoutingReport?.strengths || [],
                            development: playerData.scoutingReport?.development || [],
                            intangibles: updatedIntangibles
                          }
                        });
                      }}
                      placeholder="e.g., Natural leadership qualities"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <Button
                      onClick={() => {
                        const updatedIntangibles = playerData.scoutingReport?.intangibles?.filter((_, i) => i !== index) || [];
                        setPlayerData({
                          ...playerData,
                          scoutingReport: {
                            ...playerData.scoutingReport,
                            strengths: playerData.scoutingReport?.strengths || [],
                            development: playerData.scoutingReport?.development || [],
                            intangibles: updatedIntangibles
                          }
                        });
                      }}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                {(!playerData.scoutingReport?.intangibles || playerData.scoutingReport.intangibles.length === 0) && (
                  <div className="text-center py-4 text-gray-500">
                    <p>No intangibles added yet. Click &quot;Add Intangible&quot; to get started.</p>
                  </div>
                )}
              </div>
            </Card>

            <Button onClick={savePlayerData} className="w-full" disabled={loading}>
              {loading ? 'Saving...' : 'Save Player Data'}
            </Button>
          </div>
        )}

        {/* Blog Posts Tab - WordPress Style */}
        {activeTab === 'blog' && (
          <div className="space-y-6">
            {/* Mobile-Optimized Header with Actions */}
            <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-3 sm:space-y-0">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Blog Posts</h2>
                  <p className="text-gray-600 mt-1 text-sm sm:text-base">Create and manage your blog content</p>
                </div>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                  <Button onClick={addBlogPost} className="bg-green-600 hover:bg-green-700 text-sm sm:text-base">
                    <span className="sm:hidden">✏️ New</span>
                    <span className="hidden sm:inline">✏️ New Post</span>
                  </Button>
                  <Button onClick={saveBlogPosts} disabled={loading} variant="outline" className="text-sm sm:text-base">
                    {loading ? '💾 Saving...' : '💾 Save All'}
                  </Button>
                </div>
              </div>

              {/* Mobile-Optimized Blog Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                  <div className="text-xl sm:text-2xl font-bold text-blue-600">{blogPosts.length}</div>
                  <div className="text-xs sm:text-sm text-blue-800">Total Posts</div>
                </div>
                <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
                  <div className="text-xl sm:text-2xl font-bold text-green-600">{blogPosts.filter(p => p.published).length}</div>
                  <div className="text-xs sm:text-sm text-green-800">Published</div>
                </div>
                <div className="bg-yellow-50 p-3 sm:p-4 rounded-lg">
                  <div className="text-xl sm:text-2xl font-bold text-yellow-600">{blogPosts.filter(p => new Date(p.date) > new Date() && !p.published).length}</div>
                  <div className="text-xs sm:text-sm text-yellow-800">Scheduled</div>
                </div>
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                  <div className="text-xl sm:text-2xl font-bold text-gray-600">{blogPosts.filter(p => !p.published && new Date(p.date) <= new Date()).length}</div>
                  <div className="text-xs sm:text-sm text-gray-800">Drafts</div>
                </div>
              </div>
            </div>

            {/* Blog Posts List */}
            <div className="space-y-4">
              {blogPosts.map((post, index) => (
                <div key={post.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                  {/* Mobile-Optimized Post Header */}
                  <div className="p-3 sm:p-4 border-b bg-gray-50">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-3 sm:space-y-0">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                            {post.title || 'Untitled Post'}
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {getStatusBadge(post)}
                            {post.autoPostToX && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                🐦 Auto-X
                              </span>
                            )}
                            {post.xPostScheduled && (
                              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                ✅ X Scheduled
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-2 text-xs sm:text-sm text-gray-600 space-y-1 sm:space-y-0">
                          <span>📅 {formatDate(post.date)}</span>
                          <span>🏷️ {post.category}</span>
                          <span className="hidden sm:inline">📝 {post.content.length} characters</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 sm:flex-nowrap sm:items-center sm:space-x-2">
                        <Button
                          onClick={() => togglePreview(post.id)}
                          size="sm"
                          variant="outline"
                          className="text-xs flex-1 sm:flex-none"
                        >
                          <span className="sm:hidden">{previewMode[post.id] ? '✏️' : '👁️'}</span>
                          <span className="hidden sm:inline">{previewMode[post.id] ? '✏️ Edit' : '👁️ Preview'}</span>
                        </Button>
                        <Button
                          onClick={() => toggleEditMode(post.id)}
                          size="sm"
                          variant="outline"
                          className="text-xs flex-1 sm:flex-none"
                        >
                          <span className="sm:hidden">{editingPost === post.id ? '📋' : '⚙️'}</span>
                          <span className="hidden sm:inline">{editingPost === post.id ? '📋 Collapse' : '⚙️ Settings'}</span>
                        </Button>
                        <Button
                          onClick={() => duplicateBlogPost(post)}
                          size="sm"
                          variant="outline"
                          className="text-xs flex-1 sm:flex-none"
                        >
                          <span className="sm:hidden">📄</span>
                          <span className="hidden sm:inline">📄 Copy</span>
                        </Button>
                        <Button
                          onClick={() => deleteBlogPost(post.id)}
                          size="sm"
                          variant="outline"
                          className="text-xs text-red-600 hover:text-red-700 flex-1 sm:flex-none"
                        >
                          <span className="sm:hidden">🗑️</span>
                          <span className="hidden sm:inline">🗑️ Delete</span>
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Mobile-Optimized Post Content - Edit/Preview Mode */}
                  <div className="p-4 sm:p-6">
                    {previewMode[post.id] ? (
                      /* Preview Mode */
                      <div className="prose max-w-none">
                        <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-blue-500">
                          <h2 className="text-2xl font-bold text-gray-900 mb-3">{post.title}</h2>
                          <div className="text-gray-600 mb-4 italic">{post.excerpt}</div>
                          <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                            {post.content}
                          </div>
                          <div className="mt-6 pt-4 border-t border-gray-200">
                            <div className="flex items-center justify-between text-sm text-gray-500">
                              <span>Published on {formatDate(post.date)}</span>
                              <span>Category: {post.category}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Edit Mode */
                      <div className="space-y-4">
                        {/* Title */}
                        <div>
                          <input
                            type="text"
                            placeholder="Enter post title..."
                            value={post.title}
                            onChange={(e) => {
                              const updatedPosts = [...blogPosts];
                              updatedPosts[index].title = e.target.value;
                              setBlogPosts(updatedPosts);
                            }}
                            className="w-full text-xl font-semibold px-0 py-2 border-0 border-b-2 border-gray-200 focus:border-blue-500 focus:ring-0 bg-transparent placeholder-gray-400"
                          />
                        </div>

                        {/* Excerpt */}
                        <div>
                          <textarea
                            placeholder="Write a compelling excerpt..."
                            rows={2}
                            value={post.excerpt}
                            onChange={(e) => {
                              const updatedPosts = [...blogPosts];
                              updatedPosts[index].excerpt = e.target.value;
                              setBlogPosts(updatedPosts);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none placeholder-gray-400"
                          />
                        </div>

                        {/* Content Editor */}
                        <div>
                          <textarea
                            placeholder="Tell your story..."
                            rows={8}
                            value={post.content}
                            onChange={(e) => {
                              const updatedPosts = [...blogPosts];
                              updatedPosts[index].content = e.target.value;
                              setBlogPosts(updatedPosts);
                            }}
                            className="w-full px-3 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y placeholder-gray-400 font-mono text-sm leading-relaxed"
                          />
                        </div>
                      </div>
                    )}

                    {/* Post Settings Panel */}
                    {editingPost === post.id && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <h4 className="text-lg font-semibold mb-4">📋 Post Settings</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {/* Publishing */}
                          <div className="space-y-4">
                            <h5 className="font-medium text-gray-900">📅 Publishing</h5>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Publish Date
                              </label>
                              <input
                                type="date"
                                value={post.date}
                                onChange={(e) => {
                                  const updatedPosts = [...blogPosts];
                                  updatedPosts[index].date = e.target.value;
                                  setBlogPosts(updatedPosts);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Category
                              </label>
                              <select
                                value={post.category}
                                onChange={(e) => {
                                  const updatedPosts = [...blogPosts];
                                  updatedPosts[index].category = e.target.value;
                                  setBlogPosts(updatedPosts);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              >
                                <option value="Tournament">🏆 Tournament</option>
                                <option value="Achievement">🎯 Achievement</option>
                                <option value="Training">💪 Training</option>
                                <option value="News">📰 News</option>
                              </select>
                            </div>
                          </div>

                          {/* Status & Visibility */}
                          <div className="space-y-3 sm:space-y-4">
                            <h5 className="font-medium text-gray-900 text-sm sm:text-base">👁️ Visibility</h5>
                            <div className="space-y-2 sm:space-y-3">
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={post.published}
                                  onChange={(e) => {
                                    const updatedPosts = [...blogPosts];
                                    updatedPosts[index].published = e.target.checked;
                                    setBlogPosts(updatedPosts);
                                  }}
                                  className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label className="text-sm font-medium text-gray-700">
                                  📢 Published
                                </label>
                              </div>
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={post.autoPostToX || false}
                                  onChange={(e) => {
                                    const updatedPosts = [...blogPosts];
                                    updatedPosts[index].autoPostToX = e.target.checked;
                                    setBlogPosts(updatedPosts);
                                  }}
                                  className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label className="text-sm font-medium text-gray-700">
                                  🐦 Auto-post to X
                                </label>
                              </div>
                            </div>
                          </div>

                          {/* Social Media Actions */}
                          <div className="space-y-4">
                            <h5 className="font-medium text-gray-900">📱 Social Media</h5>
                            <div className="space-y-2">
                              <Button
                                onClick={() => createSocialPost(
                                  `${post.title}\n\n${post.excerpt}`,
                                  'twitter',
                                  undefined,
                                  post.id
                                )}
                                size="sm"
                                variant="outline"
                                className="w-full"
                              >
                                🐦 Post to X Now
                              </Button>
                              {post.xPostScheduled && (
                                <div className="text-xs text-green-600 text-center">
                                  ✅ X post already scheduled
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {blogPosts.length === 0 && (
                <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                  <div className="text-gray-400 text-6xl mb-4">📝</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No blog posts yet</h3>
                  <p className="text-gray-600 mb-6">Create your first blog post to start sharing your softball journey!</p>
                  <Button onClick={addBlogPost} className="bg-green-600 hover:bg-green-700">
                    ✏️ Create Your First Post
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Schedule Tab */}
        {activeTab === 'schedule' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Schedule</h2>
              <Button onClick={addScheduleEvent}>Add New Event</Button>
            </div>
            
            {scheduleEvents.map((event, index) => (
              <Card key={event.id} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Event Title
                    </label>
                    <input
                      type="text"
                      value={event.title}
                      onChange={(e) => {
                        const updatedEvents = [...scheduleEvents];
                        updatedEvents[index].title = e.target.value;
                        setScheduleEvents(updatedEvents);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={event.date}
                      onChange={(e) => {
                        const updatedEvents = [...scheduleEvents];
                        updatedEvents[index].date = e.target.value;
                        setScheduleEvents(updatedEvents);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={event.location}
                      onChange={(e) => {
                        const updatedEvents = [...scheduleEvents];
                        updatedEvents[index].location = e.target.value;
                        setScheduleEvents(updatedEvents);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type
                    </label>
                    <select
                      value={event.type}
                      onChange={(e) => {
                        const updatedEvents = [...scheduleEvents];
                        updatedEvents[index].type = e.target.value;
                        setScheduleEvents(updatedEvents);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Tournament">Tournament</option>
                      <option value="Showcase">Showcase</option>
                      <option value="Camp">Camp</option>
                      <option value="Game">Game</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      rows={2}
                      value={event.description}
                      onChange={(e) => {
                        const updatedEvents = [...scheduleEvents];
                        updatedEvents[index].description = e.target.value;
                        setScheduleEvents(updatedEvents);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={event.coachAttendance}
                      onChange={(e) => {
                        const updatedEvents = [...scheduleEvents];
                        updatedEvents[index].coachAttendance = e.target.checked;
                        setScheduleEvents(updatedEvents);
                      }}
                      className="mr-2"
                    />
                    <label className="text-sm font-medium text-gray-700">
                      Coach Attendance Expected
                    </label>
                  </div>
                </div>
              </Card>
            ))}
            
            <Button onClick={saveSchedule} className="w-full" disabled={loading}>
              {loading ? 'Saving...' : 'Save Schedule'}
            </Button>
          </div>
        )}

        {/* Photos Tab */}
        {activeTab === 'photos' && photosConfig && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Photo Management</h2>
              <div className="flex space-x-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const category = prompt('Enter photo category (hero, profile, action, team, blog):') || 'blog';
                      const alt = prompt('Enter alt text for the photo:') || file.name;
                      handlePhotoUpload(file, category, alt);
                    }
                  }}
                  className="hidden"
                  id="photo-upload"
                />
                <label
                  htmlFor="photo-upload"
                  className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                >
                  {uploadingPhoto ? 'Uploading...' : 'Upload Photo'}
                </label>
              </div>
            </div>

            {/* Active Photos */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">🖼️ Active Photos - Website Display</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(photosConfig.activePhotos).map(([type, photoId]) => {
                  const photo = photosConfig.photos.find(p => p.id === photoId);
                  const displayName = type === 'heroImage' ? 'Hero Background' :
                                    type === 'profileImage' ? 'Profile Photo' :
                                    'Professional Action Photo (Homepage)';
                  const description = type === 'heroImage' ? 'Background image for homepage header' :
                                    type === 'profileImage' ? 'Main profile photo' :
                                    'Featured action photo displayed on homepage hero section';
                  return (
                    <div key={type} className="text-center">
                      <h4 className="font-medium mb-1">{displayName}</h4>
                      <p className="text-xs text-gray-500 mb-3">{description}</p>
                      {photo ? (
                        <div className="relative">
                          <Image
                            src={photo.url}
                            alt={photo.alt}
                            width={200}
                            height={150}
                            className="rounded-lg object-cover mx-auto"
                          />
                          <p className="text-sm text-gray-600 mt-2">{photo.alt}</p>
                          {type === 'featuredAction' && (
                            <div className="mt-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              ✅ Live on Homepage
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="w-48 h-36 bg-gray-200 rounded-lg flex items-center justify-center mx-auto">
                          <div className="text-center">
                            <span className="text-gray-500 text-sm">No photo set</span>
                            {type === 'featuredAction' && (
                              <p className="text-xs text-red-500 mt-1">Upload & set to display on homepage</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* All Photos */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">All Photos</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {photosConfig.photos.map((photo) => (
                  <div key={photo.id} className="relative group">
                    <Image
                      src={photo.url}
                      alt={photo.alt}
                      width={150}
                      height={100}
                      className="rounded-lg object-cover w-full h-24"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-white text-xs mb-2">{photo.category}</p>
                        <select
                          onChange={(e) => {
                            if (e.target.value) {
                              setActivePhoto(e.target.value, photo.id);
                              e.target.value = '';
                            }
                          }}
                          className="text-xs px-2 py-1 rounded"
                          defaultValue=""
                        >
                          <option value="">Set as...</option>
                          <option value="heroImage">Hero Background</option>
                          <option value="profileImage">Profile Photo</option>
                          <option value="featuredAction">Professional Action (Homepage)</option>
                        </select>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mt-1 truncate">{photo.alt}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Social Media Tab */}
        {activeTab === 'social' && socialConfig && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Social Media Management</h2>
              <Button
                onClick={() => {
                  const content = prompt('Enter post content:');
                  if (content) {
                    const platformInput = (prompt('Platform (twitter, instagram, facebook):', 'twitter') || 'twitter').toLowerCase();
                    const platform = (['twitter', 'instagram', 'facebook'].includes(platformInput) ? platformInput : 'twitter') as 'twitter' | 'instagram' | 'facebook';
                    const scheduledDate = prompt('Schedule for later? (YYYY-MM-DD HH:MM or leave empty for now):');
                    createSocialPost(content, platform, scheduledDate || undefined);
                  }
                }}
              >
                Create Post
              </Button>
            </div>

            {/* Social Media Settings */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Settings</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 border rounded-md">
                    <h4 className="font-medium mb-2">Twitter/X</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Enabled: {socialConfig.settings.twitter.enabled ? 'Yes' : 'No'} • Auto-post: {socialConfig.settings.twitter.autoPost ? 'Yes' : 'No'}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      Default Hashtags: {socialConfig.settings.twitter.defaultHashtags.join(', ')}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        try {
                          const enabled = prompt('Enable Twitter/X? (true/false)', String(socialConfig.settings.twitter.enabled));
                          const autoPost = prompt('Auto-post blog to X? (true/false)', String(socialConfig.settings.twitter.autoPost));
                          const hashtags = prompt('Default hashtags (comma-separated)', socialConfig.settings.twitter.defaultHashtags.join(', ')) || '';
                          const apiKey = prompt('X API Key (leave blank to keep current)', socialConfig.settings.twitter.credentials?.apiKey || '') || '';
                          const apiSecret = prompt('X API Secret (leave blank to keep current)', socialConfig.settings.twitter.credentials?.apiSecret || '') || '';
                          const accessToken = prompt('X Access Token (leave blank to keep current)', socialConfig.settings.twitter.credentials?.accessToken || '') || '';
                          const accessSecret = prompt('X Access Secret (leave blank to keep current)', socialConfig.settings.twitter.credentials?.accessSecret || '') || '';

                          const resp = await fetchWithAuth('/api/admin/social', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              action: 'updateSettings',
                              settings: {
                                twitter: {
                                  enabled: String(enabled).toLowerCase() === 'true',
                                  autoPost: String(autoPost).toLowerCase() === 'true',
                                  defaultHashtags: hashtags.split(',').map(s => s.trim()).filter(Boolean),
                                  credentials: {
                                    apiKey,
                                    apiSecret,
                                    accessToken,
                                    accessSecret
                                  }
                                }
                              }
                            })
                          });
                          if (resp.ok) {
                            const refreshed = await fetchWithAuth('/api/admin/social');
                            if (refreshed.ok) {
                              const data = await refreshed.json();
                              setSocialConfig(data);
                            }
                            alert('Social settings updated');
                          } else {
                            alert('Failed to update settings');
                          }
                        } catch (e) {
                          console.error(e);
                          alert('Error updating settings');
                        }
                      }}
                    >
                      Edit Settings
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Social Media Posts */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Posts</h3>
              <div className="space-y-4">
                {socialConfig.posts.slice(0, 10).map((post) => (
                  <div key={post.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-blue-500">🐦</span>
                        <span className="font-medium">{post.platform}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          post.status === 'posted' ? 'bg-green-100 text-green-800' :
                          post.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                          post.status === 'failed' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {post.status}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        {post.status === 'draft' && (
                          <Button
                            onClick={() => postToSocialNow(post.id)}
                            size="sm"
                            variant="outline"
                          >
                            Post Now
                          </Button>
                        )}
                        {post.status === 'scheduled' && (
                          <span className="text-sm text-gray-600">
                            Scheduled: {new Date(post.scheduledDate!).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-700 mb-2">{post.content}</p>
                    <div className="flex flex-wrap gap-1">
                      {post.hashtags.map((tag, index) => (
                        <span key={index} className="text-blue-500 text-sm">{tag}</span>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Created: {new Date(post.createdAt).toLocaleString()}
                      {post.postedAt && ` • Posted: ${new Date(post.postedAt).toLocaleString()}`}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Videos Tab */}
        {activeTab === 'videos' && videosData && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Video Management</h2>
              <div className="flex space-x-2">
                <Button
                  onClick={() => {
                    const url = prompt('Enter video URL (YouTube, GameChanger):');
                    if (url) {
                      const title = prompt('Enter video title:') || 'Untitled Video';
                      const description = prompt('Enter video description:') || '';
                      const categoryInput = (prompt('Enter category (hitting, fielding, game, skills):', 'game') || 'game').toLowerCase();
                      const category: VideoCategory = isVideoCategory(categoryInput) ? categoryInput : 'game';
                      const featured = confirm('Mark as featured video?');
                      addVideoUrl(url, title, description, category, featured);
                    }
                  }}
                  variant="outline"
                >
                  🔗 Add URL
                </Button>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const title = prompt('Enter video title:') || file.name;
                      const description = prompt('Enter video description:') || '';
                      const categoryInput = (prompt('Enter category (hitting, fielding, game, skills):', 'game') || 'game').toLowerCase();
                      const category: VideoCategory = isVideoCategory(categoryInput) ? categoryInput : 'game';
                      const featured = confirm('Mark as featured video?');
                      handleVideoUpload(file, title, description, category, featured);
                    }
                  }}
                  className="hidden"
                  id="video-upload"
                />
                <label
                  htmlFor="video-upload"
                  className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                >
                  {uploadingVideo ? 'Uploading...' : '📹 Upload Video'}
                </label>
              </div>
            </div>

            {/* Video Upload Instructions */}
            <Card className="p-6 bg-blue-50 border-blue-200">
              <h3 className="text-lg font-semibold mb-3 text-blue-900">📋 Video Upload Guide</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium text-blue-800 mb-2">🎬 Supported Platforms:</h4>
                  <ul className="space-y-1 text-blue-700">
                    <li>• <strong>Team Profile Hub:</strong> Direct URL linking with auto-thumbnail</li>
                    <li>• <strong>YouTube:</strong> Full video embedding support</li>
                    
                    <li>• <strong>File Upload:</strong> MP4, MOV, AVI formats</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-blue-800 mb-2">📂 Video Categories:</h4>
                  <ul className="space-y-1 text-blue-700">
                    <li>• <strong>Hitting:</strong> Batting practice, at-bats</li>
                    <li>• <strong>Fielding:</strong> Defensive plays, throws</li>
                    <li>• <strong>Game:</strong> Live game situations</li>
                    <li>• <strong>Skills:</strong> Training and drills</li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Featured Videos */}
            {videosData.videos.filter(v => v.featured).length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">⭐ Featured Videos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {videosData.videos.filter(v => v.featured).map((video) => (
                    <div key={video.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{video.title}</h4>
                          <p className="text-sm text-gray-600">{video.description}</p>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            video.source === 'gamechanger' ? 'bg-green-100 text-green-800' :
                            video.source === 'youtube' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {video.source === 'gamechanger' ? '🎮 Team Profile Hub' :
                             video.source === 'youtube' ? '📺 YouTube' :
                             '📹 Upload'}
                          </span>
                          <span className="text-xs text-gray-500 capitalize">{video.category}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>{new Date(video.date).toLocaleDateString()}</span>
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => {
                              const title = prompt('Enter new title:', video.title) || video.title;
                              const description = prompt('Enter new description:', video.description) || video.description;
                              const categoryInput = prompt('Enter category (hitting, fielding, game, skills):', video.category) || video.category;
                              const category: VideoCategory = isVideoCategory(categoryInput) ? categoryInput : video.category;
                              const featured = confirm('Keep as featured video?');
                              updateVideo(video.id, title, description, category, featured);
                            }}
                            size="sm"
                            variant="outline"
                          >
                            ✏️ Edit
                          </Button>
                          <Button
                            onClick={() => deleteVideo(video.id)}
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                          >
                            🗑️ Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* All Videos by Category */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">📚 All Videos</h3>
              {['hitting', 'fielding', 'game', 'skills'].map((category) => {
                const categoryVideos = videosData.videos.filter(v => v.category === category);
                if (categoryVideos.length === 0) return null;
                
                return (
                  <div key={category} className="mb-6">
                    <h4 className="font-medium mb-3 capitalize text-gray-800">
                      {category === 'hitting' ? '🏏 Hitting' :
                       category === 'fielding' ? '🥎 Fielding' :
                       category === 'game' ? '⚾ Game Situations' :
                       '🎯 Skills Training'} ({categoryVideos.length})
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {categoryVideos.map((video) => (
                        <div key={video.id} className="border rounded-lg p-3">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <h5 className="font-medium text-sm">{video.title}</h5>
                              <p className="text-xs text-gray-600 line-clamp-2">{video.description}</p>
                            </div>
                            {video.featured && (
                              <span className="text-yellow-500 text-xs">⭐</span>
                            )}
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded text-xs ${
                                video.source === 'gamechanger' ? 'bg-green-100 text-green-700' :
                                video.source === 'youtube' ? 'bg-red-100 text-red-700' :
                                'bg-blue-100 text-blue-700'
                              }`}>
                                {video.source}
                              </span>
                              <span className="text-xs text-gray-500">
                                {new Date(video.date).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex space-x-1">
                              {video.source !== 'upload' && (
                                <Button
                                  onClick={() => window.open(video.url, '_blank')}
                                  size="sm"
                                  variant="outline"
                                  className="text-xs px-2 py-1"
                                >
                                  🔗 View
                                </Button>
                              )}
                              <Button
                                onClick={() => {
                                  const title = prompt('Enter new title:', video.title) || video.title;
                                  const description = prompt('Enter new description:', video.description) || video.description;
                                  const categoryInput = prompt('Enter category (hitting, fielding, game, skills):', video.category) || video.category;
                                  const category: VideoCategory = isVideoCategory(categoryInput) ? categoryInput : video.category;
                                  const featured = confirm('Mark as featured video?');
                                  updateVideo(video.id, title, description, category, featured);
                                }}
                                size="sm"
                                variant="outline"
                                className="text-xs px-2 py-1"
                              >
                                ✏️
                              </Button>
                              <Button
                                onClick={() => deleteVideo(video.id)}
                                size="sm"
                                variant="outline"
                                className="text-xs px-2 py-1 text-red-600 hover:text-red-700"
                              >
                                🗑️
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
              
              {videosData.videos.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p className="mb-4">No videos uploaded yet.</p>
                  <p className="text-sm">Use the buttons above to add your first highlight video!</p>
                </div>
              )}
            </Card>

            {/* GameChanger Integration Info */}
            <Card className="p-6 bg-green-50 border-green-200">
              <h3 className="text-lg font-semibold mb-3 text-green-900">🎮 Team Profile Hub Integration</h3>
              <div className="text-sm text-green-800">
                <p className="mb-2">
                  <strong>Paste Team Profile Hub video URLs directly!</strong> The system will automatically:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Extract video ID and generate thumbnails</li>
                  <li>Detect Team Profile Hub platform automatically</li>
                  <li>Support all Team Profile Hub video formats</li>
                  <li>Maintain original video quality and metadata</li>
                </ul>
                <p className="mt-3 text-xs text-green-700">
                  <strong>Example URLs:</strong> teamprofilehub.com/team/video/abc123, tph.com/highlights/xyz789
                </p>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}