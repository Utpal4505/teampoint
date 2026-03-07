import { ArrowRight, Zap } from "lucide-react";
import Link from "next/link";

type ActionType = "completed" | "created" | "joined" | "updated" | "commented";

interface ActivityItem {
  id: string;
  user: string;
  action: ActionType;
  target?: string;
  time: string;
}

const MOCK: ActivityItem[] = [
  { id: "1", user: "Rahul",  action: "completed", target: "Landing Page redesign", time: "2m ago"  },
  { id: "2", user: "Aman",   action: "created",   target: "Fix API bug",           time: "14m ago" },
  { id: "3", user: "Neha",   action: "joined",    target: undefined,               time: "1h ago"  },
  { id: "4", user: "Priya",  action: "commented", target: "Q3 Roadmap",            time: "2h ago"  },
  { id: "5", user: "Vikram", action: "updated",   target: "Sprint goals",          time: "3h ago"  },
];

const ACTION: Record<ActionType, { verb: string; color: string }> = {
  completed: { verb: "completed",    color: "text-[oklch(0.62_0.14_145)]" },
  created:   { verb: "created",      color: "text-primary"                },
  joined:    { verb: "joined",       color: "text-[oklch(0.68_0.13_85)]"  },
  updated:   { verb: "updated",      color: "text-[oklch(0.62_0.1_300)]"  },
  commented: { verb: "commented on", color: "text-[oklch(0.6_0.1_220)]"   },
};

// Each user gets a distinct tinted avatar
const AVATAR_COLORS = [
  "bg-primary/15 text-primary",
  "bg-[oklch(0.52_0.15_145/0.15)] text-[oklch(0.58_0.14_145)]",
  "bg-[oklch(0.7_0.15_55/0.15)] text-[oklch(0.7_0.13_55)]",
  "bg-destructive/15 text-destructive",
  "bg-[oklch(0.62_0.1_300/0.15)] text-[oklch(0.65_0.1_300)]",
];

export function TeamActivityCard() {
  return (
    <div className="flex flex-col rounded-xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-5 pt-5 pb-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[oklch(0.52_0.15_145/0.1)]">
          <Zap size={13} className="text-[oklch(0.58_0.14_145)]" />
        </div>
        <h2 className="font-display text-sm font-bold text-foreground">Team Activity</h2>
      </div>

      {/* Feed */}
      <div className="flex flex-col px-5 pb-2">
        {MOCK.slice(0, 5).map((item, i) => {
          const cfg = ACTION[item.action];
          const avatarColor = AVATAR_COLORS[i % AVATAR_COLORS.length];
          return (
            <div key={item.id}
              className="flex items-start gap-3 py-[9px] border-b border-border/50 last:border-0">
              <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full
                font-sans text-[11px] font-medium ${avatarColor}`}>
                {item.user[0]}
              </div>
              <div className="flex flex-1 flex-col gap-[2px] pt-[1px] min-w-0">
                <p className="font-sans text-xs leading-snug text-muted-foreground">
                  <span className="font-medium text-foreground">{item.user}</span>
                  {" "}<span className={cfg.color}>{cfg.verb}</span>
                  {item.target && <span className="text-muted-foreground"> &quot;{item.target}&quot;</span>}
                </p>
                <span className="font-sans text-[10px] text-muted-foreground/60">{item.time}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="border-t border-border px-5 py-3">
        <Link href="/dashboard/activity"
          className="flex items-center gap-2 font-sans text-xs
            text-muted-foreground transition-colors duration-150 hover:text-foreground">
          View all activity <ArrowRight size={11} />
        </Link>
      </div>
    </div>
  );
}