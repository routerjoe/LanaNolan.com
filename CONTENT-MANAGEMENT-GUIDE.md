# 📝 Content Management Guide - Lana Nolan Recruiting Website

## 🎯 Overview

The Lana Nolan recruiting website uses a **JSON-based content management system** that allows easy updates without requiring technical knowledge. All content is stored in structured JSON files that automatically update the website when changes are made.

## 📁 Content Files Location

All content files are located in: `lananolan-website/src/data/`

- **`player-profile.json`** - Player information, stats, videos, and references
- **`schedule.json`** - Tournament schedule and events
- **`blog-posts.json`** - News, updates, and blog content

## 🔄 How Content Management Works

### **Simple 3-Step Process:**
1. **Edit** the JSON file with new information
2. **Commit** changes to Git repository
3. **Deploy** automatically updates the live website

---

## 📊 Player Profile Management

### File: `player-profile.json`

#### **Personal Information**
```json
"personalInfo": {
  "name": "Lana Nolan",
  "graduationYear": 2027,
  "email": "lananolan08@gmail.com",
  "socialMedia": {
    "twitter": "https://x.com/LanaNolan02",
    "email": "lananolan08@gmail.com"
  }
}
```

#### **Athletic Information**
```json
"athletics": {
  "primaryPosition": "Shortstop",
  "secondaryPositions": ["Second Base", "Outfield"],
  "battingThrows": "R",
  "hometown": "Charleston, SC",
  "highSchool": {
    "name": "Charleston High School",
    "coach": "Coach Smith",
    "contact": "coach.smith@charleston.edu"
  },
  "travelTeam": {
    "name": "SC Elite Softball",
    "coach": "Coach Johnson",
    "contact": "coach@scelite.com"
  }
}
```

#### **Performance Measurables**
```json
"measurables": [
  {
    "metric": "Exit Velocity",
    "value": "78 mph",
    "date": "2024-12-15",
    "notes": "Measured at winter showcase"
  }
]
```

**Available Metrics:**
- Exit Velocity (mph)
- Throwing Velocity (mph)
- Pop Time (seconds)
- Home to First (seconds)
- 60-Yard Dash (seconds)
- Vertical Jump (inches)

#### **Video Management**
```json
"videos": [
  {
    "id": "hitting-2024-winter",
    "title": "Winter Hitting Highlights",
    "description": "Recent batting practice and game at-bats",
    "url": "https://hudl.com/video/12345",
    "thumbnail": "/images/video-thumb-hitting.jpg",
    "category": "hitting",
    "duration": 90,
    "date": "2024-12-01",
    "featured": true
  }
]
```

**Video Categories:**
- `hitting` - Batting highlights
- `fielding` - Defensive plays
- `game` - Game situations
- `training` - Skills training

#### **Scouting Report**
```json
"scoutingReport": {
  "strengths": [
    "Excellent bat speed",
    "Strong defensive instincts",
    "High baseball IQ"
  ],
  "development": [
    "Power development",
    "Arm strength enhancement"
  ],
  "intangibles": [
    "Natural leadership",
    "Coachable attitude",
    "Team-first mentality"
  ]
}
```

---

## 📅 Schedule Management

### File: `schedule.json`

#### **Adding New Events**
```json
{
  "id": "spring-showcase-2025",
  "title": "Spring Elite Showcase",
  "date": "2025-04-15T09:00:00.000Z",
  "endDate": "2025-04-15T17:00:00.000Z",
  "location": "Myrtle Beach, SC",
  "type": "showcase",
  "description": "Elite showcase with 50+ college coaches",
  "contactInfo": "info@eliteshowcase.com",
  "isAvailable": true,
  "venue": "Grand Park Sports Complex",
  "cost": "$200",
  "website": "https://eliteshowcase.com"
}
```

**Event Types:**
- `tournament` - Competitive tournaments
- `showcase` - Individual skills showcases
- `camp` - Training camps
- `visit` - Campus visits
- `game` - Regular season games

**Important Fields:**
- `isAvailable: true` - Coaches can attend
- `isAvailable: false` - Private/restricted event
- `date` - Use ISO format: `YYYY-MM-DDTHH:mm:ss.000Z`

---

## 📰 Blog/News Management

### File: `blog-posts.json`

