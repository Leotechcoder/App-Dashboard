
const TONE_STYLES = {
  primary: "bg-primary/70 text-primary-foreground",
  success: "bg-green/80 text-primary-foreground",
  warning: "bg-yellow/70 text-primary-foreground",
  danger: "bg-destructive/70 text-primary-foreground",
};

const KpiCard = ({ title, value, icon: Icon, tone = "primary" }) => {
  const toneClass = TONE_STYLES[tone];

  return (
    <div className="rounded-xl border border-border bg-muted shadow-sm p-5 flex items-center gap-4">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-lg ${toneClass}`}
      >
        <Icon className="h-6 w-6" />
      </div>

      <div>
        <p className="text-sm text-muted-foreground">
          {title}
        </p>
        <p className="text-2xl font-semibold text-foreground">
          {value}
        </p>
      </div>
    </div>
  );
};

export default KpiCard;
