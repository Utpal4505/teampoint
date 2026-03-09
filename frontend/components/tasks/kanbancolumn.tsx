'use client'

import { useState } from "react";
import { Plus } from "lucide-react";
import { COLUMN_STYLES } from "@/features/tasks/constants";
import TaskCard from "./taskcard";
import type { Task, Status } from "@/features/tasks/types";

interface KanbanColumnProps {
  status: Status;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onAddTask: (status: Status) => void;
}

export default function KanbanColumn({ status, tasks, onTaskClick, onAddTask }: KanbanColumnProps) {
  const cfg = COLUMN_STYLES[status];
  const [dragOver, setDragOver] = useState<boolean>(false);

  return (
    <div
      className={`flex flex-col rounded-2xl border ${cfg.border} transition-all duration-200 ${dragOver ? "scale-[1.01]" : ""}`}
      style={{ background: `linear-gradient(180deg, ${cfg.glow} 0%, transparent 40%)`, minHeight: 480 }}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={() => setDragOver(false)}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-border/50">
        <span className={`text-xs font-bold uppercase tracking-widest ${cfg.accent}`}>{cfg.label}</span>
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-muted px-1.5 text-[10px] font-semibold text-muted-foreground">
          {tasks.length}
        </span>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-2.5 overflow-y-auto p-3" style={{ flex: 1 }}>
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} onClick={onTaskClick} />
        ))}
      </div>

      {/* Add Task */}
      <div className="p-3 pt-0">
        <button
          onClick={() => onAddTask(status)}
          className="flex w-full items-center gap-2 rounded-xl border border-dashed border-border/50 px-3 py-2.5 text-xs text-muted-foreground/50 transition-all hover:border-border hover:text-muted-foreground hover:bg-accent/30"
        >
          <Plus size={13} /> Add Task
        </button>
      </div>
    </div>
  );
}