import { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      screens: {
        xs: '480px', // кастомный брейкпоинт
      },
    },
  },
  plugins: [],
};

export default config;
