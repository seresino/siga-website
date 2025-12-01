# Setup Checklist for Siga Website

## ✅ Initial Setup

- [ ] Create Sanity.io account at https://www.sanity.io/
- [ ] Create new Sanity project and note the Project ID
- [ ] Install dependencies: `npm install` (root) and `cd sanity-studio && npm install`

## ✅ Configuration Files to Update

### Sanity Project ID (Replace `YOUR_SANITY_PROJECT_ID` with actual ID)

- [ ] `sanity-studio/sanity.config.ts` - line 11
- [ ] `sanity-studio/sanity.cli.ts` - line 5
- [ ] `src/sanityClient.ts` - line 4
- [ ] Create `.env.local` file with: `VITE_SANITY_PROJECT_ID="your_actual_project_id"`

### Client Branding

- [ ] `src/components/NavContent.tsx` - line 47: Replace "Client Name" with actual client name
- [ ] `src/components/MobileSidebar.tsx` - line 21: Replace "Client Name" with actual client name
- [ ] `index.html` - line 17: Update page title
- [ ] `public/favicon.svg` - Replace with client's logo/favicon

### Contact Information

- [ ] `src/components/NavContent.tsx` - line 123: Update Instagram URL (or remove if not needed)
- [ ] `src/components/NavContent.tsx` - line 134: Update email address

## ✅ Content Setup in Sanity

- [ ] Deploy Sanity Studio: `cd sanity-studio && npm run deploy`
- [ ] Access your Sanity Studio at the provided URL
- [ ] Create "About Page" content:
  - [ ] Add title
  - [ ] Upload profile image
  - [ ] Write bio content
  - [ ] Add email
  - [ ] Add Instagram URL (optional)
- [ ] Create Projects:
  - [ ] Add project titles
  - [ ] Generate slugs
  - [ ] Select project types (film/code)
  - [ ] Upload cover images
  - [ ] Set display order (lower numbers appear first)
  - [ ] Add project content
  - [ ] Add videos (optional)
  - [ ] Add gallery images (optional)

## ✅ Testing

- [ ] Run development server: `npm run dev`
- [ ] Check homepage displays projects correctly
- [ ] Test project page navigation
- [ ] Verify about page content
- [ ] Test mobile responsiveness
- [ ] Check all links work correctly

## ✅ Deployment

- [ ] Create GitHub repository
- [ ] Push code to GitHub
- [ ] Deploy to Vercel or Netlify
- [ ] Add `VITE_SANITY_PROJECT_ID` environment variable in deployment settings
- [ ] Verify production build works
- [ ] Test deployed site thoroughly

## 📝 Optional Customizations

- [ ] Update color scheme in `src/index.css`
- [ ] Modify project types in `sanity-studio/schemaTypes/project.ts`
- [ ] Customize fonts in `index.html`
- [ ] Add custom domain
- [ ] Set up analytics

## 🐛 Troubleshooting

- If projects don't appear: Check Sanity Studio for published projects
- If images don't load: Verify Sanity Project ID is correct in all files
- If build fails: Run `npm install` again and check for errors
- TypeScript errors: These are expected until `npm install` is run

## ✨ You're Done!

Once all items are checked, the website should be fully functional and ready to use!
