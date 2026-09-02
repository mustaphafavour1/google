import { Rocket, KeyRound, Puzzle, Grid3x3 } from "lucide-react";
import { PageContainer } from "@/components/shell/page-container";
import { CryptogramGame } from "@/components/playground/cryptogram-game";
import { JigsawGame } from "@/components/playground/jigsaw-game";
import { SymmetryGame } from "@/components/playground/symmetry-game";

export default function PlaygroundPage() {
  return (
    <PageContainer>
      <div className="flex items-center gap-2.5">
        <Rocket size={20} className="text-primary-500" />
        <h1 className="type-display">For Fun</h1>
      </div>
      <p className="type-body mt-2 max-w-lg text-ink-muted">
        Three small games — no prize at the end, just something to fidget with.
      </p>

      <div className="mt-9 flex flex-col gap-6">
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

        <section className="card p-6 sm:p-8">
          <div className="mb-5 flex items-center gap-2">
            <Puzzle size={16} className="text-primary-500" />
            <div>
              <h2 className="text-[15px] font-semibold text-ink-em">Brand Jigsaw</h2>
              <p className="type-meta">Swap tiles until the picture&rsquo;s back together.</p>
            </div>
          </div>
          <JigsawGame />
        </section>

        <section className="card p-6 sm:p-8">
          <div className="mb-5 flex items-center gap-2">
            <Grid3x3 size={16} className="text-primary-500" />
            <div>
              <h2 className="text-[15px] font-semibold text-ink-em">Symmetry Blocks</h2>
              <p className="type-meta">Drop Tetris-style blocks until the board mirrors itself perfectly.</p>
            </div>
          </div>
          <SymmetryGame />
        </section>
      </div>
    </PageContainer>
  );
}
