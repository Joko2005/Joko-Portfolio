import type { Config } from 'tailwindcss'

const config: Config = {
// tells Tailwind which files to scan for class names
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // dark mode via a class on <html> — matches your toggleTheme() JS
  darkMode: 'class',
  theme: {
    extend: {
      // portfolio's color tokens
      colors: {
        cream:      '#F5F0E8',
        coolgray:   '#0F0E0C',
        red:        '#D63B2F',
        naturalgrey:'#8A8780',
        border:     '#D8D3C8',
        surface:    '#FDFCFA',
      },
      // three portfolio fonts
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body:    ['DM Mono', 'monospace'],
        serif:   ['Instrument Serif', 'serif'],
      },
      // custom easing to match your --ease CSS variable
      transitionTimingFunction: {
        'expo-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}

export default config