# 🎛️ Admin Dashboard Quick Start Guide

## 🚀 How to Access the Admin Dashboard

### Option 1: Local Sanity Studio (Recommended for Development)

1. **Install Sanity CLI** (currently installing):
   ```bash
   cd lananolan-website
   npm install -g @sanity/cli
   ```

2. **Start the Admin Dashboard**:
   ```bash
   npx sanity dev
   ```
   
3. **Access the Dashboard**:
   - Open your browser to: `http://localhost:3333`
   - This will show the Sanity Studio admin interface

### Option 2: Hosted Sanity Studio (Production Ready)

1. **Deploy Sanity Studio**:
   ```bash
   npx sanity deploy
   ```

2. **Access Online**:
   - Your admin dashboard will be available at: `https://your-project-name.sanity.studio`
   - You can access this from anywhere with internet

## 🔧 First-Time Setup Required

### Step 1: Create Sanity Account
1. Go to [sanity.io](https://sanity.io)
2. Sign up for a free account
3. Create a new project

### Step 2: Configure Environment Variables
Create a `.env.local` file in the `lananolan-website` folder:

```env
# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_api_token_here
```

### Step 3: Initialize Sanity Project
```bash
cd lananolan-website
npx sanity init
```

Follow the prompts:
- Choose "Create new project"
- Select your project name: "Lana Nolan Recruiting"
- Choose dataset: "production"
- Use existing schema: Yes

## 📱 What You'll See in the Admin Dashboard

### 🏠 Dashboard Overview
- **Player Profile**: Update personal info, stats, measurables
- **Videos**: Upload and manage highlight reels
- **Blog Posts**: Create news updates and achievements
- **Schedule**: Manage tournament and event calendar
- **Media Library**: Organize photos and documents

### 🎯 Key Features Available

#### Player Profile Management
- Personal information (name, class year, position)
- Athletic stats and measurables
- Academic information
- Contact details
- Scouting report and strengths

#### Video Gallery Management
- Upload video files or YouTube links
- Categorize videos (Hitting, Fielding, Pitching, etc.)
- Add descriptions and thumbnails
- Set featured videos

#### Blog/News Management
- Rich text editor for posts
- Add images and media
- SEO optimization fields
- Publish/draft status
- Categories and tags

#### Schedule Management
- Add tournaments and showcases
- Set dates and locations
- Mark coach attendance
- Add event details and results

## 🔐 User Permissions

### Admin Access (Full Control)
- Edit all content
- Manage media library
- Publish/unpublish content
- User management

### Editor Access (Content Only)
- Edit player profile
- Manage videos and blog posts
- Update schedule
- Cannot delete or manage users

## 📱 Mobile Admin Access

The Sanity Studio is mobile-responsive, so you can:
- Update content from your phone
- Upload photos directly from tournaments
- Publish blog posts on-the-go
- Manage schedule from anywhere

## 🆘 Quick Troubleshooting

### Can't Access Dashboard?
1. Make sure Sanity CLI is installed: `npm list -g @sanity/cli`
2. Check if the dev server is running: `npx sanity dev`
3. Verify your browser is pointing to: `http://localhost:3333`

### Login Issues?
1. Make sure you're logged into Sanity: `npx sanity login`
2. Check your project permissions in Sanity.io dashboard
3. Verify your API token has correct permissions

### Content Not Showing on Website?
1. Make sure content is published (not draft)
2. Check your environment variables are correct
3. Restart your Next.js development server

## 📞 Support

### Documentation
- Full setup guide: `SANITY-ADMIN-SETUP-GUIDE.md`
- Content management guide: `CONTENT-MANAGEMENT-GUIDE.md`
- Technical implementation: `ADMIN-PANEL-IMPLEMENTATION-PLAN.md`

### Quick Commands Reference
```bash
# Start admin dashboard
npx sanity dev

# Deploy admin dashboard online
npx sanity deploy

# Login to Sanity
npx sanity login

# Check project status
npx sanity status

# Install Sanity CLI globally
npm install -g @sanity/cli
```

---

**🎉 Once set up, you'll have a professional admin dashboard to manage all your recruiting content without touching any code!**