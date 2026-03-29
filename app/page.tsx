import Link from "next/link";
import { statements, getArgumentsByStatementId } from "@/lib/mock-data";

export default function HomePage() {
  return (
    <div>
      <section className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Statements</h1>
        <p className="text-neutral-500 text-sm">
          Examine statements through structured arguments and evidence.
        </p>
      </section>

      <div className="space-y-4">
        {statements.map((statement) => {
          const args = getArgumentsByStatementId(statement.id);
          const forCount = args.filter((a) => a.stance === "for").length;
          const againstCount = args.filter(
            (a) => a.stance === "against",
          ).length;

          return (
            <Link
              key={statement.id}
              href={`/statements/${statement.id}`}
              className="block p-6 rounded-lg border border-neutral-200 bg-white hover:shadow-md transition-shadow"
            >
              <h2 className="text-lg font-semibold text-neutral-900 mb-3">
                &ldquo;{statement.text}&rdquo;
              </h2>
              <div className="flex gap-4 text-sm">
                <span className="text-for">
                  {forCount} argument{forCount !== 1 && "s"} for
                </span>
                <span className="text-neutral-300">|</span>
                <span className="text-against">
                  {againstCount} argument{againstCount !== 1 && "s"} against
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
