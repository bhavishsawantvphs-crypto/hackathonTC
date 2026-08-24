import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { WATERFALLS } from '../data/waterfalls'
import { IconArrow, IconPin, IconAlert } from './icons'

// Real Geographic Coordinates for Jharkhand Waterfalls
const GEO_WATERFALLS = [
  {
    ...WATERFALLS.find(w => w.id === 'sita-falls'),
    lat: 23.3614,
    lng: 85.6025
  },
  {
    ...WATERFALLS.find(w => w.id === 'mirchaiya-falls'),
    lat: 23.7025,
    lng: 84.2250
  },
  {
    ...WATERFALLS.find(w => w.id === 'indra-waterfall'),
    lat: 23.799014110082204,
    lng: 84.57010692506162
  },
  {
    ...WATERFALLS.find(w => w.id === 'kanti-waterfalls'),
    lat: 23.59901276328387,
    lng: 84.84311500732223
  },
  {
    ...WATERFALLS.find(w => w.id === 'sugga-bandh-waterfall' || w.id === 'suga-bandh-waterfall'),
    lat: 23.574250346948663,
    lng: 84.10041825389098
  },
  {
    ...WATERFALLS.find(w => w.id === 'hirni-falls'),
    lat: 22.9715,
    lng: 85.3410
  }
].filter(Boolean)

// Real Geographic Coordinates for Nearby Medical Support Facilities
const GEO_MEDICAL = [
  {
    id: 'med-sita',
    waterfallId: 'sita-falls',
    waterfallName: 'Sita Falls',
    name: 'CHC Bundu / Ranchi Medical Centers',
    district: 'Ranchi',
    distance: 'Approx. 15–20 km (Bundu) / 40 km (Ranchi)',
    emergencyNotes: 'Basic first aid at local outposts; emergency ambulance transport reachable via 108.',
    lat: 23.1810,
    lng: 85.5840
  },
  {
    id: 'med-mirchaiya',
    waterfallId: 'mirchaiya-falls',
    waterfallName: 'Mirchaiya Falls',
    name: 'Garu Primary Health Centre (PHC)',
    district: 'Latehar',
    distance: 'Approx. 3 km in Garu block center',
    emergencyNotes: 'Sub-divisional hospital support at Latehar (~38 km); dial 108 for ambulance.',
    lat: 23.7150,
    lng: 84.2120
  },
  {
    id: 'med-indra',
    waterfallId: 'indra-waterfall',
    waterfallName: 'Indra Waterfall',
    name: 'Latehar Sadar Hospital',
    district: 'Latehar',
    distance: 'Approx. 12–16 km from Tubed area',
    emergencyNotes: 'District headquarters 24x7 emergency medical response in Latehar town.',
    lat: 23.7440,
    lng: 84.4980
  },
  {
    id: 'med-kanti',
    waterfallId: 'kanti-waterfalls',
    waterfallName: 'Kanti Waterfalls',
    name: 'Kuru Community Health Centre (CHC)',
    district: 'Latehar / Lohardaga Border',
    distance: 'Approx. 12–18 km from site',
    emergencyNotes: 'Local CHC medical assistance with patient transit to district hospitals.',
    lat: 23.6110,
    lng: 84.8280
  },
  {
    id: 'med-suga',
    waterfallId: 'sugga-bandh-waterfall',
    waterfallName: 'Sugga Bandh Waterfall',
    name: 'Mahuadanr Community Health Centre (CHC)',
    district: 'Latehar',
    distance: 'Approx. 18–22 km via Baresand road',
    emergencyNotes: 'Local forest beat post at Baresand (~6 km); CHC care at Mahuadanr valley.',
    lat: 23.3950,
    lng: 84.1100
  },
  {
    id: 'med-hirni',
    waterfallId: 'hirni-falls',
    waterfallName: 'Hirni Falls',
    name: 'Murhu CHC / Khunti Hospital',
    district: 'West Singhbhum / Khunti',
    distance: 'Approx. 25–35 km along NH75E',
    emergencyNotes: 'Forest beat station & tourist shelter at entrance; CHC care along NH75E highway.',
    lat: 22.9980,
    lng: 85.3150
  }
]

