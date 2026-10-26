# Marginalia for iPad and phone: changelog

## 1.4.1 (2026-10-25)
Fixes
- Focus: Notes darkened the screen but showed nothing (the panel was hidden in Focus); it now opens the Study notes.
- Focus pill: hides as soon as you start scrolling, comes back at the top of the page or when you tap the page.
- Filter: marks that don't match lose their color instead of fading the scripture text with them; notes that don't match are hidden.
- Android: the white strip under the app: the manifest's window colors are now dark by default (light kept as the light-mode preference). Remove and re-add the app to the Home Screen once.
Tweaks
- The study and the devotional keep separate Verses / Paragraphs settings.
- Notes: the first tap opens and selects a note, the second closes it; editing only from ••• > Edit note.

## 1.4.0 (2026-10-25)
New
- The desktop's look and layout, simplified: the desktop's Refined colors (light and dark), its slim frosted top bar (sidebar, title, sync dot, Focus, search, settings, right panel), the sidebar with Studies · Devotional (the open study as a raised card with its passage chip; docked on a wide iPad, floating on iPad portrait and phone), the study title on the page, the column header in the desktop's order (Verses ▾, translation ▾ | Margin ▾, Filter, Collapse), note cards whose marked words show in their own mark style, and the right panel with Study notes · Guide (Guide: summary, tags, every note with a jump to its verse). The bottom tab bar is gone.
- Focus: one tap for just the page at a reading width, with a floating pill (leave Focus, translation, Notes, Filter, Aa, ⋯) that fades while you scroll down; ⋯ opens Studies, Devotional, Search, Guide, Collapse notes, Settings and Leave Focus. Remembered per study.
- Marginalia's own text selection: press and hold a word, then drag (word by word, with handles); the Copy / Look Up menu no longer appears. Apple Pencil selects by drawing; a mouse or trackpad by dragging. Note boxes keep the normal selection.
- Verse menu: long-press (or right-click) a verse number: Note on this verse, Copy verse, Copy the reference.
- Devotional home like the desktop's: greeting and date, verse of the day (366-verse list, Read in context), the reading card with its ribbon (Begin / Another; Continue with when you started, what you last wrote and Start over; done with your counts, See my notes, Read again), template pill, Choose your own passage (type a reference or A Psalm / A Proverb / A Gospel passage / A letter), From your past readings, Recent with template dots, and the morning, afternoon, sunset and starry-night skies. Calendar and plan: in the sidebar on a wide iPad, behind a calendar icon on the phone.
Fixes
- Android: dark-mode colors for the app window (manifest), so the strip under the app should no longer show white in dark mode.

## 1.3.3 (2026-10-25)
Tweaks
- Devotional: every comment shows beside its verse (iPad: in the margin; phone: under the verse) in the desktop's margin-writing style, with the marked words as a small heading. Choosing Comment on selected words opens the box right there with the cursor in it; tap outside to finish (an empty new comment is removed). On an iPad each comment lines up with its own verse, even in the middle of a paragraph; on a phone it appears right after that verse (the paragraph continues below it). Replaces the comment bubbles and the separate tap-the-verse-number writing (still works, but no longer needed). Aa and ⋯ have Show / Hide comments instead of bubbles.

## 1.3.2 (2026-10-24)
Fixes
- Menus, the Filter, the translation and Verses menus did nothing on the live site: only part of 1.3 had been uploaded (new app.js with the 1.2 index.html and app.css), so the menu backdrop element was missing and every menu stopped with an error, and the 1.3 styles (devotional look, Filter, cards) were missing. app.js now adds any missing page parts itself and shows a message when app.css is from another version.
- The offline copy no longer picks up old files from the browser's cache when a new version installs (cache: reload).
- Paragraphs and poetry did nothing in KJV (no paragraph marks in its text): translations without paragraph data now use the WEB's paragraph and stanza breaks.
- Note cards: the title, marked words, tags and ••• stay on one line and inside the notes column (an old rule forced them onto separate lines).
- The filter chip in the header no longer wraps on a phone.

## 1.3.1 (2026-10-24)
Tweaks
- Home Screen, app and browser-tab icons are now the desktop app's icon (from build/icon-mac.png): full-bleed light tile for iOS, a maskable version with the art in the safe zone, and the rounded tile for the tab.

## 1.3.0 (2026-10-24)
New
- Shared devotional: readings are desktop-format study files (kind "devotional", dev.date, plan, tmpl, done) in the studies folder. Today's reading is whichever device creates it first; Another replaces the passage of an untouched reading on both. Portions are natural 8-20 verse passages from the WEB paragraph breaks (whole psalms up to 30 verses), from Psalms, Proverbs, the Gospels and the Epistles, with no repeats.
- 1.2's mobile-devotional.json entries are moved into desktop readings once (marked done, notes under their headings); the file is no longer written.
- Full-screen devotional mode in the desktop's devotional look (morning, dusk after 6 pm, evening in dark), floating controls on tap, swipe or Esc to leave, progress line, verse-number margin writing, comment bubbles, the six devotional templates in one formatted writing area, Done.
- The desktop's Filter pane: Just the text, Type, Color, Tags with counts; non-matching marks and notes fade; "#Tag · n ×" in the header; Delete these n marks (tap twice, Undo).
- Edit words-above marks (words, color) and connections (color, line style).
- What's new note after an update; keyboard shortcuts (Cmd+F, Cmd+[ ], Cmd+Shift+E/L/A/D, Cmd+/, Esc).
Tweaks
- Note cards in the desktop's look (soft card, pinned tag title with the marked words on one even line, note below); solid menus with headings and checks; Verses menu links to the text settings.
- Sync keeps going while changes are waiting.
Not in this release
- The desktop app icon on the Home Screen (waiting for the icon art).

## 1.2.1 (2026-10-25)
New
- Note options menu (•••) on a selected note: Edit note, pin a tag as the title, Delete the note (keeps the mark), Delete the mark and note.
Tweaks
- Tapping a note now selects it first (accent edge, its tags, •••); tap again to edit.
- A trash button in the mark bar when you tap an existing mark.
- Interface icons now match the desktop: the bespoke Margin-line icons for Studies, Devotional and Search, Iconoir (7.9.0, MIT) for everything else.
Not in this release
- The desktop app icon on the Home Screen: waiting for a copy of the desktop icon art.

## 1.2.0 (2026-10-22)
- Quieter design, collapsible notes, colors by the selection, formatted note box, no client ID screen.
