# Setup Checklist for Siga Website

## ✅ Initial Setup

- [ ] Create Sanity.io account at https://www.sanity.io/
- [ ] Create new Sanity project and note the Project ID
- [ ] Install dependencies: `pnpm install` (root) and `cd sanity-studio && pnpm install`

## ✅ Configuration Files to Update

### Sanity Project ID (Replace `YOUR_SANITY_PROJECT_ID` with actual ID)

**Sanity Studio files (required by Sanity CLI):**
- [ ] `sanity-studio/sanity.config.ts` - line 11
- [ ] `sanity-studio/sanity.cli.ts` - line 5

**Frontend app (uses environment variable):**
- [ ] Create `.env.local` file in root with: `VITE_SANITY_PROJECT_ID="your_actual_project_id"`

Note: The frontend app reads from `.env.local` via `src/lib/sanity.ts` - no other files need updating!

### Client Branding

- [ ] `index.html` - line 17: Update page title (optional - can also use siteName from Sanity)
- [ ] `public/favicon.svg` - Replace with client's logo/favicon

Note: Client name, email, and Instagram are now managed in Sanity CMS via "Site Settings" - no code changes needed!

## ✅ Content Setup in Sanity

- [ ] Deploy Sanity Studio: `cd sanity-studio && pnpm run deploy`
- [ ] Access your Sanity Studio at the provided URL
- [ ] Configure "Site Settings" (all site-wide content in one place):
  - [ ] Add site name (displays in navigation)
  - [ ] Add Vimeo video reel URL (for landing page background - e.g., https://vimeo.com/123456789)
  - [ ] Upload logo variations (up to 3 - SVG recommended) - first one displays on landing page
  - [ ] Add contact email (for navigation & about page) - optional for now
  - [ ] Add Instagram URL (for navigation & about page) - optional for now
  - [ ] Upload favicon (optional - can also use local /public/favicon.svg)
  - [ ] Add About page title - optional for now
  - [ ] Upload profile image - optional for now
  - [ ] Write About page bio content - optional for now
- [ ] Create Projects (OPTIONAL - site currently shows landing page only):
  - [ ] Add project titles
  - [ ] Generate slugs
  - [ ] Select project types (film/code)
  - [ ] Upload cover images
  - [ ] Set display order (lower numbers appear first)
  - [ ] Add project content
  - [ ] Add videos (optional)
  - [ ] Add gallery images (optional)

## ✅ Testing

- [ ] Run development server: `pnpm dev`
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
- If build fails: Run `pnpm install` again and check for errors
- TypeScript errors: These are expected until `pnpm install` is run

## ✨ You're Done!

Once all items are checked, the website should be fully functional and ready to use!
