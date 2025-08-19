'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Play, Download, Mail, Calendar, Award, MapPin } from 'lucide-react';
import Button from '../ui/Button';
import { SITE_CONFIG } from '../../utils/constants';

interface HeroProps {
  className?: string;
}

const Hero: React.FC<HeroProps> = ({ className }) => {
  const [photosConfig, setPhotosConfig] = useState<any>(null);
  const [playerData, setPlayerData] = useState<any>(null);

  // Quick stats configuration – fallback values used if data is absent.
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
    }
  ];

  // Load photos configuration and player data on mount
  useEffect(() => {
    const loadData = async () => {
      const [photosResponse, playerResponse] = await Promise.all([
        fetch('/api/photos'),
        fetch('/api/player')
      ]);
      if (photosResponse.ok) {
        setPhotosConfig(await photosResponse.json());
      }
      if (playerResponse.ok) {
        setPlayerData(await playerResponse.json());
      }
    };
    loadData();
  }, []);

  // Compute the display name from user data (fallback to SITE_CONFIG)
  const displayName =
    playerData?.personalInfo?.name?.trim() ||
    [playerData?.personalInfo?.firstName, playerData?.personalInfo?.lastName].filter(Boolean).join(' ').trim() ||
    SITE_CONFIG.name;

  // Derive the coach email: use travel team coach first, then high school coach, then default.
  const coachEmail =
    playerData?.athletics?.travelTeam?.coachEmail ||
    playerData?.athletics?.highSchool?.coachEmail ||
    SITE_CONFIG.links.email;

  // Choose the appropriate photo for the hero background:
  // 1. Prefer the heroImage set via the admin panel.
  // 2. If none is set, fall back to featuredAction.
  const heroPhotoId =
    photosConfig?.activePhotos?.heroImage ||
    photosConfig?.activePhotos?.featuredAction;

  const heroPhoto = photosConfig?.photos?.find(
    (photo: any) => photo.id === heroPhotoId
  );

  return (
    <section
      id="home"
      className={`relative flex flex-col lg:flex-row w-full min-h-screen overflow-hidden ${className || ''}`}
    >
      {/* Left panel with text and CTAs */}
      <div className="relative z-10 flex flex-col justify-center gap-8 flex-1 p-8 sm:p-12 text-white bg-gradient-to-br from-secondary-900 via-secondary-800 to-primary-900">
        {/* Badge */}
        <span className="inline-flex items-center self-start rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs tracking-wider uppercase">
          Class of {quickStats[0].value} Softball Recruit
        </span>

        {/* Main heading */}
        <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight">
          {displayName}
          <br />
          <span className="text-primary-300">Softball Recruit</span>
        </h1>

        {/* Tagline */}
        <p className="max-w-md text-lg leading-relaxed">
          Dedicated to excellence on and off the field. Actively seeking collegiate opportunities across South
          Carolina and the Southeast.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={() => document.getElementById('videos')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 shadow-md"
          >
            <Play className="w-5 h-5" />
            Watch Highlights
          </Button>

          <Button
            onClick={() => window.open(`mailto:${coachEmail}`, '_blank')}
            className="border-2 border-white px-6 py-3 rounded-lg flex items-center gap-2 text-white hover:bg-white hover:text-secondary-900 transition-colors"
          >
            <Mail className="w-5 h-5" />
            Contact Coach
          </Button>

          <Button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-white/10"
          >
            <Download className="w-5 h-5" />
            Download Packet
          </Button>
        </div>

        {/* Quick stats cards */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl">
          {quickStats.map((stat, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center justify-center gap-1 rounded-lg p-4 bg-white/10 backdrop-blur-md"
            >
              <stat.icon className="w-7 h-7 mb-1 text-primary-300" />
              <span className="text-2xl font-semibold">{stat.value}</span>
              <span className="text-xs uppercase tracking-wide">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel with the featured photo */}
      <div className="relative flex-1 hidden lg:block">
        {heroPhoto ? (
          <Image
            src={heroPhoto.url}
            alt={heroPhoto.alt}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 50vw, 100vw"
            priority
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-gray-200 text-secondary-700 text-lg font-semibold">
            Professional Action Photo
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;