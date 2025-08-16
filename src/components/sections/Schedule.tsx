'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/helpers';
import Card, { CardContent } from '../ui/Card';
import Button from '../ui/Button';
import CalendarComponent from '../ui/Calendar';
import { Calendar, MapPin, Clock, Users, ExternalLink } from 'lucide-react';

interface ScheduleProps {
  className?: string;
}

interface ScheduleEvent {
  id: string;
  title: string;
  date: Date;
  endDate?: Date;
  location: string;
  type: 'tournament' | 'showcase' | 'camp' | 'visit' | 'game';
  description?: string;
  contactInfo?: string;
  isAvailable: boolean;
  venue?: string;
  cost?: string;
  website?: string;
}

// API DTO type for transforming /api/schedule response to ScheduleEvent
interface ApiScheduleEvent {
  id: string;
  title: string;
  date: string;
  endDate?: string;
  location: string;
  type?: string;
  description?: string;
  coachAttendance?: boolean;
  status?: string;
  venue?: string;
  cost?: string;
  website?: string;
}

// Sample events data - fallback if API fails (hoisted to module scope for stable deps)
const sampleEvents: ScheduleEvent[] = [
  {
    id: '1',
    title: 'Spring Showcase Tournament',
    date: new Date('2025-03-15'),
    endDate: new Date('2025-03-17'),
    location: 'Myrtle Beach, SC',
    type: 'tournament',
    description: 'Multi-day tournament with college coaches in attendance',
    contactInfo: 'Coach Smith - (555) 123-4567',
    isAvailable: true,
    venue: 'Grand Park Sports Complex',
    website: 'https://example.com/tournament',
  },
  {
    id: '2',
    title: 'Elite Skills Showcase',
    date: new Date('2025-04-05'),
    location: 'Columbia, SC',
    type: 'showcase',
    description: 'Individual skills showcase for college recruiters',
    contactInfo: 'recruiting@eliteskills.com',
    isAvailable: true,
    venue: 'USC Softball Complex',
    cost: '$150',
  },
  {
    id: '3',
    title: 'Summer Training Camp',
    date: new Date('2025-06-10'),
    endDate: new Date('2025-06-14'),
    location: 'Clemson, SC',
    type: 'camp',
    description: '5-day intensive training camp with college coaching staff',
    contactInfo: 'camps@clemson.edu',
    isAvailable: true,
    venue: 'Clemson Softball Stadium',
    cost: '$400',
  },
  {
    id: '4',
    title: 'Campus Visit - University of South Carolina',
    date: new Date('2025-04-20'),
    location: 'Columbia, SC',
    type: 'visit',
    description: 'Official campus visit and meeting with coaching staff',
    contactInfo: 'Coach Johnson - (803) 777-1234',
    isAvailable: false,
    venue: 'USC Campus',
  },
  {
    id: '5',
    title: 'High School Season Game',
    date: new Date('2025-03-25'),
    location: 'Local High School',
    type: 'game',
    description: 'Regular season game - coaches welcome to attend',
    isAvailable: true,
    venue: 'Home Field',
  },
];

