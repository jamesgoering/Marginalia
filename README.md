# Marginalia for iPad and phone (version 1.2)

Reads your Marginalia studies from OneDrive, lets you mark and annotate them, and saves the changes back into the same study files the desktop app uses. It also has a devotional that syncs between your phone and iPad.

## 1. Put the files on GitHub Pages

1. In the repository (github.com/jamesgoering/Marginalia), delete the old demo files: `index.html`, `sw.js`, `manifest.webmanifest`, `README.txt`, the `fonts` and `icons` folders, and the `marginalia-mobile-0.5` folder.
2. Upload the new files, keeping the folders as they are. GitHub's web uploader takes 100 files at a time, so do it in two rounds:
   - Round 1: everything except the `data` folder, plus `data/kjv`.
   - Round 2: `data/web`.
3. Settings > Pages: "Deploy from a branch", branch `main`, folder `/ (root)`. The app's address will be **https://jamesgoering.github.io/Marginalia/**.

## 2. Register the app with Microsoft (one time, about 10 minutes)

The app signs in with your **personal Microsoft account** and uses your personal OneDrive.

1. Go to **https://entra.microsoft.com** and sign in with your personal Microsoft account (the one your personal OneDrive uses).
   If it says your account has no directory, you need a free Azure account first (https://azure.microsoft.com/free); Microsoft no longer lets personal accounts register apps without one.
2. Applications > App registrations > **New registration**.
   - Name: `Marginalia`
   - Supported account types: **Personal Microsoft accounts only**
   - Redirect URI: choose **Single-page application (SPA)** and enter `https://jamesgoering.github.io/Marginalia/` (with the slash at the end)
   - Register.
3. On the app's Overview page, copy the **Application (client) ID**.
4. API permissions > Add a permission > Microsoft Graph > Delegated permissions: add **Files.ReadWrite** (User.Read is already there).
5. Put the ID in `config.js`. With it there, nobody is asked for it: the app opens straight to "Sign in with Microsoft". (Without it the app says the site isn't set up yet; you can still paste it under Settings > Advanced on one device.)

```js
window.MARGINALIA_CONFIG = {
  clientId: 'paste the Application (client) ID',
  account: 'personal',
  tenant: '',
  folder: 'Documents/Marginalia',
  keysPath: 'Apps/Marginalia/keys.json'
};
```

`folder` is the OneDrive folder that holds the `studies` folder, counted from the top of your personal OneDrive. `keysPath` is where the desktop app keeps keys.json; the app reads your ESV and API.Bible keys from it, so you don't have to type them.

A work or school account still works: choose "Work or school" under Settings > Advanced (or set `account: 'work'` and fill in `tenant` with the Directory (tenant) ID).

## 3. Install on the iPad or iPhone

1. Open https://jamesgoering.github.io/Marginalia/ in Safari.
2. Sign in with your personal Microsoft account.
3. Share > **Add to Home Screen**, and use the Home Screen icon from then on.

The sign-in lasts about a day. When it runs out, the app keeps showing your saved studies and asks you to sign in again to sync.

## Bible text

- **KJV and WEB** are included and work offline.
- **NET** comes from the NET Bible website (no key needed).
- **ESV** needs your ESV API key, and **NKJV, CSB and NLT** need your API.Bible key. They're read from the desktop app's keys.json in OneDrive; if that doesn't work, paste them in Settings. They stay on that device.
- A chapter is saved on the device the first time it's opened, so it works offline after that.
- BSB and ASV aren't available yet.

## How saving works

- Marks, notes, tags and deletions are saved straight into the study file in the `studies` folder, in the desktop app's format.
- Each save checks that the file hasn't changed since it was read. If the desktop saved it in between, the app reads the new version and adds its changes on top, so nothing from the desktop is lost.
- Without internet, changes wait on the device and sync later.
- **Close a study on the computer before marking it on the iPad.** A study that is open on the computer is held in the desktop app's memory, and the next save there can overwrite changes made on the iPad.

## Updating later

Upload the changed files, and change the `VERSION` line in `sw.js`. The app shows "A new version is ready" the next time it's opened online.

## Credits

KJV text: scrollmapper bible_databases (public domain). WEB: world-english-bible (public domain). Fonts: Inter, Source Serif 4, Literata (SIL Open Font License). Sign-in: Microsoft Authentication Library (MIT, vendor/LICENSE-msal.txt).

## What's new in 1.2

- Quieter screens, borrowed from the desktop app: one header line ("KJV ▾ · Verses ▾ … Collapse · Filter") instead of rows of chips, underlined tabs, search and settings as icons, a sync dot, two tabs (Studies, Devotional), Figtree as the interface font.
- Collapse / Expand folds every note to one line; tap a note to open just that one.
- No Mark button: select words and the colors pop up beside them (••• for underline, circle and comment). Tap a mark to change it; tap its color again to remove it (with Undo).
- The note box shows formatting as you type, with no buttons (Bold and Italic from the iOS text menu, or Cmd+B / Cmd+I). Tap outside to finish.
- iPad: the sidebar uses the lighter tone, the open study is a raised card, the ‹ caret folds it to a strip, and "Margin ▾" switches the notes between beside and under the text.
- The client ID screen no longer appears when config.js has the ID.
