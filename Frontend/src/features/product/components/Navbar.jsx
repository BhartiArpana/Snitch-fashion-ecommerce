import {
  FaLightbulb,
  FaRegLightbulb,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../../theme/state/theme.slice";
import { Link } from "react-router-dom";
import "../styles/navbar.css";
import { CiSearch, CiUser } from "react-icons/ci";

function Navbar() {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.theme);
  const user = useSelector((state)=>state.auth.user)
  // console.log('user ',user);
  

  return (
    <nav className={`navbar ${theme}`}>
      {/* Logo */}
      <Link to="/" className="navbar-logo">
        SNITCH
      </Link>

      {/* Search Bar - Snitch style */}
      <div className="navbar-search">
        <input type="text" placeholder="Search for products, brands and more" />
        <CiSearch className="search-icon" />
      </div>

      {/* Right Icons */}
      <div className="navbar-right">
        {/* Wire + Bulb - wire upar, bulb neeche */}
        <div
          className="theme-toggle-wrapper"
          onClick={() => dispatch(toggleTheme())}
          title="Toggle Theme"
        >
          <div className="wire"></div>
          <div className={`bulb-icon ${theme}`}>
            {theme === "dark" ? (
              <FaRegLightbulb size={20} />
            ) : (
              <FaLightbulb size={20} />
            )}
          </div>
        </div>

        {/* Favorite Icon */}
        <Link to="/favorites" className="nav-icon">
          <img src="/fav.png" alt="favorites" className="fav-icon" />
        </Link>

        {/* Profile - only if user exists */}
        {user && (
          <Link to="/profile" className="nav-icon">
            <CiUser size={24} />
          </Link>
        )}

        {/* login - when no user is logged in */}
        {!user && (
          <Link to="/login" className="nav-icon">
            <button className="login dark">Login</button>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
        
