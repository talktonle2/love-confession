# Deployment Instructions

This project has been configured for easy deployment to **Vercel**, **Netlify**, and **GitHub Pages**.

## 1. GitHub Pages (Recommended for Static)

The project includes a special script to handle GitHub Pages' subpath requirement (`/<REPO_NAME>/`).

**Steps:**
1.  Ensure your `package.json` has the correct `git remote` (or just push your code to GitHub).
2.  Run the deploy script:
    ```bash
    npm run deploy
    ```
    This command will:
    *   Set the `VITE_DEPLOY_TARGET` environment variable.
    *   Build the project with the base path `/love-confession/` (assuming your repo is named `love-confession`). covering `vite.config.js`.
    *   Push the `dist` folder to the `gh-pages` branch.

**Note:** If your repository name is **NOT** `love-confession`, please update the base path in `vite.config.js`:
```javascript
// vite.config.js
base: isGitHubPages ? '/your-repo-name/' : '/',
```

## 2. Vercel (Recommended for Speed)

1.  Connect your GitHub repo to Vercel.
2.  Select `Vite` as the framework preset.
3.  The Build Command (`npm run build`) and Output Directory (`dist`) are standard.
4.  Deploy.

*Note: Vercel uses the default build which serves from the root `/`, so no configuration changes are needed.*

## 3. Netlify

1.  Import from Git.
2.  Build command: `npm run build`
3.  Publish directory: `dist`
4.  Deploy.

*Note: Like Vercel, Netlify works with the default configuration.*
