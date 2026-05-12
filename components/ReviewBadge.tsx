import { Review } from "@/lib/types";
import { formatDate } from "@/lib/utils";

interface ReviewBadgeProps {
  review: Review | null;
}

const STATUS_CONFIG = {
  verified: {
    icon: "✅",
    label: "Verified",
    className: "bg-green-50 text-green-800 border-green-200",
  },
  not_objective: {
    icon: "❌",
    label: "Not Objective",
    className: "bg-amber-50 text-amber-800 border-amber-200",
  },
  not_falsifiable: {
    icon: "❌",
    label: "Not Falsifiable",
    className: "bg-amber-50 text-amber-800 border-amber-200",
  },
} as const;

export function ReviewBadge({ review }: ReviewBadgeProps) {
  if (!review) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-500 border border-neutral-200">
        <span>⏳</span>
        <span>Pending Review</span>
      </span>
    );
  }

  const config = STATUS_CONFIG[review.status];
  const displayDate = review.updatedAt ?? review.createdAt;
  const wasEdited = !!review.updatedAt;

  return (
    <div className="flex flex-col gap-1">
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border w-fit ${config.className}`}
      >
        <span>{config.icon}</span>
        <span>{config.label}</span>
      </span>
      <p className="text-xs text-neutral-400">
        Reviewed by{" "}
        <span className="font-medium text-neutral-500">{review.reviewerName}</span>
        {" · "}
        {wasEdited ? <>(Updated) {formatDate(displayDate)}</> : formatDate(displayDate)}
      </p>
    </div>
  );
}
