import { describe, expect, it } from "vitest";
import { addCard, deleteCard, findColumnId, moveCard, renameColumn, type Board } from "./board";

const board: Board = [
  {
    id: "a",
    title: "A",
    cards: [
      { id: "1", title: "One", details: "" },
      { id: "2", title: "Two", details: "" },
      { id: "3", title: "Three", details: "" },
    ],
  },
  { id: "b", title: "B", cards: [{ id: "4", title: "Four", details: "" }] },
  { id: "c", title: "C", cards: [] },
];

const ids = (b: Board, col: string) => b.find((c) => c.id === col)!.cards.map((c) => c.id);

describe("board", () => {
  it("renames a column", () => {
    const next = renameColumn(board, "b", "Bee");
    expect(next[1].title).toBe("Bee");
    expect(board[1].title).toBe("B");
  });

  it("adds a card to the end of a column", () => {
    const next = addCard(board, "c", { id: "5", title: "Five", details: "x" });
    expect(ids(next, "c")).toEqual(["5"]);
  });

  it("deletes a card", () => {
    expect(ids(deleteCard(board, "2"), "a")).toEqual(["1", "3"]);
  });

  it("finds the column of a card or column id", () => {
    expect(findColumnId(board, "4")).toBe("b");
    expect(findColumnId(board, "c")).toBe("c");
    expect(findColumnId(board, "nope")).toBeUndefined();
  });

  it("moves a card within a column", () => {
    expect(ids(moveCard(board, "1", "a", 2), "a")).toEqual(["2", "3", "1"]);
  });

  it("moves a card across columns", () => {
    const next = moveCard(board, "2", "b", 0);
    expect(ids(next, "a")).toEqual(["1", "3"]);
    expect(ids(next, "b")).toEqual(["2", "4"]);
  });

  it("moves a card into an empty column", () => {
    expect(ids(moveCard(board, "4", "c", 0), "c")).toEqual(["4"]);
  });

  it("ignores unknown cards", () => {
    expect(moveCard(board, "nope", "c", 0)).toBe(board);
  });
});
