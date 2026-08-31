import { Rocket } from "lucide-react";
import { PageContainer } from "@/components/shell/page-container";
import { RocketPuzzle } from "@/components/playground/rocket-puzzle";
import { getSiteSettings } from "@/lib/content";

export default async function PlaygroundPage() {
  const { contact } = await getSiteSettings();

  return (
    <PageContainer>
      <div className="flex items-center gap-2.5">
        <Rocket size={20} className="text-primary-500" />
        <h1 className="type-display">Assemble a rocket</h1>
      </div>
      <p className="type-body mt-2 max-w-md text-ink-muted">
        Three pieces, one outline. Snap them all into place to launch — and unlock a resume
        download.
      </p>

      <div className="mt-9 card flex flex-col items-center p-8">
        <RocketPuzzle resumeUrl={contact.resumeUrl} />
      </div>

      {contact.resumeUrl && (
        <p className="type-meta mt-4 text-center">
          Prefer to skip the puzzle?{" "}
          <a href={contact.resumeUrl} download className="font-medium text-primary-500 hover:text-primary-600">
            Download the resume directly
          </a>
          .
        </p>
      )}
    </PageContainer>
  );
}
