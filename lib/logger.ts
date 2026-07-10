/**
 * Lightweight logger — only emits in non-production.
 * Replaces ad-hoc console.log calls in app/components.
 * Console.error/warn remain untouched (always-on diagnostics).
 */
export const debug = (...args: unknown[]): void => {
  if (process.env.NODE_ENV !== 'production') {
    console.debug('[debug]', ...args);
  }
};
