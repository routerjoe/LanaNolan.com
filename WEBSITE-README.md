# Player Profile - Softball Recruiting Website

A comprehensive recruiting website for Player Profile, Class of 2027 softball player, built with Next.js 15, TypeScript, and Tailwind CSS.

## 🎯 Project Status: ✅ PRODUCTION READY

**Last Updated**: January 11, 2025  
**Version**: 1.0.0  
**Status**: Fully tested and ready for deployment

## ✨ Features

### 🏠 Public Website
- **Hero Section**: Professional introduction with call-to-action buttons
- **Player Profile**: Comprehensive athletic and academic information with measurables
- **Video Gallery**: Categorized highlight reels with filtering (hitting, fielding, game situations, skills)
- **Schedule & Events**: Tournament calendar with coach attendance information
- **Academic Excellence**: GPA and academic achievements showcase
- **Blog System**: Updates, achievements, and recruiting journey posts
- **Contact System**: Professional inquiry form with validation and direct contact methods

### 🔧 Player Dashboard
- **Authentication**: Secure login system with customizable credentials
- **Player Profile Management**: Edit personal info, athletics, measurables, and academic data
- **Blog Management**: Create, edit, publish, and schedule blog posts with categories
- **Schedule Management**: Add tournaments, showcases, camps, and games
- **Photo Management**: Upload and manage photos with category organization
- **Video Management**: Add videos from URLs (YouTube, Team Profile Hub) or file uploads
- **Social Media Integration**: Create and schedule social media posts

## 🛠 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 with custom design system
- **Animations**: Framer Motion for smooth interactions
- **Forms**: React Hook Form with comprehensive validation
- **PDF Generation**: jsPDF for recruiting packet downloads
- **File Handling**: Built-in API routes for photo/video uploads
- **Error Handling**: Global error boundaries and validation

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Run the development server:**
```bash
npm run dev
```

3. **Open your browser:**
Navigate to [http://localhost:3000](http://localhost:3000)

### 🔐 Admin Access

Access the Player Dashboard at `/admin`:
- **Username**: `admin`
- **Password**: `lananolan2027`
- **Note**: Credentials can be changed in admin settings

## 📁 Project Structure

```
lananolan-website/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── admin/             # Player Dashboard
│   │   ├── api/               # API routes
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── sections/          # Page sections
│   │   ├── ui/               # UI components
│   │   └── layout/           # Layout components
│   ├── data/                 # JSON data storage
│   ├── types/                # TypeScript definitions
│   └── utils/                # Utility functions
├── public/                   # Static assets
│   ├── uploads/             # User uploaded files
│   └── images/              # Static images
└── DEPLOYMENT-CHECKLIST.md  # Deployment guide
```

## 🧪 Testing Status

### ✅ Completed Testing
- [x] **Core Functionality**: All sections render correctly
- [x] **Responsive Design**: Mobile, tablet, desktop layouts
- [x] **Form Validation**: Contact form with proper error handling
- [x] **Player Dashboard**: Full CRUD operations for all content
- [x] **API Endpoints**: All 6 admin API routes tested (200 OK)
- [x] **File Uploads**: Photo and video upload functionality
- [x] **PDF Generation**: Recruiting packet download
- [x] **Error Handling**: Global error boundaries implemented
- [x] **Performance**: Loading states and optimizations
- [x] **Contact System**: Phone contact removed as requested

### 📊 Performance Optimizations
- Image optimization with Next.js Image component
- Code splitting and bundle optimization
- Static asset caching headers
- Loading spinners and skeleton screens
- Error boundaries for graceful error handling

## 🌐 Deployment

### Quick Deploy to Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Alternative Deployment Options
- **Netlify**: Build and deploy the `.next` folder
- **Traditional Hosting**: Use `npm run build` and serve static files

### Environment Variables

Set these on your hosting platform (Vercel recommended):

```env
# Admin auth tokens (must match)
ADMIN_TOKEN=your-strong-random-token
NEXT_PUBLIC_ADMIN_TOKEN=your-strong-random-token

# Optional UX/security controls
# Public schedule polling interval override (milliseconds)
NEXT_PUBLIC_SCHEDULE_POLL_INTERVAL_MS=300000

# Optional: server-side guard for /admin
# If 'true', unauthorized visits to /admin are redirected to home
ADMIN_GUARD_REDIRECT=true
# or (client-exposed toggle)
# NEXT_PUBLIC_ADMIN_GUARD_REDIRECT=true

# Site URL
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# Optional: X (Twitter) API credentials for server-side posting (if implemented)
# X_API_KEY=
# X_API_SECRET=
# X_ACCESS_TOKEN=
# X_ACCESS_SECRET=
```

- ADMIN_TOKEN: server-side token validated by middleware for /api/admin/* requests.
- NEXT_PUBLIC_ADMIN_TOKEN: token used by the Admin UI to send Authorization: Bearer and set the admin_token cookie; must equal ADMIN_TOKEN.
- NEXT_PUBLIC_SCHEDULE_POLL_INTERVAL_MS: optional override for public schedule polling interval. Default is 30s (development) and 5m (production).
- ADMIN_GUARD_REDIRECT / NEXT_PUBLIC_ADMIN_GUARD_REDIRECT: optional protection for /admin page; when enabled and token missing/invalid, requests are redirected to the homepage.
- NEXT_PUBLIC_SITE_URL: public site URL used for metadata and links.
## 📋 Post-Deployment Checklist

See [`DEPLOYMENT-CHECKLIST.md`](./DEPLOYMENT-CHECKLIST.md) for complete deployment verification steps.

## 🔧 Maintenance

### Content Management
- Use the Player Dashboard at `/admin` for all content updates
- Upload photos and videos through the admin interface
- Blog posts support rich text and scheduling
- Schedule events with coach attendance tracking

### Technical Maintenance
- **Data Storage**: Currently uses JSON files (consider database for scale)
- **File Storage**: Uploads stored in `/public/uploads/`
- **Backups**: Regularly backup `/src/data/` folder
- **Updates**: Keep dependencies updated for security

## 🎯 Key Features Implemented

### User Experience
- **Mobile-First Design**: Fully responsive across all devices
- **Fast Loading**: Optimized images and code splitting
- **Professional UI**: Clean, modern design with smooth animations
- **Accessibility**: Proper ARIA labels and keyboard navigation

### Content Management
- **Easy Updates**: Player Dashboard for non-technical content updates
- **Media Management**: Photo and video organization with categories
- **Blog System**: Full-featured blog with categories and scheduling
- **Social Integration**: Twitter/X integration for social media posts

### Recruiting Features
- **PDF Generation**: Downloadable recruiting packets
- **Contact Forms**: Professional inquiry system with validation
- **Schedule Display**: Tournament and showcase calendar
- **Video Showcase**: Categorized highlight reels
- **Academic Display**: GPA and achievement showcase

## 📞 Support

For technical issues or questions:
1. Check the browser console for error messages
2. Verify Player Dashboard access at `/admin`
3. Review the deployment checklist for common issues
4. Ensure all required fields are filled in forms

## 📄 License

Private project for Player Profile recruiting purposes.

---

**🎉 Ready for Production Deployment!**  
This website has been thoroughly tested and is ready to help showcase Lana's softball talents to college coaches.
