# PlayerProfile Master Task Tracker

Last updated: 2025-08-16T01:56:37Z

Purpose: Persistent checklist of work items and verification steps for the repo [playerprofile](README.md).

## Current Local Health Snapshot
- Repo branch: main, tracking origin/main, ahead/behind 0/0
- Local changes:
  - Modified: [playerprofile-website](playerprofile-website)
  - Deleted: [lananolan.com.code-workspace](lananolan.com.code-workspace)
  - Untracked: [playerprofile.com.code-workspace](playerprofile.com.code-workspace)
- Dev server renders at http://localhost:3000; API routes 200 OK

---

## High Priority Fixes (blocking clean production build)

- [ ] PWA icon 404 for /icon-192.png
  - Either add icons:
    - [ ] Provide [public/icon-192.png](playerprofile-website/public/icon-192.png)
    - [ ] Provide [public/icon-512.png](playerprofile-website/public/icon-512.png)
  - Or update manifest to reference existing assets:
    - [ ] Edit [public/manifest.json](playerprofile-website/public/manifest.json) to use [public/icon.svg](playerprofile-website/public/icon.svg)

- [ ] Next/Image "fill" parent positioning
  - [ ] Audit components using Image with fill and ensure parent has position: relative
  - Suspects to review first:
    - [ ] [src/components/sections/Hero.tsx](playerprofile-website/src/components/sections/Hero.tsx)
    - [ ] [src/components/sections/PlayerProfile.tsx](playerprofile-website/src/components/sections/PlayerProfile.tsx:72)

- [ ] ESLint errors to resolve
  - JSX unescaped quotes:
    - [ ] [src/app/admin/page.tsx:1825](playerprofile-website/src/app/admin/page.tsx:1825)
    - [ ] [src/app/admin/page.tsx:2075](playerprofile-website/src/app/admin/page.tsx:2075)
    - [ ] [src/app/admin/page.tsx:2153](playerprofile-website/src/app/admin/page.tsx:2153)
    - [ ] [src/app/admin/page.tsx:2231](playerprofile-website/src/app/admin/page.tsx:2231)
    - [ ] [src/components/sections/Contact.tsx:145](playerprofile-website/src/components/sections/Contact.tsx:145)
    - [ ] [src/components/sections/Contact.tsx:365](playerprofile-website/src/components/sections/Contact.tsx:365)
    - [ ] [src/components/sections/Schedule.tsx:464](playerprofile-website/src/components/sections/Schedule.tsx:464)
  - Unexpected any:
    - [ ] [src/app/api/admin/blog/route.ts:175](playerprofile-website/src/app/api/admin/blog/route.ts:175)
    - [ ] [src/app/api/admin/player/route.ts:9](playerprofile-website/src/app/api/admin/player/route.ts:9)
    - [ ] [src/app/api/admin/player/route.ts:14](playerprofile-website/src/app/api/admin/player/route.ts:14)
    - [ ] [src/app/api/admin/recruiting-packet/route.ts:11](playerprofile-website/src/app/api/admin/recruiting-packet/route.ts:11)
    - [ ] [src/app/api/admin/recruiting-packet/route.ts:59](playerprofile-website/src/app/api/admin/recruiting-packet/route.ts:59)
    - [ ] [src/app/api/admin/recruiting-packet/route.ts:86](playerprofile-website/src/app/api/admin/recruiting-packet/route.ts:86)
    - [ ] [src/app/api/admin/schedule/route.ts:10](playerprofile-website/src/app/api/admin/schedule/route.ts:10)
    - [ ] [src/app/api/admin/social/route.ts:152](playerprofile-website/src/app/api/admin/social/route.ts:152)
    - [ ] [src/lib/sanity.ts:14](playerprofile-website/src/lib/sanity.ts:14)
    - [ ] [src/utils/helpers.ts:125](playerprofile-website/src/utils/helpers.ts:125)
    - [ ] [src/utils/pdfGenerator.ts:67](playerprofile-website/src/utils/pdfGenerator.ts:67)
  - Unused imports/variables:
    - [ ] [src/app/admin/page.tsx:3](playerprofile-website/src/app/admin/page.tsx:3)
    - [ ] [src/app/admin/page.tsx:521](playerprofile-website/src/app/admin/page.tsx:521)
    - [ ] [src/components/sections/Blog.tsx:6](playerprofile-website/src/components/sections/Blog.tsx:6)
    - [ ] [src/components/sections/Blog.tsx:8](playerprofile-website/src/components/sections/Blog.tsx:8)
    - [ ] [src/components/sections/Schedule.tsx:31](playerprofile-website/src/components/sections/Schedule.tsx:31)
    - [ ] [src/components/sections/PlayerProfile.tsx:150](playerprofile-website/src/components/sections/PlayerProfile.tsx:150)
    - [ ] [src/components/ui/Calendar.tsx:115](playerprofile-website/src/components/ui/Calendar.tsx:115)
  - React hooks/exhaustive-deps:
    - [ ] [src/components/sections/Schedule.tsx:79](playerprofile-website/src/components/sections/Schedule.tsx:79)
  - next/no-img-element:
    - [ ] [src/components/layout/Footer.tsx:184](playerprofile-website/src/components/layout/Footer.tsx:184)
  - Empty interface:
    - [ ] [src/components/ui/Card.tsx:91](playerprofile-website/src/components/ui/Card.tsx:91)

---

## Git/Repo Housekeeping
- [ ] Decide workspace file transition:
  - [ ] Keep and commit [playerprofile.com.code-workspace](playerprofile.com.code-workspace)
  - [ ] Remove [lananolan.com.code-workspace](lananolan.com.code-workspace)
- Example commit sequence:
  - [ ] git add playerprofile.com.code-workspace
  - [ ] git rm lananolan.com.code-workspace
  - [ ] git commit -m "Replace workspace settings; lint fixes and PWA icons"

---

## Optional Improvements
- [ ] Add "engines" to [package.json](playerprofile-website/package.json) to document supported Node (e.g., ">=18")
- [ ] Consider narrow allow-list ESLint disables scoped to specific lines where external types are unknown
- [ ] Add pre-commit hook (lint-staged + husky) to enforce lint/format locally

---

## Verification Checklist (run after fixes)
- [ ] npm run lint passes with 0 errors
- [ ] npx tsc --noEmit passes with 0 errors
- [ ] npm run build finishes successfully
- [ ] Dev server shows no 404 for manifest icons and no Next/Image "fill" warnings

---

## Notes
- Remote verification intentionally deferred per request
- This file is intended to be the single source of truth for task tracking; update items and push with each change
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