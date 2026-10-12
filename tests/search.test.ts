import { describe, expect, it } from 'vitest'
import { catalogue } from '../utils/catalogue'
import {
  applyFilters,
  bestMatch,
  facetCounts,
  parseQuery,
  queryTopics,
  relatedCollections,
  search,
  stem,
  typeahead,
} from '../utils/search'

describe('stemmer', () => {
  it.each([
    ['magnets', 'magnet'],
    ['batteries', 'battery'],
    ['fossils', 'fossil'],
    ['rockets', 'rocket'],
    ['circuits', 'circuit'],
    ['electrolysis', 'electrolysis'],
    ['boxes', 'box'],
  ])('%s → %s', (a, b) => expect(stem(a)).toBe(b))
})

describe('query parsing', () => {
  it('maps year groups to ages and removes them', () => {
    const p = parseQuery('Year 5 circuits')
    expect(p.ages).toEqual(['7-11'])
    expect(p.terms).toEqual(['circuit'])
  })
  it('maps format words and drops stopwords', () => {
    const p = parseQuery('electricity ppt lesson for KS3')
    expect(p.formats).toEqual(['PowerPoint'])
    expect(p.ages).toEqual(['11-14'])
    expect(p.terms).toEqual(['electricity'])
  })
})

describe('catalogue', () => {
  it('includes the hand-added interactives', () => {
    expect(catalogue.filter((i) => i.format === 'Interactive').length).toBe(9)
  })
  it('never tags rocket science as rocks and fossils', () => {
    const rocket = catalogue.find((i) => i.id === 'rocket-science-primary')!
    expect(rocket.topics).not.toContain('Rocks and fossils')
  })
})

// BRIEF §8 acceptance tests
describe('acceptance', () => {
  it('electricity: 19+ results, best match is Electricity and batteries, careers chip shows 8', () => {
    const r = search('electricity')
    expect(r.mode).toBe('exact')
    expect(r.results.length).toBeGreaterThanOrEqual(19)
    const best = bestMatch(r.results, r.mode)
    expect(best?.item.id).toBe('electricity-and-batteries')
    expect(best?.item.resourceCount).toBe(36)
    const careers = r.results.filter((x) => x.item.kind === 'resource' && x.item.resourceKind === 'careers')
    expect(careers.length).toBe(8)
  })

  it('electricity with 14–16: 1 result (the 11–16 careers poster), and 4–7 has a count of 0', () => {
    const r = search('electricity')
    const filtered = applyFilters(r.results, { ages: ['14-16'], formats: [] })
    expect(filtered.map((x) => x.item.id)).toEqual(['careers-linked-to-electricity-poster-11-16'])
    const counts = facetCounts(r.results, { ages: ['14-16'], formats: [] })
    expect(counts.ages['4-7']).toBe(0)
  })

  it('magnets: the two GCSE waves knowledge organisers, not zero', () => {
    const r = search('magnets')
    expect(r.results.map((x) => x.item.id).sort()).toEqual(
      ['gcse-combined-science-knowledge-organiser-waves', 'gcsephysicskowaves'].sort(),
    )
    expect(r.correctedTerm).toBe('magnet')
  })

  it('electrcity (typo): no exact matches, showing results for electricity', () => {
    const r = search('electrcity')
    expect(r.mode).toBe('corrected')
    expect(r.correctedTerm).toBe('electricity')
    expect(r.results.length).toBeGreaterThanOrEqual(19)
  })

  it('year 5 circuits: applies 7–11 and puts Circuits and symbols activity sheet 2 near the top', () => {
    const r = search('year 5 circuits')
    expect(r.parsed.ages).toEqual(['7-11'])
    const top = applyFilters(r.results, { ages: r.parsed.ages, formats: [] }).slice(0, 3)
    expect(top.map((x) => x.item.id)).toContain('circuits-and-symbols-activity-sheet-2')
  })

  it('rockets: both rocket science collections', () => {
    const ids = search('rockets').results.map((x) => x.item.id)
    expect(ids).toContain('rocket-science-primary')
    expect(ids).toContain('rocket-science-secondary')
  })

  it('zzzz: no results, but related collections so there is no dead end', () => {
    const r = search('zzzz')
    expect(r.mode).toBe('none')
    expect(r.results).toHaveLength(0)
    expect(relatedCollections([])).toHaveLength(3)
  })
})

describe('extras', () => {
  it('topic tags for electricity include Electricity', () => {
    const r = search('electricity')
    expect(queryTopics(r.parsed, r.results)[0]).toBe('Electricity')
  })
  it('rockets is tagged Space, not Rocks and fossils', () => {
    const r = search('rockets')
    const topics = queryTopics(r.parsed, r.results)
    expect(topics).toContain('Space')
    expect(topics).not.toContain('Rocks and fossils')
  })
  it('type-ahead completes "electri"', () => {
    const t = typeahead('electri')
    expect(t.suggestions[0].text).toBe('electricity')
    expect(t.suggestions[0].completion).toBe('city')
    expect(t.top.length).toBe(4)
    expect(t.people.map((p) => p.id)).toEqual(['imisi', 'james'])
  })
  it('games finds the interactives', () => {
    const r = search('science games')
    expect(r.parsed.formats).toEqual(['Interactive'])
  })
})

describe('no-match page', () => {
  it('magnets suggests collections for the same ages (Knowledge organisers), not the events calendars', () => {
    const r = search('magnets')
    const ages = [...new Set(r.results.flatMap((x) => x.item.ages))]
    const ids = relatedCollections([], r.results.map((x) => x.item.id), ages).map((c) => c.id)
    expect(ids).toContain('knowledge-organisers')
    expect(ids.some((id) => id.startsWith('autumn-events'))).toBe(false)
  })
})
