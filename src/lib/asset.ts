/**
 * Resolve a root-relative path in `public/` against the deploy base.
 *
 * Vite rewrites such paths inside `index.html`, but never inside JavaScript
 * string literals. The site is served from the domain root today, but this
 * still guards against a future deploy under a subpath — anything referenced
 * from code must go through here or it would 404 in that case while looking
 * fine locally.
 */
export function asset(path: string): string {
  // BASE_URL always carries a trailing slash, so drop the leading one.
  return import.meta.env.BASE_URL + path.replace(/^\//, '');
}
