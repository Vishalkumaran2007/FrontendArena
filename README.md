# FocusList

FocusList is a frontend-only daily task manager designed around the idea of a quiet working shelf. Task titles act as volume headings, while supporting checklist details appear as the inner content of each volume.

The project is built with React, TypeScript, Vite, and Tailwind CSS. It uses browser local storage for persistence and does not require a backend, account, external database, or API.

## Experience

FocusList is split into two routes:

- **Home page (`/`)** — editorial introduction, product principles, responsive preview, and entry points into the task workspace.
- **Todo page (`/todo`)** — the complete task shelf with creation, completion, editing, deletion, search, filters, statistics, and persistence.

The visual system uses a literary serif display face, compact monospace metadata, warm terracotta accents, neutral paper tones, layered cards, and dense editorial spacing inspired by working-volume interfaces.

## Features

- Create tasks with a title and High, Medium, or Low priority.
- Mark tasks as completed or active.
- Edit task titles and priority inline.
- Delete tasks with confirmation.
- Search tasks by title as you type.
- Filter by All, Active, or Completed.
- Filter by High, Medium, or Low priority.
- View live Total, Pending, and Completed statistics.
- Persist task data in `localStorage` across page refreshes.
- Show book-style task headings with supporting inner checklist content.
- Use the interface responsively on desktop and mobile widths.
- Navigate with semantic controls and visible keyboard focus states.

## Tech stack

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- Wouter for client-side routing
- Lucide React for icons
- Browser `localStorage` for persistence

## Getting started

### Requirements

- Node.js 20 or newer
- pnpm 10 or newer

### Install dependencies

```bash
pnpm install
```

### Start the development server

```bash
pnpm dev
```

The development server will be available at the local Vite URL printed in the terminal.

### Run checks

```bash
pnpm check
pnpm build
```

## Project structure

```text
client/
  src/
    pages/
      Home.tsx       # Editorial home page
      Todo.tsx       # Task workspace
    App.tsx          # Routes and app shell
    index.css        # Global tokens, responsive layout, and visual system
server/
  index.ts           # Static serving compatibility entry point
README.md
```

## Data model

Tasks are stored under the versioned local-storage key `focuslist.tasks.v1`.

```ts
type Task = {
  id: string;
  title: string;
  details?: string[];
  priority: "high" | "medium" | "low";
  completed: boolean;
  createdAt: number;
  updatedAt?: number;
};
```

The app derives filtered results and statistics from the complete task collection rather than maintaining separate mutable counters.

## Persistence notes

Data is stored locally in the current browser and origin. It is not synchronized across devices or browsers. If stored data is malformed, FocusList safely falls back to its starter volumes.

## Design reference

The interface uses the supplied ThreeUI Complete Shelf page as a visual reference for editorial composition, typography, working-volume metaphors, warm accent color, layered depth, and responsive rhythm. The project does not embed or depend on the ThreeUI source bundle.

## License

This project was created as a frontend practice and demonstration application.
