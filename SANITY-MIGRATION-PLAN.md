# Sanity Migration Plan

Last updated: 2025-08-15 23:00 UTC

Objective
- Migrate JSON-backed content (player profile, schedule, photos metadata, videos metadata, blog posts) to Sanity for robust CMS features and multi-user editing.
- Preserve current website functionality and data shape while leveraging Sanity schemas (already present) and adapters.

Scope
- Source of truth to move from:
  - JSON files in lananolan-website/src/data/
  - Uploads under lananolan-website/public/uploads/
- Target:
  - Sanity datasets using the existing schemas in lananolan-website/sanity/schemas/
  - Runtime access via Sanity client in lananolan-website/src/lib/sanity.ts
  - Adapt existing UI via an adapter layer lananolan-website/src/utils/playerDataAdapter.ts to keep component props stable during transition

Current JSON Artifacts
- src/data/player-profile.json
- src/data/schedule.json
- src/data/blog-posts.json
- src/data/photos-config.json
- src/data/videos.json
- src/data/social-media-config.json (stays JSON until/unless social scheduling is moved to Sanity)

Target Sanity Schemas
- sanity/schemas/playerProfile.ts
- sanity/schemas/scheduleEvent.ts
- sanity/schemas/blogPost.ts
- sanity/schemas/video.ts
- Note: photos-config.json is a combined config; in Sanity, store photos as an asset-backed document with fields used to reproduce today’s config.

Data Mapping

1) Player Profile (player-profile.json -> playerProfile.ts)
- personalInfo.name -> playerProfile.name (string)
- personalInfo.graduationYear -> playerProfile.graduationYear (number)
- personalInfo.email -> playerProfile.email (string)
- personalInfo.phone -> playerProfile.phone (string, optional)
- personalInfo.height -> playerProfile.height (string, optional)
- personalInfo.recruitingPacketUrl -> playerProfile.recruitingPacketUrl (url or string)
- athletics.primaryPosition -> playerProfile.primaryPosition (string)
- athletics.secondaryPositions -> playerProfile.secondaryPositions (array of string)
- athletics.battingStance/throwingHand -> playerProfile.bats / playerProfile.throws or combined field (update schema if needed)
- athletics.hometown -> playerProfile.hometown (string)
- athletics.highSchool.{name, coach, coachEmail, coachPhone, teamProfileHubUrl, socialMedia{twitter,instagram,facebook,website}}
  -> playerProfile.highSchool (object with nested fields)
- athletics.travelTeam.{same mapping} -> playerProfile.travelTeam (object)
- academics / academic -> playerProfile.academics (object: currentGPA, cumulativeGPA, satScore, actScore, classRank, honors[], intendedMajor)
- measurables[] -> playerProfile.measurables[] (array: metric, value, date, notes)
- latestAchievement -> playerProfile.latestAchievement (object)
- scoutingReport -> playerProfile.scoutingReport (object: strengths[], development[], intangibles[])

2) Schedule (schedule.json -> scheduleEvent.ts)
- events[] becomes documents of type scheduleEvent with fields:
  - id -> _id or separate field (prefer auto _id in Sanity; keep old id as legacyId)
  - title, date, endDate, location, type, description, coachAttendance, status -> map directly to fields in the schema

3) Blog (blog-posts.json -> blogPost.ts)
- posts[] -> blogPost documents:
  - id -> _id or legacyId
  - title, content, excerpt, date, category, published, image, autoPostToX, xPostScheduled

4) Videos (videos.json -> video.ts)
- videos[] -> video documents:
  - id -> _id or legacyId
  - title, description, url, thumbnail, category, duration, date, featured, source, teamProfileHubUrl

5) Photos (photos-config.json -> Sanity image assets + photo document)
- photos[] -> create a document type “photoAsset” with fields:
  - id (legacyId), file (Sanity image asset), originalName, url (derive from asset), alt, category, uploadDate, isActive
