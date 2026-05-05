import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getArgumentById,
  getEvidenceByArgumentId,
  getStatementForArgument,
  getUserById,
} from "@/lib/store";
import { EvidenceItem } from "@/components/EvidenceItem";
import { PostedBy } from "@/components/PostedBy";
import { UpvoteButton } from "@/components/UpvoteButton";
import { AddEvidenceDialog } from "@/components/AddEvidenceDialog";
import { EditArgumentDialog } from "@/components/EditArgumentDialog";
import { getSession } from "@/lib/session";

interface ArgumentPageProps {
  params: Promise<{ id: string }>;
}

export default async function ArgumentPage({ params }: ArgumentPageProps) {
  const [{ id }, session] = await Promise.all([params, getSession()]);
  const argument = await getArgumentById(id);

  if (!argument) {
    notFound();
  }

  const [statement, evidenceList, argumentUser] = await Promise.all([
    getStatementForArgument(argument.id),
    getEvidenceByArgumentId(argument.id),
    getUserById(argument.userId),
  ]);
  const isFor = argument.stance === "for";

  const evUserIds = [...new Set(evidenceList.map((e) => e.userId))];
  const evUserList = await Promise.all(evUserIds.map((uid) => getUserById(uid)));
  const evUserMap = Object.fromEntries(evUserIds.map((uid, i) => [uid, evUserList[i]]));

  return (
    <div className="max-w-3xl">
      {/* Breadcrumb navigation */}
      <nav className="text-sm text-neutral-400 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-neutral-600">
          Home
        </Link>
        <span>/</span>
        {statement && (
          <>
            <Link
              href={`/statements/${statement.id}`}
              className="hover:text-neutral-600"
            >
              Statement
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-neutral-600">Argument</span>
      </nav>

      {/* Argument header */}
      <section className="mb-8">
        <span
          className={`inline-block text-xs font-semibold uppercase tracking-wide px-2 py-1 rounded mb-3 ${
            isFor
              ? "bg-for-bg text-for border border-for-border"
              : "bg-against-bg text-against border border-against-border"
          }`}
        >
          {isFor ? "Argument For" : "Argument Against"}
        </span>

        <h1 className="text-2xl font-bold text-neutral-900 mb-3">
          {argument.title}
        </h1>

        <p className="text-neutral-700 leading-relaxed">{argument.summary}</p>
        <div className="flex items-center gap-3 mt-3">
          <UpvoteButton
            id={argument.id}
            targetType="argument"
            initialUpvotes={argument.upvotes}
            revalidatePath={`/arguments/${argument.id}`}
          />
          <PostedBy
            userName={argumentUser?.name ?? "Unknown"}
            createdAt={argument.createdAt}
            updatedAt={argument.updatedAt}
          />
          {session?.userId === argument.userId && (
            <EditArgumentDialog argument={argument} />
          )}
        </div>

        {/* Parent statement reference */}
        {statement && (
          <div className="mt-4 p-3 rounded border border-neutral-200 bg-neutral-50 text-sm">
            <span className="text-neutral-400">Re: </span>
            <Link
              href={`/statements/${statement.id}`}
              className="text-neutral-700 hover:underline"
            >
              &ldquo;{statement.text}&rdquo;
            </Link>
          </div>
        )}
      </section>

      {/* Evidence section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Evidence ({evidenceList.length})
          </h2>
          <AddEvidenceDialog
            argumentId={argument.id}
            statementId={statement?.id ?? ""}
          />
        </div>
        {evidenceList.length > 0 ? (
          <div className="space-y-3">
            {evidenceList.map((ev) => (
              <EvidenceItem
                key={ev.id}
                evidence={ev}
                userName={evUserMap[ev.userId]?.name ?? "Unknown"}
                currentUserId={session?.userId}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-neutral-400 py-8 text-center border border-dashed border-neutral-200 rounded-lg">
            No evidence has been attached to this argument yet.
          </p>
        )}
      </section>
    </div>
  );
}
