'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/helpers';
import Card, { CardHeader, CardContent } from '@/components/ui/Card';
import { User, MapPin, Calendar, Award, TrendingUp, Target, ExternalLink, Globe } from 'lucide-react';

interface PlayerProfileProps {
  className?: string;
}

interface PlayerData {
  personalInfo: {
    name: string;
    graduationYear: number;
    email: string;
    phone: string;
    height?: string;
    recruitingPacketUrl?: string;
  };
  athletics: {
    primaryPosition: string;
    secondaryPositions: string[];
    battingStance: string;
    throwingHand: string;
    hometown: string;
    highSchool: {
      name: string;
      coach: string;
      socialMedia?: {
        twitter?: string;
        facebook?: string;
        instagram?: string;
        website?: string;
      };
      socialMediaAllowed?: string[];
      teamProfileHubUrl?: string;
    };
    travelTeam: {
      name: string;
      coach: string;
      socialMedia?: {
        twitter?: string;
        facebook?: string;
        instagram?: string;
        website?: string;
      };
      socialMediaAllowed?: string[];
      teamProfileHubUrl?: string;
    };
  };
  measurables: Array<{
    metric: string;
    value: string;
    date: string;
    notes: string;
  }>;
  academic: {
    currentGPA: number;
    cumulativeGPA: number;
    satScore: number;
    actScore: number;
    classRank: string;
    honors: string[];
    intendedMajor: string;
  };
}

