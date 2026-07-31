/**
 * Subsequence matcher — enough for a palette of ~15 commands, and it keeps the
 * dependency list at react + react-dom.
 *
 * "sk" matches "Go to skills"; a contiguous run and a match at a word boundary
 * both score higher, so the obvious command tends to sort first.
 */
export function fuzzyScore(haystack: string, needle: string): number | null {
  if (!needle) return 0;

  const text = haystack.toLowerCase();
  const query = needle.toLowerCase();

  let score = 0;
  let textIndex = 0;
  let previousMatch = -2;

  for (const char of query) {
    // Spaces in the query are separators, not characters to find.
    if (char === ' ') continue;

    const found = text.indexOf(char, textIndex);
    if (found === -1) return null;

    if (found === previousMatch + 1) score += 6; // contiguous run
    if (found === 0 || text[found - 1] === ' ' || text[found - 1] === '-') score += 4; // word start

    score -= Math.min(found - textIndex, 6); // penalise long gaps
    previousMatch = found;
    textIndex = found + 1;
  }

  return score;
}
