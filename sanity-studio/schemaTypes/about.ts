import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'about',
  title: 'About Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      description: 'The main headline for the about page (e.g., "About [Client Name]").',
    }),
    defineField({
      name: 'profileImage',
      title: 'Profile Image',
      type: 'image',
      options: {
        hotspot: true, // Good for responsive cropping
      },
      fields: [
        // This adds the alt text field directly to the image
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          description: 'Important for SEO and accessibility.',
        },
      ],
    }),
    defineField({
      name: 'content',
      title: 'Main Content',
      // The 'text' type provides a simple multi-line textarea, matching your .split('\n\n') logic.
      type: 'text',
      description:
        'The main biography or content. You can separate paragraphs with a double line break.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email Address',
      type: 'string',
    }),
    defineField({
      name: 'instagram',
      title: 'Instagram URL',
      // The 'url' type provides validation to ensure it's a valid link.
      type: 'url',
    }),
  ],
})
