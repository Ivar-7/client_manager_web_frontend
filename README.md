# Client Onboarding Dashboard

This project is a Firebase-backed client onboarding workspace for managing client intake, onboarding stages, checklist items, infrastructure records, and meeting notes.

## What It Does

- Tracks clients through onboarding, active, and inactive states
- Stores stages, checklist items, domain/hosting/DNS records, and meeting notes
- Uses Firebase Authentication with anonymous sign-in when Firebase is configured
- Persists data in Firestore collections and falls back to a local demo workspace when Firebase env vars are missing

## Firebase Setup

Create a Firebase project, enable Authentication with anonymous sign-in, and create a Firestore database.

Add the following values to a local `.env` file:

```bash
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

The app will use Firestore collections named `users`, `clients`, `stages`, `checklistItems`, `assetRecords`, and `meetingNotes`.

## Run It

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev` starts the Vite dev server
- `npm run build` runs the production build
- `npm run lint` checks the code with ESLint

## Data Model

- `UserRecord`: name, email, role
- `ClientRecord`: client profile and status
- `StageRecord`: onboarding stage state and approval metadata
- `ChecklistItemRecord`: task tracking tied to stages or meetings
- `AssetRecord`: domain, hosting, and DNS records
- `MeetingNoteRecord`: meeting details, notes, and attendees