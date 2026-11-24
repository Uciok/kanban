export type Card = { id: string; title: string; details: string };
export type Column = { id: string; title: string; cards: Card[] };
export type Board = Column[];

export function renameColumn(board: Board, columnId: string, title: string): Board {
  return board.map((c) => (c.id === columnId ? { ...c, title } : c));
}

export function addCard(board: Board, columnId: string, card: Card): Board {
  return board.map((c) => (c.id === columnId ? { ...c, cards: [...c.cards, card] } : c));
}

export function deleteCard(board: Board, cardId: string): Board {
  return board.map((c) => ({ ...c, cards: c.cards.filter((card) => card.id !== cardId) }));
}

export function findColumnId(board: Board, id: string): string | undefined {
  if (board.some((c) => c.id === id)) return id;
  return board.find((c) => c.cards.some((card) => card.id === id))?.id;
}

export function moveCard(board: Board, cardId: string, toColumnId: string, toIndex: number): Board {
  const card = board.flatMap((c) => c.cards).find((c) => c.id === cardId);
  if (!card) return board;
  return deleteCard(board, cardId).map((c) => {
    if (c.id !== toColumnId) return c;
    const cards = [...c.cards];
    cards.splice(toIndex, 0, card);
    return { ...c, cards };
  });
}
