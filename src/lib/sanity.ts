import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  useCdn: true,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
})

const builder = imageUrlBuilder(client)

// Derive the image source type from the builder API to avoid 'any'
type ImageSource = Parameters<typeof builder.image>[0]
export const urlFor = (source: unknown) => builder.image(source as ImageSource)

// GROQ queries for fetching data
export const queries = {
  playerProfile: `*[_type == "playerProfile"][0]{
    _id,
    personalInfo,
    athletics,
    academics,
    measurables,
    scoutingReport,
    references
  }`,
  
  videos: `*[_type == "video"] | order(date desc){
    _id,
    title,
    description,
    category,
    videoFile,
    thumbnail,
    duration,
    date,
    featured
  }`,
  
  blogPosts: `*[_type == "blogPost"] | order(publishedAt desc){
    _id,
    title,
    slug,
    excerpt,
    content,
    publishedAt,
    category,
    tags,
    featured,
    image
  }`,
  
  scheduleEvents: `*[_type == "scheduleEvent"] | order(date asc){
    _id,
    title,
    date,
    endDate,
    location,
    type,
    description,
    contactInfo,
    isAvailable,
    venue,
    cost,
    website
  }`
}