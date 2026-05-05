import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import '../styles/TweetForm.css'

export function TweetForm({ onTweetAdded }) {
  const { user } = useAuth()
  const [text, setText] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleImageChange(e) {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!text.trim()) return

    setError('')
    setLoading(true)

    try {
      let imageUrl = null

      if (imageFile) {
        const fileName = `${Date.now()}-${imageFile.name}`
        const { error: uploadError } = await supabase.storage
          .from('tweets-images')
          .upload(fileName, imageFile)

        if (uploadError) throw uploadError

        const { data } = supabase.storage
          .from('tweets-images')
          .getPublicUrl(fileName)
        imageUrl = data.publicUrl
      }

      const { error: insertError } = await supabase
        .from('tweets')
        .insert([
          {
            user_id: user.id,
            text: text.trim(),
            image_url: imageUrl,
          },
        ])

      if (insertError) throw insertError

      setText('')
      setImageFile(null)
      setPreviewUrl('')
      onTweetAdded?.()
    } catch (err) {
      setError(err.message || 'つぶやきの投稿に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="tweet-form" onSubmit={handleSubmit}>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="何が起きてるの？"
        rows="4"
      />
      {previewUrl && (
        <div className="image-preview">
          <img src={previewUrl} alt="preview" />
          <button
            type="button"
            onClick={() => {
              setImageFile(null)
              setPreviewUrl('')
            }}
            className="remove-image"
          >
            ✕
          </button>
        </div>
      )}
      <div className="form-controls">
        <label className="image-upload">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            disabled={loading}
          />
          🖼️ 画像
        </label>
        <button type="submit" disabled={loading || !text.trim()}>
          {loading ? '投稿中...' : 'つぶやく'}
        </button>
      </div>
      {error && <p className="error">{error}</p>}
    </form>
  )
}
