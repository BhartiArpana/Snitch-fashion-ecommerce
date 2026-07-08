import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../../../app/theme.state';
import '../style/navbar.scss';

function Navbar({ onMenuClick }) {
  const dispatch = useDispatch();
  const themeMode = useSelector((state) => state.theme.mode);

  return (
    <header className="navbar">
      <button
        className="navbar__menu-btn"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      <div className="navbar__title">
        <span>Seller Panel</span>
      </div>

      <div className="navbar__actions">
        <button
          className="navbar__theme-toggle"
          onClick={() => dispatch(toggleTheme())}
          aria-label="Toggle theme"
        >
          {themeMode === 'dark' ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" /></svg>
          )}
        </button>

        <button className="navbar__avatar" aria-label="Account menu">
          <span>S</span>
        </button>
      </div>
    </header>
  );
}

export default Navbar;