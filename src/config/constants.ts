// Application configuration constants
export const APP_CONFIG = {
  name: process.env.REACT_APP_APP_NAME || 'OBS Task Manager',
  version: process.env.REACT_APP_VERSION || '1.0.0',
  debug: process.env.REACT_APP_DEBUG === 'true',
  logLevel: process.env.REACT_APP_LOG_LEVEL || 'info',
  enableAnalytics: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
  enableDebugTools: process.env.REACT_APP_ENABLE_DEBUG_TOOLS === 'true',
} as const;

// API configuration
export const API_CONFIG = {
  baseURL: process.env.REACT_APP_API_BASE_URL,
  timeout: parseInt(process.env.REACT_APP_API_TIMEOUT || '10000'),
} as const;

// Theme configuration
export const THEME_CONFIG = {
  colors: {
    primary: '#0078D4',
    secondary: '#2F5597',
    success: '#107C10',
    warning: '#FF8C00',
    error: '#D13438',
    info: '#0078D4',
  },
  fonts: {
    primary: 'Segoe UI, Tahoma, Arial, sans-serif',
    mono: 'Consolas, Monaco, Courier New, monospace',
  },
  spacing: {
    xs: '2px',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    '2xl': '24px',
  },
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  authToken: 'authToken',
  userPreferences: 'userPreferences',
  theme: 'theme',
} as const;
