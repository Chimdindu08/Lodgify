import { useEffect } from 'react'
import './Toast.css'

export default function Toast({ msg, type = 'success', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3400)
    return () => clearTimeout(t)
  }, [onClose])

  return (
    <div className={`toast toast--${type}`}>
      <span>{type === 'error' ? '⚠️' : '✓'}</span>
      <span>{msg}</span>
      <button onClick={onClose}>×</button>
    </div>
  )
}