const Schedule: React.FC<ScheduleProps> = ({ className }) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [scheduleData, setScheduleData] = useState<ScheduleEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Determine default view mode based on screen size
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768 ? 'list' : 'calendar';
    }
    return 'calendar'; // Default to calendar for SSR
  });

  // Load schedule data from API with refresh capability
  const loadScheduleData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/schedule', {
        cache: 'no-store', // Ensure fresh data
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      if (response.ok) {
        const data = await response.json();
        // Convert the API data to the expected format
        const convertedEvents = data.events?.map((event: ApiScheduleEvent) => ({
          id: event.id,
          title: event.title,
          date: new Date(event.date),
          endDate: event.endDate ? new Date(event.endDate) : undefined,
          location: event.location,
          // Normalize to lowercase union type for filtering/labels
          type: (event.type || '').toString().toLowerCase() as ScheduleEvent['type'],
          description: event.description,
          contactInfo: `Coach attendance: ${event.coachAttendance ? 'Expected' : 'Not confirmed'}`,
          isAvailable: event.status === 'Upcoming',
          venue: event.location,
        })) || [];
        setScheduleData(convertedEvents);
      }
    } catch (error) {
      console.error('Error loading schedule data:', error);
      // Fallback to sample data
      setScheduleData(sampleEvents);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadScheduleData();
  }, [loadScheduleData]);

  // Set up polling with environment-aware interval
  useEffect(() => {
    // Default: 30s in development, 5m (300000ms) in production unless overridden
    const defaultProdMs = 300000;
    const defaultDevMs = 30000;
    const envMs = typeof window !== 'undefined'
      ? Number.parseInt(process.env.NEXT_PUBLIC_SCHEDULE_POLL_INTERVAL_MS || '')
      : NaN;
    const pollMs = Number.isFinite(envMs) && envMs > 0
      ? envMs
      : (process.env.NODE_ENV === 'production' ? defaultProdMs : defaultDevMs);

    const interval = setInterval(() => {
      loadScheduleData();
    }, pollMs);

    return () => clearInterval(interval);
  }, [loadScheduleData]);

  // Handle window resize for responsive view mode
  useEffect(() => {
    const handleResize = () => {
      setViewMode(prev => (window.innerWidth < 768 && prev === 'calendar' ? 'list' : prev));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  // Use scheduleData instead of events
  const events = scheduleData.length > 0 ? scheduleData : sampleEvents;

  const eventTypes = [
    { id: 'all', name: 'All Events', color: 'bg-secondary-500' },
    { id: 'tournament', name: 'Tournaments', color: 'bg-primary-500' },
    { id: 'showcase', name: 'Showcases', color: 'bg-success-500' },
    { id: 'camp', name: 'Camps', color: 'bg-accent-500' },
    { id: 'visit', name: 'Campus Visits', color: 'bg-purple-500' },
    { id: 'game', name: 'Games', color: 'bg-red-500' },
  ];

  const filteredEvents = activeFilter === 'all'
    ? events
    : events.filter((event: ScheduleEvent) => event.type === activeFilter);

  const upcomingEvents = filteredEvents
    .filter((event: ScheduleEvent) => event.date >= new Date())
    .sort((a: ScheduleEvent, b: ScheduleEvent) => a.date.getTime() - b.date.getTime())
    .slice(0, 6);

  // Convert events for the calendar component
  const calendarEvents = events.map((event: ScheduleEvent) => ({
    id: event.id,
    title: event.title,
    date: event.date,
    endDate: event.endDate,
    location: event.location,
    type: event.type,
    description: event.description,
    isAvailable: event.isAvailable,
  }));

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };


  const getEventTypeColor = (type: string): string => {
    const eventType = eventTypes.find(t => t.id === type);
    return eventType?.color || 'bg-secondary-500';
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
    <section id="schedule" className={cn('section-padding bg-secondary-50', className)}>
      <div className="container mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="heading-lg mb-4">Schedule & Events</h2>
            <p className="body-lg text-secondary-600 max-w-2xl mx-auto">
              Upcoming tournaments, showcases, and events where college coaches can see Lana in action. 
              All events are open for coach attendance.
            </p>
          </motion.div>

          {/* View Toggle and Event Type Filter */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
              {/* View Toggle and Refresh */}
              <div className="flex items-center gap-2">
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <Button
                    variant={viewMode === 'list' ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-md"
                  >
                    📋 List View
                  </Button>
                  <Button
                    variant={viewMode === 'calendar' ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('calendar')}
                    className="rounded-md"
                  >
                    📅 Calendar View
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadScheduleData}
                  disabled={isLoading}
                  className="rounded-md"
                >
                  {isLoading ? '🔄' : '↻'} Refresh
                </Button>
              </div>

              {/* Event Type Filter */}
              <div className="flex flex-wrap justify-center gap-2">
                {eventTypes.map((type) => (
                  <Button
                    key={type.id}
                    variant={activeFilter === type.id ? 'primary' : 'outline'}
                    size="sm"
                    leftIcon={<div className={cn('w-3 h-3 rounded-full', type.color)} />}
                    onClick={() => setActiveFilter(type.id)}
                  >
                    {type.name}
                  </Button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Calendar or List View */}
          <motion.div variants={itemVariants} className="mb-12">
            {viewMode === 'calendar' ? (
              <div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-6">Schedule Calendar</h3>
                <CalendarComponent
                  events={calendarEvents.filter((event) =>
                    activeFilter === 'all' || event.type === activeFilter
                  )}
                  onEventClick={(event) => {
                    // Handle event click - could open a modal or navigate
                    console.log('Event clicked:', event);
                  }}
                  className="mb-8"
                />
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-6">Upcoming Events</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingEvents.map((event: ScheduleEvent) => (
                <motion.div
                  key={event.id}
                  variants={itemVariants}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card variant="elevated" className="h-full" hover>
                    <CardContent className="p-6">
                      {/* Event Type Badge */}
                      <div className="flex items-center justify-between mb-4">
                        <span className={cn(
                          'px-3 py-1 rounded-full text-white text-xs font-medium capitalize',
                          getEventTypeColor(event.type)
                        )}>
                          {event.type}
                        </span>
                        {event.isAvailable && (
                          <span className="px-2 py-1 bg-success-100 text-success-700 text-xs font-medium rounded">
                            Available
                          </span>
                        )}
                      </div>

                      {/* Event Title */}
                      <h4 className="font-semibold text-secondary-900 mb-2 line-clamp-2">
                        {event.title}
                      </h4>

                      {/* Event Details */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-secondary-600">
                          <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span>
                            {formatDate(event.date)}
                            {event.endDate && ` - ${formatDate(event.endDate)}`}
                          </span>
                        </div>
                        
                        <div className="flex items-center text-sm text-secondary-600">
                          <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span>{event.location}</span>
                        </div>
                        
                        {event.venue && (
                          <div className="flex items-center text-sm text-secondary-600">
                            <Users className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span>{event.venue}</span>
                          </div>
                        )}
                        
                        {event.cost && (
                          <div className="flex items-center text-sm text-secondary-600">
                            <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span>Cost: {event.cost}</span>
                          </div>
                        )}
                      </div>

                      {/* Event Description */}
                      {event.description && (
                        <p className="text-sm text-secondary-600 mb-4 line-clamp-2">
                          {event.description}
                        </p>
                      )}

                      {/* Contact Info */}
                      {event.contactInfo && (
                        <div className="pt-4 border-t border-secondary-200">
                          <p className="text-xs text-secondary-500 mb-2">Contact:</p>
                          <p className="text-sm text-secondary-700">{event.contactInfo}</p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2 mt-4">
                        {event.website && (
                          <Button
                            variant="outline"
                            size="sm"
                            leftIcon={<ExternalLink className="w-3 h-3" />}
                            onClick={() => window.open(event.website, '_blank')}
                          >
                            Details
                          </Button>
                        )}
                        <Button
                          variant="primary"
                          size="sm"
                          leftIcon={<Calendar className="w-3 h-3" />}
                          onClick={() => {
                            // Add to calendar functionality
                            const startDate = event.date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
                            const endDate = event.endDate 
                              ? event.endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
                              : startDate;
                            const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(event.description || '')}&location=${encodeURIComponent(event.location)}`;
                            window.open(calendarUrl, '_blank');
                          }}
                        >
                          Add to Calendar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Availability Notice */}
          <motion.div variants={itemVariants}>
            <Card variant="outlined" className="p-8 text-center">
              <h3 className="text-xl font-semibold text-secondary-900 mb-4">
                Coach Attendance Welcome
              </h3>
              <p className="text-secondary-600 mb-6 max-w-2xl mx-auto">
                College coaches are welcome at all events marked as &quot;Available&quot;.
                Please contact in advance to confirm attendance and receive specific details about game times and locations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="primary"
                  leftIcon={<Calendar className="w-4 h-4" />}
                  onClick={() => window.open('mailto:lananolan08@gmail.com?subject=Schedule Inquiry', '_blank')}
                >
                  Request Schedule Details
                </Button>
                <Button
                  variant="outline"
                  leftIcon={<Calendar className="w-4 h-4" />}
                  onClick={() => setViewMode('calendar')}
                >
                  View Calendar
                </Button>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Schedule;