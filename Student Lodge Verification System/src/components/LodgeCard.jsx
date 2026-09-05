import { useState } from 'react'
import Stars from './Stars'
import PriceBadge from './PriceBadge'
import './LodgeCard.css'

export default function LodgeCard({ lodge: l, onClick }) {
  const [hov, setHov] = useState(false)
  return (
    <article
      className={`lodge-card ${hov ? 'hov' : ''}`}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div className="lodge-card__img" style={{ background: l.bg }}>
        {l.photos?.length > 0
          ? <img src={l.photos[0]} alt={l.name} />
          : <span className="lodge-card__emoji">{l.emoji}</span>
        }
        {l.verified && <span className="lodge-card__verified">✓ Verified</span>}
        <span className="lodge-card__area">{l.area}</span>
      </div>

      <div className="lodge-card__body">
        <h3 className="lodge-card__name">{l.name}</h3>
        <p className="lodge-card__addr">📍 {l.address} · 🚶 {l.distance} to gate</p>

        <div className="lodge-card__rating">
          <Stars n={Math.round(l.rating)} size={13} />
          <strong>{l.rating}</strong>
          <span>({l.reviews} reviews)</span>
        </div>

        <div className="lodge-card__tags">
          {l.tags.slice(0,3).map(t => (
            <span key={t} className="lodge-card__tag">{t}</span>
          ))}
        </div>

        <div className="lodge-card__footer">
          <PriceBadge priceBand={l.priceBand} />
          <button className={`lodge-card__btn ${hov ? 'hov' : ''}`}>
            View Lodge →
          </button>
        </div>
      </div>
    </article>
  )
}