import Link from "next/link";
import { Newspaper } from "lucide-react";
import type { BlogPost } from "@/lib/types";

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-hairline bg-surface transition-shadow hover:shadow-[0_12px_32px_rgb(15_15_15_/_0.08)]"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-surface-muted">
        {post.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element -- CMS-hosted image, arbitrary remote host
          <img
            src={post.coverImage}
            alt=""
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-ink-faint">
            <Newspaper size={22} />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="type-label">
          {new Date(post.publishedAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </p>
        <h3 className="mt-1 text-[18px] font-bold text-ink-em">{post.title}</h3>
        <p className="type-body mt-1 flex-1 text-[13px] text-ink-muted">{post.excerpt}</p>
        {post.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="data-mono rounded-full border border-hairline px-1.5 py-0.5 text-[10px] text-ink-soft"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
