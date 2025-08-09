# Lana Nolan Recruiting Website - Implementation Guide

## Development Environment Setup

### Prerequisites
- Node.js 18+ and npm/yarn
- Git for version control
- VS Code with recommended extensions
- Modern browser for testing

### Project Initialization
```bash
npx create-next-app@latest lananolan-website --typescript --tailwind --eslint --app
cd lananolan-website
npm install
```

### Essential Dependencies
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^3.3.0",
    "framer-motion": "^10.16.0",
    "react-hook-form": "^7.47.0",
    "react-player": "^2.13.0",
    "react-calendar": "^4.6.0",
    "jspdf": "^2.5.1",
    "next-seo": "^6.4.0",
    "lucide-react": "^0.292.0",
    "@headlessui/react": "^1.7.17"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "^14.0.0",
    "prettier": "^3.0.0",
    "autoprefixer": "^10.0.0",
    "postcss": "^8.0.0"
  }
}
```

## Project Structure

```
lananolan-website/
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── favicon.ico
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Navigation.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Layout.tsx
│   │   ├── sections/
│   │   │   ├── Hero.tsx
│   │   │   ├── PlayerProfile.tsx
│   │   │   ├── VideoGallery.tsx
│   │   │   ├── Schedule.tsx
│   │   │   ├── Academics.tsx
│   │   │   ├── Contact.tsx
│   │   │   └── Blog.tsx
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Form.tsx
│   │   │   └── Table.tsx
│   │   └── features/
│   │       ├── VideoPlayer.tsx
│   │       ├── Calendar.tsx
│   │       ├── ContactForm.tsx
│   │       ├── PDFGenerator.tsx
│   │       └── StatsTable.tsx
│   ├── data/
│   │   ├── player-profile.json
│   │   ├── schedule.json
│   │   ├── videos.json
│   │   └── blog-posts.json
│   ├── types/
│   │   ├── player.ts
│   │   ├── schedule.ts
│   │   └── content.ts
│   ├── utils/
│   │   ├── constants.ts
│   │   ├── helpers.ts
│   │   └── api.ts
│   └── styles/
│       └── components.css
├── public/
│   ├── images/
│   ├── videos/
│   └── documents/
├── docs/
│   ├── website-architecture-plan.md
│   ├── content-strategy-wireframes.md
│   └── implementation-guide.md
└── package.json
```

## Core Component Specifications

### 1. Layout Components

#### Header Component
```typescript
interface HeaderProps {
  isScrolled: boolean;
  activeSection: string;
}

// Features:
// - Sticky navigation with scroll effects
// - Mobile hamburger menu
// - Contact CTA button
// - Logo/branding
// - Smooth scroll navigation
```

#### Navigation Component
```typescript
interface NavigationItem {
  label: string;
  href: string;
  icon?: string;
}

// Features:
// - Responsive menu system
// - Active section highlighting
// - Smooth scroll behavior
// - Mobile-friendly interactions
```

### 2. Hero Section
```typescript
interface HeroProps {
  playerName: string;
  graduationYear: number;
  tagline: string;
  backgroundImage: string;
  quickStats: QuickStat[];
  ctaButtons: CTAButton[];
}

// Features:
// - Full-screen background image
// - Animated text overlays
// - Call-to-action buttons
// - Quick stats display
// - Responsive design
```

### 3. Video Gallery
```typescript
interface VideoGalleryProps {
  videos: VideoClip[];
  categories: VideoCategory[];
  featuredVideo?: VideoClip;
}

interface VideoClip {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  category: string;
  duration: number;
  date: string;
}

// Features:
// - Categorized video organization
// - Responsive video player
// - Thumbnail navigation
// - Full-screen viewing
// - Loading states
```

### 4. Interactive Calendar
```typescript
interface ScheduleEvent {
  id: string;
  title: string;
  date: Date;
  endDate?: Date;
  location: string;
  type: 'tournament' | 'showcase' | 'camp' | 'visit';
  description?: string;
  contactInfo?: string;
  isAvailable: boolean;
}

// Features:
// - Month/week/day views
// - Event filtering by type
// - Coach contact information
// - Export functionality
// - Mobile-optimized interface
```

### 5. Contact Forms
```typescript
interface ContactFormData {
  coachName: string;
  schoolName: string;
  email: string;
  phone?: string;
  message: string;
  preferredContact: 'email' | 'phone';
  timeline: string;
}

