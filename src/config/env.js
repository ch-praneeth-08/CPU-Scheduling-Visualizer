/**
 * Environment Configuration
 * 
 * This module exports all environment variables used in the application.
 * It provides fallback values for all variables to ensure the app works
 * even when environment variables are not set.
 * 
 * All environment variables must be prefixed with VITE_ to be accessible
 * in the browser (Vite limitation).
 * 
 * Usage:
 *   import { env } from '@/config/env';
 *   console.log(env.APP_NAME);
 */

/**
 * Helper function to parse boolean environment variables
 * @param {string|undefined} value - The environment variable value
 * @param {boolean} defaultValue - The default value if not set
 * @returns {boolean}
 */
const parseBoolean = (value, defaultValue = false) => {
  if (value === undefined || value === null || value === '') {
    return defaultValue;
  }
  return value.toLowerCase() === 'true' || value === '1';
};

/**
 * Helper function to parse number environment variables
 * @param {string|undefined} value - The environment variable value
 * @param {number} defaultValue - The default value if not set
 * @returns {number}
 */
const parseNumber = (value, defaultValue = 0) => {
  if (value === undefined || value === null || value === '') {
    return defaultValue;
  }
  const parsed = Number(value);
  return isNaN(parsed) ? defaultValue : parsed;
};

/**
 * Helper function to parse string environment variables
 * @param {string|undefined} value - The environment variable value
 * @param {string} defaultValue - The default value if not set
 * @returns {string}
 */
const parseString = (value, defaultValue = '') => {
  return value !== undefined && value !== null ? value : defaultValue;
};

/**
 * Environment configuration object
 * All values have sensible defaults for development
 */
