import { notFound } from "next/navigation";
import Link from "next/link";
import { getStatementById, getArgumentsByStatementId, getUserById } from "@/lib/store";
import { ArgumentCard } from "@/components/ArgumentCard";
import { PostedBy } from "@/components/PostedBy";
import { AddArgumentDialog } from "@/components/AddArgumentDialog";
import { EvidenceSupportBar } from "@/components/EvidenceSupportBar";
import { getSession } from "@/lib/session";

interface StatementPageProps {
  params: Promise<{ id: string }>;
}

export default async function StatementPage({ params }: StatementPageProps) {
  const [{ id }, session] = await Promise.all([params, getSession()]);
  const statement = await getStatementById(id);

  if (!statement) {
    notFound();
  }

  const [allArguments, statementUser] = await Promise.all([
    getArgumentsByStatementId(statement.id),
    getUserById(statement.userId),
  ]);
  const argumentsFor = allArguments.filter((a) => a.stance === "for");
  const argumentsAgainst = allArguments.filter((a) => a.stance === "against");

  const argUserIds = [...new Set(allArguments.map((a) => a.userId))];
  const argUserList = await Promise.all(argUserIds.map((uid) => getUserById(uid)));
  const argUserMap = Object.fromEntries(argUserIds.map((uid, i) => [uid, argUserList[i]]));

  const forArgumentUpvotes = argumentsFor.reduce((s, a) => s + a.upvotes, 0);
  const againstArgumentUpvotes = argumentsAgainst.reduce((s, a) => s + a.upvotes, 0);

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

        {/* Hashtags */}
        {statement.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {statement.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-700 border border-neutral-200"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
        <PostedBy
          userName={statementUser?.name ?? "Unknown"}
          createdAt={statement.createdAt}
          updatedAt={statement.updatedAt}
        />
        <div className="mt-4">
          <EvidenceSupportBar
            forArgumentUpvotes={forArgumentUpvotes}
            againstArgumentUpvotes={againstArgumentUpvotes}
          />
        </div>
      </section>

      {/* Two-column arguments layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* For column */}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-for mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-for" />
            Arguments For ({argumentsFor.length})
          </h2>
          <div className="mb-4">
            <AddArgumentDialog statementId={statement.id} defaultStance="for" />
          </div>
          <div className="space-y-3">
            {argumentsFor.length > 0 ? (
              argumentsFor.map((arg) => (
                <ArgumentCard
                  key={arg.id}
                  argument={arg}
                  userName={argUserMap[arg.userId]?.name ?? "Unknown"}
                  currentUserId={session?.userId}
                />
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
          <div className="mb-4">
            <AddArgumentDialog statementId={statement.id} defaultStance="against" />
          </div>
          <div className="space-y-3">
            {argumentsAgainst.length > 0 ? (
              argumentsAgainst.map((arg) => (
                <ArgumentCard
                  key={arg.id}
                  argument={arg}
                  userName={argUserMap[arg.userId]?.name ?? "Unknown"}
                  currentUserId={session?.userId}
                />
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
