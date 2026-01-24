/**
 * Environment Configuration Usage Examples
 * 
 * This file demonstrates various ways to use the environment
 * configuration system in your components.
 */

import { env, validateEnv, logEnvConfig } from './env';

// ============================================
// Example 1: Basic Usage
// ============================================

export function basicUsageExample() {
  // Access application info
  console.log('App Name:', env.APP_NAME);
  console.log('Version:', env.APP_VERSION);
  console.log('Environment:', env.APP_ENV);
  
  // Check environment
  if (env.isDevelopment) {
    console.log('Running in development mode');
  }
}

// ============================================
// Example 2: Feature Flags
// ============================================

export function FeatureFlagExample() {
  return (
    <div>
      <h1>{env.APP_NAME}</h1>
      
      {/* Conditional rendering based on feature flags */}
      {env.FEATURE.METRICS_ENABLED && (
        <MetricsPanel />
      )}
      
      {env.FEATURE.EXPORT_ENABLED && (
        <ExportButton />
      )}
      
      {env.FEATURE.DARK_MODE && (
        <ThemeToggle />
      )}
    </div>
  );
}

// ============================================
// Example 3: Configuration Object
// ============================================

export function getAppConfig() {
  return {
    maxProcesses: env.MAX_PROCESSES,
    defaultAlgorithm: env.UI.DEFAULT_ALGORITHM,
    theme: env.UI.DEFAULT_THEME,
    animations: {
      enabled: env.UI.ANIMATIONS_ENABLED,
      speed: env.UI.ANIMATION_SPEED === 'fast' ? 200 : 500,
    },
    analytics: {
      enabled: env.ANALYTICS.ENABLED,
      trackingId: env.ANALYTICS.GOOGLE_ANALYTICS_ID,
    },
  };
}

// ============================================
// Example 4: API Integration
// ============================================

export async function fetchData(endpoint) {
  const url = `${env.API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(env.API_TIMEOUT),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    
    if (env.API_LOGGING) {
      console.log('API Response:', data);
    }
    
    return data;
  } catch (error) {
    if (env.DEBUG) {
      console.error('API Error:', error);
    }
    throw error;
  }
}

// ============================================
// Example 5: Analytics Integration
// ============================================

export function initializeAnalytics() {
  // Google Analytics
  if (env.ANALYTICS.ENABLED && env.ANALYTICS.GOOGLE_ANALYTICS_ID) {
    window.gtag('config', env.ANALYTICS.GOOGLE_ANALYTICS_ID);
    console.log('Google Analytics initialized');
  }
  
  // Sentry Error Tracking
  if (env.ANALYTICS.ERROR_TRACKING_ENABLED && env.ANALYTICS.SENTRY_DSN) {
    // Sentry.init({
    //   dsn: env.ANALYTICS.SENTRY_DSN,
    //   environment: env.APP_ENV,
    //   release: env.APP_VERSION,
    // });
    console.log('Sentry initialized');
  }
}

// ============================================
// Example 6: Validation Example
// ============================================

export function validateConfiguration() {
  const isValid = validateEnv();
  
  if (!isValid) {
    console.warn('Environment configuration has warnings');
  }
  
  // Log config in development
  logEnvConfig();
  
  return isValid;
}

// ============================================
// Example 7: React Component with Environment
// ============================================

export function AppWithEnv() {
  const [processes, setProcesses] = React.useState([]);
  
  React.useEffect(() => {
    // Initialize analytics
    if (env.isProduction) {
      initializeAnalytics();
    }
    
    // Log debug info
    if (env.DEBUG) {
      console.log('App initialized with config:', {
        version: env.APP_VERSION,
        features: env.FEATURE,
        maxProcesses: env.MAX_PROCESSES,
      });
    }
  }, []);
  
  const handleAddProcess = (process) => {
    if (processes.length >= env.MAX_PROCESSES) {
      alert(`Maximum ${env.MAX_PROCESSES} processes allowed`);
      return;
    }
    setProcesses([...processes, process]);
  };
  
  return (
    <div>
      <header>
        <h1>{env.APP_NAME}</h1>
        <p>Version {env.APP_VERSION}</p>
      </header>
      
      <main>
        <ProcessInput onAdd={handleAddProcess} />
        
        {env.FEATURE.METRICS_ENABLED && (
          <MetricsPanel processes={processes} />
        )}
        
        {env.FEATURE.EXPORT_ENABLED && (
          <ExportButton data={processes} />
        )}
      </main>
      
      <footer>
        {env.LINKS.GITHUB_URL && (
          <a href={env.LINKS.GITHUB_URL}>View on GitHub</a>
        )}
        
        {env.LINKS.SUPPORT_EMAIL && (
          <a href={`mailto:${env.LINKS.SUPPORT_EMAIL}`}>Contact Support</a>
        )}
      </footer>
    </div>
  );
}

// ============================================
// Example 8: Custom Hook
// ============================================

export function useAppConfig() {
  return {
    appName: env.APP_NAME,
    version: env.APP_VERSION,
    isDev: env.isDevelopment,
    isProd: env.isProduction,
    features: env.FEATURE,
    maxProcesses: env.MAX_PROCESSES,
    defaultAlgorithm: env.UI.DEFAULT_ALGORITHM,
  };
}

// Usage in component:
// const config = useAppConfig();
// console.log(config.appName);

// ============================================
// Example 9: Performance Monitoring
// ============================================

export function measurePerformance(name, fn) {
  if (!env.PERFORMANCE.MONITORING) {
    return fn();
  }
  
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  
  if (env.SHOW_PERFORMANCE_METRICS) {
    console.log(`${name} took ${end - start}ms`);
  }
  
  return result;
}

// ============================================
// Example 10: Conditional Logging
// ============================================

export const logger = {
  debug: (...args) => {
    if (env.DEBUG) {
      console.debug('[DEBUG]', ...args);
    }
  },
  
  verbose: (...args) => {
    if (env.VERBOSE_LOGGING) {
      console.log('[VERBOSE]', ...args);
    }
  },
  
  error: (...args) => {
    console.error('[ERROR]', ...args);
    
    // Track errors if enabled
    if (env.ANALYTICS.ERROR_TRACKING_ENABLED) {
      // Send to error tracking service
    }
  },
};

// Usage:
// logger.debug('Processing data:', data);
// logger.verbose('Detailed info:', details);
// logger.error('Something went wrong:', error);

// ============================================
// Example Components (Placeholders)
// ============================================

function MetricsPanel() {
  return <div>Metrics Panel</div>;
}

function ExportButton() {
  return <button>Export</button>;
}

function ThemeToggle() {
  return <button>Toggle Theme</button>;
}

function ProcessInput({ onAdd }) {
  return <div>Process Input</div>;
}
