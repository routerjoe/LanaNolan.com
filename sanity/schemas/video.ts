export default {
  name: 'video',
  title: 'Video Highlights',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Video Title',
      type: 'string',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Hitting', value: 'hitting' },
          { title: 'Fielding', value: 'fielding' },
          { title: 'Game Situations', value: 'game' },
          { title: 'Skills Training', value: 'training' }
        ]
      },
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'videoFile',
      title: 'Video File',
      type: 'file',
      options: {
        accept: 'video/*'
      }
    },
    {
      name: 'videoUrl',
      title: 'Video URL (Alternative)',
      type: 'url',
      description: 'Use this if video is hosted externally (YouTube, Hudl, etc.)'
    },
    {
      name: 'thumbnail',
      title: 'Thumbnail Image',
      type: 'image',
      options: {
        hotspot: true
      }
    },
    {
      name: 'duration',
      title: 'Duration (seconds)',
      type: 'number',
      validation: (Rule: any) => Rule.min(1)
    },
    {
      name: 'date',
      title: 'Date Recorded',
      type: 'date',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'featured',
      title: 'Featured Video',
      type: 'boolean',
      description: 'Show this video prominently on the homepage'
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags'
      }
    }
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category',
      media: 'thumbnail'
    },
    prepare(selection: any) {
      const { title, category } = selection
      return {
        title: title,
        subtitle: `${category} • Video`
      }
    }
  }
}