const JHARKHAND_CENTER = [23.45, 84.95]
const INITIAL_ZOOM = 8

export default function InteractiveMap({ filter = 'all', onSelectWaterfall, selectedId }) {
  const mapContainerRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersGroupRef = useRef(null)

  // Layer Toggles
  const [layers, setLayers] = useState({
    waterfalls: true,
    medical: true
  })

  // Selected item state: { type: 'waterfall' | 'medical', data: ... } or null
  const initialWf = GEO_WATERFALLS.find(w => w.id === selectedId) || GEO_WATERFALLS[0]
  const [selectedItem, setSelectedItem] = useState({ type: 'waterfall', data: initialWf })

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: JHARKHAND_CENTER,
        zoom: INITIAL_ZOOM,
        zoomControl: false,
        attributionControl: true,
        minZoom: 7,
        maxZoom: 14
      })

      // Real Geographic OpenStreetMap Tile Layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18
      }).addTo(map)

      const markersGroup = L.layerGroup().addTo(map)
      markersGroupRef.current = markersGroup
      mapInstanceRef.current = map
    }

    return () => {
      // cleanup handled on unmount
    }
  }, [])

  // Render & Update Markers on Map whenever filters, layers, or selected item changes
  useEffect(() => {
    const map = mapInstanceRef.current
    const group = markersGroupRef.current
    if (!map || !group) return

    group.clearLayers()

    // 1. Render Medical Markers if Layer is Active
    if (layers.medical) {
      GEO_MEDICAL.forEach((med) => {
        const isSelected = selectedItem?.type === 'medical' && selectedItem.data.id === med.id

        const iconHtml = `
          <div style="
            display: flex;
            align-items: center;
            gap: 4px;
            background: ${isSelected ? '#D95757' : '#FFFFFF'};
            color: ${isSelected ? '#FFFFFF' : '#D95757'};
            border: 2px solid #D95757;
            padding: 3px 8px;
            border-radius: 999px;
            font-family: 'Poppins', sans-serif;
            font-size: 11px;
            font-weight: 700;
            box-shadow: ${isSelected ? '0 0 0 4px rgba(217,87,87,0.3), 0 4px 12px rgba(0,0,0,0.2)' : '0 2px 8px rgba(0,0,0,0.15)'};
            white-space: nowrap;
            transform: translate(-50%, -50%);
            cursor: pointer;
            transition: all 0.2s ease;
          ">
            <span>🏥</span>
            <span>${med.name.split('/')[0].replace('Community Health Centre', 'CHC').replace('Primary Health Centre', 'PHC').trim()}</span>
          </div>
        `

        const customIcon = L.divIcon({
          html: iconHtml,
          className: 'custom-medical-icon',
          iconSize: [0, 0]
        })

        const marker = L.marker([med.lat, med.lng], { icon: customIcon, zIndexOffset: isSelected ? 800 : 400 })
        marker.on('click', () => {
          const associatedWf = GEO_WATERFALLS.find(w => w.id === med.waterfallId)
          setSelectedItem({ type: 'medical', data: { ...med, waterfall: associatedWf } })
        })
        marker.addTo(group)
      })
    }

    // 2. Render Waterfall Markers if Layer is Active
    if (layers.waterfalls) {
      GEO_WATERFALLS.forEach((wf) => {
        const isSelected = selectedItem?.type === 'waterfall' && selectedItem.data.id === wf.id
        const isMatch = filter === 'all' || 
          (filter === 'suitable' && wf.safetyStatus === 'suitable') ||
          (filter === 'caution' && wf.safetyStatus === 'caution') ||
          (filter === wf.accessibilityCategory) ||
          (filter === wf.categoryKey)

        const iconHtml = `
          <div style="
            display: flex;
            align-items: center;
            gap: 6px;
            background: ${isSelected ? 'var(--primary, #176B45)' : '#FFFFFF'};
            color: ${isSelected ? '#FFFFFF' : '#102D20'};
            border: 2px solid ${isSelected ? '#176B45' : '#35B9A5'};
            padding: 4px 10px;
            border-radius: 999px;
            font-family: 'Poppins', sans-serif;
            font-size: 12px;
            font-weight: 700;
            opacity: ${isMatch ? 1 : 0.35};
            box-shadow: ${isSelected ? '0 0 0 5px rgba(53,185,165,0.35), 0 4px 16px rgba(16,45,32,0.25)' : '0 2px 10px rgba(0,0,0,0.14)'};
            white-space: nowrap;
            transform: translate(-50%, -50%);
            cursor: pointer;
            transition: all 0.2s ease;
          ">
            <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#35B9A5;"></span>
            <span>🌊 ${wf.name.replace(' Falls', '').replace(' Waterfall', '').replace(' Waterfalls', '')}</span>
          </div>
        `

        const customIcon = L.divIcon({
          html: iconHtml,
          className: 'custom-wf-icon',
          iconSize: [0, 0]
        })

        const marker = L.marker([wf.lat, wf.lng], { icon: customIcon, zIndexOffset: isSelected ? 1000 : 500 })
        marker.on('click', () => {
          setSelectedItem({ type: 'waterfall', data: wf })
          if (onSelectWaterfall) onSelectWaterfall(wf)
        })
        marker.addTo(group)
      })
    }
  }, [layers, filter, selectedItem])

  const toggleLayer = (layerKey) => {
    setLayers(prev => ({ ...prev, [layerKey]: !prev[layerKey] }))
  }

  const handleZoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn()
  }

  const handleZoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut()
  }

  const handleResetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(JHARKHAND_CENTER, INITIAL_ZOOM, { animate: true })
    }
  }

  return (
    <div className="explore-layout" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.45fr) minmax(0, 1fr)', gap: 24, alignItems: 'stretch' }}>
      
      {/* REAL GEOGRAPHIC MAP CONTAINER */}
      <div className="map-area glass" style={{ position: 'relative', overflow: 'hidden', minHeight: 510, borderRadius: 'var(--r-lg)', padding: 16, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        
        {/* TOP TOOLBAR: ONLY 2 LAYER TOGGLES & NEAT CORNER CONTROLS */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, zIndex: 1000, marginBottom: 12, position: 'relative' }}>
          
          {/* ONLY 2 Layer Toggles */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={() => toggleLayer('waterfalls')}
              className="chip"
              style={{
                padding: '7px 16px',
                fontSize: '0.84rem',
                fontWeight: 600,
                background: layers.waterfalls ? 'var(--primary)' : 'var(--white)',
                color: layers.waterfalls ? 'var(--white)' : 'var(--ink-muted)',
                borderColor: layers.waterfalls ? 'var(--primary)' : 'var(--border-color)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <span>🌊</span> Waterfalls (6)
            </button>

            <button
              onClick={() => toggleLayer('medical')}
              className="chip"
              style={{
                padding: '7px 16px',
                fontSize: '0.84rem',
                fontWeight: 600,
                background: layers.medical ? '#1F6F78' : 'var(--white)',
                color: layers.medical ? 'var(--white)' : 'var(--ink-muted)',
                borderColor: layers.medical ? '#1F6F78' : 'var(--border-color)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <span>🏥</span> Medical Support
            </button>
          </div>

          {/* Minimal Corner Map Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button
              onClick={handleZoomIn}
              className="btn outline small"
              style={{ padding: '5px 11px', fontSize: '1rem', minWidth: 32, fontWeight: 700 }}
              title="Zoom In"
            >
              +
            </button>
            <button
              onClick={handleZoomOut}
              className="btn outline small"
              style={{ padding: '5px 11px', fontSize: '1rem', minWidth: 32, fontWeight: 700 }}
              title="Zoom Out"
            >
              −
            </button>
            <button
              onClick={handleResetView}
              className="btn outline small"
              style={{ padding: '6px 12px', fontSize: '0.78rem', fontWeight: 600 }}
              title="Reset View to Jharkhand"
            >
              Reset View ↺
            </button>
          </div>
        </div>

        {/* REAL LEAFLET MAP DOM CONTAINER */}
        <div
          ref={mapContainerRef}
          style={{
            width: '100%',
            height: '430px',
            borderRadius: 'var(--r-sm)',
            border: '1px solid var(--border-color)',
            zIndex: 1
          }}
        />

        {/* BOTTOM MAP FOOTER */}
        <div style={{ marginTop: 10, paddingTop: 8, borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, fontSize: '0.78rem', color: 'var(--ink-muted)', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 600, color: 'var(--ink)' }}>Legend:</span>
            <span><strong style={{ color: '#176B45' }}>🌊 Waterfall</strong> (Click to inspect)</span>
            <span><strong style={{ color: '#D95757' }}>🏥 Medical Support</strong> (CHC / PHC)</span>
          </div>
          <div style={{ fontStyle: 'italic' }}>
            Real Geographic Map of Jharkhand
          </div>
        </div>
      </div>

      {/* RIGHT SIDE / MOBILE BOTTOM: SINGLE CLEAN PREVIEW PANEL */}
      <div className="glass" style={{ padding: '24px', borderRadius: 'var(--r-lg)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}>
        <AnimatePresence mode="wait">
          {selectedItem && selectedItem.type === 'waterfall' && (
            <motion.div
              key={'wf-' + selectedItem.data.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                  <span className="tag aqua">
                    🌊 {selectedItem.data.category}
                  </span>
                  <span className={`tag ${selectedItem.data.safetyBadge === 'safe' ? 'safe' : 'caution'}`}>
                    {selectedItem.data.safetyLabel}
                  </span>
                </div>

                {/* Waterfall Thumbnail Image */}
                <div
                  style={{
                    height: 150,
                    borderRadius: 'var(--r-sm)',
                    overflow: 'hidden',
                    marginBottom: 14,
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-card)',
                    position: 'relative'
                  }}
                >
                  <img
                    src={selectedItem.data.image}
                    alt={selectedItem.data.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      if (e.target.nextElementSibling) e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                  <div
                    style={{
                      display: 'none',
                      width: '100%',
                      height: '100%',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'linear-gradient(135deg, rgba(23,107,69,0.15), rgba(53,185,165,0.22))',
                      color: 'var(--ink-muted)',
                      fontSize: '0.84rem',
                      fontWeight: 500,
                      padding: 12,
                      textAlign: 'center'
                    }}
                  >
                    {selectedItem.data.name} · {selectedItem.data.district} District
                  </div>
                </div>

                <h3 style={{ fontSize: '1.45rem', marginBottom: 4, color: 'var(--ink)' }}>{selectedItem.data.name}</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--ink-muted)', marginBottom: 12 }}>
                  <IconPin style={{ display: 'inline', verticalAlign: '-2px', marginRight: 4, color: '#35B9A5' }} />
                  {selectedItem.data.district} District · {selectedItem.data.nearbyTown}
                </p>

                <p style={{ fontSize: '0.92rem', color: 'var(--ink-soft)', lineHeight: 1.55, marginBottom: 14 }}>
                  {selectedItem.data.shortDesc}
                </p>

                {/* Accessibility & Season Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
                  <div className="ibox" style={{ padding: '10px 12px' }}>
                    <div style={{ fontSize: '0.74rem', color: 'var(--ink-muted)' }}>🏃 Accessibility</div>
                    <strong style={{ fontSize: '0.88rem', color: 'var(--ink)' }}>{selectedItem.data.accessibilityLevel}</strong>
                  </div>
                  <div className="ibox" style={{ padding: '10px 12px' }}>
                    <div style={{ fontSize: '0.74rem', color: 'var(--ink-muted)' }}>📅 Best Season</div>
                    <strong style={{ fontSize: '0.88rem', color: 'var(--ink)' }}>{selectedItem.data.bestSeason.recommended.split('(')[0]}</strong>
                  </div>
                </div>

                <div className="ibox" style={{ fontSize: '0.82rem', marginBottom: 14 }}>
                  <strong style={{ color: 'var(--primary)' }}>Approach:</strong> {selectedItem.data.accessibilityDetails.trekRequirement}
                </div>
              </div>

              <div style={{ marginTop: 14 }}>
                <Link
                  to={`/${selectedItem.data.id}`}
                  className="btn"
                  style={{ width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: 8 }}
                >
                  Explore Details →
                </Link>
              </div>
            </motion.div>
          )}

          {selectedItem && selectedItem.type === 'medical' && (
            <motion.div
              key={'med-' + selectedItem.data.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span className="tag" style={{ background: 'rgba(217,87,87,0.15)', color: '#D95757', borderColor: '#D95757' }}>
                    🏥 Nearby Medical Support
                  </span>
                  <button
                    onClick={() => setSelectedItem({ type: 'waterfall', data: selectedItem.data.waterfall || GEO_WATERFALLS[0] })}
                    className="btn ghost small"
                    style={{ fontSize: '0.78rem', color: 'var(--ink-muted)' }}
                  >
                    ✕ Close
                  </button>
                </div>

                <h3 style={{ fontSize: '1.35rem', marginBottom: 4, color: 'var(--ink)' }}>{selectedItem.data.name}</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--ink-muted)', marginBottom: 14 }}>
                  Area: <strong>{selectedItem.data.district}</strong> · Near <strong>{selectedItem.data.waterfallName}</strong>
                </p>

                <div className="stack" style={{ gap: 10, marginBottom: 14 }}>
                  <div className="ibox">
                    <span style={{ fontSize: '0.76rem', color: 'var(--ink-muted)', display: 'block' }}>📍 Distance to Waterfall</span>
                    <strong style={{ fontSize: '0.92rem', color: 'var(--ink)' }}>{selectedItem.data.distance || 'To be verified'}</strong>
                  </div>
                  <div className="ibox">
                    <span style={{ fontSize: '0.76rem', color: 'var(--ink-muted)', display: 'block' }}>🚑 Emergency Protocols &amp; Ambulance</span>
                    <span style={{ fontSize: '0.86rem', color: 'var(--ink-soft)' }}>{selectedItem.data.emergencyNotes || 'Medical information to be verified'}</span>
                  </div>
                </div>

                <div className="flag-box" style={{ background: 'rgba(229,167,47,0.12)', borderColor: 'var(--warning)' }}>
                  <IconAlert />
                  <div style={{ fontSize: '0.78rem', color: 'var(--ink-soft)' }}>
                    <strong>Emergency Helpline:</strong> Dial <strong>108</strong> across Jharkhand for centralized emergency medical response and ambulance dispatch.
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 14 }}>
                {selectedItem.data.waterfall && (
                  <Link
                    to={`/${selectedItem.data.waterfall.id}`}
                    className="btn"
                    style={{ width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: 8 }}
                  >
                    View {selectedItem.data.waterfall.name} Details →
                  </Link>
                )}
              </div>
            </motion.div>
          )}

          {!selectedItem && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: 300, color: 'var(--ink-muted)', textAlign: 'center', padding: 24 }}>
              Select a waterfall or medical support marker on the map to explore its details.
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
