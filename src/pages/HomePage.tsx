import {
  ArrowRight,
  Camera,
  CheckCircle2,
  Droplets,
  Footprints,
  MapPin,
  PenLine,
  Search,
  ShieldCheck,
  Star,
  WalletCards,
  Zap,
} from "lucide-react";
import { type FormEvent, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Stars from "../components/Stars";
import { api } from "../lib/api";
import { areas, money } from "../lib/format";
import type { Lodge, LodgeList } from "../lib/types";

import "./HomePage.css";

const priceBands = [
  {
    label: "Budget",
    description: "Up to ₦300k/year",
    background: "#ecfdf5",
    color: "#065f46",
    border: "#bbf7d0",
  },
  {
    label: "Moderate",
    description: "₦301k–₦400k/year",
    background: "#eff6ff",
    color: "#1d4ed8",
    border: "#bfdbfe",
  },
  {
    label: "Premium",
    description: "₦401k–₦500k/year",
    background: "#fffbeb",
    color: "#92400e",
    border: "#fde68a",
  },
  {
    label: "Luxury",
    description: "Above ₦500k/year",
    background: "#fdf4ff",
    color: "#7e22ce",
    border: "#e9d5ff",
  },
];

function getPriceBand(rent: number) {
  if (rent <= 300000) {
    return priceBands[0];
  }

  if (rent <= 400000) {
    return priceBands[1];
  }

  if (rent <= 500000) {
    return priceBands[2];
  }

  return priceBands[3];
}

function PriceBadge({ rent }: { rent: number }) {
  const band = getPriceBand(rent);

  return (
    <span
      className="original-price-badge"
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

function HomeLodgeCard({ lodge }: { lodge: Lodge }) {
  return (
    <article className="original-lodge-card">
      <Link
        to={`/lodges/${lodge.id}`}
        className="original-lodge-card__image"
      >
        <img
          src={lodge.photos[0]}
          alt={`${lodge.name} lodge`}
        />

        <span className="original-lodge-card__verified">
          <CheckCircle2 size={12} />
          Student reviewed
        </span>

        <span className="original-lodge-card__area">
          {lodge.area}
        </span>
      </Link>

      <div className="original-lodge-card__body">
        <Link to={`/lodges/${lodge.id}`}>
          <h3>{lodge.name}</h3>
        </Link>

        <p className="original-lodge-card__address">
          <MapPin size={13} />
          <span>{lodge.address}</span>
        </p>

        <p className="original-lodge-card__distance">
          <Footprints size={13} />
          <span>{lodge.distance}</span>
        </p>

        <div className="original-lodge-card__rating">
          <Stars rating={lodge.overallRating} compact />

          <strong>{lodge.overallRating.toFixed(1)}</strong>
        </div>

        <div className="original-lodge-card__tags">
          <span>
            <Droplets size={12} />
            {lodge.waterSupply}
          </span>

          <span>
            <Zap size={12} />
            {lodge.powerSupply}
          </span>

          <span>
            <ShieldCheck size={12} />
            {lodge.security}
          </span>
        </div>

        <div className="original-lodge-card__footer">
          <div>
            <span>Annual rent</span>
            <strong>{money(lodge.annualRent)}</strong>
          </div>

          <Link
            to={`/lodges/${lodge.id}`}
            className="original-lodge-card__button"
          >
            View lodge
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function HomePage() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [data, setData] = useState<LodgeList>({
    items: [],
    total: 0,
  });

  useEffect(() => {
    api<LodgeList>("/lodges?sort=rating")
      .then(setData)
      .catch(() => {
        setData({
          items: [],
          total: 0,
        });
      });
  }, []);

  const topLodges = useMemo(
    () =>
      [...data.items]
        .sort(
          (first, second) =>
            second.overallRating - first.overallRating,
        )
        .slice(0, 3),
    [data.items],
  );

  const averageRating = useMemo(() => {
    if (data.items.length === 0) {
      return 0;
    }

    const totalRating = data.items.reduce(
      (total, lodge) => total + lodge.overallRating,
      0,
    );

    return totalRating / data.items.length;
  }, [data.items]);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    navigate(
      `/lodges?search=${encodeURIComponent(query.trim())}`,
    );
  }

  function browseArea(area: string) {
    navigate(`/lodges?area=${encodeURIComponent(area)}`);
  }

  return (
    <div className="original-home">
      <section className="original-home__hero">
        <div className="original-home__glow" />

        <div className="original-home__container original-home__hero-inner">
          <div className="original-home__hero-content">
            <div className="original-home__eyebrow">
              <span />
              Nnamdi Azikiwe University · Ifite, Awka
            </div>

            <h1>
              Find a lodge{" "}
              <span>you can trust</span> before you arrive.
            </h1>

            <p className="original-home__hero-description">
              Honest reviews, real photos and student ratings from
              people who have experience with lodges around NAU.
              No agents and no landlord advertisements—just useful
              student experiences.
            </p>

            <form
              className="original-home__search"
              onSubmit={handleSearch}
            >
              <Search size={20} />

              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search lodge name, street or area…"
                aria-label="Search for a lodge"
              />

              <button type="submit">
                Search
              </button>
            </form>

            <div className="original-home__areas">
              {areas.slice(1).map((area) => (
                <button
                  type="button"
                  key={area}
                  onClick={() => browseArea(area)}
                >
                  {area}
                </button>
              ))}
            </div>

            <div className="original-home__stats">
              <div>
                <strong>{data.total || "—"}</strong>
                <span>Lodges listed</span>
              </div>

              <div>
                <strong>{data.total || "—"}</strong>
                <span>Student reviews</span>
              </div>

              <div>
                <strong>
                  {averageRating
                    ? averageRating.toFixed(1)
                    : "—"}
                </strong>
                <span>Average rating</span>
              </div>
            </div>
          </div>

          <div className="original-home__preview-cards">
            {topLodges.map((lodge, index) => (
              <Link
                key={lodge.id}
                to={`/lodges/${lodge.id}`}
                className={`original-home__preview-card original-home__preview-card--${index}`}
              >
                <div className="original-home__preview-image">
                  <img
                    src={lodge.photos[0]}
                    alt={lodge.name}
                  />
                </div>

                <h3>{lodge.name}</h3>

                <p>
                  <MapPin size={11} />
                  {lodge.area}
                </p>

                <div className="original-home__preview-bottom">
                  <Stars
                    rating={lodge.overallRating}
                    compact
                  />

                  <PriceBadge rent={lodge.annualRent} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="original-home__price-legend">
        <div className="original-home__container original-home__price-inner">
          <strong>Price ranges:</strong>

          {priceBands.map((band) => (
            <span
              key={band.label}
              style={{
                background: band.background,
                color: band.color,
                borderColor: band.border,
              }}
            >
              <b>{band.label}</b>
              {band.description}
            </span>
          ))}
        </div>
      </section>

      <section className="original-home__container original-home__lodges-section">
        <div className="original-home__section-header">
          <div>
            <p>Community picks</p>
            <h2>Best-Rated Lodges Near NAU</h2>
          </div>

          <Link to="/lodges">
            View all
            <ArrowRight size={16} />
          </Link>
        </div>

        {topLodges.length > 0 ? (
          <div className="original-home__lodge-grid">
            {topLodges.map((lodge) => (
              <HomeLodgeCard
                key={lodge.id}
                lodge={lodge}
              />
            ))}
          </div>
        ) : (
          <div className="original-home__empty">
            <Search size={30} />

            <h3>No lodge reviews yet</h3>

            <p>
              Submit the first lodge review and help another
              student.
            </p>

            <Link to="/submit">
              Submit a lodge
            </Link>
          </div>
        )}
      </section>

      <section className="original-home__how">
        <div className="original-home__container">
          <div className="original-home__how-header">
            <p>How it works</p>
            <h2>Student-to-student. No middlemen.</h2>
          </div>

          <div className="original-home__steps">
            <article>
              <span>
                <Search />
              </span>

              <h3>Search Ifite</h3>

              <p>
                Browse lodge listings around NAU and filter them
                using your preferences.
              </p>
            </article>

            <article>
              <span>
                <Camera />
              </span>

              <h3>See Real Photos</h3>

              <p>
                View persistent lodge images uploaded by registered
                students.
              </p>
            </article>

            <article>
              <span>
                <Star />
              </span>

              <h3>Read Ratings</h3>

              <p>
                Compare security, water, electricity, cleanliness
                and management ratings.
              </p>
            </article>

            <article>
              <span>
                <PenLine />
              </span>

              <h3>Rate and Help</h3>

              <p>
                Register, share your experience and help another
                student make a better decision.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="original-home__cta">
        <div className="original-home__container">
          <h2>Know a lodge that is not listed yet?</h2>

          <p>
            Upload photos, rate the lodge and help the next NAU
            student decide wisely.
          </p>

          <Link to="/submit">
            Submit a lodge
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </div>
  );
}