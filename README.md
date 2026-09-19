# FocusList

> A quiet place for the next useful thing.

[![Live demo](https://img.shields.io/badge/Live%20Demo-Open%20FocusList-c87046?style=for-the-badge)](https://focuslist-lvkwqf3x.manus.space)
[![Frontend only](https://img.shields.io/badge/Architecture-Frontend--only-201f1c?style=flat-square)](https://github.com/Vishalkumaran2007/FrontendArena)
[![Built with React](https://img.shields.io/badge/Built%20with-React%2019-61dafb?style=flat-square)](https://react.dev/)

FocusList is a frontend-only daily task manager designed around the idea of a quiet working shelf. Task titles act as volume headings, while supporting checklist details appear as the inner content of each volume.

**Try the live experience:** [Open FocusList](https://focuslist-lvkwqf3x.manus.space) · [Open the Todo workspace directly](https://focuslist-lvkwqf3x.manus.space/todo)

## Contents

- [Live demo](#live-demo)
- [Experience](#experience)
- [Interactive tour](#interactive-tour)
- [Features](#features)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Project structure](#project-structure)
- [Data model](#data-model)
- [Persistence notes](#persistence-notes)
- [Design reference](#design-reference)

## Live demo

| Page | What to explore |
|---|---|
| [FocusList home](https://focuslist-lvkwqf3x.manus.space) | Editorial introduction, product principles, responsive preview, and entry points into the task workspace. |
| [Todo workspace](https://focuslist-lvkwqf3x.manus.space/todo) | Create, complete, edit, delete, search, filter, and persist daily tasks. |

The live demo stores task data in your browser. No account or sign-in is required.

## Experience

FocusList is split into two routes:

- **Home page (`/`)** — editorial introduction, product principles, responsive preview, and entry points into the task workspace.
- **Todo page (`/todo`)** — the complete task shelf with creation, completion, editing, deletion, search, filters, statistics, and persistence.

The visual system uses a literary serif display face, compact monospace metadata, warm terracotta accents, neutral paper tones, layered cards, and dense editorial spacing inspired by working-volume interfaces.

## Interactive tour

1. **Start at the shelf:** Open the [Todo workspace](https://focuslist-lvkwqf3x.manus.space/todo).
2. **Create a volume:** Enter a title such as `Grocery shopping`, choose a priority, and press **Add task**.
3. **Give it an inner page:** Starter volumes demonstrate how supporting checklist details sit beneath the main task heading.
4. **Shape the day:** Click a priority in the left rail or use the status and priority filters.
5. **Find a volume:** Search by title and watch the shelf update as you type.
6. **Move it forward:** Use the circular control to mark a task complete or active.
7. **Edit or remove it:** Use the pencil or trash controls on any task row.
8. **Refresh the page:** Tasks remain available because the app persists them in browser local storage.

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

The interface uses the supplied [ThreeUI Complete Shelf page](https://threeui.com/hero/complete-shelf-landing-page) as a visual reference for editorial composition, typography, working-volume metaphors, warm accent color, layered depth, and responsive rhythm. The project does not embed or depend on the ThreeUI source bundle.

## License

This project was created as a frontend practice and demonstration application.
