> History rewrite in progress (removing all references to "playerprofile-website" and "lananolan.com" across files and commit messages; renaming path to [playerprofile-website](playerprofile-website) across entire history). A backup branch will be created locally (backup/pre-rewrite-YYYYMMDDHHMMSS) and origin/main will be force-pushed when finished.


- CI/Deploy (Render):
  - [ ] Service root updated in [render.yaml](render.yaml:1) to playerprofile-website (Blueprint)
  - [ ] If using existing Render service (manual), ensure Root Directory is playerprofile-website
- Tags/PRs:
  - [ ] Any open PRs must be rebased onto the rewritten main (or closed/reopened)
  - [ ] If you have tags pointing to old history, re-create them if needed



Last updated: 2025-08-16T13:26:25Z

Purpose: Persistent checklist of work items and verification steps for the repo [playerprofile](README.md).



---

## High Priority Fixes (blocking clean production build)

- [x] React hydration error in PlayerProfile section
  - [x] Reproduce and capture console logs on initial page load
  - [x] Audit SSR/CSR divergence around the MapPin/icon block in [src/components/sections/PlayerProfile.tsx:259](playerprofile-website/src/components/sections/PlayerProfile.tsx:259) and surrounding motion wrappers
  - [x] Ensure identical markup/element types server vs client (avoid conditional p/div swaps; keep structure stable when data is missing)
  - [x] Eliminate non-determinism in render paths (no Date.now(), Math.random(), or locale-variant formatting on server; snapshot external data or provide deterministic defaults)
  - [x] Framer Motion: stabilize props for SSR (consider initial={false} or gate animations to client via useEffect to avoid server/client prop mismatches)
  - [x] Validate no invalid HTML nesting in the affected subtree
  - [x] Confirm fix in dev and production (no hydration warnings)

- [ ] Admin Dashboard input handler runtime error
  - [ ] Reproduce error and capture stack trace within AdminDashboard
  - [ ] Inspect the input change handler near [src/app/admin/page.tsx:2644](playerprofile-website/src/app/admin/page.tsx:2644) within [AdminDashboard](playerprofile-website/src/app/admin/page.tsx:2561)
  - [ ] Verify the attribute is correctly spelled as onChange (no stray "ge" fragments) and bound to a stable callback
  - [ ] Ensure inputs are controlled with valid "value" and "onChange" wiring; guard against undefined/null during state updates
  - [ ] Validate proper event typing/usage and no destructuring that yields undefined at runtime
  - [ ] Confirm fix by exercising the form; no console errors and values persist/save as expected

- [x] PWA icon 404 for /icon-192.png
 
  - Update manifest to reference existing assets:
    - [x] Edit [public/manifest.json](playerprofile-website/public/manifest.json) to use [public/icon.svg](playerprofile-website/public/icon.svg)

- [ ] Next/Image "fill" parent positioning
  - [ ] Audit components using Image with fill and ensure parent has position: relative
  - Suspects to review first:
    - [x] [src/components/sections/Hero.tsx](playerprofile-website/src/components/sections/Hero.tsx)
    - [ ] [src/components/sections/PlayerProfile.tsx](playerprofile-website/src/components/sections/PlayerProfile.tsx:72)

