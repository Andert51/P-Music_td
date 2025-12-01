// Gruvbox Dark Theme - Warm & Dark Color Palette
export const theme = {
  colors: {
    // Background colors - warm dark tones
    bg: {
      primary: '#1d2021',      // Main background
      secondary: '#282828',    // Secondary background
      tertiary: '#3c3836',     // Card backgrounds
      hover: '#504945',        // Hover states
    },
    // Accent colors - Gruvbox palette
    accent: {
      aqua: '#8ec07c',         // Main aqua/green accent
      aquaDark: '#689d6a',     // Darker aqua
      purple: '#d3869b',       // Purple/pink accent
      purpleDark: '#b16286',   // Darker purple
      blue: '#83a598',         // Blue accent
      yellow: '#fabd2f',       // Yellow/gold
      orange: '#fe8019',       // Orange accent
      red: '#fb4934',          // Red accent
    },
    // Text colors
    text: {
      primary: '#ebdbb2',      // Main text
      secondary: '#d5c4a1',    // Secondary text
      tertiary: '#a89984',     // Muted text
      muted: '#928374',        // Very muted
    },
    // Status colors
    success: '#b8bb26',
    error: '#fb4934',
    warning: '#fabd2f',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #8ec07c 0%, #d3869b 100%)',
    secondary: 'linear-gradient(135deg, #1d2021 0%, #3c3836 100%)',
    card: 'linear-gradient(135deg, rgba(142, 192, 124, 0.1) 0%, rgba(211, 134, 155, 0.1) 100%)',
    glow: 'radial-gradient(circle, rgba(142, 192, 124, 0.2) 0%, transparent 70%)',
  },
  shadows: {
    small: '0 2px 8px rgba(0, 0, 0, 0.5)',
    medium: '0 4px 16px rgba(0, 0, 0, 0.6)',
    large: '0 8px 32px rgba(0, 0, 0, 0.7)',
    glow: '0 0 20px rgba(142, 192, 124, 0.3)',
    glowPurple: '0 0 20px rgba(211, 134, 155, 0.3)',
  },
  blur: {
    sm: 'blur(4px)',
    md: 'blur(8px)',
    lg: 'blur(16px)',
  }
};
