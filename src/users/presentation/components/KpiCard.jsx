"use client";

import { cn } from "@/lib/utils";

const TONE_STYLES = {
  primary: {
    bg: "hsl(var(--primary)/0.7)",
    fg: "hsl(var(--primary-foreground))",
  },
  success: {
    bg: "hsl(var(--green)/0.8)",
    fg: "hsl(var(--primary-foreground))",
  },
  warning: {
    bg: "hsl(var(--yellow)/0.7)",
    fg: "hsl(var(--primary-foreground))",
  },
  danger: {
    bg: "hsl(var(--destructive)/0.7)",
    fg: "hsl(var(--primary-foreground))",
  },
};

const KpiCard = ({ title, value, icon: Icon, tone = "primary" }) => {
  const styles = TONE_STYLES[tone];

  return (
    <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))] shadow-sm p-5 flex items-center gap-4">
      <div
        className="flex h-12 w-12 items-center justify-center rounded-lg"
        style={{ backgroundColor: styles.bg, color: styles.fg }}
      >
        <Icon className="h-6 w-6" />
      </div>

      <div>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">
          {title}
        </p>
        <p className="text-2xl font-semibold text-[hsl(var(--foreground))]">
          {value}
        </p>
      </div>
    </div>
  );
};

export default KpiCard;
