import { Link } from 'react-router-dom'
import PageWrap from '../components/PageWrap'
import Reveal from '../components/Reveal'
import { IconArrow } from '../components/icons'

const PRINCIPLES = [
  { num: '01', title: 'Leave No Trace', desc: 'Carry back all non-biodegradable waste, food wrappers, and plastic bottles to designated town disposal bins.' },
  { num: '02', title: 'Zero Water Pollution', desc: 'Never use synthetic soaps, shampoos, or wash vehicles in natural forest riverbeds and plunge pools.' },
  { num: '03', title: 'Respect Wildlife & Sacred Groves', desc: 'Keep noise levels minimal. Do not play loudspeakers near sacred groves (Sarna Sthal) or forest wildlife corridors.' },
  { num: '04', title: 'Support Local Livelihoods', desc: 'Engage local village guides and purchase authentic regional produce (lac crafts, bamboo items, raw honey) directly from village families.' },
  { num: '05', title: 'Respect Tribal Culture', desc: 'Always ask permission before photographing village elders, sacred community markers, or tribal homes.' },
  { num: '06', title: 'Stay on Established Paths', desc: 'Avoid carving new dirt tracks through dense undergrowth to prevent soil erosion and disturbance to ground fauna.' }
]

export default function ResponsibleTravel() {
  return (
    <PageWrap>
      <section className="page-hero detail-mist-hero">
        <div className="wrap">
          <Reveal>
            <div className="breadcrumb">
              <Link to="/">Home</Link> / <span>Responsible Travel</span>
            </div>
            <span className="eyebrow">Eco-Tourism Ethics</span>
            <h1 style={{ fontSize: '2.8rem', fontWeight: 800, color: 'var(--ink)', lineHeight: 1.15, marginTop: 10, marginBottom: 14 }}>
              Preserving Jharkhand’s <em style={{ color: 'var(--accent)' }}>Hidden Waters.</em>
            </h1>
            <p style={{ fontSize: '1.15rem', color: 'var(--ink-soft)', lineHeight: 1.7, maxWidth: 880 }}>
              When exploring offbeat and pristine waterfalls, our presence impacts fragile riparian ecosystems,
              forest wildlife, and local indigenous communities. Follow these 6 principles for thoughtful eco-travel.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 16 }}>
        <div className="wrap">
          <div className="dest-grid">
            {PRINCIPLES.map((item, idx) => (
              <div key={item.num} className="dest-col-4">
                <Reveal delay={idx * 0.05}>
                  <div className="glass dcard enhanced-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                    <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)', opacity: 0.85 }}>{item.num}</span>
                    <h3 style={{ fontSize: '1.25rem', marginTop: 10, marginBottom: 10, color: 'var(--ink)' }}>{item.title}</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--ink-soft)', lineHeight: 1.6 }}>{item.desc}</p>
                  </div>
                </Reveal>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 44, textAlign: 'center' }}>
            <Link to="/" className="btn hero-primary-btn" style={{ padding: '12px 28px' }}>
              Explore Featured Waterfalls <IconArrow />
            </Link>
          </div>
        </div>
      </section>
    </PageWrap>
  )
}
