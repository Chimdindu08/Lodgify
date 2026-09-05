import './Footer.css'

export default function Footer({ go }) {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__top">
          <div className="footer__brand">
            <button className="footer__logo" onClick={() => go('home')}>
              <span>🏠</span> IfiteLodge
            </button>
            <p>The student-powered lodge directory for Nnamdi Azikiwe University, Awka. No agents. Just students.</p>
          </div>

          {[
            ['Browse',    [['All Lodges','browse'],['Top Rated','browse'],['Near Main Gate','browse']]],
            ['Community', [['Submit a Lodge','submit'],['How It Works','home']]],
            ['Info',      [['About','home'],['Privacy Policy','home'],['Contact','home']]],
          ].map(([title, links]) => (
            <div key={title} className="footer__col">
              <h3>{title}</h3>
              <ul>
                {links.map(([label, page]) => (
                  <li key={label}>
                    <button onClick={() => go(page)}>{label}</button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer__bottom">
          <span>© 2025 IfiteLodge · NAU Final Year Project · Computer Science, UNIZIK</span>
          <span>Built for students of Nnamdi Azikiwe University, Awka</span>
        </div>
      </div>
    </footer>
  )
}