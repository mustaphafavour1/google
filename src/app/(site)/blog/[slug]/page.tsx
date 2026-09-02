import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageContainer } from "@/components/shell/page-container";
import { RichContent } from "@/components/portable-text";
import { getBlogPostBySlug, getBlogPosts } from "@/lib/content";

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} — Favour Mustapha`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  return (
    <PageContainer>
      <div className="mx-auto max-w-3xl">
        <Link
          href="/blog"
          className="mb-6 inline-flex items-center gap-1.5 text-[12.5px] font-medium text-ink-soft transition-colors hover:text-ink-strong"
        >
          <ArrowLeft size={13} />
          All posts
        </Link>

        <p className="type-label">
          {new Date(post.publishedAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <h1 className="type-display mt-1">{post.title}</h1>
        <p className="type-body mt-3 text-ink-muted">{post.excerpt}</p>

        {post.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span key={tag} className="data-mono rounded-full border border-hairline px-2 py-0.5 text-ink-soft">
                {tag}
              </span>
            ))}
          </div>
        )}

        {post.coverImage && (
          <div className="mt-8 overflow-hidden rounded-2xl border border-hairline">
            {/* eslint-disable-next-line @next/next/no-img-element -- CMS-hosted image, arbitrary remote host */}
            <img src={post.coverImage} alt="" className="w-full" />
          </div>
        )}

        <div className="mt-8">
          <RichContent value={post.content} />
        </div>
      </div>
    </PageContainer>
  );
}