- activePhotos -> a separate singleton config document “sitePhotosConfig” with references:
  - heroImage -> reference(photoAsset)
  - profileImage -> reference(photoAsset)
  - featuredAction -> reference(photoAsset)

Migration Steps

Phase 0: Prepare
- Verify Sanity project setup is complete (sanity.config.ts, datasets, tokens).
- Ensure all Sanity schemas match mapping needs. If not, extend them to add fields like:
  - playerProfile: height, recruitingPacketUrl, nested team social objects
  - video: source enum and teamProfileHubUrl
  - photoAsset: category enum and alt text
  - sitePhotosConfig: references for activePhotos
- Create an Environment variable SANITY_WRITE_TOKEN for server-side migration script (never leak to client).

Phase 1: Content Import Scripts
- Create a Node script (not part of Next runtime) in a migration/ folder:
  - Reads each local JSON file from src/data/
  - Transforms entries to Sanity document shapes
  - Uses @sanity/client with write token to create/update documents
- Suggested order:
  1) player-profile.json -> upsert a single playerProfile document
  2) schedule.json -> upsert scheduleEvent documents
  3) blog-posts.json -> upsert blogPost documents
  4) videos.json -> upsert video documents
  5) photos-config.json:
     - Upload files in public/uploads/ to Sanity as image assets (use file stream)
     - Create photoAsset documents with references to uploaded assets
     - Create/update sitePhotosConfig singleton linking active photos by reference

Phase 2: Application Read Path Flip (feature flag)
- Introduce a feature flag NEXT_PUBLIC_USE_SANITY=true
- Where applicable, add data adapters to fetch from Sanity when flag on, fallback to JSON when off
  - Example adapter file: src/utils/playerDataAdapter.ts
- Touch points:
  - /api/player, /api/photos, /api/videos, /api/schedule, /api/blog (public routes) should read from Sanity when enabled (or components hitting public endpoints)
- Validate UI parity in dev with the flag on

Phase 3: Admin Write Path Strategy
- Option A (Fast path, interim): Keep Admin JSON writes for now (as-is), while public site reads via Sanity. Add a nightly (or manual) sync script from JSON -> Sanity to push changes.
- Option B (Full migration): Extend admin API routes to write into Sanity:
  - Replace file write logic with Sanity mutations (atomic operations)
  - For uploads (photos/videos), push assets to Sanity (images) or store external URLs; consider Sanity’s file assets for PDFs or keep PDFs on Vercel storage and save URL in Sanity

Phase 4: Cutover
- When content and workflows are validated, flip NEXT_PUBLIC_USE_SANITY to true in production
- Disable JSON writes and remove cron-sync (if used)
- Archive src/data/ and remove JSON-based APIs once stable

Validation Checklist
- Data completeness: Player profile, schedule, videos, blog posts appear identical after migration
- Relations & references: Active photos resolve correctly to assets
- Rendering performance: Sanity reads do not regress performance (consider GROQ queries and caching where safe)
- Admin UX: If staying on JSON writes for now, ensure sync job correctness and conflicts resolution policy (last-write-wins)

Risks & Considerations
- Asset storage for videos: Current flow stores uploads under public/uploads/videos; recommend leaving video binary storage out of Sanity, use external hosting or keep same path and only index metadata in Sanity
- Social scheduling: social-media-config.json is operational config and may remain file-based or migrate later to a “socialSettings” doc. Real API credentials must never be readable from public clients.
- Partial adoption: A staged approach is recommended to minimize risk, starting with public read-side.

Deliverables
- Migration scripts under migration/ (importer.ts per content type)
- Updated schemas (if needed)
- Adapter utilities to normalize data shapes for components
- Feature flags in README and DEPLOYMENT-CHECKLIST
- Rollback plan: switch NEXT_PUBLIC_USE_SANITY=false to re-enable JSON reads

Roll-forward Plan
- After stable period on Sanity:
  - Remove JSON data dependencies
  - Delete legacy files in src/data/ (post-backup)
  - Remove JSON-write admin routes and replace with Sanity mutations