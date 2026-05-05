import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { TweetItem } from './TweetItem'
import '../styles/TweetList.css'

export function TweetList({ refreshTrigger }) {
  const [tweets, setTweets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTweets()
  }, [refreshTrigger])

  async function fetchTweets() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('tweets')
        .select('*, users(username)')
        .order('created_at', { ascending: false })

      if (error) throw error
      setTweets(data || [])
    } catch (err) {
      console.error('Failed to fetch tweets:', err)
    } finally {
      setLoading(false)
    }
  }

  function handleTweetDeleted() {
    fetchTweets()
  }

  if (loading) {
    return <div className="loading">読込中...</div>
  }

  return (
    <div className="tweet-list">
      {tweets.length === 0 ? (
        <p className="empty">つぶやきはまだありません</p>
      ) : (
        tweets.map((tweet) => (
          <TweetItem
            key={tweet.id}
            tweet={tweet}
            onDeleted={handleTweetDeleted}
          />
        ))
      )}
    </div>
  )
}
