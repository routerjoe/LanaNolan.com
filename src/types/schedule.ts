export interface ScheduleEvent {
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
  registrationDeadline?: Date;
  website?: string;
}

export interface EventCategory {
  id: string;
  name: string;
  color: string;
  description: string;
}

export interface CalendarView {
  type: 'month' | 'week' | 'day' | 'list';
  currentDate: Date;
}