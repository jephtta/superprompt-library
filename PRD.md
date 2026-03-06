# Tech Stack for SuperPrompt Library

## Executive Summary
SuperPrompt Library is an internal web app that auto-syncs AI prompts from Google Docs, makes them instantly searchable, and lets any team member copy and use them in seconds. This stack is built on Firebase + React.

## 1. Mandatory Stack (MVP Requirements)

### Frontend
- React 18, TypeScript 5.x, Vite 5.x, React Router 6.x
- Tailwind CSS 3.x, shadcn/ui
- TanStack Query 5.x, Zustand 4.x, Zod 3.x

### Backend
- Firebase Cloud Functions (Node.js 20 runtime)
- Google Docs API v1, Google Drive API v3
- Cloud Scheduler (triggers sync every hour)

### Database & Storage
- Firestore (primary database)
- Algolia (full-text search index)

### Infrastructure
- Firebase Hosting
- Firebase Authentication (Google OAuth)
- GitHub, GitHub Actions (CI/CD)

### Key Libraries
- Sonner (toasts), date-fns, algoliasearch
- firebase-admin, google-auth-library, diff
- clsx / tailwind-merge

## 2. Architecture Overview

The React app (hosted on Firebase Hosting) communicates with Firestore and Algolia. Firebase Auth sits in front of everything.

The sync engine lives in Firebase Cloud Functions. Cloud Scheduler pings the sync function every hour. It uses Google Drive API to check modified docs, Google Docs API to read content, extracts SuperPrompts by scanning for "SuperPrompt" in titles/headers, and writes to Firestore. A Firestore trigger mirrors new/updated active prompts to Algolia.

### Data flow:
1. User loads app -> Firebase Auth confirms identity
2. User types in search bar -> Algolia returns matching prompt IDs
3. Prompt cards render from Firestore -> user clicks Copy
4. Copy event fires Cloud Function that increments copy count
5. Clipboard receives prompt text

### Admin flow:
1. Admin opens Review Queue -> Firestore query returns unreviewed prompts
2. Admin approves/suppresses prompts, assigns categories
3. Admin triggers manual sync -> Cloud Function runs immediately

Suppressed prompts carry suppressedManually: true flag. Sync engine checks this flag before updating — never changes manually-suppressed prompt back to active.