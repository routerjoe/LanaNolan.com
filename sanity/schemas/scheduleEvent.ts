export default {
  name: 'scheduleEvent',
  title: 'Schedule Events',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Event Title',
      type: 'string',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'date',
      title: 'Start Date & Time',
      type: 'datetime',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'endDate',
      title: 'End Date & Time',
      type: 'datetime'
    },
    {
      name: 'location',
      title: 'Location',
      type: 'string',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'venue',
      title: 'Venue Name',
      type: 'string'
    },
    {
      name: 'type',
      title: 'Event Type',
      type: 'string',
      options: {
        list: [
          { title: 'Tournament', value: 'tournament' },
          { title: 'Showcase', value: 'showcase' },
          { title: 'Camp', value: 'camp' },
          { title: 'Campus Visit', value: 'visit' },
          { title: 'Game', value: 'game' }
        ]
      },
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3
    },
    {
      name: 'contactInfo',
      title: 'Contact Information',
      type: 'string',
      description: 'Contact person and details for this event'
    },
    {
      name: 'isAvailable',
      title: 'Coaches Welcome',
      type: 'boolean',
      description: 'Can college coaches attend this event?',
      initialValue: true
    },
    {
      name: 'cost',
      title: 'Cost',
      type: 'string',
      description: 'Registration fee or cost (e.g., "$150", "Free")'
    },
    {
      name: 'website',
      title: 'Event Website',
      type: 'url'
    },
    {
      name: 'registrationDeadline',
      title: 'Registration Deadline',
      type: 'datetime'
    },
    {
      name: 'notes',
      title: 'Additional Notes',
      type: 'text',
      rows: 2
    },
    {
      name: 'priority',
      title: 'Priority Level',
      type: 'string',
      options: {
        list: [
          { title: 'High', value: 'high' },
          { title: 'Medium', value: 'medium' },
          { title: 'Low', value: 'low' }
        ]
      },
      initialValue: 'medium'
    }
  ],
  preview: {
    select: {
      title: 'title',
      type: 'type',
      date: 'date',
      location: 'location'
    },
    prepare(selection: any) {
      const { title, type, date, location } = selection
      const eventDate = date ? new Date(date).toLocaleDateString() : 'No date'
      return {
        title: title,
        subtitle: `${type} • ${eventDate} • ${location}`
      }
    }
  },
  orderings: [
    {
      title: 'Date, Upcoming First',
      name: 'dateAsc',
      by: [{ field: 'date', direction: 'asc' }]
    },
    {
      title: 'Date, Recent First',
      name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }]
    },
    {
      title: 'Priority, High First',
      name: 'priorityDesc',
      by: [{ field: 'priority', direction: 'desc' }]
    }
  ]
}