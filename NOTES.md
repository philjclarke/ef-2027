# Notes: first pass (12 October 2026)

## Status

- All seven acceptance tests from BRIEF §8 pass, plus 15 supporting tests (`npm test`).
- Lighthouse (mobile, local static build):

  | Page | Accessibility | Best practices | Performance |
  |---|---|---|---|
  | `/` | 100 | 100 | 68 |
  | `/search?q=electricity` | 100 | 100 | 75 |

  Layout shift is 0. Performance is limited by largest-contentful-paint on throttled mobile; see "Not done yet".
- Checked at 375, 1024 and 1440 wide: no horizontal scroll.

## Decisions and guesses

**Data**
- **Interactives.** The scraped catalogue had no Interactive-format items. We added the 9 real resources from the live `/collections/interactive-science-games/` page, with their titles, ages, descriptions, URLs and thumbnails, in `data/catalogue-additions.json`. They're kept separate from `catalogue.json` so a rescrape doesn't drop them.
- **Collection blurbs.** Four collections have no description in the scrape. For those we used the short copy from the designs (`data/descriptions.json`). Other collections with no description get a generated line, e.g. "36 resources on electricity, for ages 7–11."
- **Search config edits.**
  - The "Rocks and fossils" topic keyword `rock` also matched "Rocket science". Changed it to `rocks` / `rock `.
  - Topic keywords ending in a space now match whole words only, so a "rockets" search no longer gets a #Rocks and fossils tag.
  - Removed `forces` from the `magnet` synonyms, because it pulled in every "Asteroid Action **Force**" item.
  - Added a `ranking` block holding the tuning numbers.
- **Strict pass isn't Fuse.** Fuse's scoring at threshold 0.15 still lets a one-letter typo through, so "electrcity" would never reach the "did you mean" state. Strict matching is word-based instead. Fuse handles typo correction and the final fuzzy fallback, still with the brief's weights (title 3, topics 2, description 1) and threshold 0.35.
- **"Best match" margin.** "Electricity and batteries" (36 resources) and "Electricity from the wind" (2 resources) score almost the same on text alone. Bigger collections now get a log-scaled boost, and "clearly ahead" means at least 10% ahead of the next result. Both numbers are in `search-config.json`.
- **"magnets"** matches only inside "electromagnetic". It therefore shows the "No exact matches… showing results for magnet" page with the two GCSE waves organisers, as in design 04, rather than the normal results page.
- **No-match related collections.** These are chosen by topic overlap first. Failing that, they're collections for the same ages as the closest matches, preferring the homepage's featured collections. Otherwise the biggest collections are two events calendars, which aren't useful suggestions.

**Navigation**
- Primary, Secondary, Collections, Interactives and Careers go to filtered `/search` views (for example `/search?age=4-7,7-11`). Ultimate STEM Challenge, CPD, the footer links, "Change" (age groups), the stat tiles and "My resources" are `#`.

**Card design**
- Homepage cards don't show the action button, matching designs 01 and 05. Search result cards do. The action button is hidden from screen readers and skipped by the Tab key, because it goes to the same place as the card's title link.
- "New this month" includes two items that are collections in the data (All about me, RoboRevolution). They show a navy "COLLECTION · N" badge rather than the design's "PDF" / "CHALLENGE" badges.
- Badges like "POSTER · PDF", "JOB CARD · PDF" and "QUIZ · PDF" are worked out from words in the title.

**Search behaviour**
- Type-ahead: the first suggestion is highlighted, so Enter searches for it. "See all N results" uses that suggestion too, which is how design 02 behaves ("electri" → "electricity").
- Type-ahead "Top matches" and "Meet the people" open the live page in a new tab.
- The header search icon opens a panel that drops down under the header, with the page dimmed behind it, rather than a full-screen overlay (changed after review: the overlay lost the page context). The first Esc closes the suggestions and the second closes the panel; focus then returns to the search button.
- "Suggest a resource" opens a small dialog that doesn't send anything. It says so in the dialog.

**Signed-in preview**
- Turning on the preview adds the four demo saved items once. Bookmarks toggle everywhere, signed in or not, and are stored in `localStorage`. Newly saved items say "Saved just now" and so on.

**Fonts and images**
- Figtree stands in for Proxima Nova. Metric-matched fallback fonts stop the page jumping when the web fonts load.
- Images: compressed the role-model PNGs (240KB → under 50KB each) and the doodle SVG (126KB → 58KB). The interactive thumbnails were downloaded from the live site and resized to 800px wide like the rest.

**Tech**
- Nuxt 3.21 (as briefed, not Nuxt 4).

