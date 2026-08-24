import { Link } from 'react-router-dom'
import { IconLeaf } from './icons'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-inner">
          {/* COLUMN 1 */}
          <div>
            <div className="brand" style={{ fontSize: '1.18rem', marginBottom: 14, color: 'var(--white)' }}>
              <IconLeaf style={{ color: 'var(--lime)' }} />
              <span>
                <b style={{ color: 'var(--lime)' }}>Hidden Waterfalls</b> · Jharkhand Eco-Tourism
              </span>
            </div>
            <p style={{ fontSize: '0.88rem', color: '#B2D3C4', lineHeight: 1.65, maxWidth: 440 }}>
              Helping tourists discover offbeat and lesser-known waterfalls across Jharkhand with practical travel and responsible-tourism information.
            </p>
          </div>

          {/* COLUMN 2 */}
          <div>
            <h5 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--white)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Quick Discovery
            </h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.88rem' }}>
              <a href="#discovery" style={{ color: '#DCEFE8', transition: 'color 0.2s' }}>Featured Waterfalls</a>
              <a href="#map" style={{ color: '#DCEFE8', transition: 'color 0.2s' }}>Interactive Geographic Map</a>
              <Link to="/responsible-travel" style={{ color: '#DCEFE8', transition: 'color 0.2s' }}>Responsible Travel</Link>
              <a href="../../feedback.html" style={{ color: 'var(--lime)', transition: 'color 0.2s', fontWeight: 600 }}>★ Explorer Feedback &amp; Reviews</a>
            </div>
          </div>

          {/* COLUMN 3 */}
          <div>
            <h5 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--white)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Visitor Helpline
            </h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.88rem', color: '#B2D3C4' }}>
              <span style={{ color: '#FFF', fontWeight: 600 }}>JTDC Toll-Free: 1800-345-6571</span>
              <span>Birsa Munda Airport Info Desk</span>
              <span>Ranchi Railway Station Counter</span>
              <span>Medical CHC &amp; Emergency Support</span>
            </div>
          </div>
        </div>

        {/* BOTTOM ROW */}
        <div className="footer-bottom">
          <span>© 2026 Hidden Waterfalls of Jharkhand · 2-Day Hackathon Prototype</span>
          <span style={{ fontWeight: 600, color: 'var(--lime)' }}>Source-Based Prototype</span>
        </div>
      </div>
    </footer>
  )
}
