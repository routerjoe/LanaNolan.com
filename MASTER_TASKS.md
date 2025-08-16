# PlayerProfile Master Task Tracker

Last updated: 2025-08-16T01:56:37Z

Purpose: Persistent checklist of work items and verification steps for the repo [playerprofile](README.md).

## Current Local Health Snapshot
- Repo branch: main, tracking origin/main, ahead/behind 0/0
- Local changes:
  - Modified: [lananolan-website](lananolan-website)
  - Deleted: [lananolan.com.code-workspace](lananolan.com.code-workspace)
  - Untracked: [playerprofile.com.code-workspace](playerprofile.com.code-workspace)
- Dev server renders at http://localhost:3000; API routes 200 OK

---

## High Priority Fixes (blocking clean production build)

- [ ] PWA icon 404 for /icon-192.png
  - Either add icons:
    - [ ] Provide [public/icon-192.png](lananolan-website/public/icon-192.png)
    - [ ] Provide [public/icon-512.png](lananolan-website/public/icon-512.png)
  - Or update manifest to reference existing assets:
    - [ ] Edit [public/manifest.json](lananolan-website/public/manifest.json) to use [public/icon.svg](lananolan-website/public/icon.svg)

- [ ] Next/Image "fill" parent positioning
  - [ ] Audit components using Image with fill and ensure parent has position: relative
  - Suspects to review first:
    - [ ] [src/components/sections/Hero.tsx](lananolan-website/src/components/sections/Hero.tsx)
    - [ ] [src/components/sections/PlayerProfile.tsx](lananolan-website/src/components/sections/PlayerProfile.tsx:72)

- [ ] ESLint errors to resolve
  - JSX unescaped quotes:
    - [ ] [src/app/admin/page.tsx:1825](lananolan-website/src/app/admin/page.tsx:1825)
    - [ ] [src/app/admin/page.tsx:2075](lananolan-website/src/app/admin/page.tsx:2075)
    - [ ] [src/app/admin/page.tsx:2153](lananolan-website/src/app/admin/page.tsx:2153)
    - [ ] [src/app/admin/page.tsx:2231](lananolan-website/src/app/admin/page.tsx:2231)
    - [ ] [src/components/sections/Contact.tsx:145](lananolan-website/src/components/sections/Contact.tsx:145)
    - [ ] [src/components/sections/Contact.tsx:365](lananolan-website/src/components/sections/Contact.tsx:365)
    - [ ] [src/components/sections/Schedule.tsx:464](lananolan-website/src/components/sections/Schedule.tsx:464)
  - Unexpected any:
    - [ ] [src/app/api/admin/blog/route.ts:175](lananolan-website/src/app/api/admin/blog/route.ts:175)
    - [ ] [src/app/api/admin/player/route.ts:9](lananolan-website/src/app/api/admin/player/route.ts:9)
    - [ ] [src/app/api/admin/player/route.ts:14](lananolan-website/src/app/api/admin/player/route.ts:14)
    - [ ] [src/app/api/admin/recruiting-packet/route.ts:11](lananolan-website/src/app/api/admin/recruiting-packet/route.ts:11)
    - [ ] [src/app/api/admin/recruiting-packet/route.ts:59](lananolan-website/src/app/api/admin/recruiting-packet/route.ts:59)
    - [ ] [src/app/api/admin/recruiting-packet/route.ts:86](lananolan-website/src/app/api/admin/recruiting-packet/route.ts:86)
    - [ ] [src/app/api/admin/schedule/route.ts:10](lananolan-website/src/app/api/admin/schedule/route.ts:10)
    - [ ] [src/app/api/admin/social/route.ts:152](lananolan-website/src/app/api/admin/social/route.ts:152)
    - [ ] [src/lib/sanity.ts:14](lananolan-website/src/lib/sanity.ts:14)
    - [ ] [src/utils/helpers.ts:125](lananolan-website/src/utils/helpers.ts:125)
    - [ ] [src/utils/pdfGenerator.ts:67](lananolan-website/src/utils/pdfGenerator.ts:67)
  - Unused imports/variables:
    - [ ] [src/app/admin/page.tsx:3](lananolan-website/src/app/admin/page.tsx:3)
    - [ ] [src/app/admin/page.tsx:521](lananolan-website/src/app/admin/page.tsx:521)
    - [ ] [src/components/sections/Blog.tsx:6](lananolan-website/src/components/sections/Blog.tsx:6)
    - [ ] [src/components/sections/Blog.tsx:8](lananolan-website/src/components/sections/Blog.tsx:8)
    - [ ] [src/components/sections/Schedule.tsx:31](lananolan-website/src/components/sections/Schedule.tsx:31)
    - [ ] [src/components/sections/PlayerProfile.tsx:150](lananolan-website/src/components/sections/PlayerProfile.tsx:150)
    - [ ] [src/components/ui/Calendar.tsx:115](lananolan-website/src/components/ui/Calendar.tsx:115)
  - React hooks/exhaustive-deps:
    - [ ] [src/components/sections/Schedule.tsx:79](lananolan-website/src/components/sections/Schedule.tsx:79)
  - next/no-img-element:
    - [ ] [src/components/layout/Footer.tsx:184](lananolan-website/src/components/layout/Footer.tsx:184)
  - Empty interface:
    - [ ] [src/components/ui/Card.tsx:91](lananolan-website/src/components/ui/Card.tsx:91)

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
- [ ] Add "engines" to [package.json](lananolan-website/package.json) to document supported Node (e.g., ">=18")
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