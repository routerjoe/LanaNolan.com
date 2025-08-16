'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// import ReactPlayer from 'react-player';
import { cn } from '../../utils/helpers';
import Card, { CardContent } from '../ui/Card';
import Button from '../ui/Button';
import LoadingSpinner from '../ui/LoadingSpinner';
import { Play, X, Clock, Calendar, ExternalLink } from 'lucide-react';

interface VideoGalleryProps {
  className?: string;
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
  featured?: boolean;
  source: 'upload' | 'youtube' | 'gamechanger';
  teamProfileHubUrl?: string | null;
}

const VideoGallery: React.FC<VideoGalleryProps> = ({ className }) => {
  const [selectedVideo, setSelectedVideo] = useState<VideoClip | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [videos, setVideos] = useState<VideoClip[]>([]);
  const [loading, setLoading] = useState(true);

  // Load videos from API
  React.useEffect(() => {
    const loadVideos = async () => {
      try {
        const response = await fetch('/api/videos');
        if (response.ok) {
          const data = await response.json();
          setVideos(data.videos || []);
        }
      } catch (error) {
        console.error('Error loading videos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadVideos();
  }, []);

  const categories = [
    { id: 'all', name: 'All Videos', icon: Play },
    { id: 'hitting', name: 'Hitting', icon: Play },
    { id: 'fielding', name: 'Fielding', icon: Play },
    { id: 'game', name: 'Game Situations', icon: Play },
    { id: 'skills', name: 'Skills Training', icon: Play },
  ];

  const filteredVideos = activeCategory === 'all' 
    ? videos 
    : videos.filter(video => video.category === activeCategory);

  const featuredVideo = videos.find(video => video.featured);

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const openVideoModal = (video: VideoClip) => {
    setSelectedVideo(video);
  };

  const closeVideoModal = () => {
    setSelectedVideo(null);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section id="videos" className={cn('section-padding', className)}>
      <div className="container mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="heading-lg mb-4">Video Highlights</h2>
            <p className="body-lg text-secondary-600 max-w-2xl mx-auto">
              Watch game footage, skills demonstrations, and training sessions showcasing athletic development and performance.
            </p>
          </motion.div>

          {/* Featured Video */}
          {featuredVideo && (
            <motion.div variants={itemVariants} className="mb-12">
              <Card variant="elevated" className="overflow-hidden">
                <div className="relative aspect-video bg-secondary-900">
                  {/* Placeholder for video thumbnail */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-secondary-800 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Play className="w-16 h-16 mx-auto mb-4 opacity-80" />
                      <h3 className="text-xl font-semibold mb-2">{featuredVideo.title}</h3>
                      <p className="text-secondary-300">{featuredVideo.description}</p>
                    </div>
                  </div>
                  
                  {/* Play Button Overlay */}
                  <button
                    onClick={() => openVideoModal(featuredVideo)}
                    className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors group"
                  >
                    <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center group-hover:bg-white transition-colors">
                      <Play className="w-8 h-8 text-primary-600 ml-1" />
                    </div>
                  </button>
                  
                  {/* Video Info Overlay */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-black/60 backdrop-blur-sm rounded-lg p-4 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold mb-1">{featuredVideo.title}</h4>
                          <p className="text-sm text-gray-300">{featuredVideo.description}</p>
                        </div>
                        <div className="text-right text-sm">
                          <div className="flex items-center space-x-1 mb-1">
                            <Clock className="w-4 h-4" />
                            <span>{formatDuration(featuredVideo.duration)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(featuredVideo.date)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Category Filter */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? 'primary' : 'outline'}
                  size="sm"
                  leftIcon={<category.icon className="w-4 h-4" />}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </motion.div>

          {/* Video Grid */}
          <motion.div variants={itemVariants}>
            {loading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" text="Loading videos..." />
              </div>
            ) : filteredVideos.length === 0 ? (
              <div className="text-center py-12">
                <Play className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-secondary-700 mb-2">No videos found</h3>
                <p className="text-secondary-500">
                  {activeCategory === 'all'
                    ? 'No videos have been uploaded yet.'
                    : `No videos found in the ${activeCategory} category.`}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVideos.map((video) => (
                <motion.div
                  key={video.id}
                  variants={itemVariants}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card variant="elevated" className="overflow-hidden cursor-pointer group" hover>
                    <div className="relative aspect-video bg-secondary-200">
                      {/* Placeholder for video thumbnail */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center">
                        <Play className="w-12 h-12 text-white opacity-60" />
                      </div>
                      
                      {/* Play Button Overlay */}
                      <button
                        onClick={() => openVideoModal(video)}
                        className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors"
                      >
                        <div className="w-12 h-12 bg-white/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play className="w-6 h-6 text-primary-600 ml-0.5" />
                        </div>
                      </button>
                      
                      {/* Duration Badge */}
                      <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                        {formatDuration(video.duration)}
                      </div>
                      
                      {/* Featured Badge */}
                      {video.featured && (
                        <div className="absolute top-2 left-2 bg-accent-500 text-white text-xs px-2 py-1 rounded font-medium">
                          Featured
                        </div>
                      )}
                    </div>
                    
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-secondary-900 mb-2 group-hover:text-primary-600 transition-colors">
                        {video.title}
                      </h3>
                      <p className="text-sm text-secondary-600 mb-3 line-clamp-2">
                        {video.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-secondary-500">
                        <span className="capitalize">{video.category}</span>
                        <span>{formatDate(video.date)}</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Call to Action */}
          <motion.div variants={itemVariants} className="text-center mt-12">
            <Card variant="outlined" className="p-8">
              <h3 className="text-xl font-semibold text-secondary-900 mb-4">
                More Videos Available
              </h3>
              <p className="text-secondary-600 mb-6 max-w-md mx-auto">
                Additional game footage and training videos available upon request. 
                Contact for access to complete video library.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="primary"
                  leftIcon={<ExternalLink className="w-4 h-4" />}
                  onClick={() => window.open('mailto:lananolan08@gmail.com?subject=Video Request', '_blank')}
                >
                  Request More Videos
                </Button>
                
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={closeVideoModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeVideoModal}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              
              {/* Video Player Placeholder */}
              <div className="w-full h-full bg-secondary-900 flex items-center justify-center">
                <div className="text-center text-white">
                  <Play className="w-16 h-16 mx-auto mb-4 opacity-60" />
                  <h3 className="text-xl font-semibold mb-2">{selectedVideo.title}</h3>
                  <p className="text-secondary-300 mb-4">{selectedVideo.description}</p>
                  <Button
                    variant="primary"
                    leftIcon={<ExternalLink className="w-4 h-4" />}
                    onClick={() => window.open(selectedVideo.url, '_blank')}
                  >
                    Watch on Platform
                  </Button>
                </div>
              </div>
              
              {/* Video Info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <h3 className="text-white text-xl font-semibold mb-2">
                  {selectedVideo.title}
                </h3>
                <p className="text-gray-300 text-sm">
                  {selectedVideo.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default VideoGallery;