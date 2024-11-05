import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        // ISU Primary Colors
        isu: {
          cardinal: '#C8102E', // Primary red
          gold: '#F1BE48',    // Primary gold
          darkGreen: '#524727',
          sage: '#9B945F',
          warm: '#CAC7A7',
        },
        // Message colors
        message: {
          user: '#C8102E',    // ISU Cardinal for user messages
          assistant: '#CAC7A7' // ISU Warm for assistant messages
        },
        // Background colors
        background: {
          primary: '#FFFFFF',
          secondary: '#F5F5F5',
          dark: '#1A1A1A'
        }
      }
    }
  },
  plugins: [require('postcss-import'), require('@tailwindcss/typography')]
}

export default config