// Features:
// - Form validation
// - Email integration
// - Auto-response system
// - Spam protection
// - Success/error handling
```

## Data Management Strategy

### Content Structure
```typescript
// types/player.ts
export interface PlayerProfile {
  personalInfo: {
    name: string;
    graduationYear: number;
    email: string;
    phone?: string;
    socialMedia: {
      twitter?: string;
      instagram?: string;
    };
  };
  athletics: {
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
    };
    travelTeam: {
      name: string;
      coach: string;
      contact: string;
    };
  };
  academics: {
    gpa?: number;
    classRank?: string;
    satScore?: number;
    actScore?: number;
    honors: string[];
    awards: string[];
  };
  measurables: Measurable[];
  videos: VideoClip[];
  schedule: ScheduleEvent[];
  accolades: Achievement[];
  scoutingReport: {
    strengths: string[];
    development: string[];
    intangibles: string[];
  };
}

export interface Measurable {
  metric: string;
  value: string;
  date: string;
  improvement?: string;
  notes?: string;
}
```

### Content Management
- JSON files for structured data
- TypeScript interfaces for type safety
- Validation functions for data integrity
- Easy update mechanisms for non-technical users

## Styling & Design System

### Tailwind Configuration
```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        secondary: {
          50: '#f8fafc',
          500: '#64748b',
          600: '#475569',
        },
        accent: {
          500: '#f59e0b',
          600: '#d97706',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
```

### Component Design Patterns
- Consistent spacing using Tailwind's scale
- Responsive breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Dark mode support for accessibility
- Focus states for keyboard navigation
- Loading states for all interactive elements

## Performance Optimization

### Image Optimization
```typescript
// Next.js Image component usage
import Image from 'next/image';

<Image
  src="/images/hero-photo.jpg"
  alt="Lana Nolan softball action shot"
  width={1920}
  height={1080}
  priority
  className="object-cover"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

### Code Splitting
```typescript
// Dynamic imports for heavy components
import dynamic from 'next/dynamic';

const VideoGallery = dynamic(() => import('./VideoGallery'), {
  loading: () => <VideoGallerySkeleton />,
  ssr: false
});

const Calendar = dynamic(() => import('./Calendar'), {
  loading: () => <CalendarSkeleton />
});
```

### SEO Implementation
```typescript
// app/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lana Nolan - Softball Recruit Class of 2027',
  description: 'Dedicated softball recruit seeking collegiate opportunities. View highlights, stats, and schedule.',
  keywords: 'softball recruit, class of 2027, South Carolina softball, college recruiting',
  authors: [{ name: 'Lana Nolan' }],
  openGraph: {
    title: 'Lana Nolan - Softball Recruit',
    description: 'Class of 2027 softball recruit with strong academics and athletic performance',
    images: ['/images/og-image.jpg'],
    type: 'profile',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@LanaNolan02',
    creator: '@LanaNolan02',
  },
};
```

## Deployment Strategy

### Vercel Deployment
```json
// vercel.json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "functions": {
    "app/api/contact/route.ts": {
      "maxDuration": 10
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        }
      ]
    }
  ]
}
```

### Environment Variables
```bash
# .env.local
NEXT_PUBLIC_SITE_URL=https://lananolan.com
EMAILJS_SERVICE_ID=your_service_id
EMAILJS_TEMPLATE_ID=your_template_id
EMAILJS_PUBLIC_KEY=your_public_key
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

## Testing Strategy

### Component Testing
- Jest and React Testing Library
- Unit tests for utility functions
- Integration tests for forms
- Visual regression testing

### Performance Testing
- Lighthouse CI integration
- Core Web Vitals monitoring
- Mobile performance optimization
- Cross-browser compatibility testing

## Maintenance & Updates

### Content Update Process
1. Update JSON data files
2. Add new media to public directory
3. Test changes locally
4. Deploy via Git push to main branch
5. Verify live site functionality

### Regular Maintenance Tasks
- Monthly performance audits
- Quarterly dependency updates
- Seasonal content refreshes
- Annual design reviews

This implementation guide provides the technical foundation for building a professional, performant recruiting website that effectively showcases Lana's softball talents to college coaches.