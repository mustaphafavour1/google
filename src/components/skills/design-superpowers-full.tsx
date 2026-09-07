import type { DesignSuperpower } from "@/lib/types";

export function DesignSuperpowersFull({ superpowers }: { superpowers: DesignSuperpower[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {superpowers.map((power, i) => (
        <div key={power._id} className="card flex gap-4 p-5">
          <span className="data-mono shrink-0 text-[28px] font-medium leading-none text-primary-300">
            {String(i + 1).padStart(2, "0")}
          </span>
          <div>
            <h3 className="type-subheading">{power.title}</h3>
            <p className="type-body mt-1.5 text-ink-muted">{power.subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