export const env = {
  // ============================================
  // Application Configuration
  // ============================================
  APP_NAME: parseString(
    import.meta.env.VITE_APP_NAME,
    'CPU Scheduling Visualizer'
  ),
  
  APP_VERSION: parseString(
    import.meta.env.VITE_APP_VERSION,
    '1.0.0'
  ),
  
  APP_ENV: parseString(
    import.meta.env.VITE_APP_ENV,
    import.meta.env.MODE || 'development'
  ),
  
  BASE_URL: parseString(
    import.meta.env.VITE_BASE_URL,
    import.meta.env.BASE_URL || '/'
  ),

  // ============================================
  // API Configuration
  // ============================================
  API_BASE_URL: parseString(
    import.meta.env.VITE_API_BASE_URL,
    ''
  ),
  
  API_TIMEOUT: parseNumber(
    import.meta.env.VITE_API_TIMEOUT,
    30000
  ),
  
  API_LOGGING: parseBoolean(
    import.meta.env.VITE_API_LOGGING,
    import.meta.env.DEV
  ),

  // ============================================
  // Feature Flags
  // ============================================
  FEATURE: {
    EXPERIMENTAL_ALGORITHMS: parseBoolean(
      import.meta.env.VITE_FEATURE_EXPERIMENTAL_ALGORITHMS,
      false
    ),
    
    EXPORT_ENABLED: parseBoolean(
      import.meta.env.VITE_FEATURE_EXPORT_ENABLED,
      true
    ),
    
    METRICS_ENABLED: parseBoolean(
      import.meta.env.VITE_FEATURE_METRICS_ENABLED,
      true
    ),
    
    DARK_MODE: parseBoolean(
      import.meta.env.VITE_FEATURE_DARK_MODE,
      true
    ),
    
    COMPARISON_MODE: parseBoolean(
      import.meta.env.VITE_FEATURE_COMPARISON_MODE,
      false
    ),
    
    ADVANCED_VISUALIZATION: parseBoolean(
      import.meta.env.VITE_FEATURE_ADVANCED_VISUALIZATION,
      false
    ),
    
    REALTIME_SIMULATION: parseBoolean(
      import.meta.env.VITE_FEATURE_REALTIME_SIMULATION,
      true
    ),
  },

  MAX_PROCESSES: parseNumber(
    import.meta.env.VITE_MAX_PROCESSES,
    20
  ),

  // ============================================
  // Analytics & Monitoring
  // ============================================
  ANALYTICS: {
    GOOGLE_ANALYTICS_ID: parseString(
      import.meta.env.VITE_GOOGLE_ANALYTICS_ID,
      ''
    ),
    
    ENABLED: parseBoolean(
      import.meta.env.VITE_ANALYTICS_ENABLED,
      false
    ),
    
    SENTRY_DSN: parseString(
      import.meta.env.VITE_SENTRY_DSN,
      ''
    ),
    
    ERROR_TRACKING_ENABLED: parseBoolean(
      import.meta.env.VITE_ERROR_TRACKING_ENABLED,
      false
    ),
    
    APP_INSIGHTS_KEY: parseString(
      import.meta.env.VITE_APP_INSIGHTS_KEY,
      ''
    ),
  },

  // ============================================
  // Third-Party Services
  // ============================================
  FIREBASE: {
    API_KEY: parseString(
      import.meta.env.VITE_FIREBASE_API_KEY,
      ''
    ),
    
    AUTH_DOMAIN: parseString(
      import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      ''
    ),
    
    PROJECT_ID: parseString(
      import.meta.env.VITE_FIREBASE_PROJECT_ID,
      ''
    ),
    
    STORAGE_BUCKET: parseString(
      import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      ''
    ),
    
    MESSAGING_SENDER_ID: parseString(
      import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      ''
    ),
    
    APP_ID: parseString(
      import.meta.env.VITE_FIREBASE_APP_ID,
      ''
    ),
  },

  // ============================================
  // UI Configuration
  // ============================================
  UI: {
    DEFAULT_THEME: parseString(
      import.meta.env.VITE_DEFAULT_THEME,
      'light'
    ),
    
    ANIMATIONS_ENABLED: parseBoolean(
      import.meta.env.VITE_ANIMATIONS_ENABLED,
      true
    ),
    
    ANIMATION_SPEED: parseString(
      import.meta.env.VITE_ANIMATION_SPEED,
      'normal'
    ),
    
    DEFAULT_ALGORITHM: parseString(
      import.meta.env.VITE_DEFAULT_ALGORITHM,
      'fcfs'
    ),
    
    SHOW_TUTORIAL: parseBoolean(
      import.meta.env.VITE_SHOW_TUTORIAL,
      true
    ),
  },

  // ============================================
  // Performance & Optimization
  // ============================================
  PERFORMANCE: {
    ENABLE_SERVICE_WORKER: parseBoolean(
      import.meta.env.VITE_ENABLE_SERVICE_WORKER,
      false
    ),
    
    MONITORING: parseBoolean(
      import.meta.env.VITE_PERFORMANCE_MONITORING,
      false
    ),
    
    MAX_GANTT_ITEMS: parseNumber(
      import.meta.env.VITE_MAX_GANTT_ITEMS,
      1000
    ),
  },

  // ============================================
  // Development & Debugging
  // ============================================
  DEBUG: parseBoolean(
    import.meta.env.VITE_DEBUG,
    import.meta.env.DEV
  ),
  
  REACT_PROFILING: parseBoolean(
    import.meta.env.VITE_REACT_PROFILING,
    false
  ),
  
  SHOW_PERFORMANCE_METRICS: parseBoolean(
    import.meta.env.VITE_SHOW_PERFORMANCE_METRICS,
    false
  ),
  
  VERBOSE_LOGGING: parseBoolean(
    import.meta.env.VITE_VERBOSE_LOGGING,
    import.meta.env.DEV
  ),

  // ============================================
  // Security
  // ============================================
  SECURITY: {
    CSP_REPORT_URI: parseString(
      import.meta.env.VITE_CSP_REPORT_URI,
      ''
    ),
    
    CORS_ORIGINS: parseString(
      import.meta.env.VITE_CORS_ORIGINS,
      'http://localhost:3000,http://localhost:5173'
    ).split(',').map(origin => origin.trim()),
  },

  // ============================================
  // Localization (i18n)
  // ============================================
  I18N: {
    DEFAULT_LOCALE: parseString(
      import.meta.env.VITE_DEFAULT_LOCALE,
      'en'
    ),
    
    AVAILABLE_LOCALES: parseString(
      import.meta.env.VITE_AVAILABLE_LOCALES,
      'en'
    ).split(',').map(locale => locale.trim()),
    
    ENABLED: parseBoolean(
      import.meta.env.VITE_I18N_ENABLED,
      false
    ),
  },

  // ============================================
  // Social & Sharing
  // ============================================
  LINKS: {
    GITHUB_URL: parseString(
      import.meta.env.VITE_GITHUB_URL,
      'https://github.com/yourusername/cpu-scheduling-visualizer'
    ),
    
    DOCS_URL: parseString(
      import.meta.env.VITE_DOCS_URL,
      ''
    ),
    
    SUPPORT_EMAIL: parseString(
      import.meta.env.VITE_SUPPORT_EMAIL,
      ''
    ),
    
    TWITTER_URL: parseString(
      import.meta.env.VITE_TWITTER_URL,
      ''
    ),
    
    LINKEDIN_URL: parseString(
      import.meta.env.VITE_LINKEDIN_URL,
      ''
    ),
  },

  // ============================================
  // Utility Properties
  // ============================================
  
  /**
   * Check if running in development mode
   */
  get isDevelopment() {
    return this.APP_ENV === 'development' || import.meta.env.DEV;
  },

  /**
   * Check if running in production mode
   */
  get isProduction() {
    return this.APP_ENV === 'production' || import.meta.env.PROD;
  },

  /**
   * Check if running in test mode
   */
  get isTest() {
    return this.APP_ENV === 'test' || import.meta.env.MODE === 'test';
  },

  /**
   * Check if running in staging mode
   */
  get isStaging() {
    return this.APP_ENV === 'staging';
  },
};

/**
 * Validate required environment variables
 * Logs warnings for missing critical variables in production
 */
export const validateEnv = () => {
  const warnings = [];

  // Check critical production variables
  if (env.isProduction) {
    if (!env.APP_VERSION) {
      warnings.push('VITE_APP_VERSION is not set');
    }

    // Add more production validations as needed
    if (env.ANALYTICS.ENABLED && !env.ANALYTICS.GOOGLE_ANALYTICS_ID && !env.ANALYTICS.SENTRY_DSN) {
      warnings.push('Analytics is enabled but no analytics service is configured');
    }
  }

  // Log warnings
  if (warnings.length > 0) {
    console.warn('⚠️ Environment Configuration Warnings:');
    warnings.forEach(warning => console.warn(`  - ${warning}`));
  }

  return warnings.length === 0;
};

/**
 * Log current environment configuration (only in development)
 */
export const logEnvConfig = () => {
  if (env.isDevelopment && env.DEBUG) {
    console.group('🔧 Environment Configuration');
    console.log('App Name:', env.APP_NAME);
    console.log('Version:', env.APP_VERSION);
    console.log('Environment:', env.APP_ENV);
    console.log('Mode:', import.meta.env.MODE);
    console.log('Debug:', env.DEBUG);
    console.log('Features:', env.FEATURE);
    console.groupEnd();
  }
};

// Auto-validate on import in production
if (env.isProduction) {
  validateEnv();
}

// Export default for convenience
export default env;
