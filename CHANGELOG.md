# Marginalia for iPad and phone: changelog

## 1.6.0 (2026-10-28)
New
- Home (Start here): Marginalia opens to a greeting and the date, today's devotional (Begin / Continue / See my notes), Continue for the study you last had open, Continue reading for your place in the Bible (verse and a thin progress line), four doors (New study, Bible, Search, Devotional) and Recent across studies, Bible chapters and readings. Home sits at the top of the sidebar. On a wide iPad the devotional and Continue cards sit side by side and Recent runs in two columns.
- Bible: tap the reference ("John 1 ▾") and the page becomes a plain book list: the top bar turns into "Type a passage, or pick a book" (shows where it will go; Return opens it) with Cancel; Old Testament · New Testament; books grouped (Law, History, Poetry, Prophets / Gospels, History, Paul's letters, Other letters, Prophecy) in the Bible's serif; a soft dot by books you've read or studied; a tapped book opens its chapters as round numbers (current filled, read ones ringed); three columns on iPad. The sidebar's Bible tab no longer holds the book grids.
- Bible: your study marks show softly on the text (highlights, underlines, circles, comments in a lighter shade of their color); tap one for which study, the note, and Open the study.
- Bible: remembers the chapter and the verse you'd reached (and which chapters you've read to the end); Continue reading on the home page brings you back to that verse with "Back where you left off".
- Bible: a quiet "← Luke 24 · John 2 →" at the end of each chapter, and swiping left or right moves between chapters.
- Devotional: ⋯ > Read the whole chapter opens the chapter in the Bible with today's verses marked by a warm line, and "← Back to today's reading".
- Devotional: Share this reading (share icon beside Aa, and ⋯): a sheet (phone, iPad portrait) or a two-pane dialog (iPad landscape) with a live card preview; verses From/To (default: the marked verses); Square / Portrait / Story; Notes below / beside; Paper, Plain, Dark, Sunset and ten solid colors; Include page (highlights and underlines, each note off until turned on, takeaway from a section of your writing and editable, your name, Marginalia badge); Share image… opens the device's share menu with the PNG (1080 wide), Save image downloads it, Copy as text follows the desktop's rules.
Tweaks
- Bible Aa: the devotional's text settings plus Layout and a Page color (Paper, Morning, Evening), kept for the Bible only.
- Focus: leave it from the same top-right spot you entered it; that button fades with the pill. The pill keeps only reading tools.
- Devotional: Overall thoughts no longer sit under the passage: a small pen pill (at the left on a wide iPad, bottom left elsewhere; with the first line once you've written) opens them as a pane at the left (wide iPad, the reading slides right) or a sheet; Close folds it back.
Fixes
- Selecting scripture while a note box had the caret: the colors disappeared at once (the note box's caret cancelled Marginalia's own selection).
- Tapping a verse number to write beside it did nothing while the overall thoughts were open.

## 1.5.0 (2026-10-26)
New
- The Bible: a Bible tab in the sidebar (Studies · Bible · Devotional) with every book and its chapters; the chapter opens in its own translation (Translation ▾), with previous/next chapter, Verses or Paragraphs, and Focus. A dot by every verse that's in one of your studies opens that study at the verse (or lists them if several). Select words to "Start a study at" that verse, or Copy them.
- New study: at the top of the sidebar's Studies tab. Passage (typed, e.g. John 3:1–21 or Romans 8), title (the passage if left empty), series (your series suggested), translation. Saved to OneDrive as a desktop-format study file, with Study notes started as Observe / Interpret / Apply, and opened ready to mark.
- Study notes are editable in the right panel, formatted as you type (saved as Markdown in the study's outline, as on the desktop). Resize the right panel: drag its left edge on the iPad (width remembered), or drag the phone sheet's grab bar up or down (height remembered).
- Notes as dots: Margin ▾ > Dots. Each note becomes a small dot in its tag's or mark's color at the end of its verse; tap it to open that note right there, tap again to close it.
Fixes
- (1.4.8, not yet on the site) the iPad bottom band: the app fills the strip the iPad left empty under it.

## 1.4.8 (2026-10-26)
Fixes
- iPad bottom band, found with About this screen: the installed app is 922 px high on a 954 px screen and starts at the very top (under the clock), so a strip exactly the clock's height (32 px) was left empty at the bottom. iPadOS sizes the page as if the clock still took room at the top. When the missing height matches the clock's space, the app now takes the full screen height. About this screen shows whether the fix applied.

## 1.4.7 (2026-10-26)
Fixes
- Phones and iPad portrait: Settings, the Devotional tab and anything else in the floating sidebar (and the right panel sheet) did nothing. 1.4.6's position:fixed on the app put them under the dimmed backdrop, so every tap closed the sidebar. The app is now pinned with position:absolute, which doesn't change the layering; checked with real taps in Chrome.
- The Devotional tab in the sidebar opens the devotional home on every screen size (on a phone it used to only switch the sidebar's tab).
- iPad bottom band, third look: Settings > About this screen shows what the iPad reports (window, visible area, screen, large viewport, safe areas, the app's height); and where the iPad's large viewport is taller than the window the app was given, the app uses it.
Tweaks
- iPad: a handle on the line between the scripture and the notes; drag it to make the notes wider or narrower (remembered; double-tap to reset).
- Editing a note is a line shorter: the title, the marked words, the mark's kind and its color dot share one row; tap the mark or the dot for all kinds and colors. No more blue bar beside the text.
- Settings moved from the top bar to the bottom of the sidebar, by the Synced line, on every screen size.

## 1.4.6 (2026-10-26)
Fixes
- Still a band at the bottom of an iPad window after reinstalling (James's screenshot, 1.4.4): the app was sized with height:100%, which on the iPad stops above the strip by the home indicator. The app is now pinned to all four edges of the window (position:fixed, inset 0), and behind it the page color matches the bottom of the current screen (the devotional home's sky, the reading page).
- The line under the top bar and the line under the sidebar's (and right panel's) tabs didn't meet: both are now the same height (54 px plus the clock's space).

## 1.4.5 (2026-10-26)
New (the three note items James had put on 1.4.2, which was built without them)
- Edit a note in place: ••• > Edit note turns the card itself into the editor where it sits (accent ring). Along its top: the mark kinds (highlight, underline, circle, comment) drawn in the mark's color, the six colors and •••; for words-above, the words; for a connection, the line style. Its tags along the bottom. Tap outside to finish. The separate editor panel and sheet are gone.
- B · I · U: select words in a note (also Study notes and the devotional writing) for a small Bold · Italic · Underline pop-up under them. Underline is kept as <u>…</u> in the note's Markdown.
- Tags like the desktop's: type # in a note and your tags appear (most used first, in their colors; Enter or Tab picks; "New tag"); the #word leaves the text and joins the tags. "+ Tag" does the same with a small box. Tap a tag: Pin as the title (or Unpin), a color for that tag (the study's tag colors, as on the desktop), Manage tags…, Remove from this note. Manage tags (also in the Filter's Tags heading): every tag with its color and how many notes and studies use it; Rename (rename onto another tag to merge), Color, Delete (with Undo), across all studies.

## 1.4.4 (2026-10-26)
Fixes
- A band at the bottom of the window (and under the clock) cut the page off, worst in an iPadOS window, in Focus, the devotional and the devotional home. The page itself no longer leaves room for the clock and the home indicator; instead the top bar, sidebar, right panel and each page keep their own content clear of them, so backgrounds (the top bar, the sidebar, the skies, the reading) run to every edge and the text scrolls to the very bottom.

## 1.4.3 (2026-10-26)
Fixes
- After selecting words, the first tap on a color didn't mark them (it took two). The long-press set a flag to swallow the click that can follow it, but on the iPad no such click comes, so the flag swallowed the next real tap. Now only a click within half a second of the long-press is ignored, and never a tap on the colors or a menu.
- (From 1.4.2, which wasn't on the site yet) the selection tint is drawn by Marginalia itself, so it shows in light and dark mode on every iPad.

## 1.4.2 (2026-10-26)
Fixes
- Selecting words in the devotional (and anywhere else) didn't show the selection on the iPad: the tint relied on the CSS Highlight API, which didn't paint there. The selection is now drawn as its own tinted shapes under the words.
Tweaks
- An existing underline, circle or comment: the colors recolor it; the highlighter (new in the bar) turns it into a highlight. Tapping a highlight's own color still removes it.
- Edge to edge: the page runs under the clock (status bar style black-translucent, with a faint shade behind the clock only on light pages) and its own color fills the space by the home indicator, so the devotional and Focus have no bands at the top or bottom. Remove and re-add the app to the Home Screen once.

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
