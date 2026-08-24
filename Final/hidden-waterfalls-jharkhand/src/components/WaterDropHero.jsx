import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { IconArrow } from './icons'

export default function WaterDropHero() {
  const [animationStage, setAnimationStage] = useState(0)

  useEffect(() => {
    const t1 = setTimeout(() => setAnimationStage(1), 300)
    const t2 = setTimeout(() => setAnimationStage(2), 1200)
    const t3 = setTimeout(() => setAnimationStage(3), 1800)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [])

  return (
    <section className="water-hero-section">
      {/* AMBIENT FOREST & MIST BACKDROP */}
      <div className="hero-mist-backdrop">
        <div className="mist-glow-1" />
        <div className="mist-glow-2" />
        <div className="mist-haze-drift" />
      </div>

      {/* CINEMATIC WATER DROPLET & RIPPLE CANVAS */}
      <div className="water-drop-canvas" aria-hidden="true">
        {/* Falling Realistic Water Droplet */}
        <div className="droplet-container">
          <div className="water-droplet" />
        </div>

        {/* Impact Point & Concentric Ripples */}
        <div className="ripple-origin">
          <div className="water-ripple ripple-1" />
          <div className="water-ripple ripple-2" />
          <div className="water-ripple ripple-3" />
          <div className="ripple-mist-burst" />
        </div>
      </div>

      {/* HERO EDITORIAL CONTENT */}
      <div className="wrap hero-content-wrap">
        <div className="hero-editorial-card">
          
          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.8 }}
            className="hero-eyebrow"
          >
            <span className="eyebrow-dot" />
            <span>OFFBEAT &amp; LESSER-KNOWN DESTINATIONS</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 2.1, ease: [0.16, 1, 0.3, 1] }}
            className="hero-main-title"
          >
            Discover the waterfalls <br />
            <span className="water-gradient-text">most people never find.</span>
          </motion.h1>

          {/* Supporting Paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.4 }}
            className="hero-subtext"
          >
            Explore the lesser-known waterfalls of Jharkhand with practical information on safety, accessibility, medical support, seasons and routes — all in one place.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 2.6 }}
            className="hero-action-row"
          >
            <a href="#discovery" className="btn hero-primary-btn">
              Explore Waterfalls <IconArrow />
            </a>
            <a href="#map" className="btn outline hero-secondary-btn">
              View Interactive Map
            </a>
          </motion.div>

          {/* Clean Feature-Information Strip (Exact Required Text) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 2.9 }}
            className="hero-feature-strip"
          >
            <span>6 Featured Waterfalls</span>
            <span className="strip-dot">·</span>
            <span>Real Geographic Map</span>
            <span className="strip-dot">·</span>
            <span>Medical Support</span>
            <span className="strip-dot">·</span>
            <span>Prototype Eco-Scores</span>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
