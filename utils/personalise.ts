// Personalisation for homepage options B and C: UK nation curricula and local context.
// Pure functions over data/personalisation.json so they can be tested and later backed by an API
// (the "AI localisation" shown in the prototype is scripted from this data).
import data from '../data/personalisation.json'
import { AGES, catalogue, type Age, type Item } from './catalogue'

export type NationId = 'england' | 'scotland' | 'wales' | 'ni'

export interface Nation {
  name: string
  curriculum: string
  bands: Record<Age, { label: string; stage: string }>
}

export interface Region {
  id: string
  name: string
  place: string
  nation: NationId
  postcodes: string[]
  image: string
  facts: string[]
  topics: Record<string, string>
  default: string
  careers: string[]
  demoLine: string
}

export interface Prefs {
  nation: NationId
  ages: Age[]
  regionId: string | null
  postcode?: string
}

export const NATION_IDS: NationId[] = ['england', 'scotland', 'wales', 'ni']
export const nations = data.nations as Record<NationId, Nation>
export const regions = data.regions as unknown as Region[]
const subjects = data.subjects as Record<NationId, { primary: string; secondary: string }>
const areas = data.curriculumAreas as Record<string, Record<NationId, string>>

export const getRegion = (id: string | null | undefined) => regions.find((r) => r.id === id) ?? null

/** Year-group label for an age band in a nation, e.g. Scotland 7–11 → "P4–P7". */
export const bandLabel = (nation: NationId, age: Age) => nations[nation].bands[age].label
export const bandStage = (nation: NationId, age: Age) => nations[nation].bands[age].stage

/** "HU1 2AA" → the Humber. Matches the postcode area (the leading letters) exactly. */
export function regionFromPostcode(postcode: string): Region | null {
  const area = postcode.trim().toUpperCase().match(/^[A-Z]{1,2}/)?.[0]
  if (!area) return null
  return regions.find((r) => r.postcodes.includes(area)) ?? null
}

const isPrimary = (age: Age) => age === '4-7' || age === '7-11'

/** Curriculum tag for a card, e.g. "KS2 Science · Electricity". Null if we can't map the topic. */
export function curriculumFor(item: Item, nation: NationId, preferAges: Age[] = []): string | null {
  const topic = item.topics.find((t) => areas[t])
  if (!topic) return null
  const age = item.ages.find((a) => preferAges.includes(a)) ?? item.ages[0]
  if (!age) return null
  const subject = subjects[nation][isPrimary(age) ? 'primary' : 'secondary']
  return `${bandStage(nation, age)} ${subject} · ${areas[topic][nation]}`
}

/** What the (scripted) AI localisation changes for this item in this region. */
export function localiseFor(item: Item, region: Region): { line: string; specific: boolean } {
  const topic = item.topics.find((t) => region.topics[t])
  return topic ? { line: region.topics[topic], specific: true } : { line: region.default, specific: false }
}

// Items that don't make sense as personalised picks.
const skip = (i: Item) => /^parent-|calendar|autumn-events|free-post|entry-form/.test(i.id)

/** Resources and collections for the teacher's ages, local-context matches first, then newest. */
export function recommendFor(prefs: Prefs, opts: { limit?: number; exclude?: string[]; kind?: Item['kind'] } = {}): Item[] {
  const region = getRegion(prefs.regionId)
  const ages = prefs.ages.length ? prefs.ages : AGES
  const score = (i: Item) =>
    (region && i.topics.some((t) => region.topics[t]) ? 3 : 0) +
    (i.topics.some((t) => areas[t]) ? 1 : 0) +
    (i.kind === 'collection' ? 0.5 : 0) +
    i.date / 1_000_000
  return catalogue
    .filter((i) => !skip(i) && i.ages.some((a) => ages.includes(a)))
    .filter((i) => !opts.kind || i.kind === opts.kind)
    .filter((i) => !opts.exclude?.includes(i.id))
    .sort((a, b) => score(b) - score(a) || a.order - b.order)
    .slice(0, opts.limit ?? 8)
}

/** Items that get a topic-specific local example in this region. */
export function localItems(prefs: Prefs, limit = 4): Item[] {
  const region = getRegion(prefs.regionId)
  if (!region) return []
  const ages = prefs.ages.length ? prefs.ages : AGES
  return catalogue
    .filter((i) => !skip(i) && i.ages.some((a) => ages.includes(a)) && i.topics.some((t) => region.topics[t]))
    .sort((a, b) => (b.image.local ? 1 : 0) - (a.image.local ? 1 : 0) || b.date - a.date)
    .slice(0, limit)
}

/** Short summary, e.g. "Years 3–6 and Years 7–9 in England". */
export function prefsSummary(prefs: Prefs): string {
  const labels = AGES.filter((a) => prefs.ages.includes(a)).map((a) => bandLabel(prefs.nation, a))
  const who = labels.length ? labels.join(' and ') : 'all ages'
  return `${who} in ${nations[prefs.nation].name}`
}
