import Link from "next/link";
import { Argument } from "@/lib/types";
import { VoteButtons } from "@/components/VoteButtons";
import { PostedBy } from "@/components/PostedBy";

interface ArgumentCardProps {
  argument: Argument;
  userName: string;
}

export function ArgumentCard({ argument, userName }: ArgumentCardProps) {
  const isFor = argument.stance === "for";

  return (
    <Link
      href={`/arguments/${argument.id}`}
      className={`block rounded-lg border p-4 transition-shadow hover:shadow-md ${
        isFor
          ? "border-for-border bg-for-bg"
          : "border-against-border bg-against-bg"
      }`}
    >
      <h3 className="text-base font-semibold text-neutral-900 mb-2">
        {argument.title}
      </h3>
      <p className="text-sm text-neutral-600 leading-relaxed mb-3">
        {argument.summary}
      </p>
      <VoteButtons
        id={argument.id}
        initialUpvotes={argument.upvotes}
        initialDownvotes={argument.downvotes}
        stopPropagation
      />
      <PostedBy userName={userName} createdAt={argument.createdAt} />
    </Link>
  );
}
