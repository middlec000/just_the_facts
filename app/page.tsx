import { getStatements, getArgumentsByStatementId, getAllTags, getUserById } from "@/lib/store";
import { StatementList } from "@/components/StatementList";
import { AddStatementDialog } from "@/components/AddStatementDialog";

export default function HomePage() {
  const allTags = getAllTags();

  const statementsWithCounts = getStatements().map((statement) => {
    const args = getArgumentsByStatementId(statement.id);
    const user = getUserById(statement.userId);
    return {
      ...statement,
      forCount: args.filter((a) => a.stance === "for").length,
      againstCount: args.filter((a) => a.stance === "against").length,
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
