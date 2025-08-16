'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '@/utils/helpers';
import { SITE_CONFIG } from '@/utils/constants';
import Button from '@/components/ui/Button';
import { Play, Download, Mail, MapPin, Calendar, Award } from 'lucide-react';

interface PhotosConfig {
  photos: Array<{
    id: string;
    filename: string;
    originalName: string;
    url: string;
    alt: string;
    category: string;
    uploadDate: string;
    isActive: boolean;
  }>;
  activePhotos: {
    heroImage: string;
    profileImage: string;
    featuredAction: string;
  };
}

interface PlayerData {
  personalInfo?: {
    firstName?: string;
    lastName?: string;
    name: string;
    graduationYear: number;
  };
  athletics?: {
    primaryPosition: string;
    hometown: string;
    highSchool?: {
      coach?: string;
      coachEmail?: string;
      coachPhone?: string;
    };
    travelTeam?: {
      coach?: string;
      coachEmail?: string;
      coachPhone?: string;
    };
  };
  academic?: {
    currentGPA?: number;
  };
  academics?: {
    currentGPA?: number;
  };
  latestAchievement?: {
    title: string;
    date: string;
  };
}

interface HeroProps {
  className?: string;
}

const Hero: React.FC<HeroProps> = ({ className }) => {
  const [photosConfig, setPhotosConfig] = useState<PhotosConfig | null>(null);
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  const [loading, setLoading] = useState(true);

  // Dynamic quick stats based on player data
  const quickStats = [
    {
      label: 'Class',
      value: playerData?.personalInfo?.graduationYear?.toString() || '2027',
      icon: Calendar
    },
    {
      label: 'Position',
      value: playerData?.athletics?.primaryPosition || 'Multi-Position',
      icon: Award
    },
    {
      label: 'Location',
      value: playerData?.athletics?.hometown || 'South Carolina',
      icon: MapPin
    },
    {
      label: 'GPA',
      value: (playerData?.academics?.currentGPA || playerData?.academic?.currentGPA)?.toString() || 'TBD',
      icon: Award
    },
  ];

  // Load photos configuration and player data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [photosResponse, playerResponse] = await Promise.all([
          fetch('/api/photos'),
          fetch('/api/player')
        ]);
        
        if (photosResponse.ok) {
          const photosData = await photosResponse.json();
          setPhotosConfig(photosData);
        }
        
        if (playerResponse.ok) {
          const playerData = await playerResponse.json();
          setPlayerData(playerData);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleScrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Get the active featured action photo
  const getFeaturedActionPhoto = () => {
    if (!photosConfig) return null;
    const activePhotoId = photosConfig.activePhotos.featuredAction;
    return photosConfig.photos.find(photo => photo.id === activePhotoId);
  };

  const featuredPhoto = getFeaturedActionPhoto();
  
  // Prefer saved player name; fallback to first/last; then SITE_CONFIG
  const displayName =
    (playerData?.personalInfo?.name &&
      playerData.personalInfo.name.trim()) ||
    [playerData?.personalInfo?.firstName, playerData?.personalInfo?.lastName]
      .filter(Boolean)
      .join(' ')
      .trim() ||
    SITE_CONFIG.name;

  return (
    <section id="home" className={cn('relative min-h-screen flex items-center', className)}>
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div className="relative w-full h-full">
          {/* Placeholder for hero image - replace with actual photo */}
          <div className="w-full h-full bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-800" />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40" />
          
          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-white"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6 border border-white/20"
            >
              <Award className="w-4 h-4 mr-2" />
              Class of 2027 Softball Recruit
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="heading-xl mb-6"
            >
              <span className="block">{displayName}</span>
              <span className="block text-gradient bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                Softball Recruit
              </span>
            </motion.h1>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="body-lg text-gray-200 mb-8 max-w-lg"
            >
              Dedicated to excellence on and off the field. Actively seeking collegiate 
              opportunities across South Carolina and the Southeast.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <Button
                variant="primary"
                size="lg"
                leftIcon={<Play className="w-5 h-5" />}
                onClick={() => handleScrollToSection('videos')}
                className="bg-primary-600 hover:bg-primary-700"
              >
                Watch Highlights
              </Button>
              <Button
                variant="outline"
                size="lg"
                leftIcon={<Mail className="w-5 h-5" />}
                onClick={() => {
                  // Use travel team coach email first, then high school coach, then player email as fallback
                  const coachEmail = playerData?.athletics?.travelTeam?.coachEmail ||
                                   playerData?.athletics?.highSchool?.coachEmail ||
                                   SITE_CONFIG.links.email;
                  window.open(`mailto:${coachEmail}`, '_blank');
                }}
                className="border-white text-white hover:bg-white hover:text-secondary-900"
              >
                Contact Coach
              </Button>
              <Button
                variant="ghost"
                size="lg"
                leftIcon={<Download className="w-5 h-5" />}
                onClick={() => handleScrollToSection('contact')}
                className="text-white hover:bg-white/10"
              >
                Download Packet
              </Button>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4"
            >
              {quickStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                  className="glass-effect rounded-lg p-4 text-center"
                >
                  <stat.icon className="w-6 h-6 mx-auto mb-2 text-accent-400" />
                  <div className="text-lg font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-gray-300">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Image/Visual Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            {/* Professional Action Photo */}
            <div className="relative">
              <div className="relative aspect-[4/5] bg-gradient-to-br from-primary-500 to-secondary-600 rounded-2xl shadow-2xl overflow-hidden">
                {featuredPhoto ? (
                  <Image
                    src={featuredPhoto.url}
                    alt={featuredPhoto.alt}
                    fill
                    className="object-cover rounded-2xl"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                ) : (
                  <div className="w-full h-full rounded-2xl bg-black/20 flex items-center justify-center">
                    <div className="text-center text-white/80">
                      <Award className="w-16 h-16 mx-auto mb-4" />
                      <p className="text-lg font-medium">Professional Action Photo</p>
                      <p className="text-sm">
                        {loading ? 'Loading...' : 'Upload via Admin Dashboard'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Floating Achievement Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="absolute -top-4 -right-4 bg-accent-500 text-white rounded-full p-4 shadow-lg"
              >
                <Award className="w-8 h-8" />
              </motion.div>
              
              {/* Floating Stats Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.4 }}
                className="absolute -bottom-6 -left-6 glass-effect rounded-lg p-4 text-white"
              >
                <div className="text-sm text-gray-300 mb-1">Latest Achievement</div>
                <div className="font-semibold">
                  {playerData?.latestAchievement?.title || 'Tournament MVP'}
                </div>
                <div className="text-xs text-accent-400">
                  {playerData?.latestAchievement?.date || 'Spring 2024'}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.6 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white"
      >
        <div className="flex flex-col items-center space-y-2">
          <span className="text-sm text-gray-300">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-1 h-3 bg-white/60 rounded-full mt-2"
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;