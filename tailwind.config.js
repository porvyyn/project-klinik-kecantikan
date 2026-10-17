/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Palet Warna Kustom Klinik Kecantikan
        white: '#FFFFFF',
        primary: {
          DEFAULT: '#DB2777', // Tombol utama, teks aktif, aksen penting
          hover: '#BE185D',
          light: '#FCE7F3',
          dark: '#9D174D',
        },
        secondary: {
          DEFAULT: '#E2C0C8', // Background card, hover, border soft
          light: '#FDF7F8',
          dark: '#C99EA8',
          border: '#D9ADB7',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          muted: '#FFF9FA',
          soft: '#FDF2F4',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(219, 39, 119, 0.08)',
        'soft-hover': '0 8px 25px -4px rgba(219, 39, 119, 0.16)',
        'card': '0 2px 12px rgba(226, 192, 200, 0.3)',
      },
    },
  },
  plugins: [],
};
