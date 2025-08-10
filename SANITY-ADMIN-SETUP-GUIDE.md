# 🛠️ Sanity.io Admin Panel Setup Guide

## 🎯 Overview

This guide will walk you through setting up the Sanity.io admin panel for the Lana Nolan recruiting website. Once complete, you'll have a professional content management system accessible at `/admin` with drag-and-drop video uploads, rich text editing, and form-based content management.

## 📋 Prerequisites

- Node.js 18+ installed
- Git repository access
- Sanity.io account (free tier available)

## 🚀 Step-by-Step Setup

### **Step 1: Install Sanity Dependencies**

```bash
cd lananolan-website
npm install sanity @sanity/client @sanity/image-url @sanity/vision sanity-plugin-media next-sanity
```

### **Step 2: Create Sanity Project**

1. **Sign up for Sanity.io**
   - Go to [sanity.io](https://sanity.io)
   - Create free account
   - Create new project: "Lana Nolan Recruiting"

2. **Get Project Credentials**
   - Project ID: Found in project settings
   - Dataset: Use "production"
   - API Token: Generate in project settings with "Editor" permissions

### **Step 3: Configure Environment Variables**

Create `.env.local` file in `lananolan-website/`:

```bash
# Copy from .env.example
cp .env.example .env.local
```

Update `.env.local` with your Sanity credentials:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_api_token_here
```

### **Step 4: Initialize Sanity Studio**

```bash
# Install Sanity CLI globally
npm install -g @sanity/cli

# Login to Sanity
sanity login

# Deploy the schema to your project
sanity schema deploy
```

### **Step 5: Update Package.json Scripts**

Add these scripts to `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "sanity:dev": "sanity dev",
    "sanity:build": "sanity build",
    "sanity:deploy": "sanity deploy"
  }
}
```

### **Step 6: Start the Admin Panel**

```bash
# Start Next.js development server
npm run dev

