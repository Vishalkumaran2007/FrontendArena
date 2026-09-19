import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleCheck,
  Clock3,
  Command,
  Inbox,
  ListFilter,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Sparkles,
  Target,
  Trash2,
  X,
} from "lucide-react";
import { Link } from "wouter";

type Priority = "high" | "medium" | "low";
type StatusFilter = "all" | "active" | "completed";
type PriorityFilter = "all" | Priority;

type Task = {
  id: string;
  title: string;
  details?: string[];
  priority: Priority;
  completed: boolean;
  createdAt: number;
  updatedAt?: number;
};

const STORAGE_KEY = "focuslist.tasks.v1";

const starterTasks: Task[] = [
  {
    id: "starter-1",
    title: "Grocery shopping",
    details: ["Pick up seasonal fruit", "Restock pantry staples", "Choose something for Sunday breakfast"],
    priority: "high",
    completed: false,
    createdAt: Date.now() - 1000 * 60 * 45,
  },
  {
    id: "starter-2",
    title: "Finish the Q3 presentation",
    details: ["Tighten the opening slide", "Add the final metrics", "Export a review copy"],
    priority: "medium",
    completed: false,
    createdAt: Date.now() - 1000 * 60 * 90,
  },
  {
    id: "starter-3",
    title: "Make space for a walk",
    details: ["Block thirty minutes", "Leave the phone behind"],
    priority: "low",
    completed: true,
    createdAt: Date.now() - 1000 * 60 * 130,
  },
  {
    id: "starter-4",
    title: "Book Friday's planning session",
    details: ["Add a short agenda", "Invite the team"],
    priority: "medium",
    completed: false,
    createdAt: Date.now() - 1000 * 60 * 180,
  },
];

const priorityMeta: Record<Priority, { label: string; note: string }> = {
  high: { label: "High", note: "Protect the focus" },
  medium: { label: "Medium", note: "Move it forward" },
  low: { label: "Low", note: "Make room later" },
};

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `task-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function readTasks(): Task[] {
  if (typeof window === "undefined") return starterTasks;

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return starterTasks;
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return starterTasks;

    return parsed.filter((task): task is Task => {
      return (
        task &&
        typeof task.id === "string" &&
        typeof task.title === "string" &&
        typeof task.completed === "boolean" &&
        ["high", "medium", "low"].includes(task.priority) &&
        typeof task.createdAt === "number"
      );
    });
  } catch {
    return starterTasks;
  }
}

function formatAdded(timestamp: number) {
  const minutes = Math.max(1, Math.round((Date.now() - timestamp) / 60000));
  if (minutes < 60) return `Added ${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `Added ${hours}h ago`;
  return `Added ${Math.round(hours / 24)}d ago`;
}

