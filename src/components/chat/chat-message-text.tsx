import Link from "next/link";
import { Fragment, type ReactNode } from "react";

const LINK_RE = /\[([^\]]+)\]\((\/[^\s)]+|https?:\/\/[^\s)]+)\)/g;

/**
 * FaveAI is told it can point to a page with `[label](/path)` — chat
 * messages are plain-text otherwise (see faveai-system-prompt.ts), so this
 * only needs to turn that one pattern into a real link, not full markdown.
 */
export function ChatMessageText({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;

  for (const match of text.matchAll(LINK_RE)) {
    const index = match.index ?? 0;
    if (index > lastIndex) {
      parts.push(<Fragment key={key++}>{text.slice(lastIndex, index)}</Fragment>);
    }
    const [full, label, href] = match;
    parts.push(
      href.startsWith("/") ? (
        <Link
          key={key++}
          href={href}
          className="underline decoration-primary-300 underline-offset-2 hover:text-primary-500"
        >
          {label}
        </Link>
      ) : (
        <a
          key={key++}
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
  if (lastIndex < text.length) parts.push(<Fragment key={key++}>{text.slice(lastIndex)}</Fragment>);

  return <>{parts}</>;
}
