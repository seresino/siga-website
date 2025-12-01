# Portfolio Website Template

A modern, responsive portfolio website built with **React**, **TypeScript**, **Vite**, **TailwindCSS**, and **Sanity CMS**.

## 🚀 Features

- **Modern Tech Stack**: React 19, TypeScript, Vite, TailwindCSS 4
- **Headless CMS**: Sanity.io for easy content management
- **Responsive Design**: Mobile-first with elegant sidebar navigation
- **Project Showcase**: Support for both film and code projects
- **Rich Content**: Portable text, image galleries, and video embeds
- **Fast & Optimized**: Built with performance in mind

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** (v18 or higher)
- **pnpm** (Install with `npm install -g pnpm` if not already installed)
- A **Sanity.io** account (free tier available)

## 🛠️ Setup Instructions

### 1. Clone or Copy This Repository

```bash
cd /path/to/your/projects
```

### 2. Install Dependencies

#### Main Application
```bash
pnpm install
```

#### Sanity Studio (CMS)
```bash
cd sanity-studio
pnpm install
cd ..
```

### 3. Set Up Sanity CMS

#### Create a Sanity Project

1. Go to [sanity.io](https://www.sanity.io/) and create a free account
2. Create a new project
3. Note your **Project ID** and **Dataset** name (usually "production")

#### Configure Sanity

**Sanity Studio Configuration Files:**

These files are used by Sanity's CLI and need the project ID hardcoded:

**`sanity-studio/sanity.config.ts`** (line 11)
```typescript
projectId: 'YOUR_SANITY_PROJECT_ID', // Replace with your actual project ID
```

**`sanity-studio/sanity.cli.ts`** (line 5)
```typescript
projectId: 'YOUR_SANITY_PROJECT_ID', // Replace with your actual project ID
```

### 4. Create Environment Variables

Create a `.env.local` file in the root directory:

```bash
VITE_SANITY_PROJECT_ID="YOUR_SANITY_PROJECT_ID"
```

**Note:** The frontend React app (`src/lib/sanity.ts`) reads the project ID from this environment variable. Only the Sanity Studio files need the ID hardcoded since they're used by Sanity's CLI tools.

### 5. Customize Branding (Optional)

- **Page Title**: Update in `index.html` (can also be set in Sanity Site Settings)
- **Favicon**: Replace `public/favicon.svg` with your client's logo

**Note:** Client name, email, and Instagram are now managed through Sanity CMS in "Site Settings" - no code changes needed!

### 6. Deploy Sanity Studio

```bash
cd sanity-studio
pnpm run deploy
```

This will give you a URL like `https://your-project.sanity.studio` where you can manage content.

### 7. Add Content in Sanity

1. Go to your deployed Sanity Studio
2. Configure **Site Settings** (all site-wide content in one place):
   - Site name (displays in navigation)
   - Contact email (for navigation & about page)
   - Instagram URL (for navigation & about page)
   - Logo variations (up to 3 - SVG recommended for scalability)
   - Favicon (optional - can also use local `/public/favicon.svg`)
   - About page title
   - Profile image
   - About page bio content
3. Add **Projects** with:
   - Title and slug
   - Project type (film or code)
   - Cover image
   - Display order
   - Content (portable text)
   - Optional: videos and gallery images

## 🚀 Running the Application

### Development Mode

#### Start the main application:
```bash
pnpm dev
```
Visit `http://localhost:5173`

#### Start Sanity Studio (optional, for local CMS development):
```bash
cd sanity-studio
pnpm dev
```
Visit `http://localhost:3333`

### Build for Production

```bash
pnpm build
```

The build output will be in the `dist` folder.

### Preview Production Build

```bash
pnpm preview
```

## 📁 Project Structure

```
.
├── public/              # Static assets
├── sanity-studio/       # Sanity CMS configuration
│   ├── schemaTypes/     # Content schemas (about, project)
│   └── sanity.config.ts # Sanity configuration
├── src/
│   ├── components/      # React components
│   │   ├── ui/         # UI components (shadcn/ui)
│   │   ├── Layout.tsx
│   │   ├── NavContent.tsx
│   │   ├── DesktopSidebar.tsx
│   │   └── MobileSidebar.tsx
│   ├── lib/            # Utilities and Sanity client
│   ├── pages/          # Page components
│   │   ├── HomePage.tsx
│   │   ├── AboutPage.tsx
│   │   └── ProjectPage.tsx
│   ├── App.tsx
│   └── main.tsx
├── package.json
└── README.md
```

## 🎨 Customization

### Styling

- Global styles: `src/index.css`
- TailwindCSS config: Uses Tailwind 4 with CSS variables
- Color scheme: Defined in `src/index.css` (currently black & white theme)

### Logos & Branding

- **Logo Storage**: Upload up to 3 logo variations (SVG recommended) in Sanity Site Settings
- **Usage Guide**: See `LOGO_USAGE.md` for code examples on how to access and display logos
- **Favicon**: Can be managed in Sanity or kept local in `/public/favicon.svg` (local recommended for performance)

### Content Schema

Modify content types in `sanity-studio/schemaTypes/`:
- `siteSettings.ts` - Global site settings (includes navigation & about page content, logos, favicon)
- `project.ts` - Project structure

### Navigation

Project types (Film/Code) can be customized in `sanity-studio/schemaTypes/project.ts`

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variable: `VITE_SANITY_PROJECT_ID`
4. Deploy!

### Netlify

1. Push your code to GitHub
2. Import project in Netlify
3. Add environment variable: `VITE_SANITY_PROJECT_ID`
4. Build command: `pnpm build`
5. Publish directory: `dist`

## 📝 License

This template is free to use for your client projects.

## 🆘 Support

For issues with:
- **Sanity CMS**: Check [Sanity documentation](https://www.sanity.io/docs)
- **React/Vite**: Check [Vite documentation](https://vitejs.dev/)
- **TailwindCSS**: Check [Tailwind documentation](https://tailwindcss.com/)
