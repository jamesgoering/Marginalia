# Marginalia for iPad and phone: changelog

## 1.7.1 (2026-10-30)
Tweaks
- Reading settings open just above the Aa button on the iPad, lined up with the settings button, which stays open. On the phone they open from the bottom and the settings button slides away underneath until you close them.
- Translation and Font open as small lists on top of reading settings, which stay open underneath; picking one closes the list, and a tap elsewhere in the panel closes just the list.
- The Bible remembers one page color for light mode and one for dark, and switches when the iPad does. Your earlier choice moves into the matching mode.
- On the phone, a note's ••• pop-up opens by the note (as on the iPad) instead of as a sheet at the bottom.
Fixes
- The study title at the top was cut off or hidden until you scrolled (the column header painted a band over it). The band is now drawn only once the header sticks, and only as tall as the space above it.

## 1.7.0 (2026-10-30)
New
- The command box. ⌘K on an iPad keyboard (↑ ↓, Return, Esc), or the search icon that now starts every settings button; on a phone you can also pull down on a page's heading or hold the settings button. Before you type: your recent commands and the main places. As you type: Go to (passages with autofill and abbreviations — "rom 8" → Romans 8 — books, studies by title, Home, Bible, Devotional, Today's reading, Settings), Studies on that passage, Actions (Focus, New study / New study at a passage, Share this reading, Filter, Study notes, Overall thoughts, Reading settings), Settings (page color, translation, notes display, layout, font, appearance) and, always last, Search for "…". This also gives studies their Search back.
Tweaks
- Reading settings (Aa) in one light style on every page: no filled buttons, the chosen option underlined. This page's choices first — studies: Translation, Layout, Notes; the Bible: Translation, Layout, Page (four colors with names); the devotional: Translation, Layout, Comments (Beside / Under / Hidden), Light — then Text: Font, Size, Spacing, Verse numbers. Translation and Font open as lists inside the panel (‹ Reading to go back). The panel follows dark mode (the devotional's uses its night colors), stays open while you change things, and redraws in place.
- Devotional: "☀ Devotional › Friday, October 30" at the top (tap Devotional to go home) with the nearby days that have readings at the right (‹ › on the iPhone); it scrolls away with the page. In the settings button, the sunrise takes you to the devotional home and a journal opens your overall thoughts.
Fixes
- The devotional's settings button now fades while you read, like the Bible and studies; it comes back when you tap, scroll up a little, or reach the top or the end.

## 1.6.7 (2026-10-30)
Fixes
- Selecting text showed no tint on iPad and no handles on Android, in studies, the Bible and the devotional: since 1.6.5 the tint and handles were drawn on a layer that was never shown. It shows again.

## 1.6.6 (2026-10-30)
Tweaks
- The Bible's page colors are now four: Light, Sepia, Dark and Black (earlier choices move to the nearest: Morning and Parchment → Sepia, Sage and Mist → Light, Dusk and Evening → Dark, Night → Black). With none chosen, the page follows the app's light or dark look.
- The devotional's scroll-progress line at the top is gone (code and styling).
Fixes
- Georgia, Charter and Palatino looked the same on most devices (the app asked the device for fonts it doesn't have). They now come with the app: Gelasio for Georgia, Charis SIL for Charter and Domitian for Palatino (a free Palatino revival; TeX Gyre Pagella isn't published in a form the app can include), all kept for offline use. Aa keeps the familiar names.
- Studies Aa: Notes (Margin / Under / Dots / Hidden) didn't always switch; one action now sets it, redraws the page and Aa, and clears Hidden. No Margin on phones (a saved Margin shows as Under there).
- Studies Aa listed only the study's own translations (often just KJV); it now lists every translation available.
- Devotional: comments on a word or phrase were gathered at the bottom of the paragraph's margin; comments now go in verse order, each beside its own verse.
- Studies and the Bible: text could show above the column header (and the sticky title) while scrolling, with margin notes showing through; the header now covers the space above it.

## 1.6.5 (2026-10-29)
Tweaks
- No top bar on Studies, the Bible and Home: each page starts with its own heading (study title and passage; the Bible's book and chapter with the translation, plain text; Home's greeting), with the sidebar button beside it; a small sticky title appears once you scroll. Studies keep the column header under the heading.
- One settings button at the bottom right on every reading page, opening into icons: Studies — Study notes · Filter · Aa · Focus; the Bible — chapter ▾ · translation ▾ · Search · Aa · Focus; the devotional — back to Today · Aa · Share · Overall thoughts · ⋯. Focus is an expand icon; in Focus it becomes a collapse icon on the accent color. It closes when tapped, when you scroll, after a few seconds, or when you change pages. Replaces the Bible's floating Focus button and the Focus pills.
- Studies: Aa now starts with Translation, Layout (Verses / Paragraphs) and Notes (Margin / Under / Dots / Hidden). Focus uses the full width (the text starts at the left edge, the notes keep their width).
- Aa stays open while you change things, with the page updating behind it (also in the Bible); it closes when you tap outside it.
- The Bible's passage lines (the list and the sidebar) fill in the book name as you type, list the matches, and understand abbreviations (Gen, Ps, Mt, Jn, 1co, 1 Thess…); Tab or → accepts.
- No rings on chapters you've read.
Fixes
- Bible scrolling: chapters are now added in place at the end (and fill in when their text arrives) instead of rebuilding the page, and nothing is added above you; a quiet "↑ Luke 24" link at the top opens the chapter before. Scrolling across chapter breaks no longer jumps.
- Selection runs across verses: in the Bible, New study and Copy use the whole range (e.g. John 7:11–15); in studies and the devotional one mark covers each verse (a span per verse, as the desktop saves it). Dragging near the top or bottom edge scrolls.
- The Bible's "Start a study at…" button wrapped one word per line; it is now "+ New study" with the reference small underneath, on one line.
- The dots beside read books were stretched into tall ovals on iPad (a clashing style name).

