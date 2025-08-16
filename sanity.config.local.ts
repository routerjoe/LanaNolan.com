import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { media } from 'sanity-plugin-media'
import { schema } from './sanity/schema'

export default defineConfig({
  name: 'lana-nolan-recruiting',
  title: 'Lana Nolan Recruiting Website',
  
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  
  basePath: '/admin',
  
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content Management')
          .items([
            // Player Profile (singleton)
            S.listItem()
              .title('Player Profile')
              .id('playerProfile')
              .child(
                S.document()
                  .schemaType('playerProfile')
                  .documentId('playerProfile')
              ),
            
            // Videos
            S.listItem()
              .title('Video Highlights')
              .schemaType('video')
              .child(S.documentTypeList('video').title('Video Highlights')),
            
            // Blog Posts
            S.listItem()
              .title('Blog Posts')
              .schemaType('blogPost')
              .child(S.documentTypeList('blogPost').title('Blog Posts')),
            
            // Schedule Events
            S.listItem()
              .title('Schedule Events')
              .schemaType('scheduleEvent')
              .child(S.documentTypeList('scheduleEvent').title('Schedule Events')),
          ])
    }),
    visionTool(),
    media()
  ],
  
  schema,
  
  document: {
    // Remove 'Create' button on Singleton documents
    actions: (prev, context) => {
      if (context.schemaType === 'playerProfile') {
        // action may not be typed as a string in Sanity types; coerce safely
        return prev.filter((item) => String(item.action) !== 'create')
      }
      return prev
    }
  }
})