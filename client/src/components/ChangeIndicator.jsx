import { Badge } from "@/components/ui/badge";
import { formatSignedNumber, formatSignedPercent, movementStyle } from "@/lib/format";

/**
 * Inline arrow + percentage change, coloured by whether the movement was an
 * improvement (which is not the same as "went up" — see MOVEMENT_STYLES).
 *
 * Falls back to the absolute change when a percentage is undefined, which
 * happens when the previous value was zero or could not be computed.
 */
export default function ChangeIndicator({ percent, absolute, movement, absoluteUnit = "pts" }) {
  const style = movementStyle(movement);
  const hasPercent = typeof percent === "number" && !Number.isNaN(percent);
  const hasAbsolute = typeof absolute === "number" && !Number.isNaN(absolute);

  const text = hasPercent
    ? formatSignedPercent(percent)
    : hasAbsolute
      ? `${formatSignedNumber(absolute)} ${absoluteUnit}`
      : "—";

  return (
    <Badge variant={style.variant} aria-label={`${style.label}: ${text}`}>
      <span aria-hidden="true" className="mr-1">
        {style.arrow}
      </span>
      <span className="tabular-nums">{text}</span>
    </Badge>
  );
}
