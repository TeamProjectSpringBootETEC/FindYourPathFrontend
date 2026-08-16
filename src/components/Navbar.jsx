import { NavLink } from 'react-router-dom'

// NavLink (not Link) because it tells us isActive, so we can highlight the current page
function linkClass({ isActive }) {
  return isActive ? 'font-semibold text-violet-600' : 'text-gray-600 hover:text-gray-900'
}

function Navbar() {
  return (
    <nav className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
      <span className="font-bold">MyApp</span>
      <div className="flex gap-5">
        <NavLink to="/" end className={linkClass}>
          Home
        </NavLink>
        <NavLink to="/about" className={linkClass}>
          About
        </NavLink>
        <NavLink to="/contact" className={linkClass}>
          Contact
        </NavLink>
      </div>
    </nav>
  )
}

export default Navbar
