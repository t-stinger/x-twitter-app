import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import '../styles/TweetItem.css'

export function TweetItem({ tweet, onDeleted }) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm('このつぶやきを削除しますか？')) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('tweets')
        .delete()
        .eq('id', tweet.id)

      if (error) throw error
      onDeleted?.()
    } catch (err) {
      alert('削除に失敗しました: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const isOwner = user?.id === tweet.user_id
  const createdAt = new Date(tweet.created_at).toLocaleString('ja-JP')

  return (
    <div className="tweet-item">
      <div className="tweet-header">
        <span className="username">{tweet.users?.username || 'ユーザー'}</span>
        <span className="timestamp">{createdAt}</span>
        {isOwner && (
          <button
            onClick={handleDelete}
            disabled={loading}
            className="delete-btn"
            title="削除"
          >
            ✕
          </button>
        )}
      </div>
      <p className="tweet-text">{tweet.text}</p>
      {tweet.image_url && (
        <img src={tweet.image_url} alt="tweet" className="tweet-image" />
      )}
    </div>
  )
}
