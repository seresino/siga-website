import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'previewClips',
      title: 'Preview Clips (Homepage Grid)',
      type: 'array',
      description:
        'Short compressed loops shown in the homepage grid. Every clip you add here gets its own tile. Keep each ~3-6 seconds, MP4 or WebM, ideally under 5MB.',
      of: [
        {
          type: 'file',
          options: {
            accept: 'video/*',
          },
        },
      ],
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Order in which this project appears on the homepage (lower numbers first)',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'content',
      title: 'Main Content (Portable Text)',
      type: 'array',
      of: [
        {type: 'block'},
        {
          type: 'image', // Allows adding images directly within the text
          options: {hotspot: true},
        },
      ],
    }),

    // --- NEW: Videos Field ---
    defineField({
      name: 'videos',
      title: 'Vimeo Videos',
      type: 'array',
      description: 'Add one or more Vimeo video links.',
      of: [
        {
          type: 'object',
          name: 'video',
          title: 'Video',
          fields: [
            {
              name: 'url',
              type: 'url',
              title: 'Vimeo URL',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
            },
          ],
        },
      ],
    }),

    // --- NEW: Photo Gallery Field ---
    defineField({
      name: 'gallery',
      title: 'Photo Gallery',
      type: 'array',
      description: 'Upload images for a gallery display.',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
            },
          ],
        },
      ],
    }),

    // --- "Choose" Galleries ---
    defineField({
      name: 'chooseGalleries',
      title: '"Choose" Galleries',
      type: 'array',
      description:
        'Switchable content galleries shown on the project page, e.g. "Choose film" (videos) or "Choose stills" (images). Add as many as you like.',
      of: [
        {
          type: 'object',
          name: 'chooseGallery',
          title: 'Gallery',
          fields: [
            {
              name: 'title',
              type: 'string',
              title: 'Label',
              description: 'e.g. "Choose film" or "Choose stills"',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'items',
              type: 'array',
              title: 'Items',
              of: [
                {
                  type: 'image',
                  options: {hotspot: true},
                  fields: [
                    {
                      name: 'alt',
                      type: 'string',
                      title: 'Alternative text',
                    },
                    {
                      name: 'caption',
                      type: 'string',
                      title: 'Caption',
                    },
                  ],
                },
                {
                  type: 'object',
                  name: 'vimeoVideo',
                  title: 'Video (Vimeo)',
                  fields: [
                    {
                      name: 'url',
                      type: 'url',
                      title: 'Vimeo URL',
                      validation: (Rule: any) => Rule.required(),
                    },
                    {
                      name: 'caption',
                      type: 'string',
                      title: 'Caption',
                    },
                  ],
                  preview: {
                    select: {
                      title: 'url',
                      subtitle: 'caption',
                    },
                  },
                },
                {
                  type: 'object',
                  name: 'videoFile',
                  title: 'Video File',
                  fields: [
                    {
                      name: 'file',
                      type: 'file',
                      title: 'Video File',
                      description: 'Upload a video file directly (WebM or MP4).',
                      options: {
                        accept: 'video/*',
                      },
                      validation: (Rule: any) => Rule.required(),
                    },
                    {
                      name: 'caption',
                      type: 'string',
                      title: 'Caption',
                    },
                  ],
                  preview: {
                    select: {
                      title: 'caption',
                    },
                  },
                },
              ],
            },
          ],
          preview: {
            select: {
              title: 'title',
            },
          },
        },
      ],
    }),
  ],
})
