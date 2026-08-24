import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import PageWrap from '../components/PageWrap'
import Reveal from '../components/Reveal'
import WaterDropHero from '../components/WaterDropHero'
import InteractiveMap from '../components/InteractiveMap'
import { WATERFALLS } from '../data/waterfalls'
import { isWaterfallInScheduler, addWaterfallToScheduler, getSchedulerItems } from '../utils/scheduler'
import { IconArrow, IconPin } from '../components/icons'

const FILTER_OPTIONS = [
  { id: 'all', label: 'All Waterfalls (6)' },
  { id: 'suitable', label: '🟢 Suitable / Normal' },
  { id: 'caution', label: '🟡 Caution' },
  { id: 'easy', label: 'Easy Access' },
  { id: 'moderate', label: 'Moderate' },
]

export default function Home() {
  const [filter, setFilter] = useState('all')
  const [schedulerStatus, setSchedulerStatus] = useState({})
  const [toastMessage, setToastMessage] = useState(null)

  useEffect(() => {
    const syncStatus = () => {
      const statusMap = {}
      WATERFALLS.forEach(w => {
        statusMap[w.id] = isWaterfallInScheduler(w.id)
      })
      setSchedulerStatus(statusMap)
    }
    syncStatus()
    window.addEventListener('storage', syncStatus)
    window.addEventListener('schedulerUpdated', syncStatus)
    return () => {
      window.removeEventListener('storage', syncStatus)
      window.removeEventListener('schedulerUpdated', syncStatus)
    }
  }, [])

  const handleAddToScheduler = (waterfall) => {
    addWaterfallToScheduler(waterfall)
    setSchedulerStatus(prev => ({ ...prev, [waterfall.id]: true }))
    setToastMessage('✓ Added to My Trip Plan: ' + waterfall.name)
    setTimeout(() => setToastMessage(null), 2500)
  }

  const list = useMemo(() => {
    if (filter === 'all') return WATERFALLS
    if (filter === 'suitable') return WATERFALLS.filter(w => w.safetyStatus === 'suitable')
    if (filter === 'caution') return WATERFALLS.filter(w => w.safetyStatus === 'caution')
    if (filter === 'easy') return WATERFALLS.filter(w => w.accessibilityCategory === 'easy')
    if (filter === 'moderate') return WATERFALLS.filter(w => w.accessibilityCategory === 'moderate')
    return WATERFALLS
  }, [filter])

  return (
    <PageWrap>
      {/* 1. CINEMATIC WATER DROP HERO EXPERIENCE */}
      <WaterDropHero />

      {/* 2. REAL INTERACTIVE GEOGRAPHIC MAP SECTION */}
      <section className="section" id="map" style={{ paddingTop: 20, paddingBottom: 36 }}>
        <div className="wrap">
          <Reveal>
            <div style={{ marginBottom: 20 }}>
              <span className="eyebrow">Interactive Geographic Map</span>
              <h2 style={{ fontSize: '1.95rem', color: 'var(--ink)' }}>
                Locate offbeat waterfalls <em style={{ color: 'var(--accent)' }}>across Jharkhand districts.</em>
              </h2>
              <p style={{ color: 'var(--ink-soft)', maxWidth: 780, marginTop: 4, fontSize: '1.02rem' }}>
                Explore real waterfall locations and nearby medical emergency facilities across the Jharkhand terrain.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <InteractiveMap filter={filter} />
            <p style={{ fontSize: '0.82rem', color: 'var(--ink-muted)', marginTop: 14, fontStyle: 'italic', textAlign: 'center' }}>
              Map information is intended for prototype planning. Trail conditions, weather, water levels and medical availability can change. Verify local conditions before travel.
            </p>
          </Reveal>
        </div>
      </section>

      {/* 3. DISCOVERY CARDS SECTION (EXACTLY 6 WATERFALLS) */}
      <section className="section" id="discovery" style={{ paddingTop: 16 }}>
        <div className="wrap">
          <Reveal>
            <div style={{ marginBottom: 20 }}>
              <span className="eyebrow">Featured Waterfall Collection</span>
              <h2 style={{ fontSize: '1.95rem', color: 'var(--ink)' }}>
                Select a waterfall <em style={{ color: 'var(--accent)' }}>for complete safety clarity.</em>
              </h2>
            </div>

            {/* Filter Chips */}
            <div className="filter-chips" style={{ marginBottom: 28 }}>
              {FILTER_OPTIONS.map((f) => (
                <button
                  key={f.id}
                  className={`chip ${filter === f.id ? 'active' : ''}`}
                  onClick={() => setFilter(f.id)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </Reveal>

          <div className="dest-grid">
            <AnimatePresence mode="popLayout">
              {list.map((w, i) => (
                <motion.div
                  key={w.id}
                  className="dest-col-6"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                >
                  <article className="dcard enhanced-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <span className="tag aqua">
                          {w.category}
                        </span>
                        <span className={`tag ${w.safetyBadge === 'safe' ? 'safe' : 'caution'}`}>{w.safetyLabel}</span>
                      </div>

                      {/* Waterfall Card Image with Soft Zoom Effect */}
                      <div className="card-image-wrap">
                        <img
                          src={w.image}
                          alt={w.name}
                          className="card-photo"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            if (e.target.nextElementSibling) e.target.nextElementSibling.style.display = 'flex';
                          }}
                        />
                        <div className="card-fallback">
                          {w.name} · {w.district} District
                        </div>
                        <div className="card-badge-row">
                          <span className="card-district-pill">
                            {w.district} District
                          </span>
                          <span className="card-access-pill">
                            {w.accessibilityLevel}
                          </span>
                        </div>
                      </div>

                      <h3 style={{ fontSize: '1.45rem', marginBottom: 4, color: 'var(--ink)' }}>{w.name}</h3>
                      <div style={{ marginBottom: 10, color: 'var(--ink-muted)', fontSize: '0.88rem' }}>
                        <IconPin style={{ display: 'inline', verticalAlign: '-2px', marginRight: 4, color: '#35B9A5' }} />
                        {w.nearbyTown}
                      </div>

                      <p style={{ fontSize: '0.94rem', color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: 16 }}>
                        {w.shortDesc}
                      </p>

                      <div className="ibox" style={{ marginBottom: 14 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                          <div>
                            <span style={{ color: 'var(--ink-muted)', display: 'block', fontSize: '0.76rem' }}>Accessibility</span>
                            <strong style={{ color: 'var(--ink)' }}>{w.accessibilityLevel}</strong>
                          </div>
                          <div>
                            <span style={{ color: 'var(--ink-muted)', display: 'block', fontSize: '0.76rem' }}>Best Season</span>
                            <strong style={{ color: 'var(--ink)' }}>{w.bestSeason.recommended.split(' ')[0]} to {w.bestSeason.recommended.split(' ')[2]}</strong>
                          </div>
                        </div>
                      </div>

                      <div style={{ fontSize: '0.84rem', marginBottom: 16, lineHeight: 1.5, color: 'var(--ink-soft)', background: 'var(--white)', padding: '10px 12px', borderRadius: 'var(--r-sm)', border: '1px solid var(--border-color)' }}>
                        <strong style={{ color: 'var(--primary)' }}>Safety Context:</strong> {w.safetyNote}
                      </div>
                    </div>

                    <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <Link
                        to={`/${w.id}`}
                        className="btn card-action-btn"
                        style={{ width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: 6 }}
                      >
                        Explore Details <IconArrow className="btn-arrow" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleAddToScheduler(w)}
                        className={`btn-add-scheduler ${schedulerStatus[w.id] ? 'added' : ''}`}
                      >
                        {schedulerStatus[w.id] ? '✓ Added to Scheduler' : 'Add to Scheduler +'}
                      </button>
                    </div>
                  </article>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="proof glass" style={{ marginTop: 40 }}>
            <div className="proof-icon">✓</div>
            <p>
              <strong>Source-Based Prototype:</strong> This platform avoids permanent "safe" labels. Natural waterfalls vary dynamically with seasonal rain and river flow. Always check weather advisories before stepping near water.
            </p>
          </div>
        </div>
      </section>
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="toast-container"
          >
            <div className="scheduler-toast">
              {toastMessage}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrap>
  )
}