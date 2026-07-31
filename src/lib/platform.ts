/**
 * Whether to label the palette shortcut ⌘K rather than Ctrl K.
 * `navigator.platform` is deprecated but remains the most widely supported
 * signal; the fallback covers browsers that have removed it.
 */
export function isAppleDevice(): boolean {
  if (typeof navigator === 'undefined') return false;
  const platform = navigator.platform || '';
  if (platform) return /Mac|iPhone|iPad|iPod/i.test(platform);
  return /Mac|iPhone|iPad|iPod/i.test(navigator.userAgent);
}
