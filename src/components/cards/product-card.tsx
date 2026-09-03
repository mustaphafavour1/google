import { Package } from "lucide-react";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  return (
    <a
      href={product.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block aspect-video w-full overflow-hidden rounded-[8px] border border-hairline bg-surface-muted"
    >
      {product.coverImage ? (
        // eslint-disable-next-line @next/next/no-img-element -- CMS-hosted image, arbitrary remote host
        <img
          src={product.coverImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full items-center justify-center text-ink-faint">
          <Package size={22} />
        </div>
      )}
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <h3 className="text-[15px] font-semibold leading-tight text-white">{product.name}</h3>
        <p className="mt-0.5 truncate text-[10px] text-white/85">{product.description}</p>
      </div>
    </a>
  );
}
