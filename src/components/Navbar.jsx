import { NavLink } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/" className="nav-logo">
        yoonjae<span>.dev</span>
      </NavLink>
      <div className="nav-links">
        <NavLink
          to="/"
          end
          className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
        >
          홈
        </NavLink>
        <NavLink
          to="/projects"
          className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
        >
          프로젝트
        </NavLink>
        <NavLink
          to="/frameworks"
          className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
        >
          Vue vs React
        </NavLink>
      </div>
    </nav>
  )
}
