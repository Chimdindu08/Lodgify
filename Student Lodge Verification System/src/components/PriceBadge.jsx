import { getBand } from '../data/lodges'
import './PriceBadge.css'

export default function PriceBadge({ priceBand }) {
  const b = getBand(priceBand)
  return (
    <span className="price-badge"
      style={{ background: b.color, color: b.text, borderColor: b.border }}>
      💰 {b.label} <span className="price-badge__sub">· {b.desc}</span>
    </span>
  )
}