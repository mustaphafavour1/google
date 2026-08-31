import { ClapButton } from "./clap-button";
import { CommentBox } from "./comment-box";
import { getClaps } from "@/lib/metrics-store";

export function CaseStudyFooter({ slug, projectName }: { slug: string; projectName: string }) {
  return (
    <div className="mt-10 flex flex-col gap-5 border-t border-hairline pt-8 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p className="type-eyebrow mb-2">Found this useful?</p>
        <ClapButton slug={slug} initialClaps={getClaps(slug)} />
      </div>
      <div className="w-full sm:max-w-sm">
        <p className="type-eyebrow mb-2">Leave a thought</p>
        <CommentBox projectName={projectName} />
      </div>
    </div>
  );
}
