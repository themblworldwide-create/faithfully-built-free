# Faithfully Built — Free Chapter Page (`/free`)

Everything lives in the `free` folder. It doesn't touch your homepage or book sales pages.

## Add it to faithfullybuiltlife.com

1. Open the folder you normally drag into Netlify for faithfullybuiltlife.com.
2. Copy this `free` folder into it, next to your homepage's `index.html`.
3. Drag the whole site folder into Netlify (Deploys → drag and drop), same as always.
4. Visit `https://faithfullybuiltlife.com/free` to check it.

Your folder should look like this:

```
your-site/
  index.html          ← your existing homepage (unchanged)
  ...your other pages
  free/
    index.html
    config.js         ← the only file you edit
    main.js
    assets/
      book-cover.jpg, book-cover.webp, book-cover-480.webp, og-image.jpg
```

If you use a framework or build step instead of plain files, put the `free` folder in its public/static folder (often `public/`).

## Change settings — edit `free/config.js` only

| Setting | What it does |
|---|---|
| `LAYLO_URL` | Where both buttons go. Already set to your Laylo link. |
| `META_PIXEL_ID` | Paste your Pixel ID. Empty = no pixel loads. |
| `PRIVACY_POLICY_URL` | Your privacy policy page. **Make sure this page exists** — Meta requires one when you run the pixel. |
| `AUTHOR_PHOTO` | Put your photo in `free/assets/` and write e.g. `"assets/isaiah-lee.jpg"`. Portrait (4:5) works best. Until then, the author note shows on its own with no photo space. |
| `REQUIRE_CONSENT` | `true` shows a small cookie notice and waits for "Accept" before loading the pixel. |

## Replace the book cover

Swap the three files in `free/assets/` (`book-cover.jpg`, `book-cover.webp`, `book-cover-480.webp`) using the same names. Keep the 2:3 shape. Also replace `og-image.jpg` (1200×630) — that's the preview picture when the link is shared.

## Tracking

- **PageView** fires when the page loads (only if a Pixel ID is set).
- **FreeChapterClick** (custom event) fires when either button is tapped, with `cta_location` = `hero` or `closing`. Use it in Events Manager to see which button works better.
- **No Lead event is sent from this page.** A click isn't a signup. Count real signups on Laylo's side: check Laylo's settings for a Meta Pixel / conversion tracking integration and connect the same Pixel ID there so a Lead fires only after someone actually signs up.
- **UTMs carry through.** Ad links like `/free?utm_source=facebook&utm_campaign=book-launch` pass `utm_*` and `fbclid` on to the Laylo link. Untagged visits are labeled `utm_source=free-chapter-page`, and `utm_content` records which button was used.
- Visitors with Global Privacy Control turned on are never tracked.

## Ad link to use

```
https://faithfullybuiltlife.com/free?utm_source=facebook&utm_medium=paid&utm_campaign=free-chapter
```
(Use `utm_source=instagram` for Instagram placements, or set it with Meta's URL parameters.)

## Other notes

- `og:url`, canonical, and `og:image` in `free/index.html` point to faithfullybuiltlife.com. If the page lives on a different domain, update those 3 lines in the `<head>`.
- The "What you'll receive" copy stays general on purpose; if you want to name what the chapter actually covers, edit those three short lines in `index.html`.
