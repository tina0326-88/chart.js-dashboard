export default {
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      colors: {
        paper: '#EEF1F5',
        ink: '#1C2B45',
        ledger: {
          teal: '#1F7A64',
          deep: '#0F5445',
          amber: '#D98E2B',
          orange: '#C15A28',
          red: '#B23B2E',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}