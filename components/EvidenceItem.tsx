import { Evidence, SourceType } from "@/lib/types";
import { VoteButtons } from "@/components/VoteButtons";
import { PostedBy } from "@/components/PostedBy";

interface EvidenceItemProps {
  evidence: Evidence;
  userName: string;
}

const sourceTypeLabels: Record<SourceType, string> = {
  article: "Article",
  study: "Study",
  official: "Official Source",
  video: "Video",
  book: "Book",
  other: "Other",
};

export function EvidenceItem({ evidence, userName }: EvidenceItemProps) {
  return (
    <div className="border border-neutral-200 rounded-lg p-4">
      <div className="flex items-start justify-between gap-4 mb-2">
        <h4 className="font-medium text-neutral-900">{evidence.title}</h4>
        <span className="shrink-0 text-xs px-2 py-1 rounded-full bg-neutral-100 text-neutral-600 border border-neutral-200">
          {sourceTypeLabels[evidence.sourceType]}
        </span>
      </div>
      <p className="text-sm text-neutral-600 mb-3 leading-relaxed">
        {evidence.description}
      </p>
      {evidence.sourceUrl && (
        <a
          href={evidence.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-blue-700 hover:underline"
        >
          View source &#8599;
        </a>
      )}
      <div className="flex items-center justify-between gap-4 mt-3 flex-wrap">
        <VoteButtons
          id={evidence.id}
          initialUpvotes={evidence.upvotes}
          initialDownvotes={evidence.downvotes}
        />
        <PostedBy userName={userName} createdAt={evidence.createdAt} />
      </div>
    </div>
  );
}