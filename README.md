# Projects Register

A personal registry for managing projects, platform accounts, email addresses, resources, notes, and tags.

**Stack:** React 18 · TypeScript · Vite · Capacitor 6 · Zustand · Android

---

## Repo layout

```
projects-register/
├── src/
│   ├── types/         TypeScript interfaces
│   ├── store/         Zustand + Capacitor Preferences persistence
│   ├── utils/tokens   Design tokens (palette matches brand)
│   ├── components/    UI, PageHeader, HamburgerMenu
│   └── pages/         Dashboard, Projects, Accounts, AddEdit, Settings
├── .github/workflows/build-apk.yml
├── projects_register_icons.zip   ← place here before pushing
├── projects_register_splash.zip  ← place here before pushing
└── capacitor.config.ts
```

---

## Build via GitHub Actions

1. Push this repo to GitHub (with the two branding ZIPs in the root).
2. The workflow triggers automatically on push to `main` / `master`.
3. Download the APK from **Actions → your run → Artifacts**.

### What the workflow does

| Step | Action |
|------|--------|
| 1 | Checkout code |
| 2 | Node.js 20 |
| 3 | Java 17 (Temurin) |
| 4 | Android SDK 34 + build-tools 34.0.0 |
| 5 | `npm ci` — installs all dependencies |
| 6 | `npm install -g @capacitor/cli@6` |
| 7 | `npm run build` — Vite production build |
| 8 | `npx cap add android` |
| 9 | Extracts `projects_register_icons.zip` → correct mipmap folders |
| 10 | Extracts `projects_register_splash.zip` → correct drawable folders |
| 11 | Copies `icon_192x192.png` into `dist/` for in-app `<img>` use |
| 12 | `npx cap sync android` |
| 13 | `./gradlew assembleDebug` |
| 14 | Uploads dated APK artifact (30-day retention) |

### Icon density mapping

| File | Destination |
|------|-------------|
| `icon_48x48.png` | `mipmap-mdpi` |
| `icon_72x72.png` | `mipmap-hdpi` |
| `icon_96x96.png` | `mipmap-xhdpi` |
| `icon_144x144.png` | `mipmap-xxhdpi` |
| `icon_192x192.png` | `mipmap-xxxhdpi` |
| `icon_192x192.png` | adaptive foreground (all densities) |

### Splash density mapping

| File | Destination |
|------|-------------|
| `splash_640x640.png` | `drawable-mdpi`, `drawable-hdpi` |
| `splash_960x960.png` | `drawable-xhdpi`, `drawable-xxhdpi` |
| `splash_1280x1280.png` | `drawable-xxxhdpi`, `drawable` (fallback) |
| `splash_1920x1920.png` | `drawable-land` (landscape) |
| `splash_2732x2732.png` | `drawable-sw600dp` (tablets) |

---

## Local dev

```bash
npm install
npm run dev
```

## Manual Android build

```bash
npm run build
npx cap add android
npx cap sync android
cd android && ./gradlew assembleDebug
# APK: android/app/build/outputs/apk/debug/app-debug.apk
```

---

## Features

- **Dashboard** — stats, status breakdown, recently updated projects
- **Projects** — full CRUD, status filter, tags, notes, resource links, linked accounts/emails
- **Accounts** — account type registry + email registry, deletion safety
- **Add / Edit** — unified tabbed form (Project / Account Type / Email)
- **Settings** — JSON export/import backup, clear all data
- **Search** — real-time across all pages with match count
- **Storage** — Capacitor Preferences (device-local, no cloud)
