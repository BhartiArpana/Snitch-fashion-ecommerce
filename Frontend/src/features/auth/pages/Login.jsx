import { useState } from "react";
import '../styles/login.css'
import { useAuth } from "../hook/useAuth";
import { Navigate, useNavigate } from "react-router-dom";

function Login() {
    const {handleLogin} = useAuth()
    const navigate = useNavigate()
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    const user = await handleLogin({
        email:form.email,
        password:form.password
    })
    if(user.role === 'seller'){
      navigate('/seller/dashboard')
    }
    else if(user.role === 'buyer')
    navigate('/')
  };

  const handleGoogleLogin = () => {
    window.location.href = "/api/auth/google";
  };

  return (
    <div className="auth-container">
      
      <div className="auth-box">
        <h2>Login</h2>

        {/* Google Login */}
        <button className="google-btn" onClick={handleGoogleLogin}>
          Continue with Google
        </button>

        <div className="divider">OR</div>

        {/* Email Login */}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        {/* Forgot Password */}
        <p className="forgot">
          <a href="/forgot-password">Forgot Password?</a>
        </p>

        {/* Switch to Register */}
        <p className="switch">
          Don’t have an account? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  );
}

export default Login;