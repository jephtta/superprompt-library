# SuperPrompt Library

An internal web app for managing and searching your team's AI prompts.
Users sign in with Google, browse a categorized prompt library, and copy prompts
to their clipboard with one click.

## Live URL

https://nodal-seer-287420.web.app

## Prerequisites

- Node.js 18+
- A Firebase project with Firestore and Authentication (Google provider) enabled
- (Optional) An Algolia account for full-text search

## Local Setup

```bash
# 1. Clone the repo
git clone https://github.com/jephtta/superprompt-library.git
cd superprompt-library

# 2. Install dependencies
npm install

# 3. Copy the env template and fill in your values
cp .env.local.example .env.local

# 4. Start the dev server
npm run dev
```

## Environment Variables

Create a `.env.local` file in the project root with these values:

| Variable                          | Description                                      |
| --------------------------------- | ------------------------------------------------ |
| `VITE_FIREBASE_API_KEY`           | Firebase project API key                         |
| `VITE_FIREBASE_AUTH_DOMAIN`       | Firebase auth domain (e.g. `project.firebaseapp.com`) |
| `VITE_FIREBASE_PROJECT_ID`       | Firebase project ID                              |
| `VITE_FIREBASE_STORAGE_BUCKET`   | Firebase storage bucket                          |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID                  |
| `VITE_FIREBASE_APP_ID`           | Firebase app ID                                  |
| `VITE_FIREBASE_MEASUREMENT_ID`   | Google Analytics measurement ID (optional)       |
| `VITE_ALGOLIA_APP_ID`            | Algolia application ID (optional — falls back to client-side search) |
| `VITE_ALGOLIA_API_KEY`           | Algolia search-only API key (optional)           |

All `VITE_FIREBASE_*` values are available in your Firebase Console under Project Settings.

## Running Tests

```bash
# Install Playwright browsers (first time only)
npx playwright install

# Run all tests
npx playwright test

# Run smoke tests only
npx playwright test e2e/smoke.spec.ts
```

## Building for Production

```bash
npm run build
```

Output goes to `dist/`. Deploy to Firebase Hosting with `firebase deploy`.

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Database**: Firebase Firestore
- **Auth**: Firebase Authentication (Google OAuth)
- **Search**: Algolia (with client-side fallback)
- **Hosting**: Firebase Hosting
- **Tests**: Playwright
