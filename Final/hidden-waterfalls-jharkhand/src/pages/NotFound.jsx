import { Link } from 'react-router-dom'
import PageWrap from '../components/PageWrap'
import { IconArrowLeft } from '../components/icons'

export default function NotFound() {
  return (
    <PageWrap>
      <section className="page-hero" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
        <div className="wrap" style={{ textAlign: 'center', width: '100%' }}>
          <h1 style={{ fontSize: '4rem' }}>404</h1>
          <p style={{ margin: '12px auto 24px' }}>The waterfall or page you are looking for does not exist.</p>
          <Link to="/" className="btn">
            <IconArrowLeft /> Return Home
          </Link>
        </div>
      </section>
    </PageWrap>
  )
}
