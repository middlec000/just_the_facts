"use client";

import { useState, useTransition } from "react";
import { castHeart } from "@/lib/actions";

interface HeartButtonProps {
  id: string;
  targetType: "statement" | "argument";
  initialHearts: number;
  revalidatePath: string;
  /** Stop click events from bubbling (useful when HeartButton is inside a <Link>) */
  stopPropagation?: boolean;
}

export function HeartButton({
  id,
  targetType,
  initialHearts,
  revalidatePath,
  stopPropagation = false,
}: HeartButtonProps) {
  const [hearted, setHearted] = useState(false);
  const [, startTransition] = useTransition();

  // Optimistic delta: +1 if hearted, 0 if not
  const hearts = initialHearts + (hearted ? 1 : 0);

  function handleHeart(e: React.MouseEvent) {
    if (stopPropagation) e.preventDefault();
    e.stopPropagation();
    const next = !hearted;
    setHearted(next);
    startTransition(async () => {
      const result = await castHeart(targetType, id, revalidatePath);
      // Reconcile with server truth
      setHearted(result.active);
    });
  }

  return (
    <button
      onClick={handleHeart}
      aria-label={hearted ? "Remove heart" : "Heart"}
      aria-pressed={hearted}
      className={`flex items-center gap-1.5 px-2 py-1 rounded-md border text-sm transition-colors select-none ${
        hearted
          ? "bg-rose-50 border-rose-400 text-rose-500"
          : "bg-white border-neutral-300 text-neutral-500 hover:border-rose-400 hover:text-rose-500"
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-4 h-4"
      >
        <path d="M9.653 16.915l-.005-.003-.019-.01a20.759 20.759 0 0 1-1.162-.682 22.045 22.045 0 0 1-2.582-2.184C4.045 12.733 2 10.352 2 7.5a4.5 4.5 0 0 1 8-2.828A4.5 4.5 0 0 1 18 7.5c0 2.852-2.044 5.233-3.885 6.536a22.049 22.049 0 0 1-3.744 2.082l-.019.01-.005.003h-.002a.739.739 0 0 1-.69.001l-.002-.001Z" />
      </svg>
      <span className="font-medium">{hearts}</span>
    </button>
  );
}
