interface EvidenceSupportBarProps {
  forUpvotes: number;
  againstUpvotes: number;
}

export function EvidenceSupportBar({ forUpvotes, againstUpvotes }: EvidenceSupportBarProps) {
  const total = forUpvotes + againstUpvotes;
  const forPct = total === 0 ? 50 : Math.round((forUpvotes / total) * 100);
  const againstPct = 100 - forPct;

  return (
    <div>
      <div className="flex h-2 w-full rounded-full overflow-hidden bg-neutral-100">
        <div className="bg-emerald-500 transition-all" style={{ width: `${forPct}%` }} />
        <div className="bg-rose-400 transition-all" style={{ width: `${againstPct}%` }} />
      </div>
      <div className="flex justify-between mt-1 text-xs text-neutral-400">
        <span className="text-emerald-600 font-medium">
          {total === 0 ? "No votes yet" : `for (${forUpvotes} net)`}
        </span>
        {total > 0 && (
          <span className="text-rose-500 font-medium">
            against ({againstUpvotes} net)
          </span>
        )}
      </div>
    </div>
  );
}
