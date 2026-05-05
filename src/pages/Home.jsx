import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signOut } from '../lib/auth'
import { useAuth } from '../context/AuthContext'
import { TweetForm } from '../components/TweetForm'
import { TweetList } from '../components/TweetList'
import '../styles/Home.css'

export function Home() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [refreshKey, setRefreshKey] = useState(0)

  async function handleSignOut() {
    try {
      await signOut()
      navigate('/')
    } catch (err) {
      alert('ログアウトに失敗しました: ' + err.message)
    }
  }

  return (
    <div className="home">
      <header className="home-header">
        <h1>X Clone</h1>
        <div className="user-info">
          <span>{user?.email}</span>
          <button onClick={handleSignOut} className="logout-btn">
            ログアウト
          </button>
        </div>
      </header>

      <main className="home-main">
        <section className="feed">
          <TweetForm onTweetAdded={() => setRefreshKey(k => k + 1)} />
          <TweetList refreshTrigger={refreshKey} />
        </section>
      </main>
    </div>
  )
}
