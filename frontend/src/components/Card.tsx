"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Card } from "@/lib/board";

export function SortableCard({ card, onDelete }: { card: Card; onDelete: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: card.id });

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={isDragging ? "opacity-40" : ""}
      {...attributes}
      {...listeners}
    >
      <CardView card={card} onDelete={onDelete} />
    </li>
  );
}

export function CardView({ card, onDelete, overlay }: { card: Card; onDelete?: () => void; overlay?: boolean }) {
  return (
    <article
      data-testid="card"
      className={`group relative cursor-grab rounded-xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(3,33,71,0.06)] transition-shadow hover:shadow-[0_4px_14px_rgba(3,33,71,0.08)] ${
        overlay ? "rotate-2 cursor-grabbing shadow-[0_12px_32px_rgba(3,33,71,0.18)]" : ""
      }`}
    >
      <h3 className="pr-6 text-sm font-semibold leading-snug text-navy">{card.title}</h3>
      {card.details && <p className="mt-1.5 text-[13px] leading-relaxed text-gray-text">{card.details}</p>}
      {onDelete && (
        <button
          aria-label={`Delete ${card.title}`}
          onClick={onDelete}
          onPointerDown={(e) => e.stopPropagation()}
          className="absolute right-2.5 top-2.5 rounded-md p-1 text-gray-text opacity-0 transition hover:bg-red-50 hover:text-red-500 focus:opacity-100 group-hover:opacity-100"
        >
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </article>
  );
}
