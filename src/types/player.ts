export interface SocialLinks {
  twitter?: string;
  instagram?: string;
  email: string;
}

export interface TeamSocialMedia {
  twitter?: string;
  instagram?: string;
  facebook?: string;
  website?: string;
}

export interface PersonalInfo {
  name: string;
  graduationYear: number;
  email: string;
  phone?: string;
  socialMedia: SocialLinks;
}

export interface Athletics {
  primaryPosition: string;
  secondaryPositions: string[];
  battingThrows: 'R' | 'L' | 'S';
  height?: string;
  weight?: string;
  hometown: string;
  highSchool: {
    name: string;
    coach: string;
    contact: string;
    socialMedia: TeamSocialMedia;
  };
  travelTeam: {
    name: string;
    coach: string;
    contact: string;
    socialMedia: TeamSocialMedia;
  };
}

export interface Academics {
  gpa?: number;
  classRank?: string;
  satScore?: number;
  actScore?: number;
  honors: string[];
  awards: string[];
}

export interface Measurable {
  metric: string;
  value: string;
  date: string;
  improvement?: string;
  notes?: string;
}

export interface VideoClip {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  category: 'hitting' | 'fielding' | 'game' | 'skills';
  duration: number;
  date: string;
  featured?: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'tournament' | 'award' | 'recognition' | 'milestone';
}

export interface ScoutingReport {
  strengths: string[];
  development: string[];
  intangibles: string[];
}

export interface CoachReference {
  name: string;
  title: string;
  organization: string;
  phone: string;
  email: string;
  relationship: string;
}

export interface PlayerProfile {
  personalInfo: PersonalInfo;
  athletics: Athletics;
  academics: Academics;
  measurables: Measurable[];
  videos: VideoClip[];
  accolades: Achievement[];
  scoutingReport: ScoutingReport;
  references: CoachReference[];
}

export interface QuickStat {
  label: string;
  value: string;
  icon?: string;
}

export interface CTAButton {
  label: string;
  href: string;
  variant: 'primary' | 'secondary' | 'outline';
  icon?: string;
}