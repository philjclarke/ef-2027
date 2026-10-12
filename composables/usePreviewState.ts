// Prototype-only state kept in localStorage: the "signed-in teacher" preview and saved items.
// Loaded on the client after hydration (see app.vue), so prerendered HTML is always signed out.
import homepage from '~/data/homepage.json'

interface SavedEntry {
  id: string
  at: number
  /** Fixed label for the seeded demo items ("Saved last week"). */
  label?: string
}

const SIGNED_IN_KEY = 'ef-preview-signed-in'
const SAVED_KEY = 'ef-saved'
const SEEDED_KEY = 'ef-saved-seeded'

function read<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key)
    return v ? (JSON.parse(v) as T) : fallback
  } catch {
    return fallback
  }
}
function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* private mode etc. */
  }
}

export const demoTeacher = homepage.signedInDemo

export function usePreviewState() {
  const signedIn = useState('signed-in', () => false)
  const saved = useState<SavedEntry[]>('saved', () => [])
  const loaded = useState('preview-loaded', () => false)

  function seedDemo() {
    if (read(SEEDED_KEY, false)) return
    const now = Date.now()
    const existing = new Set(saved.value.map((s) => s.id))
    const demo = demoTeacher.saved
      .filter((s) => !existing.has(s.id))
      .map((s, i) => ({ id: s.id, at: now - (i + 1) * 7 * 864e5, label: s.savedLabel }))
    saved.value = [...saved.value, ...demo]
    write(SAVED_KEY, saved.value)
    write(SEEDED_KEY, true)
  }

  function load(query: Record<string, unknown> = {}) {
    saved.value = read<SavedEntry[]>(SAVED_KEY, [])
    let s = read(SIGNED_IN_KEY, false)
    if (query.as === 'sam') s = true
    if (query.as === 'guest') s = false
    setSignedIn(s)
    loaded.value = true
  }

  function setSignedIn(v: boolean) {
    signedIn.value = v
    write(SIGNED_IN_KEY, v)
    if (v) seedDemo()
  }

  const isSaved = (id: string) => saved.value.some((s) => s.id === id)

  function toggleSaved(id: string) {
    saved.value = isSaved(id)
      ? saved.value.filter((s) => s.id !== id)
      : [{ id, at: Date.now() }, ...saved.value]
    write(SAVED_KEY, saved.value)
  }

  function savedLabel(id: string): string {
    const e = saved.value.find((s) => s.id === id)
    if (!e) return ''
    if (e.label) return e.label
    const mins = Math.round((Date.now() - e.at) / 60000)
    if (mins < 2) return 'Saved just now'
    if (mins < 60) return `Saved ${mins} minutes ago`
    const hrs = Math.round(mins / 60)
    if (hrs < 24) return `Saved ${hrs} hour${hrs === 1 ? '' : 's'} ago`
    return 'Saved this week'
  }

  return { signedIn, saved, loaded, load, setSignedIn, isSaved, toggleSaved, savedLabel }
}
