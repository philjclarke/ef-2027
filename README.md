# Energising Futures: homepage and search prototype

A clickable prototype of the new Energising Futures homepage and search journey, for We Are Futures to review. It is **not** the production rebuild: there's no CMS, auth or downloads. Content is local JSON scraped from the live site, and cards open the real live pages in a new tab.

The brief and the approved design references are in [`docs/`](docs/) ([`BRIEF.md`](docs/BRIEF.md), [`design/`](docs/design/)). Open questions and known gaps are in [`NOTES.md`](NOTES.md).

## Run it

Requires Node 18+ (built on Node 22).

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # search acceptance tests (Vitest)
npm run generate   # static build into .output/public
npm run preview    # serve the static build
```

Useful URLs:

- `/`: homepage
- `/?as=sam`: homepage previewed as a signed-in teacher (`?as=guest` turns it off). There's also a toggle in the yellow Prototype bar at the top of every page. The choice is kept in `localStorage`.
- `/search?q=electricity`: results. All state is in the URL: `q`, `age`, `format`, `tab`, `kind`, `sort`.
- `/search?q=magnets`, `/search?q=electrcity`, `/search?q=zzzz`: the "no exact match" states.

## Deploy (Vercel)

Import the repo in Vercel. The Nuxt preset is detected, and [`vercel.json`](vercel.json) tells it to run `nuxt generate` and serve `.output/public`, so the whole site is static. `/search` is prerendered as a client-rendered shell (see `routeRules` in [`nuxt.config.ts`](nuxt.config.ts)).

## Where things live

| What | Where |
|---|---|
| Catalogue (98 scraped items) | [`data/catalogue.json`](data/catalogue.json) |
| Hand-added items (the 9 live interactives) | [`data/catalogue-additions.json`](data/catalogue-additions.json): merged at load time, so a rescrape doesn't remove them |
| Short collection blurbs from the designs | [`data/descriptions.json`](data/descriptions.json): only used where the scrape has no description |
| Homepage sections and copy | [`data/homepage.json`](data/homepage.json) |
| Role models | [`data/people.json`](data/people.json) |
| **Search config**: synonyms, year groups → ages, format words, stopwords, topics, careers pattern, ranking weights | [`data/search-config.json`](data/search-config.json) |
| Loading and enriching items (topics, careers kind, dates, badges) | [`utils/catalogue.ts`](utils/catalogue.ts) |
| Search engine (normalise, stem, match, fallbacks, facets, type-ahead) | [`utils/search.ts`](utils/search.ts) |
| Reactive wrapper used by the UI (swap point for a server or Algolia later) | [`composables/useSearch.ts`](composables/useSearch.ts) |
| Signed-in preview and saved items (`localStorage`) | [`composables/usePreviewState.ts`](composables/usePreviewState.ts) |
| Design tokens | [`tailwind.config.ts`](tailwind.config.ts). The body font is one entry in `fontFamily.body`, so swapping Figtree for Proxima Nova is a one-line change, plus the Google Fonts entry in `nuxt.config.ts`. |
| Acceptance tests | [`tests/search.test.ts`](tests/search.test.ts) |

### How search works

1. **Normalise:** lowercase and strip punctuation. Year groups and key stages become an age filter ("year 5" → 7–11), and format words become a format filter ("ppt" → PowerPoint). Stopwords are dropped. On `/search` these are moved into the URL as filters, with a note saying so.
2. **Stem:** a small plural stemmer runs on the query and the index (magnets → magnet, batteries → battery).
3. **Strict pass:** every term has to match a whole word, a synonym or a 5+ letter word prefix in the title (weight 3), topics (2) or description (1).
4. **Fallbacks, in order, when the strict pass finds nothing:**
   - substring match ("magnet" inside "electromagnetic")
   - typo correction against the index vocabulary, using Fuse.js
   - any-word match
   - a Fuse.js fuzzy pass over the items

   Any of these shows the "No exact matches… showing results for X" page.
5. **Rank:** collections get a small boost, titles starting with the query get a boost, and bigger collections get a log-scaled nudge. "Best match" is the top result when it's a collection and at least 10% ahead of the next result.

Topics aren't on the live site's cards, so they're tagged at load time by matching `search-config.json → topics` keywords against the title and description.

## Rescrape

```bash
npm i cheerio
npm run scrape        # node scripts/scrape-catalogue.mjs, writes data/catalogue.json (~625 items)
```

New items without a matching file in `public/thumbnails/` fall back to hotlinking the live site's thumbnail. The acceptance tests are tuned to the 98-item catalogue, so rerun `npm test` after a rescrape.
