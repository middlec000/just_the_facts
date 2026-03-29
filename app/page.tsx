import { statements, getArgumentsByStatementId, getAllTags, getUserById } from "@/lib/mock-data";
import { StatementList } from "@/components/StatementList";

export default function HomePage() {
  const allTags = getAllTags();

  const statementsWithCounts = statements.map((statement) => {
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
      <section className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Statements</h1>
        <p className="text-neutral-500 text-sm">
          Examine statements through structured arguments and evidence.
        </p>
      </section>

      <StatementList statements={statementsWithCounts} allTags={allTags} />
    </div>
  );
}
