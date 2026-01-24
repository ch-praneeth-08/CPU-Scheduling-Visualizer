# Build Fix Documentation

## What Was the Error?

The build process was failing due to a missing dependency. Vite's build process was unable to find the `terser` package, which is used for JavaScript minification during production builds.

The error typically manifested as:
```
Error: Cannot find module 'terser'
```
or similar module resolution errors during the `npm run build` command.

## Why Did It Happen?

Vite 6.x has changed how it handles minification dependencies. In newer versions of Vite:

1. **Terser is no longer bundled by default** - Previous versions of Vite included Terser as a built-in dependency, but Vite 6+ requires it to be explicitly installed if you want to use Terser for minification.

2. **Explicit dependency management** - This change was made to reduce bundle size and give developers more control over their build tools. Projects that use Terser for minification now need to install it explicitly.

3. **Default minifier options** - While Vite uses esbuild by default for minification (which is faster), some configurations or plugins may still reference or require Terser.

## The Fix Applied

Added `terser` version `^5.36.0` to the `devDependencies` in `package.json`:

```json
"devDependencies": {
  ...
  "terser": "^5.36.0",
  ...
}
```

This ensures that Terser is available when Vite needs it during the build process.

## Commands to Run

1. **Install the new dependency:**
   ```bash
   npm install
   ```

2. **Try building the project:**
   ```bash
   npm run build
   ```

The build should now complete successfully without the Terser-related errors.

## Alternative Solution: Use esbuild Instead

If you encounter issues with Terser or prefer faster build times, you can configure Vite to explicitly use esbuild for minification instead. This is often faster and doesn't require the Terser dependency.

**Modify `vite.config.js`:**

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    minify: 'esbuild', // Use esbuild instead of terser
    target: 'es2015'   // Optional: specify target for compatibility
  }
})
```

**Benefits of esbuild:**
- Significantly faster build times
- No additional dependencies required
- Built into Vite by default
- Good compression ratio (though slightly less than Terser)

**When to use Terser:**
- You need maximum compression (smaller bundle sizes)
- You require specific Terser configuration options
- You have specific legacy browser requirements

## Verification

After running `npm install` and `npm run build`, you should see:
- ✓ Dependencies installed successfully
- ✓ Build completes without errors
- ✓ Output files generated in the `dist` folder

If issues persist, check:
1. Node.js version compatibility (Node 18+ recommended for Vite 6)
2. Clear `node_modules` and reinstall: `rm -rf node_modules package-lock.json && npm install`
3. Check for conflicting dependencies or peer dependency warnings