- [ ] ESLint errors to resolve
  - JSX unescaped quotes:
    - [x] [src/app/admin/page.tsx:1825](playerprofile-website/src/app/admin/page.tsx:1825)
    - [x] [src/app/admin/page.tsx:2075](playerprofile-website/src/app/admin/page.tsx:2075)
    - [x] [src/app/admin/page.tsx:2153](playerprofile-website/src/app/admin/page.tsx:2153)
    - [x] [src/app/admin/page.tsx:2231](playerprofile-website/src/app/admin/page.tsx:2231)
    - [x] [src/components/sections/Contact.tsx:145](playerprofile-website/src/components/sections/Contact.tsx:145)
    - [x] [src/components/sections/Contact.tsx:365](playerprofile-website/src/components/sections/Contact.tsx:365)
    - [x] [src/components/sections/Schedule.tsx:464](playerprofile-website/src/components/sections/Schedule.tsx:464)
  - Unexpected any:
    - [x] [src/app/api/admin/blog/route.ts:175](playerprofile-website/src/app/api/admin/blog/route.ts:175)
    - [x] [src/app/api/admin/player/route.ts:9](playerprofile-website/src/app/api/admin/player/route.ts:9)
    - [x] [src/app/api/admin/player/route.ts:14](playerprofile-website/src/app/api/admin/player/route.ts:14)
    - [x] [src/app/api/admin/recruiting-packet/route.ts:11](playerprofile-website/src/app/api/admin/recruiting-packet/route.ts:11)
    - [x] [src/app/api/admin/recruiting-packet/route.ts:59](playerprofile-website/src/app/api/admin/recruiting-packet/route.ts:59)
    - [x] [src/app/api/admin/recruiting-packet/route.ts:86](playerprofile-website/src/app/api/admin/recruiting-packet/route.ts:86)
    - [x] [src/app/api/admin/schedule/route.ts:10](playerprofile-website/src/app/api/admin/schedule/route.ts:10)
    - [x] [src/app/api/admin/social/route.ts:152](playerprofile-website/src/app/api/admin/social/route.ts:152)
    - [x] [src/lib/sanity.ts:14](playerprofile-website/src/lib/sanity.ts:14)
    - [x] [src/utils/helpers.ts:125](playerprofile-website/src/utils/helpers.ts:125)
    - [x] [src/utils/pdfGenerator.ts:67](playerprofile-website/src/utils/pdfGenerator.ts:67)
  - Unused imports/variables:
    - [x] [src/app/admin/page.tsx:3](playerprofile-website/src/app/admin/page.tsx:3)
    - [x] [src/app/admin/page.tsx:521](playerprofile-website/src/app/admin/page.tsx:521)
    - [x] [src/components/sections/Blog.tsx:6](playerprofile-website/src/components/sections/Blog.tsx:6)
    - [x] [src/components/sections/Blog.tsx:8](playerprofile-website/src/components/sections/Blog.tsx:8)
    - [x] [src/components/sections/Schedule.tsx:31](playerprofile-website/src/components/sections/Schedule.tsx:31)
    - [x] [src/components/sections/PlayerProfile.tsx:150](playerprofile-website/src/components/sections/PlayerProfile.tsx:150)
    - [x] [src/components/ui/Calendar.tsx:115](playerprofile-website/src/components/ui/Calendar.tsx:115)
  - React hooks/exhaustive-deps:
    - [x] [src/components/sections/Schedule.tsx:79](playerprofile-website/src/components/sections/Schedule.tsx:79)
    - [x] Stabilize resize effect dependencies to avoid false positive (completed) [src/components/sections/Schedule.tsx](playerprofile-website/src/components/sections/Schedule.tsx:106)
  - next/no-img-element:
    - [x] [src/components/layout/Footer.tsx:184](playerprofile-website/src/components/layout/Footer.tsx:184)
  - Empty interface:
    - [x] [src/components/ui/Card.tsx:91](playerprofile-website/src/components/ui/Card.tsx:91)

---

## Optional Improvements
- [ ] Add "engines" to [package.json](playerprofile-website/package.json) to document supported Node (e.g., ">=18")
- [ ] Consider narrow allow-list ESLint disables scoped to specific lines where external types are unknown
- [ ] Add pre-commit hook (lint-staged + husky) to enforce lint/format locally

---

## Verification Checklist (run after fixes)
- [x] npm run lint passes with 0 errors
- [x] npx tsc --noEmit passes with 0 errors
- [ ] npm run build finishes successfully
- [ ] Dev server shows no 404 for manifest icons and no Next/Image "fill" warnings

---

## Notes
- Remote verification intentionally deferred per request
- This file is intended to be the single source of truth for task tracking; update items and push with each change

