import { useMemo } from 'react'

const LEAF_COUNT = 14

export default function Atmosphere() {
  const leaves = useMemo(() => {
    return Array.from({ length: LEAF_COUNT }).map((_, i) => ({
      id: i,
      left: Math.round(5 + (i * 90 / LEAF_COUNT) + (Math.sin(i * 3.7) * 4)) + '%',
      size: Math.round(12 + (i % 4) * 4),
      duration: (11 + (i % 5) * 2.5) + 's',
      delay: ((i * 1.3) % 12) + 's',
      swayDuration: (3.5 + (i % 3) * 1.2) + 's',
      opacity: 0.35 + (i % 4) * 0.1,
      variant: i % 3
    }))
  }, [])

  return (
    <div className="ambient-forest-wrapper" aria-hidden="true">
      {/* SOFT RADIAL MIST GLOWS */}
      <div className="ambient-mist mist-top-right" />
      <div className="ambient-mist mist-mid-left" />
      <div className="ambient-mist mist-bottom-center" />

      {/* LEFT BOTANICAL VINE BRANCH */}
      <div className="side-vine-container vine-left">
        <svg viewBox="0 0 120 1000" preserveAspectRatio="none" className="botanical-vine-svg">
          <path d="M 20,0 Q 45,150 25,300 T 40,600 T 20,900 L 25,1000" fill="none" stroke="#2F6B3C" strokeWidth="2.5" strokeLinecap="round" opacity="0.65" />
          <g fill="#4C9A45" opacity="0.75">
            <path d="M 28,80 C 45,70 65,85 70,105 C 50,105 35,95 28,80 Z" />
            <path d="M 33,130 C 55,120 75,140 80,165 C 60,160 42,150 33,130 Z" />
            <path d="M 25,230 C 48,220 70,240 76,268 C 55,260 36,250 25,230 Z" />
            <path d="M 28,290 C 52,280 75,302 82,330 C 60,325 40,312 28,290 Z" />
            <path d="M 34,390 C 58,380 80,402 88,432 C 65,425 45,410 34,390 Z" />
            <path d="M 36,460 C 62,450 85,475 92,505 C 70,498 48,482 36,460 Z" />
            <path d="M 38,560 C 65,550 88,575 95,605 C 72,598 50,582 38,560 Z" />
            <path d="M 30,640 C 55,630 78,655 85,685 C 62,678 42,662 30,640 Z" />
            <path d="M 24,740 C 48,730 70,755 78,785 C 55,778 35,762 24,740 Z" />
            <path d="M 22,830 C 45,820 68,845 74,875 C 52,868 32,852 22,830 Z" />
            <path d="M 24,920 C 48,910 70,935 76,965 C 54,958 35,942 24,920 Z" />
          </g>
        </svg>
      </div>

      {/* RIGHT BOTANICAL VINE BRANCH */}
      <div className="side-vine-container vine-right">
        <svg viewBox="0 0 120 1000" preserveAspectRatio="none" className="botanical-vine-svg">
          <path d="M 100,0 Q 75,150 95,300 T 80,600 T 100,900 L 95,1000" fill="none" stroke="#2F6B3C" strokeWidth="2.5" strokeLinecap="round" opacity="0.65" />
          <g fill="#4C9A45" opacity="0.75">
            <path d="M 92,80 C 75,70 55,85 50,105 C 70,105 85,95 92,80 Z" />
            <path d="M 87,130 C 65,120 45,140 40,165 C 60,160 78,150 87,130 Z" />
            <path d="M 95,230 C 72,220 50,240 44,268 C 65,260 84,250 95,230 Z" />
            <path d="M 92,290 C 68,280 45,302 38,330 C 60,325 80,312 92,290 Z" />
            <path d="M 86,390 C 62,380 40,402 32,432 C 55,425 75,410 86,390 Z" />
            <path d="M 84,460 C 58,450 35,475 28,505 C 50,498 72,482 84,460 Z" />
            <path d="M 82,560 C 55,550 32,575 25,605 C 48,598 70,582 82,560 Z" />
            <path d="M 90,640 C 65,630 42,655 35,685 C 58,678 78,662 90,640 Z" />
            <path d="M 96,740 C 72,730 50,755 42,785 C 65,778 85,762 96,740 Z" />
            <path d="M 98,830 C 75,820 52,845 46,875 C 68,868 88,852 98,830 Z" />
            <path d="M 96,920 C 72,910 50,935 44,965 C 66,958 85,942 96,920 Z" />
          </g>
        </svg>
      </div>

      {/* FALLING / DRIFTING LEAVES PARTICLES */}
      <div className="falling-leaves-viewport">
        {leaves.map((leaf) => (
          <div key={leaf.id} className="falling-leaf-track" style={{ left: leaf.left, animationDuration: leaf.duration, animationDelay: leaf.delay }}>
            <div className="falling-leaf-sway" style={{ animationDuration: leaf.swayDuration, opacity: leaf.opacity }}>
              <svg width={leaf.size} height={leaf.size * 1.3} viewBox="0 0 20 26" fill="none">
                {leaf.variant === 0 && <path d="M 10,0 C 18,6 20,18 10,26 C 0,18 2,6 10,0 Z" fill="#4C9A45" />}
                {leaf.variant === 1 && <path d="M 10,0 C 19,8 17,20 10,26 C 3,20 1,8 10,0 Z" fill="#2F6B3C" />}
                {leaf.variant === 2 && <path d="M 10,0 C 16,5 18,16 8,24 C 2,16 4,6 10,0 Z" fill="#6E846F" />}
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}