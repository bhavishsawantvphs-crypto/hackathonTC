import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import Atmosphere from './components/Atmosphere'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import WaterfallDetail from './pages/WaterfallDetail'
import ResponsibleTravel from './pages/ResponsibleTravel'
import NotFound from './pages/NotFound'

export default function App() {
  const location = useLocation()
  return (
    <>
      <Atmosphere />
      <ScrollToTop />
      <Navbar />
      <div key={location.pathname}>
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/index.html" element={<Navigate to="/" replace />} />
          <Route path="/responsible-travel" element={<ResponsibleTravel />} />
          <Route path="/waterfall/:id" element={<WaterfallDetail />} />
          <Route path="/:id" element={<WaterfallDetail />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
      <Footer />
    </>
  )
}
