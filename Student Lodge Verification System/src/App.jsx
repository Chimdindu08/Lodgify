import { useState } from 'react'
import Navbar    from './components/Navbar'
import Footer    from './components/Footer'
import Toast     from './components/Toast'
import HomePage   from './pages/HomePage'
import BrowsePage from './pages/BrowsePage'
import DetailPage from './pages/DetailPage'
import SubmitPage from './pages/SubmitPage'
import LoginPage  from './pages/LoginPage'
import AdminPage  from './pages/AdminPage'
import { LODGES } from './data/lodges'

export default function App() {
  const [page,   setPage]   = useState('home')
  const [lodge,  setLodge]  = useState(null)
  const [toast,  setToast]  = useState(null)

  // All lodges — starts with seed data, grows when students submit
  const [allLodges, setAllLodges] = useState(LODGES)

  // Called from SubmitPage when a student submits a new lodge
  const addLodge = (newLodge) => {
    setAllLodges(prev => [newLodge, ...prev])
  }

  const go = (p, l = null) => {
    setLodge(l)
    setPage(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type, id: Date.now() })
  }

  const pages = {
    home:   <HomePage   go={go} lodges={allLodges} />,
    browse: <BrowsePage go={go} lodges={allLodges} />,
    detail: <DetailPage go={go} lodge={lodge} showToast={showToast} />,
    submit: <SubmitPage go={go} showToast={showToast} addLodge={addLodge} />,
    login:  <LoginPage  go={go} />,
    admin:  <AdminPage  go={go} lodges={allLodges} />,
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh' }}>
      <Navbar page={page} go={go} />

      <main style={{ flex: 1 }} className="page-enter" key={page}>
        {pages[page] || pages.home}
      </main>

      <Footer go={go} />

      {toast && (
        <Toast
          key={toast.id}
          msg={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}