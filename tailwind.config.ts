import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Luma-inspired color palette
        brand: {
          DEFAULT: '#a89925',
          50: '#fdfcf5',
          100: '#f9f6e0',
          200: '#f3edc0',
          300: '#ebe096',
          400: '#d9c85a',
          500: '#a89925',
          600: '#8a7a1e',
          700: '#6b5e17',
          800: '#4d4310',
          900: '#2e2809',
        },
        // NeoBrutalism vibrant palette
        coral: "hsl(var(--coral))",
        sunny: "hsl(var(--sunny))",
        grape: "hsl(var(--grape))",
        mint: "hsl(var(--mint))",
        sky: "hsl(var(--sky))",
        ink: "hsl(var(--ink))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      backgroundColor: {
        'off-white': '#fcfcfa',
        'warm-gray': '#f5f5f4',
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        'neo-sm': '2px 2px 0 0 hsl(var(--ink))',
        'neo': '4px 4px 0 0 hsl(var(--ink))',
        'neo-lg': '6px 6px 0 0 hsl(var(--ink))',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'slide-in': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      }
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
export default config;
