import { Link, useLocation } from 'react-router-dom';
import './Header.css';

export default function Header() {
  const { pathname } = useLocation();

  return (
    <header className="lib-header">
      <Link to="/" className="lib-logo">
        <div className="lib-logo-icon">
          <span /><span /><span />
        </div>
        <span className="lib-logo-text">
          Biblio<em>theca</em>
        </span>
      </Link>
      <nav className="lib-nav">
        <Link to="/"         className={pathname === '/'         ? 'active-link' : ''}>Login</Link>
        <Link to="/register" className={pathname === '/register' ? 'active-link' : ''}>Register</Link>
      </nav>
    </header>
  );
}