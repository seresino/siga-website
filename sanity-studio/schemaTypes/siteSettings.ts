import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
      description: 'The name displayed in the navigation (e.g., "Siga", "Client Name")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Contact Email',
      type: 'string',
      description: 'Email address for contact',
    }),
    defineField({
      name: 'instagram',
      title: 'Instagram URL',
      type: 'url',
      description: 'Full Instagram profile URL (e.g., https://instagram.com/username)',
    }),
    defineField({
      name: 'videoReelUrl',
      title: 'Video Reel URL (Vimeo)',
      type: 'url',
      description: 'Full Vimeo video URL (e.g., https://vimeo.com/123456789). Used for homepage background video.',
    }),
    
    // Branding Assets
    defineField({
      name: 'logos',
      title: 'Logo Variations',
      type: 'array',
      description: 'Upload up to 3 logo variations (e.g., light version, dark version, icon only). SVG format recommended.',
      validation: (Rule) => Rule.max(3),
      of: [
        {
          type: 'object',
          name: 'logo',
          title: 'Logo',
          fields: [
            {
              name: 'file',
              type: 'file',
              title: 'Logo File',
              description: 'SVG format recommended for scalability',
              options: {
                accept: 'image/svg+xml,.svg,image/png,.png',
              },
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'name',
              type: 'string',
              title: 'Logo Name',
              description: 'E.g., "Primary Logo", "Light Version", "Icon Only"',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'description',
              type: 'string',
              title: 'Description',
              description: 'When to use this logo variant (optional)',
            },
          ],
          preview: {
            select: {
              title: 'name',
              subtitle: 'description',
            },
          },
        },
      ],
    }),
    defineField({
      name: 'favicon',
      title: 'Favicon',
      type: 'image',
      description: 'Site favicon (will be used if you want dynamic favicon). Recommended: 32x32 or 64x64 PNG/ICO. Note: For best performance, you can also keep favicon.svg in /public folder.',
      options: {
        accept: 'image/png,image/x-icon,image/svg+xml',
      },
    }),
    
    // About Page Content
    defineField({
      name: 'aboutTitle',
      title: 'About Page Title',
      type: 'string',
      description: 'The main headline for the about page (e.g., "About [Client Name]")',
    }),
    defineField({
      name: 'profileImage',
      title: 'Profile Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          description: 'Important for SEO and accessibility.',
        },
      ],
    }),
    defineField({
      name: 'aboutContent',
      title: 'About Page Content',
      type: 'text',
      description: 'The main biography or content for the about page. Separate paragraphs with a double line break.',
    }),
  ],
})
