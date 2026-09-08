"use client";

export type NarratedItem = { el: HTMLElement; text: string };

const TEXT_SELECTOR = "h1, h2, h3, h4, h5, h6, p, li, blockquote";
const MEDIA_SELECTOR = "img, video, iframe";

function isHidden(el: Element): boolean {
  if (el.closest('[aria-hidden="true"]')) return true;
  const style = window.getComputedStyle(el);
  if (style.display === "none" || style.visibility === "hidden") return true;
  const rect = el.getBoundingClientRect();
  return rect.width === 0 && rect.height === 0;
}

/**
 * Prefers a `.sr-only` descendant's plain text when one exists — some
 * elements (like the animated hero title) render their real text there and
 * mark the decorative visual version `aria-hidden`, exactly so assistive
 * tech reads the clean version instead of fragments of whatever the
 * animation is mid-transition through. Falls back to `.innerText` (which
 * respects line breaks the way prose should sound), stripped of any
 * `aria-hidden` subtree first since `.innerText` doesn't exclude those on
 * its own the way real assistive tech would.
 */
function extractText(el: HTMLElement): string {
  const srOnly = el.querySelector<HTMLElement>(".sr-only");
  const srText = srOnly?.textContent?.trim();
  if (srText) return srText;

  if (el.querySelector('[aria-hidden="true"]')) {
    const clone = el.cloneNode(true) as HTMLElement;
    clone.querySelectorAll('[aria-hidden="true"]').forEach((n) => n.remove());
    const text = clone.textContent?.trim().replace(/\s+/g, " ");
    if (text) return text;
  }

  return el.innerText?.trim() ?? "";
}

function resolveMediaCaption(el: Element): string | null {
  const figure = el.closest("figure");
  const figcaption = figure?.querySelector("figcaption")?.textContent?.trim();
  if (figcaption) return figcaption;

  const nextSibling = el.nextElementSibling;
  if (nextSibling?.tagName === "P") {
    const text = nextSibling.textContent?.trim();
    if (text) return text;
  }

  if (el instanceof HTMLImageElement && el.alt.trim()) return el.alt.trim();

  const title = el.getAttribute("title") ?? el.getAttribute("aria-label");
  // "Project video" is VideoBlock's own generic iframe title fallback, not
  // a real caption — not worth reading aloud as if it were one.
  if (title?.trim() && title !== "Project video") return title.trim();

  return null;
}

function describeMedia(el: Element): string {
  const kind = el.tagName === "IMG" ? "image" : "video";
  const caption = resolveMediaCaption(el);
  return caption ? `Showing ${kind} of ${caption}.` : `Showing an ${kind}.`;
}

/**
 * Walks the given root (the page's <main> content) in document order and
 * returns a flat, speakable script for it — headings/paragraphs/list items
 * read as their own text, images/videos described from their caption.
 * Powers the narrated site tour (auto-scroll + read-aloud both on), which
 * speaks through a page the way it visually plays out instead of just
 * reading whatever the mouse happens to be hovering.
 */
export function collectNarratedItems(root: HTMLElement): NarratedItem[] {
  const rawTextEls = Array.from(root.querySelectorAll<HTMLElement>(TEXT_SELECTOR));
  const textElSet = new Set<HTMLElement>(rawTextEls);

  const textItems: NarratedItem[] = [];
  for (const el of rawTextEls) {
    if (isHidden(el) || el.closest("figure")) continue;
    // Skip an element if an ancestor (up to root) is also a selected text
    // element — that ancestor's own extracted text already includes this
    // one's, so reading both would repeat the same words twice.
    let ancestor = el.parentElement;
    let coveredByAncestor = false;
    while (ancestor && ancestor !== root) {
      if (textElSet.has(ancestor)) {
        coveredByAncestor = true;
        break;
      }
      ancestor = ancestor.parentElement;
    }
    if (coveredByAncestor) continue;

    const text = extractText(el);
    if (text) textItems.push({ el, text });
  }

  const mediaItems: NarratedItem[] = Array.from(root.querySelectorAll<HTMLElement>(MEDIA_SELECTOR))
    .filter((el) => !isHidden(el))
    .map((el) => ({ el, text: describeMedia(el) }));

  const items = [...textItems, ...mediaItems];
  items.sort((a, b) => {
    const position = a.el.compareDocumentPosition(b.el);
    if (position & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
    if (position & Node.DOCUMENT_POSITION_PRECEDING) return 1;
    return 0;
  });

  return items;
}
