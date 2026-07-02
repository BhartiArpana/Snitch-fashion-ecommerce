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
            Already have an account? <a href="/login">Log in</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;