#### **Adding New Blog Posts**
```json
{
  "id": "tournament-success-march-2025",
  "title": "Outstanding Performance at Spring Tournament",
  "slug": "tournament-success-march-2025",
  "excerpt": "Highlights from an exceptional tournament performance with multiple college coaches in attendance.",
  "content": "The Spring Elite Tournament was a tremendous success with standout performances both offensively and defensively. Connected with several college coaches and received positive feedback on development progress.",
  "publishedAt": "2025-03-20T14:00:00.000Z",
  "updatedAt": "2025-03-20T14:00:00.000Z",
  "category": "tournament",
  "tags": ["tournament", "performance", "recruiting"],
  "featured": true,
  "image": "/images/blog/spring-tournament-2025.jpg"
}
```

**Blog Categories:**
- `tournament` - Tournament updates
- `achievement` - Awards and recognition
- `recruiting` - Recruiting journey updates
- `training` - Training and development

**Content Guidelines:**
- Keep excerpts under 150 characters
- Use professional, positive tone
- Include relevant recruiting keywords
- Set `featured: true` for important posts

---

## 🖼️ Image Management

### **Image Locations:**
- **Blog images**: `/public/images/blog/`
- **Video thumbnails**: `/public/images/videos/`
- **General images**: `/public/images/`

### **Image Requirements:**
- **Format**: JPG or PNG
- **Blog images**: 1200x630px (optimal for social sharing)
- **Video thumbnails**: 640x360px (16:9 aspect ratio)
- **File size**: Under 500KB for fast loading

### **Naming Convention:**
- Use descriptive, lowercase names
- Separate words with hyphens
- Include date for blog images: `spring-tournament-2025-03-20.jpg`

---

## 🔄 Update Workflow

### **For Regular Updates:**

1. **Edit JSON Files**
   - Open the appropriate JSON file
   - Make your changes following the format examples
   - Save the file

2. **Commit Changes**
   ```bash
   git add .
   git commit -m "Update: Add new tournament results and stats"
   git push origin main
   ```

3. **Automatic Deployment**
   - Vercel automatically deploys changes
   - Website updates within 2-3 minutes
   - Check the live site to verify changes

### **For Major Updates:**
- Test changes locally first: `npm run dev`
- Preview at `http://localhost:3000`
- Commit and push when satisfied

---

## 📋 Content Update Checklist

### **Monthly Updates:**
- [ ] Update performance measurables with latest stats
- [ ] Add new tournament/showcase events to schedule
- [ ] Create blog post about recent achievements
- [ ] Update video gallery with new highlights
- [ ] Review and update scouting report if needed

### **After Each Tournament:**
- [ ] Add tournament results to blog
- [ ] Update any new measurable improvements
- [ ] Add new video highlights if available
- [ ] Update schedule with upcoming events

### **Recruiting Season Updates:**
- [ ] Update contact information if changed
- [ ] Add new coach references
- [ ] Update academic achievements
- [ ] Refresh featured videos with recent content

---

## 🚨 Important Notes

### **Data Validation:**
- Always use proper JSON format (check for missing commas, brackets)
- Test locally before pushing to production
- Keep backup copies of working versions

### **SEO Best Practices:**
- Use recruiting keywords in blog content
- Keep titles under 60 characters
- Write compelling meta descriptions
- Include location-based keywords

### **Coach Communication:**
- Update schedule availability promptly
- Keep contact information current
- Respond to inquiries within 24 hours (as promised on site)

---

## 🛠️ Technical Support

### **Common Issues:**

**JSON Format Errors:**
- Use online JSON validator: https://jsonlint.com/
- Check for missing commas, quotes, or brackets
- Ensure proper date format: `YYYY-MM-DDTHH:mm:ss.000Z`

**Images Not Displaying:**
- Verify file path matches JSON reference
- Check image file size (under 500KB)
- Ensure proper file permissions

**Website Not Updating:**
- Check Git commit was successful
- Verify Vercel deployment status
- Clear browser cache and refresh

### **Getting Help:**
- Check the GitHub repository for issues
- Review commit history for recent changes
- Contact technical support if needed

---

## 📈 Analytics & Performance

### **Content Performance Tracking:**
- Monitor which blog posts get the most engagement
- Track video view statistics
- Review contact form submissions
- Analyze coach inquiry patterns

### **Optimization Tips:**
- Keep content fresh with regular updates
- Use high-quality, professional images
- Maintain consistent posting schedule
- Focus on recruiting-relevant content

---

*This guide ensures the Lana Nolan recruiting website stays current, professional, and effective for college recruiting success.*