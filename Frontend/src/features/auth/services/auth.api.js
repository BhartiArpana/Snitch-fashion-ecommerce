import axios from "axios";

const authApiInstance = axios.create({
    baseURL:'http://localhost:3000',
    withCredentials:true
})

export const register = async({email,fullName,contact,password,isSeller})=>{
      const response = await authApiInstance.post('/api/auth/register',{
        fullName,
        email,
        contact,
        password,
        isSeller
      })
      return response.data
}

export const login =async({email,password})=>{
    try{
        const response = await authApiInstance.post('/api/auth/login',{
            email,
            password
        })
        return response.data
    }catch(err){
        console.log(err);
        
    }
}