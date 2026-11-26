/**
 * Enabled locales — the single source of truth for routing, the language
 * switcher, hreflang, the sitemap and Astro's `i18n` config.
 *
 * Plain JS (not TS) so astro.config.mjs can import it too.
 */

/** @type {'es'} */
export const defaultLocale = 'es';

/** @type {readonly ['es', 'en']} */
export const locales = /** @type {const} */ (['es', 'en']);
