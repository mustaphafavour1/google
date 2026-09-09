import Link from "next/link";
import { Fragment, type ReactNode } from "react";

const LINK_RE = /\[([^\]]+)\]\((\/[^\s)]+|https?:\/\/[^\s)]+)\)/g;
const SENTENCE_RE = /[^.!?]+(?:[.!?]+(?:\s+|$)|$)/g;
const SENTENCES_PER_PARAGRAPH = 3;

/** Groups sentences into paragraphs of up to 3 so a long reply doesn't read as one dense block. */
function splitIntoParagraphs(text: string): string[] {
  const sentences = (text.match(SENTENCE_RE) ?? [text]).map((s) => s.trim()).filter(Boolean);
  if (sentences.length <= SENTENCES_PER_PARAGRAPH) return [text.trim()];

  const paragraphs: string[] = [];
  for (let i = 0; i < sentences.length; i += SENTENCES_PER_PARAGRAPH) {
    paragraphs.push(sentences.slice(i, i + SENTENCES_PER_PARAGRAPH).join(" "));
  }
  return paragraphs;
}

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;

  for (const match of text.matchAll(LINK_RE)) {
    const index = match.index ?? 0;
    if (index > lastIndex) {
      parts.push(<Fragment key={`${keyPrefix}-${key++}`}>{text.slice(lastIndex, index)}</Fragment>);
    }
    const [full, label, href] = match;
    parts.push(
      href.startsWith("/") ? (
        <Link
          key={`${keyPrefix}-${key++}`}
          href={href}
          className="underline decoration-primary-300 underline-offset-2 hover:text-primary-500"
        >
          {label}
        </Link>
      ) : (
        <a
          key={`${keyPrefix}-${key++}`}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-primary-300 underline-offset-2 hover:text-primary-500"
        >
          {label}
        </a>
      ),
    );
    lastIndex = index + full.length;
  }
  if (lastIndex < text.length) parts.push(<Fragment key={`${keyPrefix}-${key++}`}>{text.slice(lastIndex)}</Fragment>);

  return parts;
}

/**
 * FaveAI is told it can point to a page with `[label](/path)` — chat
 * messages are plain-text otherwise (see faveai-system-prompt.ts), so this
 * only needs to turn that one pattern into a real link, not full markdown.
 * Replies longer than 3 sentences are split into short paragraphs, each its
 * own <p> — the caller must render this inside a block element (a <div>,
 * not a <p>), since a multi-paragraph reply renders more than one <p> here.
 */
export function ChatMessageText({ text }: { text: string }) {
  const paragraphs = splitIntoParagraphs(text);
  if (paragraphs.length === 1) return <>{renderInline(paragraphs[0], "p0")}</>;

  return (
    <>
      {paragraphs.map((paragraph, i) => (
        <p key={i} className={i > 0 ? "mt-3" : undefined}>
          {renderInline(paragraph, `p${i}`)}
        </p>
      ))}
    </>
  );
}
