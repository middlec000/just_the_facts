export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-neutral-900 mb-6">About Just the Facts</h1>

      <div className="space-y-6 text-neutral-700 leading-relaxed">
        <p className="text-lg">
          Just the Facts is a platform for exploring controversial topics by presenting both sides of
          an argument on equal footing — no algorithmic amplification, no hidden bias, just structured debate.
        </p>

        <section>
          <h2 className="text-xl font-semibold text-neutral-900 mb-2">How it works</h2>
          <p>
            Every topic on the site is framed as a <strong>Statement</strong> — an objective, falsifiable
            claim. Anyone can add <strong>Arguments</strong> for or against that statement, and
            attach <strong>Evidence</strong> to support their argument. The for and against columns
            are always shown side by side, giving each position equal space and equal visibility.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-neutral-900 mb-2">Our principles</h2>
          <ul className="space-y-3">
            <li className="flex gap-3">
              <span className="mt-1 w-2 h-2 rounded-full bg-neutral-400 shrink-0" />
              <span>
                <strong>Equal footing.</strong> Arguments for and against a statement are always
                displayed side by side. No side is buried, ranked away, or given more prominence
                by default.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1 w-2 h-2 rounded-full bg-neutral-400 shrink-0" />
              <span>
                <strong>Good-faith debate.</strong> The goal is not to &ldquo;win&rdquo; but to
                understand. Arguments are expected to engage honestly with the topic — not to
                score points or demean opposing views.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1 w-2 h-2 rounded-full bg-neutral-400 shrink-0" />
              <span>
                <strong>Transparency.</strong> Every argument and piece of evidence is attributed
                to its author and timestamped. Nothing is anonymous and nothing disappears silently.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1 w-2 h-2 rounded-full bg-neutral-400 shrink-0" />
              <span>
                <strong>Open contribution.</strong> Anyone with an account can add statements,
                arguments, and evidence. The quality of the debate is maintained by the community,
                not by gatekeepers.
              </span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-neutral-900 mb-2">Why this matters</h2>
          <p>
            Public discourse is increasingly shaped by platforms that reward outrage and punish
            nuance. Just the Facts is a small attempt to push back — to create a space where it is
            possible to read a well-constructed argument for a position you disagree with and come
            away thinking: <em>&ldquo;I hadn&rsquo;t considered that.&rdquo;</em>
          </p>
          <p className="mt-3">
            Trust in institutions, media, and each other has been eroding for decades. We believe
            that structured, transparent, good-faith discussion is one of the best tools we have to
            rebuild it.
          </p>
        </section>
      </div>
    </div>
  );
}
