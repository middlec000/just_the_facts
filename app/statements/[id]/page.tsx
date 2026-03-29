import { notFound } from "next/navigation";
import Link from "next/link";
import { getStatementById, getArgumentsByStatementId } from "@/lib/mock-data";
import { ArgumentCard } from "@/components/ArgumentCard";

interface StatementPageProps {
  params: Promise<{ id: string }>;
}

export default async function StatementPage({ params }: StatementPageProps) {
  const { id } = await params;
  const statement = getStatementById(id);

  if (!statement) {
    notFound();
  }

  const allArguments = getArgumentsByStatementId(statement.id);
  const argumentsFor = allArguments.filter((a) => a.stance === "for");
  const argumentsAgainst = allArguments.filter((a) => a.stance === "against");

  return (
    <div>
      {/* Statement header */}
      <section className="mb-8">
        <Link
          href="/"
          className="text-sm text-neutral-400 hover:text-neutral-600 mb-4 inline-block"
        >
          &larr; All Statements
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-neutral-900">
          &ldquo;{statement.text}&rdquo;
        </h1>
      </section>

      {/* Two-column arguments layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* For column */}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-for mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-for" />
            Arguments For ({argumentsFor.length})
          </h2>
          <div className="space-y-3">
            {argumentsFor.length > 0 ? (
              argumentsFor.map((arg) => (
                <ArgumentCard key={arg.id} argument={arg} />
              ))
            ) : (
              <p className="text-sm text-neutral-400 py-8 text-center">
                No arguments for this statement yet.
              </p>
            )}
          </div>
        </section>

        {/* Against column */}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-against mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-against" />
            Arguments Against ({argumentsAgainst.length})
          </h2>
          <div className="space-y-3">
            {argumentsAgainst.length > 0 ? (
              argumentsAgainst.map((arg) => (
                <ArgumentCard key={arg.id} argument={arg} />
              ))
            ) : (
              <p className="text-sm text-neutral-400 py-8 text-center">
                No arguments against this statement yet.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
