import { Star } from "lucide-react";

export default function Stars({ rating, compact = false }: { rating: number; compact?: boolean }) {
  return <span className="stars" aria-label={`${rating} out of 5 stars`}>{[1,2,3,4,5].map((value) => <Star key={value} size={compact ? 14 : 17} fill={value <= Math.round(rating) ? "currentColor" : "none"} />)}{!compact && <strong>{rating.toFixed(1)}</strong>}</span>;
}
