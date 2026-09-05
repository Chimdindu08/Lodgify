import { useState } from 'react'
import './Stars.css'

export default function Stars({ n = 0, size = 14, interactive = false, onSet }) {
  const [hov, setHov] = useState(0)
  return (
    <span className="stars" style={{ '--sz': `${size}px` }}>
      {[1,2,3,4,5].map(i => (
        <span
          key={i}
          className={`star ${i <= (hov || n) ? 'filled' : ''} ${interactive ? 'interactive' : ''}`}
          onClick={() => interactive && onSet && onSet(i)}
          onMouseEnter={() => interactive && setHov(i)}
          onMouseLeave={() => interactive && setHov(0)}
        >★</span>
      ))}
    </span>
  )
}