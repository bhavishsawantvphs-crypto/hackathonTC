import { useState, useEffect } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import PageWrap from '../components/PageWrap'
import Reveal from '../components/Reveal'
import { getWaterfall, WATERFALLS } from '../data/waterfalls'
import { isWaterfallInScheduler, addWaterfallToScheduler } from '../utils/scheduler'
import {
  IconShield,
  IconAlert,
  IconArrow,
  IconArrowLeft,
  IconPin,
  IconLeaf
} from '../components/icons'

export default function WaterfallDetail() {
  const { id } = useParams()
  const [isAdded, setIsAdded] = useState(false)
  const [toastMsg, setToastMsg] = useState(null)

  useEffect(() => {
    if (id) {
      setIsAdded(isWaterfallInScheduler(id))
    }
  }, [id])

  if (id === 'index.html' || id === 'dist' || id === 'home.html') {
    return <Navigate to="/" replace />
  }

  const wf = getWaterfall(id)

  if (!wf) {
    return (
      <PageWrap>
        <section className="page-hero">
          <div className="wrap">
            <h1>Waterfall not found</h1>
            <p>The requested waterfall details are not currently in our verified dataset.</p>
            <Link to="/" className="btn ghost mt-m">
              <IconArrowLeft /> Back to Home
            </Link>
          </div>
        </section>
      </PageWrap>
    )
  }

  const otherFalls = WATERFALLS.filter((w) => w.id !== wf.id).slice(0, 3)

  return (
    <PageWrap>
      {/* SECTION A: BASIC INFORMATION HERO */}
      <section className="page-hero detail-mist-hero">
        <div className="wrap">
          <Reveal>
            <div className="breadcrumb">
              <Link to="/">Home</Link> / <Link to="/">Waterfalls</Link> /{' '}
              <span>{wf.name}</span>
            </div>
            
            <div style={{ display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              <span className="tag aqua">
                {wf.category}
              </span>
              <span className={`tag ${wf.safetyBadge === 'safe' ? 'safe' : 'caution'}`}>
                {wf.safetyLabel}
              </span>
              <span className="tag" style={{ background: 'var(--white)', borderColor: 'var(--border-color)' }}>
                🏃 {wf.accessibilityLevel}
              </span>
            </div>

            <h1 style={{ marginTop: 14, color: 'var(--ink)', fontSize: '2.5rem', fontWeight: 800 }}>{wf.name}</h1>
            <div className="district" style={{ marginTop: 6, fontSize: '1.05rem', color: 'var(--ink-muted)' }}>
              <IconPin style={{ display: 'inline', verticalAlign: '-2px', marginRight: 4, color: '#35B9A5' }} />
              {wf.district} District · {wf.nearbyTown}
            </div>

            {/* Waterfall Detail Hero Image with Subtle Glass Border */}
            <div className="detail-hero-image-wrap">
              <img
                src={wf.image}
                alt={wf.name}
                className="detail-hero-photo"
                onError={(e) => {
                  e.target.style.display = 'none';
                  if (e.target.nextElementSibling) e.target.nextElementSibling.style.display = 'flex';
                }}
              />
              <div className="card-fallback">
                {wf.name} · {wf.district} District
              </div>
            </div>

            <p style={{ fontSize: '1.15rem', color: 'var(--ink-soft)', lineHeight: 1.7, marginTop: 18, maxWidth: 920 }}>
              {wf.fullDesc}
            </p>
          </Reveal>
        </div>
      </section>

      {/* MAIN TWO-COLUMN CONTENT AREA */}
      <section className="section" style={{ paddingTop: 16 }}>
        <div className="wrap grid-2">
          {/* LEFT COLUMN: SAFETY, ACCESSIBILITY, MEDICAL, BEST SEASON & ROUTE */}
          <div className="stack-lg">
            {/* SECTION B: SAFETY STATUS */}
            <Reveal>
              <div className="glass" style={{ padding: '24px', borderRadius: 'var(--r-lg)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <span className="ic" style={{ color: 'var(--primary)', fontSize: '1.2rem' }}>
                    <IconShield />
                  </span>
                  <h3 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--ink)' }}>Safety Profile</h3>
                </div>

                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 20, background: wf.safetyBadge === 'safe' ? 'rgba(79,175,91,0.18)' : 'rgba(229,167,47,0.18)', marginBottom: 14, border: `1px solid ${wf.safetyBadge === 'safe' ? 'var(--accent)' : 'var(--warning)'}` }}>
                  <span style={{ fontSize: '1rem' }}>{wf.safetyLabel.split(' ')[0]}</span>
                  <strong style={{ color: wf.safetyBadge === 'safe' ? 'var(--primary)' : '#925c04' }}>
                    {wf.safetyLabel.replace(/^[^s]+s*/, '')}
                  </strong>
                </div>

                <p style={{ color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: 14 }}>
                  {wf.safetyNote}
                </p>

                <div className="flag-box">
                  <IconAlert />
                  <div style={{ fontSize: '0.84rem' }}>
                    <strong>Disclaimer:</strong> {wf.safetyDisclaimer}
                  </div>
                </div>
              </div>
            </Reveal>

            {/* SECTION C: ACCESSIBILITY BREAKDOWN */}
            <Reveal delay={0.06}>
              <div className="glass" style={{ padding: '24px', borderRadius: 'var(--r-lg)' }}>
                <span className="eyebrow">Terrain &amp; Approach</span>
                <h3 style={{ fontSize: '1.25rem', marginTop: 4, marginBottom: 14, color: 'var(--ink)' }}>
                  Accessibility: <em style={{ color: 'var(--primary)' }}>{wf.accessibilityLevel}</em>
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                  <div className="ibox">
                    <span style={{ fontSize: '0.78rem', color: 'var(--ink-muted)', display: 'block' }}>🛣️ Road Condition</span>
                    <strong style={{ color: 'var(--ink)' }}>{wf.accessibilityDetails.roadCondition || 'To be verified'}</strong>
                  </div>
                  <div className="ibox">
                    <span style={{ fontSize: '0.78rem', color: 'var(--ink-muted)', display: 'block' }}>🚶 Walking Distance</span>
                    <strong style={{ color: 'var(--ink)' }}>{wf.accessibilityDetails.walkingDistance || 'To be verified'}</strong>
                  </div>
                  <div className="ibox">
                    <span style={{ fontSize: '0.78rem', color: 'var(--ink-muted)', display: 'block' }}>🧗 Trek Requirement</span>
                    <strong style={{ color: 'var(--ink)' }}>{wf.accessibilityDetails.trekRequirement || 'To be verified'}</strong>
                  </div>
                  <div className="ibox">
                    <span style={{ fontSize: '0.78rem', color: 'var(--ink-muted)', display: 'block' }}>⛰️ Terrain Difficulty</span>
                    <strong style={{ color: 'var(--ink)' }}>{wf.accessibilityDetails.terrainDifficulty || 'To be verified'}</strong>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* SECTION D: MEDICAL SUPPORT */}
            <Reveal delay={0.08}>
              <div className="glass" style={{ padding: '24px', borderRadius: 'var(--r-lg)' }}>
                <span className="eyebrow">Emergency &amp; Health</span>
                <h3 style={{ fontSize: '1.25rem', marginTop: 4, marginBottom: 14, color: 'var(--ink)' }}>
                  Medical Support
                </h3>

                <div className="info-row" style={{ borderTop: 'none', padding: '8px 0' }}>
                  <span className="ic">🏥</span>
                  <div>
                    <div className="label">Nearby Medical Facility</div>
                    <div className="val">{wf.medicalSupport.facility || 'Medical information to be verified'}</div>
                  </div>
                </div>

                <div className="info-row" style={{ padding: '8px 0' }}>
                  <span className="ic">📍</span>
                  <div>
                    <div className="label">Approximate Distance</div>
                    <div className="val">{wf.medicalSupport.distance || 'To be verified'}</div>
                  </div>
                </div>

                <div className="info-row" style={{ padding: '8px 0' }}>
                  <span className="ic">🚑</span>
                  <div>
                    <div className="label">Emergency Protocols</div>
                    <div className="val">{wf.medicalSupport.emergencyNotes || 'Emergency information to be verified'}</div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* SECTION E: BEST SEASON */}
            <Reveal delay={0.1}>
              <div className="glass" style={{ padding: '24px', borderRadius: 'var(--r-lg)' }}>
                <span className="eyebrow">Timing Your Trip</span>
                <h3 style={{ fontSize: '1.25rem', marginTop: 4, marginBottom: 14, color: 'var(--ink)' }}>
                  Best Season to Visit
                </h3>

                <div className="ibox" style={{ marginBottom: 12, background: 'var(--white)', borderLeft: '4px solid var(--primary)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--ink-muted)', display: 'block' }}>Recommended Window</span>
                  <strong style={{ fontSize: '1.05rem', color: 'var(--primary)' }}>{wf.bestSeason.recommended}</strong>
                </div>

                <p style={{ color: 'var(--ink-soft)', fontSize: '0.94rem', lineHeight: 1.6, marginBottom: 12 }}>
                  {wf.bestSeason.seasonalNote}
                </p>

                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', padding: '10px 14px', borderRadius: 'var(--r-sm)', background: 'rgba(229,167,47,0.14)', color: '#925c04', fontSize: '0.84rem', border: '1px solid var(--warning)' }}>
                  <span>⚠️</span>
                  <div><strong>Seasonal Caution:</strong> {wf.bestSeason.monsoonCaution}</div>
                </div>
              </div>
            </Reveal>

            {/* SECTION F: ROUTE INFORMATION */}
            <Reveal delay={0.12}>
              <div className="glass" style={{ padding: '24px', borderRadius: 'var(--r-lg)' }}>
                <span className="eyebrow">Getting There</span>
                <h3 style={{ fontSize: '1.25rem', marginTop: 4, marginBottom: 14, color: 'var(--ink)' }}>
                  Route Information
                </h3>

                <div className="stack" style={{ gap: 10, marginBottom: 18 }}>
                  <div className="ibox">
                    <span style={{ fontSize: '0.78rem', color: 'var(--ink-muted)', display: 'block' }}>🚗 How to Reach</span>
                    <span style={{ fontSize: '0.94rem', color: 'var(--ink)' }}>{wf.routeInfo.howToReach || 'To be verified'}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div className="ibox">
                      <span style={{ fontSize: '0.78rem', color: 'var(--ink-muted)', display: 'block' }}>📍 Distance</span>
                      <strong style={{ color: 'var(--ink)' }}>{wf.routeInfo.approxDistance || 'To be verified'}</strong>
                    </div>
                    <div className="ibox">
                      <span style={{ fontSize: '0.78rem', color: 'var(--ink-muted)', display: 'block' }}>⏱️ Travel Time</span>
                      <strong style={{ color: 'var(--ink)' }}>{wf.routeInfo.travelTime || 'To be verified'}</strong>
                    </div>
                  </div>
                </div>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(wf.routeInfo.mapQuery)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn outline"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  Open Map ↗
                </a>
              </div>
            </Reveal>
          </div>

          {/* RIGHT COLUMN: ECO-SCORE, NEARBY EXPERIENCES & RESPONSIBLE TOURISM */}
          <div className="stack-lg">
            {/* SECTION I: PROTOTYPE ECO-SCORE */}
            <Reveal delay={0.05}>
              <div className="glass" style={{ padding: '24px', borderRadius: 'var(--r-lg)', background: 'var(--bg-card)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span className="eyebrow" style={{ margin: 0 }}>Sustainability Metric</span>
                  <span className="tag safe">
                    {wf.ecoScore.label}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, margin: '10px 0' }}>
                  <span style={{ fontSize: '3.2rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>
                    {wf.ecoScore.score}
                  </span>
                  <span style={{ fontSize: '1.2rem', color: 'var(--ink-muted)' }}>/100</span>
                  <span style={{ marginLeft: 'auto', fontSize: '0.92rem', fontWeight: 600, color: 'var(--ink-soft)' }}>
                    {wf.ecoScore.verdict}
                  </span>
                </div>

                {/* Progress bar */}
                <div style={{ height: 8, width: '100%', background: 'rgba(16,45,32,0.1)', borderRadius: 10, overflow: 'hidden', marginBottom: 16 }}>
                  <div style={{ height: '100%', width: `${wf.ecoScore.score}%`, background: 'linear-gradient(90deg, #4FAF5B, #176B45)', borderRadius: 10 }} />
                </div>

                <div className="stack" style={{ gap: 8, fontSize: '0.84rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: 6 }}>
                    <span style={{ color: 'var(--ink-muted)' }}>Waste Management</span>
                    <strong>{wf.ecoScore.criteria.wasteManagement}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: 6 }}>
                    <span style={{ color: 'var(--ink-muted)' }}>Basic Facilities</span>
                    <strong>{wf.ecoScore.criteria.basicFacilities}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: 6 }}>
                    <span style={{ color: 'var(--ink-muted)' }}>Environmental Sensitivity</span>
                    <strong>{wf.ecoScore.criteria.environmentalSensitivity}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: 6 }}>
                    <span style={{ color: 'var(--ink-muted)' }}>Local Community Participation</span>
                    <strong>{wf.ecoScore.criteria.localParticipation}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--ink-muted)' }}>Safety Infrastructure</span>
                    <strong>{wf.ecoScore.criteria.safety}</strong>
                  </div>
                </div>

                <p style={{ fontSize: '0.76rem', color: 'var(--ink-muted)', marginTop: 12, fontStyle: 'italic' }}>
                  * Prototype Eco-Score — not an official government rating.
                </p>
              </div>
            </Reveal>

            {/* SECTION G: NEARBY EXPERIENCES */}
            <Reveal delay={0.08}>
              <div className="glass" style={{ padding: '24px', borderRadius: 'var(--r-lg)' }}>
                <span className="eyebrow">Circuit Concept</span>
                <h3 style={{ fontSize: '1.25rem', marginTop: 4, marginBottom: 6, color: 'var(--ink)' }}>
                  Waterfall → Nearby Experience → Complete Trip
                </h3>
                <p style={{ fontSize: '0.86rem', color: 'var(--ink-muted)', marginBottom: 14 }}>
                  Extend your waterfall visit into a rewarding regional circuit of tribal crafts, authentic food, and scenic nature.
                </p>

                <div className="stack" style={{ gap: 10 }}>
                  {wf.nearbyExperiences.map((exp, i) => (
                    <div key={i} className="ibox">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 2 }}>
                        <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>
                          {exp.type}
                        </span>
                        <span style={{ fontSize: '0.76rem', color: 'var(--ink-muted)' }}>{exp.dist}</span>
                      </div>
                      <strong style={{ fontSize: '0.96rem', color: 'var(--ink)' }}>{exp.name}</strong>
                      <p style={{ fontSize: '0.84rem', color: 'var(--ink-soft)', marginTop: 2, lineHeight: 1.45 }}>
                        {exp.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* SECTION H: RESPONSIBLE TOURISM */}
            <Reveal delay={0.1}>
              <div className="glass" style={{ padding: '24px', borderRadius: 'var(--r-lg)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <IconLeaf style={{ color: 'var(--primary)' }} />
                  <h3 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--ink)' }}>Travel Responsibly</h3>
                </div>
                
                <ul style={{ paddingLeft: 18, fontSize: '0.86rem', color: 'var(--ink-soft)', lineHeight: 1.7 }}>
                  {wf.responsibleTourism.map((rule, idx) => (
                    <li key={idx} style={{ marginBottom: 4 }}>{rule}</li>
                  ))}
                </ul>
              </div>
            </Reveal>

            {/* QUICK ACTIONS PANEL */}
            <Reveal delay={0.12}>
              <div className="glass" style={{ padding: '20px 24px', borderRadius: 'var(--r-lg)', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button
                  onClick={() => {
                    addWaterfallToScheduler(wf)
                    setIsAdded(true)
                    setToastMsg('✓ Added to My Trip Plan: ' + wf.name)
                    setTimeout(() => setToastMsg(null), 2500)
                  }}
                  className={`btn ${isAdded ? 'secondary' : 'primary'}`}
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  <span>{isAdded ? '✓ Added to My Trip Plan' : '+ Add to My Trip Plan'}</span>
                </button>
                <Link to="/" className="btn outline" style={{ flex: 1, justifyContent: 'center' }}>
                  <IconArrowLeft /> All Waterfalls
                </Link>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(wf.routeInfo.mapQuery)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn outline"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Open Route Map <IconArrow />
                </a>
              </div>
            </Reveal>

            {/* In-page Toast Notification */}
            {toastMsg && (
              <div style={{
                position: 'fixed',
                bottom: 24,
                right: 24,
                zIndex: 9999,
                padding: '12px 20px',
                borderRadius: '16px',
                background: '#163B27',
                color: '#F8FAF4',
                fontSize: 13,
                fontWeight: 600,
                boxShadow: '0 12px 30px rgba(22,59,39,0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                border: '1px solid rgba(76,154,69,0.4)'
              }}>
                <span>🌿</span>
                <span>{toastMsg}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* EXPLORE OTHER WATERFALLS ROW */}
      <section className="section" style={{ paddingTop: 20 }}>
        <div className="wrap">
          <Reveal>
            <div style={{ marginBottom: 20 }}>
              <span className="eyebrow">Keep Exploring</span>
              <h2 style={{ fontSize: '1.6rem', color: 'var(--ink)' }}>Other offbeat waterfalls <em style={{ color: 'var(--accent)' }}>in Jharkhand</em></h2>
            </div>
            <div className="dest-grid">
              {otherFalls.map((other, idx) => (
                <div key={other.id} className="dest-col-4">
                  <article className="dcard enhanced-card" style={{ padding: 18 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span className="tag aqua" style={{ fontSize: '0.72rem' }}>{other.category.split('/')[0]}</span>
                      <span className={`tag ${other.safetyBadge === 'safe' ? 'safe' : 'caution'}`} style={{ fontSize: '0.72rem' }}>
                        {other.safetyLabel.split(' ')[0]} {other.safetyBadge === 'safe' ? 'Suitable' : 'Caution'}
                      </span>
                    </div>
                    <h4 style={{ fontSize: '1.15rem', marginBottom: 4, color: 'var(--ink)' }}>{other.name}</h4>
                    <p style={{ fontSize: '0.82rem', color: 'var(--ink-muted)', marginBottom: 12 }}>{other.district} district</p>
                    <Link to={`/${other.id}`} className="btn small" style={{ width: '100%', justifyContent: 'center' }}>
                      View Brief <IconArrow />
                    </Link>
                  </article>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </PageWrap>
  )
}
