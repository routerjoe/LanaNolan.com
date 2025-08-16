import { type SchemaTypeDefinition } from 'sanity'
import playerProfile from './schemas/playerProfile'
import video from './schemas/video'
import blogPost from './schemas/blogPost'
import scheduleEvent from './schemas/scheduleEvent'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [playerProfile, video, blogPost, scheduleEvent],
}