# Marginalia for iPad and phone: changelog

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
