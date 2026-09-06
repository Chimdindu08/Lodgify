import { ArrowLeft, CalendarDays, Droplets, MapPin, ShieldCheck, UserRound, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Stars from "../components/Stars";
import { api } from "../lib/api";
import { date, initials, money } from "../lib/format";
import type { Lodge } from "../lib/types";

const ratingLabels: Record<string, string> = {
  security: "Security",
  water: "Water",
  electricity: "Electricity",
  cleanliness: "Cleanliness",
  management: "Management",
  value: "Value for money",
};

export default function DetailPage() {
  const { id } = useParams();
  const [lodge, setLodge] = useState<Lodge | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api<Lodge>(`/lodges/${id}`)
      .then(setLodge)
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) {
    return (
      <div className="page container">
        <div className="empty-card">
          <h2>{error}</h2>
          <Link to="/lodges" className="button secondary">
            Back to lodges
          </Link>
        </div>
      </div>
    );
  }

  if (!lodge) {
    return <div className="page-loading">Loading lodge details…</div>;
  }

  const photos = lodge.photos || [];

  return (
    <div className="page">
      <div className="container detail-page">
        <Link to="/lodges" className="back-link">
          <ArrowLeft size={17} /> Back to directory
        </Link>

        {/* Gallery – handles 1, 2, or 3+ photos */}
        {photos.length === 0 ? (
          <div className="detail-gallery-single detail-gallery-placeholder">
            <div>No photos available</div>
          </div>
        ) : photos.length === 1 ? (
          <div className="detail-gallery-single">
            <img src={photos[0]} alt={`${lodge.name} exterior`} />
          </div>
        ) : (
          <div className="detail-gallery">
            <img src={photos[0]} alt={`${lodge.name} exterior`} />
            {photos.slice(1, 3).map((photo) => (
              <img key={photo} src={photo} alt={`${lodge.name} additional view`} />
            ))}
          </div>
        )}

        <section className="detail-main">
          <div className="detail-content">
            <span className="kicker">{lodge.area}</span>
            <h1>{lodge.name}</h1>
            <p className="address">
              <MapPin size={17} /> {lodge.address} · {lodge.distance}
            </p>
            <Stars rating={lodge.overallRating} />

            <div className="detail-facts">
              <article>
                <Droplets />
                <span>Water supply</span>
                <strong>{lodge.waterSupply}</strong>
              </article>
              <article>
                <Zap />
                <span>Power supply</span>
                <strong>{lodge.powerSupply}</strong>
              </article>
              <article>
                <ShieldCheck />
                <span>Security</span>
                <strong>{lodge.security}</strong>
              </article>
            </div>

            <article className="review-card">
              <div className="review-head">
                <span className="avatar">{initials(lodge.author.name)}</span>
                <div>
                  <strong>{lodge.author.name}</strong>
                  <span>
                    <UserRound size={14} /> {lodge.author.level}
                  </span>
                </div>
                <span className="review-date">
                  <CalendarDays size={14} /> {date(lodge.createdAt)}
                </span>
              </div>
              <p>{lodge.reviewText}</p>
              <div className="rating-breakdown">
                {Object.entries(lodge.ratings).map(([key, value]) => (
                  <div key={key}>
                    <span>{ratingLabels[key]}</span>
                    <div>
                      <i style={{ width: `${value * 20}%` }} />
                    </div>
                    <strong>{value}/5</strong>
                  </div>
                ))}
              </div>
            </article>
          </div>

          <aside className="detail-summary">
            <span>Approximate annual rent</span>
            <strong>{money(lodge.annualRent)}</strong>
            <dl>
              <div>
                <dt>Room type</dt>
                <dd>{lodge.roomType}</dd>
              </div>
              <div>
                <dt>Academic session</dt>
                <dd>{lodge.academicSession}</dd>
              </div>
              <div>
                <dt>Overall rating</dt>
                <dd>{lodge.overallRating}/5</dd>
              </div>
            </dl>
            <Link to="/submit" className="button primary full">
              Share another lodge
            </Link>
            <p>
              Confirm the current rent and availability directly before making payment.
            </p>
          </aside>
        </section>
      </div>
    </div>
  );
}