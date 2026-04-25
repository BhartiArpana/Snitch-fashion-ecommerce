import { useState } from "react";
import "../styles/register.css";
import ThemeButton from "../../theme/pages/ThemeButton";
import {useAuth} from '../hook/useAuth'
import { useNavigate } from "react-router-dom";

function Register() {
    const {handleRegister} = useAuth()
    const naviagte = useNavigate()
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    contact: "",
    password: "",
    role: "buyer"
  });

  
  
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

 
  

  const handleSubmit = async(e) => {
    e.preventDefault();
    const user = await handleRegister({
        fullname:formData.fullname,
        email:formData.email,
        contact:formData.contact,
        password:formData.password,
       isSeller: formData.role === "seller"? true : false 
    })
   if(user.role ==='seller'){
     naviagte('/seller/dashboard')
   }
   else if(user.role === 'buyer'){
     naviagte('/')
   }
  };

  return (
  <>
  <ThemeButton />
    <div className="register-container">
   
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Create Account</h2>

        <input
          type="text"
          name="fullname"
          placeholder="Full Name"
          value={formData.fullname}        // ✅ binding
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}          // ✅ binding
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="contact"
          placeholder="Contact Number"
          value={formData.contact}        // ✅ binding
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}       // ✅ binding
          onChange={handleChange}
          required
        />

        <select
          name="role"
          value={formData.role}           // ✅ binding
          onChange={handleChange}
        >
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
        </select>

        <button type="submit">Register</button>
      </form>
    </div>
    </>
  );
}

export default Register;