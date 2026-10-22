# Marginalia for iPad and phone (version 1.0)

Reads your Marginalia studies from OneDrive, lets you mark and annotate them, and saves the changes back into the same study files the desktop app uses. It also has a devotional that syncs between your phone and iPad.

## 1. Put the files on GitHub Pages

1. In the repository (github.com/jamesgoering/Marginalia), delete the old demo files: `index.html`, `sw.js`, `manifest.webmanifest`, `README.txt`, the `fonts` and `icons` folders, and the `marginalia-mobile-0.5` folder.
2. Upload the new files, keeping the folders as they are. GitHub's web uploader takes 100 files at a time, so do it in two rounds:
   - Round 1: everything except the `data` folder, plus `data/kjv`.
   - Round 2: `data/web`.
3. Settings > Pages: "Deploy from a branch", branch `main`, folder `/ (root)`. The app's address will be **https://jamesgoering.github.io/Marginalia/**.

## 2. Register the app with Microsoft (one time, about 10 minutes)

Your studies are in your Christian Light OneDrive, so the app has to be registered in that Microsoft 365 organization.

1. Go to **https://entra.microsoft.com** and sign in with your work account.
2. Applications > App registrations > **New registration**.
   - Name: `Marginalia`
   - Supported account types: **Accounts in this organizational directory only**
   - Redirect URI: choose **Single-page application (SPA)** and enter `https://jamesgoering.github.io/Marginalia/` (with the slash at the end)
   - Register.
3. On the app's Overview page, copy the **Application (client) ID** and the **Directory (tenant) ID**.
4. API permissions > Add a permission > Microsoft Graph > Delegated permissions: add **Files.ReadWrite** (User.Read is already there).
5. Put the two IDs in `config.js` (or paste them into the app's first screen):

```js
window.MARGINALIA_CONFIG = {
  clientId: 'paste the Application (client) ID',
  tenant: 'paste the Directory (tenant) ID',
  folder: 'Documents/Marginalia'
};
```

If you can't create app registrations, or signing in later says the app **needs admin approval**, your organization requires IT to do this step or approve the permission. Show them this section; the app only asks to read and write your own files.

## 3. Install on the iPad or iPhone

1. Open https://jamesgoering.github.io/Marginalia/ in Safari.
2. Sign in with your work account.
3. Share > **Add to Home Screen**, and use the Home Screen icon from then on.

The sign-in lasts about a day. When it runs out, the app keeps showing your saved studies and asks you to sign in again to sync.

## Bible text

- **KJV and WEB** are included and work offline.
- **NET** comes from the NET Bible website (no key needed).
- **ESV** needs your ESV API key, and **NKJV, CSB and NLT** need your API.Bible key. Paste them in Settings; they are the same keys as in the desktop app's keys.json. They stay on that device.
- A chapter is saved on the device the first time it's opened, so it works offline after that.
- BSB and ASV aren't available yet.

## How saving works

- Marks, notes, tags and deletions are saved straight into the study file in `Documents/Marginalia/studies`, in the desktop app's format.
- Each save checks that the file hasn't changed since it was read. If the desktop saved it in between, the app reads the new version and adds its changes on top, so nothing from the desktop is lost.
- Without internet, changes wait on the device and sync later.
- **Close a study on the computer before marking it on the iPad.** A study that is open on the computer is held in the desktop app's memory, and the next save there can overwrite changes made on the iPad.

## Updating later

Upload the changed files, and change the `VERSION` line in `sw.js`. The app shows "A new version is ready" the next time it's opened online.

## Credits

KJV text: scrollmapper bible_databases (public domain). WEB: world-english-bible (public domain). Fonts: Inter, Source Serif 4, Literata (SIL Open Font License). Sign-in: Microsoft Authentication Library (MIT, vendor/LICENSE-msal.txt).
