import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../../../app/theme.state.js';
import '../style/register.scss';
import {useAuth} from '../hook/useAuth'
import {useNavigate} from 'react-router-dom'

function Register() {
  const dispatch = useDispatch();
  const themeMode = useSelector((state) => state.theme.mode);
  const {handleRegister} = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    contact: '',
    password: '',
    isSeller: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    await handleRegister({
      fullName:formData.fullname,
      email:formData.email,
      contact:formData.contact,
      password:formData.password,
      isSeller:formData.isSeller
    })
    navigate('/')
  };

  return (
    <div className="register-container">
      <div className="theme-toggle" onClick={() => dispatch(toggleTheme())}>
        {themeMode === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
      </div>
      
      <div className="register-card">
        {/* <div className="brand-logo">SNITCH</div> */}
        <h2>Create an Account</h2>
        <p className="subtitle">Join our fashion community</p>

        <form onSubmit={handleSubmit} className="register-form">
          {/* ---- Google OAuth (top) ---- */}
          <button
            type="button"
            className="google-btn"
            onClick={() => window.location.href = '/api/auth/google'}
          >
            <svg className="google-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              <path fill="none" d="M0 0h48v48H0z"/>
            </svg>
            Continue with Google
          </button>

          <div className="divider">
            <span>or</span>
          </div>

          <div className="form-group">
            <label htmlFor="fullname">Full Name</label>
            <input
              type="text"
              id="fullname"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="contact">Contact Number</label>
            <input
              type="tel"
              id="contact"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              placeholder="Enter your contact number"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
            />
          </div>

          <div className="role-selection">
            <div className="checkbox-group">
              <label className={`role-checkbox ${formData.isSeller ? 'active' : ''}`}>
                <input
                  type="checkbox"
                  name="isSeller"
                  checked={formData.isSeller}
                  onChange={handleChange}
                />
                <span className="custom-checkbox"></span>
                Register as Seller
              </label>
            </div>
          </div>

          <button type="submit" className="submit-btn">SIGN UP</button>

          <div className="login-prompt">
            Already have an account? <a href="/login">Sign in</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;