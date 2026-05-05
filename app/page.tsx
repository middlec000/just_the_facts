import { getStatements, getArgumentsByStatementId, getEvidenceByArgumentId, getAllTags, getUserById } from "@/lib/store";
import { StatementList } from "@/components/StatementList";
import { AddStatementDialog } from "@/components/AddStatementDialog";
import { getSession } from "@/lib/session";

export default async function HomePage() {
  const [session, allTags, statementsList] = await Promise.all([
    getSession(),
    getAllTags(),
    getStatements(),
  ]);

  const statementsWithCounts = await Promise.all(
    statementsList.map(async (statement) => {
      const [args, user] = await Promise.all([
        getArgumentsByStatementId(statement.id),
        getUserById(statement.userId),
      ]);
      const forArgs = args.filter((a) => a.stance === "for");
      const againstArgs = args.filter((a) => a.stance === "against");
      const evidenceLists = await Promise.all(args.map((a) => getEvidenceByArgumentId(a.id)));
      const allEvidence = evidenceLists.flat();
      const forArgumentUpvotes = forArgs.reduce((s, a) => s + a.upvotes, 0);
      const againstArgumentUpvotes = againstArgs.reduce((s, a) => s + a.upvotes, 0);
      const totalArgumentUpvotes = forArgumentUpvotes + againstArgumentUpvotes;
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
        forArgumentUpvotes,
        againstArgumentUpvotes,
        totalArgumentUpvotes,
        latestActivityAt,
        userName: user?.name ?? "Unknown",
      };
    }),
  );

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

      <StatementList statements={statementsWithCounts} allTags={allTags} currentUserId={session?.userId} />
    </div>
  );
}
