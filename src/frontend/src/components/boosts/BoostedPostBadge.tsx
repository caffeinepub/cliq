interface BoostedPostBadgeProps {
  label: "Sponsored" | "Promoted";
}

export function BoostedPostBadge({ label }: BoostedPostBadgeProps) {
  return (
    <div
      data-ocid="boosted_post.badge"
      className="flex items-center gap-2 px-4 py-1.5 border-l-4 border-primary bg-primary/5 mb-3 -mx-6 -mt-6 rounded-t-xl"
    >
      <span className="text-xs">🚀</span>
      <span className="text-xs font-bold text-primary tracking-wide uppercase">
        {label}
      </span>
    </div>
  );
}