## 1.6.4 (2026-10-29)
Tweaks
- Devotional reading: always the calm, focused look (small date and passage at the top, no slim line, no Focus). One settings button at the bottom right opens into ‹ Today · Aa · Share · ✎ Overall thoughts · ⋯ and closes itself after a few seconds; the separate pen button is gone.
- Studies: the desktop-style column header is back (Verses ▾ and the translation over the text; Margin ▾, Filter and Collapse over the notes). The top line is quiet (title, Study notes panel, ⋯) and takes the page's own color, with a hairline only once you scroll. Focus is in ⋯; no floating Focus button in studies (the Bible keeps its own).
- Studies: drag the line between the scripture and the notes much further (the scripture down to about 240 px), also in Focus; the handle is just the hairline until you touch it.
- The Bible on iPad: a comfortable centered reading column (about 680 px).
Fixes
- Share card: highlights and underlines keep their own colors; notes beside sit level with their verse; the notes to include are listed in verse order.
- Bible: highlights were too faint on the light page colors; scrolling could race through chapters (chapters now load one at a time once the page has come to rest); the sidebar no longer jumps while you read or pick a chapter (it's redrawn only when it changes, keeps its scroll, and keeps the book you opened); read chapters' circles were drawn off to the side on iPad (a clashing style name).
- Aa: picking a page color no longer jumps the panel back to the top.
- Home: the finished-reading card was squeezed into one row and sat lower than the cards beside it (a clashing style name); Recent no longer fills with every chapter you scroll past (a chapter is added once you stop to read it or reach its end, one entry per book).
- iPad bottom band: the fill now measures again after the page settles and when the iPad rotates; About this screen measures fresh each time.

## 1.6.3 (2026-10-28)
Tweaks
- The Bible: one slim line (sidebar · "Exodus 5 ▾" · translation ▾ · ⋯) instead of the bar, heading and column header; Focus floats at the bottom right. Chapters run on as you scroll (the next one loads below, the one before above), each starting with a large chapter number; the slim line follows the chapter you're in. Focus: the line goes away, a modest chapter heading sticks at the top, and one pill (Home · passage · translation · ⋯ · Focus) sits in the Focus corner and fades while you read. ⋯: Reading settings, Search the Bible, Studies, Devotional. Swiping still jumps a chapter.
- Eight page colors for the Bible (Paper, Morning, Parchment, Sage, Mist, Dusk, Evening, Night), a row of circles in Aa; the screen and the slim line take the color.
- Studies: one slim line (sidebar · title · translation ▾ · Study notes panel · ⋯), the passage as a small label, the filter chip beside it when on; ⋯ holds Verses/Paragraphs, Notes layout, Filter, Collapse, Reading settings, Search. Focus: a small sticky heading and the pill Notes · translation · Filter · ⋯ · Focus.
- Devotional: a slim line in the reading's colors (‹ Today · passage · date · Share · ⋯) replaces the tap-to-show controls; Focus: a small sticky date and passage and the pill ‹ Today · Aa · Share · ⋯ · Focus; the pen sits above the pill.
- Sidebar: the Bible tab is the book and chapter list (with a passage line); Home is the house at the bottom right.
- Gentle animations: chapters slide in (from the right going on, the left going back), a book's chapters unfold, the testaments fade; none with Reduce Motion.
Fixes
- Back on Android (and the iPhone/iPad edge swipe) closed the app: each move and each open sheet or sidebar now adds a back step; back closes what's open first, then goes to the previous screen, and leaves the app only from where you started.
- The selected chapter's circle was off-center (buttons inherited left alignment).
- Share sheet: the selected style's ring was clipped, the size and notes switches were uneven, the Include row hid behind the buttons, button labels sat left, and the preview filled the phone; all fixed.

## 1.6.2 (2026-10-28)
Fixes
- Share: the From / To verse pickers could be empty and do nothing. They were built only from the reading's first chapter (verse v1 to v2), so a reading that crosses chapters (say 15:30–16:5) gave an empty list. They now list every verse of the reading across its chapters (16:1 … or 22:30, 22:31, 23:1 …), the card and Copy as text follow, and the preview waits for a second chapter to load. The pickers are also larger, with 16 px values (so the iPad doesn't zoom) and their own arrow.

## 1.6.1 (2026-10-28)
Fixes (a review of 1.6's devotional and Bible views)
- Devotional: the page's last closing tag was doubled when the writing area moved, so the controls, the overall thoughts pen and the hint sat outside the reading page. The pen then had the wrong colors (unreadable in the dark), and on a phone it covered the last lines and the Done row. The page is whole again, the pen has its own light and dark colors and a soft shadow, the reading leaves room under it, and the "Tap to show controls" hint moved to the right.
- Devotional: See my notes (devotional home, done card) opens the overall thoughts (it used to scroll to the old writing area).
- Read the whole chapter changed your Bible translation for good (to the reading's); it now only uses the reading's translation for that visit. It no longer scrolls the heading away for readings that start near verse 1, and moving to another chapter or translation ends the "today's reading" view.
- Today's verses in the Bible are a soft warm wash instead of boxes with a bar.
- Bible: no space after verse numbers; now there is.
- Bible, Evening or Morning page: only the text area changed; the top bar and the space around the page now match.
- Typing in the Bible's passage line, the devotional's passage box, or the share card's takeaway or name could be wiped by a sync redraw; the redraw now waits.
- Share from the devotional switched the app's open study to the devotional reading; it no longer does.

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
