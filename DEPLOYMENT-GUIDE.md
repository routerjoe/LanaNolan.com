# Lana Nolan Recruiting Website - Deployment Guide

## 🚀 Production Deployment

### Vercel Deployment (Current)
The website is deployed on Vercel for optimal Next.js performance and global CDN distribution.

**Deployment Command:**
```bash
cd playerprofile-website
npx vercel --prod
```

**Features:**
- Automatic HTTPS/SSL certificates
- Global CDN distribution
- Serverless functions support
- Automatic deployments from Git
- Performance monitoring
- Edge caching optimization

### Environment Variables
Required environment variables for production:

```env
# Sanity CMS Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_api_token

# Contact Form Configuration
NEXT_PUBLIC_CONTACT_EMAIL=lana@example.com
NEXT_PUBLIC_COACH_EMAIL=coach@example.com

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=your_google_analytics_id
```

## 📊 Performance Optimizations

### Next.js Optimizations
- **Image Optimization**: Automatic WebP conversion and responsive images
- **Code Splitting**: Automatic route-based code splitting
- **Static Generation**: Pre-rendered pages for optimal performance
- **Font Optimization**: Google Fonts optimization with font-display: swap

### Tailwind CSS Optimizations
- **Purge CSS**: Unused styles automatically removed in production
- **JIT Mode**: Just-in-time compilation for smaller bundle sizes
- **Critical CSS**: Above-the-fold styles inlined

### Bundle Analysis
```bash
npm run analyze
```

## 🔧 Build Configuration

### Next.js Configuration (`next.config.js`)
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['cdn.sanity.io'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

### Vercel Configuration (`vercel.json`)
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

## 🌐 Domain Configuration

### Custom Domain Setup
1. **Purchase Domain**: Recommended registrars (Namecheap, GoDaddy, Google Domains)
2. **DNS Configuration**: Point domain to Vercel
3. **SSL Certificate**: Automatic via Vercel
4. **Subdomain Setup**: Optional www redirect

### Recommended Domain Names
- `playerprofile.com`
- `lananolansoftball.com`
- `lananolan2027.com`

## 📈 Analytics & Monitoring

### Google Analytics 4
```javascript
// Add to app/layout.tsx
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
      <GoogleAnalytics gaId="GA_MEASUREMENT_ID" />
    </html>
  )
}
```

### Vercel Analytics
```bash
npm install @vercel/analytics
```

### Performance Monitoring
- **Core Web Vitals**: Automatic monitoring via Vercel
- **Real User Monitoring**: Performance insights
- **Error Tracking**: Automatic error reporting

## 🔒 Security Configuration

### Security Headers
- **X-Frame-Options**: Prevent clickjacking
- **X-Content-Type-Options**: Prevent MIME sniffing
- **Referrer-Policy**: Control referrer information
- **Content-Security-Policy**: XSS protection

### HTTPS Enforcement
- Automatic HTTPS redirect
- HSTS headers
- Secure cookie settings

## 🚀 Deployment Checklist

### Pre-Deployment
- [ ] All environment variables configured
- [ ] Build passes locally (`npm run build`)
- [ ] All tests passing (`npm test`)
- [ ] Performance audit completed
- [ ] SEO optimization verified
- [ ] Mobile responsiveness tested

### Post-Deployment
- [ ] Live site functionality verified
- [ ] Contact forms working
- [ ] Video player functional
- [ ] PDF generation working
- [ ] Analytics tracking active
- [ ] Performance metrics reviewed

## 🔄 Continuous Deployment

### Git Integration
- **Automatic Deployments**: Push to main branch triggers deployment
- **Preview Deployments**: Pull requests create preview URLs
- **Rollback Support**: Easy rollback to previous versions

### Branch Strategy
- `main`: Production deployments
- `develop`: Staging environment
- `feature/*`: Feature development branches

## 📱 Mobile Optimization

### Progressive Web App (PWA)
```json
// public/manifest.json
{
  "name": "Lana Nolan - Softball Recruit",
  "short_name": "Lana Nolan",
  "description": "Class of 2027 Softball Recruit",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#1e40af",
  "theme_color": "#1e40af",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

## 🎯 SEO Optimization

### Meta Tags
- **Title Tags**: Unique for each page
- **Meta Descriptions**: Compelling and descriptive
- **Open Graph**: Social media sharing optimization
- **Schema Markup**: Structured data for search engines

### Sitemap Generation
```bash
npm run build:sitemap
```

## 📞 Support & Maintenance

### Regular Updates
- **Dependencies**: Monthly security updates
- **Content**: Regular profile updates via Sanity CMS
- **Performance**: Quarterly performance audits
- **SEO**: Monthly SEO optimization reviews

### Backup Strategy
- **Code**: Git repository backup
- **Content**: Sanity CMS automatic backups
- **Analytics**: Regular data exports

## 🎉 Go-Live Checklist

### Final Verification
- [ ] Production URL accessible
- [ ] All pages loading correctly
- [ ] Contact forms sending emails
- [ ] Video gallery functional
- [ ] PDF downloads working
- [ ] Mobile experience optimized
- [ ] Analytics tracking active
- [ ] Social media links working
- [ ] Performance scores > 90
- [ ] SEO optimization complete

### Launch Communication
- [ ] Social media announcement
- [ ] Coach outreach campaign
- [ ] Email signature update
- [ ] Business card update
- [ ] Tournament registration forms

---

**Deployment Status**: ✅ Live at [Production URL]
**Last Updated**: [Current Date]
**Next Review**: [30 days from deployment]