# Energising Futures: homepage and search prototype (build brief)

**For:** Claude Code
**From:** Loop Design (Phil Clarke)
**Client:** We Are Futures, for energisingfutures.co.uk
**Goal:** a clickable, deployable prototype of the new homepage and search journey, hosted on Vercel for the client team to review.

Read this file first. Then open each file in `design/` in a browser next to it while you build.

---

## 1. What we're building and why

Energising Futures is a free STEM teaching hub for UK teachers, covering ages 4–16. The live site is WordPress and it has two problems:

- **The homepage doesn't say what the site is.** The hero is just whatever campaign is running. It's followed by three near-identical carousels.
- **Search is poor.** It's exact-match only: "magnets" returns 0 but "magnet" returns 2, and typos, plurals and phrases like "year 5 circuits" all return nothing. Results come back as one flat list. Filters are hidden in a modal with no counts, so teachers can filter down to zero results.

This prototype shows the fix. It is **not** the production rebuild. There's no CMS, no auth and no real downloads. The content comes from local JSON scraped from the live site, and card links open the real live pages. But it has to *feel* real: real content, real images, and search that works properly.

## 2. Stack

- **Nuxt 3** (Vue 3, `<script setup>`, TypeScript), deployed to **Vercel** (the Nuxt preset is auto-detected).
- **Styling:** Tailwind CSS, with the tokens in §5 set up in `tailwind.config`. Scoped CSS is fine for one-offs (hover lifts, the hero collage).
- **Search:** [Fuse.js](https://www.fusejs.io/), run client-side over `data/catalogue.json`. Wrap it in a composable (`useSearch`) so it can be swapped for a server or Algolia later.
- **Fonts:** Poppins (headings, 600/700/800) and Figtree (body, 400–800) from Google Fonts via `@nuxtjs/google-fonts`. Figtree is a **stand-in for Proxima Nova**, the live site's body font, which is on Adobe Fonts. Keep the font family in one token so it's a one-line swap.
- No UI kit. The components are simple and should match the designs exactly.
- Make the whole site statically generated (`nuxi generate`), with `/search` rendered client-side.

## 3. What's in this folder

```
build-handoff/
  BRIEF.md                 ← this file
  design/                  ← the approved screens, as HTML reference (open in a browser)
    01-homepage.html
    02-search-typeahead.html
    03-search-results.html   ← interactive: tabs, chips and filters with live counts work
    04-search-no-match.html
    05-homepage-signed-in.html
  assets/
    brand/ef-logo.svg            ← the real logo
    brand/assorted-icons-1.svg   ← the brand's line-doodle illustration (hero background)
    thumbnails/*.jpg             ← 69 real thumbnails from the live site, 800px wide
    people/imisi.png, james.png  ← circular role-model crops (transparent PNG)
    people/amelia.jpg            ← video still (portrait crop, play icon is baked in)
  data/
    catalogue.json       ← 98 real items (resources + collections), normalised (see §4)
    homepage.json        ← which items appear in which homepage section
    people.json          ← role models for the careers band and type-ahead
    search-config.json   ← synonyms, year-group mapping, stopwords, topics
  scripts/
    scrape-catalogue.mjs ← optional: rebuilds catalogue.json from the live site (~625 items)
```

**About the design files:** they were authored in a design-canvas format. `<x-dc>`, `<helmet>`, `<sc-for>`, `<sc-if>` and `{{holes}}` are template syntax, and each file's logic sits in the `class Component` at the bottom. Treat them as the visual spec, with exact spacing, colours, copy and states. **Don't ship them or copy the template syntax.** Rebuild them as Vue components. The inline styles carry the exact values: use those, not guesses.

Copy `assets/` into `public/` so that `/thumbnails/…`, `/brand/…` and `/people/…` resolve. `catalogue.json` already uses those paths in `image.local`.

## 4. Content model

The live site has four content types: Resource, Lesson, Content series and Collection. **We are folding these down to two:**

| Kind | What it is | Card action |
|---|---|---|
| **Resource** | One asset: a PDF, PowerPoint, video or interactive | Download / Open / Watch / Launch (by format) |
| **Collection** | A themed set of resources. Old Lessons and Content series become collections. | View collection |

`legacyType` stays on each item (`resource` / `lesson` / `content series` / `collection`) for reference only. Never show it in the UI.

### `catalogue.json` item schema
```ts
type Age = '4-7' | '7-11' | '11-14' | '14-16'
interface Item {
  id: string                 // slug from the live URL
  kind: 'resource' | 'collection'
  legacyType: string
  title: string
  level: ('Primary' | 'Secondary')[]
  ages: Age[]                // normalised bands (see note)
  agesOriginal: string[]     // as on the live site
  format: 'PDF' | 'PowerPoint' | 'Video' | 'Interactive' | null   // resources only
  resourceCount: number | null                                     // collections only
  description: string        // may be '' for some collections
  liveUrl: string            // the real page; cards link here (new tab) for now
  image: { remote: string; remoteLarge: string; local: string | null }
}
```
- **Images:** use `image.local` when it's set. Otherwise fall back to `image.remote`, which hotlinks the live site's thumbnail. That's fine for a prototype. Add `energisingfutures.co.uk` to Nuxt Image domains if you use `@nuxt/image`.
- **Age bands:** the live site uses 4-7, 7-9, 9-11, 7-11, 11-14 and 14-16. The new design uses **four bands**: 4–7, 7–11, 11–14 and 14–16. In the normalised data, 7-9 and 9-11 have been folded into 7–11. *This is an open question for the client, so keep the mapping in one place* (`search-config.json → ageBands`).
- **Display:** age labels use an en dash ("7–11"). Data keys use a hyphen.
- **Topics:** the live site doesn't expose topics on cards. For the prototype, tag each item with topics by matching keywords from `search-config.json → topics` against title and description, at load time. Topic tags render as clickable pills that run a search.

### Getting more content (optional)
`scripts/scrape-catalogue.mjs` crawls the homepage, `/collections/`, and every page of `/levels/primary-resources/` and `/levels/secondary-resources/`, then writes about 625 items in the same schema. Run it with `node scripts/scrape-catalogue.mjs`, which needs Node 18+ and `npm i cheerio`. Use it if the 98 items feel thin. Everything in the designs is already in the 98.

## 5. Design tokens

**Colour**
| Token | Hex | Use |
|---|---|---|
| `navy` | `#110E63` | Text, primary buttons, dark bands |
| `navy-700` | `#1F1B7A` | Cards on the navy band |
| `muted` | `#4A4785` | Secondary text (passes 4.5:1 on white) |
| `on-navy` | `#D9D8F0` / `#C9C8E6` | Body text / labels on navy |
| `sky` | `#8FB4DC` | Homepage hero background |
| `sky-50` | `#D6E6F5` | Search header band, Secondary card |
| `teal-50` | `#D7EBEB` | Primary card |
| `lilac-50` | `#F3F3F9` | Alternate section background |
| `lilac-25` | `#F7F7FB` | Filter panel |
| `line` | `#E4E3F2` / `#E9E9F1` / `#DCDCEA` | Borders |
| `yellow` | `#FFCF2C` | Accent: highlights, badges, the Interactives band, CTA on navy |

**Age colours.** Text on top of these is always navy. Every small age pill gets `box-shadow: 0 0 0 2px #fff` so it stays visible on any background (a 2023 UX audit recommendation).
| Age | Hex |
|---|---|
| 4–7 | `#C3B3EE` (lavender, changed from the live site's teal, which was too close to the 7–11 green) |
| 7–11 | `#5FBE98` |
| 11–14 | `#FFCF2C` |
| 14–16 | `#80B3DD` |

**Collection "stack" tints**, the two layers peeking out behind a collection card: green `#CFEDE0`/`#A7DCC5`, blue `#C9DCF0`/`#AFCBE8`, yellow `#FFEDB0`/`#FFDB66`.

**Type**
- H1 hero: Poppins 800, 72px/1.0, letter-spacing −0.025em. On mobile, clamp down to about 40px.
- Section H2: Poppins 800, 48px/1.08, −0.015em.
- Card titles: Poppins 700–800, 17–22px.
- Body: Figtree 16–21px. Eyebrows and labels: Figtree 800, 13–14px, uppercase, 0.06–0.08em tracking.
- Use a proper heading order: one H1 per page, H2 for sections, H3 for cards. The audit flagged the live site's all-H3 structure.

**Shape and depth**
- Radii: pills 999px, thumbnails 14–16px, cards 22–24px, large panels 28–32px.
- Card hover: `translateY(-4px)` plus `0 18px 40px rgba(17,14,99,.14)`. Image zoom inside collection cards: `scale(1.04)`.
- Search field shadow: `0 14px 34px rgba(17,14,99,.22)`.
- Container: `max-width: 1320px`, side padding 32px (16px on mobile).
- The doodle SVG is used as a faint background: opacity 0.18–0.22 on light backgrounds, and `filter: invert(1)` at 0.08 on navy.

**No** scalloped or wavy section edges. These were tried and rejected.

## 6. Components

Build these as reusable components. The design files show every variant.

- `SiteHeader`: logo (72px tall), nav, search icon button and "My resources" button. Nav items: **Primary, Secondary, Collections, Interactives, Careers, Ultimate STEM Challenge, CPD**. No underlines on nav links. When signed in, the My resources button becomes an avatar menu ("S Sam ▾"). Below 1024px, nav collapses to a menu button. Make sure it doesn't collapse to the hamburger at 1440px, which the live site does.
- `SiteFooter`: logo, one-line description, two-column links. No underlines.
- `SearchField`: large pill input plus a navy Search button, with a size variant for the hero and the results header.
- `TypeaheadPanel`: see §7.
- `AgePill`: colour by age band, with sm and md sizes.
- `ResourceCard`: thumbnail with a white format badge (top left) and a bookmark button (top right, 44px, `aria-label`), then level text, age pills, title (H3, links to `liveUrl`), and an action button chosen by format (Download / Watch / Open / Launch).
- `CollectionCard`: two stacked tint layers behind the card, a cover image with a navy "N resources" badge (bottom right), then level, age pills and title. The only action is View collection (the whole card is clickable).
- `FeatureCollection`: the large navy two-column card used for "Best match" and the World Space Week feature.
- `RoleModelCard`: a circular portrait on a coloured card, with name, role and type badge. The video variant uses the Amelia still.
- `FilterPanel`, `FilterOption` (checkbox, label and live count, disabled at 0), `AppliedFilterChip`, `ResultTabs`, `KindChips`.
- `TopicTag`: an outlined "#Topic" pill that links to `/search?q=topic`.

**Accessibility:** use real `<button>`, `<a>`, `<input>` and `<label>` elements everywhere. Every icon-only button gets an `aria-label`. Focus ring: `outline: 3px solid #FFCF2C; outline-offset: 2px`. Touch targets are at least 44px. The type-ahead follows the WAI-ARIA combobox pattern (`role="combobox"`, `aria-expanded`, `aria-activedescendant`, a listbox with options, arrow keys, Enter and Esc). Tabs use `role="tablist"`. Respect `prefers-reduced-motion`.

## 7. Pages and behaviour

### `/` Homepage (`design/01-homepage.html`)
Sections, top to bottom. The content comes from `data/homepage.json`.
1. **Hero:** sky background with the doodle SVG. Contents:
   - A "FREE · curriculum-linked STEM resources for ages 4–16" pill.
   - The H1: "Science lessons that show pupils **where STEM can take them**". The bold phrase gets a yellow highlighter underline.
   - The supporting line, then the hero `SearchField` with "Popular:" chips.
   - On the right, a tilted collage: a photo, a resource thumbnail, an "Meet Imisi · Data analyst" badge and an "Ages 4–16" sticker.
2. **Partner line:** "Produced in partnership with Association for Science Education · Tech She Can · Curated by We Are Futures". It's text for now; swap in the partner logos when we get them.
3. **Who are you teaching?** Two big photo cards (Primary 4–11, Secondary 11–16), each with age-band pills and an "All primary/secondary" button.
4. **Ready for this term:** the big World Space Week feature plus two resource cards.
5. **New this month:** 4 resource cards in a grid. **No carousels anywhere.**
6. **Interactives band:** a yellow panel with a photo, the "Science games pupils actually want to play" copy, and Explore / Primary / Secondary buttons.
7. **Careers band** (navy): copy, a CTA and 3 `RoleModelCard`s. The middle card sits 28px higher.
8. **Collections:** "A whole topic, ready to teach", with 4 `CollectionCard`s.
9. Footer.

### `/` signed in (`design/05-homepage-signed-in.html`)
There's no auth. Add a **"Preview as signed-in teacher" toggle** in the footer, plus support for `?as=sam`, and store the choice in `localStorage`.

When signed in:
- The hero is replaced by a compact "Welcome back, Sam" band. It shows the teacher's saved age groups (7–11, 11–14) with a "Change" link, a search field, and two stat tiles (Saved resources, Student resources).
- A "Pick up where you left off" row shows saved items. The bookmark button is filled yellow, and each card says when it was saved.
- A "New for your classes" row shows recent items filtered to the saved age groups, with a yellow "NEW" badge.
- The rest of the logged-out homepage continues below.

The bookmark buttons on every card really toggle, saving to `localStorage`, and "Saved resources" counts them.

### `/search?q=` Results (`design/03-search-results.html`)
- **Header band** (`sky-50`, doodle background):
  - A search field with the query in it.
  - H1: "N results for "q"".
  - Topic tags for the query.
  - Tabs: **All / Collections / Resources**, each with a count.
- **Body:** a filter panel on the left (on mobile, a slide-over sheet with a "Show N results" button), with results on the right.
  - **All tab:**
    - A **Best match** `FeatureCollection` (the top-scoring collection, when it's clearly ahead).
    - Then "Collections (n)" as a grid.
    - Then "Resources (n)" with kind chips (All · Careers & role models · Teaching resources), the first 8 resources, and a "Show all N resources" button that switches to the Resources tab.
  - **Collections** and **Resources** tabs show the full list.
- **Filters:** Age (with year-group hints: Reception–Y2, Years 3–6, KS3, GCSE) and Resource format.
  - **Each option shows a live count**, calculated against the query and all the *other* active filters.
  - Options with a count of 0 are disabled and dimmed (so you can never filter down to nothing).
  - Active filters show as removable chips above the results.
  - "Clear all" clears everything and doesn't close anything (the live site's version closes the modal).
  - "Careers & role models" means the **title** matches `search-config.json → careersPattern`. Everything else is "Teaching resources". Don't match against descriptions; they use "career" too loosely.
- **Sort:** Best match (default), Newest, A–Z. Newest is based on the year/month folder in the image path.
- **Sync all state to the URL** (`q`, `age`, `format`, `tab`, `kind`, `sort`) so views can be shared and the back button works.
- On load, show skeleton cards rather than a spinner.

### Type-ahead (`design/02-search-typeahead.html`)
- Opens from the hero search field and the header search button, after 2 characters, with a 120ms debounce. Use the overlay style shown.
- At the top is a scope toggle: All ages / Primary 4–11 / Secondary 11–16.
- **Left column:**
  - **Suggestions:** up to 4 completions taken from title words and topics. The typed part is shown normally and the completion in bold. The first one is highlighted.
  - **Topics:** up to 2 matching topic tags.
  - **Meet the people:** role models from `people.json` whose `relatedTerms` match the query.
- **Right column:** **Top matches**, the top 4 items, each showing a thumbnail (collections get a small stack tab), title, kind, count or format, and age pills.
- **Footer row:** "See all N results for "…"", with an Enter key hint.
- Fully keyboard operable (see §6).

### No exact match (`design/04-search-no-match.html`)
Shown when the strict search returns 0.
- **If a fuzzy or normalised search finds something:** H1 "No exact matches for "q"", then "We looked for close matches instead. Showing results for **corrected term**", then those results under "Closest matches".
- **Always show:**
  - "Explore a related collection": 3 photo tiles, chosen by topic overlap, or popular ones if nothing overlaps.
  - "Browse by age instead": 4 coloured tiles.
  - A navy "Still can't find it?" panel with a "Suggest a resource" button. This can open a `mailto:` or a simple modal for now.

## 8. Search quality, which is the point of the demo

Pipeline (put it in `useSearch`, and keep config in `search-config.json`):
1. **Normalise:**
   - Lowercase and strip punctuation.
   - Map year groups and key stages to ages ("year 5" → 7–11, "ks3" → 11–14, "gcse" → 14–16). Apply the mapped age as an active filter and remove those words from the query.
   - Map format words ("ppt", "powerpoint", "video", "worksheet", "poster") to a format filter or kind chip.
   - Drop stopwords like "lesson", "resources" and "for".
2. **Stem:** a simple English plural/suffix stemmer on both the query and the index ("magnets"→"magnet", "batteries"→"battery", "fossils"→"fossil").
3. **Fuse:**
   - Keys: `title` (weight 3), `topics` (2), `description` (1).
   - Settings: `threshold ~0.35`, `ignoreLocation: true`, `includeScore`.
   - Run a strict pass first (threshold ~0.15). If it returns 0, run the fuzzy pass and show the "No exact matches… showing results for X" message, where X is the best-matching index term.
4. **Rank:**
   - Collections get a small boost.
   - Titles that start with the query get a boost.
   - "Best match" means the top collection, if its score is clearly ahead of the next result.

### Acceptance tests (put these in a Vitest file and check them in the browser)
| Query | Expect |
|---|---|
| `electricity` | 19+ results. Best match is **Electricity and batteries** (collection, 36 resources). The careers chip shows 8. |
| `electricity` with 14–16 ticked | 1 result (the 11–16 careers poster). 4–7 is disabled with a count of 0. |
| `magnets` | Results (the two GCSE waves knowledge organisers), not zero. |
| `electrcity` (typo) | "No exact matches… showing results for **electricity**". |
| `year 5 circuits` | The 7–11 filter is applied automatically, and *Circuits and symbols activity sheet 2* appears near the top. |
| `rockets` | Rocket science (primary) and (secondary), so the plural is handled. |
| `zzzz` | The no-match page, with related collections and browse by age. No dead end. |

## 9. Responsive

- **Breakpoints:** 1440 (design width), 1024 and 768/375.
- Every grid uses `repeat(auto-fit, minmax(min(Xpx, 100%), 1fr))`, as in the designs.
- **Hero collage:** below 1024px it shrinks; below 768px, show just the main photo and the Imisi badge, with no rotation.
- **Filters:** below 1024px, a "Filters (n)" button opens a bottom sheet.
- **Tabs:** they scroll horizontally on small screens.
- Check at 375px that there's no horizontal scroll and nothing below 14px.

## 10. Out of scope (for now)

- Collection and resource detail pages: cards link to `liveUrl` in a new tab.
- Real auth, real downloads and CMS integration.
- **Breadcrumbs and the new URL structure** (`/secondary/meet-an-energy-consultant`). These are needed for the real rebuild, per the 2023 audit, but there are no detail pages here to put them on.
- Analytics. GTM-MGN7KWQ exists on the live site; don't add it to the prototype.

## 11. Deliverable

- A Git repo, deployed to Vercel with a preview URL.
- A README covering how to run it, how to rescrape, and where search config lives.
- Lighthouse scores of at least 90 for accessibility and best practices on `/` and `/search?q=electricity`.
- A short `NOTES.md` listing:
  - every place you had to guess
  - any acceptance tests that don't pass yet
  - questions for the client: the age-band merge, partner logos, the Proxima Nova licence, and the "Collections" naming

---

### Background: 2023 UX audit points this design answers
- Carousels removed (low click-through; the live ones scroll past the end into empty space).
- Hero puts the copy first, with a bigger H1 and no rotating banner.
- The heading hierarchy is fixed.
- Age labels are coloured pills, not underlined links.
- Each card has one clear action, a bigger bookmark button and visible counts.
- Filters show counts and you can't filter down to zero.
- "Clear all" no longer closes the panel.
- Topic tags are clickable.
- Interactives is now a top-level section.
- Signed-in personalisation: welcome message, saved items, new for your ages.
- The 4–7 colour is changed so it no longer clashes with 7–11, and age pills get a white outline.
