"use client";

import { useState, useRef, useEffect } from "react";
import {
  X, ChevronDown, Loader2,
  User, FolderKanban,
  AlertCircle, ArrowUp, Minus, ArrowDown,
  CalendarDays, Check
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

export type TaskType   = "PERSONAL" | "PROJECT";
export type TaskStatus = "TODO";
export type Priority   = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface TaskCreatePayload {
  title:       string;
  description: string;
  type:        TaskType;
  projectId:   string | null;
  priority:    Priority;
  status:      TaskStatus;
  dueDate:     string | null;
}

const MOCK_PROJECTS = [
  { id: "p1", name: "TeamPoint Frontend" },
  { id: "p2", name: "Marketing Site"     },
  { id: "p3", name: "Mobile App"         },
];

const PRIORITY_OPTIONS: {
  value: Priority;
  label: string;
  icon: React.ReactNode;
  bg: string;
  text: string;
  activeBg: string;
}[] = [
  {
    value: "URGENT", label: "Urgent",
    icon: <AlertCircle size={13} />,
    bg: "hover:bg-destructive/10", text: "text-destructive",
    activeBg: "bg-destructive/10",
  },
  {
    value: "HIGH", label: "High",
    icon: <ArrowUp size={13} />,
    bg: "hover:bg-[oklch(0.7_0.15_55/0.12)]", text: "text-[oklch(0.75_0.14_55)]",
    activeBg: "bg-[oklch(0.7_0.15_55/0.12)]",
  },
  {
    value: "MEDIUM", label: "Medium",
    icon: <Minus size={13} />,
    bg: "hover:bg-primary/10", text: "text-primary",
    activeBg: "bg-primary/10",
  },
  {
    value: "LOW", label: "Low",
    icon: <ArrowDown size={13} />,
    bg: "hover:bg-muted", text: "text-muted-foreground",
    activeBg: "bg-muted",
  },
];

function PriorityDropdown({ value, onChange }: { value: Priority; onChange: (v: Priority) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = PRIORITY_OPTIONS.find((p) => p.value === value)!;

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex w-full items-center gap-2 rounded-xl border border-border
          bg-background px-4 py-3 font-sans text-sm transition-all duration-150
          hover:border-primary/40 hover:bg-accent
          focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring
          ${selected.text}`}
      >
        {selected.icon}
        <span className="flex-1 text-left">{selected.label}</span>
        <ChevronDown size={14} className={`text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute left-0 right-0 bottom-[calc(100%+6px)] z-50 overflow-hidden
          rounded-xl border border-border bg-card
          shadow-[0_-8px_32px_oklch(0_0_0/0.4)]
          animate-in fade-in-0 slide-in-from-bottom-2 duration-150">
          {PRIORITY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`flex w-full items-center gap-3 px-4 py-3 font-sans text-sm
                transition-colors duration-100 ${opt.text} ${opt.bg}
                ${value === opt.value ? opt.activeBg : ""}`}
            >
              {opt.icon}
              <span className="flex-1 text-left">{opt.label}</span>
              {value === opt.value && <Check size={13} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function DatePickerField({ value, onChange }: { value: Date | undefined; onChange: (d: Date | undefined) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const formatted = value
    ? value.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : null;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2 rounded-xl border border-border
          bg-background px-4 py-3 font-sans text-sm transition-all duration-150
          hover:border-primary/40 hover:bg-accent
          focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        <CalendarDays size={14} className="shrink-0 text-muted-foreground" />
        <span className={`flex-1 text-left ${formatted ? "text-foreground" : "text-muted-foreground"}`}>
          {formatted ?? "Pick a date"}
        </span>
        {value && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onChange(undefined); }}
            className="rounded p-0.5 text-muted-foreground hover:text-foreground"
          >
            <X size={12} />
          </button>
        )}
      </button>

      {open && (
        <div className="absolute right-0 bottom-[calc(100%+6px)] z-50
          overflow-hidden rounded-xl border border-border bg-card
          shadow-[0_-8px_32px_oklch(0_0_0/0.4)]
          animate-in fade-in-0 slide-in-from-bottom-2 duration-150">
          <Calendar
            mode="single"
            selected={value}
            onSelect={(d: Date | undefined) => { onChange(d); setOpen(false); }}
            captionLayout="dropdown"
            className="rounded-xl"
          />
        </div>
      )}
    </div>
  );
}

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="flex items-center gap-2 font-sans text-xs font-medium text-muted-foreground">
      {children}
      {!required && (
        <span className="rounded-md bg-muted px-[6px] py-[2px] text-[10px] text-muted-foreground/50 font-normal">
          optional
        </span>
      )}
    </label>
  );
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="flex items-center gap-1 font-sans text-[11px] text-destructive">
      <AlertCircle size={10} /> {msg}
    </p>
  );
}

