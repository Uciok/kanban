"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { addCard, deleteCard, findColumnId, moveCard, renameColumn, type Board as BoardData } from "@/lib/board";
import { seed } from "@/lib/seed";
import { Column } from "./Column";
import { CardView } from "./Card";

export function Board({ initial = seed }: { initial?: BoardData }) {
  const [board, setBoard] = useState(initial);
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const activeCard = board.flatMap((c) => c.cards).find((c) => c.id === activeId);
  const total = board.reduce((n, c) => n + c.cards.length, 0);

  function indexIn(columnId: string, id: string) {
    const cards = board.find((c) => c.id === columnId)!.cards;
    const i = cards.findIndex((c) => c.id === id);
    return i === -1 ? cards.length : i;
  }

  function onDragStart({ active }: DragStartEvent) {
    setActiveId(String(active.id));
  }

  function onDragOver({ active, over }: DragOverEvent) {
    if (!over) return;
    const from = findColumnId(board, String(active.id));
    const to = findColumnId(board, String(over.id));
    if (!from || !to || from === to) return;
    setBoard(moveCard(board, String(active.id), to, indexIn(to, String(over.id))));
  }

  function onDragEnd({ active, over }: DragEndEvent) {
    setActiveId(null);
    if (!over) return;
    const to = findColumnId(board, String(over.id));
    if (!to) return;
    setBoard(moveCard(board, String(active.id), to, indexIn(to, String(over.id))));
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-slate-200/70 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-[1600px] items-end justify-between px-8 py-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Project board</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-navy">Product Launch</h1>
          </div>
          <p className="text-sm text-gray-text">
            {total} cards across {board.length} columns
          </p>
        </div>
        <div className="h-0.5 bg-gradient-to-r from-accent via-accent/40 to-transparent" />
      </header>

      <main className="flex-1 overflow-x-auto">
        <DndContext
          id="board"
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDragEnd={onDragEnd}
          onDragCancel={() => setActiveId(null)}
        >
          <div className="mx-auto grid min-w-[1200px] max-w-[1600px] grid-cols-5 gap-5 px-8 py-8">
            {board.map((column) => (
              <Column
                key={column.id}
                column={column}
                onRename={(title) => setBoard(renameColumn(board, column.id, title))}
                onAdd={(title, details) =>
                  setBoard(addCard(board, column.id, { id: crypto.randomUUID(), title, details }))
                }
                onDelete={(cardId) => setBoard(deleteCard(board, cardId))}
              />
            ))}
          </div>
          <DragOverlay dropAnimation={{ duration: 180, easing: "cubic-bezier(0.2, 0, 0, 1)" }}>
            {activeCard ? <CardView card={activeCard} overlay /> : null}
          </DragOverlay>
        </DndContext>
      </main>
    </div>
  );
}
