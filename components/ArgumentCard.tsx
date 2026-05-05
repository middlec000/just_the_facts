import Link from "next/link";
import { Argument } from "@/lib/types";
import { UpvoteButton } from "@/components/UpvoteButton";
import { PostedBy } from "@/components/PostedBy";
import { EditArgumentDialog } from "@/components/EditArgumentDialog";

interface ArgumentCardProps {
  argument: Argument;
  userName: string;
  currentUserId?: string;
}

export function ArgumentCard({ argument, userName, currentUserId }: ArgumentCardProps) {
  const isFor = argument.stance === "for";

  return (
    <div className="relative">
      <Link
        href={`/arguments/${argument.id}`}
        className={`block rounded-lg border p-4 transition-shadow hover:shadow-md ${
          isFor
            ? "border-for-border bg-for-bg"
            : "border-against-border bg-against-bg"
        }`}
      >
        <h3 className={`text-base font-semibold text-neutral-900 mb-2 ${currentUserId === argument.userId ? "pr-16" : ""}`}>
          {argument.title}
        </h3>
        <p className="text-sm text-neutral-600 leading-relaxed mb-3">
          {argument.summary}
        </p>
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <UpvoteButton
            id={argument.id}
            targetType="argument"
            initialUpvotes={argument.upvotes}
            revalidatePath={`/statements/${argument.statementId}`}
            stopPropagation
          />
        </div>
        <PostedBy userName={userName} createdAt={argument.createdAt} updatedAt={argument.updatedAt} />
      </Link>
      {currentUserId === argument.userId && (
        <div className="absolute top-3 right-3">
          <EditArgumentDialog argument={argument} />
        </div>
      )}
    </div>
  );
}
