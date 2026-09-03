import { ExternalLink } from "lucide-react";
import { PageContainer } from "@/components/shell/page-container";
import { getPortfolioArchive } from "@/lib/content";

const PLACEHOLDER_GRADIENTS = [
  ["#A55C4E", "#D19686"],
  ["#5C6B47", "#C08A6E"],
  ["#6366F1", "#8B5CF6"],
  ["#0F9488", "#EC4899"],
];

export default async function ArchivePage() {
  const entries = await getPortfolioArchive();

  return (
    <PageContainer>
      <p className="type-eyebrow">Archive</p>
      <h1 className="type-display mt-2">Past versions of this portfolio</h1>
      <p className="type-body mt-3 max-w-xl text-ink-muted">
        How my design portfolio has evolved over the years.
      </p>

      <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map((entry, i) => {
          const [from, to] = PLACEHOLDER_GRADIENTS[i % PLACEHOLDER_GRADIENTS.length];
          return (
            <a
              key={entry._id}
              href={entry.url}
              target="_blank"
              rel="noopener noreferrer"
              className="card group flex flex-col overflow-hidden transition-shadow hover:shadow-[0_4px_16px_rgb(15_23_42_/_0.08)]"
            >
              <div className="relative h-40 w-full shrink-0 overflow-hidden">
                {entry.image ? (
                  // eslint-disable-next-line @next/next/no-img-element -- CMS-hosted image, arbitrary remote host
                  <img src={entry.image} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div
                    className="h-full w-full"
                    style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
                  />
                )}
                <span className="absolute bottom-2.5 left-2.5 rounded-full bg-black/75 px-2.5 py-1 text-[11px] font-semibold text-white">
                  {entry.year}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="type-body flex-1 text-[13px] text-ink-muted">{entry.description}</p>
                <span className="mt-4 flex shrink-0 items-center gap-1 text-[12px] font-medium text-primary-500 transition-all group-hover:gap-1.5">
                  Visit
                  <ExternalLink size={12} />
                </span>
              </div>
            </a>
          );
        })}
      </div>
    </PageContainer>
  );
}
