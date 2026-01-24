# Environment Configuration

This directory contains the environment configuration system for the CPU Scheduling Visualizer application.

## Files

### `env.js`

Central environment configuration module that:
- Imports all environment variables from Vite
- Provides type-safe parsing (boolean, number, string)
- Offers sensible default values
- Organizes variables into logical groups
- Provides utility methods for environment detection

## Usage

### Basic Usage

```javascript
import { env } from './config/env';

// Application info
console.log(env.APP_NAME);        // "CPU Scheduling Visualizer"
console.log(env.APP_VERSION);     // "1.0.0"

// Feature flags
if (env.FEATURE.DARK_MODE) {
  enableDarkMode();
}

// API configuration
fetch(`${env.API_BASE_URL}/data`, {
  timeout: env.API_TIMEOUT
});

// Environment checks
if (env.isDevelopment) {
  console.log('Running in development mode');
}
```

### Feature Flags

```javascript
import { env } from './config/env';

// Check if feature is enabled
if (env.FEATURE.EXPORT_ENABLED) {
  showExportButton();
}

if (env.FEATURE.METRICS_ENABLED) {
  calculateMetrics();
}

// Use max processes limit
if (processes.length > env.MAX_PROCESSES) {
  showError(`Maximum ${env.MAX_PROCESSES} processes allowed`);
}
```

### Analytics Integration

```javascript
import { env } from './config/env';

if (env.ANALYTICS.ENABLED && env.ANALYTICS.GOOGLE_ANALYTICS_ID) {
  initGoogleAnalytics(env.ANALYTICS.GOOGLE_ANALYTICS_ID);
}

if (env.ANALYTICS.ERROR_TRACKING_ENABLED && env.ANALYTICS.SENTRY_DSN) {
  initSentry(env.ANALYTICS.SENTRY_DSN);
}
```

### UI Configuration

```javascript
import { env } from './config/env';

// Set default theme
const theme = env.UI.DEFAULT_THEME;

// Configure animations
const animationSpeed = env.UI.ANIMATION_SPEED === 'fast' ? 200 : 500;

// Set default algorithm
const defaultAlgorithm = env.UI.DEFAULT_ALGORITHM;
```

### Validation

```javascript
import { env, validateEnv, logEnvConfig } from './config/env';

// Validate environment (automatically runs in production)
const isValid = validateEnv();

// Log configuration (only in development with DEBUG=true)
logEnvConfig();
```

## Environment Variables

All environment variables must be prefixed with `VITE_` to be accessible in the browser.

### Setup

1. Copy the example file:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` with your values:
   ```env
   VITE_APP_NAME=My CPU Scheduler
   VITE_FEATURE_DARK_MODE=true
   VITE_ANALYTICS_ENABLED=true
   VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
   ```

3. Restart the development server to apply changes.

### Environment Files Priority

Vite loads environment variables in this order (later files override earlier):

1. `.env` - Default for all environments
2. `.env.local` - Local overrides (gitignored)
3. `.env.[mode]` - Mode-specific (e.g., `.env.production`)
4. `.env.[mode].local` - Mode-specific local overrides (gitignored)

### Available Variables

See `.env.example` in the project root for a complete list of available environment variables with descriptions.

## Best Practices

1. **Never commit secrets**: Use `.env.local` for sensitive data
2. **Use type helpers**: Always use `parseBoolean`, `parseNumber`, etc.
3. **Provide defaults**: Every variable should have a sensible default
4. **Group related variables**: Keep related configuration together
5. **Document variables**: Add comments in `.env.example`
6. **Validate critical variables**: Use `validateEnv()` for production checks
7. **Use feature flags**: Control features via environment variables

## Type Safety

The `env.js` module provides helper functions for type-safe parsing:

- `parseBoolean(value, default)` - Converts to boolean
- `parseNumber(value, default)` - Converts to number
- `parseString(value, default)` - Returns string value

These functions ensure that environment variables are correctly typed and always have fallback values.

## Adding New Variables

1. Add to `.env.example` with documentation:
   ```env
   # Enable new feature
   VITE_FEATURE_MY_FEATURE=false
   ```

2. Add to `env.js` with parsing and default:
   ```javascript
   FEATURE: {
     MY_FEATURE: parseBoolean(
       import.meta.env.VITE_FEATURE_MY_FEATURE,
       false
     ),
   }
   ```

3. Use in your component:
   ```javascript
   import { env } from './config/env';
   
   if (env.FEATURE.MY_FEATURE) {
     // Feature code
   }
   ```

## Security Notes

- **Never expose secrets**: API keys, tokens, passwords should NEVER be in client-side code
- **Use backend for secrets**: Keep sensitive operations on the server
- **Limit exposure**: Only expose what's necessary for the client
- **Review before commit**: Check that no `.env.local` files are committed
- **Use CSP**: Configure Content Security Policy for production

## Troubleshooting

### Variables not updating

**Solution**: Restart the development server. Vite only loads env variables on startup.

### Variable is undefined

**Possible causes**:
1. Missing `VITE_` prefix
2. Not set in any `.env` file
3. Typo in variable name
4. Server not restarted

**Solution**: Check the variable name, ensure it has the `VITE_` prefix, and restart the dev server.

### Boolean not working

**Problem**: `env.FEATURE.DARK_MODE` is always true even when set to "false"

**Solution**: Use lowercase "true" or "false" in `.env` files, not "True" or "FALSE".

## Examples

### Complete Example Component

```javascript
import React from 'react';
import { env } from './config/env';

function App() {
  // Use environment configuration
  const showMetrics = env.FEATURE.METRICS_ENABLED;
  const maxProcesses = env.MAX_PROCESSES;
  const debugMode = env.DEBUG;

  React.useEffect(() => {
    // Initialize analytics in production
    if (env.isProduction && env.ANALYTICS.ENABLED) {
      initAnalytics(env.ANALYTICS.GOOGLE_ANALYTICS_ID);
    }

    // Log debug info in development
    if (env.isDevelopment && debugMode) {
      console.log('App initialized with config:', {
        version: env.APP_VERSION,
        features: env.FEATURE,
      });
    }
  }, []);

  return (
    <div>
      <h1>{env.APP_NAME}</h1>
      <p>Version: {env.APP_VERSION}</p>
      
      {showMetrics && <MetricsPanel />}
      
      <p>Maximum processes: {maxProcesses}</p>
      
      {env.LINKS.GITHUB_URL && (
        <a href={env.LINKS.GITHUB_URL}>GitHub</a>
      )}
    </div>
  );
}
```

## References

- [Vite Environment Variables Documentation](https://vitejs.dev/guide/env-and-mode.html)
- [Environment Variables Best Practices](https://12factor.net/config)
