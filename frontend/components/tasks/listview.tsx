import { PRIORITY_CONFIG, STATUS_CONFIG } from "@/features/tasks/constants";
import { formatDate } from "@/lib/utils";
import type { Task } from "@/features/tasks/types";

interface ListViewProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

const GRID = "1fr 120px 100px 100px 100px 140px";

export default function ListView({ tasks, onTaskClick }: ListViewProps) {
  return (
    <div className="rounded-xl border border-border overflow-hidden">
      {/* Header */}
      <div
        className="grid border-b border-border bg-muted/30 px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground"
        style={{ gridTemplateColumns: GRID }}
      >
        <span>Title</span>
        <span>Status</span>
        <span>Priority</span>
        <span>Due Date</span>
        <span>Assignee</span>
        <span>Project</span>
      </div>

      {tasks.length === 0 ? (
        <div className="py-16 text-center text-sm text-muted-foreground">No tasks found.</div>
      ) : (
        tasks.map((task, i) => {
          const p = PRIORITY_CONFIG[task.priority];
          const s = STATUS_CONFIG[task.status];
          const P_Icon = p.Icon;
          const S_Icon = s.Icon;

          return (
            <div
              key={task.id}
              onClick={() => onTaskClick(task)}
              className={`grid cursor-pointer items-center px-4 py-3 text-sm transition-colors hover:bg-accent/40
                ${i !== tasks.length - 1 ? "border-b border-border/50" : ""}`}
              style={{ gridTemplateColumns: GRID }}
            >
              <span className="font-medium text-foreground/90 truncate pr-4">{task.title}</span>
              <span className={`flex items-center gap-1.5 text-xs font-medium ${s.color}`}>
                <S_Icon size={12} /> {s.label}
              </span>
              <span className={`flex items-center gap-1 text-xs font-semibold ${p.color}`}>
                <P_Icon size={11} /> {p.label}
              </span>
              <span className="text-xs text-muted-foreground">
                {task.dueDate ? formatDate(task.dueDate) : "—"}
              </span>
              <span className="text-xs text-muted-foreground">{task.assignee}</span>
              <span className="truncate text-xs text-muted-foreground">{task.project || "Personal"}</span>
            </div>
          );
        })
      )}
    </div>
  );
}