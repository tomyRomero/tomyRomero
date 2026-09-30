// The clipboard API only exists on https and localhost, and some in-app
// browsers refuse it, so fall back to execCommand from a hidden textarea.
// The fallback has to run inside the click, before any await.
export function copyText(text: string): Promise<boolean> {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text).then(() => true, () => legacyCopy(text));
  }
  return Promise.resolve(legacyCopy(text));
}

function legacyCopy(text: string) {
  const active = document.activeElement as HTMLElement | null;
  const ta = document.createElement('textarea');
  ta.value = text;
  // readonly keeps the iPhone keyboard down; 16px stops it zooming
  ta.setAttribute('readonly', '');
  ta.style.cssText = 'position:fixed;top:0;left:-9999px;font-size:16px';
  document.body.appendChild(ta);
  ta.select();
  ta.setSelectionRange(0, text.length);
  let ok = false;
  try { ok = document.execCommand('copy'); } catch {}
  ta.remove();
  getSelection()?.removeAllRanges();
  active?.focus({ preventScroll: true });
  return ok;
}