const PlayerProfile: React.FC<PlayerProfileProps> = ({ className }) => {
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  // Ensure SSR/CSR markup stability by gating client-only enhancements until mounted
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        const response = await fetch('/api/player');
        if (response.ok) {
          const data = await response.json();
          setPlayerData(data);
        }
      } catch (error) {
        console.error('Error fetching player data:', error);
      }
    };
 
    fetchPlayerData();
  }, []);

  // Set mounted flag after first client render so initial hydration matches SSR
  useEffect(() => {
    setMounted(true);
  }, []);

  // Default/fallback data
  const defaultPlayerInfo = {
    name: 'Lana Nolan',
    graduationYear: 2027,
    primaryPosition: 'Multi-Position',
    secondaryPositions: ['Outfield', 'Infield'],
    battingThrows: 'R/R',
    hometown: 'South Carolina',
    highSchool: {
      name: 'To be updated',
      coach: 'To be updated',
    },
    travelTeam: {
      name: 'To be updated',
      coach: 'To be updated',
    },
  };

  const defaultMeasurables = [
    { metric: 'Exit Velocity', value: 'TBD', unit: 'mph', improvement: null, date: '2024-01-01' },
    { metric: 'Throwing Velocity', value: 'TBD', unit: 'mph', improvement: null, date: '2024-01-01' },
    { metric: 'Pop Time', value: 'TBD', unit: 'sec', improvement: null, date: '2024-01-01' },
    { metric: 'Home to First', value: 'TBD', unit: 'sec', improvement: null, date: '2024-01-01' },
    { metric: '60-Yard Dash', value: 'TBD', unit: 'sec', improvement: null, date: '2024-01-01' },
    { metric: 'Vertical Jump', value: 'TBD', unit: 'in', improvement: null, date: '2024-01-01' },
  ];
 
  // Social key helpers for strict typing (avoid any)
  const SOCIAL_KEYS = ['facebook', 'twitter', 'instagram', 'website'] as const;
  type SocialKey = typeof SOCIAL_KEYS[number];
  const isSocialKey = (k: string): k is SocialKey =>
    (SOCIAL_KEYS as readonly string[]).includes(k);
  // Use fetched data or fallback to defaults
  const playerInfo = playerData ? {
    name: playerData.personalInfo?.name || defaultPlayerInfo.name,
    graduationYear: playerData.personalInfo?.graduationYear || defaultPlayerInfo.graduationYear,
    primaryPosition: playerData.athletics?.primaryPosition || defaultPlayerInfo.primaryPosition,
    secondaryPositions: playerData.athletics?.secondaryPositions || defaultPlayerInfo.secondaryPositions,
    battingThrows: `${playerData.athletics?.battingStance || 'R'}/${playerData.athletics?.throwingHand || 'R'}`,
    hometown: playerData.athletics?.hometown || defaultPlayerInfo.hometown,
    highSchool: {
      name: playerData.athletics?.highSchool?.name || defaultPlayerInfo.highSchool.name,
      coach: playerData.athletics?.highSchool?.coach || defaultPlayerInfo.highSchool.coach,
    },
    travelTeam: {
      name: playerData.athletics?.travelTeam?.name || defaultPlayerInfo.travelTeam.name,
      coach: playerData.athletics?.travelTeam?.coach || defaultPlayerInfo.travelTeam.coach,
    },
  } : defaultPlayerInfo;

  const measurables = (playerData?.measurables && playerData.measurables.length > 0)
    ? playerData.measurables.map(m => ({
        metric: m.metric,
        value: m.value || 'TBD',
        unit: m.metric.includes('Velocity') ? 'mph' :
              m.metric.includes('Time') || m.metric.includes('Dash') ? 'sec' :
              m.metric.includes('Jump') ? 'in' : '',
        improvement: null,
        date: m.date,
        notes: m.notes
      }))
    : defaultMeasurables;

  // const currentGPA = playerData?.academic?.currentGPA || 4.0;

  const scoutingReport = {
    strengths: [
      'Athleticism and first step quickness',
      'Excellent reads off the bat',
      'Strong contact skills and plate discipline',
      'Versatile defensive capabilities',
      'High baseball IQ and situational awareness',
    ],
    development: [
      'Continued strength gains in the weight room',
      'Situational hitting development',
      'Arm strength enhancement program',
      'Advanced defensive positioning',
    ],
    intangibles: [
      'Natural leadership qualities',
      'Excellent communication skills',
      'High energy and positive attitude',
      'Strong work ethic and accountability',
      'Coachable and team-first mentality',
    ],
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

  const formatDate = (dateString: string) => {
    try {
      const d = new Date(`${dateString}T00:00:00Z`);
      return new Intl.DateTimeFormat('en-US', { timeZone: 'UTC' }).format(d);
    } catch {
      return dateString;
    }
  };

  return (
    <section id="profile" className={cn('section-padding bg-secondary-50', className)}>
      <div className="container mx-auto">
        <motion.div
          initial={false}
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="heading-lg mb-4">Player Profile</h2>
            <p className="body-lg text-secondary-600 max-w-2xl mx-auto">
              Comprehensive athletic and academic information showcasing dedication to excellence both on and off the field.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Personal Information */}
            <motion.div variants={itemVariants}>
              <Card variant="elevated" className="h-full">
                <CardHeader
                  title="Personal Information"
                  subtitle="Basic player details and contact"
                  action={<User className="w-6 h-6 text-primary-600" />}
                />
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-secondary-500" />
                      <div>
                        <p className="font-medium">Class of {playerInfo.graduationYear}</p>
                        <p className="text-sm text-secondary-600">Graduation Year</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Target className="w-5 h-5 text-secondary-500" />
                      <div>
                        <p className="font-medium">{playerInfo.primaryPosition}</p>
                        <p className="text-sm text-secondary-600">Primary Position</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Award className="w-5 h-5 text-secondary-500" />
                      <div>
                        <p className="font-medium">{playerInfo.battingThrows}</p>
                        <p className="text-sm text-secondary-600">Bats/Throws</p>
                      </div>
                    </div>
                    
                    {playerData?.personalInfo?.height && (
                      <div className="flex items-center space-x-3">
                        <User className="w-5 h-5 text-secondary-500" />
                        <div>
                          <p className="font-medium">{playerData.personalInfo.height}</p>
                          <p className="text-sm text-secondary-600">Height</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-secondary-500" />
                      <div>
                        <p className="font-medium">{playerInfo.hometown}</p>
                        <p className="text-sm text-secondary-600">Hometown</p>
                      </div>
                    </div>
                  </div>

                  {playerData?.personalInfo?.recruitingPacketUrl && (
                    <div className="mt-6">
                      <a
                        href={playerData.personalInfo.recruitingPacketUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 rounded-md bg-primary-600 text-white hover:bg-primary-700 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Download Recruiting Packet (PDF)
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Team Information */}
            <motion.div variants={itemVariants}>
              <Card variant="elevated" className="h-full">
                <CardHeader
                  title="Team Information"
                  subtitle="Current team affiliations"
                  action={<Award className="w-6 h-6 text-primary-600" />}
                />
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-secondary-900 mb-2">High School</h4>
                      <p className="text-secondary-700">{playerInfo.highSchool.name}</p>
                      <p className="text-sm text-secondary-600">Coach: {playerInfo.highSchool.coach}</p>
                      <p className="text-xs text-secondary-600 mt-2">Social Links</p>
                      
                      {/* High School Social Media Links (stable SSR/CSR structure) */}
                      <div className="flex items-center space-x-3 mt-3">
                        {mounted && ['teamProfileHub','facebook','twitter','instagram','website'].map((key) => {
                          const hs = playerData?.athletics?.highSchool;
                          const sm = hs?.socialMedia;
                          const allowedList: SocialKey[] = (hs?.socialMediaAllowed || []).filter((k): k is SocialKey => isSocialKey(k));
                          const allowed = !hs?.socialMediaAllowed || key === 'teamProfileHub' || (isSocialKey(key) && allowedList.includes(key));
                          const url =
                            key === 'teamProfileHub' ? hs?.teamProfileHubUrl :
                            key === 'facebook' ? sm?.facebook :
                            key === 'twitter' ? sm?.twitter :
                            key === 'instagram' ? sm?.instagram :
                            sm?.website;
                          const enabled = !!(mounted && allowed && url);
                          const common = 'flex items-center space-x-1 text-xs transition-colors';
                          const color =
                            key === 'facebook' ? 'text-blue-600 hover:text-blue-700' :
                            key === 'twitter' ? 'text-sky-600 hover:text-sky-700' :
                            key === 'instagram' ? 'text-pink-600 hover:text-pink-700' :
                            key === 'website' ? 'text-secondary-700 hover:text-secondary-900' :
                            'text-primary-600 hover:text-primary-700';
                          const label =
                            key === 'teamProfileHub' ? 'TeamProfileHub' : key.charAt(0).toUpperCase() + key.slice(1);
                          const iconSpan =
                            key === 'facebook' ? '📘' :
                            key === 'twitter' ? '🐦' :
                            key === 'instagram' ? '📸' :
                            key === 'website' ? '🌐' : null;

                          return (
                            <a
                              key={key}
                              href={enabled ? (url as string) : '#'}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`${common} ${color} ${enabled ? '' : 'pointer-events-none opacity-40'}`}
                              aria-disabled={!enabled}
                            >
                              {key === 'teamProfileHub' ? <Globe className="w-3 h-3" /> : <span>{iconSpan}</span>}
                              <span>{label}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          );
                        })}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-secondary-900 mb-2">Travel Team</h4>
                      <p className="text-secondary-700">{playerInfo.travelTeam.name}</p>
                      <p className="text-sm text-secondary-600">Coach: {playerInfo.travelTeam.coach}</p>
                      <p className="text-xs text-secondary-600 mt-2">Social Links</p>
                      
                      {/* Travel Team Social Media Links (stable SSR/CSR structure) */}
                      <div className="flex items-center space-x-3 mt-3">
                        {mounted && ['teamProfileHub','facebook','twitter','instagram','website'].map((key) => {
                          const tt = playerData?.athletics?.travelTeam;
                          const sm = tt?.socialMedia;
                          const allowedList: SocialKey[] = (tt?.socialMediaAllowed || []).filter((k): k is SocialKey => isSocialKey(k));
                          const allowed = !tt?.socialMediaAllowed || key === 'teamProfileHub' || (isSocialKey(key) && allowedList.includes(key));
                          const url =
                            key === 'teamProfileHub' ? tt?.teamProfileHubUrl :
                            key === 'facebook' ? sm?.facebook :
                            key === 'twitter' ? sm?.twitter :
                            key === 'instagram' ? sm?.instagram :
                            sm?.website;
                          const enabled = !!(mounted && allowed && url);
                          const common = 'flex items-center space-x-1 text-xs transition-colors';
                          const color =
                            key === 'facebook' ? 'text-blue-600 hover:text-blue-700' :
                            key === 'twitter' ? 'text-sky-600 hover:text-sky-700' :
                            key === 'instagram' ? 'text-pink-600 hover:text-pink-700' :
                            key === 'website' ? 'text-secondary-700 hover:text-secondary-900' :
                            'text-primary-600 hover:text-primary-700';
                          const label =
                            key === 'teamProfileHub' ? 'TeamProfileHub' : key.charAt(0).toUpperCase() + key.slice(1);
                          const iconSpan =
                            key === 'facebook' ? '📘' :
                            key === 'twitter' ? '🐦' :
                            key === 'instagram' ? '📸' :
                            key === 'website' ? '🌐' : null;

                          return (
                            <a
                              key={key}
                              href={enabled ? (url as string) : '#'}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`${common} ${color} ${enabled ? '' : 'pointer-events-none opacity-40'}`}
                              aria-disabled={!enabled}
                            >
                              {key === 'teamProfileHub' ? <Globe className="w-3 h-3" /> : <span>{iconSpan}</span>}
                              <span>{label}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          );
                        })}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-secondary-900 mb-2">Secondary Positions</h4>
                      <div className="flex flex-wrap gap-2">
                        {playerInfo.secondaryPositions.map((position) => (
                          <span
                            key={position}
                            className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                          >
                            {position}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Stats */}
            <motion.div variants={itemVariants}>
              <Card variant="elevated" className="h-full">
                <CardHeader
                  title="Quick Stats"
                  subtitle="Key performance indicators"
                  action={<TrendingUp className="w-6 h-6 text-primary-600" />}
                />
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-primary-50 rounded-lg">
                      <div className="text-2xl font-bold text-primary-600">4.0</div>
                      <div className="text-sm text-secondary-600">Target GPA</div>
                    </div>
                    
                    <div className="text-center p-4 bg-accent-50 rounded-lg">
                      <div className="text-2xl font-bold text-accent-600">5+</div>
                      <div className="text-sm text-secondary-600">Years Experience</div>
                    </div>
                    
                    <div className="text-center p-4 bg-success-50 rounded-lg">
                      <div className="text-2xl font-bold text-success-600">100%</div>
                      <div className="text-sm text-secondary-600">Commitment</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Measurables Table */}
          <motion.div variants={itemVariants} className="mt-12">
            <Card variant="elevated">
              <CardHeader
                title="Performance Measurables"
                subtitle="Latest testing results and improvements"
              />
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-secondary-200">
                        <th className="text-left py-3 px-4 font-semibold text-secondary-900">Metric</th>
                        <th className="text-center py-3 px-4 font-semibold text-secondary-900">Latest</th>
                        <th className="text-center py-3 px-4 font-semibold text-secondary-900">Date</th>
                        <th className="text-center py-3 px-4 font-semibold text-secondary-900">Trend</th>
                        <th className="text-left py-3 px-4 font-semibold text-secondary-900">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {measurables.map((item) => (
                        <tr key={item.metric} className="border-b border-secondary-100 hover:bg-secondary-50">
                          <td className="py-3 px-4 font-medium text-secondary-900">{item.metric}</td>
                          <td className="py-3 px-4 text-center">
                            <span className="font-semibold text-primary-600">
                              {item.value} {item.unit}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center text-sm text-secondary-600">
                            {formatDate(item.date)}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {item.improvement ? (
                              <span className="text-success-600 font-medium">+{item.improvement}</span>
                            ) : (
                              <span className="text-secondary-400">-</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-sm text-secondary-600">
                            To be updated with latest measurements
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 p-4 bg-secondary-50 rounded-lg">
                  <p className="text-sm text-secondary-600">
                    <strong>Note:</strong> All measurements taken under consistent testing conditions. 
                    Regular updates provided as new testing data becomes available.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Scouting Report */}
          <motion.div variants={itemVariants} className="mt-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Strengths */}
              <Card variant="elevated">
                <CardHeader
                  title="Strengths"
                  subtitle="Current skill highlights"
                />
                <CardContent>
                  <ul className="space-y-3">
                    {scoutingReport.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-success-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-secondary-700">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Development Areas */}
              <Card variant="elevated">
                <CardHeader
                  title="Development Focus"
                  subtitle="Areas of continued improvement"
                />
                <CardContent>
                  <ul className="space-y-3">
                    {scoutingReport.development.map((area, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-accent-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-secondary-700">{area}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Intangibles */}
              <Card variant="elevated">
                <CardHeader
                  title="Intangibles"
                  subtitle="Character and leadership qualities"
                />
                <CardContent>
                  <ul className="space-y-3">
                    {scoutingReport.intangibles.map((quality, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-secondary-700">{quality}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default PlayerProfile;