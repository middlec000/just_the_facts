import { getStatements, getArgumentsByStatementId, getEvidenceByArgumentId, getAllTags, getUserById } from "@/lib/store";
import { StatementList } from "@/components/StatementList";
import { AddStatementDialog } from "@/components/AddStatementDialog";

export default function HomePage() {
  const allTags = getAllTags();

  const statementsWithCounts = getStatements().map((statement) => {
    const args = getArgumentsByStatementId(statement.id);
    const user = getUserById(statement.userId);
    const forArgs = args.filter((a) => a.stance === "for");
    const againstArgs = args.filter((a) => a.stance === "against");
    const allEvidence = args.flatMap((a) => getEvidenceByArgumentId(a.id));
    const netScore = (e: { upvotes: number; downvotes: number }) =>
      Math.max(0, e.upvotes - e.downvotes);
    const forEvidenceUpvotes = forArgs
      .flatMap((a) => getEvidenceByArgumentId(a.id))
      .reduce((s, e) => s + netScore(e), 0);
    const againstEvidenceUpvotes = againstArgs
      .flatMap((a) => getEvidenceByArgumentId(a.id))
      .reduce((s, e) => s + netScore(e), 0);
    const totalEvidenceUpvotes = forEvidenceUpvotes + againstEvidenceUpvotes;
    // Latest activity = newest createdAt across statement, arguments, evidence
    const allDates = [
      statement.createdAt,
      ...args.map((a) => a.createdAt),
      ...allEvidence.map((e) => e.createdAt),
    ];
    const latestActivityAt = allDates.reduce((a, b) => (a > b ? a : b));
    return {
      ...statement,
      forCount: forArgs.length,
      againstCount: againstArgs.length,
      forEvidenceUpvotes,
      againstEvidenceUpvotes,
      totalEvidenceUpvotes,
      latestActivityAt,
      userName: user?.name ?? "Unknown",
    };
  });

  return (
    <div>
      <section className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-2">Statements</h1>
          <p className="text-neutral-500 text-sm">
            Examine statements through structured arguments and evidence.
          </p>
        </div>
        <AddStatementDialog />
      </section>

      <StatementList statements={statementsWithCounts} allTags={allTags} />
    </div>
  );
}
