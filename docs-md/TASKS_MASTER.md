# Project Master Task List

Repository: [lananolan-website](lananolan-website)
File: TASKS_MASTER.md (authoritative source of truth)
Last updated: 2025-08-15 23:15 UTC

**MANDATORY RESEARCH COMPLETED** ✅

**Local Codebase Analysis:**
- Examined existing admin API routes for social media and videos
- Found current implementation uses direct file writes without atomic operations
- Social media route: `src/app/api/admin/social/route.ts` - uses `writeFile` directly
- Videos route: `src/app/api/admin/videos/route.ts` - uses `fs.writeFile` directly  
- Other routes (schedule, player, blog, photos) already implement atomic writes with temp file pattern
- Schedule component uses 30-second polling interval for production
- README.md lacks environment variable documentation for ADMIN_TOKEN and NEXT_PUBLIC_ADMIN_TOKEN
- Admin dashboard has comprehensive UI for managing player profile, social media, and content

**Internet Research (2025):**
- No external research required for this task as it involves internal codebase improvements
- All patterns and implementations are already established in the existing codebase

**Synthesis & Recommendation:**
- Create 8 separate tasks to address all pending items systematically
- Follow existing atomic write patterns from schedule/player/blog/photos routes
- Maintain consistency with current codebase architecture and patterns

**TODO2 TASKS CREATED:**

1. **T-1: Add atomic writes to admin social route**
   - Implement temp file pattern for atomic writes in `src/app/api/admin/social/route.ts`
   - Follow existing pattern from schedule/player/blog/photos routes
   - Add proper error handling and validation

2. **T-2: Add atomic writes to admin videos route**  
   - Implement temp file pattern for atomic writes in `src/app/api/admin/videos/route.ts`
   - Follow existing pattern from other admin routes
   - Add proper error handling and validation

3. **T-3: Document environment setup for ADMIN_TOKEN and NEXT_PUBLIC_ADMIN_TOKEN**
   - Update `README.md` with environment variable documentation
   - Include setup instructions and security considerations
   - Add to deployment checklist

4. **T-4: Adjust public schedule polling interval for production**
   - Modify polling interval in `src/components/sections/Schedule.tsx`
   - Change from 30 seconds to appropriate production interval
   - Consider performance and server load implications

5. **T-5: Add server-side redirect guard for /admin based on admin_token**
   - Implement optional middleware protection in `src/middleware.ts`
   - Add redirect logic for unauthorized access attempts
   - Maintain existing functionality while adding security layer

6. **T-6: Plan migration from JSON storage to Sanity**
   - Analyze current JSON data structure in `sanity/schema.ts`
   - Create migration plan and data mapping strategy
   - Document migration steps and considerations

7. **T-7: Admin Twitter/X credentials and auto-post on blog publish**
   - Add credential management to admin UI in `src/app/admin/page.tsx`
   - Implement auto-posting functionality in social and blog routes
   - Update documentation with setup instructions

8. **T-8: Add Height field to Player Profile (Admin + public)**
   - Add height input to admin dashboard in `src/app/admin/page.tsx`
   - Display height in public player profile in `src/components/sections/PlayerProfile.tsx`
   - Update data structure and validation

9. **T-9: Admin social media management (add/remove platforms)**
   - Enhance admin UI for social media platform management
   - Add dynamic platform selection (Facebook, Twitter/X, Instagram, Website)
   - Update data structure and validation

10. **T-10: PDF player recruitment package upload feature**
    - Add PDF upload functionality to admin dashboard
    - Implement optional public download link in player profile
    - Add file management and storage considerations

How to use
- This file is the version-controlled master task list for this project.
- The assistant’s session TODO list mirrors this file; if they diverge, this file is the source of truth.
- Update by editing this file or instructing the assistant to update and commit it.

Completed
- [x] Split public read-only APIs and update public UI to use them:
  [src/app/api/schedule/route.ts](lananolan-website/src/app/api/schedule/route.ts),
  [src/app/api/player/route.ts](lananolan-website/src/app/api/player/route.ts),
  [src/app/api/photos/route.ts](lananolan-website/src/app/api/photos/route.ts),
  [src/app/api/videos/route.ts](lananolan-website/src/app/api/videos/route.ts),
  [components/sections/Schedule.tsx](lananolan-website/src/components/sections/Schedule.tsx),
  [components/layout/Header.tsx](lananolan-website/src/components/layout/Header.tsx),
  [components/sections/Hero.tsx](lananolan-website/src/components/sections/Hero.tsx),
  [components/sections/PlayerProfile.tsx](lananolan-website/src/components/sections/PlayerProfile.tsx),
  [components/sections/VideoGallery.tsx](lananolan-website/src/components/sections/VideoGallery.tsx)
