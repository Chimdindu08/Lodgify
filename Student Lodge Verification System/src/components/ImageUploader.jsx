import { useRef } from 'react'
import './ImageUploader.css'

export default function ImageUploader({ photos, setPhotos, showToast }) {
  const inputRef = useRef(null)

  const handleFiles = (files) => {
    const arr = Array.from(files)

    if (photos.length + arr.length > 6) {
      showToast('Maximum 6 photos allowed', 'error')
      return
    }

    arr.forEach(file => {
      if (!file.type.startsWith('image/')) {
        showToast('Only image files are allowed', 'error')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        showToast(`${file.name} exceeds 5MB limit`, 'error')
        return
      }
      const reader = new FileReader()
      reader.onload = (e) => {
        setPhotos(prev => [...prev, { url: e.target.result, name: file.name }])
      }
      reader.readAsDataURL(file)
    })
  }

  const removePhoto = (index) => {
    setPhotos(prev => prev.filter((_, i) => i !== index))
  }

  const openPicker = () => {
    if (inputRef.current) inputRef.current.click()
  }

  return (
    <div className="uploader">
      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* Drop zone */}
      <div
        className="uploader__zone"
        onClick={openPicker}
        onDragOver={(e) => {
          e.preventDefault()
          e.currentTarget.classList.add('uploader__zone--drag')
        }}
        onDragLeave={(e) => {
          e.currentTarget.classList.remove('uploader__zone--drag')
        }}
        onDrop={(e) => {
          e.preventDefault()
          e.currentTarget.classList.remove('uploader__zone--drag')
          handleFiles(e.dataTransfer.files)
        }}
        style={{
          opacity: photos.length >= 6 ? 0.6 : 1,
          cursor: photos.length >= 6 ? 'not-allowed' : 'pointer'
        }}
      >
        <span className="uploader__icon">📷</span>
        <p className="uploader__title">
          {photos.length >= 6
            ? 'Maximum 6 photos reached'
            : 'Click or drag to upload photos'}
        </p>
        <p className="uploader__sub">
          JPG, PNG · Max 5MB each · Up to 6 photos
        </p>
      </div>

      {/* Previews */}
      {photos.length > 0 && (
        <div className="uploader__previews">
          <p className="uploader__count">
            {photos.length} / 6 photos added
          </p>
          <div className="uploader__grid">
            {photos.map((p, i) => (
              <div key={i} className="uploader__thumb">
                <img src={p.url} alt={`Upload ${i + 1}`} />
                {i === 0 && (
                  <span className="uploader__cover">COVER</span>
                )}
                <button
                  className="uploader__remove"
                  onClick={(e) => {
                    e.stopPropagation()
                    removePhoto(i)
                  }}
                >×</button>
              </div>
            ))}

            {photos.length < 6 && (
              <button
                className="uploader__add"
                onClick={openPicker}
              >
                <span>+</span>
                <span>Add photo</span>
              </button>
            )}
          </div>
          <p className="uploader__tip">
            💡 First photo is the cover image shown on the lodge card.
          </p>
        </div>
      )}
    </div>
  )
}