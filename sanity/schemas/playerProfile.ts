export default {
  name: 'playerProfile',
  title: 'Player Profile',
  type: 'document',
  fields: [
    {
      name: 'personalInfo',
      title: 'Personal Information',
      type: 'object',
      fields: [
        {
          name: 'name',
          title: 'Full Name',
          type: 'string',
          validation: (Rule: any) => Rule.required()
        },
        {
          name: 'graduationYear',
          title: 'Graduation Year',
          type: 'number',
          validation: (Rule: any) => Rule.required().min(2025).max(2030)
        },
        {
          name: 'email',
          title: 'Email Address',
          type: 'email',
          validation: (Rule: any) => Rule.required()
        },
        {
          name: 'socialMedia',
          title: 'Social Media',
          type: 'object',
          fields: [
            {
              name: 'twitter',
              title: 'Twitter/X URL',
              type: 'url'
            },
            {
              name: 'instagram',
              title: 'Instagram URL',
              type: 'url'
            }
          ]
        }
      ]
    },
    {
      name: 'athletics',
      title: 'Athletic Information',
      type: 'object',
      fields: [
        {
          name: 'primaryPosition',
          title: 'Primary Position',
          type: 'string',
          options: {
            list: [
              { title: 'Pitcher', value: 'pitcher' },
              { title: 'Catcher', value: 'catcher' },
              { title: 'First Base', value: 'first-base' },
              { title: 'Second Base', value: 'second-base' },
              { title: 'Third Base', value: 'third-base' },
              { title: 'Shortstop', value: 'shortstop' },
              { title: 'Left Field', value: 'left-field' },
              { title: 'Center Field', value: 'center-field' },
              { title: 'Right Field', value: 'right-field' }
            ]
          }
        },
        {
          name: 'secondaryPositions',
          title: 'Secondary Positions',
          type: 'array',
          of: [{ type: 'string' }],
          options: {
            list: [
              { title: 'Pitcher', value: 'pitcher' },
              { title: 'Catcher', value: 'catcher' },
              { title: 'First Base', value: 'first-base' },
              { title: 'Second Base', value: 'second-base' },
              { title: 'Third Base', value: 'third-base' },
              { title: 'Shortstop', value: 'shortstop' },
              { title: 'Left Field', value: 'left-field' },
              { title: 'Center Field', value: 'center-field' },
              { title: 'Right Field', value: 'right-field' }
            ]
          }
        },
        {
          name: 'battingThrows',
          title: 'Bats/Throws',
          type: 'string',
          options: {
            list: [
              { title: 'Right/Right', value: 'R/R' },
              { title: 'Left/Left', value: 'L/L' },
              { title: 'Right/Left', value: 'R/L' },
              { title: 'Left/Right', value: 'L/R' }
            ]
          }
        },
        {
          name: 'hometown',
          title: 'Hometown',
          type: 'string'
        },
        {
          name: 'highSchool',
          title: 'High School Information',
          type: 'object',
          fields: [
            { name: 'name', title: 'School Name', type: 'string' },
            { name: 'coach', title: 'Head Coach', type: 'string' },
            { name: 'contact', title: 'Coach Contact', type: 'string' }
          ]
        },
        {
          name: 'travelTeam',
          title: 'Travel Team Information',
          type: 'object',
          fields: [
            { name: 'name', title: 'Team Name', type: 'string' },
            { name: 'coach', title: 'Head Coach', type: 'string' },
            { name: 'contact', title: 'Coach Contact', type: 'string' }
          ]
        }
      ]
    },
    {
      name: 'measurables',
      title: 'Performance Measurables',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'metric',
              title: 'Metric',
              type: 'string',
              options: {
                list: [
                  'Exit Velocity',
                  'Throwing Velocity',
                  'Pop Time',
                  'Home to First',
                  '60-Yard Dash',
                  'Vertical Jump'
                ]
              }
            },
            { name: 'value', title: 'Value', type: 'string' },
            { name: 'date', title: 'Date Measured', type: 'date' },
            { name: 'notes', title: 'Notes', type: 'text' }
          ]
        }
      ]
    },
    {
      name: 'scoutingReport',
      title: 'Scouting Report',
      type: 'object',
      fields: [
        {
          name: 'strengths',
          title: 'Strengths',
          type: 'array',
          of: [{ type: 'string' }]
        },
        {
          name: 'development',
          title: 'Development Areas',
          type: 'array',
          of: [{ type: 'string' }]
        },
        {
          name: 'intangibles',
          title: 'Intangibles',
          type: 'array',
          of: [{ type: 'string' }]
        }
      ]
    },
    {
      name: 'references',
      title: 'Coach References',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', title: 'Coach Name', type: 'string' },
            { name: 'title', title: 'Title', type: 'string' },
            { name: 'organization', title: 'Organization', type: 'string' },
            { name: 'phone', title: 'Phone Number', type: 'string' },
            { name: 'email', title: 'Email', type: 'email' },
            { name: 'relationship', title: 'Relationship', type: 'string' }
          ]
        }
      ]
    }
  ]
}