'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/helpers';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react';
import Button from './Button';

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  endDate?: Date;
  location: string;
  type: 'tournament' | 'showcase' | 'camp' | 'visit' | 'game';
  description?: string;
  isAvailable: boolean;
}

interface CalendarProps {
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  className?: string;
}

const Calendar: React.FC<CalendarProps> = ({ events, onEventClick, className }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(event.date, date));
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-12 sm:h-16 p-1"></div>
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayEvents = getEventsForDate(date);
      const isToday = isSameDay(date, new Date());
      const isSelected = selectedDate && isSameDay(date, selectedDate);
      const hasEvents = dayEvents.length > 0;

      days.push(
        <motion.div
          key={day}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            'h-12 sm:h-16 p-1 cursor-pointer border border-gray-100 relative',
            'hover:bg-green-50 transition-colors duration-200',
            isToday && 'bg-green-100 border-green-300',
            isSelected && 'bg-green-200 border-green-400',
            hasEvents && 'bg-blue-50'
          )}
          onClick={() => setSelectedDate(date)}
        >
          <div className="flex flex-col h-full">
            <span className={cn(
              'text-sm font-medium',
              isToday ? 'text-green-800' : 'text-gray-700'
            )}>
              {day}
            </span>
            {hasEvents && (
              <div className="flex-1 flex flex-col justify-end">
                {dayEvents.slice(0, 2).map((event) => (
                  <div
                    key={event.id}
                    className={cn(
                      'text-xs px-1 py-0.5 rounded mb-0.5 truncate',
                      event.type === 'tournament' && 'bg-blue-100 text-blue-800',
                      event.type === 'showcase' && 'bg-green-100 text-green-800',
                      event.type === 'camp' && 'bg-purple-100 text-purple-800',
                      event.type === 'visit' && 'bg-orange-100 text-orange-800',
                      event.type === 'game' && 'bg-red-100 text-red-800'
                    )}
                  >
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <div className="text-xs text-gray-500">
                    +{dayEvents.length - 2} more
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      );
    }

    return days;
  };

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <div className={cn('bg-white rounded-lg shadow-sm border', className)}>
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={goToToday}
            className="text-xs"
          >
            Today
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('prev')}
            className="p-2"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('next')}
            className="p-2"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex">
        {/* Calendar Grid */}
        <div className="flex-1 p-4">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map(day => (
              <div key={day} className="h-8 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">{day}</span>
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {renderCalendarDays()}
          </div>

          {/* Legend */}
          <div className="mt-4 pt-4 border-t">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Event Types</h4>
            <div className="flex flex-wrap gap-2 text-xs">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded"></div>
                <span>Tournament</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
                <span>Showcase</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-purple-100 border border-purple-300 rounded"></div>
                <span>Camp</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-orange-100 border border-orange-300 rounded"></div>
                <span>Visit</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-red-100 border border-red-300 rounded"></div>
                <span>Game</span>
              </div>
            </div>
          </div>
        </div>

        {/* Event Details Sidebar */}
        {selectedDate && (
          <div className="w-80 border-l bg-gray-50 p-4">
            <h4 className="font-semibold text-gray-900 mb-3">
              {selectedDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </h4>

            {selectedDateEvents.length > 0 ? (
              <div className="space-y-3">
                {selectedDateEvents.map(event => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      'p-3 rounded-lg border cursor-pointer',
                      'hover:shadow-sm transition-shadow duration-200',
                      event.type === 'tournament' && 'bg-blue-50 border-blue-200',
                      event.type === 'showcase' && 'bg-green-50 border-green-200',
                      event.type === 'camp' && 'bg-purple-50 border-purple-200',
                      event.type === 'visit' && 'bg-orange-50 border-orange-200',
                      event.type === 'game' && 'bg-red-50 border-red-200'
                    )}
                    onClick={() => onEventClick?.(event)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-medium text-gray-900 text-sm">{event.title}</h5>
                      {event.isAvailable && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                          Available
                        </span>
                      )}
                    </div>

                    <div className="space-y-1 text-xs text-gray-600">
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>
                          {event.date.toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                          })}
                          {event.endDate && ` - ${event.endDate.toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                          })}`}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        <span>{event.location}</span>
                      </div>
                    </div>

                    {event.description && (
                      <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                        {event.description}
                      </p>
                    )}

                    <div className="mt-2">
                      <span className={cn(
                        'px-2 py-1 rounded-full text-xs font-medium capitalize',
                        event.type === 'tournament' && 'bg-blue-100 text-blue-800',
                        event.type === 'showcase' && 'bg-green-100 text-green-800',
                        event.type === 'camp' && 'bg-purple-100 text-purple-800',
                        event.type === 'visit' && 'bg-orange-100 text-orange-800',
                        event.type === 'game' && 'bg-red-100 text-red-800'
                      )}>
                        {event.type}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No events scheduled for this date</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;