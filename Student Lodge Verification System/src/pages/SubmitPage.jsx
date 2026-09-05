/*export default function SubmitPage({ go }) {
  return <div style={{ padding: '60px 40px', textAlign:'center' }}>
    <h2>Submit Page — coming next</h2>
    <button onClick={() => go('home')} style={{ marginTop:16, padding:'10px 24px', background:'#1B3A6B', color:'#fff', borderRadius:10 }}>← Back Home</button>
  </div>
}*/
import { useState } from 'react'
import { AREAS, TYPES, PRICE_BANDS } from '../data/lodges'
import Stars from '../components/Stars'
import ImageUploader from '../components/ImageUploader'
import './SubmitPage.css'

const STEPS = ['Lodge Info', 'Upload Photos', 'Rate It', 'Your Review']

export default function SubmitPage({ go, showToast, addLodge }) {
  const [step,    setStep]    = useState(1)
  const [photos,  setPhotos]  = useState([])
  const [ratings, setRatings] = useState({
    Security: 0, Water: 0, Electricity: 0,
    Cleanliness: 0, Landlord: 0, Value: 0
  })
  const [form, setForm] = useState({
    name: '', area: '', address: '', type: 'Self-Contained',
    priceBand: 0, water: 'Borehole', power: 'NEPA + Generator',
    security: 'Gateman + Fence', review: '',
    level: '200 Level', session: ''
  })

  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const next = () => {
    // Step 1 validation
    if (step === 1) {
      if (!form.name.trim())    return showToast('Please enter a lodge name', 'error')
      if (!form.area)           return showToast('Please select an area', 'error')
      if (!form.address.trim()) return showToast('Please enter the address', 'error')
    }

    // Step 2 validation
    if (step === 2 && photos.length === 0) {
      return showToast('Please upload at least one photo', 'error')
    }

    // Step 3 validation
    if (step === 3 && Object.values(ratings).some(v => v === 0)) {
      return showToast('Please rate all 6 criteria', 'error')
    }

    // Step 4 — Final submission
    if (step === 4) {
      if (form.review.length < 30) {
        return showToast('Review must be at least 30 characters', 'error')
      }

      // Build average rating
      const values = Object.values(ratings)
      const avg = parseFloat(
        (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1)
      )

      // Build the new lodge object
      const newLodge = {
        id:        Date.now(),
        name:      form.name.trim(),
        area:      form.area,
        address:   form.address.trim(),
        distance:  'Unknown',
        type:      form.type,
        priceBand: form.priceBand,
        rating:    avg,
        reviews:   1,
        verified:  false,
        water:     form.water,
        power:     form.power,
        security:  form.security,
        tags: [
          `💧 ${form.water}`,
          `⚡ ${form.power}`,
          `🔒 ${form.security}`,
        ],
        bg: 'linear-gradient(135deg, #374151, #6B7280)',
        photos: photos.map(p => p.url),
        breakdown: { ...ratings },
        reviewList: [
          {
            id:        1,
            name:      'You',
            initials:  'ME',
            level:     form.level,
            date:      new Date().toLocaleDateString('en-GB', {
              month: 'long', year: 'numeric'
            }),
            rating:    Math.round(avg),
            helpful:   0,
            unhelpful: 0,
            text:      form.review,
            isOwn:     true,
          }
        ],
      }

      // Add to the live list
      if (addLodge) addLodge(newLodge)

      showToast(`${form.name} submitted successfully! ✓`)

      // Go to browse — student can see their lodge immediately
      go('browse')
      return
    }

    setStep(s => s + 1)
  }

  const prev = () => {
    if (step === 1) {
      go('browse')
    } else {
      setStep(s => s - 1)
    }
  }

  const selBand = PRICE_BANDS[form.priceBand]

  return (
    <div className="submit">
      <div className="container submit__inner">
        <button className="submit__back" onClick={() => go('browse')}>
          ← Back to Lodges
        </button>

        <h1 className="submit__title">Submit a Lodge</h1>
        <p className="submit__sub">
          Share your honest experience to help the next NAU student.
          No agents. No landlords. Just students.
        </p>

        {/* Step tracker */}
        <div className="submit__steps">
          {STEPS.map((s, i) => {
            const n      = i + 1
            const done   = step > n
            const active = step === n
            return (
              <div
                key={s}
                className={`submit__step ${done ? 'done' : ''} ${active ? 'active' : ''}`}
              >
                <div className="submit__step-num">
                  {done ? '✓' : n}
                </div>
                <span>{s}</span>
              </div>
            )
          })}
        </div>

        {/* Card */}
        <div className="submit__card">
          <h2 className="submit__card-title">
            {[
              '🏠 Lodge Information',
              '📸 Upload Photos',
              '⭐ Rate This Lodge',
              '✍️ Your Review',
            ][step - 1]}
          </h2>

          {/* ── STEP 1 ── */}
          {step === 1 && (
            <div className="submit__form">
              <div className="form-group">
                <label>Lodge Name <span className="req">*</span></label>
                <input
                  value={form.name}
                  onChange={e => upd('name', e.target.value)}
                  placeholder="e.g. Emmanuella Hostel, Grace Court Lodge"
                  className="form-input"
                />
                <p className="form-hint">Use the name students commonly call this lodge</p>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Street / Address <span className="req">*</span></label>
                  <input
                    value={form.address}
                    onChange={e => upd('address', e.target.value)}
                    placeholder="e.g. 14 Ifite Road"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Area <span className="req">*</span></label>
                  <select
                    value={form.area}
                    onChange={e => upd('area', e.target.value)}
                    className="form-input"
                  >
                    <option value="">Select area…</option>
                    {AREAS.slice(1).map(a => (
                      <option key={a}>{a}</option>
                    ))}
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Room Type</label>
                  <select
                    value={form.type}
                    onChange={e => upd('type', e.target.value)}
                    className="form-input"
                  >
                    {TYPES.slice(1).map(t => (
                      <option key={t}>{t}</option>
                    ))}
                    <option>Mini Flat</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Approximate Price Range</label>
                  <select
                    value={form.priceBand}
                    onChange={e => upd('priceBand', +e.target.value)}
                    className="form-input"
                  >
                    {PRICE_BANDS.map((b, i) => (
                      <option key={b.label} value={i}>
                        {b.label} — {b.desc}
                      </option>
                    ))}
                  </select>
                  <div
                    className="form-band-preview"
                    style={{
                      background:  selBand.color,
                      borderColor: selBand.border,
                      color:       selBand.text,
                    }}
                  >
                    💰 {selBand.label} · {selBand.desc} per year
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Water Supply</label>
                  <select
                    value={form.water}
                    onChange={e => upd('water', e.target.value)}
                    className="form-input"
                  >
                    {['Borehole','Tap Water','Buy Water','Unsure'].map(o => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Electricity</label>
                  <select
                    value={form.power}
                    onChange={e => upd('power', e.target.value)}
                    className="form-input"
                  >
                    {['NEPA + Generator','NEPA Only','Generator Only','Prepaid Meter'].map(o => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Security</label>
                <select
                  value={form.security}
                  onChange={e => upd('security', e.target.value)}
                  className="form-input"
                >
                  {[
                    'Gateman + Perimeter Fence',
                    'Locked Gate (No Gateman)',
                    'Gateman + CCTV',
                    'Open Compound',
                  ].map(o => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* ── STEP 2 ── */}
          {step === 2 && (
            <div>
              <div className="submit__photo-tip">
                📸 Real photos are what make this platform valuable. Upload
                photos of the room, bathroom, compound, and any notable features.
              </div>
              <ImageUploader
                photos={photos}
                setPhotos={setPhotos}
                showToast={showToast}
              />
            </div>
          )}

          {/* ── STEP 3 ── */}
          {step === 3 && (
            <div>
              <p className="submit__rate-intro">
                Rate this lodge based on your personal experience.
                Click a star to set your score for each criterion.
              </p>
              <div className="submit__ratings">
                {[
                  ['Security',    '🔒', 'Gateman, fence, safety of the neighbourhood'],
                  ['Water',       '💧', 'Daily reliability and availability of water'],
                  ['Electricity', '⚡', 'NEPA reliability and generator backup speed'],
                  ['Cleanliness', '🧹', 'Compound, corridors and shared facilities'],
                  ['Landlord',    '👩‍💼', 'Responsiveness, fairness and attitude'],
                  ['Value',       '💰', 'Is the price fair for what you receive?'],
                ].map(([key, icon, desc]) => (
                  <div
                    key={key}
                    className={`submit__rating-row ${ratings[key] > 0 ? 'rated' : ''}`}
                  >
                    <div>
                      <p className="submit__crit-name">{icon} {key}</p>
                      <p className="submit__crit-desc">{desc}</p>
                    </div>
                    <Stars
                      n={ratings[key]}
                      size={26}
                      interactive
                      onSet={v => setRatings(r => ({ ...r, [key]: v }))}
                    />
                  </div>
                ))}
              </div>
              {Object.values(ratings).some(v => v === 0) && (
                <p className="submit__rate-warn">
                  ⚠️ Please rate all 6 criteria before continuing.
                </p>
              )}
            </div>
          )}

          {/* ── STEP 4 ── */}
          {step === 4 && (
            <div className="submit__form">
              <div className="form-group">
                <label>Your Review <span className="req">*</span></label>
                <textarea
                  value={form.review}
                  onChange={e => upd('review', e.target.value)}
                  placeholder="Tell other NAU students what it's actually like to live here. Be honest and specific — your review helps the next student."
                  className="form-input form-textarea"
                />
                <div className="form-row-small">
                  <p className="form-hint">Minimum 30 characters. Be honest.</p>
                  <span className={`form-char ${form.review.length >= 30 ? 'ok' : ''}`}>
                    {form.review.length}
                  </span>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Your Year of Study</label>
                  <select
                    value={form.level}
                    onChange={e => upd('level', e.target.value)}
                    className="form-input"
                  >
                    {['100 Level','200 Level','300 Level','400 Level','500 Level','Postgraduate'].map(l => (
                      <option key={l}>{l}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Session You Lived Here</label>
                  <input
                    value={form.session}
                    onChange={e => upd('session', e.target.value)}
                    placeholder="e.g. 2024/2025 session"
                    className="form-input"
                  />
                </div>
              </div>

              {/* Submission summary */}
              <div className="submit__summary">
                <p className="submit__summary-title">📋 Summary</p>
                <div className="submit__summary-grid">
                  {[
                    ['Lodge',    form.name    || '—'],
                    ['Area',     form.area    || '—'],
                    ['Type',     form.type],
                    ['Range',    `${selBand.label} (${selBand.desc})`],
                    ['Photos',   `${photos.length} uploaded`],
                    ['Avg Rating', `${(Object.values(ratings).reduce((a,b)=>a+b,0)/6).toFixed(1)}★`],
                  ].map(([k, v]) => (
                    <div key={k} className="submit__summary-item">
                      <span>{k}:</span> <strong>{v}</strong>
                    </div>
                  ))}
                </div>
              </div>

              <div className="submit__privacy">
                🔒 <strong>Privacy:</strong> Only your year of study and submission
                date will appear publicly. Your full name will not be shown.
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="submit__nav">
          <button className="submit__btn-back" onClick={prev}>
            {step === 1 ? 'Cancel' : '← Previous'}
          </button>
          <button
            className={`submit__btn-next ${step === 4 ? 'submit__btn-next--green' : ''}`}
            onClick={next}
          >
            {step === 4 ? '✓ Submit Lodge' : 'Continue →'}
          </button>
        </div>
      </div>
    </div>
  )
}