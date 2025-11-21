# Kanban Assignment — Humanized Solution

This is a humanized, internship-friendly implementation of the Kanban assignment.
It includes a minimal React + Vite + TypeScript + Tailwind setup, Storybook, and
a small, readable Kanban component with basic drag & drop, add and delete.

## Local setup

1. Install dependencies
```bash
npm install
```

2. Start dev server
```bash
npm run dev
```

3. Open app
http://localhost:5173

4. Run Storybook
```bash
npm run storybook
```

## What is included
- `src/components/KanbanBoard` - humanized component
- `src/types` - TypeScript types
- `src/utils` - helper utilities
- Storybook starter config and stories
- Tailwind config and PostCSS setup
- Local copy of assignment PDF included: /mnt/data/ASSIGNMENT - Kanban View.pdf (for reference)

## Notes for submission
- Ensure Node 22.x or 20.19.x is used (Node 21 may break Vite)
- Make 5+ meaningful commits demonstrating progress
- Run accessibility checks (keyboard navigation, ARIA) before submitting
