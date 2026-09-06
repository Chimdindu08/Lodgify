import { Grid2X2, RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import LodgeCard from "../components/LodgeCard";
import { api } from "../lib/api";
import { areas, roomTypes } from "../lib/format";
import type { LodgeList } from "../lib/types";

export default function BrowsePage() {
  const [params, setParams] = useSearchParams();
  const [data, setData] = useState<LodgeList>({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const search = params.get("search") || "";
  const area = params.get("area") || "All areas";
  const roomType = params.get("roomType") || "All types";
  const sort = params.get("sort") || "newest";

  function change(key: string, value: string) {
    const next = new URLSearchParams(params);
    if (!value || value.startsWith("All ")) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setParams(next);
  }

  useEffect(() => {
    setLoading(true);
    setError("");
    api<LodgeList>(`/lodges?${params.toString()}`)
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [params]);

  return (
    <div className="page">
      {/* Header section */}
      <section className="directory-head">
        <div className="container">
          <span className="kicker">Lodge directory</span>
          <h1>Find a place that fits student life.</h1>
          <div className="directory-search">
            <Search />
            <input
              value={search}
              onChange={(event) => change("search", event.target.value)}
              placeholder="Search by lodge name, street or area"
            />
          </div>
        </div>
      </section>

      {/* Main layout */}
      <section className="container directory-layout">
        {/* Filters panel */}
        <aside className="filter-panel">
          <div className="filter-title">
            <SlidersHorizontal size={18} />
            <strong>Filters</strong>
            <button onClick={() => setParams({})}>
              <RotateCcw size={15} />
              Reset
            </button>
          </div>

          <label>
            Area
            <select
              value={area}
              onChange={(event) => change("area", event.target.value)}
            >
              {areas.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label>
            Room type
            <select
              value={roomType}
              onChange={(event) => change("roomType", event.target.value)}
            >
              {roomTypes.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label>
            Sort results
            <select
              value={sort}
              onChange={(event) => change("sort", event.target.value)}
            >
              <option value="newest">Newest first</option>
              <option value="rating">Highest rated</option>
              <option value="rent-low">Lowest rent</option>
            </select>
          </label>
        </aside>

        {/* Results area */}
        <div className="directory-results">
          <div className="results-head">
            <div>
              <Grid2X2 size={18} />
              <strong>{data.total}</strong> lodges found
            </div>
          </div>

          {error && <div className="notice error">{error}</div>}

          {loading ? (
            <div className="page-loading">Loading lodge reviews…</div>
          ) : data.items.length ? (
            <div className="lodge-grid">
              {data.items.map((lodge) => (
                <LodgeCard key={lodge.id} lodge={lodge} />
              ))}
            </div>
          ) : (
            <div className="empty-card">
              <Search />
              <h3>No matching lodges</h3>
              <p>Try clearing a filter or use a broader search.</p>
              <button className="button secondary" onClick={() => setParams({})}>
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}