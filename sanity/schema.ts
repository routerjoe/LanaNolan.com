/** Sanity schema aggregation (keeps types generic to avoid requiring Sanity types during app build) */
import playerProfile from './schemas/playerProfile'
import video from './schemas/video'
import blogPost from './schemas/blogPost'
import scheduleEvent from './schemas/scheduleEvent'

export const schema: { types: any[] } = {
  types: [playerProfile, video, blogPost, scheduleEvent],
}