## Player Dashboard and Site Content Updates (requested 2025-08-16)
- [x] Rename "Admin Dashboard" to "Player Dashboard" across UI and any routes/labels
- [ ] Make the name at the top of the main site editable via Player Dashboard
  - [ ] Add fields: Player First Name, Player Last Name
  - [ ] Wire these fields to display on the public site header/hero
- [ ] Personal Information section
  - [ ] Add "Height" field; editable via Player Dashboard
  - [ ] Move "Position" into Personal Information
    - [ ] Add Primary Position and Secondary Position fields
    - [ ] Display positions using the existing green bubble/chip style
    - [ ] Ensure both are editable via Player Dashboard
- [ ] Quick Stats
  - [ ] Make Quick Stats editable via Player Dashboard
- [ ] Latest Achievements
  - [ ] Remove social media links from this section
- [ ] Profile narrative fields
  - [ ] Ensure "Strength", "Development", and "Intangibles" are editable via Player Dashboard and updates persist to and display on the public site
- [ ] Videos
  - [ ] Remove "More video available" section from the site
- [ ] Calendar updates
  - [ ] Remove the "game" option from the displayed calendar
  - [ ] Use different colors for "Tournament" vs "Showcase(s)" events
  - [ ] Make List view the default calendar view
- [ ] Typography/contrast
  - [ ] Darken the text shade for "Schedule and Events" and similar headings to match Player Dashboard legibility
- [x] Academics
-   [x] Remove the Academic section for now
- [ ] Quick Action section
  - [ ] Remove "Schedule a call" and "Video library" links
  - [ ] Add Twitter QR code in Quick Action and remove it from the bottom of the page
  - [ ] Remove the "Quick Response Guarantee" section
- [x] Footer
- [x] Change to "© 2025 Player Profile Hub. All rights reserved"
- [ ] Player Dashboard UX
  - [ ] Add a Save button to each section
  - [ ] After save, show confirmation and ensure updates reflect on the public site

## Render Deployment Plan (decision)

Decision: Keep the app in the subfolder [playerprofile-website](playerprofile-website) and deploy to Render using the blueprint [render.yaml](render.yaml) with rootDir set to the subdirectory. This avoids churn and is first-class supported on Render.

### One-time Render setup
- [ ] Push latest commits to origin (required for Render to see changes)
  - [ ] git push origin main
- [ ] Create the service via Blueprint:
  - In Render dashboard: New → Blueprint → Connect the GitHub repo
  - Confirm the blueprint picks up:
    - name: playerprofile-website
    - env: node
    - rootDir: playerprofile-website
    - buildCommand: npm install &amp;&amp; npm run build
    - startCommand: npm start
- [ ] Alternatively (no blueprint): New → Web Service → Connect repo
  - [ ] Root Directory: playerprofile-website
  - [ ] Build Command: npm install &amp;&amp; npm run build
  - [ ] Start Command: npm start
  - [ ] Environment: Node

### Environment variables on Render
- [ ] ADMIN_TOKEN = strong-random-token
- [ ] NEXT_PUBLIC_ADMIN_TOKEN = same-strong-random-token
- [ ] NEXT_PUBLIC_SITE_URL = https://your-domain.com
- [ ] (Optional) NEXT_PUBLIC_SCHEDULE_POLL_INTERVAL_MS = 300000
- [ ] (Optional) ADMIN_GUARD_REDIRECT = true

### Node version (Render)
- [ ] Ensure Node 18 or 20 on Render
  - Preferred: Add engines in [package.json](playerprofile-website/package.json) → "engines": {"node": "20.x"}
  - Or set “Node Version” to 20 in Render service settings

### Post-deploy verification (Render)
- [ ] Service status: Healthy (green)
- [ ] App loads at the Render URL
- [ ] No 404 for manifest icons (from PWA icon task)
- [ ] No Next/Image “fill” parent warnings in console
- [ ] Admin routes return 200 when authorized; public APIs return 200
- [ ] Vitals: initial TTFB/LCP acceptable
- [ ] If using custom domain: connect domain → wait for DNS/SSL → verify

