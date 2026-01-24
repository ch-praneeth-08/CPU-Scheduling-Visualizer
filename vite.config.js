import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Build optimizations for production
  build: {
    // Output directory
    outDir: 'dist',
    
    // Generate source maps for production debugging (hidden source maps)
    sourcemap: 'hidden',
    
    // Minification settings
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
      },
      format: {
        comments: false, // Remove comments
      },
    },
    
    // Chunk size warnings (in KB)
    chunkSizeWarningLimit: 500,
    
    // Rollup-specific options
    rollupOptions: {
      output: {
        // Manual chunk splitting strategy
        manualChunks: {
          // Vendor chunk for React and related libraries
          'react-vendor': ['react', 'react-dom'],
          
          // Separate chunk for React Router if used
          // 'router': ['react-router-dom'],
          
          // UI libraries chunk (add your UI libraries here)
          // 'ui-vendor': ['@mui/material', 'styled-components'],
        },
        
        // Naming strategy for chunks
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          
          // Organize assets by type
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
            return `assets/fonts/[name]-[hash][extname]`;
          }
          if (/\.css$/i.test(assetInfo.name)) {
            return `assets/css/[name]-[hash][extname]`;
          }
          
          return `assets/[name]-[hash][extname]`;
        },
      },
      
      // Suppress circular dependency warnings if needed
      onwarn(warning, warn) {
        // Skip certain warnings
        if (warning.code === 'CIRCULAR_DEPENDENCY') return;
        if (warning.code === 'UNUSED_EXTERNAL_IMPORT') return;
        warn(warning);
      },
    },
    
    // Asset optimization
    assetsInlineLimit: 4096, // Inline assets smaller than 4kb
    
    // CSS code splitting
    cssCodeSplit: true,
    
    // CSS minification
    cssMinify: true,
    
    // Target browsers
    target: 'esnext',
    
    // Report compressed size
    reportCompressedSize: true,
    
    // Enable/disable brotli compressed size reporting
    brotliSize: false, // Disable for faster builds
  },
  
  // Optimization settings
  optimizeDeps: {
    include: ['react', 'react-dom'],
    exclude: [],
  },
  
  // Server configuration for development
  server: {
    port: 3000,
    strictPort: false,
    host: true,
    open: true,
  },
  
  // Preview server configuration
  preview: {
    port: 4173,
    strictPort: false,
    host: true,
    open: true,
  },
  
  // Enable production mode features
  esbuild: {
    // Drop console and debugger in production
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
    legalComments: 'none',
  },
})
