# Love Confession

A beautiful and interactive love confession application built with React, TailwindCSS, and Framer Motion.

## Features

- **Anonymous Confessions**: Submit confessions anonymously.
- **Authentication**: Beautiful Login and Register pages.
- **Rich Interaction**: Like and react to confessions (Heart, Wow, Laugh, Cry, Fire).
- **Responsive Design**: Mobile-friendly UI with smooth animations.
- **Social Sharing**: Share specific confessions via direct link or QR code.

## Tech Stack

- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Routing**: [React Router](https://reactrouter.com/)

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:

```bash
npm run dev
```

## 🚀 Deployment

### Option A: Vercel (Recommended)
1. Push to GitHub.
2. Import project in Vercel.
3. Use default settings (Framework: Vite).
4. Deploy.

### Option B: Netlify
1. Import from Git.
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Deploy.

### Option C: GitHub Pages
1. Update `package.json` homepage or `vite.config.js` with your repo name if needed.
2. Run:
   ```bash
   npm run deploy
   ```
   This will build and push to `gh-pages` branch.

### Build

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Project Structure

- `src/components`: Reusable UI components
- `src/pages`: Main application pages (Home, Feed, Create, Confession)
- `src/utils`: Helper functions and storage logic

## License

MIT
