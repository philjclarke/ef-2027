import type { Config } from 'tailwindcss'

// Design tokens from BRIEF.md §5. Body font is a stand-in for Proxima Nova:
// swap the first entry of `fontFamily.body` (and the Google Fonts config) to change it.
export default {
  content: ['./components/**/*.vue', './layouts/**/*.vue', './pages/**/*.vue', './app.vue', './utils/**/*.ts'],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: '#110E63', 700: '#1F1B7A', hover: '#3A3784' },
        muted: '#4A4785',
        'on-navy': { DEFAULT: '#D9D8F0', label: '#C9C8E6' },
        sky: { DEFAULT: '#8FB4DC', 50: '#D6E6F5' },
        teal: { 50: '#D7EBEB' },
        lilac: { 25: '#F7F7FB', 50: '#F3F3F9', 100: '#F1F1F8', 150: '#E9E9F4' },
        line: { DEFAULT: '#E4E3F2', soft: '#E9E9F1', strong: '#DCDCEA' },
        yellow: { DEFAULT: '#FFCF2C' },
        age: { '4-7': '#C3B3EE', '7-11': '#5FBE98', '11-14': '#FFCF2C', '14-16': '#80B3DD' },
        // Homepage options B and C: the brand palette dialled up a notch, plus a warm coral accent.
        // Navy text passes 4.5:1 on all of these.
        pop: {
          blue: '#6AA6EA',
          mint: '#46C596',
          sun: '#FFC629',
          lilac: '#B39BF6',
          coral: '#FF8A6B',
          'blue-soft': '#E1EEFC',
          'mint-soft': '#DDF5EA',
          'sun-soft': '#FFF3CC',
          'lilac-soft': '#EEE8FE',
          'coral-soft': '#FFE6DE',
          cream: '#FFF9EF',
        },
      },
      fontFamily: {
        heading: ['Poppins', '"Poppins Fallback"', 'system-ui', 'sans-serif'],
        body: ['Figtree', '"Proxima Nova"', '"Figtree Fallback"', 'system-ui', 'sans-serif'],
      },
      maxWidth: { container: '1320px' },
      boxShadow: {
        lift: '0 18px 40px rgba(17,14,99,.14)',
        search: '0 14px 34px rgba(17,14,99,.22)',
        'search-sm': '0 10px 28px rgba(17,14,99,.14)',
        card: '0 10px 30px rgba(17,14,99,.12)',
        'card-sm': '0 8px 24px rgba(17,14,99,.12)',
        pill: '0 0 0 2px #fff',
      },
    },
  },
  plugins: [],
} satisfies Config
