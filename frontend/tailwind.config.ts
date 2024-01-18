import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
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

    }
  },
  plugins: [],
}
export default config
