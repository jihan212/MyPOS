import { MD3LightTheme } from 'react-native-paper';

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#5B68FF',    // Modern indigo
    secondary: '#2E3147',  // Dark slate
    success: '#00C48C',   // Fresh mint
    warning: '#FFB946',   // Warm orange
    error: '#FF5E5E',     // Soft red
    background: '#F7F9FC', // Light gray-blue
    surface: '#FFFFFF',    // White
    text: '#2E3147',      // Dark slate
    textLight: '#8F95B2', // Muted purple-gray
    border: '#E4E9F2',     // Light gray
    // Required React Native Paper theme colors
    onSurface: '#2E3147',
    backdrop: 'rgba(0, 0, 0, 0.5)',
    elevation: {
      level0: 'transparent',
      level1: 'rgb(247, 249, 252)',
      level2: 'rgb(243, 246, 249)',
      level3: 'rgb(237, 241, 247)',
      level4: 'rgb(232, 236, 244)',
      level5: 'rgb(227, 232, 241)',
    }
  },
  roundness: 8,
  animation: {
    scale: 1.0,
  },
  mode: 'exact'
};