import { X, CalendarDays, FolderKanban, User } from "lucide-react";
import { PRIORITY_CONFIG, STATUS_CONFIG } from "@/features/tasks/constants";
import { formatDate, getInitials } from "@/lib/utils";
import type { Task } from "@/features/tasks/types";

interface TaskDrawerProps {
  task: Task | null;
  onClose: () => void;
}

export default function TaskDrawer({ task, onClose }: TaskDrawerProps) {
  const p = task ? PRIORITY_CONFIG[task.priority] : null;
  const s = task ? STATUS_CONFIG[task.status] : null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-300 ${task ? "opacity-100" : "pointer-events-none opacity-0"}`}
        style={{ background: "oklch(0 0 0 / 0.4)" }}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col border-l border-border bg-card
          shadow-[−24px_0_80px_oklch(0_0_0/0.5)] transition-transform duration-300 ease-out
          ${task ? "translate-x-0" : "translate-x-full"}`}
      >
        {task && p && s && (
          <>
            <div
              className="h-[2px] w-full"
              style={{ background: "linear-gradient(90deg,transparent,oklch(0.6 0.16 262/0.7) 50%,transparent)" }}
            />

            <div className="flex items-start justify-between p-6 pb-4">
              <h2 className="flex-1 pr-4 font-display text-base font-bold leading-snug text-foreground">
                {task.title}
              </h2>
              <button
                onClick={onClose}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-transparent text-muted-foreground transition-all hover:border-destructive/30 hover:bg-destructive/10 hover:text-red-400"
              >
                <X size={15} />
              </button>
            </div>

            <div className="h-px bg-border mx-6" />

            <div className="flex flex-col gap-4 overflow-y-auto p-6">
              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Status</span>
                <span className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold ${s.color} ${s.bg}`}>
                  <s.Icon size={11} /> {s.label}
                </span>
              </div>

              {/* Priority */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Priority</span>
                <span className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold ${p.color} ${p.bg}`}>
                  <p.Icon size={11} /> {p.label}
                </span>
              </div>

              {/* Assignee */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Assignee</span>
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-[9px] font-bold text-muted-foreground">
                    {getInitials(task.assignee)}
                  </div>
                  <span className="text-sm text-foreground">{task.assignee}</span>
                </div>
              </div>

              {/* Due Date */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Due Date</span>
                <span className="flex items-center gap-1.5 text-sm text-foreground">
                  <CalendarDays size={13} className="text-muted-foreground" />
                  {task.dueDate ? formatDate(task.dueDate) : "—"}
                </span>
              </div>

              {/* Project */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Project</span>
                <span className="flex items-center gap-1.5 text-sm text-foreground">
                  {task.project
                    ? <><FolderKanban size={13} className="text-muted-foreground" />{task.project}</>
                    : <><User size={13} className="text-muted-foreground" />Personal</>}
                </span>
              </div>

              {/* Type */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Type</span>
                <span className="text-sm text-foreground capitalize">{task.type?.toLowerCase()}</span>
              </div>

              <div className="h-px bg-border" />

              {/* Description */}
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Description</p>
                <p className="rounded-xl border border-border bg-muted/20 p-3.5 text-sm leading-relaxed text-foreground/80">
                  {task.description || "No description provided."}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}