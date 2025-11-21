import React from "react";
import KanbanBoard from "./components/KanbanBoard/KanbanBoard";

export default function App() {
  return (
    <div className="max-w-full p-6">
      <h1 className="text-2xl font-semibold mb-4">Kanban — Humanized</h1>
      <KanbanBoard />
    </div>
  );
}
