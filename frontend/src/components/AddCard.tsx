"use client";

import { useState } from "react";

export function AddCard({ onAdd }: { onAdd: (title: string, details: string) => void }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");

  function close() {
    setOpen(false);
    setTitle("");
    setDetails("");
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="mt-3 flex items-center gap-1.5 rounded-lg px-2 py-2 text-sm font-medium text-primary transition-colors hover:bg-white"
      >
        <span className="text-base leading-none">+</span> Add card
      </button>
    );
  }

  return (
    <form
      className="mt-3 space-y-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
      onSubmit={(e) => {
        e.preventDefault();
        if (!title.trim()) return;
        onAdd(title.trim(), details.trim());
        close();
      }}
      onKeyDown={(e) => e.key === "Escape" && close()}
    >
      <input
        autoFocus
        aria-label="Card title"
        placeholder="Card title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full rounded-md border border-slate-200 px-2.5 py-1.5 text-sm text-navy outline-none placeholder:text-gray-text/70 focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
      <textarea
        aria-label="Card details"
        placeholder="Details"
        rows={3}
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        className="w-full resize-none rounded-md border border-slate-200 px-2.5 py-1.5 text-sm text-navy outline-none placeholder:text-gray-text/70 focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={!title.trim()}
          className="rounded-md bg-secondary px-3 py-1.5 text-sm font-medium text-white shadow-sm transition hover:bg-secondary/90 disabled:opacity-40"
        >
          Add card
        </button>
        <button type="button" onClick={close} className="px-2 py-1.5 text-sm text-gray-text hover:text-navy">
          Cancel
        </button>
      </div>
    </form>
  );
}
