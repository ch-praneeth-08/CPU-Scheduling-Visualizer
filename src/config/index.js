/**
 * Configuration Module
 * 
 * Central export point for all configuration-related modules.
 * Import from here to access environment configuration.
 * 
 * @example
 * import { env } from '@/config';
 * import { validateEnv } from '@/config';
 */

export { env, validateEnv, logEnvConfig } from './env.js';
export { default } from './env.js';