### Optional naming tidy-up (defer)
- [ ] Optionally rename folder to playerprofile-website later:
  - git mv playerprofile-website playerprofile-website
  - Update [render.yaml](render.yaml): rootDir: playerprofile-website
  - Update docs/links accordingly

---

## New Tasks: Player Dashboard - Master Task Additions (2025-08-16)

- [ ] Bug: Position does not update after save
  - [ ] Reproduce in [src/app/admin/page.tsx](playerprofile-website/src/app/admin/page.tsx)
  - [ ] Verify persistence via [src/app/api/admin/player/route.ts](playerprofile-website/src/app/api/admin/player/route.ts)
  - [ ] Ensure public render in [src/components/sections/PlayerProfile.tsx](playerprofile-website/src/components/sections/PlayerProfile.tsx) reflects saved values after refresh
  - [ ] Show confirmation after successful save

- [x] Recruiting Package - PDF management
  - [x] Implement upload of PDF
    - [x] Backend: handler/validation in [src/app/api/admin/recruiting-packet/route.ts](playerprofile-website/src/app/api/admin/recruiting-packet/route.ts)
    - [x] Frontend: upload UI in [src/app/admin/page.tsx](playerprofile-website/src/app/admin/page.tsx)
  - [x] Implement preview of uploaded PDF
    - [x] Serve/view from [public/uploads/pdfs/](playerprofile-website/public/uploads/pdfs)
  - [x] Implement delete of previously uploaded PDF
    - [x] Backend: delete endpoint in [src/app/api/admin/recruiting-packet/route.ts](playerprofile-website/src/app/api/admin/recruiting-packet/route.ts)
    - [x] Frontend: delete action with confirm in [src/app/admin/page.tsx](playerprofile-website/src/app/admin/page.tsx)
  - [x] Verification: upload → preview → delete flows work; files appear/remove under [public/uploads/pdfs/](playerprofile-website/public/uploads/pdfs)

- [ ] Blog updates
  - [ ] Add timestamp field for scheduled posting in Admin and persist via [src/app/api/admin/blog/route.ts](playerprofile-website/src/app/api/admin/blog/route.ts)
  - [ ] Add photo upload to blog post (store under [public/uploads/](playerprofile-website/public/uploads))
  - [ ] Add Save button to blog post editor with success confirmation
  - [x] New posts display at the top after save/publish
  - [ ] Show previous blog posts in a condensed list with status:
    - [ ] published, scheduled, scheduled time, "post on X" toggle state
  - [ ] Verify publish shows post on public site [src/components/sections/Blog.tsx](playerprofile-website/src/components/sections/Blog.tsx)
  - [ ] Verify "post on X/Twitter" sends when toggle is ON via [src/app/api/admin/social/route.ts](playerprofile-website/src/app/api/admin/social/route.ts)

- [ ] Calendar updates
  - [ ] List already-published events with key info in Admin
  - [x] New calendar event shows at the top after creation
  - [ ] Add Save button for event creation; verify public site [src/components/sections/Schedule.tsx](playerprofile-website/src/components/sections/Schedule.tsx) updates
  - [ ] Add Delete/Remove button for events; include in list view
  - [ ] Remove "coach attendance" from calendar events payload/UI
  - [ ] Persist/serve via [src/app/api/admin/schedule/route.ts](playerprofile-website/src/app/api/admin/schedule/route.ts)

- [ ] Photos updates
  - [ ] Enable deleting photos in Admin via [src/app/api/admin/photos/route.ts](playerprofile-website/src/app/api/admin/photos/route.ts)
  - [ ] Fix: selecting photos for different parts of the website currently does nothing; ensure selection saves and reflects on public pages
  - [ ] Verify public site consumption of photo selections
