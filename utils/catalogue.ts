// Loads catalogue.json (+ hand-added items), and enriches each item at load time
// with topics, careers/teaching kind, a date and display helpers.
import catalogueRaw from '../data/catalogue.json'
import additionsRaw from '../data/catalogue-additions.json'
import searchConfig from '../data/search-config.json'
import peopleRaw from '../data/people.json'
import descriptions from '../data/descriptions.json'

export type Age = '4-7' | '7-11' | '11-14' | '14-16'
export type Format = 'PDF' | 'PowerPoint' | 'Video' | 'Interactive'
export type Kind = 'resource' | 'collection'
export type ResourceKind = 'careers' | 'teaching'

export interface RawItem {
  id: string
  kind: Kind
  legacyType: string
  title: string
  level: string[]
  ages: string[]
  agesOriginal: string[]
  format: string | null
  resourceCount: number | null
  description: string
  liveUrl: string
  image: { remote: string; remoteLarge: string; local: string | null }
}

export interface Item extends Omit<RawItem, 'ages' | 'format'> {
  ages: Age[]
  format: Format | null
  topics: string[]
  resourceKind: ResourceKind
  /** yyyymm from the upload folder in the image path, for "Newest". */
  date: number
  img: string
  /** Order in the source catalogue, used as a stable tie-break. */
  order: number
}

export interface Person {
  id: string
  name: string
  role: string
  image: string
  cardColour: 'yellow' | 'white' | 'green'
  badge: string
  itemId: string
  relatedTerms: string[]
}

export const AGES: Age[] = ['4-7', '7-11', '11-14', '14-16']
export const FORMATS: Format[] = ['PDF', 'PowerPoint', 'Interactive', 'Video']
export const config = searchConfig

export const ageInfo = searchConfig.ageLabels as Record<
  Age,
  { label: string; hint: string; level: 'Primary' | 'Secondary'; colour: string }
>

/** "7-11" → "7–11" (en dash for display; data keys keep the hyphen). */
export const ageLabel = (a: string) => ageInfo[a as Age]?.label ?? a.replace('-', '–')

const careersRe = new RegExp(searchConfig.careersPattern, 'i')

function topicsFor(text: string): string[] {
  const t = ` ${text.toLowerCase()} `
  return searchConfig.topics
    .filter((topic) =>
      topic.match.some((kw) => {
        // Keywords match at the start of a word ("electric" → "electricity").
        const esc = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        return new RegExp(`(^|[^a-z])${esc}`).test(t)
      }),
    )
    .map((topic) => topic.name)
}

function dateFor(url: string): number {
  const m = url.match(/\/(20\d\d)\/(\d\d)\//)
  return m ? Number(m[1]) * 100 + Number(m[2]) : 0
}

function enrich(raw: RawItem, order: number): Item {
  const ages = [...new Set(raw.ages.map((a) => (searchConfig.ageBands as Record<string, string>)[a] ?? a))]
    .filter((a): a is Age => (AGES as string[]).includes(a))
    .sort((a, b) => AGES.indexOf(a) - AGES.indexOf(b))
  const description = raw.description || (descriptions as Record<string, string>)[raw.id] || ''
  return {
    ...raw,
    description,
    ages,
    format: (raw.format as Format | null) ?? null,
    topics: topicsFor(`${raw.title} ${description}`),
    resourceKind: careersRe.test(raw.title) ? 'careers' : 'teaching',
    date: dateFor(raw.image.remote),
    img: raw.image.local || raw.image.remote,
    order,
  }
}

const rawItems = [...(catalogueRaw.items as RawItem[]), ...(additionsRaw.items as RawItem[])]
export const catalogue: Item[] = rawItems.map(enrich)
export const byId = new Map(catalogue.map((i) => [i.id, i]))
export const people = peopleRaw as Person[]

export function getItem(id: string): Item | undefined {
  return byId.get(id)
}

/** Small uppercase badge on resource thumbnails, e.g. "POSTER · PDF". */
export function badgeFor(item: Item, opts: { isNew?: boolean } = {}): string {
  if (item.kind === 'collection') return `COLLECTION · ${item.resourceCount ?? ''}`.trim()
  const t = item.title.toLowerCase()
  let sub = ''
  if (/poster/.test(t)) sub = 'POSTER'
  else if (/job card|role card/.test(t)) sub = 'JOB CARD'
  else if (/quiz|check your learning/.test(t) && item.format !== 'Interactive') sub = 'QUIZ'
  else if (/activity sheet/.test(t)) sub = 'ACTIVITY'
  const fmt = (item.format ?? '').toUpperCase()
  if (opts.isNew) return `NEW · ${sub || fmt}`
  return sub && fmt ? `${sub} · ${fmt}` : fmt || sub
}

/** One clear action per card, by format. */
export function actionFor(item: Item): { label: string; icon: 'download' | 'play' | 'launch' | 'open' | 'arrow' } {
  if (item.kind === 'collection') return { label: 'View collection', icon: 'arrow' }
  switch (item.format) {
    case 'PDF':
    case 'PowerPoint':
      return { label: 'Download', icon: 'download' }
    case 'Video':
      return { label: 'Watch', icon: 'play' }
    case 'Interactive':
      return { label: 'Launch', icon: 'launch' }
    default:
      return { label: 'Open', icon: 'open' }
  }
}

export const levelLabel = (item: Item) => item.level.join(', ')

/** Stack tint behind collection cards: green for primary-only, otherwise blue/yellow. */
export function stackTint(item: Item): { back: string; mid: string } {
  const tints = {
    green: { back: '#CFEDE0', mid: '#A7DCC5' },
    blue: { back: '#C9DCF0', mid: '#AFCBE8' },
    yellow: { back: '#FFEDB0', mid: '#FFDB66' },
  }
  if (item.level.length === 1 && item.level[0] === 'Primary') return tints.green
  let h = 0
  for (const c of item.id) h = (h * 31 + c.charCodeAt(0)) >>> 0
  return h % 2 ? tints.yellow : tints.blue
}

export const collectionCountLabel = (item: Item) =>
  `${item.resourceCount ?? 0} resource${item.resourceCount === 1 ? '' : 's'}`

/** Fallback one-liner for collections scraped without a description. */
export function summaryFor(item: Item): string {
  if (item.description) return item.description
  const ages = item.ages.map(ageLabel)
  const ageText = ages.length > 1 ? `${ages[0].split('–')[0]}–${ages[ages.length - 1].split('–')[1]}` : ages[0]
  const topics = item.topics.slice(0, 2).map((t) => t.toLowerCase())
  const about = topics.length ? ` on ${topics.join(' and ')}` : ''
  return item.kind === 'collection'
    ? `${collectionCountLabel(item)}${about}, for ages ${ageText}.`
    : `For ages ${ageText}.`
}
