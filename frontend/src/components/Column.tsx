"use client";

import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { Column as ColumnData } from "@/lib/board";
import { SortableCard } from "./Card";
import { AddCard } from "./AddCard";

type Props = {
  column: ColumnData;
  onRename: (title: string) => void;
  onAdd: (title: string, details: string) => void;
  onDelete: (cardId: string) => void;
};

export function Column({ column, onRename, onAdd, onDelete }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  const [editing, setEditing] = useState(false);

  function save(value: string) {
    if (value.trim()) onRename(value.trim());
    setEditing(false);
  }

  return (
    <section
      ref={setNodeRef}
      aria-label={column.title}
      data-testid={`column-${column.id}`}
      className={`flex min-h-[70vh] flex-col rounded-2xl border bg-slate-100/70 p-3 transition-colors ${
        isOver ? "border-primary/40 bg-primary/5" : "border-slate-200/80"
      }`}
    >
      <div className="mb-3 flex items-center gap-2 border-t-2 border-accent px-1 pt-3">
        {editing ? (
          <input
            autoFocus
            aria-label="Column name"
            defaultValue={column.title}
            onBlur={(e) => save(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") save(e.currentTarget.value);
              if (e.key === "Escape") setEditing(false);
            }}
            className="min-w-0 flex-1 rounded-md border border-primary/50 bg-white px-2 py-1 text-sm font-semibold text-navy outline-none ring-2 ring-primary/20"
          />
        ) : (
          <button
            onClick={() => setEditing(true)}
            title="Rename column"
            className="min-w-0 flex-1 truncate rounded-md px-2 py-1 text-left text-sm font-semibold text-navy transition-colors hover:bg-white"
          >
            {column.title}
          </button>
        )}
        <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-gray-text shadow-sm">
          {column.cards.length}
        </span>
      </div>

      <SortableContext items={column.cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
        <ul className="flex flex-1 flex-col gap-2.5">
          {column.cards.map((card) => (
            <SortableCard key={card.id} card={card} onDelete={() => onDelete(card.id)} />
          ))}
        </ul>
      </SortableContext>

      <AddCard onAdd={onAdd} />
    </section>
  );
}
