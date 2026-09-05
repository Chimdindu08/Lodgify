/*export default function LoginPage({ go }) {
  return <div style={{ padding: '60px 40px', textAlign:'center' }}>
    <h2>Login — coming next</h2>
    <button onClick={() => go('home')} style={{ marginTop:16, padding:'10px 24px', background:'#1B3A6B', color:'#fff', borderRadius:10 }}>← Back Home</button>
  </div>
}*/
import { useState } from 'react'
import './LoginPage.css'

export default function LoginPage({ go }) {
  const [mode,  setMode]  = useState('login')
  const [email, setEmail] = useState('')
  const [pass,  setPass]  = useState('')
  const [name,  setName]  = useState('')
  const [level, setLevel] = useState('200 Level')

  return (
    <div className="login">
      <div className="login__card">
        <div className="login__logo">🏠</div>
        <h1 className="login__title">
          {mode === 'login' ? 'Welcome back' : 'Join IfiteLodge'}
        </h1>
        <p className="login__sub">
          {mode === 'login'
            ? 'Sign in to submit reviews and rate lodges'
            : 'Create your free NAU student account'}
        </p>

        {/* Toggle */}
        <div className="login__toggle">
          <button
            className={mode === 'login' ? 'active' : ''}
            onClick={() => setMode('login')}
          >Sign In</button>
          <button
            className={mode === 'register' ? 'active' : ''}
            onClick={() => setMode('register')}
          >Sign Up</button>
        </div>

        <div className="login__form">
          {mode === 'register' && (
            <div className="form-group">
              <label>Full Name</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Chukwuemeka Obi"
                className="form-input"
              />
            </div>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={pass}
              onChange={e => setPass(e.target.value)}
              placeholder="••••••••"
              className="form-input"
            />
          </div>

          {mode === 'register' && (
            <div className="form-group">
              <label>Year of Study</label>
              <select value={level} onChange={e => setLevel(e.target.value)} className="form-input">
                {['100 Level','200 Level','300 Level','400 Level','500 Level','Postgraduate'].map(l => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </div>
          )}

          {mode === 'login' && (
            <div className="login__forgot">
              <a href="#">Forgot password?</a>
            </div>
          )}
        </div>

        <button className="login__submit" onClick={() => go('home')}>
          {mode === 'login' ? 'Sign In →' : 'Create Account →'}
        </button>

        <p className="login__switch">
          {mode === 'login' ? (
            <>No account?{' '}
              <button onClick={() => setMode('register')}>Sign up free</button>
            </>
          ) : (
            <>Already have one?{' '}
              <button onClick={() => setMode('login')}>Sign in</button>
            </>
          )}
        </p>
      </div>
    </div>
  )
}