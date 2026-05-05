import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signUp, signIn } from '../lib/auth'
import '../styles/Login.css'

export function Login() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isSignUp) {
        await signUp(email, password, username)
        setEmail('')
        setPassword('')
        setUsername('')
        setIsSignUp(false)
        setError('アカウントが作成されました。ログインしてください。')
      } else {
        await signIn(email, password)
        navigate('/home')
      }
    } catch (err) {
      setError(err.message || 'エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>X Clone</h1>
        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <input
              type="text"
              placeholder="ユーザー名"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          )}
          <input
            type="email"
            placeholder="メールアドレス"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="パスワード"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? '読込中...' : isSignUp ? 'サインアップ' : 'ログイン'}
          </button>
        </form>
        {error && <p className={isSignUp && error.includes('作成') ? 'success' : 'error'}>{error}</p>}
        <p>
          {isSignUp ? 'アカウント持ってる? ' : 'アカウント持ってない? '}
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="toggle-btn"
          >
            {isSignUp ? 'ログイン' : 'サインアップ'}
          </button>
        </p>
      </div>
    </div>
  )
}
