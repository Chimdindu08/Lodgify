/*export default function BrowsePage({ go }) {
  return <div style={{ padding: '60px 40px', textAlign:'center' }}>
    <h2>Browse Page — coming next</h2>
    <button onClick={() => go('home')} style={{ marginTop:16, padding:'10px 24px', background:'#1B3A6B', color:'#fff', borderRadius:10 }}>← Back Home</button>
  </div>
}*/
import { useState, useMemo } from 'react'
import { AREAS, TYPES, SORTS, PRICE_BANDS } from '../data/lodges'
import LodgeCard from '../components/LodgeCard'
import PriceBadge from '../components/PriceBadge'
import Stars from '../components/Stars'
import './BrowsePage.css'

export default function BrowsePage({ go, lodges = [] }) {
  const [q,    setQ]    = useState('')
  const [area, setArea] = useState('All Areas')
  const [type, setType] = useState('All Types')
  const [sort, setSort] = useState('Highest Rated')
  const [band, setBand] = useState(-1)   // -1 = all bands
  const [view, setView] = useState('grid')

 const list = useMemo(() => {
  return [...lodges]
      .filter(l => area === 'All Areas' || l.area === area)
      .filter(l => type === 'All Types' || l.type === type)
      .filter(l => band === -1 || l.priceBand === band)
      .filter(l => !q ||
        l.name.toLowerCase().includes(q.toLowerCase()) ||
        l.address.toLowerCase().includes(q.toLowerCase())
      )
      .sort((a, b) => {
        if (sort === 'Highest Rated') return b.rating - a.rating
        if (sort === 'Most Reviewed') return b.reviews - a.reviews
        return a.name.localeCompare(b.name)
      })
  }, [q, area, type, sort, band])

  const hasFilters = area !== 'All Areas' || type !== 'All Types' || band !== -1 || q

  const clearAll = () => {
    setArea('All Areas'); setType('All Types'); setBand(-1); setQ('')
  }

  return (
    <div className="browse">

      {/* ── Search bar ── */}
      <div className="browse__search-bar">
        <div className="container browse__search-wrap">
          <span className="browse__search-icon">🔍</span>
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search lodge name, street or area in Ifite…"
            className="browse__search-input"
          />
          {q && (
            <button className="browse__search-clear" onClick={() => setQ('')}>×</button>
          )}
        </div>
      </div>

      {/* ── Filter bar ── */}
      <div className="browse__filter-bar">
        <div className="container browse__filter-inner">
          <span className="browse__filter-label">Area:</span>
          {AREAS.map(a => (
            <button
              key={a}
              className={`browse__pill ${area === a ? 'browse__pill--active' : ''}`}
              onClick={() => setArea(a)}
            >{a}</button>
          ))}

          <div className="browse__filter-right">
            <select
              value={type}
              onChange={e => setType(e.target.value)}
              className="browse__select"
            >
              {TYPES.map(t => <option key={t}>{t}</option>)}
            </select>

            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="browse__select"
            >
              {SORTS.map(s => <option key={s}>{s}</option>)}
            </select>

            <div className="browse__view-toggle">
              <button
                className={view === 'grid' ? 'active' : ''}
                onClick={() => setView('grid')}
                title="Grid view"
              >▦</button>
              <button
                className={view === 'list' ? 'active' : ''}
                onClick={() => setView('list')}
                title="List view"
              >≡</button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Price band chips ── */}
      <div className="browse__bands">
        <div className="container browse__bands-inner">
          <span className="browse__filter-label">Price Range:</span>
          <button
            className={`browse__band-chip ${band === -1 ? 'browse__band-chip--active' : ''}`}
            onClick={() => setBand(-1)}
          >All Ranges</button>
          {PRICE_BANDS.map((b, i) => (
            <button
              key={b.label}
              className={`browse__band-chip ${band === i ? 'browse__band-chip--active' : ''}`}
              onClick={() => setBand(band === i ? -1 : i)}
            >
              {b.label} <span className="browse__band-desc">{b.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Results ── */}
      <div className="container browse__results">
        <div className="browse__results-header">
          <p>
            <strong>{list.length}</strong>
            <span className="browse__results-sub">
              {' '}lodge{list.length !== 1 ? 's' : ''} in{' '}
              {area === 'All Areas' ? 'Ifite & environs' : area}
            </span>
          </p>
          {hasFilters && (
            <button className="browse__clear-btn" onClick={clearAll}>
              ✕ Clear filters
            </button>
          )}
        </div>

        {list.length === 0 ? (
          <div className="browse__empty">
            <span>🔍</span>
            <h3>No lodges match</h3>
            <p>Try adjusting your filters or search term</p>
            <button onClick={clearAll}>Reset Filters</button>
          </div>
        ) : view === 'grid' ? (
          <div className="lodge-grid">
            {list.map(l => (
              <LodgeCard key={l.id} lodge={l} onClick={() => go('detail', l)} />
            ))}
          </div>
        ) : (
          <div className="browse__list">
            {list.map(l => (
              <div
                key={l.id}
                className="browse__list-row"
                onClick={() => go('detail', l)}
              >
                <div className="browse__list-img" style={{ background: l.bg }}>
                  {l.photos?.length > 0
                    ? <img src={l.photos[0]} alt={l.name} />
                    : l.emoji}
                </div>
                <div className="browse__list-body">
                  <div className="browse__list-top">
                    <h3 className="browse__list-name">{l.name}</h3>
                    {l.verified && (
                      <span className="browse__list-verified">✓ Verified</span>
                    )}
                  </div>
                  <p className="browse__list-addr">
                    📍 {l.address} · 🚶 {l.distance} to gate
                  </p>
                  <div className="browse__list-meta">
                    <Stars n={Math.round(l.rating)} size={12} />
                    <strong>{l.rating}</strong>
                    <span>({l.reviews})</span>
                    <PriceBadge priceBand={l.priceBand} />
                  </div>
                </div>
                <button className="browse__list-btn">View →</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}