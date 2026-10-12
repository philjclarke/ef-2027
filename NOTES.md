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
