import {
  ArrowRight,
  CheckCircle2,
  Droplets,
  Footprints,
  MapPin,
  ShieldCheck,
  WalletCards,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import { money } from "../lib/format";
import type { Lodge } from "../lib/types";
import Stars from "./Stars";

// Price band helper (copied from HomePage for consistency)
const priceBands = [
  {
    label: "Budget",
    background: "#ecfdf5",
    color: "#065f46",
    border: "#bbf7d0",
  },
  {
    label: "Moderate",
    background: "#eff6ff",
    color: "#1d4ed8",
    border: "#bfdbfe",
  },
  {
    label: "Premium",
    background: "#fffbeb",
    color: "#92400e",
    border: "#fde68a",
  },
  {
    label: "Luxury",
    background: "#fdf4ff",
    color: "#7e22ce",
    border: "#e9d5ff",
  },
];

function getPriceBand(rent: number) {
  if (rent <= 300000) return priceBands[0];
  if (rent <= 400000) return priceBands[1];
  if (rent <= 500000) return priceBands[2];
  return priceBands[3];
}

function PriceBadge({ rent }: { rent: number }) {
  const band = getPriceBand(rent);
  return (
    <span
      className="price-badge"
      style={{
        background: band.background,
        color: band.color,
        borderColor: band.border,
      }}
    >
      <WalletCards size={12} />
      {band.label}
    </span>
  );
}

export default function LodgeCard({ lodge }: { lodge: Lodge }) {
  return (
    <article className="lodge-card">
      <Link to={`/lodges/${lodge.id}`} className="lodge-image">
        <img src={lodge.photos[0]} alt={`${lodge.name} lodge`} />

        {/* Verified badge (like home page) */}
        <span className="lodge-verified">
          <CheckCircle2 size={12} />
          Student reviewed
        </span>

        {/* Area badge */}
        <span className="lodge-area-badge">{lodge.area}</span>
      </Link>

      <div className="lodge-body">
        <Link to={`/lodges/${lodge.id}`} className="lodge-name-link">
          <h3>{lodge.name}</h3>
        </Link>

        <p className="lodge-address">
          <MapPin size={13} />
          <span>{lodge.address}</span>
        </p>

        <p className="lodge-distance">
          <Footprints size={13} />
          <span>{lodge.distance}</span>
        </p>

        <div className="lodge-rating-row">
          <Stars rating={lodge.overallRating} compact />
          <strong>{lodge.overallRating.toFixed(1)}</strong>
        </div>

        <div className="lodge-amenities">
          <span title={lodge.waterSupply}>
            <Droplets size={12} />
            {lodge.waterSupply}
          </span>
          <span title={lodge.powerSupply}>
            <Zap size={12} />
            {lodge.powerSupply}
          </span>
          <span title={lodge.security}>
            <ShieldCheck size={12} />
            {lodge.security}
          </span>
        </div>

        <div className="lodge-footer">
          <div className="lodge-price">
            <span>Annual rent</span>
            <strong>{money(lodge.annualRent)}</strong>
          </div>

          <Link
            to={`/lodges/${lodge.id}`}
            className="lodge-view-button"
          >
            View lodge
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
}