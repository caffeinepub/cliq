interface BoostReasonLabelProps {
  reason: string;
}

export function BoostReasonLabel({ reason }: BoostReasonLabelProps) {
  return (
    <p
      data-ocid="boosted_post.reason_label"
      className="text-xs italic text-muted-foreground leading-none"
    >
      🌍 {reason}
    </p>
  );
}
