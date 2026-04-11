import axios from 'axios'

const authApiInstance = axios.create({
    baseURL:'http://localhost:3000',
    withCredentials:true
})

export const register = async(fullname,email, contact,pasaword,isSeller)=>{
   const response = await authApiInstance.post('/api/auth/register',{fullname,email,contact,pasaword,isSeller})
   return response.data
}