import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toggleTheme } from '../../../app/theme.state';
import { setUser } from '../../auth/state/auth.slice';
import { useState, useEffect, useRef } from 'react';
import '../style/navbar.scss';
import { useCart } from '../../cart/hook/useCart';
import { useProduct } from '../hook/useProduct';

function Navbar() {
  const {handleSearchSuggestion} = useProduct()
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const themeMode = useSelector((state) => state.theme.mode);
  const user = useSelector((state) => state.auth.user);
  const {handleGetCart} = useCart()
  const items = useSelector(state=>state.cart.items)
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(()=>{
    handleGetCart()
  },[])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && !event.target.closest('.navbar__toggle-btn')) {
        setIsMobileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Debounced search suggestions
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      const data = await handleSearchSuggestion(searchQuery);
      console.log('data ',data);
      
      setSuggestions(data?.suggestion || []);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      setShowSuggestions(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSuggestionClick = (title) => {
    setSearchQuery(title);
    setShowSuggestions(false);
    navigate(`/search?q=${encodeURIComponent(title)}`);
  };

  const handleLogout = () => {
    dispatch(setUser(null));
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  function handleCardClick(){
     if(!user){
      navigate('/login')
     }
     if(user){
       navigate('/cart')
     }
  }

  return (
    <header className="navbar">
      <div className="navbar__container">
        <div className="navbar__left">
          <button
            className="navbar__toggle-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Navigation"
          >
            {isMobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
          
          <Link to="/" className="navbar__logo">
            SNITCH
          </Link>
        </div>

        {/* Center: Search Bar */}
        <div className="navbar__center">
          <div className={`navbar__search-bar ${isSearchOpen ? 'navbar__search-bar--active' : ''}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search for products, brands and more"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => {
                setIsSearchOpen(true);
                setShowSuggestions(true);
              }}
              onBlur={() => setIsSearchOpen(false)}
              onKeyDown={handleSearchKeyDown}
              className="navbar__search-input"
            />
          </div>

          {showSuggestions && suggestions.length > 0 && (
            <ul className="navbar__search-suggestions">
              {suggestions.map((item) => (
                <li
                  key={item._id}
                  className="navbar__search-suggestion-item"
                  onMouseDown={() => handleSuggestionClick(item.title)}
                >
                  {item.title}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Right Side: Theme, Cart, Login/User */}
        <div className="navbar__right">
          <button
            className="navbar__icon-btn navbar__theme-toggle"
            onClick={() => dispatch(toggleTheme())}
            aria-label="Toggle theme"
            title={themeMode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {themeMode === 'dark' ? (
              <svg className="navbar__sun-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg className="navbar__moon-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
            )}
          </button>

          <button className="navbar__icon-btn navbar__cart-btn" aria-label="Cart" onClick={() => handleCardClick()}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {items?.items?.length > 0 && (
              <span className="navbar__cart-badge">{items.items.length || 0}</span>
            )}
          </button>

          {user ? (
            <div className="navbar__user-container" ref={dropdownRef}>
              <button
                className="navbar__user-trigger"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                aria-haspopup="true"
                aria-expanded={isDropdownOpen}
              >
                <div className="navbar__avatar">
                  {getInitials(user.fullName)}
                </div>
                <span className="navbar__username">{user.fullName}</span>
                <svg className={`navbar__chevron ${isDropdownOpen ? 'navbar__chevron--open' : ''}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {isDropdownOpen && (
                <div className="navbar__dropdown">
                  <div className="navbar__dropdown-header">
                    <span className="navbar__dropdown-name">{user.fullName}</span>
                    <span className="navbar__dropdown-email">{user.email}</span>
                  </div>
                  <hr className="navbar__dropdown-divider" />
                  
                  <Link to="/" className="navbar__dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    My Profile
                  </Link>

                  {user.isSeller && (
                    <Link to="/seller/dashboard" className="navbar__dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <rect x="7" y="7" width="3" height="9" />
                        <rect x="14" y="7" width="3" height="5" />
                      </svg>
                      Seller Panel
                    </Link>
                  )}

                  <hr className="navbar__dropdown-divider" />
                  <button className="navbar__dropdown-item navbar__dropdown-item--logout" onClick={handleLogout}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="navbar__login-btn">
              LOG IN
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Drawer/Menu */}
      <div ref={mobileMenuRef} className={`navbar__mobile-menu ${isMobileMenuOpen ? 'navbar__mobile-menu--open' : ''}`}>
        <div className="navbar__mobile-nav">
          <Link to="/" className="navbar__mobile-link" onClick={() => setIsMobileMenuOpen(false)}>NEW ARRIVALS</Link>
          <Link to="/" className="navbar__mobile-link" onClick={() => setIsMobileMenuOpen(false)}>MOST WANTED</Link>
          <Link to="/" className="navbar__mobile-link" onClick={() => setIsMobileMenuOpen(false)}>CLOTHING</Link>
          <Link to="/" className="navbar__mobile-link" onClick={() => setIsMobileMenuOpen(false)}>TRENDING</Link>
          
          <hr className="navbar__mobile-divider" />
          
          {user ? (
            <div className="navbar__mobile-user-info">
              <div className="navbar__mobile-user-details">
                <div className="navbar__avatar">
                  {getInitials(user.fullName)}
                </div>
                <div>
                  <div className="navbar__mobile-username">{user.fullName}</div>
                  <div className="navbar__mobile-email">{user.email}</div>
                </div>
              </div>
              
              {user.isSeller && (
                <Link to="/seller/dashboard" className="navbar__mobile-link navbar__mobile-link--special" onClick={() => setIsMobileMenuOpen(false)}>
                  Seller Dashboard
                </Link>
              )}
              
              <button className="navbar__mobile-logout-btn" onClick={handleLogout}>
                Log Out
              </button>
            </div>
          ) : (
            <Link to="/login" className="navbar__mobile-login-btn" onClick={() => setIsMobileMenuOpen(false)}>
              LOG IN
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;