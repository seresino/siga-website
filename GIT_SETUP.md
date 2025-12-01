# Git Setup for Siga Repository

## Current Status

The folder is git initialized but connected to your personal website repository.

## Steps to Set Up New GitHub Repository

### Option 1: Disconnect and Create Fresh Repo (Recommended)

1. **Remove the old remote:**

   ```bash
   git remote remove origin
   ```

2. **Create a new repository on GitHub:**

   - Go to https://github.com/new
   - Name it something like `siga-website` or `client-siga`
   - Don't initialize with README (we already have one)
   - Create repository

3. **Add the new remote:**

   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/siga-website.git
   ```

4. **Commit all changes:**

   ```bash
   git add .
   git commit -m "Initial commit: Siga website template based on portfolio structure"
   ```

5. **Push to new repository:**
   ```bash
   git branch -M main
   git push -u origin main
   ```

### Option 2: Keep Git History but Change Remote

If you want to keep the commit history from your original website:

1. **Remove old remote and add new:**

   ```bash
   git remote remove origin
   git remote add origin https://github.com/YOUR_USERNAME/siga-website.git
   ```

2. **Commit template changes:**

   ```bash
   git add .
   git commit -m "Convert to client template: Remove personal info and add placeholders"
   ```

3. **Push to new repository:**
   ```bash
   git push -u origin main
   ```

## Files Already Staged for Commit

The following changes are ready to commit:

- ✅ Sanitized Sanity project IDs
- ✅ Removed personal information
- ✅ Updated README with setup instructions
- ✅ Added SETUP_CHECKLIST.md
- ✅ Updated package names

## Next Steps

After pushing to GitHub:

- Set up GitHub secrets for deployment (if using GitHub Actions)
- Configure deployment platform (Vercel/Netlify)
- Share repository access with team members if needed