interface TaskCreateModalProps {
  open:      boolean;
  onClose:   () => void;
  onSubmit?: (payload: TaskCreatePayload) => Promise<void>;
}

interface FormErrors { title?: string; projectId?: string; }

export function TaskCreateModal({ open, onClose, onSubmit }: TaskCreateModalProps) {
  const [title,       setTitle]       = useState("");
  const [description, setDescription] = useState("");
  const [type,        setType]        = useState<TaskType>("PERSONAL");
  const [projectId,   setProjectId]   = useState("");
  const [priority,    setPriority]    = useState<Priority>("MEDIUM");
  const [dueDate,     setDueDate]     = useState<Date | undefined>(undefined);
  const [errors,      setErrors]      = useState<FormErrors>({});
  const [loading,     setLoading]     = useState(false);

  function validate(): boolean {
    const e: FormErrors = {};
    if (!title.trim())                    e.title     = "Title is required";
    if (type === "PROJECT" && !projectId) e.projectId = "Select a project";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function reset() {
    setTitle(""); setDescription(""); setType("PERSONAL");
    setProjectId(""); setPriority("MEDIUM"); setDueDate(undefined);
    setErrors({}); setLoading(false);
  }

  function handleClose() { reset(); onClose(); }

  async function handleSubmit() {
    if (!validate()) return;
    const payload: TaskCreatePayload = {
      title:       title.trim(),
      description: description.trim(),
      type,
      projectId:   type === "PROJECT" ? projectId : null,
      priority,
      status:      "TODO",
      dueDate:     dueDate ? dueDate.toISOString() : null,
    };
    if (onSubmit) {
      setLoading(true);
      await onSubmit(payload);
      setLoading(false);
    }
    handleClose();
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "oklch(0 0 0 / 0.65)" }}
      onMouseDown={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div className="relative w-full max-w-md rounded-2xl
        border border-border bg-card
        shadow-[0_24px_80px_oklch(0_0_0/0.6)]
        animate-in fade-in-0 zoom-in-95 duration-200">

        <div className="overflow-hidden rounded-t-2xl">
          <div className="h-[2px] w-full"
            style={{ background: "linear-gradient(90deg,transparent 0%,oklch(0.6 0.16 262/0.6) 40%,oklch(0.6 0.16 262/0.6) 60%,transparent 100%)" }} />
        </div>

        <div className="flex items-center justify-between px-6 pt-5 pb-4">
          <div>
            <h2 className="font-display text-base font-bold text-foreground">New Task</h2>
            <p className="font-sans text-xs text-muted-foreground mt-0.5">Fill in the details below</p>
          </div>

          <button
            onClick={handleClose}
            className="group flex h-8 w-8 items-center justify-center rounded-lg
              border border-transparent text-muted-foreground
              transition-all duration-150
              hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive
              focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <X size={15} strokeWidth={2} />
          </button>
        </div>

        <div className="h-px bg-border mx-6" />

        <div className="flex flex-col gap-4 px-6 py-5">

          <div className="flex flex-col gap-1.5">
            <FieldLabel required>Task title</FieldLabel>
            <input
              autoFocus
              value={title}
              onChange={(e) => { setTitle(e.target.value); if (errors.title) setErrors((p) => ({ ...p, title: undefined })); }}
              placeholder="What needs to be done?"
              className={`w-full rounded-xl border px-4 py-3 font-sans text-sm
                text-foreground placeholder:text-muted-foreground/40 outline-none bg-background
                transition-all duration-150
                ${errors.title
                  ? "border-destructive/60 shadow-[0_0_0_3px_oklch(0.62_0.2_25/0.1)]"
                  : "border-border focus:border-primary/50 focus:shadow-[0_0_0_3px_oklch(0.6_0.16_262/0.08)]"
                }`}
            />
            <FieldError msg={errors.title} />
          </div>

          <div className="flex flex-col gap-1.5">
            <FieldLabel>Description</FieldLabel>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more context…"
              rows={2}
              className="w-full resize-none rounded-xl border border-border bg-background
                px-4 py-3 font-sans text-sm text-foreground
                placeholder:text-muted-foreground/40 outline-none transition-all duration-150
                focus:border-primary/50 focus:shadow-[0_0_0_3px_oklch(0.6_0.16_262/0.08)]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <FieldLabel required>Task type</FieldLabel>
            <div className="grid grid-cols-2 gap-2">
              {([
                { value: "PERSONAL" as TaskType, label: "Personal", Icon: User        },
                { value: "PROJECT"  as TaskType, label: "Project",  Icon: FolderKanban },
              ]).map(({ value: t, label, Icon }) => (
                <button key={t} type="button"
                  onClick={() => { setType(t); setProjectId(""); setErrors((p) => ({ ...p, projectId: undefined })); }}
                  className={`flex items-center justify-center gap-2 rounded-xl border
                    px-4 py-3 font-sans text-sm transition-all duration-150
                    ${type === t
                      ? "border-primary/50 bg-primary/10 text-primary shadow-[0_0_0_1px_oklch(0.6_0.16_262/0.15)]"
                      : "border-border bg-background text-muted-foreground hover:bg-accent hover:text-foreground"
                    }`}
                >
                  <Icon size={14} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {type === "PROJECT" && (
            <div className="flex flex-col gap-1.5">
              <FieldLabel required>Project</FieldLabel>
              <div className="relative">
                <FolderKanban size={14} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <select
                  value={projectId}
                  onChange={(e) => { setProjectId(e.target.value); setErrors((p) => ({ ...p, projectId: undefined })); }}
                  className={`w-full appearance-none rounded-xl border pl-10 pr-10 py-3
                    font-sans text-sm outline-none bg-background cursor-pointer
                    transition-all duration-150
                    ${projectId ? "text-foreground" : "text-muted-foreground"}
                    ${errors.projectId ? "border-destructive/60" : "border-border"}
                    focus:border-primary/50 focus:shadow-[0_0_0_3px_oklch(0.6_0.16_262/0.08)]`}
                >
                  <option value="" disabled>Select a project…</option>
                  {MOCK_PROJECTS.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              </div>
              <FieldError msg={errors.projectId} />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <FieldLabel required>Priority</FieldLabel>
              <PriorityDropdown value={priority} onChange={setPriority} />
            </div>
            <div className="flex flex-col gap-1.5">
              <FieldLabel>Due date</FieldLabel>
              <DatePickerField value={dueDate} onChange={setDueDate} />
            </div>
          </div>

          <div className="flex items-center gap-2.5 rounded-xl border border-border bg-muted/30 px-4 py-3">
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted">
              <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
            </div>
            <span className="font-sans text-xs text-muted-foreground">
              Status defaults to <span className="font-semibold text-foreground">To Do</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 border-t border-border px-6 py-4">
          <button onClick={handleClose}
            className="flex-1 rounded-xl border border-border bg-background
              px-4 py-2.5 font-sans text-sm text-muted-foreground
              transition-all duration-150 hover:bg-accent hover:text-foreground
              focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={loading}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl
              bg-primary px-4 py-2.5 font-sans text-sm font-medium text-primary-foreground
              shadow-[0_2px_12px_oklch(0.6_0.16_262/0.3)]
              transition-all duration-150
              hover:-translate-y-px hover:shadow-[0_4px_20px_oklch(0.6_0.16_262/0.45)]
              active:translate-y-0 active:scale-[0.99]
              disabled:cursor-not-allowed disabled:opacity-50
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            {loading && <Loader2 size={14} className="animate-spin" />}
            Create Task
          </button>
        </div>
      </div>
    </div>
  );
}