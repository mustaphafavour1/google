import { ArrowUpRight, Package } from "lucide-react";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  return (
    <a
      href={product.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col overflow-hidden rounded-xl border border-hairline bg-surface transition-shadow hover:shadow-[0_12px_32px_rgb(15_15_15_/_0.08)]"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-surface-muted">
        {product.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element -- CMS-hosted image, arbitrary remote host
          <img
            src={product.coverImage}
            alt=""
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-ink-faint">
            <Package size={22} />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-[14.5px] font-semibold text-ink-em">{product.name}</h3>
        <p className="type-body mt-1 flex-1 text-ink-muted">{product.description}</p>
        <span className="mt-3 flex items-center gap-1 text-[12.5px] font-medium text-primary-500 transition-all group-hover:gap-1.5">
          Visit
          <ArrowUpRight size={13} />
        </span>
      </div>
    </a>
  );
}
