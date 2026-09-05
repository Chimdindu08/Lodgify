import './HomePage.css'
import {AREAS, PRICE_BANDS } from '../data/lodges'
import LodgeCard from '../components/LodgeCard'
import Stars from '../components/Stars'
import PriceBadge from '../components/PriceBadge'
import { useState } from 'react'

export default function HomePage({ go, lodges = [] }) {
  const [q, setQ] = useState('')
  const top = [...lodges].sort((a, b) => b.rating - a.rating).slice(0, 3)
  return (
    <div className="home">

      {/* HERO */}
      <section className="hero">
        <div className="hero__glow" />
        <div className="container hero__inner">
          <div className="hero__left">
            <div className="hero__eyebrow">
              <span className="hero__dot" />
              Nnamdi Azikiwe University · Ifite, Awka
            </div>
            <h1 className="hero__title">
              Find a lodge <span className="hero__accent">you can trust</span> before you arrive.
            </h1>
            <p className="hero__sub">
              Honest reviews, real photos and peer-verified ratings from NAU students
              who actually lived there. No agents. No landlord sign-ups. Just the truth.
            </p>
            <div className="hero__search">
              <span>🔍</span>
              <input
                value={q}
                onChange={e => setQ(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && go('browse')}
                placeholder="Search lodge name, street or area…"
              />
              <button onClick={() => go('browse')}>Search</button>
            </div>
            <div className="hero__pills">
              {AREAS.slice(1).map(a => (
                <button key={a} className="hero__pill" onClick={() => go('browse')}>{a}</button>
              ))}
            </div>
            <div className="hero__stats">
              {[['340+','Lodges Listed'],['1,200+','Student Reviews'],['4.3★','Average Rating']].map(([v,l]) => (
                <div key={l}>
                  <strong>{v}</strong>
                  <span>{l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stacked preview cards */}
          <div className="hero__cards">
            {lodges.slice(0, 3).map((l, i) => (
              <div key={l.id} className={`hero__card hero__card--${i}`} onClick={() => go('detail', l)}>
                <div className="hero__card-img" style={{ background: l.bg }}>
                  {l.photos?.length > 0 ? <img src={l.photos[0]} alt={l.name} /> : l.emoji}
                </div>
                <p className="hero__card-name">{l.name}</p>
                <p className="hero__card-area">📍 {l.area}</p>
                <Stars n={Math.round(l.rating)} size={11} />
                <PriceBadge priceBand={l.priceBand} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICE BAND LEGEND */}
      <div className="bands-legend">
        <div className="container bands-legend__inner">
          <span>Price Ranges:</span>
          {PRICE_BANDS.map(b => (
            <span key={b.label} className="bands-legend__chip"
              style={{ background: b.color, borderColor: b.border, color: b.text }}>
              <strong>{b.label}</strong> {b.desc}
            </span>
          ))}
        </div>
      </div>

      {/* TOP LODGES */}
      <section className="container section">
        <div className="section__header">
          <div>
            <p className="section__eye">Community Picks</p>
            <h2 className="section__title">Best-Rated Lodges Near NAU</h2>
          </div>
          <button className="section__more" onClick={() => go('browse')}>View all →</button>
        </div>
        <div className="lodge-grid">
          {top.map(l => <LodgeCard key={l.id} lodge={l} onClick={() => go('detail', l)} />)}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how">
        <div className="container">
          <div className="how__header">
            <p className="section__eye" style={{ color:'#F59E0B' }}>How It Works</p>
            <h2 className="how__title">Student-to-student. No middlemen.</h2>
          </div>
          <div className="how__steps">
            {[
              ['🔍','Search Ifite','Browse lodge listings around NAU filtered by your preferences.'],
              ['📸','See Real Photos','View images uploaded by students who actually lived there.'],
              ['⭐','Read Ratings','Ratings for security, water, power, cleanliness and management.'],
              ['✍️','Rate & Help','After moving in, write your own review and help the next student.'],
            ].map(([icon, title, desc]) => (
              <div key={title} className="how__step">
                <div className="how__step-icon">{icon}</div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="container">
          <h2>Know a lodge not listed yet?</h2>
          <p>Add it in 5 minutes. Upload photos, rate it, and help the next NAU student decide wisely.</p>
          <button onClick={() => go('submit')}>Submit a Lodge →</button>
        </div>
      </section>

    </div>
  )
}