# In another terminal, start Sanity Studio
npm run sanity:dev
```

**Access Points:**
- **Website**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin

## 🎨 Admin Panel Features

### **Dashboard Overview**
```
┌─────────────────────────────────────────────────────┐
│ 🏠 Lana Nolan Admin Panel                    👤 Admin │
├─────────────────────────────────────────────────────┤
│ 📊 Player Profile  🎥 Videos  📝 Blog  📅 Schedule  │
├─────────────────────────────────────────────────────┤
│                                                     │
│ 👤 Player Profile (Singleton)                      │
│ • Personal Information                              │
│ • Athletic Details                                  │
│ • Performance Measurables                          │
│ • Scouting Report                                   │
│ • Coach References                                  │
│                                                     │
│ 🎥 Video Highlights                                 │
│ • Upload video files or external URLs              │
│ • Categorize by skills (hitting, fielding, etc.)   │
│ • Auto-generate thumbnails                         │
│ • Set featured videos                              │
│                                                     │
│ 📝 Blog Posts                                       │
│ • Rich text editor with formatting                 │
│ • Image insertion and management                   │
│ • SEO optimization fields                          │
│ • Category and tag management                      │
│                                                     │
│ 📅 Schedule Events                                  │
│ • Tournament and showcase management               │
│ • Coach availability settings                      │
│ • Registration deadlines and costs                 │
│ • Priority levels and notes                        │
└─────────────────────────────────────────────────────┘
```

## 📝 Content Management Workflows

### **Updating Player Profile**

1. **Navigate to Player Profile**
   - Click "Player Profile" in admin panel
   - Edit personal information, positions, team details
   - Update performance measurables with latest stats
   - Save changes (auto-publishes to website)

### **Adding Video Highlights**

1. **Create New Video**
   - Click "Video Highlights" → "Create"
   - Upload video file or paste external URL (Hudl, YouTube)
   - Add title, description, and category
   - Upload custom thumbnail or auto-generate
   - Set as featured if it should appear prominently
   - Publish

### **Creating Blog Posts**

1. **New Blog Post**
   - Click "Blog Posts" → "Create"
   - Add compelling title (auto-generates URL slug)
   - Write excerpt for preview cards
   - Use rich text editor for content
   - Add images, links, and formatting
   - Set category and tags
   - Upload featured image
   - Schedule or publish immediately

### **Managing Schedule**

1. **Add Tournament/Event**
   - Click "Schedule Events" → "Create"
   - Enter event details (title, dates, location)
   - Set event type (tournament, showcase, camp, etc.)
   - Toggle "Coaches Welcome" for availability
   - Add contact information and costs
   - Set priority level
   - Publish

## 🔧 Advanced Features

### **Media Management**
- **Organized Library**: All images and videos in one place
- **Automatic Optimization**: Images auto-compressed for web
- **CDN Delivery**: Fast global content delivery
- **Version Control**: Track all changes and revisions

### **SEO Optimization**
- **Meta Tags**: Automatic generation for search engines
- **Social Sharing**: Open Graph and Twitter Card support
- **URL Structure**: Clean, SEO-friendly URLs
- **Sitemap**: Automatic XML sitemap generation

### **Content Validation**
- **Required Fields**: Ensures complete information
- **Format Validation**: Email, URL, and date validation
- **Character Limits**: Optimized for social media sharing
- **Image Requirements**: Proper sizing and formats

## 🚀 Publishing Workflow

### **Content Review Process**
1. **Draft**: Create and edit content
2. **Preview**: See how it looks on the website
3. **Publish**: Make live immediately
4. **Update**: Edit anytime with instant updates

### **Automatic Deployment**
- Changes publish instantly to live website
- No technical knowledge required
- Version history for rollbacks if needed
- Real-time preview of changes

## 📊 Analytics Integration

### **Content Performance**
- Track which blog posts get most engagement
- Monitor video view statistics
- Analyze coach inquiry patterns
- Optimize content based on data

### **Recruiting Insights**
- Most popular content types
- Peak engagement times
- Geographic coach interest
- Contact form conversion rates

## 🔒 Security & Access

### **User Management**
- **Admin**: Full access to all content
- **Editor**: Content creation and editing
- **Viewer**: Read-only access for coaches/family

### **Content Security**
- **Automatic Backups**: All content backed up continuously
- **Version Control**: Complete change history
- **Access Logs**: Track who made what changes
- **Secure Authentication**: Multi-factor authentication available

## 🎯 Best Practices

### **Content Strategy**
- **Regular Updates**: Post weekly during season
- **Quality Over Quantity**: Focus on compelling content
- **Coach-Focused**: Write for college recruiting audience
- **SEO Optimization**: Use recruiting keywords naturally

### **Media Guidelines**
- **Video Quality**: HD minimum, 4K preferred
- **File Sizes**: Under 100MB for fast loading
- **Thumbnails**: Action shots that grab attention
- **Descriptions**: Detailed, keyword-rich descriptions

### **Maintenance Schedule**
- **Weekly**: Update schedule, add new content
- **Monthly**: Review and update player stats
- **Seasonally**: Major profile updates and new videos
- **As Needed**: Tournament results and achievements

## 🆘 Troubleshooting

### **Common Issues**

**Admin Panel Won't Load**
- Check environment variables are set correctly
- Verify Sanity project ID and dataset
- Ensure API token has proper permissions

**Videos Not Uploading**
- Check file size (under 100MB recommended)
- Verify supported formats (MP4, MOV, AVI)
- Ensure stable internet connection

**Content Not Appearing on Website**
- Verify content is published (not draft)
- Check if caching needs to be cleared
- Confirm API connection is working

### **Getting Help**
- Check Sanity.io documentation
- Review error messages in browser console
- Contact technical support if needed

## 🎉 Success Metrics

### **Immediate Benefits**
- **Time Savings**: 10x faster content updates
- **Professional Presentation**: Consistent, polished content
- **Better Organization**: Structured content management
- **Reduced Errors**: Form validation prevents mistakes

### **Long-term Impact**
- **More Coach Engagement**: Fresh content keeps coaches interested
- **Better Recruiting Results**: Professional presentation impresses coaches
- **Easier Maintenance**: Non-technical users can manage content
- **Scalable Growth**: System grows with recruiting needs

---

**🚀 Ready to Launch!** Once setup is complete, you'll have a professional content management system that transforms recruiting website maintenance from a technical task into a simple, efficient process.