- [x] Protect /api/admin/* with middleware token:
  [src/middleware.ts](lananolan-website/src/middleware.ts)
- [x] Add Authorization wrapper and admin_token cookie in Admin UI:
  [src/app/admin/page.tsx](lananolan-website/src/app/admin/page.tsx)
- [x] Pin admin routes to Node runtime for fs access:
  [src/app/api/admin/blog/route.ts](lananolan-website/src/app/api/admin/blog/route.ts),
  [src/app/api/admin/player/route.ts](lananolan-website/src/app/api/admin/player/route.ts),
  [src/app/api/admin/photos/route.ts](lananolan-website/src/app/api/admin/photos/route.ts),
  [src/app/api/admin/schedule/route.ts](lananolan-website/src/app/api/admin/schedule/route.ts),
  [src/app/api/admin/social/route.ts](lananolan-website/src/app/api/admin/social/route.ts),
  [src/app/api/admin/videos/route.ts](lananolan-website/src/app/api/admin/videos/route.ts)
- [x] Add atomic writes + basic validation for schedule, player, blog, photos:
  [src/app/api/admin/schedule/route.ts](lananolan-website/src/app/api/admin/schedule/route.ts),
  [src/app/api/admin/player/route.ts](lananolan-website/src/app/api/admin/player/route.ts),
  [src/app/api/admin/blog/route.ts](lananolan-website/src/app/api/admin/blog/route.ts),
  [src/app/api/admin/photos/route.ts](lananolan-website/src/app/api/admin/photos/route.ts)
- [x] Admin: Team Information inputs for socials and Team Profile Hub (HS + Travel), persist and render:
  [src/app/admin/page.tsx](lananolan-website/src/app/admin/page.tsx),
  [components/sections/PlayerProfile.tsx](lananolan-website/src/components/sections/PlayerProfile.tsx),
  [src/data/player-profile.json](lananolan-website/src/data/player-profile.json)
- [x] Public: Render new Instagram and Website links (HS + Travel):
  [components/sections/PlayerProfile.tsx](lananolan-website/src/components/sections/PlayerProfile.tsx)
- [x] Add atomic writes to admin social/videos routes:
  [src/app/api/admin/social/route.ts](lananolan-website/src/app/api/admin/social/route.ts),
  [src/app/api/admin/videos/route.ts](lananolan-website/src/app/api/admin/videos/route.ts)
- [x] Document environment setup for ADMIN_TOKEN and NEXT_PUBLIC_ADMIN_TOKEN:
  [README.md](README.md),
  [README.md](lananolan-website/README.md),
  [DEPLOYMENT-CHECKLIST.md](lananolan-website/DEPLOYMENT-CHECKLIST.md)
- [x] Adjust public schedule polling interval for production:
  [components/sections/Schedule.tsx](lananolan-website/src/components/sections/Schedule.tsx)
- [x] Optional: Add server-side redirect guard for /admin based on admin_token:
  [src/middleware.ts](lananolan-website/src/middleware.ts)
- [x] Optional: Plan migration from JSON storage to Sanity:
  [sanity/schema.ts](lananolan-website/sanity/schema.ts),
  [SANITY-MIGRATION-PLAN.md](SANITY-MIGRATION-PLAN.md)
- [x] Admin: Manage Twitter/X credentials and auto-post on blog publish:
  [src/app/admin/page.tsx](lananolan-website/src/app/admin/page.tsx),
  [src/app/api/admin/social/route.ts](lananolan-website/src/app/api/admin/social/route.ts),
  [src/app/api/admin/blog/route.ts](lananolan-website/src/app/api/admin/blog/route.ts),
  [README.md](lananolan-website/README.md)
- [x] Add Height under Personal Information (Admin + public):
  [src/app/admin/page.tsx](lananolan-website/src/app/admin/page.tsx),
  [components/sections/PlayerProfile.tsx](lananolan-website/src/components/sections/PlayerProfile.tsx)
- [x] Provide a location to upload a PDF player recruitment package under Player Profile (Admin upload UI; optional public download link):
  [src/app/api/admin/recruiting-packet/route.ts](lananolan-website/src/app/api/admin/recruiting-packet/route.ts),
  [src/app/admin/page.tsx](lananolan-website/src/app/admin/page.tsx),
  [components/sections/PlayerProfile.tsx](lananolan-website/src/components/sections/PlayerProfile.tsx)

Pending
- [ ] None

Notes
- Keep this file in sync with in-session task updates. When tasks are completed, move them from Pending to Completed here.
- For any new feature or refactor, add a clear, actionable item under Pending with affected file links.
- Deployment or environment instructions should live in [README.md](README.md) and be referenced here when relevant.