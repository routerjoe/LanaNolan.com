# Lana Nolan - Softball Recruiting Website

A modern, responsive recruiting website for Lana Nolan, Class of 2027 softball recruit. Built with Next.js, TypeScript, and Tailwind CSS to showcase athletic achievements, academic excellence, and recruiting information to college coaches.

## 🌟 Features

### Core Functionality
- **Professional Hero Section** - Eye-catching landing with key stats and call-to-action buttons
- **Player Profile** - Comprehensive athletic and academic information
- **Video Gallery** - Categorized highlight reels and game footage
- **Interactive Schedule** - Tournament calendar with coach availability
- **Contact Forms** - Direct communication tools for college coaches
- **Recruiting Packet** - Downloadable PDF with complete player information
- **Blog/News** - Updates on achievements and recruiting progress

### Technical Features
- **Responsive Design** - Mobile-first approach optimized for all devices
- **SEO Optimized** - Comprehensive metadata and search engine optimization
- **Performance Focused** - Fast loading with Next.js optimization
- **Accessibility** - WCAG 2.1 AA compliant design
- **Modern Stack** - Built with latest web technologies

## 🚀 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Forms**: React Hook Form
- **Video**: React Player
- **Calendar**: React Calendar
- **PDF Generation**: jsPDF
- **Icons**: Lucide React
- **UI Components**: Headless UI

## 📁 Project Structure

```
lananolan-website/
├── src/
│   ├── app/                    # Next.js app router
│   │   ├── globals.css         # Global styles and design system
│   │   ├── layout.tsx          # Root layout with SEO
│   │   └── page.tsx            # Homepage
│   ├── components/
│   │   ├── layout/             # Layout components
│   │   │   ├── Header.tsx      # Navigation header
│   │   │   ├── Footer.tsx      # Site footer
│   │   │   └── Layout.tsx      # Main layout wrapper
│   │   ├── sections/           # Page sections
│   │   │   └── Hero.tsx        # Hero landing section
│   │   ├── ui/                 # Reusable UI components
│   │   │   ├── Button.tsx      # Button component
│   │   │   └── Card.tsx        # Card component
│   │   └── features/           # Feature-specific components
│   ├── data/                   # JSON data files
│   │   ├── player-profile.json # Player information
│   │   ├── schedule.json       # Events and schedule
│   │   └── blog-posts.json     # News and updates
│   ├── types/                  # TypeScript type definitions
│   │   ├── player.ts           # Player-related types
│   │   ├── schedule.ts         # Schedule types
│   │   └── content.ts          # Content types
│   └── utils/                  # Utility functions
│       ├── constants.ts        # App constants
│       └── helpers.ts          # Helper functions
├── public/                     # Static assets
├── docs/                       # Documentation
│   ├── website-architecture-plan.md
│   ├── content-strategy-wireframes.md
│   └── implementation-guide.md
└── package.json
```

## 🛠️ Development

### Prerequisites
- Node.js 18+ and npm
- Git for version control

### Installation

1. Clone the repository:
```bash
git clone https://github.com/routerjoe/LanaNolan.com.git
cd LanaNolan.com
```

2. Navigate to the website directory:
```bash
cd lananolan-website
```

3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🎨 Design System

### Colors
- **Primary**: Blue (#3b82f6) - Professional and trustworthy
- **Secondary**: Gray (#64748b) - Clean and modern
- **Accent**: Amber (#f59e0b) - Energy and achievement

### Typography
- **Display**: Poppins - Headlines and important text
- **Body**: Inter - Body text and UI elements

### Components
- Consistent spacing using 8px grid system
- Responsive breakpoints: 640px, 768px, 1024px, 1280px
- Smooth animations and transitions
- Focus states for accessibility

## 📱 Responsive Design

The website is optimized for all devices:
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

Key responsive features:
- Mobile-first CSS approach
- Touch-friendly navigation
- Optimized images and media
- Readable typography at all sizes

## 🔍 SEO & Performance

### SEO Features
- Comprehensive meta tags
- Open Graph and Twitter Card support
- Structured data markup
- XML sitemap generation
- Optimized for recruiting keywords

### Performance Optimizations
- Next.js Image optimization
- Code splitting and lazy loading
- CDN-ready static assets
- Core Web Vitals optimization

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main branch

### Manual Deployment
1. Build the project: `npm run build`
2. Upload the `.next` folder to your hosting provider
3. Configure your server to serve the Next.js application

## 📊 Content Management

### Updating Player Information
Edit the JSON files in the `src/data/` directory:
- `player-profile.json` - Personal and athletic information
- `schedule.json` - Tournaments and events
- `blog-posts.json` - News and updates

### Adding New Content
1. Update the appropriate JSON file
2. Commit changes to Git
3. Push to trigger automatic deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes and commit: `git commit -m 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is private and proprietary. All rights reserved.

## 📞 Contact

**Lana Nolan**
- Email: lananolan08@gmail.com
- Twitter/X: [@LanaNolan02](https://x.com/LanaNolan02)
- Website: [lananolan.com](https://lananolan.com)

---

*Built with ❤️ for recruiting success*
## 🔐 Environment Variables

Configure these on your hosting platform (Vercel recommended). The admin dashboard and protected API routes require matching tokens.

```env
# Admin auth tokens (must match)
ADMIN_TOKEN=your-strong-random-token
NEXT_PUBLIC_ADMIN_TOKEN=your-strong-random-token

# Optional UX/security controls

# Public schedule polling interval override (milliseconds)
# Defaults: 30,000 in development, 300,000 (5 minutes) in production
NEXT_PUBLIC_SCHEDULE_POLL_INTERVAL_MS=300000

# Optional: server-side guard for /admin
# If 'true', unauthorized visits to /admin are redirected to home
ADMIN_GUARD_REDIRECT=true
# or (client-exposed toggle)
# NEXT_PUBLIC_ADMIN_GUARD_REDIRECT=true

# Site URL for metadata and links
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

Notes:
- ADMIN_TOKEN: server-side token validated by middleware for /api/admin/* requests.
- NEXT_PUBLIC_ADMIN_TOKEN: token used by the Admin UI to send Authorization: Bearer and set the admin_token cookie; must equal ADMIN_TOKEN.
- NEXT_PUBLIC_SCHEDULE_POLL_INTERVAL_MS: optional override for the public schedule polling interval.
- ADMIN_GUARD_REDIRECT / NEXT_PUBLIC_ADMIN_GUARD_REDIRECT: optional protection for /admin; when enabled and token missing/invalid, requests are redirected to the homepage.