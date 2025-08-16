export const SITE_CONFIG = {
  name: 'Lana Nolan',
  description: 'Class of 2027 softball recruit with strong academics and athletic performance',
  url: 'https://lananolan.com',
  ogImage: '/images/og-image.jpg',
  links: {
    twitter: 'https://x.com/LanaNolan02',
    email: 'lananolan08@gmail.com',
  },
};

export const NAVIGATION_ITEMS = [
  { label: 'Home', href: '#home' },
  { label: 'Profile', href: '#profile' },
  { label: 'Videos', href: '#videos' },
  { label: 'Schedule', href: '#schedule' },
  { label: 'Academics', href: '#academics' },
  { label: 'Contact', href: '#contact' },
];

export const VIDEO_CATEGORIES = [
  {
    id: 'hitting',
    name: 'Hitting',
    description: 'Batting practice and game at-bats',
    icon: 'Zap',
  },
  {
    id: 'fielding',
    name: 'Fielding',
    description: 'Defensive plays and position work',
    icon: 'Shield',
  },
  {
    id: 'game',
    name: 'Game Situations',
    description: 'Live game footage and clutch moments',
    icon: 'Target',
  },
  {
    id: 'skills',
    name: 'Skills Training',
    description: 'Training sessions and skill development',
    icon: 'TrendingUp',
  },
];

export const MEASURABLE_CATEGORIES = [
  'Exit Velocity',
  'Throwing Velocity',
  'Pop Time',
  'Home to First',
  '60-Yard Dash',
  'Vertical Jump',
];

export const POSITIONS = [
  'Catcher (C)',
  'First Base (1B)',
  'Second Base (2B)',
  'Third Base (3B)',
  'Shortstop (SS)',
  'Left Field (LF)',
  'Center Field (CF)',
  'Right Field (RF)',
  'Pitcher (P)',
  'Designated Player (DP)',
];

export const CONTACT_TIMELINES = [
  'Immediate',
  'Within 1 week',
  'Within 1 month',
  'This season',
  'Next season',
  'No rush',
];

export const ACHIEVEMENT_TYPES = [
  'tournament',
  'award',
  'recognition',
  'milestone',
] as const;

export const EVENT_TYPES = [
  'tournament',
  'showcase',
  'camp',
  'visit',
  'game',
] as const;

export const BLOG_CATEGORIES = [
  'tournament',
  'achievement',
  'recruiting',
  'training',
] as const;

export const SOCIAL_LINKS = {
  twitter: {
    url: 'https://x.com/LanaNolan02',
    label: 'Follow on X (Twitter)',
    icon: 'Twitter',
  },
  email: {
    url: 'mailto:lananolan08@gmail.com',
    label: 'Send Email',
    icon: 'Mail',
  },
};

export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export const ANIMATION_DURATION = {
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
} as const;

export const Z_INDEX = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modal: 1040,
  popover: 1050,
  tooltip: 1060,
} as const;