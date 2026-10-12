// Open/close state for the header search overlay.
export function useSearchOverlay() {
  const open = useState('search-overlay', () => false)
  return { open, show: () => (open.value = true), hide: () => (open.value = false) }
}
