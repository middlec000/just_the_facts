import { formatDate } from "@/lib/utils";

interface PostedByProps {
  userName: string;
  createdAt: string;
}

/**
 * Displays the submitting user and formatted timestamp.
 * Used on statement cards, argument cards, and evidence items.
 */
export function PostedBy({ userName, createdAt }: PostedByProps) {
  return (
    <p className="text-xs text-neutral-400 mt-2">
      Posted by{" "}
      <span className="font-medium text-neutral-500">{userName}</span>
      {" · "}
      {formatDate(createdAt)}
    </p>
  );
}
