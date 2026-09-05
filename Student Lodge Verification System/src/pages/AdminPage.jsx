/*export default function AdminPage({ go }) {
  return <div style={{ padding: '60px 40px', textAlign:'center' }}>
    <h2>Admin — coming next</h2>
    <button onClick={() => go('home')} style={{ marginTop:16, padding:'10px 24px', background:'#1B3A6B', color:'#fff', borderRadius:10 }}>← Back Home</button>
  </div>
}*/
import { useState } from 'react'
import { LODGES, getBand } from '../data/lodges'
import Stars from '../components/Stars'
import PriceBadge from '../components/PriceBadge'
import './AdminPage.css'

export default function AdminPage({ go }) {
  const [tab, setTab] = useState('dashboard')
  const pending = LODGES.slice(0, 2)

  const stats = [
    { icon:'🏠', label:'Total Lodges',  val: LODGES.length,                                    sub:'across 4 areas'       },
    { icon:'⭐', label:'Total Reviews', val: LODGES.reduce((a,l) => a + l.reviews, 0),         sub:'from NAU students'    },
    { icon:'⏳', label:'Pending',       val: 2,                                                 sub:'awaiting approval'   },
    { icon:'🚩', label:'Reports',       val: 1,                                                 sub:'flagged listings'    },
  ]

  return (
    <div className="admin">
      <div className="container admin__inner">
        <div className="admin__header">
          <p className="admin__eyebrow">Admin Panel</p>
          <h1 className="admin__title">IfiteLodge Dashboard</h1>
        </div>

        {/* Stats */}
        <div className="admin__stats">
          {stats.map(s => (
            <div key={s.label} className="admin__stat-card">
              <span className="admin__stat-icon">{s.icon}</span>
              <strong className="admin__stat-val">{s.val}</strong>
              <p className="admin__stat-label">{s.label}</p>
              <p className="admin__stat-sub">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Tab switcher */}
        <div className="admin__tabs">
          {[
            ['dashboard','📊 Overview'],
            ['pending',  '⏳ Pending (2)'],
            ['lodges',   '🏠 All Lodges'],
            ['reports',  '🚩 Reports'],
          ].map(([t, label]) => (
            <button
              key={t}
              className={`admin__tab ${tab === t ? 'admin__tab--active' : ''}`}
              onClick={() => setTab(t)}
            >{label}</button>
          ))}
        </div>

        {/* DASHBOARD */}
        {tab === 'dashboard' && (
          <div className="admin__grid">
            <div className="admin__card">
              <h3 className="admin__card-title">Top Lodges by Rating</h3>
              {[...LODGES].sort((a,b) => b.rating - a.rating).slice(0,5).map((l, i) => (
                <div
                  key={l.id}
                  className="admin__lodge-row"
                  onClick={() => go('detail', l)}
                >
                  <span className="admin__rank">#{i + 1}</span>
                  <div className="admin__lodge-emoji"
                    style={{ background: l.bg }}>{l.emoji}</div>
                  <div className="admin__lodge-info">
                    <p className="admin__lodge-name">{l.name}</p>
                    <p className="admin__lodge-meta">{l.area} · {l.reviews} reviews</p>
                  </div>
                  <div className="admin__lodge-rating">
                    <span>⭐</span>
                    <strong>{l.rating}</strong>
                  </div>
                </div>
              ))}
            </div>

            <div className="admin__card">
              <h3 className="admin__card-title">Lodges by Area</h3>
              {['Ifite Road','Behind Main Gate','Amawbia Road','Ziks Avenue'].map(a => {
                const count = LODGES.filter(l => l.area === a).length
                const pct   = Math.round((count / LODGES.length) * 100)
                return (
                  <div key={a} className="admin__area-row">
                    <div className="admin__area-label">
                      <span>{a}</span>
                      <strong>{count} lodges</strong>
                    </div>
                    <div className="admin__area-track">
                      <div className="admin__area-fill" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* PENDING */}
        {tab === 'pending' && (
          <div>
            <div className="admin__notice">
              ⏳ 2 lodge submissions are waiting for review before being published.
            </div>
            {pending.map(l => (
              <div key={l.id} className="admin__pending-row">
                <div className="admin__pending-info">
                  <div className="admin__pending-emoji" style={{ background: l.bg }}>
                    {l.emoji}
                  </div>
                  <div>
                    <p className="admin__pending-name">{l.name}</p>
                    <p className="admin__pending-meta">
                      📍 {l.address} · {l.type} · <PriceBadge priceBand={l.priceBand} />
                    </p>
                  </div>
                </div>
                <div className="admin__pending-actions">
                  <button className="admin__btn admin__btn--approve">✓ Approve</button>
                  <button className="admin__btn admin__btn--reject">✕ Reject</button>
                  <button
                    className="admin__btn admin__btn--view"
                    onClick={() => go('detail', l)}
                  >View →</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ALL LODGES TABLE */}
        {tab === 'lodges' && (
          <div className="admin__table-wrap">
            <table className="admin__table">
              <thead>
                <tr>
                  {['Lodge','Area','Type','Price Range','Rating','Status','Actions'].map(h => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {LODGES.map(l => (
                  <tr key={l.id}>
                    <td>
                      <div className="admin__table-lodge">
                        <span>{l.emoji}</span>
                        <span>{l.name}</span>
                      </div>
                    </td>
                    <td>{l.area}</td>
                    <td>{l.type}</td>
                    <td><PriceBadge priceBand={l.priceBand} /></td>
                    <td>
                      <div className="admin__table-rating">
                        <span>⭐</span>
                        <strong>{l.rating}</strong>
                        <span>({l.reviews})</span>
                      </div>
                    </td>
                    <td>
                      {l.verified
                        ? <span className="admin__status admin__status--green">✓ Verified</span>
                        : <span className="admin__status admin__status--gray">Unverified</span>
                      }
                    </td>
                    <td>
                      <div className="admin__table-actions">
                        <button
                          className="admin__btn admin__btn--view"
                          onClick={() => go('detail', l)}
                        >View</button>
                        <button className="admin__btn admin__btn--reject">Remove</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* REPORTS */}
        {tab === 'reports' && (
          <div className="admin__report-card">
            <div className="admin__report-info">
              <div className="admin__pending-emoji"
                style={{ background: LODGES[0].bg }}>{LODGES[0].emoji}</div>
              <div>
                <p className="admin__pending-name">{LODGES[0].name}</p>
                <p className="admin__pending-meta">
                  Reported by: 200L student · Reason: "Lodge information is outdated — price range has changed"
                </p>
                <p className="admin__report-date">1 report · Received 2 days ago</p>
              </div>
            </div>
            <div className="admin__pending-actions">
              <button className="admin__btn admin__btn--approve">Update</button>
              <button className="admin__btn admin__btn--view">Dismiss</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}