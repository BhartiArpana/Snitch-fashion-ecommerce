import axios from 'axios'

const authApiInstance = axios.create({
    baseURL:'/api/auth',
    withCredentials:true
})

export const register = async({fullname,email, contact,password,isSeller})=>{
   const response = await authApiInstance.post('/register',{fullname,email,contact,password,isSeller})
   console.log(response);
   
   return response.data
}

export const login = async({email,password})=>{
    const response = await authApiInstance.post('/login',{email,password})
    return response.data
}