## Not done yet / known gaps
- **Performance.** The homepage's largest-contentful-paint is about 6.7s on Lighthouse's throttled mobile profile. The catalogue JSON is bundled into the JavaScript (~190KB), and images aren't responsive (no srcset or WebP). `@nuxt/image` would help.
- **Focus trapping.** The mobile filter sheet moves focus in and out and closes on Esc, but doesn't fully trap Tab inside. The suggest dialog uses native `<dialog>`, which does.
- **Tablet nav.** Between 1024px and about 1200px the main nav wraps onto two lines, as the design's flex-wrap allows. If that looks wrong, the options are tighter spacing or a shorter label for "Ultimate STEM Challenge".
- **Signed-in flash.** The signed-in homepage is applied after load, because state is in `localStorage`. There's a brief flash of the signed-out hero.
- **Content timing.** "Ready for this term" still features World Space Week, which ended on 10 October. It's controlled in `homepage.json → thisTerm`.

## Questions for the client
1. **Age bands.** The live site's 7–9 and 9–11 bands are merged into 7–11. Is that OK? (One mapping in `search-config.json → ageBands`.)
2. **Partner logos.** The partner line is text for now. Can we have logo files for ASE, Tech She Can and We Are Futures?
3. **Proxima Nova.** Is there an Adobe Fonts licence we can use on the new build, or should we stay with a stand-in such as Figtree?
4. **"Collections" naming.** Lessons and Content series fold into "Collections". Is that the right word for teachers, or would "Topics", "Units" or "Packs" be clearer?
5. **Interactives.** Are there more than the 9 in the live collection, and should "Interactive" be a format everywhere (for example, launch in browser rather than download)?

---

# Homepage options B and C (added 12 October 2026)

Option A (`/`) is unchanged. Both new options use a sticky header with a fat (mega) menu, the dialled-up `pop` palette in `tailwind.config.ts`, and no doodle illustrations. The search pages keep the original header, as agreed.

## B: image-led (`/home-b`)
- Full-bleed photo hero with the search field and a "Meet Imisi" card.
- A "Make it yours" bar: nation, classes and school postcode. Once set, it collapses to a summary, and a "Picked for your classes" row appears.
- Photo tiles per age band, labelled in the teacher's nation's terms (for example, Scotland shows P4–P7).
- A seasonal bento block (Halloween, Black History Month, Bonfire Night, Asteroid Action Force), topic photo tiles, an image-led careers band, interactives, and collections.

## C: personalisation-first (`/home-c`)
- The hero is a setup card. On submit it plays a short scripted "Tailoring…" sequence, then the page rebuilds around the teacher's choices:
  - "Mapped to what you teach": tabs per class, with a curriculum tag on each card.
  - "STEM on your doorstep": the region's photo, facts, nearby careers, and resources with a local line.
  - "One resource, made local": the same slide shown original and localised, for any of the nine regions.
- Signed in as Sam, it defaults to England, Years 3–6 and 7–9, and the Humber.
- Demo shortcuts under the postcode field: Hull, Glasgow, Belfast, Cardiff.

## The mega menu
- Panels: Primary, Secondary, Collections, Interactives, Careers.
- Primary and Secondary show age links (in the teacher's nation's terms), the six most-populated topics, and three suggested resources. These become "Suggested for Years 3–6" and so on once personalised.
- Hover opens a panel after a short delay; click toggles it; Esc closes it and returns focus to its button. Below 1024px it becomes an accordion.

## Decisions and guesses
- **The "AI localisation" is scripted.** There are no model calls. Local lines come from `data/personalisation.json → regions`. The copy says localised versions are "checked by our education team". That's our assumption about the process; please confirm with the client before it's presented as a promise.
- **Curriculum labels are illustrative.** We use stage names plus a curriculum area (for example, "First and Second level Sciences · Forces, electricity and waves"), not statutory codes. They need checking by the client's education team.
- **Regions.** We cover nine regions, chosen by postcode area. The facts are public and general, and no employers are named. Postcodes outside these areas get a "no local examples yet" message.
- **Photos are placeholders.** They come from Unsplash and Pexels (free licences) and Wikimedia Commons (CC BY / CC BY-SA, which need attribution if used beyond the prototype). Full credits are in `public/photos/credits.json`. Gaps:
  - Careers shows a construction site, not a wind farm.
  - Humber shows the Humber Bridge, not offshore wind.
  - Electricity shows a light bulb, not a circuit.
- **Thumbnails.** The 33 catalogue items that hotlinked thumbnails from the live site now have local copies, saved under the scraper's naming convention. This fixed a third-party-cookie warning in Lighthouse.

## Status
- Lighthouse accessibility and best practices: 100 on `/`, `/home-b`, `/home-c` and `/search?q=electricity`.
- Layout shift is 0.
- No horizontal scroll at 375, 1024 or 1440.
- 37 tests pass, including the new personalisation tests in `tests/personalise.test.ts`.

## Questions for the client
1. Which nations matter most? Should Welsh-language versions be in scope?
2. How will AI-localised resources be reviewed before teachers see them, and how should we describe that?
3. Should the teacher be able to save personalisation without an account (as now), or only when signed in?
4. Do they have real photography, especially of UK classrooms and role models at work?
