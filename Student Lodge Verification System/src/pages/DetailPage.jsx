/*export default function DetailPage({ go, lodge }) {
  return <div style={{ padding: '60px 40px', textAlign:'center' }}>
    <h2>{lodge?.name || 'Lodge Detail'}</h2>
    <button onClick={() => go('browse')} style={{ marginTop:16, padding:'10px 24px', background:'#1B3A6B', color:'#fff', borderRadius:10 }}>← Back to Browse</button>
  </div>
}*/
import { useState, useEffect, useRef } from 'react'
import { LODGES, getBand } from '../data/lodges'
import Stars from '../components/Stars'
import PriceBadge from '../components/PriceBadge'
import './DetailPage.css'

const CRIT_ICONS = {
  Security: '🔒', Water: '💧', Electricity: '⚡',
  Cleanliness: '🧹', Landlord: '👩‍💼', Value: '💰'
}

export default function DetailPage({ lodge, go, showToast }) {
  const l    = lodge || LODGES[0]
  const band = getBand(l.priceBand)

  const [tab,          setTab]          = useState('overview')
  const [showForm,     setShowForm]     = useState(false)
  const [reviewText,   setReviewText]   = useState('')
  const [reviewRating, setReviewRating] = useState(0)
  const [animated,     setAnimated]     = useState(false)
  const [helpClicked,  setHelpClicked]  = useState({})

  const barsRef = useRef()

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setAnimated(true) },
      { threshold: .2 }
    )
    if (barsRef.current) obs.observe(barsRef.current)
    return () => obs.disconnect()
  }, [])

  const submitReview = () => {
    if (!reviewRating)          return showToast('Please select a star rating', 'error')
    if (reviewText.length < 30) return showToast('Review must be at least 30 characters', 'error')
    showToast('Review submitted — thank you!')
    setReviewText(''); setReviewRating(0); setShowForm(false)
  }

  const photos  = ['🏡','🛏️','🚿','⚡','🌳']
  const photoBg = ['#1B3A6B','#065F46','#7B2D8B','#92400E','#134E4A']

  return (
    <div className="detail">

      {/* ── Hero ── */}
      <div className="detail__hero">
        <div className="container">
          <button className="detail__back" onClick={() => go('browse')}>
            ← Back to Listings
          </button>

          <div className="detail__hero-top">
            <div className="detail__hero-left">
              <div className="detail__badges">
                {l.verified && <span className="badge badge--green">✓ Peer-Verified</span>}
                <span className="badge badge--gray">{l.reviews} Reviews</span>
                <span className="badge badge--gray">{l.type}</span>
                <span className="badge badge--amber">🚶 {l.distance} to Gate</span>
                <PriceBadge priceBand={l.priceBand} />
              </div>
              <h1 className="detail__name">{l.name}</h1>
              <p className="detail__address">📍 {l.address}, Awka, Anambra State</p>
            </div>

            <div className="detail__rating-box">
              <span className="detail__rating-num">{l.rating}</span>
              <Stars n={Math.round(l.rating)} size={20} />
              <span className="detail__rating-sub">{l.reviews} student reviews</span>
            </div>
          </div>

          {/* Photo grid */}
          <div className="detail__photos">
            {[0,1,2,3,4].map(i => (
              <div
                key={i}
                className={`detail__photo detail__photo--${i}`}
                style={{ background: `linear-gradient(135deg,${photoBg[i]},${photoBg[(i+1)%5]})` }}
              >
                {l.photos?.[i]
                  ? <img src={l.photos[i]} alt="" />
                  : <span>{photos[i]}</span>
                }
                {i === 4 && <div className="detail__photo-more">+3 more</div>}
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="detail__tabs">
            {[['overview','Overview'],['reviews',`Reviews (${l.reviews})`],['map','📍 Location']].map(([t, label]) => (
              <button
                key={t}
                className={`detail__tab ${tab === t ? 'detail__tab--active' : ''}`}
                onClick={() => setTab(t)}
              >{label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="container detail__body">

        {/* Main column */}
        <div className="detail__main">

          {/* OVERVIEW TAB */}
          {tab === 'overview' && (
            <>
              <div className="detail__card">
                <h2 className="detail__card-title">About This Lodge</h2>
                <p className="detail__about">
                  {l.name} is located at {l.address}, approximately {l.distance} walk
                  from the NAU main gate. It provides {l.type.toLowerCase()} accommodation
                  with {l.water.toLowerCase()} water supply and {l.power.toLowerCase()} power.
                  Security: {l.security.toLowerCase()}. Verified by{' '}
                  {Math.floor(l.reviews * .35)} NAU students.
                </p>
                <div className="detail__info-grid">
                  {[
                    ['🚶', l.distance, 'Walk to Gate'],
                    ['💧', l.water,    'Water'],
                    ['⚡', l.power,    'Power'],
                    ['💰', band.label, band.desc],
                  ].map(([ico, val, lbl]) => (
                    <div key={lbl} className="detail__info-cell">
                      <span>{ico}</span>
                      <strong>{val}</strong>
                      <span>{lbl}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="detail__card" ref={barsRef}>
                <h2 className="detail__card-title">Rating Breakdown</h2>
                <div className="detail__bars">
                  {Object.entries(l.breakdown).map(([name, val]) => (
                    <div key={name} className="detail__bar-row">
                      <div className="detail__bar-label">
                        <span>{CRIT_ICONS[name]} {name}</span>
                        <strong>{val}/5</strong>
                      </div>
                      <div className="detail__bar-track">
                        <div
                          className="detail__bar-fill"
                          style={{ width: animated ? `${(val/5)*100}%` : '0%' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* REVIEWS TAB */}
          {tab === 'reviews' && (
            <div className="detail__card">
              <div className="detail__reviews-top">
                <div>
                  <h2 className="detail__card-title" style={{ marginBottom: 4 }}>
                    Student Reviews
                  </h2>
                  <p className="detail__reviews-sub">
                    {l.reviews} total · sorted by helpfulness
                  </p>
                </div>
                <button
                  className="detail__write-btn"
                  onClick={() => setShowForm(f => !f)}
                >{showForm ? 'Cancel' : '✍️ Write Review'}</button>
              </div>

              {/* Write review form */}
              {showForm && (
                <div className="detail__review-form">
                  <p>Your overall rating</p>
                  <Stars n={reviewRating} size={30} interactive onSet={setReviewRating} />
                  <textarea
                    value={reviewText}
                    onChange={e => setReviewText(e.target.value)}
                    placeholder="Tell other NAU students what it's like to live here…"
                    className="detail__review-textarea"
                  />
                  <div className="detail__form-footer">
                    <span className={`detail__char ${reviewText.length >= 30 ? 'ok' : ''}`}>
                      {reviewText.length}/30 min
                    </span>
                    <button className="detail__submit-btn" onClick={submitReview}>
                      Submit Review
                    </button>
                  </div>
                </div>
              )}

              {/* Review list */}
              <div className="detail__review-list">
                {l.reviewList.map(r => (
                  <div key={r.id} className="detail__review-card">
                    <div className="detail__review-header">
                      <div className="detail__reviewer">
                        <div className="detail__avatar">{r.initials}</div>
                        <div>
                          <p className="detail__reviewer-name">{r.name}</p>
                          <p className="detail__reviewer-meta">{r.level} · {r.date}</p>
                        </div>
                      </div>
                      <Stars n={r.rating} size={13} />
                    </div>
                    <p className="detail__review-text">{r.text}</p>
                    <div className="detail__helpful">
                      <span>Helpful?</span>
                      <button
                        className={`detail__helpful-btn ${helpClicked[r.id + 'h'] ? 'active' : ''}`}
                        onClick={() => setHelpClicked(p => ({
                          ...p, [r.id + 'h']: !p[r.id + 'h']
                        }))}
                      >
                        👍 {r.helpful + (helpClicked[r.id + 'h'] ? 1 : 0)}
                      </button>
                      <button className="detail__helpful-btn">👎 {r.unhelpful}</button>
                      <button
                        className="detail__report-btn"
                        onClick={() => showToast('Report submitted — thank you')}
                      >🚩 Report</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MAP TAB */}
          {tab === 'map' && (
            <div className="detail__card detail__map-card">
              <div className="detail__map-placeholder">
                <span>🗺️</span>
                <h3>{l.name}</h3>
                <p>📍 {l.address}</p>
                <button>Open in Google Maps ↗</button>
              </div>
              <div className="detail__nearby">
                {[
                  ['🏫','NAU Main Gate', l.distance + ' walk'],
                  ['🚌','Keke Stop',     '2 min walk'],
                  ['🏪','Market',        '5 min walk'],
                ].map(([ico, place, dist]) => (
                  <div key={place} className="detail__nearby-item">
                    <span>{ico}</span>
                    <strong>{place}</strong>
                    <span>{dist}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Sidebar ── */}
        <aside className="detail__sidebar">
          <div className="detail__sidebar-card">
            <div className="detail__sidebar-head">Lodge Details</div>
            {[
              ['🏠','Type',            l.type],
              ['💰','Price Range',     `${band.label} (${band.desc})`],
              ['📍','Area',            l.area],
              ['🚶','Distance to Gate',l.distance],
              ['💧','Water',           l.water],
              ['⚡','Power',           l.power],
              ['🔒','Security',        l.security],
            ].map(([ico, lbl, val]) => (
              <div key={lbl} className="detail__sidebar-row">
                <span>{ico}</span>
                <div>
                  <p className="detail__sidebar-lbl">{lbl}</p>
                  <p className="detail__sidebar-val"
                    style={{ color: lbl === 'Price Range' ? band.text : 'var(--ink)' }}
                  >{val}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            className="detail__cta-btn detail__cta-btn--amber"
            onClick={() => { setTab('reviews'); setShowForm(true) }}
          >⭐ Write a Review</button>

          <button
            className="detail__cta-btn detail__cta-btn--outline"
            onClick={() => showToast('Report submitted — our team will review this')}
          >🚩 Report This Listing</button>

          <div className="detail__disclaimer">
            <strong>ℹ️ About This Platform</strong>
            <p>All reviews come from registered NAU students. Always visit a lodge in person before committing to rent.</p>
          </div>
        </aside>
      </div>
    </div>
  )
}