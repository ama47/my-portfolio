/**
 * Resolve a root-relative path in `public/` against the deploy base.
 *
 * Vite rewrites such paths inside `index.html`, but never inside JavaScript
 * string literals. On GitHub Pages the site is served from `/my-portfolio/`, so
 * anything referenced from code must go through here or it 404s in production
 * while looking fine in a `base: '/'` build.
 */
export function asset(path: string): string {
  // BASE_URL always carries a trailing slash, so drop the leading one.
  return import.meta.env.BASE_URL + path.replace(/^\//, '');
}
