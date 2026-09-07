import { Rocket, KeyRound, Puzzle, Type, Sparkles } from "lucide-react";
import { PageContainer } from "@/components/shell/page-container";
import { WordPlayGame } from "@/components/playground/wordplay-game";
import { CryptogramGame } from "@/components/playground/cryptogram-game";
import { JigsawGame } from "@/components/playground/jigsaw-game";
import { LovedFontsGrid } from "@/components/playground/loved-fonts-section";
import { getLovedFonts } from "@/lib/content";

export default async function PlaygroundPage() {
  const lovedFonts = await getLovedFonts();

  return (
    <PageContainer>
      <div className="flex items-center gap-2.5">
        <Rocket size={20} className="text-primary-500" />
        <h1 className="type-display">For Fun</h1>
      </div>
      <p className="type-body mt-2 max-w-lg text-ink-muted">
        Three small games, plus a few fonts I can&rsquo;t stop using — no prize at the end, just something to fidget with.
      </p>

      <div className="mt-9 grid gap-6 lg:grid-cols-2">
        <section className="card p-6 sm:p-8">
          <div className="mb-5 flex items-center gap-2">
            <Type size={16} className="text-primary-500" />
            <div>
              <h2 className="text-[15px] font-semibold text-ink-em">WordPlay</h2>
              <p className="type-meta">Add or subtract two words to land on the right answer.</p>
            </div>
          </div>
          <WordPlayGame />
        </section>

        <section className="card p-6 sm:p-8">
          <div className="mb-5 flex items-center gap-2">
            <KeyRound size={16} className="text-primary-500" />
            <div>
              <h2 className="text-[15px] font-semibold text-ink-em">Cryptogram</h2>
              <p className="type-meta">A short quote, hidden behind design/tech icons — type letters to crack it.</p>
            </div>
          </div>
          <CryptogramGame />
        </section>

        <section className="card flex h-full flex-col p-6 sm:p-8">
          <div className="mb-5 flex items-center gap-2">
            <Puzzle size={16} className="text-primary-500" />
            <div>
              <h2 className="text-[15px] font-semibold text-ink-em">Brand Jigsaw</h2>
              <p className="type-meta">Swap tiles until the picture&rsquo;s back together.</p>
            </div>
          </div>
          <JigsawGame />
        </section>

        <section className="card flex h-full flex-col p-6 sm:p-8">
          <div className="mb-5 flex items-center gap-2">
            <Sparkles size={16} className="text-primary-500" />
            <div>
              <h2 className="text-[15px] font-semibold text-ink-em">Fonts I&rsquo;m currently in love with</h2>
              <p className="type-meta">Live previews, fetched straight from Google Fonts.</p>
            </div>
          </div>
          <LovedFontsGrid fonts={lovedFonts} />
        </section>
      </div>
    </PageContainer>
  );
}
