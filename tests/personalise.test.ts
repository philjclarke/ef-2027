import { describe, expect, it } from 'vitest'
import { getItem } from '../utils/catalogue'
import {
  bandLabel,
  curriculumFor,
  getRegion,
  localItems,
  localiseFor,
  prefsSummary,
  recommendFor,
  regionFromPostcode,
} from '../utils/personalise'

describe('postcodes', () => {
  it.each([
    ['HU1 2AA', 'humber'],
    ['bt7 1nn', 'belfast'],
    ['B15 2TT', 'west-midlands'],
    ['G12 8QQ', 'glasgow'],
    ['CF10 1AA', 'south-wales'],
    ['SW1A 1AA', 'london'],
  ])('%s → %s', (pc, id) => expect(regionFromPostcode(pc)?.id).toBe(id))

  it('returns null for areas without local content', () => {
    expect(regionFromPostcode('GL1 1AA')).toBeNull()
    expect(regionFromPostcode('')).toBeNull()
  })
})

describe('curriculum labels', () => {
  it('uses each nation’s year groups', () => {
    expect(bandLabel('england', '7-11')).toBe('Years 3–6')
    expect(bandLabel('scotland', '7-11')).toBe('P4–P7')
    expect(bandLabel('ni', '11-14')).toBe('Years 8–10')
  })
  it('maps a topic to the nation’s curriculum area', () => {
    const item = getItem('electricity-and-batteries')!
    expect(curriculumFor(item, 'england')).toBe('KS2 Science · Electricity')
    expect(curriculumFor(item, 'scotland')).toBe('First and Second level Sciences · Forces, electricity and waves')
  })
})

describe('local context', () => {
  it('uses a topic-specific line when the region has one', () => {
    const humber = getRegion('humber')!
    const r = localiseFor(getItem('electricity-from-the-wind-presentation')!, humber)
    expect(r.specific).toBe(true)
    expect(r.line).toMatch(/Hornsea/)
  })
  it('falls back to a general line otherwise', () => {
    const r = localiseFor(getItem('what-pet-would-you-choose-poster')!, getRegion('humber')!)
    expect(r.specific).toBe(false)
  })
  it('finds local items for the teacher’s ages', () => {
    const items = localItems({ nation: 'england', ages: ['11-14'], regionId: 'humber' })
    expect(items.length).toBeGreaterThan(0)
    expect(items.every((i) => i.ages.includes('11-14'))).toBe(true)
  })
})

describe('recommendations', () => {
  it('only returns items for the chosen ages', () => {
    const recs = recommendFor({ nation: 'scotland', ages: ['4-7'], regionId: null })
    expect(recs.length).toBeGreaterThan(0)
    expect(recs.every((i) => i.ages.includes('4-7'))).toBe(true)
  })
  it('summarises prefs in the nation’s terms', () => {
    expect(prefsSummary({ nation: 'scotland', ages: ['7-11', '11-14'], regionId: null })).toBe('P4–P7 and S1–S3 in Scotland')
  })
})