function formatToday() {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>(readTasks);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all");
  const [formError, setFormError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingPriority, setEditingPriority] = useState<Priority>("medium");

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const stats = useMemo(() => {
    const completed = tasks.filter((task) => task.completed).length;
    return {
      total: tasks.length,
      completed,
      pending: tasks.length - completed,
      completionRate: tasks.length ? Math.round((completed / tasks.length) * 100) : 0,
    };
  }, [tasks]);

  const visibleTasks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return tasks
      .filter((task) => {
        const matchesQuery = !normalizedQuery || task.title.toLowerCase().includes(normalizedQuery);
        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "completed" && task.completed) ||
          (statusFilter === "active" && !task.completed);
        const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
        return matchesQuery && matchesStatus && matchesPriority;
      })
      .sort((a, b) => {
        if (a.completed !== b.completed) return Number(a.completed) - Number(b.completed);
        return b.createdAt - a.createdAt;
      });
  }, [priorityFilter, query, statusFilter, tasks]);

  const priorityCounts = useMemo(
    () =>
      (Object.keys(priorityMeta) as Priority[]).map((key) => ({
        key,
        count: tasks.filter((task) => task.priority === key).length,
      })),
    [tasks],
  );

  function addTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) {
      setFormError("Give this task a title before adding it to the shelf.");
      return;
    }

    setTasks((current) => [
      {
        id: createId(),
        title: cleanTitle,
        details: ["Add the supporting details inside this volume"],
        priority,
        completed: false,
        createdAt: Date.now(),
      },
      ...current,
    ]);
    setTitle("");
    setFormError("");
  }

  function toggleTask(id: string) {
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, completed: !task.completed, updatedAt: Date.now() } : task,
      ),
    );
  }

  function beginEdit(task: Task) {
    setEditingId(task.id);
    setEditingTitle(task.title);
    setEditingPriority(task.priority);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditingTitle("");
  }

  function saveEdit(id: string) {
    const cleanTitle = editingTitle.trim();
    if (!cleanTitle) return;

    setTasks((current) =>
      current.map((task) =>
        task.id === id
          ? { ...task, title: cleanTitle, priority: editingPriority, updatedAt: Date.now() }
          : task,
      ),
    );
    cancelEdit();
  }

  function deleteTask(id: string) {
    const task = tasks.find((item) => item.id === id);
    if (!task) return;
    const confirmed = window.confirm(`Remove “${task.title}” from your focus list?`);
    if (confirmed) setTasks((current) => current.filter((item) => item.id !== id));
  }

  function clearFilters() {
    setQuery("");
    setStatusFilter("all");
    setPriorityFilter("all");
  }

  const hasFilters = Boolean(query || statusFilter !== "all" || priorityFilter !== "all");

  return (
    <main className="app-shell">
      <div className="paper-grain" aria-hidden="true" />
      <header className="topbar page-width">
        <Link className="brand" href="/" aria-label="FocusList home">
          <span className="brand-mark"><span /></span>
          <span className="brand-name">FocusList</span>
          <span className="brand-dot" aria-hidden="true">/</span>
          <span className="brand-tagline">daily volumes</span>
        </Link>
        <div className="topbar-meta">
          <span className="local-pill"><span className="status-dot" /> saved locally</span>
          <button className="icon-button subtle" type="button" title="Keyboard shortcuts" aria-label="Keyboard shortcuts">
            <Command size={16} strokeWidth={1.8} />
          </button>
        </div>
      </header>

      <section className="hero page-width" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><Sparkles size={14} /> A clearer place for today's work</p>
          <h1>Clear the shelf.<br /><em>Keep the signal.</em></h1>
          <p className="hero-description">
            A small, steady workspace for the tasks that deserve your attention. Capture the next thing, give it a weight, and keep moving.
          </p>
          <div className="hero-footnote">
            <CalendarDays size={15} />
            <span>{formatToday()}</span>
            <span className="footnote-rule" />
            <span className="muted-copy">one day at a time</span>
          </div>
        </div>
        <div className="focus-card">
          <div className="focus-card-topline">
            <span>Today's rhythm</span>
            <Target size={16} />
          </div>
          <div className="focus-card-main">
            <div className="progress-ring" style={{ background: `conic-gradient(var(--terracotta) ${stats.completionRate * 3.6}deg, var(--sand-deep) 0deg)` }}>
              <div className="progress-ring-inner">
                <strong>{stats.completionRate}%</strong>
                <span>complete</span>
              </div>
            </div>
            <div className="focus-card-copy">
              <p className="focus-kicker">Keep the pace</p>
              <h2>{stats.pending === 0 && stats.total > 0 ? "Shelf cleared." : `${stats.pending} ${stats.pending === 1 ? "task" : "tasks"} still in play.`}</h2>
              <p>{stats.total ? "Small progress still counts. Choose the next useful thing." : "Add your first task and make a little room for momentum."}</p>
            </div>
          </div>
          <div className="focus-card-footer">
            <span><CircleCheck size={14} /> {stats.completed} finished</span>
            <span>{stats.total} total volumes</span>
          </div>
        </div>
      </section>

      <section className="stats-grid page-width" aria-label="Task statistics">
        <article className="stat-card stat-card-highlight">
          <div className="stat-label"><Inbox size={15} /> Total tasks</div>
          <div className="stat-value">{stats.total.toString().padStart(2, "0")}</div>
          <p>Everything on the shelf</p>
        </article>
        <article className="stat-card">
          <div className="stat-label"><Clock3 size={15} /> Pending</div>
          <div className="stat-value">{stats.pending.toString().padStart(2, "0")}</div>
          <p>Still asking for attention</p>
        </article>
        <article className="stat-card">
          <div className="stat-label"><CheckCircle2 size={15} /> Completed</div>
          <div className="stat-value">{stats.completed.toString().padStart(2, "0")}</div>
          <p>Already moved forward</p>
        </article>
      </section>

      <section className="workspace page-width">
        <aside className="priority-rail">
          <div className="rail-heading">
            <span className="section-kicker">01 / The weights</span>
            <SlidersHorizontal size={15} />
          </div>
          <h2>Give the day<br /><em>a shape.</em></h2>
          <p className="rail-intro">A useful priority is a promise to your future self. Keep it visible, keep it kind.</p>
          <div className="priority-breakdown" aria-label="Tasks by priority">
            {priorityCounts.map(({ key, count }) => (
              <button
                type="button"
                className={`breakdown-row ${priorityFilter === key ? "selected" : ""}`}
                key={key}
                onClick={() => setPriorityFilter(priorityFilter === key ? "all" : key)}
              >
                <span className={`priority-marker ${key}`} />
                <span className="breakdown-label">{priorityMeta[key].label}</span>
                <span className="breakdown-bar"><span style={{ width: `${stats.total ? (count / stats.total) * 100 : 0}%` }} /></span>
                <span className="breakdown-count">{count.toString().padStart(2, "0")}</span>
              </button>
            ))}
          </div>
          <div className="rail-note">
            <ArrowUpRight size={17} />
            <span>Tap a priority to focus the shelf.</span>
          </div>
        </aside>

        <div className="task-workspace">
          <div className="section-header">
            <div>
              <span className="section-kicker">02 / The shelf</span>
              <h2>Today's tasks <span>({visibleTasks.length})</span></h2>
            </div>
            <div className="section-header-note"><ListFilter size={15} /> {hasFilters ? "Filtered view" : "All volumes"}</div>
          </div>

          <form className="composer" onSubmit={addTask}>
            <div className="composer-input-wrap">
              <label className="sr-only" htmlFor="new-task">Add a new task</label>
              <Plus className="composer-plus" size={19} />
              <input
                id="new-task"
                value={title}
                onChange={(event) => {
                  setTitle(event.target.value);
                  if (formError) setFormError("");
                }}
                placeholder="What needs your attention?"
                maxLength={200}
                aria-describedby={formError ? "task-error" : undefined}
              />
              <span className="character-count">{title.length}/200</span>
            </div>
            <div className="composer-actions">
              <label className="select-wrap">
                <span className={`priority-marker ${priority}`} />
                <span className="sr-only">Priority</span>
                <select value={priority} onChange={(event) => setPriority(event.target.value as Priority)}>
                  {(Object.keys(priorityMeta) as Priority[]).map((key) => <option key={key} value={key}>{priorityMeta[key].label}</option>)}
                </select>
                <ChevronDown size={14} />
              </label>
              <button className="add-button" type="submit"><span>Add task</span><ArrowUpRight size={16} /></button>
            </div>
          </form>
          {formError && <p className="form-error" id="task-error" role="alert">{formError}</p>}

          <div className="controls-row">
            <div className="search-wrap">
              <Search size={17} />
              <label className="sr-only" htmlFor="task-search">Search tasks</label>
              <input id="task-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the shelf" />
              {query && <button type="button" className="clear-search" onClick={() => setQuery("")} aria-label="Clear search"><X size={14} /></button>}
            </div>
            <div className="filter-tabs" aria-label="Filter tasks by status">
              {(["all", "active", "completed"] as StatusFilter[]).map((filter) => (
                <button key={filter} type="button" className={statusFilter === filter ? "active" : ""} onClick={() => setStatusFilter(filter)}>
                  {filter === "all" ? "All" : filter === "active" ? "Active" : "Completed"}
                </button>
              ))}
            </div>
            <label className="priority-filter-wrap">
              <span className="sr-only">Filter by priority</span>
              <select value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value as PriorityFilter)}>
                <option value="all">Every priority</option>
                {(Object.keys(priorityMeta) as Priority[]).map((key) => <option key={key} value={key}>{priorityMeta[key].label} priority</option>)}
              </select>
              <ChevronDown size={14} />
            </label>
          </div>

          <div className="task-list" aria-live="polite">
            {visibleTasks.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon"><RotateCcw size={21} /></div>
                <h3>{hasFilters ? "Nothing on this shelf." : "The shelf is waiting."}</h3>
                <p>{hasFilters ? "Try clearing a filter or searching for something else." : "Add your first task above and give the day a useful next step."}</p>
                {hasFilters && <button className="text-button" type="button" onClick={clearFilters}>Clear filters <ArrowUpRight size={15} /></button>}
              </div>
            ) : (
              visibleTasks.map((task, index) => (
                <article className={`task-card ${task.completed ? "completed" : ""}`} key={task.id}>
                  <div className="task-index">{String(index + 1).padStart(2, "0")}</div>
                  <button
                    className="task-check"
                    type="button"
                    aria-label={task.completed ? `Mark ${task.title} as active` : `Mark ${task.title} as completed`}
                    aria-pressed={task.completed}
                    onClick={() => toggleTask(task.id)}
                  >
                    {task.completed && <Check size={15} strokeWidth={2.5} />}
                  </button>
                  {editingId === task.id ? (
                    <div className="edit-fields">
                      <input aria-label="Edit task title" value={editingTitle} autoFocus onChange={(event) => setEditingTitle(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") saveEdit(task.id); if (event.key === "Escape") cancelEdit(); }} />
                      <div className="edit-meta">
                        <label className="edit-select-wrap"><span className={`priority-marker ${editingPriority}`} /><span className="sr-only">Edit priority</span><select value={editingPriority} onChange={(event) => setEditingPriority(event.target.value as Priority)}>{(Object.keys(priorityMeta) as Priority[]).map((key) => <option key={key} value={key}>{priorityMeta[key].label}</option>)}</select><ChevronDown size={13} /></label>
                        <button className="save-edit" type="button" onClick={() => saveEdit(task.id)}><Check size={14} /> Save</button>
                        <button className="cancel-edit" type="button" onClick={cancelEdit}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div className="task-content">
                      <div className="task-title-row"><h3>{task.title}</h3><span className={`priority-badge ${task.priority}`}><span className={`priority-marker ${task.priority}`} />{priorityMeta[task.priority].label}</span></div>
                      {task.details && task.details.length > 0 && (
                        <div className="task-body" aria-label={`Inside ${task.title}`}>
                          <span className="task-body-label">inside the volume</span>
                          {task.details.map((detail, detailIndex) => (
                            <span className="task-body-item" key={`${task.id}-detail-${detailIndex}`}>
                              <span className="body-check" aria-hidden="true">{task.completed && <Check size={9} />}</span>
                              <span>{detail}</span>
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="task-meta"><span>{formatAdded(task.createdAt)}</span><span className="meta-divider" /> <span>{task.completed ? "Closed volume" : priorityMeta[task.priority].note}</span></div>
                    </div>
                  )}
                  {editingId !== task.id && (
                    <div className="task-actions">
                      <button className="task-action" type="button" onClick={() => beginEdit(task)} aria-label={`Edit ${task.title}`} title="Edit task"><Pencil size={15} /></button>
                      <button className="task-action delete" type="button" onClick={() => deleteTask(task.id)} aria-label={`Delete ${task.title}`} title="Delete task"><Trash2 size={15} /></button>
                    </div>
                  )}
                </article>
              ))
            )}
          </div>
          <div className="list-footer"><span>{stats.pending} pending <span className="footer-divider">/</span> {stats.completed} completed</span><span className="saved-note"><span className="status-dot" /> auto-saved in your browser</span></div>
        </div>
      </section>

      <footer className="footer page-width"><span>FocusList is a quiet place to begin.</span><span>Made for the next useful thing.</span></footer>
    </main>
  );
}
