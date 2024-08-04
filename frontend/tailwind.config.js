/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      keyframes: {
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
      },
      animation: {
        "caret-blink": "caret-blink 1.25s ease-out infinite",
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },

        // Cyberpunk
        // brand: {
        //   50: '#E6DFFF', // Lightest neon purple, for subtle highlights
        //   100: '#CCBCFF', // Very light neon purple, for background accents
        //   200: '#B099FF', // Light neon purple, for buttons and interactive elements
        //   300: '#9466FF', // Medium neon purple, for primary UI elements
        //   400: '#7833FF', // Vibrant neon purple, the core brand color
        //   500: '#5D00FF', // Dark neon purple, for impactful elements
        //   600: '#4C00CC', // Deeper purple, for hover states or active elements
        //   700: '#3A0099', // Darker purple, for strong contrasts
        //   800: '#290066', // Even darker purple, suitable for text or accents
        //   900: '#180033', // Deepest purple, for maximum contrast and depth
        // },

        // neutral: {
        //   50: '#F2F2F5', // Lightest gray, almost white, for background highlights
        //   100: '#E6E6EA', // Very light gray, for subtle backgrounds and divisions
        //   200: '#CFCFD5', // Light gray, ideal for borders or UI divisions
        //   300: '#B8B8C0', // Medium-light gray, for secondary UI elements
        //   400: '#A1A1AB', // Balanced medium gray, for neutral text and icons
        //   500: '#8A8A96', // Standard neutral gray, ideal for primary text and UI
        //   600: '#737381', // Slightly darker gray, for subdued text or active elements
        //   700: '#5C5C6C', // Dark gray, suitable for strong contrast in light mode
        //   800: '#454557', // Darker gray, ideal for text and elements on light backgrounds
        //   900: '#2E2E42', // Even darker gray, for high contrast on light or dark themes
        //   950: '#171721', // Nearly black, for maximum contrast, especially in dark mode
        // },

        // CYBERPUNK NEON BLUE

        // brand: {
        //   50: '#FFE6D0', // Lightest neon orange, for subtle highlights
        //   100: '#FFCCB3', // Very light neon orange, for background accents
        //   200: '#FFB399', // Light neon orange, for buttons and interactive elements
        //   300: '#FF9966', // Medium neon orange, for primary UI elements
        //   400: '#FF8000', // Vibrant neon orange, the core brand color
        //   500: '#E67300', // Dark neon orange, for impactful elements
        //   600: '#CC6600', // Deeper orange, for hover states or active elements
        //   700: '#B35900', // Darker orange, for strong contrasts
        //   800: '#994D00', // Even darker orange, suitable for text or accents
        //   900: '#803C00', // Deepest orange, for maximum contrast and depth
        // },

        neutral: {
          50: '#FFFFFF', // Pure white, for background highlights and clean look
          100: '#F2F2F2', // Very light gray, almost white, for subtle backgrounds
          200: '#E6E6E6', // Light gray, for borders or UI divisions
          300: '#CCCCCC', // Medium-light gray, for secondary UI elements
          400: '#B3B3B3', // Balanced medium gray, for neutral text and icons
          500: '#999999', // Standard neutral gray, ideal for primary text and UI
          600: '#808080', // Slightly darker gray, for subdued text or active elements
          700: '#666666', // Dark gray, for strong contrast in light mode
          800: '#4D4D4D', // Darker gray, ideal for text and elements on light backgrounds
          900: '#333333', // Even darker gray, for high contrast on light or dark themes
          950: '#1A1A1A', // Nearly black, for maximum contrast, especially in dark mode
        },

        //  Cyberpunk blue
        // neutral: {
        //   50: '#FFFFFF', // Pure white, for background highlights and clean look
        //   100: '#F2F2F2', // Very light gray, almost white, for subtle backgrounds
        //   200: '#E6E6E6', // Light gray, for borders or UI divisions
        //   300: '#CCCCCC', // Medium-light gray, for secondary UI elements
        //   400: '#B3B3B3', // Balanced medium gray, for neutral text and icons
        //   500: '#999999', // Standard neutral gray, ideal for primary text and UI
        //   600: '#808080', // Slightly darker gray, for subdued text or active elements
        //   700: '#666666', // Dark gray, for strong contrast in light mode
        //   800: '#4D4D4D', // Darker gray, ideal for text and elements on light backgrounds
        //   900: '#333333', // Even darker gray, for high contrast on light or dark themes
        //   950: '#1A1A1A', // Nearly black, for maximum contrast, especially in dark mode
        // },

        // brand: {
        //   50: '#E0FFFF', // Lightest neon cyan, for subtle highlights
        //   100: '#B3FFFF', // Very light neon cyan, for background accents
        //   200: '#80FFFF', // Light neon cyan, for buttons and interactive elements
        //   300: '#4DFFFF', // Medium neon cyan, for primary UI elements
        //   400: '#1AFFFF', // Vibrant neon cyan, the core brand color
        //   500: '#00E5FF', // Dark neon cyan, for impactful elements
        //   600: '#00B3CC', // Deeper cyan, for hover states or active elements
        //   700: '#008299', // Darker cyan, for strong contrasts
        //   800: '#005266', // Even darker cyan, suitable for text or accents
        //   900: '#002933', // Deepest cyan, for maximum contrast and depth
        // },

        // MINT
        // brand: {
        //   50: '#EBFFF7', // Lightest mint green, for background highlights
        //   100: '#D5FEE4', // Your light mint green, for light theme backgrounds
        //   200: '#BFF8DA', // Slightly darker mint, for cards and accents
        //   300: '#A8F1D0', // Medium mint, versatile for buttons and UI elements
        //   400: '#92EBC6', // Deeper mint, for primary elements
        //   500: '#8BE8E5', // Your vibrant turquoise, for standout elements
        //   600: '#68D0C8', // Darker turquoise, for active states or hover effects
        //   700: '#45B8AB', // Dark turquoise, suitable for strong contrasts
        //   800: '#22908E', // Deeper turquoise, for text on light backgrounds
        //   900: '#006872', // Darkest turquoise, for maximum contrast
        // },
        // neutral: {
        //   50: '#F9F9F9', // Lightest grey, almost white, for background highlights
        //   100: '#F2F2F2', // Very light grey, for subtle backgrounds and UI elements
        //   200: '#E6E6E6', // Light grey, slightly darker, ideal for borders or divisions
        //   300: '#D9D9D9', // Medium-light grey, versatile for various elements
        //   400: '#CCCCCC', // Balanced medium grey, neutral for secondary text and icons
        //   500: '#BFBFBF', // Standard neutral grey, ideal for primary text and UI elements
        //   600: '#B3B3B3', // Slightly darker grey, for subdued text or elements
        //   700: '#A6A6A6', // Dark grey, suitable for contrast in light mode
        //   800: '#0A0628', // Your deep dark blue, for strong contrast and headers
        //   900: '#080622', // Even darker blue, for maximum contrast in various themes
        //   950: '#05031B', // Nearly black blue, for deep contrast and accents
        // },

        // Green refined
        // brand: {
        //   50: '#E8F9ED', // Lightest green, almost white, for subtle highlights
        //   100: '#CFF5D7', // Very light green, for subtle backgrounds
        //   200: '#A9EFC0', // Light green, slightly darker, for UI elements
        //   300: '#7FE9A3', // Medium-light green, for buttons and accents
        //   400: '#4FE292', // Vibrant medium green, for primary buttons and links
        //   500: '#1CDB8B', // Your original brand green, for primary elements
        //   600: '#16B478', // Slightly darker green, for active states or hover effects
        //   700: '#12906A', // Dark green, suitable for strong contrast and headers
        //   800: '#0E7558', // Darker green, for text on light backgrounds
        //   900: '#0B6148', // Even darker green, for maximum contrast in various themes
        //   950: '#084D38', // Very dark green, for deep contrast and accents
        // },

        // neutral: {
        //   50: '#FBFCFD', // Lightest grey, almost white, for highlights in light theme
        //   100: '#F3F4F6', // Very light grey, for subtle backgrounds in light theme
        //   200: '#E6E8EC', // Light grey, ideal for borders or subtle divisions
        //   300: '#D0D4DA', // Medium-light grey, versatile for various elements
        //   400: '#AEB6C1', // Balanced medium grey, neutral for text and icons
        //   500: '#8D98A4', // Standard neutral grey, ideal for primary text
        //   600: '#7A8593', // Slightly darker grey, for subdued text or elements
        //   700: '#646E7C', // Dark grey, suitable for strong contrast in light mode
        //   800: '#505B68', // Darker grey, ideal for text on light backgrounds
        //   900: '#3C4754', // Even darker grey, for high contrast in various themes
        //   950: '#2D3643', // Nearly black, for maximum contrast in dark mode
        // },

        // brand: {
        //   50: '#E6FAF5', // Lightest teal, almost white, for subtle highlights
        //   100: '#CCF4EA', // Very light teal, for subtle backgrounds
        //   200: '#99E9D5', // Light teal, slightly darker, for UI elements
        //   300: '#66DFBF', // Medium-light teal, for buttons and accents
        //   400: '#33D4AA', // Vibrant medium teal, for primary buttons and links
        //   500: '#00f5a0', // Original brand teal, for primary elements
        //   600: '#00B383', // Slightly darker teal, for active states or hover effects
        //   700: '#009C72', // Dark teal, suitable for strong contrast and headers
        //   800: '#008560', // Darker teal, for text on light backgrounds
        //   900: '#006E4E', // Even darker teal, for maximum contrast in various themes
        //   950: '#00573C', // Very dark teal, for deep contrast and accents
        // },

        // brand: {
        //   50: '#CCFFEB', // Lightest shade, almost white, for subtle highlights
        //   100: '#99FFDA', // Very light neon green, for background accents
        //   200: '#66FFC9', // Light neon green, for buttons and interactive elements
        //   300: '#33FFB8', // Medium neon green, for primary UI elements
        //   400: '#00FFA7', // Vibrant neon green, closer to the core brand color
        //   500: '#00F5A0', // Your original brand green, for primary elements
        //   600: '#00C280', // Slightly darker green, for active states or hover effects
        //   700: '#009060', // Dark green, suitable for strong contrast and headers
        //   800: '#005E40', // Darker green, for text on light backgrounds
        //   900: '#002F20', // Even darker green, for maximum contrast in various themes
        //   950: '#001810', // Very dark green, for deep contrast and accents
        // },

        brand: {
          50: '#fafaf9', // Lightest stone, for subtle highlights
          100: '#f5f5f4', // Very light stone, for background accents
          200: '#e7e5e4', // Light stone, for buttons and interactive elements
          300: '#d6d3d1', // Medium stone, for primary UI elements
          400: '#a8a29e', // Core brand stone color
          500: '#78716c', // Dark stone, for impactful elements
          600: '#57534e', // Deeper stone, for hover states or active elements
          700: '#44403c', // Darker stone, for strong contrasts
          800: '#292524', // Even darker stone, suitable for text or accents
          900: '#1c1917', // Deepest stone, for maximum contrast and depth
          950: '#0c0a09', // Darkest stone, for the deepest contrast and accents
        },

        offBlack: {
          950: '#121212',
          900: '#0F0F0E',
        },

        neutral: {
          50: '#f6f6f6',
          100: '#e7e7e7',
          200: '#d1d1d1',
          300: '#b0b0b0',
          400: '#868686',
          500: '#6d6d6d',
          600: '#5d5d5d',
          700: '#4f4f4f',
          800: '#454545',
          900: '#3d3d3d',
          950: '#262626',
        },

        // neutral: {
        //   50: '#FAFBFB', // Lightest grey, almost white, for background highlights
        //   100: '#F5F6F6', // Very light grey, for subtle backgrounds in light theme
        //   200: '#EDEEEE', // Light grey, ideal for borders or subtle divisions
        //   300: '#D8DADA', // Medium-light grey, versatile for various elements
        //   400: '#C2C4C4', // Balanced medium grey, neutral for text and icons
        //   500: '#ACAEAE', // Standard neutral grey, ideal for primary text and UI
        //   600: '#969898', // Slightly darker grey, for subdued text or elements
        //   700: '#808282', // Dark grey, suitable for strong contrast in light mode
        //   800: '#6A6C6C', // Darker grey, ideal for text and elements on light backgrounds
        //   900: '#545656', // Even darker grey, for high contrast on light or dark themes
        //   950: '#3E4040', // Nearly black, for maximum contrast, especially in dark mode
        // },
        // neutral: {
        //   50: '#F9FAFB', // Lightest grey, almost white, for highlights in light theme
        //   100: '#F1F3F5', // Very light grey, for subtle backgrounds in light theme
        //   200: '#E3E6E9', // Light grey, ideal for borders or subtle divisions
        //   300: '#C5CBD0', // Medium-light grey, versatile for various elements
        //   400: '#A7AFB8', // Balanced medium grey, neutral for text and icons
        //   500: '#89939F', // Standard neutral grey, ideal for primary text
        //   600: '#6B7786', // Slightly darker grey, for subdued text or elements
        //   700: '#4D5B6C', // Dark grey, suitable for strong contrast in light mode
        //   800: '#2F3F52', // Darker grey, ideal for text on light backgrounds
        //   900: '#111D38', // Even darker grey, for high contrast on light or dark themes
        //   950: '#000A20', // Nearly black, for maximum contrast in dark mode
        // },

        // GREEN
        // brand: {
        //   50: '#effef7',
        //   100: '#dafeef',
        //   200: '#b8fadd',
        //   300: '#81f4c4',
        //   400: '#43e5a1',
        //   500: '#1cdb8b',
        //   600: '#0faa69',
        //   700: '#108555',
        //   800: '#126946',
        //   900: '#11563b',
        //   950: '#033020',
        // },
        // neutral: {
        //   50: '#FAFBFC', // Lightest grey, almost white, for background highlights in light theme
        //   100: '#F2F3F5', // Very light grey, for subtle backgrounds and divisions in light theme
        //   200: '#E5E7EB', // Light grey, slightly darker, ideal for borders or subtle divisions
        //   300: '#D1D6DC', // Medium-light grey, versatile for backgrounds and UI elements
        //   400: '#B0B8C3', // Balanced medium grey, neutral for secondary text and icons
        //   500: '#8F9BA8', // Standard neutral grey, ideal for primary text and UI elements
        //   600: '#7B8694', // Slightly darker grey, for subdued text or active elements
        //   700: '#65707D', // Dark grey, suitable for strong contrast in light mode
        //   800: '#525D69', // Darker grey, ideal for text and elements on light backgrounds
        //   900: '#3E4955', // Even darker grey, offers high contrast on light and dark themes
        //   950: '#2F3846', // Nearly black, for maximum contrast, especially in dark mode
        // },
        /* MINIMAL THEME FOR AI CHAT WEB APP */
        // brand: {
        //   50: '#E4F2F9', // Lightest sky blue, brighter for contrast on light background
        //   100: '#C6E4F3', // Light sky blue, complements light theme
        //   200: '#A8D6ED', // Clear sky blue, for a refreshing feel
        //   300: '#6AB8E3', // Brighter sky blue, stands out on both themes
        //   400: '#4CA6DE', // A vibrant variant of primary
        //   500: '#318FC9', // Primary color, a bit deeper for versatility
        //   600: '#2979B1', // Slightly darker for active or hover states
        //   700: '#215D91', // Deeper blue for stronger contrast
        //   800: '#1A4C77', // Dark shade for accents or emphasis
        //   900: '#153A5F', // Darkest shade for text or accents
        //   950: '#102C48', // Nearing navy, for deep contrast
        // },
        // neutral: {
        //   50: '#FBFCFD', // Very light grey, brighter for light theme
        //   100: '#F3F4F6', // Light grey for subtle differentiation
        //   200: '#E6E8EC', // Slightly darker, for borders or divisions
        //   300: '#D0D4DA', // Mid-light grey, versatile for various elements
        //   400: '#AEB6C1', // Medium grey, neutral and balanced
        //   500: '#8D98A4', // Neutral grey, ideal for text
        //   600: '#7A8593', // Slightly darker for subdued text or elements
        //   700: '#646E7C', // Deeper grey for stronger contrast
        //   800: '#505B68', // Dark grey, suitable for text on light backgrounds
        //   900: '#3C4754', // Darker grey for contrast on light or dark themes
        //   950: '#2D3643', // Very dark grey, for maximum contrast
        // },

        // Blue Theme
        // brand: {
        //   50: '#E3F5F9', // Lightest sky blue
        //   100: '#C8EBF2',
        //   200: '#A2DDEC',
        //   300: '#7CCCE5',
        //   400: '#56BADD', // A lighter variant of primary
        //   500: '#329CD8', // Primary color (sky blue)
        //   600: '#2D89C2', // Slightly darker for active or hover states
        //   700: '#276FA7',
        //   800: '#225B90',
        //   900: '#1D4C7A', // Darkest shade for text or accents
        //   950: '#183D65', // Almost black, for deep contrast
        // },

        // neutral: {
        //   50: '#FAFBFC', // Very light grey
        //   100: '#F2F3F5',
        //   200: '#E5E7EB',
        //   300: '#D1D5DB',
        //   400: '#B0B8C1', // Medium grey
        //   500: '#8E99A4', // Neutral color (for text)
        //   600: '#7C8794', // Slightly darker for subdued text
        //   700: '#656E7A',
        //   800: '#4F5966',
        //   900: '#3B4553', // Dark grey, suitable for contrast text on light backgrounds
        //   950: '#2C3542', // Very dark grey, for the darkest elements like text on light backgrounds or backgrounds on dark themes
        // },

        // OG
        // brand: {
        //   50: '#eefcfd',
        //   100: '#d5f6f8',
        //   200: '#b0ecf1',
        //   300: '#79dde7',
        //   400: '#3bc5d5',
        //   500: '#22b8cd',
        //   600: '#1d879d',
        //   700: '#1e6d80',
        //   800: '#215a69',
        //   900: '#1f4b5a',
        //   950: '#0f313d',
        // },
        // neutral: {
        //   50: '#FCFCF9',
        //   100: '#e7e7e6',
        //   200: '#d2d2cf',
        //   300: '#b2b1ae',
        //   400: '#8b8b85',
        //   500: '#70706a',
        //   600: '#64645f',
        //   700: '#51514d',
        //   800: '#464644',
        //   900: '#3e3e3b',
        //   950: '#262725',
        // },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.3s ease-out forwards',
      },
      fontFamily: {
        sans: ['BaruSans', 'sans-serif'],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
