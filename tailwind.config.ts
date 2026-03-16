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
  plugins: [],
}

export default config