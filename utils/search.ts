// Search engine for the prototype. Pure functions over the in-memory catalogue so it
// can be unit-tested and later swapped for a server/Algolia behind useSearch().
//
// Pipeline (BRIEF §8):
//   1. normalise: lowercase, strip punctuation, pull out year groups / formats / kinds, drop stopwords
//   2. stem: simple plural stemmer, applied to query and index alike
//   3. strict pass: every query term must match a whole (stemmed) word, a synonym, or a
//      word prefix (5+ chars) in title / topics / description, weighted 3 / 2 / 1
//   4. if that finds nothing, fall back in order: substring match ("magnet" in
//      "electromagnetic"), typo correction against the index vocabulary (Fuse), any-term
//      match, then a Fuse fuzzy pass over the items
//   5. rank with boosts: collections, titles that start with the query, collection size
import Fuse from 'fuse.js'
import {
  AGES,
  FORMATS,
  catalogue as defaultCatalogue,
  config,
  people,
  type Age,
  type Format,
  type Item,
  type Person,
  type ResourceKind,
} from './catalogue'
import homepage from '../data/homepage.json'

const R = config.ranking

// ---------------------------------------------------------------- text helpers

export function normalise(text: string): string {
  return text
    .toLowerCase()
    .replace(/[’'`]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

/** Minimal English plural stemmer: magnets→magnet, batteries→battery, boxes→box. */
export function stem(word: string): string {
  if (word.length < 4) return word
  if (word.endsWith('ies')) return word.slice(0, -3) + 'y'
  if (word.endsWith('sses')) return word.slice(0, -2)
  if (/(ss|us|is)$/.test(word)) return word
  if (/(ch|sh|x|z)es$/.test(word)) return word.slice(0, -2)
  if (word.endsWith('s')) return word.slice(0, -1)
  return word
}

export const tokens = (text: string) => normalise(text).split(' ').filter(Boolean)
export const stemmedTokens = (text: string) => tokens(text).map(stem)

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// ---------------------------------------------------------------- query parsing

export interface ParsedQuery {
  raw: string
  /** What's left after year groups, formats and stopwords are removed (unstemmed). */
  text: string
  words: string[]
  terms: string[]
  ages: Age[]
  formats: Format[]
  kind: ResourceKind | null
  /** Phrases that were turned into filters, e.g. ["year 5"]. */
  extracted: { phrase: string; type: 'age' | 'format' | 'kind'; value: string }[]
}

function extract<T extends string>(
  text: string,
  map: Record<string, string>,
  type: 'age' | 'format' | 'kind',
  out: ParsedQuery['extracted'],
): { text: string; values: T[] } {
  const values: T[] = []
  // Longest phrases first so "key stage 2" wins over "stage".
  const keys = Object.keys(map).sort((a, b) => b.length - a.length)
  for (const key of keys) {
    const re = new RegExp(`(^| )${escapeRe(key)}(?= |$)`, 'g')
    if (re.test(text)) {
      text = text.replace(re, ' ').replace(/\s+/g, ' ').trim()
      const v = map[key] as T
      if (!values.includes(v)) values.push(v)
      out.push({ phrase: key, type, value: v })
    }
  }
  return { text, values }
}

export function parseQuery(q: string): ParsedQuery {
  const extracted: ParsedQuery['extracted'] = []
  let text = normalise(q)
  // "year5" / "y5" written without a space
  text = text.replace(/\byear(\d{1,2})\b/g, 'year $1')
  const a = extract<Age>(text, config.queryToAge, 'age', extracted)
  const f = extract<Format>(a.text, config.queryToFormat, 'format', extracted)
  const k = extract<ResourceKind>(f.text, config.queryToKind, 'kind', extracted)
  const stop = new Set(config.stopwords)
  const words = k.text.split(' ').filter((w) => w && !stop.has(w))
  return {
    raw: q,
    text: words.join(' '),
    words,
    terms: words.map(stem),
    ages: a.values,
    formats: f.values,
    kind: k.values[0] ?? null,
    extracted,
  }
}

// ---------------------------------------------------------------- index

interface Field {
  words: string[]
  set: Set<string>
  joined: string
}
interface IndexedItem {
  item: Item
  title: Field
  topics: Field
  description: Field
}

const field = (text: string): Field => {
  const words = stemmedTokens(text)
  return { words, set: new Set(words), joined: ` ${words.join(' ')} ` }
}

export interface SearchIndex {
  items: IndexedItem[]
  /** Stemmed words from titles and topics, for typo correction. */
  vocab: string[]
  vocabFuse: Fuse<string>
  itemFuse: Fuse<Item>
  /** Unstemmed phrases (title n-grams + topics) for type-ahead completions, with frequency. */
  phrases: Map<string, number>
}

export function buildIndex(items: Item[] = defaultCatalogue): SearchIndex {
  const indexed = items.map((item) => ({
    item,
    title: field(item.title),
    topics: field(item.topics.join(' ')),
    description: field(item.description),
  }))

  const stop = new Set([...config.stopwords, 'to', 'in', 'with', 'your', 'our', 'is', 'it', 'by', 'from'])
  const vocab = new Set<string>()
  const phrases = new Map<string, number>()
  const addPhrase = (p: string, weight = 1) => phrases.set(p, (phrases.get(p) ?? 0) + weight)

  for (const { item, title, topics } of indexed) {
    for (const w of [...title.words, ...topics.words]) if (w.length > 2 && !/^\d+$/.test(w)) vocab.add(w)
    const words = tokens(item.title)
    for (let i = 0; i < words.length; i++) {
      if (stop.has(words[i]) || /^\d+$/.test(words[i]) || words[i].length < 3) continue
      for (let k = 0; k < 4 && i + k < words.length; k++) {
        const last = words[i + k]
        if (stop.has(last) || /^\d+$/.test(last)) continue
        addPhrase(words.slice(i, i + k + 1).join(' '))
      }
    }
  }
  for (const t of config.topics) addPhrase(normalise(t.name), 3)

  const vocabList = [...vocab]
  return {
    items: indexed,
    vocab: vocabList,
    vocabFuse: new Fuse(vocabList, { threshold: R.correctionThreshold, includeScore: true }),
    itemFuse: new Fuse(items, {
      keys: [
        { name: 'title', weight: R.weights.title },
        { name: 'topics', weight: R.weights.topics },
        { name: 'description', weight: R.weights.description },
      ],
      threshold: R.fuzzyThreshold,
      ignoreLocation: true,
      includeScore: true,
      minMatchCharLength: 3,
    }),
    phrases,
  }
}

let _index: SearchIndex | null = null
export const getIndex = () => (_index ??= buildIndex())

// ---------------------------------------------------------------- matching

type MatchMode = 'strict' | 'substring'

const synonymsFor = (term: string, word: string): string[][] => {
  const syn = config.synonyms as Record<string, string[]>
  const list = [...(syn[term] ?? []), ...(word !== term ? syn[word] ?? [] : [])]
  return list.map((p) => stemmedTokens(p))
}

/** 0..1 strength of a single term against one field. */
function fieldHit(f: Field, term: string, mode: MatchMode, prefixMin: number): number {
  if (f.set.has(term)) return 1
  if (term.length >= prefixMin && f.words.some((w) => w.startsWith(term))) return R.prefixFactor
  if (mode === 'substring' && term.length >= 4 && f.words.some((w) => w.includes(term))) return 0.5
  return 0
}

function phraseHit(f: Field, phrase: string[]): number {
  if (phrase.length === 1) return f.set.has(phrase[0]) ? 1 : 0
  return f.joined.includes(` ${phrase.join(' ')} `) ? 1 : 0
}

function termScore(ix: IndexedItem, term: string, word: string, mode: MatchMode, prefixMin: number): number {
  const w = R.weights
  let t = fieldHit(ix.title, term, mode, prefixMin)
  let p = fieldHit(ix.topics, term, mode, prefixMin)
  let d = fieldHit(ix.description, term, mode, prefixMin)
  for (const phrase of synonymsFor(term, word)) {
    t = Math.max(t, phraseHit(ix.title, phrase) * R.synonymFactor)
    p = Math.max(p, phraseHit(ix.topics, phrase) * R.synonymFactor)
    d = Math.max(d, phraseHit(ix.description, phrase) * R.synonymFactor)
  }
  return w.title * t + w.topics * p + w.description * d
}

export interface Scored {
  item: Item
  score: number
  /** Terms that matched, for "Mentions 'magnet'" hints. */
  matched: string[]
}

interface MatchOpts {
  mode: MatchMode
  all: boolean
  /** Allow prefix matches on the last term from this length (type-ahead uses 2). */
  lastPrefixMin?: number
}

function match(index: SearchIndex, terms: string[], words: string[], opts: MatchOpts): Scored[] {
  const out: Scored[] = []
  const phrase = terms.join(' ')
  for (const ix of index.items) {
    let score = 0
    const matched: string[] = []
    let missed = false
    terms.forEach((term, i) => {
      const prefixMin = i === terms.length - 1 && opts.lastPrefixMin ? opts.lastPrefixMin : 5
      const s = termScore(ix, term, words[i] ?? term, opts.mode, prefixMin)
      if (s > 0) {
        score += s
        matched.push(term)
      } else missed = true
    })
    if (!matched.length || (opts.all && missed)) continue
    out.push({ item: ix.item, score: boost(ix, score, phrase), matched })
  }
  return out.sort(byScore)
}

function boost(ix: IndexedItem, score: number, phrase: string): number {
  const it = ix.item
  if (it.kind === 'collection') {
    score *= R.collectionBoost
    score += R.resourceCountBoost * Math.log10((it.resourceCount ?? 0) + 1)
  }
  if (phrase && ix.title.joined.trimStart().startsWith(phrase)) score += R.titleStartsWithBoost
  return score
}

const byScore = (a: Scored, b: Scored) => b.score - a.score || a.item.order - b.item.order

// ---------------------------------------------------------------- search

export type SearchMode =
  | 'browse' // empty query: everything
  | 'exact'
  | 'substring' // e.g. "magnet" inside "electromagnetic"
  | 'corrected' // typo fixed against the vocabulary
  | 'partial' // only some of the words matched
  | 'fuzzy'
  | 'none'

export interface SearchResult {
  parsed: ParsedQuery
  mode: SearchMode
  /** The term we actually searched for when mode isn't exact ("electricity" for "electrcity"). */
  correctedTerm: string | null
  results: Scored[]
}

export function search(q: string, opts: { lastPrefixMin?: number; index?: SearchIndex } = {}): SearchResult {
  const index = opts.index ?? getIndex()
  const parsed = parseQuery(q)
  const { terms, words } = parsed
  const done = (mode: SearchMode, results: Scored[], correctedTerm: string | null = null): SearchResult => ({
    parsed,
    mode,
    correctedTerm,
    results,
  })

  if (!terms.length) {
    const all = index.items
      .map((ix) => ({ item: ix.item, score: 0, matched: [] }))
      .sort((a, b) => b.item.date - a.item.date || a.item.order - b.item.order)
    return done('browse', all)
  }

  const strict = match(index, terms, words, { mode: 'strict', all: true, lastPrefixMin: opts.lastPrefixMin })
  if (strict.length) return done('exact', strict)

  const sub = match(index, terms, words, { mode: 'substring', all: true })
  if (sub.length) return done('substring', sub, terms.join(' '))

  // Typo correction: swap each unknown term for its closest vocabulary word.
  const vocab = new Set(index.vocab)
  const corrected = terms.map((t) => {
    if (vocab.has(t) || t.length < 4) return t
    const hit = index.vocabFuse.search(t, { limit: 1 })[0]
    return hit ? hit.item : t
  })
  if (corrected.join(' ') !== terms.join(' ')) {
    const fixed = match(index, corrected, corrected, { mode: 'strict', all: true })
    if (fixed.length) return done('corrected', fixed, corrected.join(' '))
  }

  if (terms.length > 1) {
    const some = match(index, terms, words, { mode: 'strict', all: false })
    if (some.length) {
      const hitTerms = [...new Set(some.flatMap((s) => s.matched))]
      return done('partial', some, hitTerms.join(' '))
    }
  }

  const fuzzy = index.itemFuse.search(parsed.text)
  if (fuzzy.length) {
    const best = index.vocabFuse.search(terms.join(' '), { limit: 1 })[0]?.item ?? null
    return done(
      'fuzzy',
      fuzzy.map((r) => ({ item: r.item, score: 1 - (r.score ?? 1), matched: [] })),
      best,
    )
  }
  return done('none', [])
}

// ---------------------------------------------------------------- filters and facets

export interface Filters {
  ages: Age[]
  formats: Format[]
}

export const ageOk = (it: Item, ages: Age[]) => !ages.length || it.ages.some((a) => ages.includes(a))
export const formatOk = (it: Item, formats: Format[]) =>
  !formats.length || (it.kind === 'resource' && !!it.format && formats.includes(it.format))

export function applyFilters(results: Scored[], f: Filters): Scored[] {
  return results.filter((r) => ageOk(r.item, f.ages) && formatOk(r.item, f.formats))
}

/** Live counts: each option is counted against the query and the *other* active filter group. */
export function facetCounts(results: Scored[], f: Filters) {
  const ages = Object.fromEntries(
    AGES.map((a) => [a, results.filter((r) => formatOk(r.item, f.formats) && r.item.ages.includes(a)).length]),
  ) as Record<Age, number>
  const formats = Object.fromEntries(
    FORMATS.map((fmt) => [
      fmt,
      results.filter((r) => r.item.kind === 'resource' && ageOk(r.item, f.ages) && r.item.format === fmt).length,
    ]),
  ) as Record<Format, number>
  return { ages, formats }
}

export type SortKey = 'best' | 'newest' | 'az'

export function sortResults(results: Scored[], sort: SortKey): Scored[] {
  const list = [...results]
  if (sort === 'newest') return list.sort((a, b) => b.item.date - a.item.date || byScore(a, b))
  if (sort === 'az') return list.sort((a, b) => a.item.title.localeCompare(b.item.title, 'en-GB'))
  return list
}

/** The top collection, when it's clearly ahead of the next result. */
export function bestMatch(results: Scored[], mode: SearchMode): Scored | null {
  if (mode === 'browse' || results.length < 1) return null
  const top = results[0]
  if (top.item.kind !== 'collection') return null
  const next = results[1]
  if (!next || top.score >= next.score * R.bestMatchMargin) return top
  return null
}

// ---------------------------------------------------------------- topics, related, people

/** Topic tags for a query: direct matches first, then the most common among top results. */
export function queryTopics(parsed: ParsedQuery, results: Scored[], max = 3): string[] {
  const direct = config.topics
    .filter((t) =>
      parsed.terms.some(
        (term) =>
          stemmedTokens(t.name).some((w) => w.length > 3 && w.startsWith(term)) ||
          t.match.some((kw) => {
            // A trailing space in the config means "whole word only" ("rock " ≠ "rocket").
            const whole = kw.endsWith(' ')
            const k = kw.trim()
            return k.startsWith(term) || (whole ? term === k : term.length >= k.length && term.startsWith(k))
          }),
      ),
    )
    .map((t) => t.name)
  const freq = new Map<string, number>()
  for (const r of results.slice(0, 12)) for (const t of r.item.topics) freq.set(t, (freq.get(t) ?? 0) + 1)
  const rest = [...freq.entries()].sort((a, b) => b[1] - a[1]).map(([t]) => t)
  return [...new Set([...direct, ...rest])].slice(0, max)
}

/**
 * Collections for the no-match page: by topic overlap first; otherwise ones for the same
 * ages as the closest matches, preferring the collections featured on the homepage.
 */
export function relatedCollections(topics: string[], exclude: string[] = [], ages: Age[] = [], max = 3): Item[] {
  const featured: string[] = homepage.collections.items
  const cols = defaultCatalogue.filter((i) => i.kind === 'collection' && !exclude.includes(i.id) && i.image.local)
  const score = (c: Item) =>
    c.topics.filter((t) => topics.includes(t)).length * 100 +
    (ages.length && c.ages.some((a) => ages.includes(a)) ? 10 : 0) +
    (featured.includes(c.id) ? 5 : 0) +
    Math.log10((c.resourceCount ?? 0) + 1)
  return [...cols].sort((a, b) => score(b) - score(a)).slice(0, max)
}

export function peopleFor(q: string): Person[] {
  const ts = tokens(q).filter((t) => t.length >= 3)
  if (!ts.length) return []
  return people.filter((p) =>
    p.relatedTerms.some((term) => ts.some((t) => term.startsWith(t) || (t.length >= term.length && t.startsWith(term)))),
  )
}

// ---------------------------------------------------------------- type-ahead

export interface Suggestion {
  text: string
  typed: string
  completion: string
}

export interface Typeahead {
  suggestions: Suggestion[]
  topics: string[]
  people: Person[]
  top: Item[]
  seeAllQuery: string
  seeAllCount: number
}

export function typeahead(q: string, scopeAges: Age[] = []): Typeahead {
  const index = getIndex()
  const typed = normalise(q)

  const suggestions = [...index.phrases.entries()]
    .filter(([p]) => p.startsWith(typed))
    .sort((a, b) => b[1] - a[1] || a[0].length - b[0].length)
    .slice(0, 4)
    .map(([p]) => ({ text: p, typed: p.slice(0, typed.length), completion: p.slice(typed.length) }))

  const live = applyFilters(search(q, { lastPrefixMin: 2 }).results, { ages: scopeAges, formats: [] })
  const seeAllQuery = suggestions[0]?.text ?? q.trim()
  const seeAll = applyFilters(search(seeAllQuery).results, { ages: scopeAges, formats: [] })

  return {
    suggestions,
    topics: queryTopics(parseQuery(seeAllQuery), live, 2),
    people: peopleFor(q),
    top: live.slice(0, 4).map((r) => r.item),
    seeAllQuery,
    seeAllCount: seeAll.length,
  }
}
