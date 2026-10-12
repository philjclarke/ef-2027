// Teacher's nation, classes and school area for homepage options B and C.
// Kept in localStorage; when previewing as signed-in Sam with nothing set, Sam's defaults apply.
import type { Prefs } from '~/utils/personalise'

const KEY = 'ef-personalise'
const SAM: Prefs = { nation: 'england', ages: ['7-11', '11-14'], regionId: 'humber', postcode: 'HU1' }

export function usePersonalisation() {
  const saved = useState<Prefs | null>('personalise', () => null)
  const { signedIn } = usePreviewState()

  const prefs = computed<Prefs | null>(() => saved.value ?? (signedIn.value ? SAM : null))
  const region = computed(() => getRegion(prefs.value?.regionId))
  const nation = computed(() => prefs.value?.nation ?? 'england')

  function load() {
    try {
      const v = localStorage.getItem(KEY)
      saved.value = v ? (JSON.parse(v) as Prefs) : null
    } catch {
      saved.value = null
    }
  }
  function set(p: Prefs) {
    saved.value = p
    try {
      localStorage.setItem(KEY, JSON.stringify(p))
    } catch {
      /* ignore */
    }
  }
  function clear() {
    saved.value = null
    try {
      localStorage.removeItem(KEY)
    } catch {
      /* ignore */
    }
  }

  return { prefs, region, nation, load, set, clear }
}
