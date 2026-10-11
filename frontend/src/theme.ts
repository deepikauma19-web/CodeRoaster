import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

/** Fire palette: amber → orange → red. */
const brand = {
  50: '#fff4e6',
  100: '#ffe0bf',
  200: '#ffc285',
  300: '#ffa04d',
  400: '#ff8126',
  500: '#f9620f',
  600: '#e2470b',
  700: '#bb320d',
  800: '#912812',
  900: '#701f12',
};

const theme = extendTheme({
  config,
  colors: {
    brand,
    ember: {
      bg: '#0d0b0a',
      surface: '#17130f',
      border: 'rgba(255, 140, 60, 0.18)',
    },
  },
  fonts: {
    heading: `'Space Grotesk', 'Inter', system-ui, sans-serif`,
    body: `'Inter', system-ui, sans-serif`,
    mono: `'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace`,
  },
  semanticTokens: {
    colors: {
      'bg.canvas': { default: 'gray.50', _dark: 'ember.bg' },
      'bg.surface': { default: 'white', _dark: 'ember.surface' },
      'border.subtle': { default: 'blackAlpha.200', _dark: 'ember.border' },
      'text.muted': { default: 'gray.600', _dark: 'whiteAlpha.700' },
      'accent.fire': { default: 'brand.600', _dark: 'brand.400' },
    },
  },
  styles: {
    global: {
      'html, body': {
        bg: 'bg.canvas',
        color: 'chakra-body-text',
        minHeight: '100%',
      },
      body: {
        WebkitFontSmoothing: 'antialiased',
      },
      '::selection': {
        bg: 'brand.500',
        color: 'white',
      },
    },
  },
  components: {
    Button: {
      defaultProps: { colorScheme: 'brand' },
      baseStyle: { borderRadius: 'full', fontWeight: 600 },
    },
    Heading: {
      baseStyle: { letterSpacing: '-0.02em' },
    },
  },
});

export const fireGradient = 'linear(to-r, brand.400, red.500)';

export default theme;
