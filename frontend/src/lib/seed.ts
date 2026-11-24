import type { Board } from "./board";

export const seed: Board = [
  {
    id: "backlog",
    title: "Backlog",
    cards: [
      { id: "c1", title: "Research competitor onboarding", details: "Review the first-run experience of three similar tools." },
      { id: "c2", title: "Draft Q1 roadmap", details: "Outline themes and rough milestones for the next quarter." },
      { id: "c3", title: "Collect customer quotes", details: "Pull highlights from recent interviews for the landing page." },
    ],
  },
  {
    id: "todo",
    title: "To Do",
    cards: [
      { id: "c4", title: "Design pricing page", details: "Three tiers, annual toggle, FAQ section." },
      { id: "c5", title: "Set up analytics", details: "Track sign-ups and activation events." },
    ],
  },
  {
    id: "progress",
    title: "In Progress",
    cards: [
      { id: "c6", title: "Build signup flow", details: "Email and password with inline validation." },
      { id: "c7", title: "Write release notes", details: "Summarize changes for version 1.2." },
    ],
  },
  {
    id: "review",
    title: "Review",
    cards: [{ id: "c8", title: "Homepage hero copy", details: "Waiting on feedback from marketing." }],
  },
  {
    id: "done",
    title: "Done",
    cards: [
      { id: "c9", title: "Brand color palette", details: "Finalized and shared with the team." },
      { id: "c10", title: "Kickoff meeting", details: "Goals and owners agreed." },
    ],
  },
];
