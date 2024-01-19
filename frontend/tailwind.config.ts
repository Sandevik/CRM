import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        "background-dark": "#020108",
        "background-light": "#242038",
        "white": "#FFFFFF",
  
  
        "greenish": "#21A0AB",
  
          "light-blue": "#C3DFE0",
          "light-purple": "#8D86C9",
          "light-red": "#EF798A",
          "yellow": "#DDD92A",
          "light-yellow": "#EAE151"
  
      },
      gridTemplateColumns: {
        "calendar": "repeat(7, 1fr)",
        "auto-fill": "repeat(auto-fill, 1fr)"
      }
    }
  },
  plugins: [],
}
export default config
