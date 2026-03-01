import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

interface StarRatingProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onChange?: (value: number) => void;
  className?: string;
}

const sizeMap = {
  sm: "w-3.5 h-3.5",
  md: "w-5 h-5",
  lg: "w-6 h-6",
};

// Static star position identifiers — stable, never reordered
const STAR_KEYS = ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9", "s10"];

export function StarRating({
  value,
  max = 5,
  size = "md",
  interactive = false,
  onChange,
  className,
}: StarRatingProps) {
  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {STAR_KEYS.slice(0, max).map((key, i) => {
        const filled = i < Math.round(value);
        return (
          <button
            key={key}
            type="button"
            disabled={!interactive}
            onClick={() => onChange?.(i + 1)}
            className={cn(
              "transition-transform",
              interactive && "hover:scale-110 cursor-pointer",
              !interactive && "cursor-default pointer-events-none",
            )}
            aria-label={interactive ? `Rate ${i + 1} stars` : undefined}
          >
            <Star
              className={cn(
                sizeMap[size],
                filled ? "star-filled fill-current" : "star-empty",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
