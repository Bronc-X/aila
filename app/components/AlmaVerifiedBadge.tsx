import Image from "next/image";

type AlmaVerifiedBadgeProps = {
  className?: string;
  compact?: boolean;
  dark?: boolean;
};

export default function AlmaVerifiedBadge({ className, compact = false, dark = false }: AlmaVerifiedBadgeProps) {
  return (
    <a
      href="https://github.com/yetone/alma-releases/issues/56"
      target="_blank"
      rel="noopener noreferrer"
      className={[
        "alma-verified-badge",
        compact ? "alma-verified-badge--compact" : "",
        dark ? "alma-verified-badge--dark" : "",
        className ?? "",
      ].filter(Boolean).join(" ")}
      aria-label="Open Toni Alma verification badge"
    >
      <Image
        src="/alma-verified-pill-badge.png"
        alt="Toni verified on Alma"
        width={2172}
        height={724}
        {...(compact ? { loading: "eager" as const } : { preload: true })}
        sizes={compact ? "(max-width: 640px) 72vw, 260px" : "(max-width: 640px) 88vw, 430px"}
      />
    </a>
  );
}
